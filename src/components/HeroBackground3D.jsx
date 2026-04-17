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
 * On-screen size is driven by uniform bbox scaling + primitive scale.
 * Framing (visibility) is handled with camera z / FOV and CSS layout — not scene-graph Y offsets.
 */
const HERO_FBX_BBOX_TARGET = 2.35
const HERO_ASSET_DISPLAY_SCALE = 4.0
const HERO_FBX_TARGET_MAX = HERO_FBX_BBOX_TARGET * HERO_ASSET_DISPLAY_SCALE
const HERO_FBX_PRIMITIVE_SCALE = 1.05

/** Camera — only lever for framing the bbox-centered model (no root/group Y offsets). */
const HERO_CAMERA_POSITION = Object.freeze([0, 0, 14.75])
const HERO_CAMERA_FOV = 48

/**
 * Centering source of truth: `root.position.sub(center)` + uniform scale to target max bbox size.
 */
function useHeroFbxCenterAndUniformScale(root, targetMax = HERO_FBX_TARGET_MAX) {
  useLayoutEffect(() => {
    if (!root || root.userData.heroFbxLayout) return

    root.userData.heroFbxLayout = true

    root.updateMatrixWorld(true)

    const box = new Box3().setFromObject(root, true)
    const center = new Vector3()
    const size = new Vector3()

    box.getCenter(center)
    box.getSize(size)

    const maxDim = Math.max(size.x, size.y, size.z, 0)
    const scale = targetMax / maxDim

    // reset first (IMPORTANT)
    root.position.set(0, 0, 0)
    root.scale.setScalar(scale)

    root.updateMatrixWorld(true)

    const box2 = new Box3().setFromObject(root, true)
    const center2 = new Vector3()

    box2.getCenter(center2)

    root.position.sub(center2)
  }, [root, targetMax])
}

function SpinningPrimitive({ object, scale }) {
  const groupRef = useRef(null)

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.65
  })

  return (
    <group ref={groupRef}>
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
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.65
  })
  const s = HERO_ASSET_DISPLAY_SCALE
  return (
    <group ref={groupRef}>
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
            camera={{
              position: [...HERO_CAMERA_POSITION],
              fov: HERO_CAMERA_FOV,
              near: 0.1,
              far: 120,
            }}
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
