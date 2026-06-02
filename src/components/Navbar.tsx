import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Instagram, Facebook } from 'lucide-react'
import Brand from './Brand'

const servicesItems = [
  { label: 'Transporte Estudiantil', href: '/#servicios' },
  { label: 'Transporte Empresarial', href: '/#servicios' },
  { label: 'Transporte Turístico', href: '/#servicios' },
  { label: 'Rutas Intermunicipales', href: '/#servicios' },
  { label: 'Convenios Corporativos', href: '/#servicios' },
  { label: 'Logística y Movilidad', href: '/#servicios' },
]

const policiesItems = [
  { label: 'Política de Gestión Integral', href: '/politicas/gestion-integral' },
  { label: 'Política de Seguridad Vial', href: '/politicas/seguridad-vial' },
  { label: 'Prevención de Alcohol y Drogas', href: '/politicas/alcohol-drogas' },
  { label: 'Acoso Sexual Laboral y VBG', href: '/politicas/acoso-sexual-vbg' },
  { label: 'Tratamiento de Datos Personales', href: '/politicas/tratamiento-datos' },
  { label: 'Desconexión Laboral', href: '/politicas/desconexion-laboral' },
  { label: 'Salud Mental', href: '/politicas/salud-mental' },
]

const nosotrosItems = [
  { label: 'Historia', href: '/nosotros/historia' },
  { label: 'En la Actualidad', href: '/nosotros/actualidad' },
  { label: 'Nuestra Misión', href: '/nosotros/mision' },
  { label: 'Nuestra Visión', href: '/nosotros/vision' },
  { label: 'Nuestra Política', href: '/nosotros/politica' },
  { label: 'Valores', href: '/nosotros/valores' },
  { label: 'Nuestro Objetivo', href: '/nosotros/objetivo' },
]

const noticiasItems = [
  { label: 'Tarifas', href: '/noticias/tarifas' },
  { label: 'Horarios de estaciones', href: '/noticias/horarios' },
  { label: 'Noticias', href: '/noticias/noticias' },
  { label: 'Convocatoria laboral', href: '/noticias/convocatoria' },
]

