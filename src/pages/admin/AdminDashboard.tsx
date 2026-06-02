import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Newspaper, DollarSign, Clock, ArrowRight } from 'lucide-react'

interface Stats { noticias: number; tarifas: number; horarios: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ noticias: 0, tarifas: 0, horarios: 0 })
  const [noticias, setNoticias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [n, t, h] = await Promise.all([
        supabase.from('noticias').select('id,title,seccion,estado,created_at', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
        supabase.from('tarifas').select('id', { count: 'exact' }),
        supabase.from('horarios').select('id', { count: 'exact' }),
      ])
      setStats({ noticias: n.count ?? 0, tarifas: t.count ?? 0, horarios: h.count ?? 0 })
      setNoticias(n.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Noticias publicadas', value: stats.noticias, icon: Newspaper,  color: 'text-green-600',  bg: 'bg-green-50',  href: '/admin/noticias' },
    { label: 'Tarifas activas',     value: stats.tarifas,  icon: DollarSign, color: 'text-blue-600',   bg: 'bg-blue-50',   href: '/admin/tarifas' },
    { label: 'Rutas con horario',   value: stats.horarios, icon: Clock,      color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/horarios' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen general del sitio COOTRANSA</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} to={href} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{loading ? '—' : value}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Noticias recientes</h2>
          <Link to="/admin/noticias" className="text-xs text-green-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Ver todas <ArrowRight size={12} />
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Título</th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Sección</th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-400">Cargando...</td></tr>
            ) : noticias.length === 0 ? (
              <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-400">No hay noticias. <Link to="/admin/noticias" className="text-green-600 font-semibold">Crear primera noticia →</Link></td></tr>
            ) : noticias.map(n => (
              <tr key={n.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                <td className="px-5 py-3 text-sm text-gray-800 font-medium">{n.title}</td>
                <td className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell">{n.seccion}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    n.estado === 'publicado' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {n.estado === 'publicado' ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
