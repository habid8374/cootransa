import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import AdminDashboard from './AdminDashboard'
import AdminNoticias from './AdminNoticias'
import AdminTarifas from './AdminTarifas'
import AdminHorarios from './AdminHorarios'
import AdminUsuarios from './AdminUsuarios'
import AdminAjustes from './AdminAjustes'
import type { Session } from '@supabase/supabase-js'

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!session) return <AdminLogin />

  return (
    <Routes>
      <Route element={<AdminLayout userEmail={session.user.email ?? ''} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="noticias" element={<AdminNoticias />} />
        <Route path="tarifas"  element={<AdminTarifas />} />
        <Route path="horarios" element={<AdminHorarios />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="ajustes"  element={<AdminAjustes />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
