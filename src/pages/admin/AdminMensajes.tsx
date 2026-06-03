import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Mail, Phone, Trash2, Inbox, X } from 'lucide-react'

interface Mensaje {
  id: string
  nombre: string
  email: string
  telefono?: string
  servicio?: string
  mensaje: string
  leido?: boolean
  created_at?: string
}

export default function AdminMensajes() {
  const [rows, setRows]       = useState<Mensaje[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState<Mensaje | null>(null)
  const [delId, setDelId]     = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('mensajes').select('*').order('created_at', { ascending: false })
    setRows(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openMsg = async (m: Mensaje) => {
    setOpen(m)
    if (!m.leido) {
      await supabase.from('mensajes').update({ leido: true }).eq('id', m.id)
      setRows(r => r.map(x => x.id === m.id ? { ...x, leido: true } : x))
    }
  }

  const remove = async (id: string) => {
    await supabase.from('mensajes').delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
    setDelId(null); setOpen(null)
  }

  const fmt = (d?: string) => d ? new Date(d).toLocaleString('es-CO', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : ''
  const noLeidos = rows.filter(r => !r.leido).length

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mensajes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Solicitudes enviadas desde el formulario de contacto</p>
        </div>
        {noLeidos > 0 && <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-50 text-green-700">{noLeidos} sin leer</span>}
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm text-gray-400">Cargando mensajes...</div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center">
          <Inbox size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Aún no hay mensajes recibidos.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {rows.map(m => (
            <button key={m.id} onClick={() => openMsg(m)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/60 transition text-left">
              {!m.leido && <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />}
              {m.leido && <span className="w-2 h-2 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm truncate ${m.leido ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>{m.nombre}</span>
                  {m.servicio && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize shrink-0">{m.servicio}</span>}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{m.mensaje}</p>
              </div>
              <span className="text-[11px] text-gray-400 shrink-0 hidden sm:block">{fmt(m.created_at)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setOpen(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">{open.nombre}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{fmt(open.created_at)}</p>
              </div>
              <button onClick={() => setOpen(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18}/></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <a href={`mailto:${open.email}`} className="inline-flex items-center gap-1.5 text-gray-600 hover:text-green-600"><Mail size={14}/>{open.email}</a>
                {open.telefono && <a href={`tel:${open.telefono}`} className="inline-flex items-center gap-1.5 text-gray-600 hover:text-green-600"><Phone size={14}/>{open.telefono}</a>}
              </div>
              {open.servicio && <p className="text-xs"><span className="font-semibold text-gray-500">Servicio:</span> <span className="capitalize text-gray-700">{open.servicio}</span></p>}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{open.mensaje}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <button onClick={() => setDelId(open.id)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"><Trash2 size={15}/> Eliminar</button>
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent('Respuesta a su mensaje – COOTRANSA')}&body=${encodeURIComponent(`Hola ${open.nombre},\n\nGracias por contactar a COOTRANSA.\n\n— En respuesta a su mensaje:\n"${open.mensaje}"\n\n`)}`}
                className="text-sm font-semibold text-white px-4 py-2 rounded-lg"
                style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}
              >Responder por correo</a>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" onClick={() => setDelId(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-2">¿Eliminar mensaje?</h3>
            <p className="text-sm text-gray-500 mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDelId(null)} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Cancelar</button>
              <button onClick={() => remove(delId)} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-500">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
