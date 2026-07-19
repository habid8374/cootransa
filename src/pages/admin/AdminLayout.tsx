import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Brand from '../../components/Brand'
import { LayoutDashboard, Newspaper, DollarSign, Clock, Mail, Users, Settings, LogOut, Menu, X, Fingerprint, ExternalLink, CreditCard, QrCode } from 'lucide-react'

const ASISTENCIA_URL = 'https://cootransa-asistencia.vercel.app'

const navItems = [
  { to: '/admin', label: 'Dashboard',      icon: LayoutDashboard, end: true },
  { to: '/admin/noticias', label: 'Noticias', icon: Newspaper },
  { to: '/admin/tarifas',  label: 'Tarifas',  icon: DollarSign },
  { to: '/admin/horarios', label: 'Horarios', icon: Clock },
  { to: '/admin/mensajes', label: 'Mensajes', icon: Mail },
  { to: '/admin/carnets',  label: 'Carnets',  icon: CreditCard },
]
const configItems = [
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/ajustes',  label: 'Ajustes',  icon: Settings },
]

interface ToastData { titulo: string; nombre: string; mensaje: string; to: string }

export default function AdminLayout({ userEmail }: { userEmail: string }) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [carnetsPend, setCarnetsPend] = useState(0)
  const [toast, setToast] = useState<ToastData | null>(null)

  const beep = () => { try { new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==').play().catch(() => {}) } catch {} }

  // Conteos iniciales
  useEffect(() => {
    supabase.from('mensajes').select('id', { count: 'exact', head: true }).eq('leido', false)
      .then(({ count }) => setUnread(count ?? 0))
    supabase.from('carnet_solicitudes').select('id', { count: 'exact', head: true }).eq('estado', 'pendiente')
      .then(({ count }) => setCarnetsPend(count ?? 0))
  }, [])

  // Realtime: mensajes
  useEffect(() => {
    const channel = supabase
      .channel('mensajes-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, (payload) => {
        const m = payload.new as { nombre: string; mensaje: string }
        setUnread(u => u + 1)
        setToast({ titulo: 'Nuevo mensaje', nombre: m.nombre, mensaje: m.mensaje, to: '/admin/mensajes' })
        beep()
        setTimeout(() => setToast(null), 6000)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mensajes' }, () => {
        supabase.from('mensajes').select('id', { count: 'exact', head: true }).eq('leido', false)
          .then(({ count }) => setUnread(count ?? 0))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  // Realtime: solicitudes de carnet
  useEffect(() => {
    const channel = supabase
      .channel('carnets-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'carnet_solicitudes' }, (payload) => {
        const s = payload.new as { nombre: string; institucion: string }
        setCarnetsPend(n => n + 1)
        setToast({ titulo: 'Nueva solicitud de carnet', nombre: s.nombre, mensaje: s.institucion, to: '/admin/carnets' })
        beep()
        setTimeout(() => setToast(null), 6000)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'carnet_solicitudes' }, () => {
        supabase.from('carnet_solicitudes').select('id', { count: 'exact', head: true }).eq('estado', 'pendiente')
          .then(({ count }) => setCarnetsPend(count ?? 0))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

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
            {to === '/admin/mensajes' && unread > 0 && (
              <span className="ml-auto text-[10px] font-bold text-white bg-green-500 rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{unread}</span>
            )}
            {to === '/admin/carnets' && carnetsPend > 0 && (
              <span className="ml-auto text-[10px] font-bold text-white bg-amber-500 rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{carnetsPend}</span>
            )}
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

        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 py-2 mt-3">Herramientas</p>
        <a
          href={ASISTENCIA_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <Fingerprint size={16} className="shrink-0" />
          Asistencia
          <ExternalLink size={12} className="ml-auto text-gray-300" />
        </a>
        <a
          href="/verificar"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <QrCode size={16} className="shrink-0" />
          Verificar Carnet
          <ExternalLink size={12} className="ml-auto text-gray-300" />
        </a>
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

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
              className="absolute left-0 top-0 bottom-0 w-64 shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 lg:ml-60 flex flex-col min-h-screen">
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

      {/* Toast de notificación (mensaje o solicitud de carnet) */}
      {toast && (
        <div className="fixed top-4 right-4 z-[80] w-80 max-w-[calc(100vw-2rem)] animate-[slideIn_.3s_ease-out]">
          <button
            onClick={() => { setToast(null); navigate(toast.to) }}
            className="w-full text-left bg-white rounded-xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-xl transition"
          >
            <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              {toast.to === '/admin/carnets' ? <CreditCard size={16} className="text-green-600" /> : <Mail size={16} className="text-green-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wide">{toast.titulo}</p>
              <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{toast.nombre}</p>
              <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{toast.mensaje}</p>
            </div>
            <span onClick={(e) => { e.stopPropagation(); setToast(null) }} className="p-1 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition shrink-0"><X size={15}/></span>
          </button>
        </div>
      )}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  )
}
