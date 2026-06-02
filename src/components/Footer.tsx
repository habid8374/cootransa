import { Instagram, Facebook, MessageCircle } from 'lucide-react'
import Brand from './Brand'

const nosotrosItems = [
  { label: 'Historia', href: '/nosotros/historia' },
  { label: 'En la Actualidad', href: '/nosotros/actualidad' },
  { label: 'Nuestra Misión', href: '/nosotros/mision' },
  { label: 'Nuestra Visión', href: '/nosotros/vision' },
  { label: 'Nuestra Política', href: '/nosotros/politica' },
  { label: 'Valores', href: '/nosotros/valores' },
  { label: 'Nuestro Objetivo', href: '/nosotros/objetivo' },
]

const policyItems = [
  { label: 'Gestión Integral', href: '/politicas/gestion-integral' },
  { label: 'Seguridad Vial', href: '/politicas/seguridad-vial' },
  { label: 'Alcohol y Drogas', href: '/politicas/alcohol-drogas' },
  { label: 'Acoso Sexual y VBG', href: '/politicas/acoso-sexual-vbg' },
  { label: 'Tratamiento de Datos', href: '/politicas/tratamiento-datos' },
  { label: 'Desconexión Laboral', href: '/politicas/desconexion-laboral' },
  { label: 'Salud Mental', href: '/politicas/salud-mental' },
]

const legalItems = [
  { label: 'Política de Privacidad', href: '/legal/privacidad' },
  { label: 'Política de Cookies', href: '/legal/cookies' },
  { label: 'Términos y Condiciones', href: '/legal/terminos' },
]

export default function Footer() {
  return (
    <footer className="bg-[#050810] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="mb-4"><Brand iconClass="h-12" textClass="text-2xl" tagline taglineClass="text-[9px]" /></div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 mt-2">Cooperativa de Transportadores de Sabanalarga Ltda®. Moviendo el Caribe colombiano desde 1972.</p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/cootransaoficial" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"><Instagram size={16}/></a>
              <a href="https://www.facebook.com/share/17fNJkiDeV/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"><Facebook size={16}/></a>
              <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"><MessageCircle size={16}/></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-5">Nosotros</h4>
            <ul className="space-y-3">{nosotrosItems.map(item=>(<li key={item.href}><a href={item.href} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 text-sm transition-colors">{item.label}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-5">Servicios</h4>
            <ul className="space-y-3">{['Transporte Estudiantil','Transporte Empresarial','Transporte Turístico','Rutas Intermunicipales','Convenios Corporativos'].map(item=>(<li key={item}><a href="/#servicios" className="text-zinc-400 hover:text-green-400 text-sm transition-colors">{item}</a></li>))}</ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3 text-sm">Políticas</h4>
              <ul className="space-y-2">{policyItems.map(item=>(<li key={item.href}><a href={item.href} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-green-400 text-xs transition-colors">{item.label}</a></li>))}</ul>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-5">Contacto</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>Calle 27 No. 29 - 50</li><li>Carretera La Cordialidad</li><li>Sabanalarga, Atlántico</li>
              <li className="pt-2"><a href="mailto:cootransaltda1972@cootransa-ltda.com" className="hover:text-green-400 transition-colors break-all">cootransaltda1972@cootransa-ltda.com</a></li>
              <li><a href="mailto:gerenciacootransa@gmail.com" className="hover:text-green-400 transition-colors">gerenciacootransa@gmail.com</a></li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2">{legalItems.map(item=>(<li key={item.href}><a href={item.href} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-green-400 text-xs transition-colors">{item.label}</a></li>))}</ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-zinc-500 text-sm">© 2026 COOTRANSA Ltda® — Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
              title="Acceso administrativo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Administrar
            </a>
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <span>Powered by</span>
              <a href="https://axentiatech.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors font-medium">
                <img src="/logo_axentia_A.png" alt="axentiatech" className="h-5 w-auto object-contain"/>
                axentiatech
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
