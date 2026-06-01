import { Instagram, Facebook, MessageCircle } from 'lucide-react'

const Logo = () => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <circle cx="32" cy="32" r="31" fill="#1B5E10"/>
    <defs><clipPath id="lc-footer"><circle cx="32" cy="32" r="29"/></clipPath></defs>
    <polygon points="0,0 45,0 0,45" fill="#2E8B1A" clipPath="url(#lc-footer)"/>
    <polygon points="45,0 64,0 64,19 19,64 0,64 0,45" fill="#F5D800" clipPath="url(#lc-footer)"/>
    <polygon points="64,19 64,64 19,64" fill="#6B21A8" clipPath="url(#lc-footer)"/>
    <g clipPath="url(#lc-footer)" fill="white">
      <polygon points="22,38 27,38 27,48 17,48 17,38"/>
      <polygon points="12,38 22,24 32,38"/>
      <polygon points="37,38 42,38 42,48 32,48 32,38"/>
      <polygon points="27,38 37,24 47,38"/>
    </g>
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-[#050810] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4"><Logo/><span className="text-xl font-bold font-display bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">COOTRANSA</span></div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">Cooperativa de Transportadores de Sabanalarga Ltda®. Moviendo el Caribe colombiano desde 1972.</p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/cootransaoficial" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"><Instagram size={16}/></a>
              <a href="https://www.facebook.com/share/17fNJkiDeV/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"><Facebook size={16}/></a>
              <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"><MessageCircle size={16}/></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-5">Empresa</h4>
            <ul className="space-y-3">{['Historia','Misión y Visión','Certificaciones','Nuestros Socios','Responsabilidad Social'].map(item=>(<li key={item}><a href="#nosotros" className="text-zinc-400 hover:text-green-400 text-sm transition-colors">{item}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-5">Servicios</h4>
            <ul className="space-y-3">{['Transporte Estudiantil','Transporte Empresarial','Transporte Turístico','Rutas Intermunicipales','Convenios Corporativos'].map(item=>(<li key={item}><a href="#servicios" className="text-zinc-400 hover:text-green-400 text-sm transition-colors">{item}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-5">Contacto</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>Calle 27 No. 29 - 50</li><li>Carretera La Cordialidad</li><li>Sabanalarga, Atlántico</li>
              <li className="pt-2"><a href="mailto:cootransaltda1972@cootransa-ltda.com" className="hover:text-green-400 transition-colors break-all">cootransaltda1972@cootransa-ltda.com</a></li>
              <li><a href="mailto:gerenciacootransa@gmail.com" className="hover:text-green-400 transition-colors">gerenciacootransa@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">© 2025 COOTRANSA Ltda® — Todos los derechos reservados.</p>
          <p className="text-zinc-600 text-xs">Powered by tecnología moderna al servicio de la movilidad regional</p>
        </div>
      </div>
    </footer>
  )
}
