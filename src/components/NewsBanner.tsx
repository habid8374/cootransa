import { useEffect, useState, useRef } from 'react'
import { supabase, type Noticia, type Tarifa, type Horario } from '../lib/supabase'
import { Clock, Briefcase, DollarSign, CalendarClock, Newspaper, ChevronRight, ChevronLeft } from 'lucide-react'

const SECTION_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  Tarifas:      { label: 'Tarifas',     icon: <DollarSign size={11}/>,    color: 'text-emerald-700', bg: 'bg-emerald-50'  },
  Horarios:     { label: 'Horarios',    icon: <CalendarClock size={11}/>, color: 'text-blue-700',    bg: 'bg-blue-50'     },
  Noticias:     { label: 'Noticia',     icon: <Newspaper size={11}/>,     color: 'text-violet-700',  bg: 'bg-violet-50'   },
  Convocatoria: { label: 'Empleo',      icon: <Briefcase size={11}/>,     color: 'text-orange-700',  bg: 'bg-orange-50'   },
  RRHH:         { label: 'RRHH',        icon: <Briefcase size={11}/>,     color: 'text-pink-700',    bg: 'bg-pink-50'     },
  General:      { label: 'General',     icon: <Newspaper size={11}/>,     color: 'text-gray-600',    bg: 'bg-gray-100'    },
}

function isNew(created_at?: string) {
  if (!created_at) return false
  return Date.now() - new Date(created_at).getTime() < 1000 * 60 * 60 * 24 * 7
}

function Card({ n }: { n: Noticia }) {
  const meta = SECTION_META[n.seccion] ?? SECTION_META.General
  const nuevo = isNew(n.created_at)

  return (
    <a
      href={`/noticias/${n.slug}`}
      className="group flex-shrink-0 w-64 sm:w-72 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {n.image_url ? (
        <div className="h-36 overflow-hidden bg-gray-100">
          <img src={n.image_url} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        </div>
      ) : (
        <div className={`h-36 flex items-center justify-center ${meta.bg}`}>
          <span className={`${meta.color} opacity-20 scale-[4] block`}>{meta.icon}</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
            {meta.icon}{meta.label}
          </span>
          {nuevo && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
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
  const scrollRef = useRef<HTMLDivElement>(null)

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
        cards.push({
          id: 'tarifas-card',
          slug: 'tarifas',
          eyebrow: 'Tarifas vigentes',
          title: 'Consulta nuestras tarifas actualizadas',
          summary: preview,
          seccion: 'Tarifas',
          estado: 'publicado',
        })
      }

      if ((horarios as Horario[] | null)?.length) {
        const sample = (horarios as Horario[]).slice(0, 3)
        const preview = sample.map(h => `${h.estacion}: ${h.primera_salida}–${h.ultima_salida}`).join(' · ')
        cards.push({
          id: 'horarios-card',
          slug: 'horarios',
          eyebrow: 'Horarios de salida',
          title: 'Horarios de estaciones COOTRANSA',
          summary: preview,
          seccion: 'Horarios',
          estado: 'publicado',
        })
      }

      setItems(cards)
      setLoading(false)
    }
    load()
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  if (loading || items.length === 0) return null

  return (
    <section className="bg-gray-50 border-y border-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-green-600"/>
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Actualidad COOTRANSA</span>
          </div>
          {items.length > 3 && (
            <div className="flex items-center gap-2">
              <button onClick={() => scroll('left')}  className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-300 transition-all shadow-sm"><ChevronLeft size={16}/></button>
              <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-300 transition-all shadow-sm"><ChevronRight size={16}/></button>
            </div>
          )}
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((n) => (
            <div key={n.id} className="snap-start">
              <Card n={n} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
