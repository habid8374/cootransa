import { motion } from 'framer-motion'
import { Ticket, MapPin, CalendarDays, QrCode, ArrowRight } from 'lucide-react'

const TIQUETES_URL = 'https://cootransa-asistencia.vercel.app/tiquetes'

const PASOS = [
  { icon: MapPin,      titulo: 'Elige tu ruta',     desc: 'Busca por origen, destino y fecha de viaje.' },
  { icon: CalendarDays,titulo: 'Selecciona el viaje',desc: 'Escoge el horario que más te convenga.' },
  { icon: Ticket,      titulo: 'Paga en línea',     desc: 'Nequi, Daviplata, PSE o tarjeta — 100% seguro.' },
  { icon: QrCode,      titulo: 'Recibe tu tiquete', desc: 'Tu tiquete con código QR, listo para abordar.' },
]

export default function TicketsCTA() {
  return (
    <section id="tiquetes" className="relative overflow-hidden py-20 sm:py-24">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500" />
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/10 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm"
          >
            <Ticket size={14} /> Tiquetes en línea
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight"
          >
            Compra tu tiquete sin filas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-white/85"
          >
            Reserva y paga tu viaje desde el celular en minutos. Recibe tu tiquete con código QR
            y aborda sin complicaciones. Disponible las 24 horas.
          </motion.p>
        </div>

        {/* Pasos */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {PASOS.map((p, i) => (
            <motion.div
              key={p.titulo}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/15 mb-3">
                <p.icon size={20} className="text-white" />
              </div>
              <h3 className="text-sm font-bold text-white">{p.titulo}</h3>
              <p className="mt-1 text-xs text-white/75 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <a
            href={TIQUETES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-bold text-green-700 shadow-xl hover:scale-105 transition-all duration-200"
          >
            <Ticket size={20} />
            Comprar tiquetes ahora
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="text-xs text-white/70">Pago seguro con Nequi · Daviplata · PSE · Tarjeta</p>
        </motion.div>
      </div>
    </section>
  )
}
