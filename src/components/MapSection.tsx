import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const CITIES = [
  { name: 'Sabanalarga', x: 0.45, y: 0.55, isOrigin: true },
  { name: 'Barranquilla', x: 0.72, y: 0.18, isOrigin: false },
  { name: 'Villa Rosa', x: 0.60, y: 0.38, isOrigin: false },
  { name: 'Manaí', x: 0.28, y: 0.65, isOrigin: false },
  { name: 'Galapa', x: 0.63, y: 0.28, isOrigin: false },
  { name: 'Baranoa', x: 0.55, y: 0.32, isOrigin: false },
]
const ROUTES = [[0,1],[0,2],[2,1],[0,3],[0,5],[5,4],[4,1]]

export default function MapSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const offsetRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)
      offsetRef.current += 0.4
      if (offsetRef.current > 30) offsetRef.current = 0
      ROUTES.forEach(([from, to]) => {
        const a = CITIES[from], b = CITIES[to]
        const ax = a.x*W, ay = a.y*H, bx = b.x*W, by = b.y*H
        ctx.save(); ctx.strokeStyle='rgba(124,58,237,0.2)'; ctx.lineWidth=3; ctx.shadowColor='#7c3aed'; ctx.shadowBlur=8; ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke(); ctx.restore()
        ctx.save(); ctx.strokeStyle='rgba(34,197,94,0.8)'; ctx.lineWidth=1.5; ctx.setLineDash([8,14]); ctx.lineDashOffset=-offsetRef.current; ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke(); ctx.restore()
      })
      CITIES.forEach((city) => {
        const cx = city.x*W, cy = city.y*H, r = city.isOrigin ? 10 : 7
        const pulse = (Math.sin(Date.now()*0.002+city.x*10)+1)/2
        ctx.save(); ctx.strokeStyle=city.isOrigin?`rgba(34,197,94,${0.4*(1-pulse)})`:`rgba(124,58,237,${0.3*(1-pulse)})`; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,r+6+pulse*8,0,Math.PI*2); ctx.stroke(); ctx.restore()
        ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2)
        const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,r); grad.addColorStop(0,city.isOrigin?'#22c55e':'#8b5cf6'); grad.addColorStop(1,city.isOrigin?'#16a34a':'#7c3aed')
        ctx.fillStyle=grad; ctx.shadowColor=city.isOrigin?'#22c55e':'#8b5cf6'; ctx.shadowBlur=12; ctx.fill()
        ctx.font=`${city.isOrigin?'bold ':''}13px Inter,sans-serif`; ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.textAlign=cx>W*0.6?'right':'left'; ctx.fillText(city.name,cx+(cx>W*0.6?-r-8:r+8),cy+4)
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="py-24 bg-[#0A0F1E] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"/>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">Conectividad regional</span>
          <h2 className="text-4xl lg:text-5xl font-black font-display text-white mt-3">Nuestras Rutas</h2>
          <p className="text-zinc-400 mt-4 max-w-xl mx-auto">Cubrimos los municipios más importantes del departamento del Atlántico, conectando comunidades con Barranquilla diariamente.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent" style={{ height: '480px' }}>
          <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }}/>
          <div className="absolute bottom-6 left-6 flex flex-col gap-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"/><span className="text-white/70 text-xs">Origen principal</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"/><span className="text-white/70 text-xs">Destino / parada</span></div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { route: 'Sabanalarga — Barranquilla', note: 'Ruta principal, salidas cada hora' },
            { route: 'Compuerta de Villa Rosa — Barranquilla', note: 'Ruta intermunicipal directa' },
            { route: 'Manaí — Barranquilla', note: 'Conexión desde la costa' },
          ].map((r, i) => (
            <motion.div key={r.route} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all duration-300">
              <div className="text-white font-semibold mb-1">{r.route}</div>
              <div className="text-zinc-400 text-sm">{r.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
