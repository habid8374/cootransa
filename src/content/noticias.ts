export interface ScheduleRow {
  estacion: string
  primera: string
  ultima: string
  frecuencia: string
}

export interface NoticiaPage {
  slug: string
  eyebrow: string
  title: string
  summary: string
  /** Imagen a pantalla completa (en /public). Opcional. */
  image?: string
  /** Tabla de horarios demo. Opcional. */
  schedule?: ScheduleRow[]
  /** Nota al pie opcional */
  note?: string
}

export const noticiaPages: NoticiaPage[] = [
  {
    slug: 'tarifas',
    eyebrow: 'Información al usuario',
    title: 'Tarifas',
    summary: 'Consulte las tarifas vigentes de nuestras rutas y servicios. Valores autorizados y actualizados.',
    image: '/tarifas.jpeg',
    note: 'Las tarifas pueden variar según disposiciones de la autoridad de transporte. Para mayor información comuníquese con nuestras oficinas.',
  },
  {
    slug: 'horarios',
    eyebrow: 'Programación de servicio',
    title: 'Horarios de estaciones',
    summary: 'Programación de salidas desde nuestras principales estaciones. Horario sujeto a disponibilidad.',
    schedule: [
      { estacion: 'Sabanalarga', primera: '4:30 a. m.', ultima: '8:00 p. m.', frecuencia: 'Cada 20 min' },
      { estacion: 'Barranquilla (Terminal)', primera: '5:00 a. m.', ultima: '8:30 p. m.', frecuencia: 'Cada 25 min' },
      { estacion: 'Corredor Universitario', primera: '5:30 a. m.', ultima: '7:30 p. m.', frecuencia: 'Cada 30 min' },
      { estacion: 'Manatí', primera: '5:00 a. m.', ultima: '6:30 p. m.', frecuencia: 'Cada 40 min' },
      { estacion: 'Baranoa', primera: '4:45 a. m.', ultima: '7:45 p. m.', frecuencia: 'Cada 20 min' },
      { estacion: 'San Cristóbal (Bolívar)', primera: '6:00 a. m.', ultima: '5:30 p. m.', frecuencia: 'Cada 45 min' },
    ],
    note: 'Horario de referencia (demo). Los horarios definitivos serán publicados oficialmente. Domingos y festivos pueden tener programación especial.',
  },
  {
    slug: 'noticias',
    eyebrow: 'Comunicados',
    title: 'Noticias',
    summary: 'Avisos importantes y comunicados oficiales de COOTRANSA para nuestros usuarios.',
    image: '/aviso_importante.jpeg',
    note: 'Mantente al día con nuestros comunicados oficiales a través de nuestras redes sociales.',
  },
  {
    slug: 'convocatoria',
    eyebrow: 'Únete a nuestro equipo',
    title: 'Convocatoria laboral',
    summary: 'Conoce nuestras vacantes y oportunidades de trabajo. Forma parte de la familia COOTRANSA.',
    image: '/convocatoria_laboral.jpeg',
    note: 'Para postularte, envía tu hoja de vida al correo gerenciacootransa@gmail.com o acércate a nuestras oficinas.',
  },
]
