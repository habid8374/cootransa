import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Mail, Phone, Trash2, Inbox, X, AlertOctagon, Hash, CalendarClock } from 'lucide-react'
import { sumarDiasHabiles, diasHabilesEntre } from '../../lib/festivos'

const fmtFecha = (d: Date) => d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

// Calcula el estado del plazo de una PQR (15 días hábiles desde que llegó)
function plazoPQR(createdAt?: string) {
  const recibido = createdAt ? new Date(createdAt) : new Date()
  const limite = sumarDiasHabiles(recibido, 15)
  const restantes = diasHabilesEntre(new Date(), limite)
  const estado =
    restantes < 0 ? 'vencido' :
    restantes === 0 ? 'hoy' :
    restantes <= 3 ? 'proximo' : 'ok'
  return { recibido, limite, restantes, estado }
}

// Etiqueta legible + estilo por tipo de motivo
const esPQR = (s?: string) => (s ?? '').toLowerCase() === 'pqr'
const servicioLabel = (s?: string) => {
  const map: Record<string, string> = {
    estudiantil: 'Servicio Estudiantil', empresarial: 'Servicio Empresarial',
    turistico: 'Servicio Turístico', rutas: 'Rutas Intermunicipales',
    convenio: 'Convenio Corporativo', pqr: "PQR's", otro: 'Otro',
  }
  return map[(s ?? '').toLowerCase()] ?? s
}

interface Mensaje {
  id: string
  nombre: string
  email: string
  telefono?: string
  servicio?: string
  mensaje: string
  radicado?: string
  leido?: boolean
  created_at?: string
}

export default function AdminMensajes() {
  const [rows, setRows]       = useState<Mensaje[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState<Mensaje | null>(null)
  const [delId, setDelId]     = useState<string | null>(null)
  const [filtro, setFiltro]   = useState<'todos' | 'pqr' | 'otros'>('todos')

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
  const pqrCount = rows.filter(r => esPQR(r.servicio)).length
  const visibles = rows.filter(r => filtro === 'todos' ? true : filtro === 'pqr' ? esPQR(r.servicio) : !esPQR(r.servicio))

  const replyHref = (m: Mensaje) => {
    const subject = 'Respuesta a su mensaje – COOTRANSA'
    const body = `Hola ${m.nombre},\n\nGracias por contactar a COOTRANSA.\n\n— En respuesta a su mensaje:\n"${m.mensaje}"\n\n`
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    return isMobile
      ? `mailto:${m.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      : `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mensajes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Solicitudes enviadas desde el formulario de contacto</p>
        </div>
        {noLeidos > 0 && <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-50 text-green-700">{noLeidos} sin leer</span>}
      </div>

      {/* Filtro por tipo */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {([['todos', 'Todos'], ['pqr', "PQR's"], ['otros', 'Consultas']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFiltro(k)} className={`px-3.5 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${filtro === k ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
            {k === 'pqr' && <AlertOctagon size={14} className="text-red-500" />}
            {label}
            {k === 'pqr' && pqrCount > 0 && <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-1.5">{pqrCount}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm text-gray-400">Cargando mensajes...</div>
      ) : visibles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center">
          <Inbox size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">{filtro === 'pqr' ? 'No hay PQR por el momento.' : 'Aún no hay mensajes recibidos.'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {visibles.map(m => {
            const pqr = esPQR(m.servicio)
            return (
            <button key={m.id} onClick={() => openMsg(m)} className={`w-full flex items-start gap-3 px-5 py-4 transition text-left ${pqr ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-gray-50/60'}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${m.leido ? '' : pqr ? 'bg-red-500' : 'bg-green-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm truncate ${m.leido ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>{m.nombre}</span>
                  {m.servicio && (
                    pqr
                      ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 shrink-0 inline-flex items-center gap-1"><AlertOctagon size={11}/> PQR's</span>
                      : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">{servicioLabel(m.servicio)}</span>
                  )}
                  <span className="text-[11px] text-gray-400 shrink-0 ml-auto">{fmt(m.created_at)}</span>
                </div>
                {pqr && (() => {
                  const p = plazoPQR(m.created_at)
                  const color = p.estado === 'vencido' ? 'text-red-600' : p.estado === 'hoy' || p.estado === 'proximo' ? 'text-amber-600' : 'text-gray-500'
                  const txt = p.estado === 'vencido' ? `Vencida hace ${Math.abs(p.restantes)} día(s) hábil(es)` : p.estado === 'hoy' ? 'Vence hoy' : `Vence en ${p.restantes} día(s) hábil(es)`
                  return (
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-[11px]">
                      {m.radicado && <span className="inline-flex items-center gap-1 font-mono font-semibold text-gray-600"><Hash size={11}/>{m.radicado}</span>}
                      <span className={`inline-flex items-center gap-1 font-semibold ${color}`}><CalendarClock size={11}/>{txt}</span>
                    </div>
                  )
                })()}
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{m.mensaje}</p>
              </div>
            </button>
          )})}
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
              {open.servicio && !esPQR(open.servicio) && (
                <p className="text-xs"><span className="font-semibold text-gray-500">Motivo:</span> <span className="text-gray-700">{servicioLabel(open.servicio)}</span></p>
              )}
              {esPQR(open.servicio) && (() => {
                const p = plazoPQR(open.created_at)
                const tono = p.estado === 'vencido' ? 'bg-red-50 border-red-200' : p.estado === 'hoy' || p.estado === 'proximo' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'
                const chip = p.estado === 'vencido' ? 'bg-red-600' : p.estado === 'hoy' || p.estado === 'proximo' ? 'bg-amber-500' : 'bg-green-600'
                const txt = p.estado === 'vencido' ? `Vencida hace ${Math.abs(p.restantes)} día(s) hábil(es)` : p.estado === 'hoy' ? 'Vence hoy' : `Faltan ${p.restantes} día(s) hábil(es)`
                return (
                  <div className={`rounded-xl border p-4 ${tono}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertOctagon size={15} className="text-red-600" />
                      <span className="text-sm font-bold text-red-700">PQR's — Petición, Queja o Reclamo</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {open.radicado && (
                        <div className="col-span-2">
                          <p className="font-semibold text-gray-500 uppercase tracking-wide">Radicado</p>
                          <p className="font-mono font-bold text-gray-900 text-sm">{open.radicado}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-500 uppercase tracking-wide">Recibida</p>
                        <p className="text-gray-800 font-medium capitalize">{fmtFecha(p.recibido)}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-500 uppercase tracking-wide">Fecha límite de respuesta</p>
                        <p className="text-gray-800 font-medium capitalize">{fmtFecha(p.limite)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-full ${chip}`}><CalendarClock size={13}/>{txt}</span>
                      <span className="text-[11px] text-gray-500">Plazo legal: 15 días hábiles</span>
                    </div>
                  </div>
                )
              })()}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{open.mensaje}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <button onClick={() => setDelId(open.id)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"><Trash2 size={15}/> Eliminar</button>
              <a
                href={replyHref(open)}
                target="_blank"
                rel="noopener noreferrer"
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
