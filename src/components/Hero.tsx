import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Brand from './Brand'
import BusLoader from './BusLoader'

const BusScene = lazy(() => import('./BusScene'))

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/video/hero.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1E]/95 via-[#0A0F1E]/75 to-[#0A0F1E]/25 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-transparent to-[#0A0F1E]/20 z-10" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" style={{ minHeight: '85vh' }}>

          {/* ── Texto ── */}
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-zinc-200">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Movilidad · Confianza · Tecnología
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-8">
              <Brand iconClass="h-20 sm:h-28 lg:h-32" textClass="text-5xl sm:text-6xl lg:text-7xl" tagline taglineClass="text-xs sm:text-sm" />
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-semibold text-white mb-4 leading-tight">
              Conectamos personas, empresas<br />
              <span className="text-zinc-200">y territorios.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-zinc-200 text-lg max-w-xl mb-10 leading-relaxed">
              Más de 50 años impulsando el desarrollo regional del Caribe colombiano.
              Flota renovada, monitoreo satelital, calidad certificada ISO.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a
                href="#contacto"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold text-base shadow-xl shadow-green-900/40 hover:scale-105 transition-all duration-200"
              >
                Solicitar Servicio
              </a>
              <a
                href="#rutas"
                className="px-8 py-4 rounded-full border-2 border-white/30 hover:border-green-400 text-white font-semibold text-base hover:bg-white/5 transition-all duration-200 backdrop-blur-sm"
              >
                Ver Rutas
              </a>
            </motion.div>
          </motion.div>

          {/* ── Bus 3D ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="hidden lg:block relative"
            style={{ height: '520px' }}
          >
            <Suspense fallback={<BusLoader />}>
              <BusScene />
            </Suspense>

            {/* Labels flotantes */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[14%] right-2 pointer-events-none flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-green-400"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(34,197,94,0.25)' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              GPS en tiempo real
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-[26%] right-4 pointer-events-none flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              ✅ ISO 9001 &amp; 45001
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
              className="absolute top-[36%] left-2 pointer-events-none flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              ♻️ Flota renovada 99%
            </motion.div>
          </motion.div>

        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
      >
        <span className="text-zinc-300 text-xs tracking-widest uppercase">Explorar</span>
        <ChevronDown className="text-green-400" size={20} />
      </motion.div>
    </div>
  )
}
