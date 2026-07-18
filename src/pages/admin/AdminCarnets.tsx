import { useEffect, useState } from 'react'
import { supabase, type CarnetSolicitud, type CarnetCategoria, type CarnetDocumento, type EstadoSolicitud } from '../../lib/supabase'
import { CreditCard, Tags, FileCheck2, Plus, Trash2, X, Check, Ban, ExternalLink, Copy, Search, FileText, Pencil, BarChart3 } from 'lucide-react'
import { notificarCarnetAprobado } from '../../lib/notify'

type Tab = 'solicitudes' | 'estadisticas' | 'categorias' | 'documentos'
type Filtro = 'todas' | EstadoSolicitud

const PAGE = 20

export default function AdminCarnets() {
  const [tab, setTab] = useState<Tab>('solicitudes')
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Carnets — Tarifa Preferencial</h1>
        <p className="text-sm text-gray-500 mt-0.5">Solicitudes, categorías y documentos requeridos</p>
      </div>
      <div className="flex flex-wrap gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit max-w-full">
        {([['solicitudes', CreditCard, 'Solicitudes'], ['estadisticas', BarChart3, 'Estadísticas'], ['categorias', Tags, 'Categorías'], ['documentos', FileCheck2, 'Documentos']] as const).map(([k, Icon, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition ${tab === k ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}><Icon size={15}/> {label}</button>
        ))}
      </div>
      {tab === 'solicitudes' && <Solicitudes />}
      {tab === 'estadisticas' && <Estadisticas />}
      {tab === 'categorias' && <Categorias />}
      {tab === 'documentos' && <Documentos />}
    </div>
  )
}

