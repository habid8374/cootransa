import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Brand from './Brand'
import Footer from './Footer'
import ContentRenderer from './ContentRenderer'
import type { AboutPage } from '../content/about'

export default function PageLayout({ page }: { page: AboutPage }) {
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
            <span className="text-green-600 text-sm font-semibold tracking-widest uppercase">{page.eyebrow}</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-gray-900 mt-3">{page.title}</h1>
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
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
