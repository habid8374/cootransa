import { useEffect, useState } from 'react'
import { supabase, type Comentario } from '../../lib/supabase'
import { MessageCircle, Check, Trash2, ExternalLink } from 'lucide-react'
import ConfirmModal from '../../components/ConfirmModal'

type Filtro = 'pendientes' | 'aprobados' | 'todos'

export default function AdminComentarios() {
  const [rows, setRows] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>('pendientes')
  const [pend, setPend] = useState(0)
  const [delId, setDelId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    let q = supabase.from('blog_comentarios').select('*').order('created_at', { ascending: false })
    if (filtro === 'pendientes') q = q.eq('aprobado', false)
    else if (filtro === 'aprobados') q = q.eq('aprobado', true)
    const { data } = await q
    setRows(data ?? []); setLoading(false)
  }
  const loadPend = () => supabase.from('blog_comentarios').select('id', { count: 'exact', head: true }).eq('aprobado', false).then(({ count }) => setPend(count ?? 0))

  useEffect(() => { load() }, [filtro])
  useEffect(() => { loadPend() }, [])

  const aprobar = async (id: string) => { await supabase.from('blog_comentarios').update({ aprobado: true }).eq('id', id); load(); loadPend() }
  const ocultar = async (id: string) => { await supabase.from('blog_comentarios').update({ aprobado: false }).eq('id', id); load(); loadPend() }
  const eliminar = async () => { if (!delId) return; await supabase.from('blog_comentarios').delete().eq('id', delId); setDelId(null); load(); loadPend() }

  const fmt = (d?: string) => d ? new Date(d).toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Comentarios del Blog</h1>
        <p className="text-sm text-gray-500 mt-0.5">Aprueba o elimina los comentarios antes de que se publiquen</p>
      </div>

      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {(['pendientes', 'aprobados', 'todos'] as Filtro[]).map(f => (
          <button key={f} onClick={() => setFiltro(f)} className={`px-3.5 py-1.5 rounded-md text-sm font-medium capitalize transition ${filtro === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
            {f}{f === 'pendientes' && pend > 0 && <span className="ml-1 text-white bg-amber-500 rounded-full px-1.5 text-[10px]">{pend}</span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {loading ? <p className="py-12 text-center text-sm text-gray-400">Cargando...</p>
          : rows.length === 0 ? <p className="py-12 text-center text-sm text-gray-400">No hay comentarios {filtro === 'pendientes' ? 'pendientes' : ''}.</p>
          : rows.map(c => (
            <div key={c.id} className="px-5 py-4 flex gap-3">
              <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>{(c.nombre[0] ?? '?').toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">{c.nombre}</span>
                  {c.email && <span className="text-xs text-gray-400">{c.email}</span>}
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.aprobado ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-600'}`}>{c.aprobado ? 'Aprobado' : 'Pendiente'}</span>
                  <span className="text-[11px] text-gray-400 ml-auto">{fmt(c.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{c.comentario}</p>
                <a href={`/noticias/${c.noticia_slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline mt-1.5">
                  <ExternalLink size={11} /> /noticias/{c.noticia_slug}
                </a>
                <div className="flex gap-2 mt-3">
                  {c.aprobado
                    ? <button onClick={() => ocultar(c.id!)} className="text-xs font-semibold text-amber-600 border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition">Ocultar</button>
                    : <button onClick={() => aprobar(c.id!)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}><Check size={13} /> Aprobar</button>}
                  <button onClick={() => setDelId(c.id!)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"><Trash2 size={13} /> Eliminar</button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {delId && <ConfirmModal titulo="¿Eliminar comentario?" mensaje="Esta acción no se puede deshacer." onConfirm={eliminar} onCancel={() => setDelId(null)} />}
    </div>
  )
}
