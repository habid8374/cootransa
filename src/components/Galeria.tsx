import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Carrusel de fotos deslizable (swipe tipo redes sociales).
 * Usa scroll-snap nativo para el gesto en móvil + flechas y puntos en escritorio.
 */
export default function Galeria({ imagenes, alt = '' }: { imagenes: string[]; alt?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [activo, setActivo] = useState(0)

  const irA = (i: number) => {
    const cont = ref.current
    if (!cont) return
    const idx = Math.max(0, Math.min(imagenes.length - 1, i))
    cont.scrollTo({ left: cont.clientWidth * idx, behavior: 'smooth' })
  }

  const onScroll = () => {
    const cont = ref.current
    if (!cont) return
    setActivo(Math.round(cont.scrollLeft / cont.clientWidth))
  }

  if (imagenes.length === 1) {
    return (
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white">
        <img src={imagenes[0]} alt={alt} className="w-full h-auto object-contain" />
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-black group">
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {imagenes.map((src, i) => (
          <div key={i} className="min-w-full snap-center flex items-center justify-center bg-black">
            <img src={src} alt={`${alt} ${i + 1}`} className="w-full max-h-[70vh] object-contain" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* Contador */}
      <div className="absolute top-3 right-3 bg-black/55 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{activo + 1} / {imagenes.length}</div>

      {/* Flechas */}
      {activo > 0 && (
        <button onClick={() => irA(activo - 1)} aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100">
          <ChevronLeft size={20} />
        </button>
      )}
      {activo < imagenes.length - 1 && (
        <button onClick={() => irA(activo + 1)} aria-label="Siguiente"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100">
          <ChevronRight size={20} />
        </button>
      )}

      {/* Puntos */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {imagenes.map((_, i) => (
          <button key={i} onClick={() => irA(i)} aria-label={`Foto ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === activo ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>
    </div>
  )
}
