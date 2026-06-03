import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { supabase, type Noticia } from '../lib/supabase'
import { Clock, Briefcase, DollarSign, CalendarClock, Newspaper, ChevronRight } from 'lucide-react'

const SECTION_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; href: (slug: string) => string }> = {
  Tarifas:       { label: 'Tarifas',      icon: <DollarSign size={12}/>,    color: 'text-emerald-700', bg: 'bg-emerald-50',   href: (s) => `/noticias/${s}` },
  Horarios:      { label: 'Horarios',     icon: <CalendarClock size={12}/>, color: 'text-blue-700',    bg: 'bg-blue-50',      href: (s) => `/noticias/${s}` },
  Noticias:      { label: 'Noticia',      icon: <Newspaper size={12}/>,     color: 'text-violet-700',  bg: 'bg-violet-50',    href: (s) => `/noticias/${s}` },
  Convocatoria:  { label: 'Empleo',       icon: <Briefcase size={12}/>,     color: 'text-orange-700',  bg: 'bg-orange-50',    href: (s) => `/noticias/${s}` },
  RRHH:          { label: 'RRHH',         icon: <Briefcase size={12}/>,     color: 'text-pink-700',    bg: 'bg-pink-50',      href: (s) => `/noticias/${s}` },
  General:       { label: 'General',      icon: <Newspaper size={12}/>,     color: 'text-gray-700',    bg: 'bg-gray-100',     href: (s) => `/noticias/${s}` },
}

function isNew(created_at?: string) {
  if (!created_at) return false
  return Date.now() - new Date(created_at).getTime() < 1000 * 60 * 60 * 24 * 7
}

function Card({ n }: { n: Noticia }) {
  const meta = SECTION_META[n.seccion] ?? SECTION_META.General
  const href = meta.href(n.slug)
  const nuevo = isNew(n.created_at)

  return (
    <a
      href={href}
      className="group flex-shrink-0 w-64 sm:w-72 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {n.image_url ? (
        <div className="h-36 overflow-hidden bg-gray-100">
          <img src={n.image_url} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        </div>
      ) : (
        <div className="h-36 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
          <span className={`${meta.color} opacity-30`}>{meta.icon && <span className="scale-[3] block">{meta.icon}</span>}</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
            {meta.icon}{meta.label}
          </span>
          {nuevo && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 animate-pulse">
              ● NUEVO
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:text-green-700 transition-colors">{n.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{n.summary}</p>
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-600 group-hover:gap-2 transition-all">
          Ver más <ChevronRight size={12}/>
        </div>
      </div>
    </a>
  )
}

export default function NewsBanner() {
  const [items, setItems] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef  = useRef<number>()
  const pauseRef = useRef(false)
  const posRef   = useRef(0)

  useEffect(() => {
    supabase.from('noticias').select('*').eq('estado', 'publicado').order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => { setItems(data ?? []); setLoading(false) })
  }, [])

  useEffect(() => {
    if (items.length === 0) return
    const track = trackRef.current
    if (!track) return

    const speed = 0.5
    const loop = () => {
      if (!pauseRef.current) {
        posRef.current -= speed
        const half = track.scrollWidth / 2
        if (Math.abs(posRef.current) >= half) posRef.current = 0
        track.style.transform = `translateX(${posRef.current}px)`
      }
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [items])

  if (loading || items.length === 0) return null

  const doubled = [...items, ...items]

  return (
    <section className="bg-gray-50 border-y border-gray-200 py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-green-600"/>
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Actualidad COOTRANSA</span>
          </div>
          <span className="text-xs text-gray-400">{items.length} publicación{items.length !== 1 ? 'es' : ''}</span>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => { pauseRef.current = true }}
        onMouseLeave={() => { pauseRef.current = false }}
        onTouchStart={() => { pauseRef.current = true }}
        onTouchEnd={() => { setTimeout(() => { pauseRef.current = false }, 1500) }}
      >
        {/* fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"/>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"/>

        <motion.div
          ref={trackRef}
          className="flex gap-4 px-8 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {doubled.map((n, i) => <Card key={`${n.id}-${i}`} n={n} />)}
        </motion.div>
      </div>
    </section>
  )
}
