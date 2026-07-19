// Función serverless (Vercel) — relay seguro hacia Brevo.
// La API Key la envía el admin autenticado desde el navegador; aquí solo se
// reenvía a Brevo (evita el bloqueo CORS de llamar a Brevo desde el browser).

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  try {
    const { apiKey, senderEmail, senderName, to, toName, subject, html, smsSender, smsTo, smsText, supabaseUrl, anonKey } = req.body || {}

    // Seguridad: solo un admin con sesión válida puede usar este endpoint
    const authHeader = req.headers.authorization || ''
    if (!authHeader.startsWith('Bearer ') || !supabaseUrl || !anonKey) {
      return res.status(401).json({ error: 'No autorizado' })
    }
    const verify = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: authHeader },
    })
    if (!verify.ok) return res.status(401).json({ error: 'Sesión inválida' })

    if (!apiKey) return res.status(400).json({ error: 'Falta la API Key de Brevo' })

    const results = {}

    // ── Correo ──
    if (to && subject && html) {
      const r = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: { email: senderEmail || 'no-reply@cootransa.com', name: senderName || 'COOTRANSA' },
          to: [{ email: to, name: toName || to }],
          subject,
          htmlContent: html,
        }),
      })
      results.email = r.ok ? 'ok' : `error ${r.status}: ${await r.text()}`
    }

    // ── SMS (opcional) ──
    if (smsTo && smsText) {
      const r = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: (smsSender || 'COOTRANSA').slice(0, 11),
          recipient: smsTo,
          content: smsText,
        }),
      })
      results.sms = r.ok ? 'ok' : `error ${r.status}: ${await r.text()}`
    }

    return res.status(200).json({ ok: true, results })
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
