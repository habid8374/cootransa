import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Toro flotante (recortado) de las Corralejas de Sabanalarga 2026,
 * en la esquina inferior izquierda con destellos de polvo dorado.
 */
export default function CorralejasFloating() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const FORZAR = true                                  // ← poner en false para respetar solo el rango de fechas
    const hoy = new Date()
    const fin = new Date('2026-10-07T00:00:00')
    if (FORZAR || hoy < fin) {
      const t = setTimeout(() => setVisible(true), 1700)  // tras el splash
      return () => clearTimeout(t)
    }
  }, [])

  const sparkles = [
    { top: '14%', left: '58%', size: 12, delay: 0    },
    { top: '26%', left: '30%', size: 8,  delay: 0.7  },
    { top: '40%', left: '72%', size: 10, delay: 1.1  },
    { top: '55%', left: '20%', size: 7,  delay: 0.4  },
    { top: '64%', left: '66%', size: 11, delay: 1.3  },
    { top: '78%', left: '38%', size: 8,  delay: 0.9  },
  ]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 z-40 pointer-events-none select-none"
          style={{ width: 'min(34vw, 240px)' }}
        >
          <div className="relative">
            {/* Resplandor dorado detrás */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: 'radial-gradient(ellipse 60% 55% at 50% 45%, rgba(240,180,41,0.40), rgba(240,180,41,0.10) 45%, transparent 70%)',
                filter: 'blur(10px)',
              }}
            />

            {/* Destellos de polvo */}
            {sparkles.map((s, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4], rotate: [0, 90, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" width="100%" height="100%" className="drop-shadow-[0_0_4px_rgba(240,180,41,0.9)]">
                  <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="#f5d488" />
                </svg>
              </motion.div>
            ))}

            {/* Toro */}
            <img
              src="/corralejas-toro.png"
              alt="Corralejas Sabanalarga 2026"
              className="relative w-full h-auto drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]"
              draggable={false}
            />

            {/* Etiqueta de fecha */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto">
              <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-amber-100 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full border border-amber-500/40 shadow">
                Corralejas · 1–6 Oct
              </span>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setVisible(false)}
              aria-label="Ocultar"
              className="pointer-events-auto absolute top-1 right-1 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/90 hover:bg-black/60 transition"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
