import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Loader2, Building2, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Brand from '../components/Brand'
import Footer from '../components/Footer'
import HabeasData from '../components/HabeasData'

const DOCS_BUCKET = 'proveedor-docs'   // privado

const CATEGORIAS = [
  'Insumos y suministros', 'Repuestos y autopartes', 'Combustibles y lubricantes',
  'Mantenimiento y taller', 'Llantas', 'Servicios profesionales', 'Tecnología y software',
  'Publicidad y comunicaciones', 'Seguros', 'Dotación y uniformes', 'Aseo y cafetería', 'Otro',
]

// Documentos del formato oficial "Inscripción de proveedores productos o servicios"
const DOCUMENTOS: { nombre: string; obligatorio: boolean }[] = [
  { nombre: 'Certificado de Cámara de Comercio', obligatorio: true },
  { nombre: 'RUT', obligatorio: true },
  { nombre: 'Fotocopia de cédula del representante legal', obligatorio: true },
  { nombre: 'Portafolio de productos o servicios (si posee)', obligatorio: false },
  { nombre: 'Certificados de calidad de productos o estudios (según aplique)', obligatorio: false },
  { nombre: 'Certificaciones de sistemas de gestión (SST / HSEQ) (si cuenta)', obligatorio: false },
  { nombre: 'Referencias laborales', obligatorio: true },
  { nombre: 'Referencias comerciales (si aplica)', obligatorio: false },
  { nombre: 'Certificación de pago de aportes y parafiscales o afiliación (persona natural)', obligatorio: true },
  { nombre: 'Certificación bancaria', obligatorio: true },
  { nombre: 'Licencias ambientales (si aplica)', obligatorio: false },
  { nombre: 'Licencias en salud ocupacional de IPS (si aplica)', obligatorio: false },
  { nombre: 'Fichas técnicas de los productos (si aplica)', obligatorio: false },
  { nombre: 'Certificado de calibración o verificación (si aplica)', obligatorio: false },
  { nombre: 'Licencia de salud ocupacional del médico / estudios higiénicos (si aplica)', obligatorio: false },
]

