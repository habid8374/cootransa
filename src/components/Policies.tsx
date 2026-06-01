import { motion } from 'framer-motion'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { policyPages } from '../content/policies'

export default function Policies() {
  return (
    <section className="py-24 bg-[#0A0F1E] relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl"/>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"/>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-green-400 text-sm font-semibold tracking-widest uppercase">Sistema Integrado de Gestión</span>
          <h2 className="text-4xl lg:text-5xl font-black font-display text-white mt-3">Nuestras <span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">Políticas</span></h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto text-lg">Conozca el marco que guía nuestro compromiso con la seguridad, la calidad, el bienestar y el cumplimiento legal.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policyPages.map((p, i) => (
            <motion.a
              key={p.slug}
              href={`/politicas/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/40 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-green-500/5 to-purple-500/5 rounded-2xl"/>
              <div className="relative z-10 flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shadow-lg">
                  <ShieldCheck size={22} className="text-white"/>
                </div>
                <ArrowUpRight size={20} className="text-zinc-500 group-hover:text-green-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"/>
              </div>
              <span className="relative z-10 text-green-400/80 text-xs font-semibold tracking-wider uppercase">{p.code}</span>
              <h3 className="relative z-10 text-white font-bold text-lg mt-1.5 mb-3 font-display leading-snug">{p.title}</h3>
              <p className="relative z-10 text-zinc-400 text-sm leading-relaxed flex-1">{p.summary}</p>
              <span className="relative z-10 mt-5 text-green-400 text-sm font-semibold inline-flex items-center gap-1">Leer política</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
