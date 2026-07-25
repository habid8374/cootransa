import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CalendarDays, MapPin } from 'lucide-react'

/**
 * Modal emergente de las Fiestas Patronales / Corralejas de Sabanalarga 2026.
 * Aparece tras el splash. Cambiar FIN para dejar de mostrarlo pasada la fecha.
 */
export default function CorralejasModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const FORZAR = true                                  // ← poner en false para respetar solo el rango de fechas
    const hoy = new Date()
    const fin = new Date('2026-10-07T00:00:00')          // se oculta luego del evento
    if (FORZAR || hoy < fin) {
      const t = setTimeout(() => setOpen(true), 950)
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 240 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl no-scrollbar"
            style={{ background: 'linear-gradient(160deg,#1a1206,#0d0a04)' }}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />

            <button
              onClick={cerrar}
              aria-label="Cerrar"
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-amber-100 hover:bg-black/70 shadow-md transition"
            >
              <X size={17} />
            </button>

            <div className="sm:grid sm:grid-cols-2">
              {/* Afiche */}
              <div className="relative overflow-hidden sm:h-full">
                <img src="/corralejas-afiche.jpg" alt="Afiche Corralejas en Sabanalarga 2026" className="w-full h-auto sm:h-full sm:object-cover" draggable={false} />
              </div>

              {/* Info */}
              <div className="px-6 py-7 flex flex-col justify-center text-center">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">Fiestas Patronales 2026</span>
                <h2 className="mt-2 font-black text-2xl sm:text-3xl leading-tight" style={{ fontFamily: 'Georgia, serif', color: '#f5d488' }}>
                  Corralejas en Sabanalarga
                </h2>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full"><CalendarDays size={13}/> 1 al 6 de octubre</span>
                  <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/15 text-amber-100/80 text-xs font-semibold px-3 py-1.5 rounded-full"><MapPin size={13}/> Sabanalarga, Atlántico</span>
                </div>

                <p className="mt-4 text-sm text-amber-100/75 leading-relaxed">
                  En honor a <strong className="text-amber-200">Nuestra Señora de las Mercedes</strong>, patrona de Sabanalarga.
                  Más de un siglo de tradición alrededor de los <strong className="text-amber-200">toros criollos</strong>, los
                  porros, los fandangos y la gran cabalgata del Caribe colombiano.
                </p>

                <div className="mt-5 space-y-1 text-[13px]">
                  <p className="text-amber-100/70"><span className="text-amber-400/80 font-semibold">Organiza:</span> Los Hnos. García Tamara</p>
                  <p className="text-amber-100/70"><span className="text-amber-400/80 font-semibold">Apoya:</span> Toros de Sabanalarga · El 7 Caja</p>
                </div>

                <p className="mt-5 text-[13px] font-bold tracking-[0.2em] uppercase" style={{ color: '#f0b429' }}>Tradición · Cultura · Pasión</p>
                <p className="mt-3 text-[11px] text-amber-100/50">COOTRANSA se une a la celebración · ¡Todos cordialmente invitados!</p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
