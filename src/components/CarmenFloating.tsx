import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Imagen flotante de la Virgen del Carmen en la esquina inferior izquierda,
 * con destellos de luz dorados animados. Solo el 16 de julio (cada año).
 */
export default function CarmenFloating() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hoy = new Date()
    if (hoy.getMonth() === 6 && hoy.getDate() === 16) {
      const t = setTimeout(() => setVisible(true), 1600) // tras el splash
      return () => clearTimeout(t)
    }
  }, [])

  // Posiciones de los destellos (relativas a la figura)
  const sparkles = [
    { top: '8%',  left: '52%', size: 14, delay: 0    },
    { top: '18%', left: '30%', size: 9,  delay: 0.6  },
    { top: '30%', left: '68%', size: 11, delay: 1.1  },
    { top: '46%', left: '18%', size: 8,  delay: 0.3  },
    { top: '52%', left: '78%', size: 12, delay: 1.4  },
    { top: '70%', left: '28%', size: 9,  delay: 0.9  },
    { top: '78%', left: '62%', size: 10, delay: 0.2  },
    { top: '12%', left: '72%', size: 7,  delay: 1.7  },
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
          style={{ width: 'min(32vw, 230px)' }}
        >
          <div className="relative">
            {/* Resplandor dorado detrás */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: 'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(250,204,21,0.45), rgba(250,204,21,0.12) 45%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
            <motion.div
              className="absolute inset-0 -z-10"
              animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.06, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: 'radial-gradient(circle at 50% 38%, rgba(255,236,150,0.5), transparent 60%)',
              }}
            />

            {/* Destellos */}
            {sparkles.map((s, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4], rotate: [0, 90, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" width="100%" height="100%" className="drop-shadow-[0_0_4px_rgba(250,204,21,0.9)]">
                  <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="#fde68a" />
                </svg>
              </motion.div>
            ))}

            {/* Imagen de la Virgen */}
            <img
              src="/carmen-virgen.png"
              alt="Nuestra Señora del Carmen"
              className="relative w-full h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              draggable={false}
            />

            {/* Botón cerrar (sí recibe clics) */}
            <button
              onClick={() => setVisible(false)}
              aria-label="Ocultar"
              className="pointer-events-auto absolute top-1 right-1 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/90 hover:bg-black/50 transition"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
