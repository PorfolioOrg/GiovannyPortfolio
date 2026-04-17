import { Component, Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useFBX, useGLTF } from '@react-three/drei'
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  MeshStandardMaterial,
  PMREMGenerator,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import {
  applyWayfinderPbrToFbxRoot,
  getWayfinderHeroTextureUrls,
  splitWayfinderTextureArray,
} from '../lib/heroWayfinderPbr'
import './HeroBackground3D.css'

/**
 * FBX from `src/assets` (bundled URL) takes priority; otherwise `public/models/Wayfinder.fbx`.
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
const HERO_FBX_URL = FBX_FROM_ASSETS || publicAssetUrl('models/Wayfinder.fbx')
/** Only used if the FBX fails to load (missing file, parse error, etc.) */
const FALLBACK_GLTF_URL = publicAssetUrl('models/duck.glb')

function useHeroWayfinderTextureSets() {
  const urls = useMemo(() => getWayfinderHeroTextureUrls(), [])
  const loaded = useLoader(TextureLoader, urls)
  return useMemo(() => splitWayfinderTextureArray(loaded), [loaded])
}

function useApplyWayfinderPbr(fbx, textureSets) {
  useLayoutEffect(() => {
    if (!fbx || !textureSets?.pendant?.map) return undefined
    applyWayfinderPbrToFbxRoot(fbx, textureSets)
    return undefined
  }, [fbx, textureSets])
}

/**
 * Hero mesh on-screen size (after centering) is mainly:
 * - `useHeroFbxCenterAndUniformScale(..., targetMax)` — largest bbox axis in world units
 * - `SpinningFBX` → `<primitive scale={...} />` — extra multiplier on that root
 * Camera `position.z` / `fov` also change how large it reads.
 */
const HERO_FBX_BBOX_TARGET = 2.35
const HERO_ASSET_DISPLAY_SCALE = 4.0
const HERO_FBX_TARGET_MAX = HERO_FBX_BBOX_TARGET * HERO_ASSET_DISPLAY_SCALE
const HERO_FBX_PRIMITIVE_SCALE = 1.12

/**
 * Chest-style scenes often have huge floor/wall meshes off the pivot—centering + uniform scale
 * keeps rotation around the visual mass so geometry doesn’t “lunge” into the camera.
 */
