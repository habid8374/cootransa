export interface Block {
  type: 'p' | 'check' | 'dash' | 'bullet'
  items: string[]
}

export interface AboutPage {
  slug: string
  eyebrow: string
  title: string
  blocks: Block[]
}

export const aboutPages: AboutPage[] = [
  {
    slug: 'historia',
    eyebrow: 'Historia COOTRANSA',
    title: 'Reseña',
    blocks: [
      { type: 'p', items: [
        'El arduo trabajo, la armonía y la entereza de un grupo selecto de colombianos ubicados en el seno de Sabanalarga – Atlántico; en compañía de coterráneos manatieros, le apostaron a un futuro que hoy es el orgullo de nuestra región.',
        'Sus ideas de construir una empresa de trabajo cooperativo, solo con el apoyo de pocos recursos económicos en el momento, que habían adquirido con tenacidad, para que los habitantes de nuestra región llegaran a la capital del departamento en busca de estudio, trabajo, recreación, y de realizar sus sueños ¿Por qué no?',
        'Fue así como, cumpliendo con la normatividad legal vigente, radican y obtienen la personería jurídica el 27 de junio de 1972 y cámara de comercio el 6 de mayo de 1977 como COOPERATIVA DE TRANSPORTADORES DE SABANALARGA “COOTRANSA LTDA®”. Fijan su domicilio en la plaza principal de Sabanalarga, con 35 socios fundadores y 40 cupos como capacidad transportadora de pasajeros, constituyéndose como la primera empresa de transporte para pasajeros en Sabanalarga; así fue como nuestra cooperativa marcó un precedente en el progreso de esta comunidad.'
      ]}
    ]
  },
  {
    slug: 'actualidad',
    eyebrow: 'Nosotros',
    title: 'En la Actualidad',
    blocks: [
      { type: 'p', items: [
        'Son alrededor de 54 socios los que conforman la familia COOTRANSA®, los cuales están comprometidos con la movilidad, seguridad y progreso de la región; por lo que cuentan con un parque automotor renovado en un 99% y una plataforma tecnológica que permite el monitoreo satelital, despachos autorizados y vigilancia permanente; lo que hace a COOTRANSA® la mejor alternativa para transportarse.'
      ]}
    ]
  },
  {
    slug: 'mision',
    eyebrow: 'Nosotros',
    title: 'Nuestra Misión',
    blocks: [
      { type: 'p', items: [
        'Somos la Cooperativa de transporte de Sabanalarga “COOTRANSA” dedicada a la prestación del servicio de transporte público terrestre automotor de pasajeros intermunicipal y especial de pasajeros a nivel regional y nacional.',
        'Ofrecemos un servicio de calidad, con personal competente, con vehículos en óptimas condiciones de operatividad que permiten reducir la contaminación atmosférica, contamos con sistema de gestión integral, una infraestructura adecuada para evitar lesiones y enfermedades en nuestros colaboradores.',
        'Sabanalarga, enero del 2025.'
      ]}
    ]
  },
  {
    slug: 'vision',
    eyebrow: 'Nosotros',
    title: 'Nuestra Visión',
    blocks: [
      { type: 'p', items: [
        'COOTRANSA se proyecta para el año 2030 como una empresa líder en la prestación del servicio de transporte público terrestre automotor intermunicipal y especial de pasajeros a nivel regional y nacional, con un alto grado de confiabilidad en los servicios prestados a sus clientes y usuarios, generando así mayor valor a sus asociados, lo anterior, a través de un sistema de gestión integral que permita prestar servicios de forma segura, satisfacer a nuestros clientes y partes interesadas.'
      ]}
    ]
  },
  {
    slug: 'politica',
    eyebrow: 'Sistema Integrado de Gestión',
    title: 'Nuestra Política',
    blocks: [
      { type: 'p', items: [
        'COOTRANSA, empresa dedicada al transporte terrestre automotor especial de pasajeros y transporte público intermunicipal, se compromete con la prestación de servicios de forma segura actuando con responsabilidad y compromiso en satisfacer las necesidades y expectativas de nuestros clientes y usuarios a fin de proporcionar confianza en nuestros procedimientos operacionales, considerando como principio fundamental la promoción de la calidad de vida laboral, la proporción de las condiciones de trabajo seguras y saludables para la prevención de lesiones, deterioro de la salud y la protección del medio ambiente.',
        'En pro de una mejora continua la empresa diseña e implementa un Sistema Integrado de Gestión con participación y compromiso de los clientes, usuarios, colaboradores, asociados, proveedores, contratistas, visitantes y demás partes interesadas.',
        'La política de COOTRANSA declara su respaldo basado en los siguientes principios:'
      ]},
      { type: 'check', items: [
        'El logro y mantenimiento de las certificaciones ISO 9001:2015 e ISO 45001:2018, como herramientas de mejoramiento continuo, para garantizar la eficacia y eficiencia de todos sus procesos y controles operacionales.',
        'Suministrar recursos económicos para atender los objetivos propuestos en términos de Calidad, Seguridad vial, Salud y seguridad en el trabajo.',
        'Lograr la satisfacción de nuestros clientes y partes interesadas implementando altos estándares en seguridad vial que busquen operaciones libres de accidentes vehiculares, el cumplimiento de sus necesidades y requisitos aprobados.',
        'Dar cumplimiento de los Requisitos Legales, Regulaciones en Seguridad y Salud en el trabajo, seguridad vial y demás aspectos Normativos que la organización suscriba como necesarios para el desarrollo de una operación sana y eficaz.',
        'Identificar los peligros, valorar los riesgos y establecer controles a fin de prevenir y/o reducir la ocurrencia de lesiones, accidentes de trabajo, enfermedades laborales y riesgos, teniendo en cuenta la intervención de los programas para sus riesgos prioritarios:'
      ]},
      { type: 'dash', items: ['Seguridad Vial', 'Público', 'Osteomuscular', 'Psicosocial'] },
      { type: 'check', items: [
        'Promover la participación activa y consulta de los diferentes comités y trabajadores de la organización en el desarrollo de actividades, planes y programas de fomento en salud y seguridad en el trabajo y seguridad vial.',
        'Promover las condiciones adecuadas de los vehículos propios y asociados, que aporten la seguridad del pasajero y disminuyan el impacto ambiental en la generación de emisiones.'
      ]}
    ]
  },
  {
    slug: 'valores',
    eyebrow: 'Nuestra cultura',
    title: 'Valores',
    blocks: [
      { type: 'p', items: [
        'En COOTRANSA estamos comprometidos con nuestro trabajo, nuestros clientes y nuestros colaboradores, profesando valores como:'
      ]},
      { type: 'bullet', items: [
        'Servicio: Nuestra actitud está orientada a ayudar al cliente, a prestar un servicio con buen trato aportando al continuo mejoramiento de las actividades que realizamos en los diferentes ámbitos de desarrollo a fin de satisfacer las necesidades de nuestros clientes.',
        'Responsabilidad: Cumplir a nuestro cliente con el servicio adquirido bajo sus cinco necesidades: seguridad, puntualidad, comodidad, buen trato y servicio adquirido vs servicio ofrecido.',
        'Honestidad: Elegimos actuar siempre con base en la verdad, siendo nuestros pensamientos y acciones reconocidas por su integridad y coherencia. Los colaboradores trabajan con honradez y rectitud en todas sus acciones.',
        'Compromiso: El cliente es lo primero para el logro de los objetivos y el cumplimiento de estos valores, por ello contamos con el liderazgo y capacidad de entrega de todos los colaboradores.',
        'Profesionalismo: Conducta profesional dando a los clientes la seguridad de que sus procesos e información está siendo analizada y manejada por personal con la más alta competencia.',
        'Respeto: Reconocemos el valor que cada uno de nosotros tiene como individuo, al igual que valoramos en igualdad de condiciones las necesidades e intereses que tienen los clientes que demandan nuestros servicios.',
        'Solidaridad: Practicamos de manera activa el reconocimiento por la diferencia, valorando la diversidad, la colaboración mutua y el trabajo en equipo para el logro efectivo de la misión y los objetivos de la empresa.'
      ]}
    ]
  },
  {
    slug: 'objetivo',
    eyebrow: 'Gestión Integral',
    title: 'Nuestro Objetivo',
    blocks: [
      { type: 'p', items: [
        'Teniendo en cuenta la política de gestión integral, el compromiso de mejora continua y como control para la medición de la eficacia en los procesos, COOTRANSA ha establecido los siguientes objetivos:'
      ]},
      { type: 'bullet', items: [
        'Incrementar el grado de satisfacción de nuestros clientes.',
        'Mejorar el desempeño del SGI y las condiciones de trabajo mediante la identificación, prevención y control de riesgos que afecten la SST, el desempeño del SIG y la atención al cliente.',
        'Evitar la ocurrencia de accidentes de trabajo, accidentes de tránsito y enfermedades laborales.',
        'Lograr el cumplimiento de la normatividad vigente en materia de Seguridad y Salud en el Trabajo.',
        'Promover el excelente desempeño de nuestro personal a través de los programas de capacitación en miras de aumentar y potencializar sus competencias y su participación.',
        'Promover las buenas relaciones con los proveedores y contratistas, asegurando que los bienes y servicios necesarios estén disponibles, sean adecuados y cumplan con requisitos legales y otros establecidos.'
      ]}
    ]
  }
]
