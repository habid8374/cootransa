import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const routes = [
  {
    name: 'Sabanalarga → Barranquilla → Corredor Universitario',
    color: '#22c55e',
    coords: [
      [10.6306, -74.9181],
      [10.7300, -74.9200],
      [10.7939, -74.9163],
      [10.8967, -74.8861],
      [10.9685, -74.7813],
      [11.0185, -74.8506],
    ] as [number,number][]
  },
  {
    name: 'Sabanalarga → Manatí',
    color: '#eab308',
    coords: [
      [10.6306, -74.9181],
      [10.5400, -74.9450],
      [10.4486, -74.9586],
    ] as [number,number][]
  },
  {
    name: 'Sabanalarga → San Cristóbal (Bolívar)',
    color: '#a855f7',
    coords: [
      [10.6306, -74.9181],
      [10.5100, -74.9900],
      [10.3961, -75.0639],
    ] as [number,number][]
  }
]

const cities = [
  { name: 'Sabanalarga', coords: [10.6306, -74.9181] as [number,number], color: '#22c55e', size: 11 },
  { name: 'Campeche', coords: [10.7300, -74.9200] as [number,number], color: '#22c55e', size: 7 },
  { name: 'Baranoa', coords: [10.7939, -74.9163] as [number,number], color: '#22c55e', size: 7 },
  { name: 'Galapá', coords: [10.8967, -74.8861] as [number,number], color: '#22c55e', size: 7 },
  { name: 'Barranquilla', coords: [10.9685, -74.7813] as [number,number], color: '#22c55e', size: 12 },
  { name: 'Corredor Universitario', coords: [11.0185, -74.8506] as [number,number], color: '#22c55e', size: 8 },
  { name: 'Manatí', coords: [10.4486, -74.9586] as [number,number], color: '#eab308', size: 8 },
  { name: 'San Cristóbal', coords: [10.3961, -75.0639] as [number,number], color: '#a855f7', size: 8 },
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
        center: [10.72, -74.88],
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false
      })
      mapInstanceRef.current = map

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map)

      routes.forEach(route => {
        const line = L.polyline(route.coords, {
          color: route.color,
          weight: 5,
          opacity: 0.95,
          className: 'animated-route'
        }).addTo(map)
        line.bindTooltip(route.name, { sticky: true, className: 'route-tooltip' })
      })

      cities.forEach(city => {
        const marker = L.circleMarker(city.coords, {
          radius: city.size,
          fillColor: city.color,
          color: '#fff',
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.95
        }).addTo(map)
        marker.bindTooltip(`<b>${city.name}</b>`, { permanent: true, direction: 'top', className: 'city-tooltip' })
      })

      const group = L.featureGroup(routes.map(r => L.polyline(r.coords)))
      map.fitBounds(group.getBounds().pad(0.15))
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
    <section id="rutas" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-green-600 text-sm font-semibold tracking-widest uppercase">Conectividad regional</span>
          <h2 className="text-4xl lg:text-5xl font-black font-display text-gray-900 mt-3 mb-4">
            Nuestras <span className="bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">Rutas</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Cubrimos los municipios más importantes del departamento del Atlántico, conectando comunidades con Barranquilla diariamente.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {routes.map(r => (
            <div key={r.name} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: r.color }}/>
              <span className="text-gray-700 text-sm font-medium">{r.name}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl"
          style={{ height: '560px' }}
        >
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}/>
        </motion.div>
      </div>

      <style>{`
        .animated-route {
          stroke-dasharray: 12, 10;
          animation: dash 1.2s linear infinite;
          filter: drop-shadow(0 0 4px rgba(0,0,0,0.4));
        }
        @keyframes dash {
          to { stroke-dashoffset: -44; }
        }
        .route-tooltip, .city-tooltip {
          background: rgba(255,255,255,0.97) !important;
          border: 1px solid rgba(0,0,0,0.12) !important;
          color: #1f2937 !important;
          font-family: Inter, system-ui, sans-serif !important;
          font-size: 12px !important;
          border-radius: 8px !important;
          padding: 3px 9px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important;
          white-space: nowrap;
        }
        .city-tooltip::before, .route-tooltip::before { display: none; }
        .leaflet-container { background: #f8fafc; }
      `}</style>
    </section>
  )
}