/* ─────────────── SOLICITUDES ─────────────── */
function Solicitudes() {
  const [rows, setRows] = useState<CarnetSolicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>('pendiente')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [pendientes, setPendientes] = useState(0)
  const [open, setOpen] = useState<CarnetSolicitud | null>(null)

  const load = async () => {
    setLoading(true)
    let query = supabase.from('carnet_solicitudes').select('*', { count: 'exact' })
    if (filtro !== 'todas') query = query.eq('estado', filtro)
    if (desde) query = query.gte('created_at', desde)
    if (hasta) query = query.lte('created_at', hasta + 'T23:59:59')
    if (q.trim()) query = query.or(`nombre.ilike.%${q}%,cedula.ilike.%${q}%`)
    query = query.order('created_at', { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1)
    const { data, count } = await query
    setRows(data ?? []); setTotal(count ?? 0); setLoading(false)
  }
  const loadPendientes = () => supabase.from('carnet_solicitudes').select('id', { count: 'exact', head: true }).eq('estado', 'pendiente').then(({ count }) => setPendientes(count ?? 0))

  useEffect(() => { load() }, [filtro, desde, hasta, page])
  useEffect(() => { loadPendientes() }, [])
  useEffect(() => { const t = setTimeout(() => { setPage(0); load() }, 400); return () => clearTimeout(t) }, [q])

  const fmt = (d?: string) => d ? new Date(d).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''
  const badge = (e: EstadoSolicitud) => e === 'aprobado' ? 'bg-green-50 text-green-700' : e === 'rechazado' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['pendiente', 'aprobado', 'rechazado', 'todas'] as Filtro[]).map(f => (
            <button key={f} onClick={() => { setFiltro(f); setPage(0) }} className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${filtro === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              {f}{f === 'pendiente' && pendientes > 0 && <span className="ml-1 text-white bg-amber-500 rounded-full px-1.5">{pendientes}</span>}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nombre o cédula" className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500 w-44" />
        </div>
        <input type="date" value={desde} onChange={e => { setDesde(e.target.value); setPage(0) }} className="py-1.5 px-2 text-sm border border-gray-200 rounded-lg text-gray-600" />
        <span className="text-gray-400 text-xs">a</span>
        <input type="date" value={hasta} onChange={e => { setHasta(e.target.value); setPage(0) }} className="py-1.5 px-2 text-sm border border-gray-200 rounded-lg text-gray-600" />
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {loading ? <p className="py-12 text-center text-sm text-gray-400">Cargando...</p>
          : rows.length === 0 ? <p className="py-12 text-center text-sm text-gray-400">No hay solicitudes con estos filtros.</p>
          : rows.map(s => (
            <button key={s.id} onClick={() => setOpen(s)} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition text-left">
              {s.foto_url ? <img src={s.foto_url} className="w-10 h-10 rounded-full object-cover shrink-0" /> : <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{s.nombre}</p>
                <p className="text-xs text-gray-400 truncate">{s.institucion} · {s.categoria_nombre ?? 'Sin categoría'}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${badge(s.estado)}`}>{s.estado}</span>
              <span className="text-[11px] text-gray-400 shrink-0 hidden sm:block">{fmt(s.created_at)}</span>
            </button>
          ))}
      </div>

      {/* Paginación */}
      {total > PAGE && (
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{page * PAGE + 1}–{Math.min((page + 1) * PAGE, total)} de {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40">Anterior</button>
            <button disabled={(page + 1) * PAGE >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40">Siguiente</button>
          </div>
        </div>
      )}

      {open && <DetalleModal sol={open} onClose={() => setOpen(null)} onChange={() => { load(); loadPendientes() }} />}
    </div>
  )
}

/* Modal de detalle + aprobar/rechazar/editar */
function DetalleModal({ sol, onClose, onChange }: { sol: CarnetSolicitud; onClose: () => void; onChange: () => void }) {
  const [f, setF] = useState({
    nombre: sol.nombre, cedula: sol.cedula, institucion: sol.institucion, direccion: sol.direccion,
    telefono: sol.telefono, correo: sol.correo, codigo_postal: sol.codigo_postal ?? '',
    categoria_nombre: sol.categoria_nombre ?? '',
    vigencia_inicio: sol.vigencia_inicio ?? '', vigencia_fin: sol.vigencia_fin ?? '',
  })
  const [motivo, setMotivo] = useState(sol.motivo_rechazo ?? '')
  const [editando, setEditando] = useState(sol.estado === 'pendiente')
  const [busy, setBusy] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const link = `${window.location.origin}/carnet/${sol.codigo}`
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  const aprobar = async () => {
    if (!f.vigencia_inicio || !f.vigencia_fin) return alert('Define la vigencia (inicio y fin).')
    setBusy(true)
    await supabase.from('carnet_solicitudes').update({ ...f, estado: 'aprobado', aprobado_at: new Date().toISOString() }).eq('id', sol.id)
    // Notifica al estudiante (correo/SMS) si Brevo está configurado
    await notificarCarnetAprobado({ nombre: f.nombre, correo: f.correo, telefono: f.telefono, codigo: sol.codigo, vigencia_inicio: f.vigencia_inicio, vigencia_fin: f.vigencia_fin })
    setBusy(false); onChange(); onClose()
  }
  const rechazar = async () => {
    setBusy(true)
    await supabase.from('carnet_solicitudes').update({ estado: 'rechazado', motivo_rechazo: motivo }).eq('id', sol.id)
    setBusy(false); onChange(); onClose()
  }
  const guardar = async () => {
    if (!f.vigencia_inicio || !f.vigencia_fin) return alert('Define la vigencia (inicio y fin).')
    setBusy(true)
    await supabase.from('carnet_solicitudes').update(f).eq('id', sol.id)
    setBusy(false); onChange(); onClose()
  }
  const eliminar = async () => {
    if (!confirm('¿Eliminar esta solicitud/carnet definitivamente?')) return
    setBusy(true)
    await supabase.from('carnet_solicitudes').delete().eq('id', sol.id)
    setBusy(false); onChange(); onClose()
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            {sol.foto_url && <img src={sol.foto_url} className="w-12 h-12 rounded-lg object-cover" />}
            <div><h2 className="font-bold text-gray-900">{sol.nombre}</h2><p className="text-xs text-gray-400 capitalize">{sol.estado} · C.C. {sol.cedula}</p></div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18}/></button>
        </div>

        <div className="px-6 py-4 space-y-3 text-sm">
          {editando ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] text-gray-500 mb-1">Nombre</label><input value={f.nombre} onChange={e => set('nombre', e.target.value)} className={inp}/></div>
                <div><label className="block text-[11px] text-gray-500 mb-1">Cédula</label><input value={f.cedula} onChange={e => set('cedula', e.target.value)} className={inp}/></div>
              </div>
              <div><label className="block text-[11px] text-gray-500 mb-1">Institución</label><input value={f.institucion} onChange={e => set('institucion', e.target.value)} className={inp}/></div>
              <div><label className="block text-[11px] text-gray-500 mb-1">Categoría</label><input value={f.categoria_nombre} onChange={e => set('categoria_nombre', e.target.value)} className={inp}/></div>
              <div><label className="block text-[11px] text-gray-500 mb-1">Dirección</label><input value={f.direccion} onChange={e => set('direccion', e.target.value)} className={inp}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] text-gray-500 mb-1">Teléfono</label><input value={f.telefono} onChange={e => set('telefono', e.target.value)} className={inp}/></div>
                <div><label className="block text-[11px] text-gray-500 mb-1">Correo</label><input value={f.correo} onChange={e => set('correo', e.target.value)} className={inp}/></div>
              </div>
              <div className="rounded-lg border border-green-100 bg-green-50/50 p-3 grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">Vigencia inicio</label><input type="date" value={f.vigencia_inicio} onChange={e => set('vigencia_inicio', e.target.value)} className={inp}/></div>
                <div><label className="block text-[11px] font-semibold text-gray-600 mb-1">Vigencia fin</label><input type="date" value={f.vigencia_fin} onChange={e => set('vigencia_fin', e.target.value)} className={inp}/></div>
              </div>
              {sol.estado === 'pendiente' && <input value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Motivo (solo si vas a rechazar)" className={inp}/>}
            </>
          ) : (
            <>
              <Field label="Institución" value={sol.institucion} />
              <Field label="Categoría" value={sol.categoria_nombre ?? '—'} />
              <Field label="Dirección" value={sol.direccion} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Teléfono" value={sol.telefono} />
                <Field label="Correo" value={sol.correo} />
              </div>
              <Field label="Vigencia" value={`${sol.vigencia_inicio ?? '—'} → ${sol.vigencia_fin ?? '—'}`} />
            </>
          )}

          {/* Documentos */}
          {sol.documentos && sol.documentos.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Documentos</p>
              <div className="space-y-1.5">
                {sol.documentos.map((d, i) => (
                  <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-green-700 hover:underline"><FileText size={14}/> {d.nombre} <ExternalLink size={12}/></a>
                ))}
              </div>
            </div>
          )}

          {sol.estado === 'aprobado' && !editando && (
            <div className="rounded-lg bg-green-50 border border-green-100 p-3">
              <p className="text-xs font-semibold text-green-700 mb-1.5">Enlace del carnet</p>
              <div className="flex items-center gap-2">
                <input readOnly value={link} className="flex-1 text-xs bg-white border border-green-200 rounded px-2 py-1.5 text-gray-600" />
                <button onClick={() => { navigator.clipboard.writeText(link); setCopiado(true); setTimeout(() => setCopiado(false), 1500) }} className="p-1.5 rounded-lg bg-green-600 text-white"><Copy size={14}/></button>
              </div>
              {copiado && <p className="text-[11px] text-green-600 mt-1">¡Copiado!</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2 sticky bottom-0 bg-white">
          {sol.estado === 'pendiente' ? (
            <>
              <button onClick={rechazar} disabled={busy} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 flex items-center justify-center gap-1.5"><Ban size={15}/> Rechazar</button>
              <button onClick={aprobar} disabled={busy} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-1.5" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}><Check size={15}/> Aprobar</button>
            </>
          ) : editando ? (
            <>
              <button onClick={() => setEditando(false)} disabled={busy} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Cancelar</button>
              <button onClick={guardar} disabled={busy} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-1.5" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}><Check size={15}/> Guardar cambios</button>
            </>
          ) : (
            <>
              <button onClick={eliminar} disabled={busy} className="py-2.5 px-3 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 flex items-center justify-center gap-1.5"><Trash2 size={15}/></button>
              <button onClick={() => setEditando(true)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-1.5" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}><Pencil size={15}/> Editar datos / vigencia</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
function Field({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p><p className="text-gray-800">{value}</p></div>
}

/* ─────────────── ESTADÍSTICAS ─────────────── */
function Estadisticas() {
  const [rows, setRows] = useState<CarnetSolicitud[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('carnet_solicitudes').select('estado,categoria_nombre,institucion,created_at,vigencia_inicio,vigencia_fin').limit(5000)
      .then(({ data }) => { setRows((data as any) ?? []); setLoading(false) })
  }, [])

  if (loading) return <div className="py-16 text-center text-sm text-gray-400">Cargando estadísticas...</div>

  const total = rows.length
  const pend = rows.filter(r => r.estado === 'pendiente').length
  const apro = rows.filter(r => r.estado === 'aprobado').length
  const rech = rows.filter(r => r.estado === 'rechazado').length

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const aprobados = rows.filter(r => r.estado === 'aprobado')
  const activos = aprobados.filter(r => {
    const ini = r.vigencia_inicio ? new Date(r.vigencia_inicio + 'T00:00:00') : null
    const fin = r.vigencia_fin ? new Date(r.vigencia_fin + 'T23:59:59') : null
    return (!ini || hoy >= ini) && (!fin || hoy <= fin)
  }).length
  const vencidos = aprobados.length - activos

  // Últimos 7 días
  const dias: { label: string; n: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoy); d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const n = rows.filter(r => (r.created_at ?? '').slice(0, 10) === key).length
    dias.push({ label: d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' }), n })
  }
  const maxDia = Math.max(1, ...dias.map(d => d.n))

  // Agrupar por institución y categoría
  const agrupar = (campo: 'institucion' | 'categoria_nombre') => {
    const m: Record<string, number> = {}
    rows.forEach(r => { const k = (r[campo] || '—').trim(); m[k] = (m[k] ?? 0) + 1 })
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }
  const porInst = agrupar('institucion')
  const porCat = agrupar('categoria_nombre')
  const maxInst = Math.max(1, ...porInst.map(x => x[1]))

  const Card = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Tarjetas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="Total solicitudes" value={total} color="text-gray-900" />
        <Card label="Pendientes" value={pend} color="text-amber-600" />
        <Card label="Aprobadas" value={apro} color="text-green-600" />
        <Card label="Rechazadas" value={rech} color="text-red-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card label="Carnets activos (vigentes)" value={activos} color="text-green-600" />
        <Card label="Carnets vencidos" value={vencidos} color="text-orange-500" />
      </div>

      {/* Solicitudes últimos 7 días */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Solicitudes últimos 7 días</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {dias.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-700">{d.n}</span>
              <div className="w-full rounded-t-lg bg-green-500 transition-all" style={{ height: `${(d.n / maxDia) * 100}%`, minHeight: d.n > 0 ? 6 : 2, opacity: d.n > 0 ? 1 : 0.3 }} />
              <span className="text-[10px] text-gray-400 capitalize">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Por institución + categoría */}
      <div className="grid lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Por institución educativa</h3>
          <div className="space-y-2.5">
            {porInst.length === 0 ? <p className="text-sm text-gray-400">Sin datos</p> : porInst.map(([nombre, n]) => (
              <div key={nombre}>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-600 truncate">{nombre}</span><span className="font-bold text-gray-800">{n}</span></div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full bg-green-500" style={{ width: `${(n / maxInst) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Por categoría de tarifa</h3>
          <div className="space-y-2">
            {porCat.length === 0 ? <p className="text-sm text-gray-400">Sin datos</p> : porCat.map(([nombre, n]) => (
              <div key={nombre} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                <span className="text-sm text-gray-700">{nombre}</span>
                <span className="text-sm font-bold text-green-600">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── CATEGORÍAS ─────────────── */
function Categorias() {
  const [rows, setRows] = useState<CarnetCategoria[]>([])
  const load = () => supabase.from('carnet_categorias').select('*').order('nombre').then(({ data }) => setRows(data ?? []))
  useEffect(() => { load() }, [])
  const add = async () => { await supabase.from('carnet_categorias').insert({ nombre: 'Nueva categoría', activa: true }); load() }
  const upd = async (id: string, patch: Partial<CarnetCategoria>) => { await supabase.from('carnet_categorias').update(patch).eq('id', id); load() }
  const del = async (id: string) => { if (confirm('¿Eliminar categoría?')) { await supabase.from('carnet_categorias').delete().eq('id', id); load() } }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
      {rows.map(c => (
        <div key={c.id} className="flex items-center gap-3 px-5 py-3">
          <input defaultValue={c.nombre} onBlur={e => upd(c.id!, { nombre: e.target.value })} className="flex-1 text-sm font-medium text-gray-800 bg-transparent outline-none focus:bg-green-50 rounded px-2 py-1" />
          <button onClick={() => upd(c.id!, { activa: !c.activa })} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${c.activa ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.activa ? '● Activa' : '○ Inactiva'}</button>
          <button onClick={() => del(c.id!)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50"><Trash2 size={14}/></button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 w-full px-5 py-3 text-sm font-semibold text-green-600 hover:bg-green-50 transition"><Plus size={15}/> Agregar categoría</button>
    </div>
  )
}

/* ─────────────── DOCUMENTOS ─────────────── */
function Documentos() {
  const [rows, setRows] = useState<CarnetDocumento[]>([])
  const load = () => supabase.from('carnet_documentos').select('*').order('orden').then(({ data }) => setRows(data ?? []))
  useEffect(() => { load() }, [])
  const add = async () => { await supabase.from('carnet_documentos').insert({ nombre: 'Nuevo documento', obligatorio: true, activo: true, orden: rows.length }); load() }
  const upd = async (id: string, patch: Partial<CarnetDocumento>) => { await supabase.from('carnet_documentos').update(patch).eq('id', id); load() }
  const del = async (id: string) => { if (confirm('¿Eliminar documento?')) { await supabase.from('carnet_documentos').delete().eq('id', id); load() } }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
      {rows.map(d => (
        <div key={d.id} className="px-5 py-3 space-y-2">
          <div className="flex items-center gap-3">
            <input defaultValue={d.nombre} onBlur={e => upd(d.id!, { nombre: e.target.value })} className="flex-1 text-sm font-medium text-gray-800 bg-transparent outline-none focus:bg-green-50 rounded px-2 py-1" />
            <button onClick={() => upd(d.id!, { obligatorio: !d.obligatorio })} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${d.obligatorio ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{d.obligatorio ? 'Obligatorio' : 'Opcional'}</button>
            <button onClick={() => upd(d.id!, { activo: !d.activo })} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${d.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{d.activo ? '● Activo' : '○ Inactivo'}</button>
            <button onClick={() => del(d.id!)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50"><Trash2 size={14}/></button>
          </div>
          <input defaultValue={d.descripcion ?? ''} onBlur={e => upd(d.id!, { descripcion: e.target.value })} placeholder="Descripción / instrucción (opcional)" className="w-full text-xs text-gray-500 bg-transparent outline-none focus:bg-green-50 rounded px-2 py-1" />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 w-full px-5 py-3 text-sm font-semibold text-green-600 hover:bg-green-50 transition"><Plus size={15}/> Agregar documento requerido</button>
    </div>
  )
}
