import { Shield, ExternalLink } from 'lucide-react'

export default function AdminUsuarios() {
  return (
    <div>
      <div className="mb-6"><h1 className="text-xl font-bold text-gray-900">Usuarios</h1><p className="text-sm text-gray-500 mt-0.5">Control de acceso al panel administrativo</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"><Shield size={18} className="text-amber-600"/></div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-1">Gestión de usuarios</h2>
            <p className="text-sm text-gray-500">Los usuarios del panel se crean y administran directamente desde el dashboard de Supabase, en la sección <strong>Authentication → Users</strong>.</p>
          </div>
        </div>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
          <ExternalLink size={14}/> Abrir Supabase Dashboard
        </a>
      </div>
    </div>
  )
}
