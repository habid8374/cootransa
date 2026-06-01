import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const routes = [
  {
    name: 'Sabanalarga → Barranquilla',
    color: '#22c55e',
    coords: [[10.6286, -74.9219], [10.7200, -74.9000], [10.8400, -74.8500], [10.9639, -74.7964]] as [number,number][],
    from: 'Sabanalarga',
    to: 'Barranquilla'
  },
  {
    name: 'Manatí → Barranquilla',
    color: '#eab308',
    coords: [[10.4411, -74.9636], [10.5500, -74.9400], [10.6800, -74.9000], [10.8000, -74.8600], [10.9639, -74.7964]] as [number,number][],
    from: 'Manatí',
    to: 'Barranquilla'
  },
  {
    name: 'Villa Rosa → Barranquilla',
    color: '#a855f7',
    coords: [[10.7100, -74.9450], [10.7900, -74.9000], [10.8800, -74.8400], [10.9639, -74.7964]] as [number,number][],
    from: 'Villa Rosa',
    to: 'Barranquilla'
  }
]

const cities = [
  { name: 'Barranquilla', coords: [10.9639, -74.7964] as [number,number], color: '#22c55e', size: 12 },
  { name: 'Sabanalarga', coords: [10.6286, -74.9219] as [number,number], color: '#22c55e', size: 9 },
  { name: 'Manatí', coords: [10.4411, -74.9636] as [number,number], color: '#eab308', size: 9 },
  { name: 'Villa Rosa', coords: [10.7100, -74.9450] as [number,number], color: '#a855f7', size: 9 },
]

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return

    const loadMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      const map = L.map(mapRef.current!, {
        center: [10.7, -74.88],
        zoom: 9,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false
      })
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map)

      routes.forEach(route => {
        const line = L.polyline(route.coords, {
          color: route.color,
          weight: 4,
          opacity: 0.9,
          dashArray: '10, 8',
          className: 'animated-route'
        }).addTo(map)
        line.bindTooltip(route.name, { sticky: true, className: 'route-tooltip' })
      })

      cities.forEach(city => {
        const marker = L.circleMarker(city.coords, {
          radius: city.size,
          fillColor: city.color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        }).addTo(map)
        marker.bindTooltip(`<b>${city.name}</b>`, { permanent: true, direction: 'top', className: 'city-tooltip' })
      })
    }

    loadMap()
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <section id="rutas" className="py-24 bg-[#070C1A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src="/logo.png" alt="COOTRANSA" className="h-14 w-auto object-contain opacity-90"/>
          </div>
          <span className="text-green-400 text-sm font-semibold tracking-widest uppercase">Conectividad regional</span>
          <h2 className="text-4xl lg:text-5xl font-black font-display text-white mt-3 mb-4">
            Nuestras <span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">Rutas</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Cubrimos los municipios más importantes del departamento del Atlántico, conectando comunidades con Barranquilla diariamente.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {routes.map(r => (
            <div key={r.name} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: r.color }}/>
              <span className="text-zinc-300 text-sm font-medium">{r.name}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          style={{ height: '520px' }}
        >
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}/>
        </motion.div>
      </div>

      <style>{`
        .animated-route {
          stroke-dasharray: 10, 8;
          animation: dash 1.5s linear infinite;
        }
        @keyframes dash {
          to { stroke-dashoffset: -36; }
        }
        .route-tooltip, .city-tooltip {
          background: #0A0F1E !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: white !important;
          font-family: Inter, sans-serif !important;
          font-size: 13px !important;
          border-radius: 8px !important;
          padding: 4px 10px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .city-tooltip::before { display: none; }
        .leaflet-container { background: #070C1A; }
      `}</style>
    </section>
  )
}