export default function ProveedoresPage() {
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [habeas, setHabeas] = useState(false)
  const [progreso, setProgreso] = useState('')

  const [form, setForm] = useState({
    empresa: '', nit: '', contacto: '', cargo: '', telefono: '', celular: '',
    correo: '', direccion: '', ciudad: '', categoria: '', descripcion: '', sitio_web: '',
  })
  const [archivos, setArchivos] = useState<Record<number, File>>({})

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Inscripción de proveedores – COOTRANSA'
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const setArchivo = (i: number, file?: File) => {
    setError('')
    setArchivos(prev => {
      const n = { ...prev }
      if (file) n[i] = file; else delete n[i]
      return n
    })
  }
  const fmtTam = (b: number) => b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`

  const subirDoc = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `docs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from(DOCS_BUCKET).upload(path, file, { upsert: false })
    if (error) throw new Error('No se pudo subir el archivo. ' + error.message)
    return path
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!habeas) { setError('Debes autorizar el tratamiento de datos para continuar.'); return }
    // Validar documentos obligatorios
    const faltan = DOCUMENTOS.filter((d, i) => d.obligatorio && !archivos[i]).map(d => d.nombre)
    if (faltan.length > 0) { setError('Faltan documentos obligatorios: ' + faltan.join(', ')); window.scrollTo({ top: 9999, behavior: 'smooth' }); return }

    setEnviando(true)
    try {
      const docsSubidos: { nombre: string; path: string }[] = []
      const entradas = Object.entries(archivos)
      let k = 0
      for (const [idx, file] of entradas) {
        k++; setProgreso(`Subiendo documento ${k} de ${entradas.length}…`)
        docsSubidos.push({ nombre: DOCUMENTOS[Number(idx)].nombre, path: await subirDoc(file) })
      }
      setProgreso('Enviando inscripción…')
      const { error: insErr } = await supabase.from('proveedor_postulaciones').insert({
        ...form, documentos: docsSubidos, estado: 'pendiente',
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
  const lbl = 'block text-xs font-semibold text-gray-600 mb-1.5'

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
            <span className="inline-flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest"><Building2 size={15}/> Proveedores · Sistema Integrado de Gestión</span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900">Inscripción de proveedores</h1>
            <p className="mt-3 text-gray-500 max-w-2xl">Diligencia el formulario con los datos de tu empresa y adjunta los documentos requeridos. COOTRANSA revisará tu inscripción y, si resultas seleccionado, te contactará por medios institucionales.</p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          {enviado ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 bg-green-50 rounded-2xl border border-green-100">
              <CheckCircle2 size={56} className="text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900">¡Inscripción enviada!</h2>
              <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm">Recibimos tu inscripción correctamente. COOTRANSA la estudiará y, si resultas seleccionado, se comunicará contigo directamente. Gracias por tu interés.</p>
              <Link to="/" className="inline-block mt-6 px-6 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition">Volver al inicio</Link>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {/* Datos del proveedor */}
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">Datos del proveedor</h2>
              <div><label className={lbl}>Nombre del proveedor / Razón social *</label><input required value={form.empresa} onChange={e => set('empresa', e.target.value)} className={inputCls}/></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={lbl}>NIT / RUT *</label><input required value={form.nit} onChange={e => set('nit', e.target.value)} className={inputCls}/></div>
                <div><label className={lbl}>Persona de contacto *</label><input required value={form.contacto} onChange={e => set('contacto', e.target.value)} className={inputCls}/></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Dirección *</label><input required value={form.direccion} onChange={e => set('direccion', e.target.value)} className={inputCls}/></div>
                <div><label className={lbl}>Ciudad *</label><input required value={form.ciudad} onChange={e => set('ciudad', e.target.value)} className={inputCls}/></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Teléfono</label><input type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value)} className={inputCls}/></div>
                <div><label className={lbl}>Celular *</label><input required type="tel" value={form.celular} onChange={e => set('celular', e.target.value)} className={inputCls}/></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Correo electrónico *</label><input required type="email" value={form.correo} onChange={e => set('correo', e.target.value)} className={inputCls}/></div>
                <div>
                  <label className={lbl}>Tipo de proveeduría *</label>
                  <select required value={form.categoria} onChange={e => set('categoria', e.target.value)} className={inputCls}>
                    <option value="">Selecciona...</option>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className={lbl}>Sitio web (opcional)</label><input value={form.sitio_web} onChange={e => set('sitio_web', e.target.value)} placeholder="https://..." className={inputCls}/></div>
              <div><label className={lbl}>Descripción de productos o servicios *</label><textarea required rows={3} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} className={`${inputCls} resize-none`} placeholder="Cuéntanos qué ofreces, tu experiencia y por qué deberíamos elegirte."/></div>

              {/* Documentos */}
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2 pt-4">Documentos</h2>
              <p className="text-[13px] text-gray-500 -mt-2">Adjunta cada documento en PDF o imagen. Los marcados con <span className="text-red-500 font-semibold">*</span> son obligatorios; los demás, solo <em>si aplican</em> a tu empresa.</p>
              <div className="rounded-xl border border-gray-200 divide-y divide-gray-100">
                {DOCUMENTOS.map((d, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-700">{i + 1}. {d.nombre} {d.obligatorio && <span className="text-red-500 font-bold">*</span>}</span>
                      <span className={`ml-2 inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${d.obligatorio ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>{d.obligatorio ? 'Requerido' : 'Si aplica'}</span>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {archivos[i] && <span className="inline-flex items-center gap-1 text-[11px] text-green-700 max-w-[130px] truncate"><CheckCircle2 size={13}/>{fmtTam(archivos[i].size)}</span>}
                      <input type="file" accept="application/pdf,image/*"
                        onChange={e => { setArchivo(i, e.target.files?.[0]); e.currentTarget.blur() }}
                        className="block w-full max-w-[190px] text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400">Si el botón no abre el explorador, abre esta página en <strong>Chrome</strong> o <strong>Safari</strong> (no dentro de Instagram/Facebook).</p>

              <div className="pt-1"><HabeasData checked={habeas} onChange={setHabeas} /></div>

              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 flex items-start gap-2"><FileText size={15} className="shrink-0 mt-0.5"/> {error}</p>}

              <button type="submit" disabled={enviando} className="w-full py-3 rounded-full text-white text-sm font-semibold shadow-lg hover:scale-[1.01] transition disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                {enviando ? <><Loader2 size={16} className="animate-spin"/> {progreso || 'Enviando…'}</> : 'Enviar inscripción'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
