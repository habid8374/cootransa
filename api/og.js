// Función serverless (Vercel) para vista previa de enlaces del blog.
// Cuando se comparte /noticias/:slug, inserta el título, resumen e imagen
// reales de la noticia en las etiquetas Open Graph, para que WhatsApp,
// Facebook, etc. muestren la tarjeta correcta (no la genérica del sitio).

const DEFAULT_IMG = 'https://cootransa.vercel.app/og-image-v3.png'

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Reemplaza el content de una etiqueta meta (property o name) por un valor nuevo.
function setMeta(html, keyAttr, keyVal, content) {
  const re = new RegExp(`(<meta\\s+${keyAttr}=["']${keyVal}["']\\s+content=["'])[^"']*(["'])`, 'i')
  return html.replace(re, `$1${content}$2`)
}

export default async function handler(req, res) {
  const slug = (req.query.slug || '').toString()
  const host = req.headers.host || 'cootransa.vercel.app'
  const base = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY

  // 1) Trae el HTML base de la aplicación (la SPA se sigue cargando igual para el usuario)
  let html = ''
  try {
    html = await (await fetch(`https://${host}/index.html`)).text()
  } catch {
    return res.status(302).setHeader('Location', `/`).end()
  }

  // 2) Busca la noticia publicada
  let n = null
  try {
    if (base && key) {
      const r = await fetch(
        `${base}/rest/v1/noticias?slug=eq.${encodeURIComponent(slug)}&estado=eq.publicado&select=title,summary,image_url,galeria&limit=1`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      )
      const rows = await r.json()
      n = Array.isArray(rows) ? rows[0] : null
    }
  } catch { /* si falla, se devuelve la tarjeta genérica */ }

  // 3) Si la encuentra, inyecta sus datos en las etiquetas
  if (n) {
    const titulo = esc(`${n.title} – COOTRANSA`)
    const desc = esc((n.summary || '').slice(0, 200))
    const img = (Array.isArray(n.galeria) && n.galeria[0]) || n.image_url || DEFAULT_IMG
    const url = `https://${host}/noticias/${esc(slug)}`

    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${titulo}</title>`)
    html = setMeta(html, 'name', 'description', desc)
    html = setMeta(html, 'property', 'og:type', 'article')
    html = setMeta(html, 'property', 'og:title', titulo)
    html = setMeta(html, 'property', 'og:description', desc)
    html = setMeta(html, 'property', 'og:url', url)
    html = setMeta(html, 'property', 'og:image', esc(img))
    html = setMeta(html, 'property', 'og:image:alt', titulo)
    html = setMeta(html, 'name', 'twitter:title', titulo)
    html = setMeta(html, 'name', 'twitter:description', desc)
    html = setMeta(html, 'name', 'twitter:image', esc(img))
    // La imagen de la noticia no siempre es 1200x630: quitamos las dimensiones fijas
    html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/gi, '')
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  return res.status(200).send(html)
}
