import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, MessageCircle, Instagram, Facebook, Send, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ nombre:'', email:'', telefono:'', servicio:'', mensaje:'' })
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true) }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setFormData({...formData,[e.target.name]:e.target.value})

  return (
    <section className="py-24 bg-[#070C1A] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"/>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"/>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-green-400 text-sm font-semibold tracking-widest uppercase">Estamos para servirle</span>
          <h2 className="text-4xl lg:text-5xl font-black font-display text-white mt-3">Hablemos de su<br/><span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">próxima ruta</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-white/5 border border-green-500/30">
                <CheckCircle size={56} className="text-green-400 mb-4"/>
                <h3 className="text-2xl font-bold text-white mb-3">Mensaje recibido</h3>
                <p className="text-zinc-400">Gracias por contactarnos. Nuestro equipo se comunicará con usted a la brevedad posible.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors">Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-zinc-300 mb-2">Nombre completo</label><input name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Su nombre" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-all"/></div>
                  <div><label className="block text-sm font-medium text-zinc-300 mb-2">Email</label><input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="correo@ejemplo.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-all"/></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-zinc-300 mb-2">Teléfono</label><input name="telefono" type="tel" value={formData.telefono} onChange={handleChange} placeholder="+57 300 000 0000" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-all"/></div>
                  <div><label className="block text-sm font-medium text-zinc-300 mb-2">Servicio</label><select name="servicio" value={formData.servicio} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#0A0F1E] border border-white/10 text-white focus:outline-none focus:border-green-500 transition-all"><option value="" className="bg-[#0A0F1E]">Seleccionar...</option><option value="estudiantil" className="bg-[#0A0F1E]">Estudiantil</option><option value="empresarial" className="bg-[#0A0F1E]">Empresarial</option><option value="turistico" className="bg-[#0A0F1E]">Turístico</option><option value="rutas" className="bg-[#0A0F1E]">Rutas intermunicipales</option><option value="convenio" className="bg-[#0A0F1E]">Convenio corporativo</option><option value="otro" className="bg-[#0A0F1E]">Otro</option></select></div>
                </div>
                <div><label className="block text-sm font-medium text-zinc-300 mb-2">Mensaje</label><textarea name="mensaje" value={formData.mensaje} onChange={handleChange} rows={4} placeholder="Cuéntenos sobre su necesidad de transporte..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-all resize-none"/></div>
                <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold text-base shadow-xl shadow-green-900/30 hover:scale-[1.02] transition-all duration-200"><Send size={18}/>Enviar mensaje</button>
              </form>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col justify-center space-y-8">
            <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0"><MapPin size={20} className="text-green-400"/></div><div><div className="text-white font-semibold mb-1">Dirección</div><div className="text-zinc-400 text-sm leading-relaxed">Calle 27 No. 29 - 50<br/>Carretera La Cordialidad<br/>Sabanalarga - Atlántico</div></div></div>
            <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0"><Mail size={20} className="text-purple-400"/></div><div><div className="text-white font-semibold mb-1">Correo electrónico</div><a href="mailto:cootransaltda1972@cootransa-ltda.com" className="text-zinc-400 text-sm hover:text-green-400 transition-colors block">cootransaltda1972@cootransa-ltda.com</a><a href="mailto:gerenciacootransa@gmail.com" className="text-zinc-400 text-sm hover:text-green-400 transition-colors block mt-1">gerenciacootransa@gmail.com</a></div></div>
            <div className="pt-4 border-t border-white/10">
              <div className="text-white font-semibold mb-5">Redes sociales y WhatsApp</div>
              <div className="flex flex-col gap-3">
                <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 transition-all duration-200 font-medium"><MessageCircle size={18}/>Escribir por WhatsApp</a>
                <a href="https://www.instagram.com/cootransaoficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-all duration-200"><Instagram size={18}/>@cootransaoficial</a>
                <a href="https://www.facebook.com/share/17fNJkiDeV/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-all duration-200"><Facebook size={18}/>COOTRANSA en Facebook</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
