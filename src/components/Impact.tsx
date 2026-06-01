import { motion } from 'framer-motion'
import { BookOpen, Building2, Compass, Users } from 'lucide-react'

const impacts = [
  { icon: BookOpen, color: 'from-green-600 to-emerald-400', title: 'Educación', description: 'Miles de estudiantes llegan cada día a sus colegios y universidades gracias a nuestro servicio. Somos parte de su formación.' },
  { icon: Building2, color: 'from-purple-600 to-purple-400', title: 'Empresas', description: 'Trabajadores de industrias y empresas del Atlántico se conectan con sus lugares de trabajo con puntualidad y confianza.' },
  { icon: Compass, color: 'from-yellow-600 to-yellow-400', title: 'Turismo', description: 'Abrimos el Caribe colombiano al mundo. Destinos turísticos que antes eran lejanos, hoy son alcanzables con COOTRANSA.' },
  { icon: Users, color: 'from-blue-600 to-blue-400', title: 'Comunidades', description: 'Somos motor de desarrollo regional. Cada ruta que operamos impulsa la economía y calidad de vida de los municipios del Atlántico.' },
]

const allies = ['ASOTRANS','ACOLTÉS','Clínica General del Norte','Universidad del Atlántico','ASOTRANS','ACOLTÉS','Clínica General del Norte','Universidad del Atlántico']

export default function Impact() {
  return (
    <>
      <section className="py-24 bg-[#0A0F1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-yellow-400 text-sm font-semibold tracking-widest uppercase">Impacto social</span>
            <h2 className="text-4xl lg:text-5xl font-black font-display text-white mt-3">Transformamos vidas,<br/><span className="bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">construimos región.</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }} className="group text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}><item.icon size={24} className="text-white"/></div>
                <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#070C1A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-zinc-500 text-sm font-semibold tracking-widest uppercase">Nuestros aliados estratégicos</motion.p>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#070C1A] to-transparent z-10"/>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070C1A] to-transparent z-10"/>
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {allies.map((ally, i) => (
                <div key={i} className="inline-flex items-center gap-3 mx-10 text-zinc-300 font-semibold text-lg">
                  <span className="w-2 h-2 rounded-full bg-green-500"/>{ally}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
