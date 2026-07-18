import { motion } from 'framer-motion'
import { CreditCard, ArrowRight, GraduationCap } from 'lucide-react'

export default function CarnetCTA() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
          style={{ background: 'linear-gradient(135deg,#0d3b1e,#16a34a)' }}
        >
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest"><GraduationCap size={15}/> Estudiantes</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white leading-tight">¿Estudias y viajas con COOTRANSA?</h2>
              <p className="mt-2 text-white/85 text-sm sm:text-base">Solicita tu <strong>carnet de tarifa preferencial</strong>. Sube tus documentos en línea y, al ser aprobado, descarga tu carnet digital con código QR.</p>
            </div>
            <a href="/tarifa-preferencial" className="shrink-0 inline-flex items-center gap-2 bg-white text-green-700 font-bold text-sm px-6 py-3.5 rounded-full shadow-lg hover:scale-105 transition-transform">
              <CreditCard size={18}/> Solicitar carnet <ArrowRight size={16}/>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
