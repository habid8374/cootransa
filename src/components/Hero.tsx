import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import * as THREE from 'three'

function Particles() {
  const count = 150
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i*3] = (Math.random()-0.5)*20; arr[i*3+1] = (Math.random()-0.5)*20; arr[i*3+2] = (Math.random()-0.5)*10
    }
    return arr
  }, [])
  const pointsRef = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1
    }
  })
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#22c55e" transparent opacity={0.6}/>
    </points>
  )
}

function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null)
  const { positions, count } = useMemo(() => {
    const pts: number[] = []
    const nodes: [number,number,number][] = []
    for (let i = 0; i < 30; i++) nodes.push([(Math.random()-0.5)*16,(Math.random()-0.5)*16,(Math.random()-0.5)*8])
    for (let i = 0; i < nodes.length; i++) for (let j = i+1; j < nodes.length; j++) {
      const [dx,dy,dz] = [nodes[i][0]-nodes[j][0],nodes[i][1]-nodes[j][1],nodes[i][2]-nodes[j][2]]
      if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 5) pts.push(...nodes[i],...nodes[j])
    }
    return { positions: new Float32Array(pts), count: pts.length/3 }
  }, [])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime()*0.015 })
  return (
    <lineSegments ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/></bufferGeometry>
      <lineBasicMaterial color="#7c3aed" transparent opacity={0.2}/>
    </lineSegments>
  )
}

function PulsingSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => { if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime()*1.5)*0.05) })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2,16,16]}/>
      <meshBasicMaterial color="#22c55e" wireframe transparent opacity={0.15}/>
    </mesh>
  )
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => { if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime()*0.03 })
  return (
    <group ref={groupRef}>
      <Particles/><ConnectionLines/><PulsingSphere/>
      <ambientLight intensity={0.5}/>
    </group>
  )
}

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25,0.46,0.45,0.94] } } }

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src="/assets/video/hero.mp4"/>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1E]/90 via-[#0A0F1E]/70 to-transparent z-10"/>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-transparent to-[#0A0F1E]/30 z-10"/>
      <div className="absolute inset-0 z-20 pointer-events-none">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0,0,8], fov: 60 }}><Scene/></Canvas>
        </Suspense>
      </div>
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              Movilidad · Confianza · Tecnología
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-7xl sm:text-8xl lg:text-9xl font-black font-display tracking-tighter leading-none mb-4">
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-purple-400 bg-clip-text text-transparent">COOTRANSA</span>
          </motion.h1>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-semibold text-white mb-4 leading-tight">
            Conectamos personas, empresas<br/><span className="text-zinc-300">y territorios.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed">
            Más de 50 años impulsando el desarrollo regional del Caribe colombiano. Flota renovada, monitoreo satelital, calidad certificada ISO.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <a href="#contacto" className="px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold text-base shadow-xl shadow-green-900/40 hover:scale-105 transition-all duration-200">Solicitar Servicio</a>
            <a href="#rutas" className="px-8 py-4 rounded-full border-2 border-white/30 hover:border-green-400 text-white font-semibold text-base hover:bg-white/5 transition-all duration-200 backdrop-blur-sm">Ver Rutas</a>
          </motion.div>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0,8,0] }} transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}>
        <span className="text-zinc-400 text-xs tracking-widest uppercase">Explorar</span>
        <ChevronDown className="text-green-400" size={20}/>
      </motion.div>
    </div>
  )
}
