import { getSecret } from './supabase'

interface CarnetAprobado {
  nombre: string
  correo: string
  telefono?: string
  codigo: string
  vigencia_inicio?: string
  vigencia_fin?: string
}

function fmt(d?: string) {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

/**
 * Envía correo (y SMS si está activo) al estudiante cuando su carnet es aprobado.
 * Lee las credenciales de Brevo desde notif_config (solo admin autenticado).
 * Si Brevo no está configurado, no hace nada (retorna false).
 */
export async function notificarCarnetAprobado(c: CarnetAprobado): Promise<boolean> {
  const apiKey = await getSecret('brevo_api_key')
  if (!apiKey) return false // Brevo aún no configurado

  const senderEmail = await getSecret('brevo_sender_email', 'no-reply@cootransa.com')
  const senderName  = await getSecret('brevo_sender_name', 'COOTRANSA')
  const smsSender   = await getSecret('brevo_sms_sender', 'COOTRANSA')
  const smsActivo   = (await getSecret('brevo_sms_activo', 'false')) === 'true'

  const link = `${window.location.origin}/carnet/${c.codigo}`

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#0d3b1e,#16a34a);padding:22px 24px;color:#fff">
        <h1 style="margin:0;font-size:20px">COOTRANSA</h1>
        <p style="margin:4px 0 0;font-size:12px;opacity:.85;text-transform:uppercase;letter-spacing:2px">Tarifa Preferencial</p>
      </div>
      <div style="padding:24px;color:#374151">
        <h2 style="color:#111827;font-size:18px;margin:0 0 8px">¡Tu carnet fue aprobado! 🎉</h2>
        <p style="font-size:14px;line-height:1.6">Hola <strong>${c.nombre}</strong>, tu solicitud de carnet de tarifa preferencial fue <strong style="color:#16a34a">aprobada</strong>.</p>
        <p style="font-size:14px;line-height:1.6">Vigencia: <strong>${fmt(c.vigencia_inicio)} — ${fmt(c.vigencia_fin)}</strong></p>
        <div style="text-align:center;margin:24px 0">
          <a href="${link}" style="background:#16a34a;color:#fff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:999px;display:inline-block">Descargar mi carnet</a>
        </div>
        <p style="font-size:12px;color:#9ca3af">O copia este enlace: ${link}</p>
        <p style="font-size:12px;color:#9ca3af;margin-top:20px">Cooperativa de Transportadores de Sabanalarga · COOTRANSA Ltda.</p>
      </div>
    </div>`

  const body = {
    apiKey, senderEmail, senderName,
    to: c.correo, toName: c.nombre,
    subject: 'Tu carnet de tarifa preferencial COOTRANSA está listo',
    html,
    ...(smsActivo && c.telefono ? {
      smsSender,
      smsTo: c.telefono.replace(/[^0-9+]/g, ''),
      smsText: `COOTRANSA: tu carnet de tarifa preferencial fue aprobado. Descargalo aqui: ${link}`,
    } : {}),
  }

  try {
    const r = await fetch('/api/send-notification', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    return r.ok
  } catch { return false }
}
