import { Instagram, Facebook, MessageCircle } from 'lucide-react'
import Brand from './Brand'

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
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-zinc-500 text-sm">© 2026 COOTRANSA Ltda® — Todos los derechos reservados.</p>
          <p className="text-zinc-600 text-xs">Powered by tecnología moderna al servicio de la movilidad regional · Desarrollado por <a href="#" className="text-green-500 hover:text-green-400 font-medium transition-colors">axentiatech</a></p>
        </div>
      </div>
    </footer>
  )
}
