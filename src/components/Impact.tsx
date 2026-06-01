import { motion } from 'framer-motion'
import { BookOpen, Building2, Compass, Users } from 'lucide-react'

const impacts = [
  { icon: BookOpen, color: 'from-green-600 to-emerald-400', title: 'Educación', description: 'Miles de estudiantes llegan cada día a sus colegios y universidades gracias a nuestro servicio. Somos parte de su formación.' },
  { icon: Building2, color: 'from-purple-600 to-purple-400', title: 'Empresas', description: 'Trabajadores de industrias y empresas del Atlántico se conectan con sus lugares de trabajo con puntualidad y confianza.' },
  { icon: Compass, color: 'from-yellow-600 to-yellow-400', title: 'Turismo', description: 'Abrimos el Caribe colombiano al mundo. Destinos turísticos que antes eran lejanos, hoy son alcanzables con COOTRANSA.' },
  { icon: Users, color: 'from-blue-600 to-blue-400', title: 'Comunidades', description: 'Somos motor de desarrollo regional. Cada ruta que operamos impulsa la economía y calidad de vida de los municipios del Atlántico.' },
]

const allies = [
  { name: 'ACOLTÉS', img: '/acoltes.png' },
  { name: 'Clínica General del Norte', img: '/clinicageneraldelnorte.png' },
  { name: 'ASOTRANS', img: '/logo_asotrans.jpg' },
  { name: 'Universidad del Atlántico', img: '/Logo_de_la_Universidad_del_Atlántico.png' },
]

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
      <section className="py-20 bg-[#070C1A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-zinc-500 text-sm font-semibold tracking-widest uppercase">Nuestros aliados estratégicos</motion.p>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {allies.map((ally, i) => (
              <motion.div
                key={ally.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                  className="relative h-32 sm:h-36 rounded-2xl bg-white border border-white/10 shadow-xl flex items-center justify-center p-6 overflow-hidden"
                >
                  <span className="pointer-events-none absolute -inset-x-10 -top-1/2 h-[200%] w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.1s_ease-in-out] " />
                  <img
                    src={ally.img}
                    alt={ally.name}
                    loading="lazy"
                    className="max-h-20 sm:max-h-24 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const t = e.currentTarget
                      t.style.display = 'none'
                      const fb = t.nextElementSibling as HTMLElement | null
                      if (fb) fb.style.display = 'flex'
                    }}
                  />
                  <span className="hidden absolute inset-0 items-center justify-center text-center px-3 text-zinc-800 font-bold text-sm">{ally.name}</span>
                </motion.div>
                <p className="mt-3 text-center text-zinc-400 text-xs sm:text-sm font-medium">{ally.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
