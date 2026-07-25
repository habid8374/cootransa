// ============================================================
// Festivos de Colombia y cálculo de días hábiles
// Incluye festivos fijos, Ley Emiliani (trasladados al lunes)
// y los festivos móviles según la Pascua.
// ============================================================

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Domingo de Pascua (algoritmo de Butcher, calendario gregoriano)
function pascua(anio: number): Date {
  const a = anio % 19
  const b = Math.floor(anio / 100)
  const c = anio % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const mes = Math.floor((h + l - 7 * m + 114) / 31)   // 3 = marzo, 4 = abril
  const dia = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(anio, mes - 1, dia)
}

// Traslada una fecha al lunes siguiente (si no cae ya en lunes)
function siguienteLunes(d: Date): Date {
  const dow = d.getDay()                 // 0 = domingo … 6 = sábado
  const add = dow === 1 ? 0 : (8 - dow) % 7
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + add)
}

/** Conjunto de festivos (YYYY-MM-DD) de Colombia para un año dado */
export function festivosColombia(anio: number): Set<string> {
  const set = new Set<string>()
  const add = (d: Date) => set.add(iso(d))
  const D = (m: number, day: number) => new Date(anio, m - 1, day)

  // Festivos fijos
  add(D(1, 1)); add(D(5, 1)); add(D(7, 20)); add(D(8, 7)); add(D(12, 8)); add(D(12, 25))

  // Ley Emiliani (se trasladan al lunes siguiente)
  ;[[1, 6], [3, 19], [6, 29], [8, 15], [10, 12], [11, 1], [11, 11]]
    .forEach(([m, day]) => add(siguienteLunes(D(m, day))))

  // Móviles según la Pascua
  const p = pascua(anio)
  const rel = (n: number) => new Date(p.getFullYear(), p.getMonth(), p.getDate() + n)
  add(rel(-3))                    // Jueves Santo
  add(rel(-2))                    // Viernes Santo
  add(siguienteLunes(rel(39)))    // Ascensión del Señor
  add(siguienteLunes(rel(60)))    // Corpus Christi
  add(siguienteLunes(rel(68)))    // Sagrado Corazón de Jesús

  return set
}

const _cache: Record<number, Set<string>> = {}
const festivosDe = (anio: number) => (_cache[anio] ??= festivosColombia(anio))

/** ¿Es un día hábil? (no sábado, no domingo, no festivo) */
export function esHabil(d: Date): boolean {
  const dow = d.getDay()
  if (dow === 0 || dow === 6) return false
  return !festivosDe(d.getFullYear()).has(iso(d))
}

/** Suma n días hábiles a partir del día siguiente a `inicio` */
export function sumarDiasHabiles(inicio: Date, n: number): Date {
  let d = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate())
  let contados = 0
  while (contados < n) {
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    if (esHabil(d)) contados++
  }
  return d
}

/** Días hábiles entre dos fechas (positivo si `hasta` es futuro, negativo si ya pasó) */
export function diasHabilesEntre(desde: Date, hasta: Date): number {
  const a = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate())
  const b = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate())
  if (b < a) return -diasHabilesEntre(hasta, desde)
  let n = 0
  const d = new Date(a)
  while (d < b) {
    d.setDate(d.getDate() + 1)
    if (esHabil(d)) n++
  }
  return n
}
