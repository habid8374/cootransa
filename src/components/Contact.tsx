import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Instagram, Facebook, Send, CheckCircle } from 'lucide-react'
import WhatsappIcon from './WhatsappIcon'
import { supabase, getConfig } from '../lib/supabase'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [waHref, setWaHref] = useState('https://wa.me/573000000000')
  const [formData, setFormData] = useState({ nombre:'', email:'', telefono:'', servicio:'', mensaje:'' })

  useEffect(() => {
    getConfig('whatsapp_numero', '573000000000').then(num =>
      setWaHref(`https://wa.me/${num.replace(/[^0-9]/g, '')}`)
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true); setError('')
    const { error } = await supabase.from('mensajes').insert({
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      servicio: formData.servicio,
      mensaje: formData.mensaje,
    })
    setSending(false)
    if (error) { setError('No se pudo enviar el mensaje. Intenta de nuevo.'); return }
    setSubmitted(true)
    setFormData({ nombre:'', email:'', telefono:'', servicio:'', mensaje:'' })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setFormData({...formData,[e.target.name]:e.target.value})

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50"/>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"/>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-green-600 text-sm font-semibold tracking-widest uppercase">Estamos para servirle</span>
          <h2 className="text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3">Hablemos de su<br/><span className="bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">próxima ruta</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-white border border-green-200 shadow-md">
                <CheckCircle size={56} className="text-green-500 mb-4"/>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Mensaje recibido</h3>
                <p className="text-gray-500">Gracias por contactarnos. Nuestro equipo se comunicará con usted a la brevedad posible.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors">Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label><input name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Su nombre" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="correo@ejemplo.com" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"/></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label><input name="telefono" type="tel" value={formData.telefono} onChange={handleChange} placeholder="+57 300 000 0000" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Servicio</label><select name="servicio" value={formData.servicio} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"><option value="">Seleccionar...</option><option value="estudiantil">Estudiantil</option><option value="empresarial">Empresarial</option><option value="turistico">Turístico</option><option value="rutas">Rutas intermunicipales</option><option value="convenio">Convenio corporativo</option><option value="otro">Otro</option></select></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label><textarea name="mensaje" value={formData.mensaje} onChange={handleChange} rows={4} placeholder="Cuéntenos sobre su necesidad de transporte..." className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"/></div>
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
      </div>
    </section>
  )
}
