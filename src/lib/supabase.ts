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

// ── Carnets de tarifa preferencial ──────────────────────────────────────
export type EstadoSolicitud = 'pendiente' | 'aprobado' | 'rechazado'

export interface CarnetCategoria {
  id?: string
  nombre: string
  descripcion?: string
  activa: boolean
  created_at?: string
}

export interface CarnetDocumento {
  id?: string
  nombre: string
  descripcion?: string
  obligatorio: boolean
  activo: boolean
  orden?: number
  created_at?: string
}

export interface CarnetSolicitud {
  id?: string
  codigo: string                 // código único para el QR
  nombre: string
  tipo_documento?: string        // C.C., T.I., C.E., etc.
  cedula: string                 // número del documento
  institucion: string
  direccion: string
  codigo_postal?: string
  telefono: string
  correo: string
  categoria_id?: string
  categoria_nombre?: string      // desnormalizado para el carnet
  foto_url?: string
  documentos?: { nombre: string; path?: string; url?: string }[]
  estado: EstadoSolicitud
  motivo_rechazo?: string
  vigencia_inicio?: string
  vigencia_fin?: string
  created_at?: string
  aprobado_at?: string
}

/** Genera un código único y legible para el carnet (base del QR) */
export function generarCodigoCarnet(): string {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  const arr = new Uint32Array(8)
  crypto.getRandomValues(arr)
  for (let i = 0; i < 8; i++) s += alfabeto[arr[i] % alfabeto.length]
  return `COO-${s.slice(0, 4)}-${s.slice(4, 8)}`
}

// ── Config key/value helpers (tabla `config`, lectura pública) ───────────
export async function getConfig(key: string, fallback = ''): Promise<string> {
  const { data } = await supabase.from('config').select('value').eq('key', key).single()
  return data?.value ?? fallback
}

export async function setConfig(key: string, value: string): Promise<void> {
  await supabase.from('config').upsert({ key, value }, { onConflict: 'key' })
}

// ── Config SECRETA (tabla `notif_config`, solo admin autenticado) ────────
export async function getSecret(key: string, fallback = ''): Promise<string> {
  const { data } = await supabase.from('notif_config').select('value').eq('key', key).maybeSingle()
  return data?.value ?? fallback
}

export async function setSecret(key: string, value: string): Promise<void> {
  await supabase.from('notif_config').upsert({ key, value }, { onConflict: 'key' })
}
