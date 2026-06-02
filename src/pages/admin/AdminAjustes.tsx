import { ExternalLink, Database, Globe } from 'lucide-react'

export default function AdminAjustes() {
  return (
    <div>
      <div className="mb-6"><h1 className="text-xl font-bold text-gray-900">Ajustes del sitio</h1><p className="text-sm text-gray-500 mt-0.5">Configuración general de COOTRANSA</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe size={16} className="text-green-600"/> Información del sitio</h2>
          <div className="space-y-3">
            {[['Nombre de la empresa','COOTRANSA Ltda.'],['WhatsApp de contacto','+57 300 000 0000'],['Email de contacto','gerenciacootransa@gmail.com'],['Dirección','Cra. 19 #20-45, Sabanalarga, Atlántico']].map(([label, value]) => (
              <div key={label}><label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label><input defaultValue={value} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"/></div>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>Guardar cambios</button>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Database size={16} className="text-blue-600"/> Base de datos</h2>
            <p className="text-xs text-gray-500 mb-4">Gestiona tablas, usuarios y storage desde el dashboard de Supabase.</p>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition"><ExternalLink size={14}/> Abrir Supabase Dashboard</a>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Sitio web en producción</h2>
            <p className="text-xs text-gray-500 mb-4">El sitio se despliega automáticamente en Vercel con cada cambio.</p>
            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition"><ExternalLink size={14}/> Abrir Vercel Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  )
}
