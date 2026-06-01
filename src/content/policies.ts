import type { Block } from './about'

export interface PolicyPage {
  slug: string
  code: string
  version: string
  date: string
  eyebrow: string
  title: string
  summary: string
  blocks: Block[]
}

export const policyPages: PolicyPage[] = [
  {
    slug: 'gestion-integral',
    code: 'SIG-POL-01',
    version: '04',
    date: '31 de marzo de 2025',
    eyebrow: 'Sistema Integrado de Gestión',
    title: 'Política de Gestión Integral',
    summary: 'Nuestro compromiso con un servicio seguro, de calidad y responsable con las personas y el medio ambiente.',
    blocks: [
      { type: 'p', items: [
        'COOTRANSA, empresa dedicada al transporte terrestre automotor especial de pasajeros y transporte público intermunicipal, nos comprometemos con la prestación de servicios de forma segura, actuando con responsabilidad y compromiso en satisfacer las necesidades y expectativas de nuestros clientes y usuarios, a fin de proporcionar confianza en nuestros procedimientos operacionales, considerando como principio fundamental la promoción de la calidad de vida laboral, la proporción de condiciones de trabajo seguras y saludables para la prevención de lesiones, el deterioro de la salud y la protección del medio ambiente.',
        'En pro de una mejora continua, la empresa diseña e implementa un Sistema Integrado de Gestión con participación y compromiso de los clientes, usuarios, colaboradores, asociados, proveedores, contratistas, visitantes y demás partes interesadas.',
        'La política de COOTRANSA declara su respaldo basado en los siguientes principios:'
      ]},
      { type: 'check', items: [
        'El logro y mantenimiento de las certificaciones ISO 9001:2015 e ISO 45001:2018, como herramientas de mejoramiento continuo, para garantizar la eficacia y eficiencia de todos sus procesos y controles operacionales.',
        'Suministrar recursos económicos para atender los objetivos propuestos en términos de Calidad, Seguridad Vial, Salud y Seguridad en el Trabajo.',
        'Lograr la satisfacción de nuestros clientes y partes interesadas implementando altos estándares en seguridad vial que busquen operaciones libres de accidentes vehiculares, y el cumplimiento de sus necesidades y requisitos aprobados.',
        'Dar cumplimiento de los requisitos legales y regulaciones en Seguridad y Salud en el Trabajo, seguridad vial y demás aspectos normativos que la organización suscriba como necesarios para el desarrollo de una operación sana y eficaz.',
        'Identificar los peligros, valorar los riesgos y establecer controles a fin de prevenir y/o reducir la ocurrencia de lesiones, accidentes de trabajo, enfermedades laborales y riesgos, teniendo en cuenta la intervención de los programas para sus riesgos prioritarios:'
      ]},
      { type: 'dash', items: ['Seguridad Vial', 'Público', 'Osteomuscular', 'Psicosocial'] },
      { type: 'check', items: [
        'Promover la participación activa y consulta de los diferentes comités y trabajadores de la organización en el desarrollo de actividades, planes y programas de fomento en salud, seguridad en el trabajo y seguridad vial.',
        'Promover las condiciones adecuadas de los vehículos propios y asociados, que aporten a la seguridad del pasajero y disminuyan el impacto ambiental en la generación de emisiones.'
      ]}
    ]
  },
  {
    slug: 'seguridad-vial',
    code: 'SIG-POL-02',
    version: '03',
    date: '24 de febrero de 2025',
    eyebrow: 'Plan Estratégico de Seguridad Vial',
    title: 'Política de Seguridad Vial',
    summary: 'Prevención de siniestros viales y una cultura de seguridad en cada desplazamiento.',
    blocks: [
      { type: 'p', items: [
        'COOTRANSA, empresa dedicada al transporte terrestre automotor especial de pasajeros y transporte público intermunicipal, está comprometida con la planificación, implementación, seguimiento y mejoramiento continuo de la seguridad vial, la prevención de siniestros viales en desplazamientos misionales, la movilización de los usuarios y el control de la exposición a riesgos de nuestros conductores, tanto en los desplazamientos in itínere como en misión. Para ello establece las siguientes directrices:'
      ]},
      { type: 'check', items: [
        'Implementar y mantener una cultura de seguridad vial a través de estrategias de concientización que permitan la prevención de siniestros viales y la generación de hábitos de cortesía y respeto hacia otros conductores y actores viales vulnerables (peatones, ciclistas, pasajeros, motociclistas), así como el no uso de elementos de distracción durante la conducción.',
        'Establecer los recursos necesarios para la implementación y mantenimiento del Plan Estratégico de Seguridad Vial, garantizando el cumplimiento de sus objetivos, su mejora continua y el cumplimiento de toda la normatividad vigente aplicable.',
        'Asegurar la competencia del personal que conduce los vehículos, el respeto de los turnos de trabajo, la prevención de la fatiga y el control de los horarios de movilización y descanso.',
        'Gestionar el mantenimiento preventivo y correctivo del parque automotor de la empresa y de los socios, para mantener las condiciones y el desempeño óptimo de la flota vehicular.',
        'Velar porque se cumpla lo establecido en la Política de Prevención y Control de Alcohol y Drogas.',
        'Asegurar el monitoreo y seguimiento de la velocidad de los vehículos, respetando los límites establecidos por la ley a nivel nacional y departamental, y los lineamientos internos de la organización.'
      ]},
      { type: 'p', items: [
        'Por la violación de la presente política y sus reglamentaciones, se aplicarán las sanciones contempladas en el Reglamento Interno de Trabajo. Esta política se actualiza acorde a la Resolución 40595 de 2022.'
      ]}
    ]
  },
  {
    slug: 'alcohol-drogas',
    code: 'SIG-POL-03',
    version: '03',
    date: '06 de febrero de 2025',
    eyebrow: 'Seguridad y Salud en el Trabajo',
    title: 'Política de Prevención de Alcohol y Drogas',
    summary: 'Cero tolerancia al alcohol y a las sustancias psicoactivas para garantizar entornos seguros.',
    blocks: [
      { type: 'p', items: [
        'COOTRANSA, empresa dedicada al transporte terrestre automotor especial de pasajeros y transporte público intermunicipal, ha definido y establecido una política de alcohol y sustancias psicoactivas para prevenir, mejorar, conservar y preservar el bienestar de sus trabajadores, que permita un adecuado desempeño y competitividad dentro de la organización, así como el fomento de estilos de vida saludables, teniendo en cuenta la legislación vigente.',
        'La política de COOTRANSA declara su respaldo basado en los siguientes principios:'
      ]},
      { type: 'check', items: [
        'Mantener lugares de trabajo óptimos que permitan alcanzar los más altos estándares en seguridad y productividad. La organización es consciente de que el alcoholismo, la drogadicción y el abuso de sustancias psicoactivas, alucinógenas, enervantes, tabaco, vaper y cigarrillo tienen efectos adversos en la capacidad de desempeño y afectan considerablemente la salud, seguridad, eficiencia y productividad.',
        'La indebida utilización de medicamentos formulados, así como la posesión, distribución y venta de drogas no recetadas o de sustancias alucinógenas y enervantes en el desarrollo del trabajo, dentro de las instalaciones y/o de los buses, está estrictamente prohibida. Asimismo, se prohíbe la posesión, uso, consumo, distribución o venta de bebidas alcohólicas y cigarrillo en las instalaciones, vías o centros de trabajo. La empresa apoya la cero tolerancia al alcohol y las drogas.',
        'Se realizarán pruebas de alcoholimetría diariamente previo al despacho. Las pruebas de drogas podrán realizarse de forma aleatoria o por sospecha. Se considera prueba positiva para alcohol en aliento aquella con resultado mayor a 0,0 mg/L%.',
        'Cualquier trabajador está facultado para comunicar a su jefe directo si algún compañero consume sustancias alucinógenas o se presenta a trabajar bajo los efectos del alcohol.',
        'Se reconoce que la dependencia del alcohol, las drogas y el cigarrillo es una condición individual y social tratable. Los trabajadores que voluntariamente soliciten ayuda contarán con el tratamiento y la asistencia de la Cooperativa, con las correspondientes medidas de seguimiento.'
      ]},
      { type: 'p', items: [
        'Esta política es comunicada a todos los trabajadores, contratistas y partes interesadas.'
      ]}
    ]
  },
  {
    slug: 'acoso-sexual-vbg',
    code: 'SIG-POL-04',
    version: '03',
    date: '09 de diciembre de 2025',
    eyebrow: 'Convivencia y Equidad de Género',
    title: 'Prevención de Acoso Sexual Laboral y Violencia Basada en Género',
    summary: 'Un ambiente de trabajo digno, seguro y respetuoso, libre de acoso y violencia de género.',
    blocks: [
      { type: 'p', items: [
        'COOTRANSA ha definido y establecido una política de prevención de acoso sexual laboral, reconociendo que el acoso hacia o entre trabajadores, contratistas y subcontratistas afecta su estado de salud, su entorno familiar y su rendimiento productivo. Comprometida con esta política, la empresa busca garantizar un ambiente de trabajo digno, seguro y respetuoso, aplicable a todo el personal y terceros relacionados, en cumplimiento de la Ley 1010 de 2006, la Resolución 2646 de 2008, la Resolución 652 de 2012, la Resolución 1356 de 2012, la Circular 026 de 2023 y la Ley 2365 de 2024. La empresa se compromete a:'
      ]},
      { type: 'check', items: [
        'Prevenir y minimizar las conductas de acoso sexual laboral y defender el derecho de todos los trabajadores a ser tratados con dignidad.',
        'Establecer actividades que generen una conciencia colectiva de sana convivencia, promoviendo el trabajo en condiciones dignas y justas y protegiendo la intimidad, la honra, la salud mental y la libertad de las personas.'
      ]},
      { type: 'p', items: ['Compromisos y principios:'] },
      { type: 'bullet', items: [
        'Dignidad y Respeto: Promover la equidad de género, la sana convivencia y el respeto por la dignidad, honra y libertad de todos en el ámbito laboral.',
        'Confidencialidad: Garantizar la estricta confidencialidad de la identidad de la víctima y del denunciante durante todo el proceso.',
        'No Revictimización: Prohibir cualquier acto de censura, hostigamiento o represalia contra la víctima o el denunciante.'
      ]},
      { type: 'p', items: ['Obligaciones legales (Ley 2365 de 2024):'] },
      { type: 'bullet', items: [
        'Ruta de Atención: Establecer un procedimiento interno claro, confidencial y eficaz para la recepción, trámite, investigación y sanción de quejas por acoso sexual y VBG.',
        'Protección Inmediata: Adoptar medidas de protección inmediata a la víctima, evitando la interacción con la persona investigada e informando su derecho a terminar el contrato sin sanción si así lo desea.',
        'Remisión Legal: Informar a la víctima su derecho a acudir a la Fiscalía General de la Nación y remitir la queja a las autoridades competentes cuando lo solicite.',
        'Reporte Semestral: Publicar de forma semestral y anonimizada el número de quejas y sanciones, remitiendo la información al Sistema Integrado de Información de Violencias de Género (SIVIGE) del Ministerio del Trabajo.'
      ]}
    ]
  },
  {
    slug: 'tratamiento-datos',
    code: 'SIG-POL-05',
    version: '02',
    date: '23 de febrero de 2025',
    eyebrow: 'Protección de Datos Personales',
    title: 'Política de Tratamiento de Datos Personales',
    summary: 'Garantizamos la confidencialidad y el uso responsable de los datos personales bajo la Ley 1581 de 2012.',
    blocks: [
      { type: 'p', items: [
        'COOTRANSA, en cumplimiento de sus funciones empresariales y legales, cuenta con bases de datos personales, especialmente de la población trabajadora, asociados, proveedores y clientes, recolectadas a través de hojas de vida, encuestas, evaluaciones de desempeño, inscripción de proveedores y contratos, entre otros.',
        'Los datos personales conservados por COOTRANSA son objeto de recolección, almacenamiento, procesamiento, uso, análisis y transmisión o transferencia según corresponda, atendiendo de forma estricta los deberes de seguridad y confidencialidad ordenados por la Ley 1581 de 2012 y el Decreto 1074 de 2015, con las siguientes finalidades:'
      ]},
      { type: 'p', items: ['Datos de empleados de la empresa:'] },
      { type: 'check', items: [
        'Generar, analizar y evaluar datos con fines estadísticos y para ejecutar y desarrollar el contrato de trabajo, dar aplicación a la legislación laboral, de seguridad social y riesgos laborales, y otorgar beneficios al empleado.',
        'Compartir, cuando corresponda, los datos de los empleados con clientes actuales o potenciales en desarrollo de la relación comercial y para cumplir obligaciones contractuales.',
        'Dar respuesta a organismos de control, quejas y reclamos, y soportar procesos de auditoría externa e interna.',
        'Suministrar los datos a entidades públicas o administrativas en ejercicio de sus funciones legales, por orden judicial o a terceros autorizados por el titular o por la ley.'
      ]},
      { type: 'p', items: ['Datos de socios, clientes, usuarios y proveedores:'] },
      { type: 'check', items: [
        'Uso con fines estadísticos y para desarrollar el objeto social de la empresa, antes, durante y después de la relación contractual, administrando correctamente la relación comercial.',
        'Dar respuesta a peticiones, quejas, recursos y organismos de control.'
      ]},
      { type: 'p', items: ['Principios del tratamiento:'] },
      { type: 'bullet', items: [
        'Finalidad: La información se utiliza única y exclusivamente para los fines indicados, salvaguardando las bases de datos y restringiendo el acceso a personal no autorizado.',
        'Confidencialidad: Se toman todas las precauciones y medidas necesarias para garantizar la reserva de la información, conforme a la Ley 1581 de 2012.',
        'Seguridad: A través del área de sistemas se disponen controles de acceso y autenticación, manejo de niveles de autorización y monitoreo en los diferentes sistemas de información para proteger la confidencialidad de los datos.'
      ]}
    ]
  },
  {
    slug: 'desconexion-laboral',
    code: 'SIG-POL-06',
    version: '01',
    date: '01 de septiembre de 2025',
    eyebrow: 'Bienestar y Calidad de Vida',
    title: 'Política de Desconexión Laboral',
    summary: 'Garantizamos el derecho al descanso y el equilibrio entre la vida personal, familiar y laboral.',
    blocks: [
      { type: 'p', items: [
        'COOTRANSA ha definido y establecido una política de desconexión laboral, comprometiéndose con la protección y promoción de la salud física y mental de los trabajadores, garantizando el goce efectivo del tiempo libre y de los tiempos de descanso, licencia, permiso y/o vacaciones para conciliar la vida personal, familiar y laboral, en aplicación de la Ley 2191 de 2022, el Decreto 0728 de 2025 y el Decreto 0729 de 2025.',
        'Esta política establece el derecho de los trabajadores a no recibir comunicaciones laborales durante sus tiempos de descanso, vacaciones o fuera de su horario laboral, promoviendo un equilibrio entre la vida personal y profesional. Sus elementos clave incluyen la regulación del uso de herramientas digitales, la no interrupción de los descansos, la definición de canales para la presentación de quejas y la excepción de este derecho solo para situaciones de fuerza mayor o emergencia.'
      ]},
      { type: 'p', items: ['Propósito de la política:'] },
      { type: 'bullet', items: [
        'Garantizar el derecho a la desconexión: Asegurar que el tiempo de descanso, vacaciones y tiempo libre de los empleados sea respetado y disfrutado efectivamente.',
        'Promover el equilibrio de vida: Fomentar una mejor conciliación entre la vida laboral, familiar y personal de los trabajadores.',
        'Preservar la salud: Proteger la salud mental y el bienestar general de los trabajadores, evitando el agotamiento laboral.'
      ]},
      { type: 'p', items: [
        'Esta política será publicada, divulgada y actualizada cada vez que la organización lo considere pertinente, y estará disponible para todas las partes interesadas.'
      ]}
    ]
  },
  {
    slug: 'salud-mental',
    code: 'SIG-POL-07',
    version: '01',
    date: '01 de octubre de 2025',
    eyebrow: 'Bienestar Integral',
    title: 'Política de Salud Mental',
    summary: 'Protegemos y promovemos la salud mental como pilar de la seguridad operacional y el bienestar.',
    blocks: [
      { type: 'p', items: [
        'COOTRANSA ha definido y establecido una política de salud mental con la que se compromete con la protección y promoción de la salud mental, física y la calidad de vida de los trabajadores y el bienestar integral de su equipo, en concordancia con el Decreto 0729 de 2025, el PESV y el Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST).',
        'Reconocemos que la salud mental es fundamental para la seguridad operacional y el buen desempeño de nuestros empleados, en especial de conductores, personal administrativo y operativo, quienes enfrentan desafíos propios del sector. Estamos comprometidos con el fortalecimiento de una sana convivencia dentro de los ambientes de trabajo, en cumplimiento de los Decretos 0728 y 0729 de 2025.'
      ]},
      { type: 'p', items: ['Objetivos de la política:'] },
      { type: 'bullet', items: [
        'Promover la salud mental de los trabajadores: Mediante estrategias para prevenir problemas y trastornos mentales, fomentando entornos protectores y condiciones de bienestar, con la línea de atención psicosocial de la ARL.',
        'Capacitar en identificación de señales de alerta: Ofrecer espacios de apoyo y acompañamiento psicológico, articulados con los servicios de salud de la EPS y la gestión de riesgos psicosociales.',
        'Preservar la salud: Proteger la salud mental y el bienestar general, evitando el agotamiento laboral y reduciendo la sobrecarga para un entorno más seguro y humano.',
        'Prevención: Actuar sobre los factores de riesgo y prevenir el surgimiento de trastornos mentales.',
        'Atención Integral: Ofrecer servicios continuos y efectivos, incluyendo la atención a trastornos mentales por la EPS y el consumo de sustancias psicoactivas.',
        'Rehabilitación e Inclusión Social: Facilitar la recuperación y la participación plena en la sociedad.',
        'Gestión, Articulación y Coordinación: Fortalecer la gobernanza y la colaboración entre diferentes sectores y actores sociales.'
      ]},
      { type: 'p', items: [
        'Esta política es publicada, divulgada y será actualizada cada vez que la organización lo considere pertinente, de acuerdo con la normatividad vigente.'
      ]}
    ]
  }
]
