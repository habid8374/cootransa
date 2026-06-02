import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Particles() {
  const pts = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      x: Math.sin(i * 137.508 * (Math.PI / 180)) * 3.2,
      y: Math.cos(i * 97.3 * (Math.PI / 180)) * 2.2,
      z: Math.sin(i * 61.8 * (Math.PI / 180)) * 1.4 - 0.5,
      r: 0.022 + (i % 5) * 0.012,
      s: 0.7 + (i % 6) * 0.22,
    })),
  [])

  return (
    <>
      {pts.map((p, i) => (
        <Float key={i} speed={p.s} floatIntensity={1.4} rotationIntensity={0}>
          <mesh position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.r, 6, 6]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={3}
              transparent
              opacity={0.65}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

function BusModel() {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const { scene } = useGLTF('/models/bus.glb')
  const model = useMemo(() => scene.clone(), [scene])

  // Auto-scale so the model fits nicely in the viewport
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(model)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) setScale(3.8 / maxDim)
  }, [model])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      -0.25 + mouse.current.x * 0.38,
      0.04
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.current.y * 0.1,
      0.04
    )
  })

  return (
    <Float speed={1.4} rotationIntensity={0} floatIntensity={0.38}>
      <group ref={groupRef}>
        <Center>
          <primitive object={model} scale={scale} />
        </Center>
      </group>
    </Float>
  )
}

export default function BusScene() {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.6, 5.5], fov: 40 }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.55} />
      <spotLight position={[6, 9, 5]} intensity={2.8} color="#ffffff" penumbra={1} />
      <spotLight position={[-5, 4, -2]} intensity={1.4} color="#22c55e" />
      <pointLight position={[0, -1, 3]} intensity={0.7} color="#86efac" />
      <BusModel />
      <Particles />
      <Environment preset="city" />
    </Canvas>
  )
}

useGLTF.preload('/models/bus.glb')
