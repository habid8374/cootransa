import { useEffect, useState } from 'react'
import { getConfig, setConfig, getSecret, setSecret } from '../../lib/supabase'
import { LifeBuoy, Mail, Send } from 'lucide-react'
import WhatsappIcon from '../../components/WhatsappIcon'

export default function AdminAjustes() {
  const [numero, setNumero]   = useState('')
  const [mensaje, setMensaje] = useState('')
  const [activo, setActivo]   = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  // Brevo
  const [brevoKey, setBrevoKey]       = useState('')
  const [brevoEmail, setBrevoEmail]   = useState('')
  const [brevoName, setBrevoName]     = useState('')
  const [smsSender, setSmsSender]     = useState('')
  const [smsActivo, setSmsActivo]     = useState(false)
  const [brevoSaving, setBrevoSaving] = useState(false)
  const [brevoSaved, setBrevoSaved]   = useState(false)

  useEffect(() => {
    async function load() {
      setNumero(await getConfig('whatsapp_numero', '573000000000'))
      setMensaje(await getConfig('whatsapp_mensaje', 'Hola, quisiera más información sobre sus servicios.'))
      setActivo((await getConfig('whatsapp_activo', 'true')) !== 'false')
      setBrevoKey(await getSecret('brevo_api_key'))
      setBrevoEmail(await getSecret('brevo_sender_email'))
      setBrevoName(await getSecret('brevo_sender_name', 'COOTRANSA'))
      setSmsSender(await getSecret('brevo_sms_sender', 'COOTRANSA'))
      setSmsActivo((await getSecret('brevo_sms_activo', 'false')) === 'true')
      setLoading(false)
    }
    load()
  }, [])

  const save = async () => {
    setSaving(true)
    await setConfig('whatsapp_numero', numero.replace(/[^0-9]/g, ''))
    await setConfig('whatsapp_mensaje', mensaje)
    await setConfig('whatsapp_activo', activo ? 'true' : 'false')
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  const saveBrevo = async () => {
    setBrevoSaving(true)
    await setSecret('brevo_api_key', brevoKey.trim())
    await setSecret('brevo_sender_email', brevoEmail.trim())
    await setSecret('brevo_sender_name', brevoName.trim() || 'COOTRANSA')
    await setSecret('brevo_sms_sender', smsSender.trim().slice(0, 11) || 'COOTRANSA')
    await setSecret('brevo_sms_activo', smsActivo ? 'true' : 'false')
    setBrevoSaving(false); setBrevoSaved(true); setTimeout(() => setBrevoSaved(false), 2500)
  }

  return (
    <div>
      <div className="mb-6"><h1 className="text-xl font-bold text-gray-900">Ajustes del sitio</h1><p className="text-sm text-gray-500 mt-0.5">Configuración general de COOTRANSA</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><WhatsappIcon size={16} className="text-green-600"/> Botón flotante de WhatsApp</h2>
            <button onClick={() => setActivo(a => !a)} className={`relative w-11 h-6 rounded-full transition ${activo ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${activo ? 'translate-x-5' : ''}`} />
            </button>
          </div>
          {loading ? <p className="text-sm text-gray-400 py-6 text-center">Cargando...</p> : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Número de WhatsApp (con código de país, sin +)</label>
                <input value={numero} onChange={e => setNumero(e.target.value)} placeholder="573001234567" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"/>
                <p className="text-[11px] text-gray-400 mt-1">Ej: 57 (Colombia) + 300 123 4567 → <strong>573001234567</strong></p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mensaje predeterminado</label>
                <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} rows={3} placeholder="Hola, quisiera más información..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"/>
              </div>
              <button onClick={save} disabled={saving} className="mt-1 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar configuración'}
              </button>
            </div>
          )}
        </div>
        {/* Brevo — notificaciones de carnets */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Send size={16} className="text-green-600"/> Notificaciones por correo y SMS (Brevo)</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">Cuando se apruebe un carnet, el estudiante recibirá automáticamente el enlace de descarga por correo (y SMS si lo activas). Pega aquí tus credenciales de Brevo.</p>
          {loading ? <p className="text-sm text-gray-400 py-6 text-center">Cargando...</p> : (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">API Key de Brevo</label>
                <input type="password" value={brevoKey} onChange={e => setBrevoKey(e.target.value)} placeholder="xkeysib-..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"/>
                <p className="text-[11px] text-gray-400 mt-1">La consigues en Brevo → Settings → SMTP & API → API Keys. Se guarda de forma segura.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Correo remitente</label>
                <input value={brevoEmail} onChange={e => setBrevoEmail(e.target.value)} placeholder="notificaciones@cootransa.com" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"/>
                <p className="text-[11px] text-gray-400 mt-1">Debe estar verificado en Brevo (Senders).</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nombre remitente</label>
                <input value={brevoName} onChange={e => setBrevoName(e.target.value)} placeholder="COOTRANSA" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"/>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Enviar también por SMS</p>
                  <p className="text-[11px] text-gray-400">Requiere crédito de SMS en Brevo. Remitente: <strong>{smsSender || 'COOTRANSA'}</strong></p>
                </div>
                <button onClick={() => setSmsActivo(a => !a)} className={`relative w-11 h-6 rounded-full transition shrink-0 ${smsActivo ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${smsActivo ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              {smsActivo && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Remitente SMS (máx. 11 caracteres)</label>
                  <input value={smsSender} onChange={e => setSmsSender(e.target.value)} maxLength={11} placeholder="COOTRANSA" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"/>
                </div>
              )}
              <button onClick={saveBrevo} disabled={brevoSaving} className="sm:col-span-2 mt-1 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                {brevoSaving ? 'Guardando...' : brevoSaved ? '¡Guardado!' : 'Guardar credenciales de Brevo'}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><LifeBuoy size={16} className="text-green-600"/> Soporte técnico</h2>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">¿Necesitas ayuda, un cambio en el sitio o reportar un problema? Contacta al equipo de soporte que administra y mantiene la plataforma.</p>
            <a href="mailto:soporte@axentiatech.com" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}><Mail size={14}/> soporte@axentiatech.com</a>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Acerca del sitio</h2>
            <p className="text-xs text-gray-500 leading-relaxed">Los cambios que realizas en este panel (noticias, tarifas, horarios, WhatsApp) se publican automáticamente en el sitio web en pocos minutos.</p>
            <p className="text-[11px] text-gray-400 mt-3">Desarrollado y mantenido por <strong className="text-gray-500">axentiatech</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
