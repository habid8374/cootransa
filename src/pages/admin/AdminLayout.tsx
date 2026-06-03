import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Brand from '../../components/Brand'
import { LayoutDashboard, Newspaper, DollarSign, Clock, Mail, Users, Settings, LogOut, Menu } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard',      icon: LayoutDashboard, end: true },
  { to: '/admin/noticias', label: 'Noticias', icon: Newspaper },
  { to: '/admin/tarifas',  label: 'Tarifas',  icon: DollarSign },
  { to: '/admin/horarios', label: 'Horarios', icon: Clock },
  { to: '/admin/mensajes', label: 'Mensajes', icon: Mail },
]
const configItems = [
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/ajustes',  label: 'Ajustes',  icon: Settings },
]

export default function AdminLayout({ userEmail }: { userEmail: string }) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  const initials = userEmail.slice(0, 2).toUpperCase()

  const SidebarContent = () => (
    <aside className="w-full flex flex-col h-full bg-white border-r border-gray-100">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <Brand iconClass="h-9" textClass="text-base" />
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-gray-400">Admin</span>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 py-2">Principal</p>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </NavLink>
        ))}

        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 py-2 mt-3">Configuración</p>
        {configItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 truncate">{userEmail}</p>
          <p className="text-[10px] text-gray-400">Administrador</p>
        </div>
        <button onClick={handleLogout} title="Cerrar sesión"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex flex-col w-60 fixed inset-y-0 z-20">
        <SidebarContent />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 lg:px-6 h-14 flex items-center justify-between">
          <button className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition"
            style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
            Ver sitio →
          </a>
        </div>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
