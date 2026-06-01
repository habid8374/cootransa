import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Logo = () => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <circle cx="32" cy="32" r="31" fill="#1B5E10"/>
    <defs><clipPath id="lc-nav"><circle cx="32" cy="32" r="29"/></clipPath></defs>
    <polygon points="0,0 45,0 0,45" fill="#2E8B1A" clipPath="url(#lc-nav)"/>
    <polygon points="45,0 64,0 64,19 19,64 0,64 0,45" fill="#F5D800" clipPath="url(#lc-nav)"/>
    <polygon points="64,19 64,64 19,64" fill="#6B21A8" clipPath="url(#lc-nav)"/>
    <g clipPath="url(#lc-nav)" fill="white">
      <polygon points="22,38 27,38 27,48 17,48 17,38"/>
      <polygon points="12,38 22,24 32,38"/>
      <polygon points="37,38 42,38 42,48 32,48 32,38"/>
      <polygon points="27,38 37,24 47,38"/>
    </g>
  </svg>
)

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Rutas', href: '#rutas' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#inicio" className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-bold font-display bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent tracking-wider">COOTRANSA</span>
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-zinc-300 hover:text-white text-sm font-medium transition-colors duration-200 relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          <div className="hidden lg:block">
            <a href="#contacto" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-green-900/40 hover:scale-105">Solicitar Servicio</a>
          </div>
          <button className="lg:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-zinc-300 hover:text-white font-medium py-2 transition-colors">{link.label}</a>
              ))}
              <a href="#contacto" onClick={() => setMobileOpen(false)} className="mt-2 px-5 py-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold text-center">Solicitar Servicio</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
