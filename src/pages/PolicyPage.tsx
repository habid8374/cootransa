import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react'
import { policyPages } from '../content/policies'
import Brand from '../components/Brand'
import Footer from '../components/Footer'
import ContentRenderer from '../components/ContentRenderer'
import NotFound from './NotFound'

export default function PolicyPage() {
  const { slug } = useParams()
  const page = policyPages.find(p => p.slug === slug)
  useEffect(() => { window.scrollTo(0, 0); if (page) document.title = `${page.title} – COOTRANSA` }, [page])
  if (!page) return <NotFound />

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Brand iconClass="h-9 lg:h-11" textClass="text-lg lg:text-2xl" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
            <ArrowLeft size={16}/> Volver al inicio
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-green-50 via-white to-gray-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold tracking-widest uppercase">
              <ShieldCheck size={16}/> {page.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3 leading-tight">{page.title}</h1>
            <p className="text-gray-500 mt-4 text-base sm:text-lg max-w-2xl">{page.summary}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium">
                <FileText size={13}/> Código {page.code}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium">Versión {page.version}</span>
              <span className="px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium">Vigente desde el {page.date}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
        >
          <ContentRenderer blocks={page.blocks} />

          <div className="mt-14 pt-8 border-t border-gray-200">
            <p className="text-gray-400 text-sm italic">
              Aprobada por la Gerencia de COOTRANSA Ltda® — Sabanalarga, Atlántico. Documento del Sistema Integrado de Gestión.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
