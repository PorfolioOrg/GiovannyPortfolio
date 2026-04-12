import { Component, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useFBX, useGLTF } from '@react-three/drei'
import './HeroBackground3D.css'

/**
 * FBX from `src/assets` (bundled URL) takes priority; otherwise `public/models/jug1.fbx`.
 * Vite must treat `.fbx` as a static asset — see `assetsInclude` in `vite.config.js`.
 */
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
const HERO_FBX_URL = FBX_FROM_ASSETS || '/models/jug1.fbx'
const FALLBACK_GLTF_URL = '/models/duck.glb'

function SpinningPrimitive({ object, scale = 1.35 }) {
  const groupRef = useRef(null)

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.65
  })

  return (
    <group ref={groupRef} position={[0, -0.72, 0]}>
      <primitive object={object} scale={scale} />
    </group>
  )
}

function SpinningFBX({ url }) {
  const fbx = useFBX(url)
  return <SpinningPrimitive object={fbx} />
}

function SpinningGLTF({ url }) {
  const { scene } = useGLTF(url)
  return <SpinningPrimitive object={scene} />
}

/** Last resort if both FBX and GLB fail (missing file, parse error, etc.) */
function SpinningPlaceholder() {
  const groupRef = useRef(null)
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.65
  })
  return (
    <group ref={groupRef} position={[0, -0.72, 0]}>
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
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 4]} intensity={1.15} castShadow={false} />
      <directionalLight position={[-4, 2, -6]} intensity={0.35} />
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
            camera={{ position: [0, 0, 5.75], fov: 40, near: 0.1, far: 100 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
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
