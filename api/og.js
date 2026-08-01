// Función serverless (Vercel) para vista previa de enlaces del blog.
// Cuando se comparte /noticias/:slug, inserta el título, resumen e imagen
// reales de la noticia en las etiquetas Open Graph, para que WhatsApp,
// Facebook, etc. muestren la tarjeta correcta (no la genérica del sitio).

const DEFAULT_IMG = 'https://cootransa.vercel.app/og-image-v3.png'

// Tarjetas fijas por página (título y descripción propios al compartir)
const PAGINAS = {
  carnet: {
    title: 'Solicita tu Carnet de Tarifa Preferencial – COOTRANSA',
    desc: 'Estudiantes: obtén tu carnet estudiantil con tarifa preferencial. Sube tus documentos en línea y recibe tu carnet digital con código QR.',
  },
  proveedores: {
    title: 'Proveedores – COOTRANSA',
    desc: '¿Ofreces insumos, materiales o servicios? Postúlate como proveedor de COOTRANSA y adjunta tu propuesta en línea.',
  },
  blog: {
    title: 'Blog – COOTRANSA',
    desc: 'Noticias, eventos y cultura vial de la Cooperativa de Transportadores de Sabanalarga.',
  },
  verificar: {
    title: 'Verificar Carnet – COOTRANSA',
    desc: 'Verificación oficial de carnets de tarifa preferencial. Escanea el código QR y valida la vigencia.',
  },
}

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Reemplaza el content de una etiqueta meta (property o name) por un valor nuevo.
function setMeta(html, keyAttr, keyVal, content) {
  const re = new RegExp(`(<meta\\s+${keyAttr}=["']${keyVal}["']\\s+content=["'])[^"']*(["'])`, 'i')
  return html.replace(re, `$1${content}$2`)
}

// Inserta título, descripción e imagen en las etiquetas del HTML.
function inyectar(html, { titulo, desc, img, url, tipo = 'website', quitarDims = false }) {
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${titulo}</title>`)
  html = setMeta(html, 'name', 'description', desc)
  html = setMeta(html, 'property', 'og:type', tipo)
  html = setMeta(html, 'property', 'og:title', titulo)
  html = setMeta(html, 'property', 'og:description', desc)
  if (url) html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:image', img)
  html = setMeta(html, 'property', 'og:image:alt', titulo)
  html = setMeta(html, 'name', 'twitter:title', titulo)
  html = setMeta(html, 'name', 'twitter:description', desc)
  html = setMeta(html, 'name', 'twitter:image', img)
  if (quitarDims) html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/gi, '')
  return html
}

export default async function handler(req, res) {
  const slug = (req.query.slug || '').toString()
  const page = (req.query.page || '').toString()
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

  // 2a) Noticia del blog (tarjeta dinámica)
  if (slug) {
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
    } catch { /* si falla, tarjeta genérica */ }

    if (n) {
      const img = (Array.isArray(n.galeria) && n.galeria[0]) || n.image_url || DEFAULT_IMG
      html = inyectar(html, {
        titulo: esc(`${n.title} – COOTRANSA`),
        desc: esc((n.summary || '').slice(0, 200)),
        img: esc(img),
        url: `https://${host}/noticias/${esc(slug)}`,
        tipo: 'article',
        quitarDims: true,
      })
    }
  }
  // 2b) Página fija con tarjeta propia (carnet, proveedores, etc.)
  else if (PAGINAS[page]) {
    const p = PAGINAS[page]
    html = inyectar(html, {
      titulo: esc(p.title),
      desc: esc(p.desc),
      img: DEFAULT_IMG,
      url: `https://${host}/${page === 'carnet' ? 'tarifa-preferencial' : page}`,
    })
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  return res.status(200).send(html)
}
