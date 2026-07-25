import { motion } from 'framer-motion'
import { Building2, ArrowRight, Handshake } from 'lucide-react'

export default function ProveedoresCTA() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
          style={{ background: 'linear-gradient(135deg,#1e1b4b,#4338ca)' }}
        >
          {/* Imagen de fondo (trabajo en equipo) */}
          <img src="/cta-proveedores.jpg" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-center opacity-70 sm:opacity-80" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg,rgba(30,27,75,0.96) 0%,rgba(30,27,75,0.82) 42%,rgba(30,27,75,0.20) 100%)' }} />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest"><Handshake size={15}/> Proveedores</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white leading-tight">¿Quieres ser parte de nuestros proveedores?</h2>
              <p className="mt-2 text-white/85 text-sm sm:text-base">Si ofreces <strong>insumos, materiales o servicios</strong>, postúlate en línea y adjunta tu propuesta. ¡Estudiaremos tu oferta y podríamos trabajar juntos!</p>
            </div>
            <a href="/proveedores" className="shrink-0 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-6 py-3.5 rounded-full shadow-lg hover:scale-105 transition-transform">
              <Building2 size={18}/> Postularme aquí <ArrowRight size={16}/>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
