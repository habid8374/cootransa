import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { supabase, type CarnetSolicitud } from '../lib/supabase'

type Estado = 'cargando' | 'valido' | 'vencido' | 'invalido'

function fmt(d?: string) {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function VerificarPage() {
  const { codigo } = useParams()
  const [estado, setEstado] = useState<Estado>('cargando')
  const [sol, setSol] = useState<CarnetSolicitud | null>(null)

  useEffect(() => {
    document.title = 'Verificar carnet – COOTRANSA'
    async function load() {
      const { data } = await supabase.from('carnet_solicitudes').select('*').eq('codigo', codigo).eq('estado', 'aprobado').single()
      if (!data) { setEstado('invalido'); return }
      setSol(data)
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
      const fin = data.vigencia_fin ? new Date(data.vigencia_fin + 'T23:59:59') : null
      const ini = data.vigencia_inicio ? new Date(data.vigencia_inicio + 'T00:00:00') : null
      const vigente = (!ini || hoy >= ini) && (!fin || hoy <= fin)
      setEstado(vigente ? 'valido' : 'vencido')
    }
    load()
  }, [codigo])

  if (estado === 'cargando') return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-white" /></div>

  const config = {
    valido:   { bg: 'from-green-600 to-emerald-500', icon: CheckCircle2, titulo: 'CARNET VÁLIDO', sub: 'Tarifa preferencial vigente' },
    vencido:  { bg: 'from-orange-600 to-amber-500',  icon: AlertTriangle, titulo: 'CARNET VENCIDO', sub: 'La vigencia ha expirado' },
    invalido: { bg: 'from-red-700 to-red-500',       icon: XCircle,       titulo: 'CARNET NO VÁLIDO', sub: 'No encontrado o no aprobado' },
  }[estado]
  const Icon = config.icon

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bg} flex flex-col items-center justify-center p-4 text-white`}>
      <Icon size={90} className="mb-4 drop-shadow-lg" strokeWidth={1.5} />
      <h1 className="text-3xl font-black tracking-tight text-center">{config.titulo}</h1>
      <p className="text-white/85 mt-1">{config.sub}</p>

      {sol && (
        <div className="mt-8 w-full max-w-sm bg-white/12 backdrop-blur-sm rounded-2xl border border-white/20 p-5 space-y-3">
          {sol.foto_url && <img src={sol.foto_url} alt={sol.nombre} className="w-24 h-28 rounded-xl object-cover mx-auto border-2 border-white/40" />}
          <div className="text-center">
            <p className="text-xl font-bold">{sol.nombre}</p>
            <p className="text-white/80 text-sm">C.C. {sol.cedula}</p>
          </div>
          <div className="border-t border-white/20 pt-3 space-y-2 text-sm">
            <Row label="Institución" value={sol.institucion} />
            {sol.categoria_nombre && <Row label="Categoría" value={sol.categoria_nombre} />}
            <Row label="Vigencia" value={`${fmt(sol.vigencia_inicio)} — ${fmt(sol.vigencia_fin)}`} />
            <Row label="Código" value={sol.codigo} mono />
          </div>
        </div>
      )}

      <p className="mt-8 text-xs text-white/70">COOTRANSA Ltda. · Verificación oficial de carnet</p>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-white/70 shrink-0">{label}</span>
      <span className={`font-semibold text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}
