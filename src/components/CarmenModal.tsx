import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin } from 'lucide-react'

/**
 * Modal especial que honra a Nuestra Señora del Carmen, patrona de los
 * transportadores. Se muestra automáticamente SOLO el 16 de julio (cada año),
 * una vez por visita. El 17 de julio en adelante no aparece.
 */
export default function CarmenModal() {
  const [open, setOpen] = useState(false)
  const [verRecorrido, setVerRecorrido] = useState(false)

  useEffect(() => {
    const hoy = new Date()
    const esDiaDelCarmen = hoy.getMonth() === 6 && hoy.getDate() === 16 // mes 6 = julio
    if (esDiaDelCarmen) {
      const t = setTimeout(() => setOpen(true), 900) // aparece tras el splash, cada vez que se abre/recarga
      return () => clearTimeout(t)
    }
  }, [])

  const cerrar = () => setOpen(false)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={cerrar}
        >
          {/* Fondo con destellos */}
          <div className="absolute inset-0 bg-[#1a0f3d]/80 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 240 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl"
            style={{ background: 'linear-gradient(160deg, #fffdf8 0%, #fdf7ea 100%)' }}
          >
            {/* Marco dorado superior */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />

            <button
              onClick={cerrar}
              aria-label="Cerrar"
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-[#3b2a6b] hover:bg-white shadow-md transition"
            >
              <X size={17} />
            </button>

            {!verRecorrido ? (
              <div className="sm:grid sm:grid-cols-2">
                {/* Imagen de la Virgen */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="relative overflow-hidden sm:h-full"
                >
                  <img src="/carmen-eucaristia.jpg" alt="Nuestra Señora del Carmen" className="w-full h-auto sm:h-full sm:object-cover object-top" draggable={false} />
                </motion.div>

                {/* Contenido */}
                <div className="px-6 py-7 text-center flex flex-col justify-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">16 de Julio</span>
                    <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400" />
                  </div>

                  <h2 className="mt-2 font-black text-2xl leading-tight" style={{ color: '#3b2a6b', fontFamily: 'Georgia, serif' }}>
                    Feliz día de la<br/>Virgen del Carmen
                  </h2>

                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    En COOTRANSA honramos a <strong className="text-[#3b2a6b]">Nuestra Señora del Carmen</strong>,
                    patrona y protectora de los conductores y transportadores. Que guíe y bendiga
                    siempre nuestros caminos. 🙏
                  </p>

                  <p className="mt-4 text-[13px] italic text-amber-700" style={{ fontFamily: 'Georgia, serif' }}>
                    «Virgen del Carmen, guía nuestros caminos y protege siempre a todos los transportadores.»
                  </p>

                  <button
                    onClick={() => setVerRecorrido(true)}
                    className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-lg hover:scale-105 transition-transform"
                    style={{ background: 'linear-gradient(135deg, #3b2a6b, #5b3fa0)' }}
                  >
                    <MapPin size={16} /> Ver recorrido de la caravana
                  </button>

                  <p className="mt-4 text-[11px] text-gray-400">Cooperativa de Transportadores de Sabanalarga</p>
                </div>
              </div>
            ) : (
              <div className="px-6 pt-6 pb-7">
                <img src="/carmen-recorrido.jpg" alt="Recorrido Día de la Virgen del Carmen" className="w-auto max-h-[70vh] mx-auto rounded-2xl shadow-lg ring-1 ring-amber-200" draggable={false} />
                <button
                  onClick={() => setVerRecorrido(false)}
                  className="mt-5 w-full py-3 rounded-full text-sm font-semibold text-[#3b2a6b] border border-[#3b2a6b]/25 hover:bg-[#3b2a6b]/5 transition"
                >
                  ← Volver
                </button>
              </div>
            )}

            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
