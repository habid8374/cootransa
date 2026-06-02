import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Brand from './Brand'

// Declare model-viewer as a valid JSX element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string
        alt?: string
        'auto-rotate'?: boolean | string
        'camera-controls'?: boolean | string
        'shadow-intensity'?: string
        exposure?: string
        'rotation-per-second'?: string
        'camera-orbit'?: string
        'field-of-view'?: string
        style?: React.CSSProperties
        autoplay?: boolean | string
        'environment-image'?: string
        'skybox-image'?: string
        'tone-mapping'?: string
        'min-camera-orbit'?: string
        'max-camera-orbit'?: string
      }, HTMLElement>
    }
  }
}

const DURATION = 8000

export default function BusSplash({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false)
  const [showBus, setShowBus] = useState(false)
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
    const t0 = setTimeout(() => setShowBus(true), 200)
    const t1 = setTimeout(() => setShowText(true), 1200)
    const t2 = setTimeout(() => setShowBtn(true), 2200)
    const t3 = setTimeout(handleExit, DURATION)
    const start = Date.now()
    const iv = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / DURATION) * 100)
      setProgress(p)
      if (p >= 100) clearInterval(iv)
    }, 32)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(iv) }
  }, [handleExit])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-center"
          style={{ background: '#060d1a' }}
        >
          {/* Grid sutil */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.045) 1px,transparent 1px)',
            backgroundSize: '50px 50px',
          }} />

          {/* Glow central */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(34,197,94,0.12) 0%, transparent 70%)',
          }} />

          {/* Partículas */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 3 + (i % 4) * 2,
                height: 3 + (i % 4) * 2,
                background: '#22c55e',
                left: `${8 + (i * 8.7) % 84}%`,
                top: `${6 + (i * 13.3) % 88}%`,
                opacity: 0.35 + (i % 3) * 0.15,
                boxShadow: '0 0 8px #22c55e',
              }}
              animate={{ y: [0, -(10 + i * 4), 0], opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 3.5 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
            />
          ))}

          {/* model-viewer — bus GLB real */}
          <AnimatePresence>
            {showBus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.75, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full flex justify-center"
                style={{ height: 'clamp(220px, 42vw, 440px)' }}
              >
                {/* Sombra debajo del bus */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{
                    width: 'clamp(200px, 38vw, 400px)',
                    height: '40px',
                    background: 'radial-gradient(ellipse, rgba(34,197,94,0.35) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                />

                {/* @ts-ignore */}
                <model-viewer
                  src="/models/bus.glb"
                  alt="Bus COOTRANSA 3D"
                  auto-rotate
                  rotation-per-second="30deg"
                  camera-orbit="25deg 75deg 105%"
                  field-of-view="30deg"
                  shadow-intensity="0.5"
                  exposure="1.1"
                  tone-mapping="commerce"
                  environment-image="neutral"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    '--progress-bar-color': 'transparent',
                    '--progress-mask': 'none',
                  } as React.CSSProperties}
                />

                {/* Labels flotantes — solo desktop */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-[12%] right-[8%] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-green-400"
                  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  GPS en tiempo real
                </motion.div>

                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-[22%] right-[8%] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white"
                  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  ✅ ISO 9001 & 45001
                </motion.div>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
                  className="absolute top-[35%] left-[8%] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-zinc-300"
                  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  ♻️ Flota renovada
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Brand + tagline */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="flex flex-col items-center gap-3 px-6 text-center mt-2"
              >
                <Brand iconClass="h-10 sm:h-12" textClass="text-3xl sm:text-4xl" />
                <p className="text-zinc-400 text-xs sm:text-sm tracking-[0.18em] uppercase font-medium">
                  Pioneros en el transporte del Caribe colombiano
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón + barra de progreso */}
          <div className="flex flex-col items-center gap-4 mt-5">
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

            <div className="w-44 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#16a34a,#22c55e)', transition: 'width 0.1s linear' }}
              />
            </div>
          </div>

          {/* Saltar */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={handleExit}
            className="absolute top-5 right-5 z-20 px-4 py-2 rounded-full text-xs font-semibold text-zinc-500 hover:text-white transition-all duration-200"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            Saltar →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
