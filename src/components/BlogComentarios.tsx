import { useEffect, useState } from 'react'
import { MessageCircle, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase, type Comentario } from '../lib/supabase'
import HabeasData from './HabeasData'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const fmt = (d?: string) => {
  if (!d) return ''
  const f = new Date(d)
  return `${f.getDate()} ${MESES[f.getMonth()]} ${f.getFullYear()}`
}
const inicial = (n: string) => (n.trim()[0] ?? '?').toUpperCase()

export default function BlogComentarios({ slug }: { slug: string }) {
  const [lista, setLista] = useState<Comentario[]>([])
  const [form, setForm] = useState({ nombre: '', email: '', comentario: '' })
  const [habeas, setHabeas] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const cargar = () => {
    supabase.from('blog_comentarios').select('*').eq('noticia_slug', slug).eq('aprobado', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => setLista(data ?? []))
  }
  useEffect(() => { cargar() }, [slug])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!habeas) { setError('Debes autorizar el tratamiento de datos para comentar.'); return }
    setEnviando(true)
    const { error: insErr } = await supabase.from('blog_comentarios').insert({
      noticia_slug: slug, nombre: form.nombre, email: form.email || null, comentario: form.comentario, aprobado: false,
    })
    setEnviando(false)
    if (insErr) { setError('No se pudo enviar el comentario. Intenta de nuevo.'); return }
    setEnviado(true)
    setForm({ nombre: '', email: '', comentario: '' })
    setHabeas(false)
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition'

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="border-t border-gray-100 pt-10">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
          <MessageCircle size={20} className="text-green-600" />
          Comentarios {lista.length > 0 && <span className="text-gray-400 font-medium">({lista.length})</span>}
        </h2>

        {/* Lista de comentarios aprobados */}
        {lista.length > 0 && (
          <ul className="space-y-4 mb-10">
            {lista.map(c => (
              <li key={c.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>{inicial(c.nombre)}</div>
                <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{c.nombre}</span>
                    <span className="text-[11px] text-gray-400">· {fmt(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{c.comentario}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Formulario */}
        {enviado ? (
          <div className="text-center py-8 bg-green-50 rounded-2xl border border-green-100">
            <CheckCircle2 size={44} className="text-green-600 mx-auto mb-3" />
            <p className="font-bold text-gray-900">¡Gracias por tu comentario!</p>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">Será revisado por nuestro equipo antes de publicarse.</p>
            <button onClick={() => setEnviado(false)} className="mt-4 text-sm font-semibold text-green-600 hover:underline">Escribir otro comentario</button>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-4">
            <h3 className="font-bold text-gray-900">Deja un comentario</h3>
            <p className="text-xs text-gray-400 -mt-2">Tu comentario será revisado antes de publicarse. El correo no se publica.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Nombre *" className={inp} />
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Correo (opcional)" className={inp} />
            </div>
            <textarea required rows={4} value={form.comentario} onChange={e => set('comentario', e.target.value)} placeholder="Escribe tu comentario..." className={`${inp} resize-none`} />
            <HabeasData checked={habeas} onChange={setHabeas} />
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={enviando} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
              {enviando ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Send size={16} /> Publicar comentario</>}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
