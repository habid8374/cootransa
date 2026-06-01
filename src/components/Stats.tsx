import { useCountUp } from '../hooks/useCountUp'
import { motion } from 'framer-motion'

function StatCard({ value, suffix='', label, description, isText=false, textValue='' }: { value: number; suffix?: string; label: string; description: string; isText?: boolean; textValue?: string }) {
  const { count, ref } = useCountUp(value, 2000)
  return (
    <motion.div ref={ref as any} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative group">
      <div className="relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full blur-2xl group-hover:bg-green-200 transition-all duration-500"/>
        <div className="relative z-10">
          <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-display bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">{isText ? textValue : `${count}${suffix}`}</div>
          <div className="text-gray-900 font-semibold text-lg mb-1">{label}</div>
          <div className="text-gray-500 text-sm leading-relaxed">{description}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}/>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-green-600 text-sm font-semibold tracking-widest uppercase">Números que hablan</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3">Más de cinco décadas<br/><span className="bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">de movilidad continua</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard value={50} suffix="+" label="Años de experiencia" description="Desde 1972 conectando el Caribe colombiano"/>
          <StatCard value={54} label="Socios activos" description="Conductores profesionales comprometidos"/>
          <StatCard value={3} label="Rutas principales" description="Barranquilla, Manatí y San Cristóbal desde Sabanalarga"/>
          <StatCard value={0} isText textValue="ISO" label="9001 & 45001" description="Calidad y seguridad certificadas internacionalmente"/>
        </div>
      </div>
    </section>
  )
}