function SocialIcons({ size = 16 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <a
        href="https://www.instagram.com/cootransaoficial"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="group relative flex items-center justify-center w-8 h-8 rounded-xl
          bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400
          shadow-[0_2px_8px_rgba(219,39,119,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
          hover:shadow-[0_4px_14px_rgba(219,39,119,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]
          hover:scale-110 hover:-translate-y-0.5
          active:scale-95 active:translate-y-0
          transition-all duration-200"
      >
        <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Instagram size={size} className="text-white relative z-10" />
      </a>
      <a
        href="https://www.facebook.com/share/17fNJkiDeV/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="group relative flex items-center justify-center w-8 h-8 rounded-xl
          bg-gradient-to-br from-blue-600 to-blue-500
          shadow-[0_2px_8px_rgba(37,99,235,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
          hover:shadow-[0_4px_14px_rgba(37,99,235,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]
          hover:scale-110 hover:-translate-y-0.5
          active:scale-95 active:translate-y-0
          transition-all duration-200"
      >
        <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Facebook size={size} className="text-white relative z-10" />
      </a>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileNosotros, setMobileNosotros] = useState(false)
  const [mobileServicios, setMobileServicios] = useState(false)
  const [mobilePoliticas, setMobilePoliticas] = useState(false)
  const [mobileNoticias, setMobileNoticias] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const link = scrolled
    ? 'text-gray-700 hover:text-green-600'
    : 'text-white/90 hover:text-white drop-shadow'

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md border-b border-gray-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="/#inicio" className="flex items-center">
            <Brand iconClass="h-9 lg:h-11" textClass="text-xl lg:text-2xl" />
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            <a href="/#inicio" className={`${link} text-sm font-medium transition-colors duration-200 relative group`}>
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
            </a>
            <div className="relative group">
              <button className={`flex items-center gap-1 ${link} text-sm font-medium transition-colors duration-200`}>
                Servicios <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180"/>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-64 rounded-2xl bg-white border border-gray-200 shadow-xl p-2">
                  {servicesItems.map(item => (
                    <a key={item.label} href={item.href} className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-green-50 transition-colors">{item.label}</a>
                  ))}
                </div>
              </div>
            </div>
            <a href="/#rutas" className={`${link} text-sm font-medium transition-colors duration-200 relative group`}>
              Rutas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
            </a>
            <div className="relative group">
              <button className={`flex items-center gap-1 ${link} text-sm font-medium transition-colors duration-200`}>
                Nosotros <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180"/>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-60 rounded-2xl bg-white border border-gray-200 shadow-xl p-2">
                  {nosotrosItems.map(item => (
                    <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-green-50 transition-colors">{item.label}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className={`flex items-center gap-1 ${link} text-sm font-medium transition-colors duration-200`}>
                Políticas <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180"/>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-72 rounded-2xl bg-white border border-gray-200 shadow-xl p-2">
                  {policiesItems.map(item => (
                    <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-green-50 transition-colors">{item.label}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className={`flex items-center gap-1 ${link} text-sm font-medium transition-colors duration-200`}>
                Noticias <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180"/>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-56 rounded-2xl bg-white border border-gray-200 shadow-xl p-2">
                  {noticiasItems.map(item => (
                    <a key={item.href} href={item.href} className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-green-50 transition-colors">{item.label}</a>
                  ))}
                </div>
              </div>
            </div>
            <a href="/#contacto" className={`${link} text-sm font-medium transition-colors duration-200 relative group`}>
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
            </a>
          </div>

          {/* Desktop right: social + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <SocialIcons size={15} />
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <a href="/#contacto" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-green-500/25 hover:scale-105">Solicitar Servicio</a>
          </div>

          {/* Mobile right: social + hamburger */}
          <div className="lg:hidden flex items-center gap-2.5">
            <SocialIcons size={15} />
            <button
              className={`p-1.5 transition-colors ${scrolled ? 'text-gray-700' : 'text-white drop-shadow'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-b border-gray-200 overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-1">
              <a href="/#inicio" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-green-600 font-medium py-3 transition-colors">Inicio</a>
              <button onClick={() => setMobileServicios(!mobileServicios)} className="flex items-center justify-between text-gray-700 hover:text-green-600 font-medium py-3 transition-colors">
                Servicios <ChevronDown size={16} className={`transition-transform ${mobileServicios ? 'rotate-180' : ''}`}/>
              </button>
              <AnimatePresence>
                {mobileServicios && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 flex flex-col">
                    {servicesItems.map(item => (
                      <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-green-600 text-sm py-2.5 transition-colors">{item.label}</a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <a href="/#rutas" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-green-600 font-medium py-3 transition-colors">Rutas</a>
              <button onClick={() => setMobileNosotros(!mobileNosotros)} className="flex items-center justify-between text-gray-700 hover:text-green-600 font-medium py-3 transition-colors">
                Nosotros <ChevronDown size={16} className={`transition-transform ${mobileNosotros ? 'rotate-180' : ''}`}/>
              </button>
              <AnimatePresence>
                {mobileNosotros && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 flex flex-col">
                    {nosotrosItems.map(item => (
                      <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-green-600 text-sm py-2.5 transition-colors">{item.label}</a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setMobilePoliticas(!mobilePoliticas)} className="flex items-center justify-between text-gray-700 hover:text-green-600 font-medium py-3 transition-colors">
                Políticas <ChevronDown size={16} className={`transition-transform ${mobilePoliticas ? 'rotate-180' : ''}`}/>
              </button>
              <AnimatePresence>
                {mobilePoliticas && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 flex flex-col">
                    {policiesItems.map(item => (
                      <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-green-600 text-sm py-2.5 transition-colors">{item.label}</a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setMobileNoticias(!mobileNoticias)} className="flex items-center justify-between text-gray-700 hover:text-green-600 font-medium py-3 transition-colors">
                Noticias <ChevronDown size={16} className={`transition-transform ${mobileNoticias ? 'rotate-180' : ''}`}/>
              </button>
              <AnimatePresence>
                {mobileNoticias && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 flex flex-col">
                    {noticiasItems.map(item => (
                      <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-green-600 text-sm py-2.5 transition-colors">{item.label}</a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <a href="/#contacto" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-green-600 font-medium py-3 transition-colors">Contacto</a>
              <a href="/#contacto" onClick={() => setMobileOpen(false)} className="mt-3 px-5 py-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold text-center">Solicitar Servicio</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
