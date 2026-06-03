import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import { supabase, getConfig, type Horario } from '../lib/supabase'
import Brand from '../components/Brand'
import Footer from '../components/Footer'

export default function HorariosPage() {
  const [rows, setRows]       = useState<Horario[]>([])
  const [titulo, setTitulo]   = useState('Horarios')
  const [leyenda, setLeyenda] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Horarios – COOTRANSA'
    async function load() {
      const { data } = await supabase.from('horarios').select('*').order('estacion')
      setRows(data ?? [])
      setTitulo(await getConfig('horarios_titulo', 'Horarios de estaciones'))
      setLeyenda(await getConfig('horarios_leyenda', ''))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Brand iconClass="h-9 lg:h-11" textClass="text-lg lg:text-2xl" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"><ArrowLeft size={16}/> Volver al inicio</Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-gray-100 bg-gray-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"/>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold tracking-widest uppercase"><Clock size={16}/> Horarios de salida</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3 leading-tight">{titulo}</h1>
          </motion.div>
        </div>
      </section>

      <main className="flex-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {loading ? (
            <div className="text-center py-16 text-sm text-gray-400">Cargando horarios...</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-400">No hay horarios disponibles por el momento.</div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {rows.map((row) => (
                <div key={row.id} className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-4 flex items-center gap-2">
                    <MapPin size={18} className="text-white shrink-0"/>
                    <h3 className="text-base font-bold text-white">Estación {row.estacion}</h3>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Primera salida</p>
                      <p className="text-sm font-semibold text-gray-900">{row.primera_salida || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Última salida</p>
                      <p className="text-sm font-semibold text-gray-900">{row.ultima_salida || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Frecuencia</p>
                      <p className="text-sm font-semibold text-gray-900">{row.frecuencia || '—'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {leyenda && <div className="mt-8 p-5 rounded-xl bg-gray-50 border border-gray-200"><p className="text-gray-500 text-sm leading-relaxed">{leyenda}</p></div>}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
