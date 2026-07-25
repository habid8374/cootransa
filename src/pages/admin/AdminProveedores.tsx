import { useEffect, useState } from 'react'
import { supabase, type ProveedorPostulacion, type EstadoProveedor } from '../../lib/supabase'
import { Building2, X, Search, FileText, ExternalLink, Trash2, Check, Ban, Eye, Star, Globe } from 'lucide-react'
import ConfirmModal from '../../components/ConfirmModal'

type Filtro = 'todas' | EstadoProveedor
const PAGE = 20

const ESTADOS: { k: EstadoProveedor; label: string }[] = [
  { k: 'pendiente', label: 'Pendiente' },
  { k: 'en_estudio', label: 'En estudio' },
  { k: 'seleccionado', label: 'Seleccionado' },
  { k: 'descartado', label: 'Descartado' },
]

const badge = (e: EstadoProveedor) =>
  e === 'seleccionado' ? 'bg-green-50 text-green-700'
  : e === 'descartado' ? 'bg-red-50 text-red-600'
  : e === 'en_estudio' ? 'bg-blue-50 text-blue-600'
  : 'bg-amber-50 text-amber-600'

const labelEstado = (e: EstadoProveedor) => ESTADOS.find(x => x.k === e)?.label ?? e

export default function AdminProveedores() {
  const [rows, setRows] = useState<ProveedorPostulacion[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [pendientes, setPendientes] = useState(0)
  const [open, setOpen] = useState<ProveedorPostulacion | null>(null)

  const load = async () => {
    setLoading(true)
    let query = supabase.from('proveedor_postulaciones').select('*', { count: 'exact' })
    if (filtro !== 'todas') query = query.eq('estado', filtro)
    if (q.trim()) {
      const safe = q.replace(/[%,()]/g, ' ').trim()
      query = query.or(`empresa.ilike.%${safe}%,contacto.ilike.%${safe}%,categoria.ilike.%${safe}%`)
    }
    query = query.order('created_at', { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1)
    const { data, count } = await query
    setRows(data ?? []); setTotal(count ?? 0); setLoading(false)
  }
  const loadPendientes = () => supabase.from('proveedor_postulaciones').select('id', { count: 'exact', head: true }).eq('estado', 'pendiente').then(({ count }) => setPendientes(count ?? 0))

  useEffect(() => { load() }, [filtro, page])
  useEffect(() => { loadPendientes() }, [])
  useEffect(() => { const t = setTimeout(() => { setPage(0); load() }, 400); return () => clearTimeout(t) }, [q])

  const fmt = (d?: string) => d ? new Date(d).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Proveedores</h1>
        <p className="text-sm text-gray-500 mt-0.5">Postulaciones de proveedores, insumos, materiales y servicios</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
          {(['todas', 'pendiente', 'en_estudio', 'seleccionado', 'descartado'] as Filtro[]).map(f => (
            <button key={f} onClick={() => { setFiltro(f); setPage(0) }} className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${filtro === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              {f === 'todas' ? 'Todas' : labelEstado(f as EstadoProveedor)}
              {f === 'pendiente' && pendientes > 0 && <span className="ml-1 text-white bg-amber-500 rounded-full px-1.5">{pendientes}</span>}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Empresa, contacto o tipo" className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500 w-52" />
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {loading ? <p className="py-12 text-center text-sm text-gray-400">Cargando...</p>
          : rows.length === 0 ? <p className="py-12 text-center text-sm text-gray-400">No hay postulaciones con estos filtros.</p>
          : rows.map(p => (
            <button key={p.id} onClick={() => setOpen(p)} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition text-left">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0"><Building2 size={18} className="text-green-600" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{p.empresa}</p>
                <p className="text-xs text-gray-400 truncate">{p.categoria} · {p.contacto}{p.documentos && p.documentos.length > 0 ? ` · ${p.documentos.length} archivo(s)` : ''}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${badge(p.estado)}`}>{labelEstado(p.estado)}</span>
              <span className="text-[11px] text-gray-400 shrink-0 hidden sm:block">{fmt(p.created_at)}</span>
            </button>
          ))}
      </div>

      {total > PAGE && (
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{page * PAGE + 1}–{Math.min((page + 1) * PAGE, total)} de {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40">Anterior</button>
            <button disabled={(page + 1) * PAGE >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40">Siguiente</button>
          </div>
        </div>
      )}

      {open && <DetalleModal p={open} onClose={() => setOpen(null)} onChange={() => { load(); loadPendientes() }} />}
    </div>
  )
}

function DetalleModal({ p, onClose, onChange }: { p: ProveedorPostulacion; onClose: () => void; onChange: () => void }) {
  const [nota, setNota] = useState(p.nota_interna ?? '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [confirmDel, setConfirmDel] = useState(false)

  const cambiarEstado = async (estado: EstadoProveedor) => {
    setBusy(true)
    await supabase.from('proveedor_postulaciones').update({ estado, nota_interna: nota }).eq('id', p.id)
    setBusy(false); onChange(); onClose()
  }
  const guardarNota = async () => {
    setBusy(true)
    await supabase.from('proveedor_postulaciones').update({ nota_interna: nota }).eq('id', p.id)
    setBusy(false); onChange(); onClose()
  }
  const eliminar = async () => {
    setBusy(true)
    await supabase.from('proveedor_postulaciones').delete().eq('id', p.id)
    setBusy(false); onChange(); onClose()
  }
  // Descarga una propuesta del bucket privado vía URL firmada temporal
  const abrirDoc = async (d: { nombre: string; path?: string; url?: string }) => {
    if (d.url) { window.open(d.url, '_blank'); return }
    if (d.path) {
      const { data } = await supabase.storage.from('proveedor-docs').createSignedUrl(d.path, 300)
      if (data?.signedUrl) window.open(data.signedUrl, '_blank')
      else setErr('No se pudo abrir el archivo.')
    }
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0"><Building2 size={20} className="text-green-600" /></div>
            <div><h2 className="font-bold text-gray-900">{p.empresa}</h2><p className="text-xs text-gray-400"><span className="capitalize">{labelEstado(p.estado)}</span> · {p.categoria}</p></div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18}/></button>
        </div>

        <div className="px-6 py-4 space-y-3 text-sm">
          {p.nit && <Field label="NIT" value={p.nit} />}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contacto" value={p.contacto} />
            <Field label="Cargo" value={p.cargo || '—'} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Teléfono" value={p.telefono} />
            <Field label="Correo" value={p.correo} />
          </div>
          {p.ciudad && <Field label="Ciudad" value={p.ciudad} />}
          {p.sitio_web && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Sitio web</p>
              <a href={p.sitio_web} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline inline-flex items-center gap-1"><Globe size={13}/> {p.sitio_web}</a>
            </div>
          )}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Propuesta</p>
            <p className="text-gray-800 whitespace-pre-wrap">{p.descripcion}</p>
          </div>

          {p.documentos && p.documentos.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Archivos adjuntos</p>
              <div className="space-y-1.5">
                {p.documentos.map((d, i) => (
                  <button key={i} onClick={() => abrirDoc(d)} className="flex items-center gap-2 text-sm text-green-700 hover:underline text-left"><FileText size={14}/> {d.nombre} <ExternalLink size={12}/></button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nota interna (confidencial)</label>
            <textarea value={nota} onChange={e => setNota(e.target.value)} rows={2} className={`${inp} resize-none`} placeholder="Observaciones del estudio, solo visibles en el admin." />
          </div>
        </div>

        {err && <div className="px-6"><p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</p></div>}

        {/* Acciones */}
        <div className="px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => cambiarEstado('en_estudio')} disabled={busy} className="py-2.5 rounded-lg text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center justify-center gap-1.5"><Eye size={15}/> En estudio</button>
            <button onClick={() => cambiarEstado('seleccionado')} disabled={busy} className="py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-1.5" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}><Star size={15}/> Seleccionar</button>
            <button onClick={() => cambiarEstado('descartado')} disabled={busy} className="py-2.5 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 flex items-center justify-center gap-1.5"><Ban size={15}/> Descartar</button>
            <button onClick={guardarNota} disabled={busy} className="py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-1.5"><Check size={15}/> Guardar nota</button>
          </div>
          <button onClick={() => setConfirmDel(true)} disabled={busy} className="w-full py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center gap-1.5"><Trash2 size={14}/> Eliminar postulación</button>
        </div>
      </div>

      {confirmDel && (
        <ConfirmModal
          titulo="¿Eliminar esta postulación?"
          mensaje="Esta acción no se puede deshacer y borrará también sus archivos de la lista."
          onConfirm={() => { setConfirmDel(false); eliminar() }}
          onCancel={() => setConfirmDel(false)}
        />
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p><p className="text-gray-800 break-words">{value}</p></div>
}
