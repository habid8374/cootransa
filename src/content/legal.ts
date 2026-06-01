import type { AboutPage } from './about'

export const legalPages: AboutPage[] = [
  {
    slug: 'privacidad',
    eyebrow: 'Legal',
    title: 'Política de Privacidad',
    blocks: [
      { type: 'p', items: [
        'En COOTRANSA (Cooperativa de Transportadores de Sabanalarga Ltda®) protegemos los datos personales de nuestros usuarios, clientes, asociados y visitantes conforme a la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas aplicables en materia de protección de datos personales en Colombia.',
        'Esta política describe cómo recopilamos, usamos, almacenamos y protegemos su información personal cuando interactúa con nuestro sitio web y nuestros servicios.'
      ]},
      { type: 'bullet', items: [
        'Datos que recopilamos: nombre, correo electrónico, teléfono y la información que usted suministra voluntariamente a través de nuestros formularios de contacto.',
        'Finalidad: atender solicitudes de servicio, responder consultas, gestionar reservas y enviar información relacionada con nuestros servicios de transporte.',
        'Conservación: sus datos se conservan durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales aplicables.',
        'Seguridad: implementamos medidas técnicas y administrativas razonables para proteger su información frente a accesos no autorizados.'
      ]},
      { type: 'p', items: [
        'Derechos del titular: usted puede conocer, actualizar, rectificar y solicitar la supresión de sus datos, así como revocar la autorización otorgada, escribiendo a cootransaltda1972@cootransa-ltda.com.',
        'Al utilizar este sitio web usted acepta el tratamiento de sus datos conforme a la presente política.'
      ]}
    ]
  },
  {
    slug: 'cookies',
    eyebrow: 'Legal',
    title: 'Política de Cookies',
    blocks: [
      { type: 'p', items: [
        'Este sitio web utiliza cookies y tecnologías similares para mejorar la experiencia de navegación, analizar el uso del sitio y ofrecer contenido relevante.'
      ]},
      { type: 'bullet', items: [
        'Cookies técnicas: necesarias para el funcionamiento básico del sitio y la navegación entre páginas.',
        'Cookies de análisis: nos permiten entender cómo los visitantes utilizan el sitio para mejorar su rendimiento y contenido.',
        'Cookies de preferencias: recuerdan sus elecciones para personalizar su experiencia.'
      ]},
      { type: 'p', items: [
        'Usted puede configurar o deshabilitar las cookies desde la configuración de su navegador. Tenga en cuenta que deshabilitar ciertas cookies puede afectar el funcionamiento del sitio.',
        'Al continuar navegando en este sitio usted acepta el uso de cookies conforme a esta política.'
      ]}
    ]
  },
  {
    slug: 'terminos',
    eyebrow: 'Legal',
    title: 'Términos y Condiciones',
    blocks: [
      { type: 'p', items: [
        'El acceso y uso de este sitio web implica la aceptación de los presentes Términos y Condiciones por parte del usuario.'
      ]},
      { type: 'bullet', items: [
        'Uso del sitio: el contenido de este sitio tiene carácter informativo sobre los servicios de transporte ofrecidos por COOTRANSA Ltda®.',
        'Propiedad intelectual: las marcas, logotipos, textos e imágenes son propiedad de COOTRANSA Ltda® o de sus respectivos titulares y no pueden reproducirse sin autorización.',
        'Servicios: la información sobre rutas, horarios y servicios puede estar sujeta a cambios sin previo aviso; le recomendamos confirmar directamente con la cooperativa.',
        'Responsabilidad: COOTRANSA no se hace responsable por daños derivados del uso indebido de la información contenida en este sitio.'
      ]},
      { type: 'p', items: [
        'Para cualquier inquietud relacionada con estos términos puede contactarnos en cootransaltda1972@cootransa-ltda.com o en nuestra sede: Calle 27 No. 29 - 50, Carretera La Cordialidad, Sabanalarga – Atlántico.'
      ]}
    ]
  }
]
