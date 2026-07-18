import type { CarnetSolicitud } from '../lib/supabase'

function fmt(d?: string) {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Diseño visual del carnet de tarifa preferencial COOTRANSA.
 * `qrDataUrl` es la imagen del QR ya generada. `refEl` permite exportarlo a PNG/PDF.
 */
export default function CarnetCard({
  solicitud,
  qrDataUrl,
  innerRef,
}: {
  solicitud: CarnetSolicitud
  qrDataUrl?: string
  innerRef?: (el: HTMLDivElement | null) => void
}) {
  const s = solicitud
  return (
    <div
      ref={innerRef}
      className="relative w-[340px] rounded-2xl overflow-hidden shadow-xl"
      style={{ background: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Encabezado */}
      <div className="relative px-5 pt-4 pb-3 text-white" style={{ background: 'linear-gradient(135deg,#0d3b1e,#16a34a)' }}>
        <div className="flex items-center gap-2.5">
          <img src="/favicon.png" alt="COOTRANSA" crossOrigin="anonymous" className="w-10 h-10 rounded-full bg-white p-0.5 object-contain" />
          <div className="leading-tight">
            <p className="font-black text-base tracking-tight">COOTRANSA</p>
            <p className="text-[9px] text-white/80 uppercase tracking-widest">Tarifa Preferencial</p>
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="px-5 py-4 flex gap-4">
        {/* Foto */}
        <div className="shrink-0">
          {s.foto_url ? (
            <img src={s.foto_url} alt={s.nombre} crossOrigin="anonymous" className="w-20 h-24 rounded-lg object-cover border-2 border-green-100" />
          ) : (
            <div className="w-20 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">Sin foto</div>
          )}
        </div>
        {/* Datos */}
        <div className="min-w-0 flex-1">
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Titular</p>
          <p className="text-sm font-bold text-gray-900 leading-tight truncate">{s.nombre}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{s.tipo_documento || 'C.C.'} {s.cedula}</p>

          <p className="text-[9px] text-gray-400 uppercase tracking-wide mt-2">Institución</p>
          <p className="text-[11px] font-semibold text-gray-700 leading-tight line-clamp-2">{s.institucion}</p>

          {s.categoria_nombre && (
            <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 uppercase tracking-wide">
              {s.categoria_nombre}
            </span>
          )}
        </div>
      </div>

      {/* Vigencia + QR */}
      <div className="px-5 pb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Vigencia</p>
          <p className="text-xs font-bold text-gray-800">{fmt(s.vigencia_inicio)} — {fmt(s.vigencia_fin)}</p>
          <p className="text-[9px] text-gray-400 mt-2">Código</p>
          <p className="text-[11px] font-mono font-semibold text-gray-700">{s.codigo}</p>
        </div>
        {qrDataUrl && (
          <img src={qrDataUrl} alt="QR" className="w-20 h-20 rounded-lg border border-gray-100" />
        )}
      </div>

      {/* Franja inferior */}
      <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#facc15,#22c55e,#5b21b6)' }} />
    </div>
  )
}
