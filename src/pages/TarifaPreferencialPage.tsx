import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, CheckCircle2, Loader2, CreditCard } from 'lucide-react'
import { supabase, generarCodigoCarnet, type CarnetCategoria, type CarnetDocumento } from '../lib/supabase'
import Brand from '../components/Brand'
import Footer from '../components/Footer'

const BUCKET = 'cootransa-media'

export default function TarifaPreferencialPage() {
  const [categorias, setCategorias] = useState<CarnetCategoria[]>([])
  const [documentos, setDocumentos] = useState<CarnetDocumento[]>([])
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nombre: '', tipo_documento: 'C.C.', cedula: '', institucion: '', direccion: '',
    codigo_postal: '', telefono: '', correo: '', categoria_id: '',
  })
  const [foto, setFoto] = useState<File | null>(null)
  const [archivos, setArchivos] = useState<Record<string, File>>({})

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Tarifa Preferencial – COOTRANSA'
    async function load() {
      const [{ data: cats }, { data: docs }] = await Promise.all([
        supabase.from('carnet_categorias').select('*').eq('activa', true).order('nombre'),
        supabase.from('carnet_documentos').select('*').eq('activo', true).order('orden'),
      ])
      setCategorias(cats ?? [])
      setDocumentos(docs ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const subir = async (file: File, carpeta: string) => {
    const ext = file.name.split('.').pop()
    const path = `carnets/${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
    if (error) throw error
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // Validar documentos obligatorios
    for (const d of documentos.filter(d => d.obligatorio)) {
      if (!archivos[d.id!]) { setError(`Falta subir: ${d.nombre}`); return }
    }
    if (!foto) { setError('Debes subir tu foto.'); return }
    setEnviando(true)
    try {
      const foto_url = await subir(foto, 'fotos')
      const docsSubidos: { nombre: string; url: string }[] = []
      for (const d of documentos) {
        const f = archivos[d.id!]
        if (f) docsSubidos.push({ nombre: d.nombre, url: await subir(f, 'documentos') })
      }
      const categoria = categorias.find(c => c.id === form.categoria_id)
      const { error: insErr } = await supabase.from('carnet_solicitudes').insert({
        ...form,
        codigo: generarCodigoCarnet(),
        categoria_nombre: categoria?.nombre ?? null,
        foto_url,
        documentos: docsSubidos,
        estado: 'pendiente',
      })
      if (insErr) throw insErr
      setEnviado(true)
      window.scrollTo(0, 0)
    } catch (err: any) {
      setError('Ocurrió un error al enviar. Intenta de nuevo. ' + (err?.message ?? ''))
    } finally {
      setEnviando(false)
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Brand iconClass="h-9" textClass="text-lg" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition"><ArrowLeft size={16}/> Volver</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-gray-100 bg-gradient-to-br from-green-50 via-white to-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <span className="inline-flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest"><CreditCard size={15}/> Tarifa Preferencial</span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900">Solicita tu carnet</h1>
            <p className="mt-3 text-gray-500 max-w-2xl">Completa el formulario y adjunta los documentos requeridos. COOTRANSA revisará tu solicitud y, al aprobarla, recibirás el enlace para descargar tu carnet digital.</p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          {loading ? (
            <div className="text-center py-16 text-gray-400"><Loader2 className="animate-spin mx-auto mb-2" /> Cargando...</div>
          ) : enviado ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 bg-green-50 rounded-2xl border border-green-100">
              <CheckCircle2 size={56} className="text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900">¡Solicitud enviada!</h2>
              <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm">Tu solicitud fue recibida correctamente. COOTRANSA la revisará y te notificará cuando tu carnet esté listo para descargar.</p>
              <Link to="/" className="inline-block mt-6 px-6 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition">Volver al inicio</Link>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Nombre completo *</label><input required value={form.nombre} onChange={e => set('nombre', e.target.value)} className={inputCls}/></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipo de documento *</label>
                  <select required value={form.tipo_documento} onChange={e => set('tipo_documento', e.target.value)} className={inputCls}>
                    <option value="C.C.">Cédula de ciudadanía</option>
                    <option value="T.I.">Tarjeta de identidad</option>
                    <option value="C.E.">Cédula de extranjería</option>
                    <option value="PAS">Pasaporte</option>
                    <option value="R.C.">Registro civil</option>
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Número de documento *</label><input required value={form.cedula} onChange={e => set('cedula', e.target.value)} className={inputCls}/></div>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Institución educativa (universidad / corporación / colegio) *</label><input required value={form.institucion} onChange={e => set('institucion', e.target.value)} className={inputCls}/></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Dirección de residencia *</label><input required value={form.direccion} onChange={e => set('direccion', e.target.value)} className={inputCls}/></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Código postal (opcional)</label><input value={form.codigo_postal} onChange={e => set('codigo_postal', e.target.value)} className={inputCls}/></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Teléfono *</label><input required type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value)} className={inputCls}/></div>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Correo electrónico *</label><input required type="email" value={form.correo} onChange={e => set('correo', e.target.value)} className={inputCls}/></div>

              {categorias.length > 0 && (
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Categoría de tarifa *</label>
                  <select required value={form.categoria_id} onChange={e => set('categoria_id', e.target.value)} className={inputCls}>
                    <option value="">Selecciona...</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              )}

              {/* Foto */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tu foto (rostro visible) *</label>
                <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-green-400 transition">
                  <Upload size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{foto ? foto.name : 'Subir foto'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setFoto(e.target.files?.[0] ?? null)} />
                </label>
              </div>

              {/* Documentos requeridos */}
              {documentos.map(d => (
                <div key={d.id}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{d.nombre} {d.obligatorio && '*'}</label>
                  {d.descripcion && <p className="text-[11px] text-gray-400 mb-1.5">{d.descripcion}</p>}
                  <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-green-400 transition">
                    <Upload size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{archivos[d.id!]?.name ?? 'Subir archivo (PDF o imagen)'}</span>
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setArchivos(a => ({ ...a, [d.id!]: f })) }} />
                  </label>
                </div>
              ))}

              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={enviando} className="w-full py-3 rounded-full text-white text-sm font-semibold shadow-lg hover:scale-[1.01] transition disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                {enviando ? <><Loader2 size={16} className="animate-spin"/> Enviando...</> : 'Enviar solicitud'}
              </button>
              <p className="text-[11px] text-gray-400 text-center">Al enviar aceptas el tratamiento de tus datos conforme a la política de COOTRANSA.</p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
