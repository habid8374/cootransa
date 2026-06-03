import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL  as string || 'https://placeholder.supabase.co'
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'placeholder'

export const supabase = createClient(url, anon)

export type EstadoNoticia = 'publicado' | 'borrador'

export interface Noticia {
  id?: string
  slug: string
  eyebrow: string
  title: string
  summary: string
  image_url?: string
  schedule?: ScheduleRow[]
  note?: string
  estado: EstadoNoticia
  seccion: string
  created_at?: string
  updated_at?: string
}

export interface ScheduleRow {
  estacion: string
  primera: string
  ultima: string
  frecuencia: string
}

export interface Tarifa {
  id?: string
  origen: string
  destino: string
  precio: string
  tipo: string
  activa: boolean
}

export interface Horario {
  id?: string
  estacion: string
  primera_salida: string
  ultima_salida: string
  frecuencia: string
}
