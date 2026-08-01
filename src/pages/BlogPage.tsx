import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Newspaper, CalendarDays, ArrowRight, Search } from 'lucide-react'
import { supabase, type Noticia } from '../lib/supabase'
import Brand from '../components/Brand'
import Footer from '../components/Footer'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const fmtFecha = (d?: string) => {
  if (!d) return ''
  const f = new Date(d)
  return `${f.getDate()} ${MESES[f.getMonth()]} ${f.getFullYear()}`
}

// Color de la etiqueta según la sección/categoría
const catColor = (s?: string) => {
  const k = (s ?? '').toLowerCase()
  if (k.includes('vial')) return 'bg-red-50 text-red-600'
  if (k.includes('sst') || k.includes('salud')) return 'bg-blue-50 text-blue-600'
  if (k.includes('evento')) return 'bg-purple-50 text-purple-600'
  if (k.includes('capacit')) return 'bg-amber-50 text-amber-700'
  if (k.includes('convocatoria') || k.includes('rrhh')) return 'bg-teal-50 text-teal-600'
  return 'bg-green-50 text-green-700'
}

export default function BlogPage() {
  const [rows, setRows] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('todas')
  const [anio, setAnio] = useState('todos')
  const [q, setQ] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Blog – COOTRANSA'
    supabase.from('noticias').select('*').eq('estado', 'publicado').order('created_at', { ascending: false })
      .then(({ data }) => { setRows(data ?? []); setLoading(false) })
  }, [])

  const categorias = useMemo(() => Array.from(new Set(rows.map(r => r.seccion).filter(Boolean))), [rows])
  const anios = useMemo(() => Array.from(new Set(rows.map(r => new Date(r.created_at ?? '').getFullYear()).filter(Boolean))).sort((a, b) => b - a), [rows])

  const visibles = rows.filter(r => {
    if (cat !== 'todas' && r.seccion !== cat) return false
    if (anio !== 'todos' && String(new Date(r.created_at ?? '').getFullYear()) !== anio) return false
    if (q.trim()) {
      const t = q.toLowerCase()
      if (!(`${r.title} ${r.summary} ${r.eyebrow}`.toLowerCase().includes(t))) return false
    }
    return true
  })

  const chip = (activo: boolean) =>
    `px-3.5 py-1.5 rounded-full text-sm font-medium transition ${activo ? 'bg-green-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'}`

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Brand iconClass="h-9" textClass="text-lg" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition"><ArrowLeft size={16}/> Volver</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-gray-100 bg-gradient-to-br from-green-50 via-white to-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <span className="inline-flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest"><Newspaper size={15}/> Blog COOTRANSA</span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900">Noticias, eventos y cultura vial</h1>
            <p className="mt-3 text-gray-500 max-w-2xl">Comunicados, capacitaciones en seguridad vial y en el trabajo, reuniones y novedades de nuestra cooperativa.</p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Filtros */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setCat('todas')} className={chip(cat === 'todas')}>Todas</button>
              {categorias.map(c => <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{c}</button>)}
              <div className="relative ml-auto">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar..." className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-full outline-none focus:border-green-500 w-40 sm:w-52" />
              </div>
            </div>

            {/* Archivo por año */}
            {anios.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-400"><CalendarDays size={14}/> Archivo</span>
                <button onClick={() => setAnio('todos')} className={chip(anio === 'todos')}>Todos</button>
                {anios.map(y => <button key={y} onClick={() => setAnio(String(y))} className={chip(anio === String(y))}>{y}</button>)}
              </div>
            )}
          </div>

          {/* Lista */}
          {loading ? (
            <div className="py-20 text-center text-gray-400">Cargando publicaciones...</div>
          ) : visibles.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <Newspaper size={40} className="mx-auto mb-3 text-gray-300" />
              No hay publicaciones {cat !== 'todas' || anio !== 'todos' || q ? 'con estos filtros' : 'aún'}.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibles.map((n, i) => (
                <motion.div
                  key={n.id ?? i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                >
                  <Link to={`/noticias/${n.slug}`} className="group block h-full rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm hover:shadow-lg hover:border-green-200 transition-all">
                    <div className="h-44 overflow-hidden bg-gradient-to-br from-green-100 to-gray-100">
                      {n.image_url
                        ? <img src={n.image_url} alt={n.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center"><Newspaper size={40} className="text-green-300" /></div>}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        {n.seccion && <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${catColor(n.seccion)}`}>{n.seccion}</span>}
                        <span className="text-[11px] text-gray-400 ml-auto">{fmtFecha(n.created_at)}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{n.title}</h3>
                      {n.summary && <p className="text-sm text-gray-500 mt-2 line-clamp-3">{n.summary}</p>}
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 mt-4 group-hover:gap-2.5 transition-all">Leer más <ArrowRight size={15}/></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
