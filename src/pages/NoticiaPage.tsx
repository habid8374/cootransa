import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Newspaper, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { noticiaPages } from '../content/noticias'
import Brand from '../components/Brand'
import Footer from '../components/Footer'
import NotFound from './NotFound'

interface PageData {
  slug: string; eyebrow: string; title: string; summary: string
  image_url?: string; image?: string
  schedule?: { estacion: string; primera: string; ultima: string; frecuencia: string }[]
  note?: string
}

export default function NoticiaPage() {
  const { slug } = useParams()
  const [page, setPage] = useState<PageData | null | undefined>(undefined)

  useEffect(() => {
    window.scrollTo(0, 0)
    async function load() {
      const { data } = await supabase.from('noticias').select('*').eq('slug', slug).eq('estado', 'publicado').single()
      if (data) { setPage(data); document.title = `${data.title} – COOTRANSA` }
      else {
        const static_ = noticiaPages.find(p => p.slug === slug)
        if (static_) { setPage({ ...static_, image_url: static_.image }); document.title = `${static_.title} – COOTRANSA` }
        else { setPage(null) }
      }
    }
    load()
  }, [slug])

  if (page === undefined) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
    </div>
  )
  if (page === null) return <NotFound />
  const imageUrl = page.image_url || page.image

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
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"/>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold tracking-widest uppercase"><Newspaper size={16}/> {page.eyebrow}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3 leading-tight">{page.title}</h1>
            <p className="text-gray-500 mt-4 text-base sm:text-lg max-w-2xl">{page.summary}</p>
          </motion.div>
        </div>
      </section>
      <main className="flex-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {imageUrl && <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white"><img src={imageUrl} alt={page.title} className="w-full h-auto object-contain" onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }}/></div>}
          {page.schedule && (
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                    <th className="px-5 py-4 text-sm font-semibold">Estación</th>
                    <th className="px-5 py-4 text-sm font-semibold">Primera salida</th>
                    <th className="px-5 py-4 text-sm font-semibold">Última salida</th>
                    <th className="px-5 py-4 text-sm font-semibold">Frecuencia</th>
                  </tr></thead>
                  <tbody>{page.schedule.map((row, i) => (
                    <tr key={row.estacion} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900 flex items-center gap-2"><Clock size={15} className="text-green-500"/>{row.estacion}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{row.primera}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{row.ultima}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{row.frecuencia}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
          {page.note && <div className="mt-8 p-5 rounded-xl bg-gray-50 border border-gray-200"><p className="text-gray-500 text-sm leading-relaxed">{page.note}</p></div>}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
