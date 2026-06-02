import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Brand from './Brand'

const DURATION = 6000

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
    const t0 = setTimeout(() => setShowBus(true), 300)
    const t1 = setTimeout(() => setShowText(true), 1400)
    const t2 = setTimeout(() => setShowBtn(true), 2400)
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
            background: 'radial-gradient(ellipse 75% 55% at 50% 50%, rgba(34,197,94,0.09) 0%, transparent 70%)',
          }} />

          {/* Partículas CSS */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4 + (i % 4) * 2,
                height: 4 + (i % 4) * 2,
                background: '#22c55e',
                left: `${10 + (i * 7.3) % 80}%`,
                top: `${8 + (i * 11.7) % 84}%`,
                opacity: 0.4 + (i % 3) * 0.15,
                boxShadow: '0 0 8px #22c55e',
              }}
              animate={{ y: [0, -(12 + i * 3), 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            />
          ))}

          {/* Bus SVG animado */}
          <AnimatePresence>
            {showBus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative mb-8 sm:mb-10"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 24px 48px rgba(34,197,94,0.3)) drop-shadow(0 0 40px rgba(34,197,94,0.15))' }}
                >
                  <svg
                    viewBox="0 0 560 280"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[320px] sm:w-[440px] lg:w-[560px] h-auto"
                  >
                    <defs>
                      <linearGradient id="sg1" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#166534" />
                        <stop offset="100%" stopColor="#15803d" />
                      </linearGradient>
                      <linearGradient id="sg2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="sg3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#16a34a" />
                      </linearGradient>
                    </defs>
                    {/* Sombra */}
                    <ellipse cx="285" cy="268" rx="210" ry="14" fill="rgba(34,197,94,0.2)" />
                    {/* Techo iso */}
                    <polygon points="90,72 430,72 474,42 134,42" fill="#1a5c2a" stroke="#22c55e" strokeWidth="0.6" />
                    {/* Cuerpo lateral */}
                    <rect x="90" y="72" width="340" height="150" fill="url(#sg1)" />
                    {/* Cara frontal iso */}
                    <polygon points="430,72 474,42 474,210 430,222" fill="#14532d" />
                    {/* Franja verde lateral */}
                    <rect x="90" y="130" width="340" height="20" fill="url(#sg3)" opacity="0.92" />
                    {/* Franja frontal */}
                    <polygon points="430,130 474,102 474,122 430,150" fill="#22c55e" opacity="0.92" />
                    {/* Texto */}
                    <text x="148" y="122" fontFamily="Inter,sans-serif" fontSize="20" fontWeight="900" fill="white" opacity="0.96" letterSpacing="3">COOTRANSA</text>
                    {/* Ventanas */}
                    {[100, 175, 250, 325].map((x, i) => (
                      <g key={i}>
                        <rect x={x} y="82" width="62" height="36" fill="url(#sg2)" rx="3" />
                        <rect x={x + 2} y="84" width="14" height="20" fill="white" opacity="0.18" rx="2" />
                      </g>
                    ))}
                    {/* Ventana frontal */}
                    <polygon points="434,50 470,48 470,92 434,96" fill="url(#sg2)" />
                    {/* Puerta */}
                    <rect x="390" y="160" width="36" height="58" fill="#0f3d1a" rx="2" stroke="#22c55e" strokeWidth="0.9" />
                    <line x1="408" y1="165" x2="408" y2="213" stroke="#22c55e" strokeWidth="1" opacity="0.6" />
                    {/* Base */}
                    <rect x="90" y="222" width="340" height="18" fill="#0d3318" />
                    <polygon points="430,222 474,210 474,228 430,240" fill="#0a2a14" />
                    {/* Rueda trasera */}
                    <circle cx="162" cy="252" r="28" fill="#1f2937" stroke="#374151" strokeWidth="2" />
                    <circle cx="162" cy="252" r="17" fill="#111827" stroke="#4b5563" strokeWidth="1.5" />
                    <circle cx="162" cy="252" r="5" fill="#6b7280" />
                    <line x1="162" y1="237" x2="162" y2="267" stroke="#4b5563" strokeWidth="1.5" />
                    <line x1="147" y1="252" x2="177" y2="252" stroke="#4b5563" strokeWidth="1.5" />
                    <line x1="151" y1="241" x2="173" y2="263" stroke="#4b5563" strokeWidth="1" />
                    <line x1="173" y1="241" x2="151" y2="263" stroke="#4b5563" strokeWidth="1" />
                    {/* Rueda delantera */}
                    <circle cx="362" cy="252" r="28" fill="#1f2937" stroke="#374151" strokeWidth="2" />
                    <circle cx="362" cy="252" r="17" fill="#111827" stroke="#4b5563" strokeWidth="1.5" />
                    <circle cx="362" cy="252" r="5" fill="#6b7280" />
                    <line x1="362" y1="237" x2="362" y2="267" stroke="#4b5563" strokeWidth="1.5" />
                    <line x1="347" y1="252" x2="377" y2="252" stroke="#4b5563" strokeWidth="1.5" />
                    <line x1="351" y1="241" x2="373" y2="263" stroke="#4b5563" strokeWidth="1" />
                    <line x1="373" y1="241" x2="351" y2="263" stroke="#4b5563" strokeWidth="1" />
                    {/* Faro */}
                    <ellipse cx="425" cy="182" rx="14" ry="10" fill="#fef08a" opacity="0.9" />
                    <ellipse cx="425" cy="182" rx="9" ry="6" fill="white" opacity="0.65" />
                    {/* Logo frente */}
                    <circle cx="452" cy="126" r="12" fill="#16a34a" stroke="#22c55e" strokeWidth="1.5" />
                    <text x="452" y="130" fontFamily="Inter" fontSize="7" fontWeight="900" fill="white" textAnchor="middle">CO</text>
                    {/* Brillo techo */}
                    <rect x="152" y="44" width="260" height="7" fill="white" opacity="0.06" rx="2" />
                  </svg>
                </motion.div>

                {/* Labels flotantes */}
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-[10%] -right-2 sm:right-0 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-green-400"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'pulse 1.5s infinite' }} />
                  GPS en tiempo real
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-[20%] -right-2 sm:right-0 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  ✅ ISO 9001 & 45001
                </motion.div>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
                  className="absolute top-[30%] -left-2 sm:left-0 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-zinc-300"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
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
                className="flex flex-col items-center gap-3 px-6 text-center"
              >
                <Brand iconClass="h-10 sm:h-12" textClass="text-3xl sm:text-4xl" />
                <p className="text-zinc-400 text-xs sm:text-sm tracking-[0.18em] uppercase font-medium">
                  Pioneros en el transporte del Caribe colombiano
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón + barra */}
          <div className="flex flex-col items-center gap-4 mt-6">
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

            <div className="w-40 h-px rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
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
            transition={{ delay: 0.8, duration: 0.5 }}
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
