import { motion } from 'framer-motion'
import { Shield, Satellite, Award, RefreshCw } from 'lucide-react'

const features = [
  { icon: RefreshCw, title: '99% flota renovada', description: 'Vehículos modernos con tecnología de última generación para garantizar confort y seguridad.' },
  { icon: Satellite, title: 'Monitoreo satelital', description: 'Seguimiento GPS en tiempo real de toda nuestra flota las 24 horas del día.' },
  { icon: Shield, title: 'Seguridad certificada', description: 'ISO 45001:2018 en seguridad y salud en el trabajo. Cero tolerancia a riesgos.' },
  { icon: Award, title: 'Calidad ISO 9001', description: 'Gestión de calidad certificada internacionalmente desde hace más de una década.' },
]

export default function Fleet() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="text-green-600 text-sm font-semibold tracking-widest uppercase">Nuestra flota</span>
            <h2 className="text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3 mb-6 leading-tight">Movemos mucho<br/><span className="bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">más que pasajeros.</span></h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">Nuestra flota renovada y tecnología de monitoreo satelital garantizan que cada viaje sea seguro, puntual y cómodo. Somos el estándar de calidad del transporte intermunicipal en el Caribe colombiano.</p>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium">ISO 9001:2015</div>
              <div className="px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium">ISO 45001:2018</div>
              <div className="px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-medium">Fundada en 1972</div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feat, i) => (
              <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1, duration: 0.5 }} className="group p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center mb-4"><feat.icon size={18} className="text-white"/></div>
                <h3 className="text-gray-900 font-semibold mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
