import { motion } from 'framer-motion'
import { CalendarDays, MapPin, Sparkles } from 'lucide-react'

/**
 * Banner de las Fiestas Patronales / Corralejas de Sabanalarga 2026.
 * Información ampliada con reseña de la tradición local.
 */
export default function CorralejasBanner() {
  return (
    <section id="corralejas" className="py-16 sm:py-20" style={{ background: 'linear-gradient(160deg,#150f04 0%,#1e1608 55%,#0d0a04 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-8 lg:gap-12 items-center">

          {/* Afiche */}
          <motion.a
            href="/corralejas-afiche.jpg" target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="block mx-auto w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-amber-500/30 hover:ring-amber-400/60 hover:scale-[1.02] transition"
          >
            <img src="/corralejas-afiche.jpg" alt="Afiche Corralejas en Sabanalarga, Atlántico — 1 al 6 de octubre de 2026" className="w-full h-auto" loading="lazy" />
          </motion.a>

          {/* Información ampliada */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles size={15} /> Fiestas Patronales · Sabanalarga 2026
            </span>
            <h2 className="mt-3 font-black text-3xl sm:text-4xl leading-tight" style={{ fontFamily: 'Georgia, serif', color: '#f5d488' }}>
              Corralejas en Sabanalarga
            </h2>

            {/* Fecha y lugar */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-200 text-sm font-semibold px-3.5 py-2 rounded-full">
                <CalendarDays size={15} /> 1 al 6 de octubre de 2026
              </span>
              <span className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-amber-100/80 text-sm font-semibold px-3.5 py-2 rounded-full">
                <MapPin size={15} /> Sabanalarga, Atlántico
              </span>
            </div>

            {/* Reseña ampliada (investigada) */}
            <p className="mt-5 text-amber-100/75 text-[15px] leading-relaxed max-w-2xl">
              Cada año, en honor a la patrona <strong className="text-amber-200">Nuestra Señora de las Mercedes</strong>, Sabanalarga
              vive sus tradicionales <strong className="text-amber-200">corralejas</strong>: una fiesta con más de un siglo de historia
              alrededor de los toros criollos, la música de porros y fandangos, y una imponente cabalgata que reúne cientos de caballos
              de toda la región. Una celebración que une a propios y visitantes en torno a la cultura del Caribe colombiano.
            </p>

            {/* Créditos */}
            <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-xl">
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-amber-400/80">Organiza</p>
                <p className="text-amber-50 font-semibold">Los Hnos. García Tamara</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-amber-400/80">Apoya</p>
                <p className="text-amber-50 font-semibold">Toros de Sabanalarga · El 7 Caja</p>
              </div>
            </div>

            {/* Cierre */}
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
              <span className="text-sm font-bold tracking-[0.25em] uppercase" style={{ color: '#f0b429' }}>Tradición · Cultura · Pasión</span>
              <span className="h-px flex-1 bg-gradient-to-l from-amber-500/50 to-transparent" />
            </div>
            <p className="mt-4 text-amber-100/60 text-sm">COOTRANSA se une a la celebración e invita a toda la comunidad. ¡Todos cordialmente invitados!</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
