import { useEffect, useState, useRef } from 'react'
import { supabase, type Noticia, type Tarifa, type Horario } from '../lib/supabase'
import { Clock, Briefcase, DollarSign, CalendarClock, Newspaper, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const SECTION_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; ring: string }> = {
  Tarifas:      { label: 'Tarifas',     icon: <DollarSign size={11}/>,    color: 'text-emerald-700', bg: 'bg-emerald-50',  ring: 'ring-emerald-100' },
  Horarios:     { label: 'Horarios',    icon: <CalendarClock size={11}/>, color: 'text-blue-700',    bg: 'bg-blue-50',     ring: 'ring-blue-100'    },
  Noticias:     { label: 'Noticia',     icon: <Newspaper size={11}/>,     color: 'text-violet-700',  bg: 'bg-violet-50',   ring: 'ring-violet-100'  },
  Convocatoria: { label: 'Empleo',      icon: <Briefcase size={11}/>,     color: 'text-orange-700',  bg: 'bg-orange-50',   ring: 'ring-orange-100'  },
  RRHH:         { label: 'RRHH',        icon: <Briefcase size={11}/>,     color: 'text-pink-700',    bg: 'bg-pink-50',     ring: 'ring-pink-100'    },
  General:      { label: 'General',     icon: <Newspaper size={11}/>,     color: 'text-gray-600',    bg: 'bg-gray-100',    ring: 'ring-gray-100'    },
}

function hrefFor(n: Noticia) {
  if (n.id === 'tarifas-card') return '/tarifas'
  if (n.id === 'horarios-card') return '/horarios'
  return `/noticias/${n.slug}`
}

const isSpecial = (n: Noticia) => n.id === 'tarifas-card' || n.id === 'horarios-card'

/* Decorative graphic panel for tarifas/horarios cards (no real image) */
function SpecialGraphic({ n, big }: { n: Noticia; big?: boolean }) {
  const isTarifa = n.id === 'tarifas-card'
  const grad = isTarifa
    ? 'from-emerald-500 via-green-500 to-teal-600'
    : 'from-blue-500 via-sky-500 to-cyan-600'
  return (
    <div className={`relative h-full w-full bg-gradient-to-br ${grad} flex flex-col items-center justify-center overflow-hidden ${big ? 'min-h-[16rem] p-8' : 'min-h-[10rem] p-5'}`}>
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10"/>
      <div className="absolute -bottom-10 -left-6 w-40 h-40 rounded-full bg-white/10"/>
      <div className="relative text-white/90 mb-2">
        {isTarifa ? <DollarSign size={big ? 44 : 32}/> : <CalendarClock size={big ? 44 : 32}/>}
      </div>
      <span className={`relative font-black text-white tracking-tight ${big ? 'text-3xl' : 'text-xl'}`}>
        {isTarifa ? 'Tarifas' : 'Horarios'}
      </span>
      <span className="relative text-white/80 text-[11px] font-semibold uppercase tracking-widest mt-1">COOTRANSA</span>
    </div>
  )
}

function isNew(created_at?: string) {
  if (!created_at) return false
  return Date.now() - new Date(created_at).getTime() < 1000 * 60 * 60 * 24 * 7
}

function fmtDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Badge({ n }: { n: Noticia }) {
  const meta = SECTION_META[n.seccion] ?? SECTION_META.General
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${meta.bg} ${meta.color}`}>
        {meta.icon}{meta.label}
      </span>
      {isNew(n.created_at) && (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
          ● NUEVO
        </span>
      )}
    </div>
  )
}

/* Featured horizontal layout */
function FeaturedCard({ n }: { n: Noticia }) {
  const meta = SECTION_META[n.seccion] ?? SECTION_META.General
  return (
    <a
      href={hrefFor(n)}
      draggable={false}
      className="group flex-shrink-0 w-[88vw] max-w-[34rem] grid sm:grid-cols-2 rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {isSpecial(n) ? (
        <SpecialGraphic n={n} big />
      ) : n.image_url ? (
        <div className="relative h-56 sm:h-auto sm:min-h-[16rem] bg-gray-900 flex items-center justify-center overflow-hidden">
          <img draggable={false} src={n.image_url} alt={n.title} className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-40"/>
          <img draggable={false} src={n.image_url} alt={n.title} className="relative max-h-full w-auto object-contain z-10"/>
        </div>
      ) : (
        <div className={`h-56 sm:h-auto flex items-center justify-center ${meta.bg}`}>
          <span className={`${meta.color} opacity-20 scale-[5] block`}>{meta.icon}</span>
        </div>
      )}
      <div className="p-6 sm:p-8 flex flex-col justify-center">
        <Badge n={n} />
        <h3 className="mt-3 text-xl font-bold text-gray-900 leading-tight group-hover:text-green-700 transition-colors">{n.title}</h3>
        {n.created_at && <p className="mt-1.5 text-xs text-gray-400">{fmtDate(n.created_at)}</p>}
        <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-3">{n.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 group-hover:gap-3 transition-all">
          Leer más <ArrowRight size={15}/>
        </span>
      </div>
    </a>
  )
}

export default function NewsBanner() {
  const [items, setItems] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const trackRef   = useRef<HTMLDivElement>(null)
  const animRef    = useRef<number>()
  const pauseRef   = useRef(false)
  const dragRef    = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  useEffect(() => {
    async function load() {
      const [{ data: noticias }, { data: tarifas }, { data: horarios }] = await Promise.all([
        supabase.from('noticias').select('*').eq('estado', 'publicado').order('created_at', { ascending: false }).limit(20),
        supabase.from('tarifas').select('*').eq('activa', true).limit(50),
        supabase.from('horarios').select('*').limit(50),
      ])

      const cards: Noticia[] = [...(noticias ?? [])]

      if ((tarifas as Tarifa[] | null)?.length) {
        const sample = (tarifas as Tarifa[]).slice(0, 4)
        const preview = sample.map(t => `${t.origen} → ${t.destino}: $${t.precio}`).join(' · ')
        cards.push({ id: 'tarifas-card', slug: 'tarifas', eyebrow: 'Tarifas vigentes', title: 'Consulta nuestras tarifas actualizadas', summary: preview, seccion: 'Tarifas', estado: 'publicado' })
      }

      if ((horarios as Horario[] | null)?.length) {
        const sample = (horarios as Horario[]).slice(0, 3)
        const preview = sample.map(h => `${h.estacion}: ${h.primera_salida}–${h.ultima_salida}`).join(' · ')
        cards.push({ id: 'horarios-card', slug: 'horarios', eyebrow: 'Horarios de salida', title: 'Horarios de estaciones COOTRANSA', summary: preview, seccion: 'Horarios', estado: 'publicado' })
      }

      setItems(cards)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (items.length < 2) return
    const el = trackRef.current
    if (!el) return
    const loop = () => {
      if (!pauseRef.current) {
        el.scrollLeft += 0.5
        const half = el.scrollWidth / 2
        if (el.scrollLeft >= half) el.scrollLeft -= half
      }
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [items])

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current
    if (!el) return
    e.preventDefault()
    dragRef.current = { active: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: false }
    pauseRef.current = true
  }

  const onMouseUp = () => {
    dragRef.current.active = false
    setTimeout(() => { pauseRef.current = false }, 500)
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return
    const el = trackRef.current
    if (!el) return
    const dx = e.pageX - dragRef.current.startX
    if (Math.abs(dx) > 5) dragRef.current.moved = true
    el.scrollLeft = dragRef.current.scrollLeft - dx
  }

  // Capture phase: kill click if the user actually dragged
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      dragRef.current.moved = false
    }
  }

  const nudge = (dir: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    pauseRef.current = true
    const distance = dir === 'left' ? -420 : 420
    const start = el.scrollLeft
    const startTime = performance.now()
    const duration = 420 // ms
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      el.scrollLeft = start + distance * ease(t)
      if (t < 1) requestAnimationFrame(animate)
      else setTimeout(() => { pauseRef.current = false }, 80)
    }
    requestAnimationFrame(animate)
  }

  if (loading || items.length === 0) return null

  const scrolls = items.length >= 2
  const list = scrolls ? [...items, ...items] : items

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-200 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-7">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={15} className="text-green-600"/>
          <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Actualidad</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Noticias y avisos COOTRANSA</h2>
      </div>

      {scrolls ? (
        <div className="relative">
          {/* fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"/>
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"/>
          {/* desktop arrows — centred vertically over the track */}
          <button
            onClick={() => nudge('left')}
            aria-label="Anterior"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-300 hover:shadow-lg transition-all"
          ><ChevronLeft size={20}/></button>
          <button
            onClick={() => nudge('right')}
            aria-label="Siguiente"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-300 hover:shadow-lg transition-all"
          ><ChevronRight size={20}/></button>
          <div
            ref={trackRef}
            className="flex gap-5 px-4 sm:px-16 overflow-x-auto select-none cursor-grab active:cursor-grabbing no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onMouseMove={onMouseMove}
            onClickCapture={onClickCapture}
            onTouchStart={() => { pauseRef.current = true }}
            onTouchEnd={() => { setTimeout(() => { pauseRef.current = false }, 2500) }}
          >
            {list.map((n, i) => <FeaturedCard key={`${n.id}-${i}`} n={n} />)}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.map((n) => <FeaturedCard key={n.id} n={n} />)}
        </div>
      )}
    </section>
  )
}
