import { Component, Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBX, useGLTF } from '@react-three/drei'
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
} from 'three'
import './HeroBackground3D.css'

/**
 * FBX from `src/assets` (bundled URL) takes priority; otherwise `public/models/Jug1.fbx`.
 * Vite must treat `.fbx` as a static asset — see `assetsInclude` in `vite.config.js`.
 */
function publicAssetUrl(relativePath) {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  return `${base}${relativePath.replace(/^\//, '')}`
}

const fbxAssetMap = {
  ...import.meta.glob('../assets/*.fbx', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
  ...import.meta.glob('../assets/*.FBX', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
}
const FBX_FROM_ASSETS = Object.values(fbxAssetMap)[0] ?? null
const HERO_FBX_URL = FBX_FROM_ASSETS || publicAssetUrl('models/Jug1.fbx')
/** Only used if the FBX fails to load (missing file, parse error, etc.) */
const FALLBACK_GLTF_URL = publicAssetUrl('models/duck.glb')

/** Fallback PBR tints when textures are missing (matches cool UI palette). */
const FBX_FALLBACK_COLORS = ['#7eb8e8', '#6aa8d8', '#8dc6ff']

function detachMapsForDispose(material) {
  if (!material) return
  const keys = [
    'map',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'aoMap',
    'emissiveMap',
    'bumpMap',
    'displacementMap',
  ]
  keys.forEach((k) => {
    material[k] = null
  })
}

function disposeMaterial(material) {
  if (!material) return
  detachMapsForDispose(material)
  material.dispose?.()
}

/**
 * FBX often loads as flat gray (missing textures, Phong/Lambert only). Upgrade to MeshStandardMaterial:
 * keep maps when present; otherwise assign a simple PBR material so lighting reads clearly.
 */
function useFbxHeroMaterials(root) {
  useLayoutEffect(() => {
    if (!root) return undefined
    if (root.userData.heroMaterialsNormalized) return undefined
    root.userData.heroMaterialsNormalized = true

    let meshIndex = 0
    root.traverse((obj) => {
      if (!obj.isMesh) return
      obj.frustumCulled = false

      const prev = obj.material
      const list = Array.isArray(prev) ? prev : [prev]
      const next = list.map((old, i) => {
        if (!old) {
          const c = new Color(FBX_FALLBACK_COLORS[meshIndex % FBX_FALLBACK_COLORS.length])
          return new MeshStandardMaterial({
            color: c,
            emissive: c,
            emissiveIntensity: 0.12,
            metalness: 0.12,
            roughness: 0.76,
          })
        }

        const hasVertexColors = Boolean(old.vertexColors)
        const map = old.map
        const hasMap = Boolean(map?.image || map?.source?.data)

        if (hasVertexColors) {
          disposeMaterial(old)
          return new MeshStandardMaterial({
            vertexColors: true,
            color: 0xffffff,
            metalness: 0.08,
            roughness: 0.74,
          })
        }

        if (hasMap) {
          const neo = new MeshStandardMaterial({
            map,
            color: old.color?.clone() ?? new Color(0xffffff),
            roughness:
              typeof old.roughness === 'number' ? old.roughness : 0.68,
            metalness:
              typeof old.metalness === 'number' ? old.metalness : 0.12,
            normalMap: old.normalMap || null,
            aoMap: old.aoMap || null,
            emissiveMap: old.emissiveMap || null,
            emissive: old.emissive?.clone?.() ?? new Color(0x000000),
            emissiveIntensity: old.emissiveIntensity ?? 0,
            transparent: old.transparent,
            opacity: old.opacity ?? 1,
            side: old.side,
          })
          detachMapsForDispose(old)
          old.dispose?.()
          return neo
        }

        disposeMaterial(old)
        const pick =
          FBX_FALLBACK_COLORS[(meshIndex + i) % FBX_FALLBACK_COLORS.length]
        return new MeshStandardMaterial({
          color: new Color(pick),
          emissive: new Color(pick),
          emissiveIntensity: 0.12,
          metalness: 0.1,
          roughness: 0.78,
        })
      })

      obj.material = next.length === 1 ? next[0] : next
      meshIndex += 1
    })

    return undefined
  }, [root])
}

/**
 * Chest-style scenes often have huge floor/wall meshes off the pivot—centering + uniform scale
 * keeps rotation around the visual mass so geometry doesn’t “lunge” into the camera.
 */
function useHeroFbxCenterAndUniformScale(root, targetMax = 2.35) {
  useLayoutEffect(() => {
    if (!root || root.userData.heroFbxLayout) return undefined

    root.updateMatrixWorld(true)
    const box = new Box3().setFromObject(root, true)
    if (box.isEmpty()) {
      root.userData.heroFbxLayout = 'skip-empty-bounds'
      return undefined
    }

    const center = new Vector3()
    const size = new Vector3()
    box.getCenter(center)
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z, 0)
    if (!Number.isFinite(center.x) || !Number.isFinite(maxDim) || maxDim < 1e-8) {
      root.userData.heroFbxLayout = 'skip-bad-bounds'
      return undefined
    }

    root.userData.heroFbxLayout = true
    root.position.sub(center)
    root.scale.setScalar(targetMax / maxDim)

    return undefined
  }, [root, targetMax])
}

/** World-space Y before applying the screen-pixel nudge below. */
const HERO_MODEL_BASE_Y = -0.92
/** Extra downward shift on screen, in CSS pixels (converted via camera + canvas size). */
const HERO_NUDGE_DOWN_PX = 14

function useHeroModelGroupY() {
  const { camera, size } = useThree()
  return useMemo(() => {
    const vFov = (camera.fov * Math.PI) / 180
    const visibleHeight =
      2 * Math.tan(vFov / 2) * Math.abs(camera.position.z)
    const worldUnitsPerPixel = visibleHeight / size.height
    return HERO_MODEL_BASE_Y - HERO_NUDGE_DOWN_PX * worldUnitsPerPixel
  }, [camera.fov, camera.position.z, size.height])
}

function SpinningPrimitive({ object, scale }) {
  const groupRef = useRef(null)
  const y = useHeroModelGroupY()

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.65
  })

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      <primitive object={object} scale={scale} />
    </group>
  )
}

