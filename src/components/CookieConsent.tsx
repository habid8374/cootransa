import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'

const KEY = 'coo_cookies_v1'

/** Banner de consentimiento de cookies. Aparece una vez, tras el splash del bus. */
export default function CookieConsent({ ready }: { ready: boolean }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!ready) return
    let decidido = false
    try { decidido = !!localStorage.getItem(KEY) } catch {}
    if (!decidido) {
      const t = setTimeout(() => setShow(true), 700) // deja respirar la entrada
      return () => clearTimeout(t)
    }
  }, [ready])

  const decidir = (valor: 'aceptadas' | 'rechazadas') => {
    try { localStorage.setItem(KEY, JSON.stringify({ valor, fecha: new Date().toISOString() })) } catch {}
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 24, stiffness: 240 }}
          className="fixed bottom-0 left-0 right-0 z-[70] p-3 sm:p-5"
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-400" />
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-50 shrink-0">
                <Cookie size={22} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900">Usamos cookies</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1">
                  Utilizamos cookies para mejorar tu experiencia de navegación y analizar el uso del sitio.
                  Puedes aceptarlas todas o continuar solo con las esenciales. Consulta nuestra{' '}
                  <a href="/legal/cookies" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">Política de Cookies</a>.
                </p>
              </div>
              <div className="flex w-full sm:w-auto gap-2 shrink-0">
                <button
                  onClick={() => decidir('rechazadas')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-full text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
                >
                  Solo esenciales
                </button>
                <button
                  onClick={() => decidir('aceptadas')}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:scale-[1.03] transition"
                  style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}
                >
                  Aceptar todas
                </button>
              </div>
              <button onClick={() => decidir('rechazadas')} aria-label="Cerrar" className="absolute top-2.5 right-2.5 p-1 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition sm:hidden">
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
