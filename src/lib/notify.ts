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
    const json = await r.json().catch(() => ({}))
    if (!r.ok) console.error('Notificación falló:', r.status, json)
    else console.log('Notificación:', json)
    return r.ok && json?.results?.email === 'ok'
  } catch (e) { console.error('Notificación error:', e); return false }
}

/** Envía un correo de prueba con las credenciales actuales y devuelve el resultado detallado (para diagnóstico). */
export async function probarBrevo(destino: string): Promise<{ ok: boolean; detalle: string }> {
  const apiKey = await getSecret('brevo_api_key')
  if (!apiKey) return { ok: false, detalle: 'No hay API Key de Brevo guardada.' }
  const senderEmail = await getSecret('brevo_sender_email')
  const senderName  = await getSecret('brevo_sender_name', 'COOTRANSA')
  if (!senderEmail) return { ok: false, detalle: 'Falta el correo remitente.' }

  try {
    const r = await fetch('/api/send-notification', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey, senderEmail, senderName,
        to: destino, toName: destino,
        subject: 'Prueba de notificación · COOTRANSA',
        html: '<p>Este es un <strong>correo de prueba</strong> de COOTRANSA. Si lo recibiste, la configuración de Brevo funciona correctamente. ✅</p>',
      }),
    })
    const json = await r.json().catch(() => ({}))
    if (!r.ok) return { ok: false, detalle: `Error ${r.status}: ${JSON.stringify(json)}` }
    if (json?.results?.email !== 'ok') return { ok: false, detalle: `Brevo respondió: ${json?.results?.email ?? JSON.stringify(json)}` }
    return { ok: true, detalle: 'Correo de prueba enviado. Revisa tu bandeja (y spam).' }
  } catch (e: any) {
    return { ok: false, detalle: 'No se pudo llamar a la función: ' + (e?.message ?? e) }
  }
}
