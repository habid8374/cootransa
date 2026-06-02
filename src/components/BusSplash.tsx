import { useRef, useEffect, useMemo, useState, Suspense, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'
import Brand from './Brand'

const DURATION = 6000

function Particles() {
  const pts = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      x: Math.sin(i * 137.508 * (Math.PI / 180)) * 4.5,
      y: Math.cos(i * 97.3 * (Math.PI / 180)) * 3,
      z: Math.sin(i * 61.8 * (Math.PI / 180)) * 2.2 - 1,
      r: 0.022 + (i % 6) * 0.013,
      s: 0.55 + (i % 7) * 0.2,
    })), []
  )
  return (
    <>
      {pts.map((p, i) => (
        <Float key={i} speed={p.s} floatIntensity={1.6} rotationIntensity={0}>
          <mesh position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.r, 6, 6]} />
            <meshStandardMaterial
              color="#22c55e" emissive="#22c55e" emissiveIntensity={4}
              transparent opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

function BusSpinModel() {
  const groupRef = useRef<THREE.Group>(null)
  const [scale, setScale] = useState(1)
  const { scene } = useGLTF('/models/bus.glb')
  const model = useMemo(() => scene.clone(), [scene])

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(model)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) setScale(5 / maxDim)
  }, [model])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.42
  })

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3}>
      <group ref={groupRef} rotation={[0.07, -0.3, 0]}>
        <Center>
          <primitive object={model} scale={scale} />
        </Center>
      </group>
    </Float>
  )
}

function SplashCanvas() {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.4, 7.5], fov: 42 }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.35} />
      <spotLight position={[8, 12, 6]} intensity={4} color="#ffffff" penumbra={0.8} />
      <spotLight position={[-6, 5, -4]} intensity={2.2} color="#22c55e" />
      <pointLight position={[0, -2, 5]} intensity={1.2} color="#86efac" />
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />
      <BusSpinModel />
      <Particles />
      <Environment preset="night" />
    </Canvas>
  )
}

interface Props { onDone: () => void }

export default function BusSplash({ onDone }: Props) {
  const [exiting, setExiting] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const [progress, setProgress] = useState(0)
  const exitingRef = useRef(false)

  const handleExit = useCallback(() => {
    if (exitingRef.current) return
    exitingRef.current = true
    setExiting(true)
    setTimeout(onDone, 950)
  }, [onDone])

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 1100)
    const t2 = setTimeout(() => setShowBtn(true), 2200)
    const t3 = setTimeout(handleExit, DURATION)
    const start = Date.now()
    const iv = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / DURATION) * 100)
      setProgress(p)
      if (p >= 100) clearInterval(iv)
    }, 32)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(iv) }
  }, [handleExit])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ background: '#060d1a' }}
        >
          {/* Grid sutil */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.04) 1px,transparent 1px)',
            backgroundSize: '50px 50px',
          }}/>

          {/* Glow central */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(34,197,94,0.07) 0%, transparent 70%)',
          }}/>

          {/* Canvas 3D full screen */}
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <SplashCanvas />
            </Suspense>
          </div>

          {/* Botón saltar */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={handleExit}
            className="absolute top-6 right-6 z-20 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
            style={{
              color: 'rgba(148,163,184,0.7)',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'white'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(148,163,184,0.7)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            Saltar →
          </motion.button>

          {/* Overlay inferior: logo + CTA */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center pb-12 gap-5">

            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="flex flex-col items-center gap-3"
                >
                  <Brand iconClass="h-12 sm:h-14" textClass="text-4xl sm:text-5xl" />
                  <p className="text-zinc-400 text-xs sm:text-sm tracking-[0.2em] uppercase font-medium">
                    Pioneros en el transporte del Caribe colombiano
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  onClick={handleExit}
                  className="px-9 py-3.5 rounded-full font-semibold text-white text-sm transition-transform duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg,#16a34a,#22c55e)',
                    boxShadow: '0 0 36px rgba(34,197,94,0.4), 0 8px 24px rgba(34,197,94,0.2)',
                  }}
                >
                  Ingresar al sitio →
                </motion.button>
              )}
            </AnimatePresence>

            {/* Barra de progreso */}
            <div className="w-40 h-px rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg,#16a34a,#22c55e)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

useGLTF.preload('/models/bus.glb')
