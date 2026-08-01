import { useEffect, useState } from 'react'
import { supabase, type Noticia } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X, Upload, ExternalLink } from 'lucide-react'

const SECCIONES = ['Noticias', 'Seguridad Vial', 'SST', 'Eventos', 'Capacitación', 'Convocatoria', 'RRHH', 'Tarifas', 'Horarios', 'General']
const EMPTY: Omit<Noticia, 'id' | 'created_at' | 'updated_at'> = {
  slug: '', eyebrow: '', title: '', summary: '', image_url: '', note: '', estado: 'publicado', seccion: 'General', en_banner: false
}

export default function AdminNoticias() {
  const [rows, setRows]       = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ ...EMPTY })
  const [editId, setEditId]   = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)
  const [imgs, setImgs]       = useState<{ url?: string; file?: File; preview: string }[]>([])
  const [delId, setDelId]     = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('noticias').select('*').order('created_at', { ascending: false })
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setForm({ ...EMPTY }); setEditId(null); setImgs([]); setModal(true) }
  const openEdit = (n: Noticia) => {
    setForm({ slug: n.slug, eyebrow: n.eyebrow, title: n.title, summary: n.summary, image_url: n.image_url ?? '', note: n.note ?? '', estado: n.estado, seccion: n.seccion, en_banner: n.en_banner ?? false })
    const urls = (n.galeria && n.galeria.length > 0) ? n.galeria : (n.image_url ? [n.image_url] : [])
    setEditId(n.id ?? null); setImgs(urls.map(url => ({ url, preview: url }))); setModal(true)
  }

  const handleFiles = (files: FileList) => setImgs(prev => [...prev, ...Array.from(files).map(f => ({ file: f, preview: URL.createObjectURL(f) }))])
  const removeImg = (i: number) => setImgs(prev => prev.filter((_, idx) => idx !== i))

  const autoSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    // Sube las fotos nuevas y arma la galería (conservando las existentes)
    const galeria: string[] = []
    for (const im of imgs) {
      if (im.file) {
        const ext = im.file.name.split('.').pop()
        const path = `noticias/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
        const { error: upErr } = await supabase.storage.from('cootransa-media').upload(path, im.file, { upsert: true })
        if (!upErr) galeria.push(supabase.storage.from('cootransa-media').getPublicUrl(path).data.publicUrl)
      } else if (im.url) {
        galeria.push(im.url)
      }
    }
    const image_url = galeria[0] ?? ''
    const payload = { ...form, image_url, galeria, slug: form.slug || autoSlug(form.title), updated_at: new Date().toISOString() }
    if (editId) { await supabase.from('noticias').update(payload).eq('id', editId) }
    else { await supabase.from('noticias').insert(payload) }
    setSaving(false); setModal(false); load()
  }

  const handleDelete = async () => {
    if (!delId) return
    await supabase.from('noticias').delete().eq('id', delId)
    setDelId(null); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Noticias</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona las publicaciones del sitio y del Blog (usa la sección como categoría)</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
          <Plus size={15} /> Nueva noticia
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Título</th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Sección</th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Imagen</th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Estado</th>
            <th className="px-5 py-3" />
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">Cargando...</td></tr>
            : rows.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">No hay noticias. Crea la primera.</td></tr>
            : rows.map(n => (
              <tr key={n.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                <td className="px-5 py-3"><p className="text-sm font-semibold text-gray-800">{n.title}</p><p className="text-xs text-gray-400 mt-0.5">/{n.slug}</p></td>
                <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell">{n.seccion}</td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  {n.image_url ? <div className="flex items-center gap-1.5"><img src={n.image_url} className="w-10 h-10 rounded-lg object-cover border border-gray-200" alt="" /><a href={n.image_url} target="_blank" rel="noopener noreferrer" className="text-green-600"><ExternalLink size={12}/></a></div>
                  : <span className="text-xs text-gray-300">Sin imagen</span>}
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${n.estado === 'publicado' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />{n.estado === 'publicado' ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(n)} className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"><Pencil size={14}/></button>
                    <button onClick={() => setDelId(n.id!)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-base font-bold text-gray-900">{editId ? 'Editar noticia' : 'Nueva noticia'}</h2>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition"><X size={15}/></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Título *</label><input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"/></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug (URL)</label><input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="auto-generado" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition text-gray-500"/></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Sección</label><select value={form.seccion} onChange={e => setForm(p => ({ ...p, seccion: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition bg-white">{SECCIONES.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Etiqueta (eyebrow)</label><input value={form.eyebrow} onChange={e => setForm(p => ({ ...p, eyebrow: e.target.value }))} placeholder="Ej: Información al usuario" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"/></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Estado</label><select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as any }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition bg-white"><option value="publicado">Publicado</option><option value="borrador">Borrador</option></select></div>
                <div className="col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Resumen</label><textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"/></div>
                <div className="col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Nota al pie</label><textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"/></div>
                <div className="col-span-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none rounded-lg border border-gray-200 px-3 py-2.5 hover:bg-gray-50 transition">
                    <input type="checkbox" checked={!!form.en_banner} onChange={e => setForm(p => ({ ...p, en_banner: e.target.checked }))} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600" />
                    <span className="text-sm text-gray-700 leading-snug">
                      <span className="font-semibold">Mostrar en el banner de inicio</span>
                      <span className="block text-[12px] text-gray-400">Si lo activas, aparece en el carrusel de la página principal. Todas las publicaciones salen en el <strong>Blog</strong> aunque no marques esto.</span>
                    </span>
                  </label>
                </div>
                <div className="col-span-2">
                  <span className="block text-xs font-semibold text-gray-600 mb-1.5">Fotos {imgs.length > 0 && <span className="text-gray-400 font-normal">({imgs.length})</span>}</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {imgs.map((im, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                        <img src={im.preview} className="w-full h-full object-cover" alt={`foto ${i + 1}`} />
                        {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">Portada</span>}
                        <button type="button" onClick={() => removeImg(i)} className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow hover:bg-white"><X size={11}/></button>
                      </div>
                    ))}
                    <div className="relative aspect-square border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-green-400 hover:text-green-500 transition">
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
                        <Upload size={20}/><span className="text-[10px] font-medium">Agregar</span>
                      </div>
                      <input type="file" accept="image/*" multiple onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = '' }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Agregar fotos" />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5">La <strong>primera foto</strong> es la portada. Puedes subir varias: se verán como carrusel deslizable en la publicación.</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>{saving ? 'Guardando...' : editId ? 'Guardar cambios' : 'Publicar noticia'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">¿Eliminar noticia?</h3>
            <p className="text-sm text-gray-500 mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