function useHeroFbxCenterAndUniformScale(root, targetMax = HERO_FBX_TARGET_MAX) {
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

/** World-space Y before applying the screen-pixel nudge below (narrow / stacked hero). */
const HERO_MODEL_BASE_Y = -0.62
/** Extra downward shift: fraction of |HERO_MODEL_BASE_Y| (narrow layouts only). */
const HERO_MODEL_PUSH_DOWN_FRAC = 0.5
/** Extra downward shift on screen, in CSS pixels (converted via camera + canvas size). */
const HERO_NUDGE_DOWN_PX = 12
/** Below this canvas width (px), add lift so the model stays visually centered (portrait heroes read “low”). */
const HERO_NARROW_MAX_WIDTH = 768
/** Matches Hero.css desktop split — copy left, 3D panel right from this width up. */
const HERO_DESKTOP_SPLIT_MIN_WIDTH = 960
/** Nudge model up by this fraction of visible world height (0.05 = 5%). */
const HERO_ASSET_VIEWPORT_LIFT_FRAC = 0.05
/** Desktop: rig bbox is already centered — keep group near Y=0 to match flex-centered hero copy. */
const HERO_DESKTOP_MODEL_BASE_Y = 0
/** Desktop: slight lift so the mesh lines up with the optical center of the padded hero. */
const HERO_DESKTOP_OPTICAL_LIFT_FRAC = 0.028
/**
 * On narrow/tall canvases the same base Y often leaves the mesh clipped at the bottom; nudge up in world units.
 * Scales with portrait ratio so long phones get a bit more lift than squat tablets in portrait.
 */
function heroMobilePortraitLift(widthPx, heightPx) {
  if (widthPx >= HERO_NARROW_MAX_WIDTH) return 0
  const w = Math.max(widthPx, 1)
  const h = Math.max(heightPx, 1)
  const portrait = h / w
  const extra = Math.max(0, portrait - 1.2)
  return 0.62 + Math.min(extra * 0.38, 1.15)
}

function useHeroModelGroupY() {
  const { camera, size } = useThree()
  return useMemo(() => {
    const vFov = (camera.fov * Math.PI) / 180
    const visibleHeight =
      2 * Math.tan(vFov / 2) * Math.abs(camera.position.z)
    const h = Math.max(size.height, 1)
    const worldUnitsPerPixel = visibleHeight / h

    if (size.width >= HERO_DESKTOP_SPLIT_MIN_WIDTH) {
      let y = HERO_DESKTOP_MODEL_BASE_Y
      y += HERO_DESKTOP_OPTICAL_LIFT_FRAC * visibleHeight
      return y
    }

    let y = HERO_MODEL_BASE_Y - HERO_NUDGE_DOWN_PX * worldUnitsPerPixel
    y += heroMobilePortraitLift(size.width, size.height)
    y += HERO_ASSET_VIEWPORT_LIFT_FRAC * visibleHeight
    y -= HERO_MODEL_PUSH_DOWN_FRAC * Math.abs(HERO_MODEL_BASE_Y)
    return y
  }, [camera.fov, camera.position.z, size.height, size.width])
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
  const textureSets = useHeroWayfinderTextureSets()
  useApplyWayfinderPbr(fbx, textureSets)
  useHeroFbxCenterAndUniformScale(fbx, HERO_FBX_TARGET_MAX)
  return <SpinningPrimitive object={fbx} scale={HERO_FBX_PRIMITIVE_SCALE} />
}

function SpinningGLTF({ url }) {
  const { scene } = useGLTF(url)
  return (
    <SpinningPrimitive object={scene} scale={2.2 * HERO_ASSET_DISPLAY_SCALE} />
  )
}

/** Last resort if both FBX and GLB fail (missing file, parse error, etc.) */
function SpinningPlaceholder() {
  const groupRef = useRef(null)
  const y = useHeroModelGroupY()
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.65
  })
  const s = HERO_ASSET_DISPLAY_SCALE
  return (
    <group ref={groupRef} position={[0, y, 0]}>
      <mesh>
        <boxGeometry args={[0.85 * s, 1.15 * s, 0.85 * s]} />
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

/**
 * Subtle indoor IBL for MeshStandard reflections (RoomEnvironment + PMREM).
 * No shadows, single PMREM bake — tuned for a background canvas.
 */
function HeroEnvironmentIbl() {
  const { gl, scene } = useThree()

  useLayoutEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const envScene = new RoomEnvironment()
    const rt = pmrem.fromScene(envScene)
    const prevEnv = scene.environment
    const prevIntensity = scene.environmentIntensity

    scene.environment = rt.texture
    scene.environmentIntensity = 0.72

    return () => {
      scene.environment = prevEnv ?? null
      scene.environmentIntensity = prevIntensity ?? 1
      rt.texture.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])

  return null
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
      <HeroEnvironmentIbl />
      {/* Lit for camera-facing hero FBX (+Z camera): key from same side, fill from left, soft sky/ground. */}
      <ambientLight intensity={0.58} />
      <hemisphereLight
        skyColor="#9a9a9a"
        groundColor="#2a2a2a"
        intensity={0.62}
      />
      {/* Key: above/behind camera toward origin — lights faces you see on screen */}
      <directionalLight
        position={[0.5, 5.5, 13.5]}
        intensity={1.22}
        color="#faf8f5"
        castShadow={false}
      />
      <directionalLight
        position={[-9, 3.5, 6]}
        intensity={0.48}
        color="#dce6f0"
        castShadow={false}
      />
      <directionalLight
        position={[7, 1.5, 4]}
        intensity={0.28}
        color="#e8e4e0"
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
              gl.toneMappingExposure = 0.96
              if (import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.info('[HeroBackground3D] FBX URL:', HERO_FBX_URL)
              }
            }}
            dpr={[1, 1.5]}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </div>
      <div className="hero__bg-dim" />
    </div>
  )
}
