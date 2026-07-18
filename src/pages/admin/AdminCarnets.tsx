import { useEffect, useState } from 'react'
import { supabase, type CarnetSolicitud, type CarnetCategoria, type CarnetDocumento, type EstadoSolicitud } from '../../lib/supabase'
import { CreditCard, Tags, FileCheck2, Plus, Trash2, X, Check, Ban, ExternalLink, Copy, Search, FileText } from 'lucide-react'

type Tab = 'solicitudes' | 'categorias' | 'documentos'
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
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
        {([['solicitudes', CreditCard, 'Solicitudes'], ['categorias', Tags, 'Categorías'], ['documentos', FileCheck2, 'Documentos']] as const).map(([k, Icon, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition ${tab === k ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}><Icon size={15}/> {label}</button>
        ))}
      </div>
      {tab === 'solicitudes' && <Solicitudes />}
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

/* Modal de detalle + aprobar/rechazar */
function DetalleModal({ sol, onClose, onChange }: { sol: CarnetSolicitud; onClose: () => void; onChange: () => void }) {
  const [ini, setIni] = useState(sol.vigencia_inicio ?? '')
  const [fin, setFin] = useState(sol.vigencia_fin ?? '')
  const [motivo, setMotivo] = useState(sol.motivo_rechazo ?? '')
  const [busy, setBusy] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const link = `${window.location.origin}/carnet/${sol.codigo}`

  const aprobar = async () => {
    if (!ini || !fin) return alert('Define la vigencia (inicio y fin).')
    setBusy(true)
    await supabase.from('carnet_solicitudes').update({ estado: 'aprobado', vigencia_inicio: ini, vigencia_fin: fin, aprobado_at: new Date().toISOString() }).eq('id', sol.id)
    setBusy(false); onChange(); onClose()
  }
  const rechazar = async () => {
    setBusy(true)
    await supabase.from('carnet_solicitudes').update({ estado: 'rechazado', motivo_rechazo: motivo }).eq('id', sol.id)
    setBusy(false); onChange(); onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            {sol.foto_url && <img src={sol.foto_url} className="w-12 h-12 rounded-lg object-cover" />}
            <div><h2 className="font-bold text-gray-900">{sol.nombre}</h2><p className="text-xs text-gray-400">C.C. {sol.cedula}</p></div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18}/></button>
        </div>

        <div className="px-6 py-4 space-y-3 text-sm">
          <Field label="Institución" value={sol.institucion} />
          <Field label="Categoría" value={sol.categoria_nombre ?? '—'} />
          <Field label="Dirección" value={sol.direccion} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Teléfono" value={sol.telefono} />
            <Field label="Correo" value={sol.correo} />
          </div>
          {sol.codigo_postal && <Field label="Código postal" value={sol.codigo_postal} />}

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

          {sol.estado === 'aprobado' && (
            <div className="rounded-lg bg-green-50 border border-green-100 p-3">
              <p className="text-xs font-semibold text-green-700 mb-1.5">Enlace del carnet</p>
              <div className="flex items-center gap-2">
                <input readOnly value={link} className="flex-1 text-xs bg-white border border-green-200 rounded px-2 py-1.5 text-gray-600" />
                <button onClick={() => { navigator.clipboard.writeText(link); setCopiado(true); setTimeout(() => setCopiado(false), 1500) }} className="p-1.5 rounded-lg bg-green-600 text-white"><Copy size={14}/></button>
              </div>
              {copiado && <p className="text-[11px] text-green-600 mt-1">¡Copiado!</p>}
            </div>
          )}

          {sol.estado === 'pendiente' && (
            <div className="rounded-lg border border-gray-100 p-3 space-y-3">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Vigencia del carnet</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] text-gray-500 mb-1">Inicio</label><input type="date" value={ini} onChange={e => setIni(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm" /></div>
                <div><label className="block text-[11px] text-gray-500 mb-1">Fin</label><input type="date" value={fin} onChange={e => setFin(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm" /></div>
              </div>
              <input value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Motivo (si rechazas)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          )}
        </div>

        {sol.estado === 'pendiente' && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-2 sticky bottom-0 bg-white">
            <button onClick={rechazar} disabled={busy} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 flex items-center justify-center gap-1.5"><Ban size={15}/> Rechazar</button>
            <button onClick={aprobar} disabled={busy} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-1.5" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}><Check size={15}/> Aprobar y generar carnet</button>
          </div>
        )}
      </div>
    </div>
  )
}
function Field({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p><p className="text-gray-800">{value}</p></div>
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