function SpinningFBX({ url }) {
  const fbx = useFBX(url)
  useFbxHeroMaterials(fbx)
  useHeroFbxCenterAndUniformScale(fbx, 2.35)
  return <SpinningPrimitive object={fbx} scale={1.12} />
}

function SpinningGLTF({ url }) {
  const { scene } = useGLTF(url)
  return <SpinningPrimitive object={scene} scale={2.2} />
}

/** Last resort if both FBX and GLB fail (missing file, parse error, etc.) */
function SpinningPlaceholder() {
  const groupRef = useRef(null)
  const y = useHeroModelGroupY()
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.65
  })
  return (
    <group ref={groupRef} position={[0, y, 0]}>
      <mesh>
        <boxGeometry args={[0.85, 1.15, 0.85]} />
        <meshStandardMaterial color="#6b7280" roughness={0.55} metalness={0.15} />
      </mesh>
    </group>
  )
}

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn(
      `[HeroBackground3D] ${this.props.label ?? 'model'} load failed:`,
      error?.message ?? error,
      import.meta.env.DEV ? `(url: ${HERO_FBX_URL})` : '',
    )
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function HeroModel() {
  return (
    <ModelErrorBoundary
      label="FBX"
      fallback={
        <Suspense fallback={null}>
          <ModelErrorBoundary label="GLTF fallback" fallback={<SpinningPlaceholder />}>
            <SpinningGLTF url={FALLBACK_GLTF_URL} />
          </ModelErrorBoundary>
        </Suspense>
      }
    >
      <Suspense fallback={null}>
        <SpinningFBX url={HERO_FBX_URL} />
      </Suspense>
    </ModelErrorBoundary>
  )
}

function Scene() {
  return (
    <>
      {/* Dark-site lighting: soft fill + keyed rim; intensities kept moderate to avoid a flat/washed look */}
      <ambientLight intensity={0.48} />
      <hemisphereLight
        skyColor="#34495e"
        groundColor="#22313f"
        intensity={0.55}
      />
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.05}
        color="#e4f1fe"
        castShadow={false}
      />
      <directionalLight
        position={[-5, 4, -5]}
        intensity={0.38}
        color="#8dc6ff"
        castShadow={false}
      />
      <HeroModel />
    </>
  )
}

/**
 * Full-bleed WebGL layer behind hero copy. Canvas is `pointer-events: none` so nav/links keep working.
 */
export function HeroBackground3D() {
  return (
    <div className="hero__bg-wrap" aria-hidden>
      <div className="hero__canvas">
        <Suspense fallback={null}>
          <Canvas
            className="hero__canvas-gl"
            camera={{ position: [0, 0, 12.5], fov: 46, near: 0.1, far: 120 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'default',
            }}
            onCreated={({ gl }) => {
              gl.outputColorSpace = SRGBColorSpace
              gl.toneMapping = ACESFilmicToneMapping
              gl.toneMappingExposure = 0.98
              if (import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.info('[HeroBackground3D] FBX URL:', HERO_FBX_URL)
              }
            }}
            dpr={[1, 1.75]}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </div>
      <div className="hero__bg-dim" />
    </div>
  )
}
