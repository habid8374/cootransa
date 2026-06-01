import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Globe, Map, Handshake, Truck } from 'lucide-react'

const services = [
  { icon: GraduationCap, title: 'Transporte Estudiantil', description: 'Llevamos a estudiantes de todos los niveles a sus instituciones educativas con puntualidad, seguridad y responsabilidad. Convenios con universidades y colegios de la región.', gradient: 'from-green-600 to-green-400' },
  { icon: Briefcase, title: 'Transporte Empresarial', description: 'Soluciones de movilidad corporativa para empresas e industrias del Caribe. Rutas personalizadas, horarios flexibles y flota renovada al servicio de su equipo.', gradient: 'from-purple-600 to-purple-400' },
  { icon: Globe, title: 'Transporte Turístico', description: 'Descubra los destinos más hermosos del Caribe colombiano con nuestro servicio turístico especializado. Confort, guia y experiencia en cada viaje.', gradient: 'from-yellow-600 to-yellow-400' },
  { icon: Map, title: 'Rutas Intermunicipales', description: 'Conectamos Sabanalarga, Manaí y Compuerta de Villa Rosa con Barranquilla. Salidas frecuentes, comodidad garantizada y monitoreo satelital en tiempo real.', gradient: 'from-green-600 to-teal-400' },
  { icon: Handshake, title: 'Convenios Corporativos', description: 'Alianzas estratégicas con empresas, entidades gubernamentales y universidades para movilidad masiva y transporte de personal con tarifas preferenciales.', gradient: 'from-purple-700 to-pink-500' },
  { icon: Truck, title: 'Logística y Movilidad', description: 'Servicios integrales de movilidad para eventos, operativos masivos y logística de transporte. Capacidad operativa comprobada en toda la región Caribe.', gradient: 'from-blue-600 to-purple-500' },
]

export default function Services() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50"/>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40"/>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-green-600 text-sm font-semibold tracking-widest uppercase">Lo que ofrecemos</span>
          <h2 className="text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3">Servicios de transporte<br/><span className="bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">para cada necesidad</span></h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">Desde el primer día de clases hasta el viaje de negocios más importante, COOTRANSA está presente.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i*0.08 }} whileHover={{ scale: 1.02 }} className="group relative p-7 rounded-2xl bg-white border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-default overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-green-50 to-purple-50 rounded-2xl"/>
              <div className={`relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-md`}><service.icon size={22} className="text-white"/></div>
              <h3 className="relative z-10 text-gray-900 font-bold text-xl mb-3 font-display">{service.title}</h3>
              <p className="relative z-10 text-gray-500 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
