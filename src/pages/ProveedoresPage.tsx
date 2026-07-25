import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, CheckCircle2, Loader2, Building2, FileText, X, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Brand from '../components/Brand'
import Footer from '../components/Footer'
import HabeasData from '../components/HabeasData'

const DOCS_BUCKET = 'proveedor-docs'   // privado (propuestas)

const CATEGORIAS = [
  'Insumos y suministros',
  'Repuestos y autopartes',
  'Combustibles y lubricantes',
  'Mantenimiento y taller',
  'Llantas',
  'Servicios profesionales',
  'Tecnología y software',
  'Publicidad y comunicaciones',
  'Seguros',
  'Dotación y uniformes',
  'Aseo y cafetería',
  'Otro',
]

export default function ProveedoresPage() {
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [habeas, setHabeas] = useState(false)
  const [progreso, setProgreso] = useState('')
  const [avisarSinArchivo, setAvisarSinArchivo] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    empresa: '', nit: '', contacto: '', cargo: '', telefono: '',
    correo: '', ciudad: '', categoria: '', descripcion: '', sitio_web: '',
  })
  const [archivos, setArchivos] = useState<File[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Proveedores – COOTRANSA'
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setArchivos(prev => [...prev, ...Array.from(files)].slice(0, 6))
    setAvisarSinArchivo(false)
    setError('')
  }
  const quitar = (i: number) => setArchivos(prev => prev.filter((_, idx) => idx !== i))
  const fmtTam = (b: number) => b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`

  // Sube una propuesta al bucket privado y devuelve solo la ruta (no es pública)
  const subirDoc = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `propuestas/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from(DOCS_BUCKET).upload(path, file, { upsert: false })
    if (error) throw new Error('No se pudo subir el archivo. ' + error.message)
    return path
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!habeas) { setError('Debes autorizar el tratamiento de datos para continuar.'); return }
    // Aviso: no adjuntó ninguna propuesta. Se debe confirmar antes de continuar.
    if (archivos.length === 0 && !avisarSinArchivo) { setAvisarSinArchivo(true); return }
    setEnviando(true)
    try {
      const docsSubidos: { nombre: string; path: string }[] = []
      for (let i = 0; i < archivos.length; i++) {
        setProgreso(`Subiendo archivo ${i + 1} de ${archivos.length}…`)
        docsSubidos.push({ nombre: archivos[i].name, path: await subirDoc(archivos[i]) })
      }
      setProgreso('Enviando postulación…')
      const { error: insErr } = await supabase.from('proveedor_postulaciones').insert({
        ...form,
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
      setProgreso('')
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
            <span className="inline-flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest"><Building2 size={15}/> Proveedores</span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900">Postúlate como proveedor</h1>
            <p className="mt-3 text-gray-500 max-w-2xl">¿Tu empresa ofrece insumos, materiales o servicios? Completa el formulario y adjunta tu propuesta en PDF. Nuestro equipo la estudiará y, de resultar seleccionada, te contactaremos directamente por medios institucionales.</p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          {enviado ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 bg-green-50 rounded-2xl border border-green-100">
              <CheckCircle2 size={56} className="text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900">¡Postulación enviada!</h2>
              <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm">Recibimos tu postulación correctamente. COOTRANSA la estudiará y, si resulta seleccionada, se comunicará contigo directamente. Gracias por tu interés.</p>
              <Link to="/" className="inline-block mt-6 px-6 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition">Volver al inicio</Link>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Empresa / Razón social *</label><input required value={form.empresa} onChange={e => set('empresa', e.target.value)} className={inputCls}/></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">NIT (opcional)</label><input value={form.nit} onChange={e => set('nit', e.target.value)} className={inputCls}/></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Persona de contacto *</label><input required value={form.contacto} onChange={e => set('contacto', e.target.value)} className={inputCls}/></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Cargo (opcional)</label><input value={form.cargo} onChange={e => set('cargo', e.target.value)} className={inputCls}/></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Teléfono *</label><input required type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value)} className={inputCls}/></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Correo electrónico *</label><input required type="email" value={form.correo} onChange={e => set('correo', e.target.value)} className={inputCls}/></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Ciudad (opcional)</label><input value={form.ciudad} onChange={e => set('ciudad', e.target.value)} className={inputCls}/></div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipo de proveeduría *</label>
                  <select required value={form.categoria} onChange={e => set('categoria', e.target.value)} className={inputCls}>
                    <option value="">Selecciona...</option>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Sitio web (opcional)</label><input value={form.sitio_web} onChange={e => set('sitio_web', e.target.value)} placeholder="https://..." className={inputCls}/></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Descripción de tu propuesta / servicio *</label><textarea required rows={4} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} className={`${inputCls} resize-none`} placeholder="Cuéntanos qué ofreces, tu experiencia y por qué deberíamos elegirte."/></div>

              {/* Propuestas en PDF */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Propuesta / portafolio (PDF o imágenes)</label>
                <div className={`rounded-lg border border-dashed px-4 py-4 transition ${archivos.length > 0 ? 'border-green-400 bg-green-50/50' : 'border-gray-300'}`}>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Upload size={18} className={archivos.length > 0 ? 'text-green-600' : 'text-gray-400'} />
                    <span className="text-sm">Selecciona tus archivos (PDF o imágenes, hasta 6):</span>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="application/pdf,image/*"
                    onChange={e => { addFiles(e.target.files); e.target.value = '' }}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-400 mt-2">Si el botón no abre el explorador, abre esta página en <strong>Chrome</strong> o <strong>Safari</strong> (no dentro de Instagram/Facebook).</p>
                </div>
                {archivos.length > 0 && (
                  <>
                    <p className="mt-2 text-[12px] font-semibold text-green-700 flex items-center gap-1.5"><CheckCircle2 size={14}/> {archivos.length} archivo(s) adjunto(s) — se enviarán con tu postulación</p>
                    <ul className="mt-2 space-y-1.5">
                      {archivos.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                          <FileText size={15} className="text-green-600 shrink-0" />
                          <span className="truncate flex-1">{f.name}</span>
                          <span className="text-[11px] text-gray-400 shrink-0">{fmtTam(f.size)}</span>
                          <button type="button" onClick={() => quitar(i)} className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"><X size={14}/></button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="pt-1"><HabeasData checked={habeas} onChange={setHabeas} /></div>

              {avisarSinArchivo && archivos.length === 0 && (
                <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-500" />
                  <span>No adjuntaste ninguna propuesta o portafolio. Si tienes un PDF, agrégalo arriba para que sea estudiado. Si deseas continuar sin archivos, presiona <strong>“Enviar sin propuesta”</strong>.</span>
                </div>
              )}

              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={enviando} className="w-full py-3 rounded-full text-white text-sm font-semibold shadow-lg hover:scale-[1.01] transition disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                {enviando ? <><Loader2 size={16} className="animate-spin"/> {progreso || 'Enviando…'}</> : (avisarSinArchivo && archivos.length === 0 ? 'Enviar sin propuesta' : 'Enviar postulación')}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
