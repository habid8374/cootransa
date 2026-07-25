import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Instagram, Facebook, Send, CheckCircle, Navigation, Clock } from 'lucide-react'
import WhatsappIcon from './WhatsappIcon'
import HabeasData from './HabeasData'
import { supabase, getConfig, generarRadicado } from '../lib/supabase'
import { festivosColombia } from '../lib/festivos'

// Calcula si la sede está abierta ahora según el horario de atención
function estadoSede() {
  const ahora = new Date()
  const dia = ahora.getDay()                 // 0 = domingo … 6 = sábado
  const min = ahora.getHours() * 60 + ahora.getMinutes()
  const iso = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`
  const esFestivo = festivosColombia(ahora.getFullYear()).has(iso)
  let franjas: [number, number][] = []
  if (dia === 0 || esFestivo) franjas = []                          // domingo / festivo → cerrado
  else if (dia === 6) franjas = [[8 * 60, 12 * 60 + 30]]            // sábado
  else franjas = [[8 * 60, 12 * 60 + 30], [14 * 60, 17 * 60]]       // lunes a viernes
  return { abierto: franjas.some(([a, b]) => min >= a && min < b) }
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [habeas, setHabeas] = useState(false)
  const [radicado, setRadicado] = useState('')
  const [waHref, setWaHref] = useState('https://wa.me/573000000000')
  const [formData, setFormData] = useState({ nombre:'', email:'', telefono:'', servicio:'', mensaje:'' })

  useEffect(() => {
    getConfig('whatsapp_numero', '573000000000').then(num =>
      setWaHref(`https://wa.me/${num.replace(/[^0-9]/g, '')}`)
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!habeas) { setError('Debe autorizar el tratamiento de datos para continuar.'); return }
    setSending(true); setError('')
    const esPQR = formData.servicio === 'pqr'
    const rad = esPQR ? generarRadicado() : ''
    const { error } = await supabase.from('mensajes').insert({
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      servicio: formData.servicio,
      mensaje: formData.mensaje,
      ...(esPQR ? { radicado: rad } : {}),
    })
    setSending(false)
    if (error) { setError('No se pudo enviar el mensaje. Intenta de nuevo.'); return }
    setRadicado(rad)
    setSubmitted(true)
    setFormData({ nombre:'', email:'', telefono:'', servicio:'', mensaje:'' })
    setHabeas(false)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setFormData({...formData,[e.target.name]:e.target.value})

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50"/>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"/>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-green-600 text-sm font-semibold tracking-widest uppercase">Estamos para servirle</span>
          <h2 className="text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3">Con<span className="bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">táctenos</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-white border border-green-200 shadow-md">
                <CheckCircle size={56} className="text-green-500 mb-4"/>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{radicado ? 'PQR radicada' : 'Mensaje recibido'}</h3>
                <p className="text-gray-500">Gracias por contactarnos. Nuestro equipo se comunicará con usted a la brevedad posible.</p>
                {radicado && (
                  <div className="mt-5 rounded-xl bg-green-50 border border-green-200 px-5 py-4">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Número de radicado</p>
                    <p className="text-lg font-black text-gray-900 tracking-wide mt-1">{radicado}</p>
                    <p className="text-xs text-gray-500 mt-2">Guarde este número. Su PQR será respondida dentro de los <strong>15 días hábiles</strong> siguientes, conforme a la ley.</p>
                  </div>
                )}
                <button onClick={() => { setSubmitted(false); setRadicado('') }} className="mt-6 px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors">Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label><input name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Su nombre" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="correo@ejemplo.com" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"/></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label><input name="telefono" type="tel" value={formData.telefono} onChange={handleChange} placeholder="+57 300 000 0000" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label><select name="servicio" value={formData.servicio} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"><option value="">Seleccionar...</option><option value="estudiantil">Servicio Estudiantil</option><option value="empresarial">Servicio Empresarial</option><option value="turistico">Servicio Turístico</option><option value="rutas">Rutas intermunicipales</option><option value="convenio">Convenio corporativo</option><option value="pqr">❗ PQR (Peticiones, Quejas y Reclamos)</option><option value="otro">Otro</option></select></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label><textarea name="mensaje" value={formData.mensaje} onChange={handleChange} rows={4} placeholder="Cuéntenos sobre su necesidad de transporte..." className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"/></div>
                <HabeasData checked={habeas} onChange={setHabeas} />
                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>}
                <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold text-base shadow-lg shadow-green-500/25 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:hover:scale-100"><Send size={18}/>{sending ? 'Enviando...' : 'Enviar mensaje'}</button>
              </form>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col justify-center space-y-8">
            <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0"><MapPin size={20} className="text-green-600"/></div><div><div className="text-gray-900 font-semibold mb-1">Dirección</div><div className="text-gray-500 text-sm leading-relaxed">Calle 27 No. 29 - 50<br/>Carretera La Cordialidad<br/>Sabanalarga - Atlántico</div></div></div>
            <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0"><Mail size={20} className="text-purple-600"/></div><div><div className="text-gray-900 font-semibold mb-1">Correo electrónico</div><a href="mailto:cootransaltda1972@cootransa-ltda.com" className="text-gray-500 text-sm hover:text-green-600 transition-colors block">cootransaltda1972@cootransa-ltda.com</a><a href="mailto:gerenciacootransa@gmail.com" className="text-gray-500 text-sm hover:text-green-600 transition-colors block mt-1">gerenciacootransa@gmail.com</a></div></div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-gray-900 font-semibold mb-5">Redes sociales y WhatsApp</div>
              <div className="flex flex-col gap-3">
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-all duration-200 font-medium"><WhatsappIcon size={18}/>Escribir por WhatsApp</a>
                <a href="https://www.instagram.com/cootransaoficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all duration-200"><Instagram size={18}/>@cootransaoficial</a>
                <a href="https://www.facebook.com/share/17fNJkiDeV/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all duration-200"><Facebook size={18}/>COOTRANSA en Facebook</a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mapa de ubicación */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <span className="text-green-600 text-sm font-semibold tracking-widest uppercase">Nuestra sede</span>
              <h3 className="text-2xl font-black font-display text-gray-900 mt-1">¿Dónde estamos?</h3>
              <p className="text-gray-500 text-sm mt-1">Calle 27 No. 29 - 50 · Carretera La Cordialidad · Sabanalarga, Atlántico</p>
            </div>
            <a
              href="https://www.google.com/maps/place/COOTRANSA/@10.6395571,-74.9228073,17z/data=!3m1!4b1!4m6!3m5!1s0x8ef5dfb36f6b1dd7:0x730f1948224f3d7e!8m2!3d10.6395571!4d-74.9228073"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-green-500/25 hover:scale-105 shrink-0 self-start"
            ><Navigation size={17}/> Cómo llegar</a>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <iframe
                title="Ubicación de COOTRANSA en el mapa"
                src="https://maps.google.com/maps?q=10.6395571,-74.9228073&z=16&hl=es&output=embed"
                width="100%" height="420" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, display: 'block', filter: 'saturate(1.05)' }}
                allowFullScreen
              />
            </div>

            {/* Horario de atención */}
            <div className="rounded-2xl border border-gray-200 shadow-md bg-white p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0"><Clock size={20} className="text-green-600"/></div>
                <div className="text-gray-900 font-bold text-lg">Horario de atención</div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600 font-medium">Lunes a Viernes</span>
                  <span className="text-gray-900 font-semibold text-right">8:00 a.m. – 12:30 p.m.<br/>2:00 p.m. – 5:00 p.m.</span>
                </li>
                <li className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600 font-medium">Sábados</span>
                  <span className="text-gray-900 font-semibold">8:00 a.m. – 12:30 p.m.</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Domingos y festivos</span>
                  <span className="text-red-500 font-semibold">Cerrado</span>
                </li>
              </ul>
              {(() => {
                const { abierto } = estadoSede()
                return (
                  <div className="mt-auto pt-5">
                    <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 border ${abierto ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <span className="relative flex h-2.5 w-2.5">
                        {abierto && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${abierto ? 'bg-green-500' : 'bg-gray-400'}`} />
                      </span>
                      <span className={`text-sm font-bold ${abierto ? 'text-green-700' : 'text-gray-500'}`}>{abierto ? 'Abierto ahora' : 'Cerrado ahora'}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 text-center mt-3">Te atendemos de forma presencial en nuestra sede principal.</p>
                  </div>
                )
              })()}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
