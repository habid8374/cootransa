import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Shield, User, Mail, Clock } from 'lucide-react'

interface UserInfo {
  id: string
  email: string
  created_at: string
  last_sign_in_at?: string
}

export default function AdminUsuarios() {
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({
        id: data.user.id,
        email: data.user.email ?? '',
        created_at: data.user.created_at,
        last_sign_in_at: data.user.last_sign_in_at,
      })
    })
  }, [])

  const fmt = (d?: string) => d ? new Date(d).toLocaleString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-sm text-gray-500 mt-0.5">Control de acceso al panel administrativo</p>
      </div>

      <div className="max-w-lg space-y-5">
        {/* Usuario activo */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={15} className="text-green-600"/> Usuario activo
          </h2>
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                  {user.email.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Administrador</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">Activo</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                <div className="flex items-start gap-2">
                  <Mail size={13} className="text-gray-400 mt-0.5 shrink-0"/>
                  <div><p className="font-semibold text-gray-700 mb-0.5">Correo</p><p className="break-all">{user.email}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={13} className="text-gray-400 mt-0.5 shrink-0"/>
                  <div><p className="font-semibold text-gray-700 mb-0.5">Último acceso</p><p>{fmt(user.last_sign_in_at)}</p></div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">Cargando...</p>
          )}
        </div>

        {/* Aviso */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Shield size={18} className="text-amber-600"/>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-1">¿Necesitas crear o editar un usuario?</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                La creación, modificación o eliminación de usuarios del panel está restringida por seguridad.
                Para solicitar cambios, contacta al administrador o soporte técnico del sitio:
              </p>
              <div className="mt-3 space-y-1.5">
                <a href="mailto:soporte@axentiatech.com" className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:underline">
                  <Mail size={14}/> soporte@axentiatech.com
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Desarrollado y mantenido por <strong className="text-gray-500">axentiatech</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
