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
    <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col">
      <header className="sticky top-0 z-50 bg-[#070C1A]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Brand iconClass="h-9 lg:h-11" textClass="text-lg lg:text-2xl" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-green-400 transition-colors">
            <ArrowLeft size={16}/> Volver al inicio
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d3b07] via-[#0A0F1E] to-[#1a0b2e]"/>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"/>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-green-400 text-sm font-semibold tracking-widest uppercase">
              <ShieldCheck size={16}/> {page.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white mt-3 leading-tight">{page.title}</h1>
            <p className="text-zinc-300 mt-4 text-base sm:text-lg max-w-2xl">{page.summary}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                <FileText size={13}/> Código {page.code}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">Versión {page.version}</span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">Vigente desde el {page.date}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
        >
          <ContentRenderer blocks={page.blocks} />

          <div className="mt-14 pt-8 border-t border-white/10">
            <p className="text-zinc-400 text-sm italic">
              Aprobada por la Gerencia de COOTRANSA Ltda® — Sabanalarga, Atlántico. Documento del Sistema Integrado de Gestión.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
