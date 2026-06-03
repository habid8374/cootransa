import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign } from 'lucide-react'
import { supabase, getConfig, type Tarifa } from '../lib/supabase'
import Brand from '../components/Brand'
import Footer from '../components/Footer'

export default function TarifasPage() {
  const [rows, setRows]       = useState<Tarifa[]>([])
  const [titulo, setTitulo]   = useState('Tarifas')
  const [leyenda, setLeyenda] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Tarifas – COOTRANSA'
    async function load() {
      const { data } = await supabase.from('tarifas').select('*').eq('activa', true).order('origen')
      setRows(data ?? [])
      setTitulo(await getConfig('tarifas_titulo', 'Tarifas Año 2026'))
      setLeyenda(await getConfig('tarifas_leyenda', ''))
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50"/>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold tracking-widest uppercase"><DollarSign size={16}/> Tarifas vigentes</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3 leading-tight">{titulo}</h1>
          </motion.div>
        </div>
      </section>

      <main className="flex-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {loading ? (
            <div className="text-center py-16 text-sm text-gray-400">Cargando tarifas...</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-400">No hay tarifas disponibles por el momento.</div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                    <th className="px-5 py-4 text-sm font-semibold">Origen</th>
                    <th className="px-5 py-4 text-sm font-semibold">Destino</th>
                    <th className="px-5 py-4 text-sm font-semibold text-right">Tarifa</th>
                    <th className="px-5 py-4 text-sm font-semibold hidden sm:table-cell">Tipo</th>
                  </tr></thead>
                  <tbody>{rows.map((row, i) => (
                    <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">{row.origen}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{row.destino}</td>
                      <td className="px-5 py-4 text-sm font-bold text-green-700 text-right whitespace-nowrap">${row.precio}</td>
                      <td className="px-5 py-4 text-sm text-gray-500 hidden sm:table-cell">{row.tipo}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
          {leyenda && <div className="mt-8 p-5 rounded-xl bg-gray-50 border border-gray-200"><p className="text-gray-500 text-sm leading-relaxed">{leyenda}</p></div>}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
