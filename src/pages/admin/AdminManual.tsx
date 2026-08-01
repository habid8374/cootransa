import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../../components/Brand'
import {
  Printer, ArrowLeft, LogIn, LayoutDashboard, Newspaper, MessageCircle, DollarSign,
  Clock, Mail, CreditCard, QrCode, Building2, Users, Settings, Fingerprint, HelpCircle,
} from 'lucide-react'

const secciones = [
  { id: 'acceso', n: 1, icon: LogIn, t: 'Acceso al sistema' },
  { id: 'dashboard', n: 2, icon: LayoutDashboard, t: 'Panel principal' },
  { id: 'noticias', n: 3, icon: Newspaper, t: 'Noticias y Blog' },
  { id: 'comentarios', n: 4, icon: MessageCircle, t: 'Comentarios del Blog' },
  { id: 'tarifas', n: 5, icon: DollarSign, t: 'Tarifas' },
  { id: 'horarios', n: 6, icon: Clock, t: 'Horarios' },
  { id: 'mensajes', n: 7, icon: Mail, t: 'Mensajes y PQR' },
  { id: 'carnets', n: 8, icon: CreditCard, t: 'Carnets — Tarifa Preferencial' },
  { id: 'verificar', n: 9, icon: QrCode, t: 'Verificador de carnets' },
  { id: 'proveedores', n: 10, icon: Building2, t: 'Proveedores' },
  { id: 'usuarios', n: 11, icon: Users, t: 'Usuarios' },
  { id: 'ajustes', n: 12, icon: Settings, t: 'Ajustes y notificaciones' },
  { id: 'asistencia', n: 13, icon: Fingerprint, t: 'Asistencia biométrica' },
  { id: 'faq', n: 14, icon: HelpCircle, t: 'Preguntas frecuentes' },
]

// — Bloques reutilizables —
function Seccion({ id, n, icon: Icon, titulo, children }: any) {
  return (
    <section id={id} className="scroll-mt-24 pt-10 first:pt-0">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-lg bg-green-600 text-white font-bold flex items-center justify-center shrink-0">{n}</span>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Icon size={20} className="text-green-600" /> {titulo}</h2>
      </div>
      <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">{children}</div>
    </section>
  )
}
function Sub({ children }: any) { return <h3 className="text-base font-bold text-gray-800 mt-6">{children}</h3> }
function Pasos({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
          <span>{it}</span>
        </li>
      ))}
    </ol>
  )
}
function Cards({ items }: { items: { t: string; d: string }[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((c, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="font-semibold text-gray-800 text-sm">{c.t}</p>
          <p className="text-[13px] text-gray-500 mt-1 leading-snug">{c.d}</p>
        </div>
      ))}
    </div>
  )
}
function Nota({ children, tono = 'info' }: any) {
  const c = tono === 'warn' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'
  return <div className={`rounded-xl border p-4 text-[13.5px] leading-relaxed ${c}`}><strong>Nota:</strong> {children}</div>
}

export default function AdminManual() {
  useEffect(() => { document.title = 'Manual de usuario – COOTRANSA' }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <style>{`@media print { .no-print { display:none !important; } .print-full { max-width:100% !important; } body { background:#fff; } }`}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Encabezado */}
        <div className="no-print flex items-center justify-between mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition"><ArrowLeft size={16} /> Volver al panel</Link>
        </div>

        <header className="rounded-2xl p-8 sm:p-10 text-white mb-8" style={{ background: 'linear-gradient(150deg,#0d3b1e,#16a34a)' }}>
          <div className="flex items-center gap-3 mb-4"><Brand iconClass="h-8" textClass="text-base text-white" /><span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Manual de usuario</span></div>
          <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Georgia, serif' }}>Panel Administrativo</h1>
          <p className="text-white/80 mt-1">COOTRANSA Ltda. · Guía de uso de la plataforma web</p>
          <button onClick={() => window.print()} className="no-print mt-5 inline-flex items-center gap-2 bg-white text-green-700 font-semibold text-sm px-5 py-2.5 rounded-lg hover:scale-[1.02] transition">
            <Printer size={16} /> Descargar / Imprimir PDF
          </button>
        </header>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Índice */}
          <aside className="no-print hidden lg:block">
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-2">Contenido</p>
              <nav className="space-y-0.5">
                {secciones.map(s => (
                  <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-gray-600 hover:bg-green-50 hover:text-green-700 transition">
                    <s.icon size={14} className="shrink-0 text-gray-400" /> <span className="truncate">{s.n}. {s.t}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Contenido */}
          <main className="print-full bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 divide-y divide-gray-100">

            <Seccion id="acceso" n={1} icon={LogIn} titulo="Acceso al sistema">
              <p>El panel administrativo es la herramienta central para gestionar todo el contenido del sitio. Se accede desde cualquier navegador, sin instalar nada.</p>
              <Sub>¿Cómo ingresar?</Sub>
              <Pasos items={[
                <>Abra el navegador (Chrome, Edge o Safari) y entre a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[13px]">cootransa.vercel.app/admin</code>.</>,
                'Escriba su correo y contraseña en el formulario de ingreso.',
                <>Presione <strong>Iniciar sesión</strong>. El sistema lo llevará al panel principal.</>,
              ]} />
              <Sub>Cerrar sesión</Sub>
              <p>Al terminar, cierre la sesión con el botón <strong>Cerrar sesión</strong> (ícono en la parte inferior del menú lateral). Esto protege la información.</p>
              <Nota>Si olvidó su contraseña, comuníquese con el administrador del sistema para restablecerla.</Nota>
            </Seccion>

            <Seccion id="dashboard" n={2} icon={LayoutDashboard} titulo="Panel principal">
              <p>Es la primera pantalla al ingresar. Muestra un resumen general y los accesos rápidos a cada módulo. En el menú lateral izquierdo encontrará todas las secciones, y algunas muestran un <strong>número en color</strong> cuando hay pendientes por atender (mensajes sin leer, solicitudes de carnet, comentarios, etc.).</p>
              <Nota>Cuando llega algo nuevo (un mensaje, una solicitud, un comentario) aparece una <strong>notificación con sonido</strong> en la parte superior derecha, aunque esté en otra sección.</Nota>
            </Seccion>

            <Seccion id="noticias" n={3} icon={Newspaper} titulo="Noticias y Blog">
              <p>Desde <strong>Noticias</strong> se publican los contenidos que aparecen tanto en el <strong>Blog</strong> del sitio como en el banner giratorio de la página de inicio.</p>
              <Sub>Crear o editar una publicación</Sub>
              <Pasos items={[
                <>Entre a <strong>Noticias</strong> y presione <strong>Nueva noticia</strong> (o el lápiz para editar una existente).</>,
                'Escriba el título, el resumen y, si desea, una imagen y una nota al pie.',
                <>Elija la <strong>Sección</strong>: funciona como la <strong>categoría</strong> del blog (Seguridad Vial, SST, Eventos, Capacitación, etc.).</>,
                <>Defina el <strong>Estado</strong>: <em>Publicado</em> (visible) o <em>Borrador</em> (oculto).</>,
                'Guarde. La publicación aparece de inmediato en el Blog.',
              ]} />
              <Sub>¿Blog o banner de inicio?</Sub>
              <p>Toda publicación aparece en el <strong>Blog</strong>. Si además quiere que salga en el <strong>carrusel de la página de inicio</strong>, marque la casilla <strong>“Mostrar en el banner de inicio”</strong>. Así el banner no se llena con cada nota: usted decide qué destacar.</p>
              <Cards items={[
                { t: 'Categorías', d: 'La “Sección” de cada publicación agrupa el contenido en el Blog y permite filtrarlo.' },
                { t: 'Archivo por año', d: 'El Blog organiza automáticamente las publicaciones por año para consultar las antiguas.' },
              ]} />
            </Seccion>

            <Seccion id="comentarios" n={4} icon={MessageCircle} titulo="Comentarios del Blog">
              <p>Los visitantes pueden dejar comentarios en las publicaciones, pero <strong>no se publican hasta que usted los apruebe</strong>. Esto evita spam y comentarios indebidos.</p>
              <Pasos items={[
                <>Entre a <strong>Comentarios</strong>. Por defecto verá los <strong>Pendientes</strong>.</>,
                <>Lea el comentario y decida: <strong>Aprobar</strong> (se publica) o <strong>Eliminar</strong>.</>,
                <>Si un comentario ya aprobado debe retirarse, use <strong>Ocultar</strong>.</>,
              ]} />
              <Nota>El número ámbar junto a “Comentarios” indica cuántos están pendientes de revisión.</Nota>
            </Seccion>

            <Seccion id="tarifas" n={5} icon={DollarSign} titulo="Tarifas">
              <p>Administre las tarifas de las rutas que se muestran en el sitio. Puede agregar, editar o desactivar cada una (origen, destino, precio y tipo). Las tarifas activas también alimentan el cálculo del valor a cobrar en el verificador de carnets.</p>
            </Seccion>

            <Seccion id="horarios" n={6} icon={Clock} titulo="Horarios">
              <p>Gestione los horarios de salida por estación (primera salida, última salida y frecuencia). Los cambios se reflejan de inmediato en la página de horarios del sitio.</p>
            </Seccion>

            <Seccion id="mensajes" n={7} icon={Mail} titulo="Mensajes y PQR">
              <p>Aquí llegan los mensajes enviados desde el formulario de contacto del sitio. Los que son <strong>PQR</strong> (Peticiones, Quejas y Reclamos) se resaltan de forma especial.</p>
              <Cards items={[
                { t: 'Filtro por tipo', d: 'Separe fácilmente los PQR de las consultas normales con las pestañas superiores.' },
                { t: 'Número de radicado', d: 'Cada PQR recibe un radicado único automático para su seguimiento.' },
                { t: 'Plazo legal', d: 'El sistema calcula la fecha límite de respuesta: 15 días hábiles, contando festivos.' },
                { t: 'Semáforo', d: 'Verde (a tiempo), ámbar (por vencer) o rojo (vencido) para priorizar.' },
              ]} />
              <p>Puede responder por correo directamente desde el detalle del mensaje.</p>
              <Nota tono="warn">Los PQR tienen plazos de ley. Revise el semáforo con frecuencia para no dejar vencer ninguno.</Nota>
            </Seccion>

            <Seccion id="carnets" n={8} icon={CreditCard} titulo="Carnets — Tarifa Preferencial">
              <p>Gestiona las solicitudes de carnet estudiantil de tarifa preferencial, desde que el estudiante las envía hasta la emisión del carnet digital con código QR.</p>
              <Sub>Solicitudes</Sub>
              <Pasos items={[
                <>Entre a <strong>Carnets</strong> y abra una solicitud <strong>pendiente</strong>.</>,
                'Revise los datos y los documentos adjuntos (se abren con un enlace seguro temporal).',
                <>Defina la <strong>vigencia</strong> (fecha de inicio y fin) y presione <strong>Aprobar</strong> (o <strong>Rechazar</strong> con un motivo).</>,
                'Al aprobar, se genera el carnet y se puede notificar al estudiante por correo.',
              ]} />
              <Sub>Otras pestañas</Sub>
              <Cards items={[
                { t: 'Categorías', d: 'Cree categorías y configure el descuento: porcentaje, valor fijo o pase gratis.' },
                { t: 'Documentos', d: 'Defina qué documentos debe subir el estudiante y cuáles son obligatorios.' },
                { t: 'Estadísticas', d: 'Consulte totales, carnets vigentes/vencidos y solicitudes por institución.' },
              ]} />
            </Seccion>

            <Seccion id="verificar" n={9} icon={QrCode} titulo="Verificador de carnets">
              <p>Es la herramienta que usan los <strong>conductores</strong> para validar el carnet del estudiante en el bus. Se abre desde <strong>Herramientas → Verificar Carnet</strong> y puede <strong>instalarse como app</strong> en el celular.</p>
              <Pasos items={[
                'El conductor abre el verificador y escanea el código QR del carnet.',
                'El sistema muestra si el carnet es válido, vencido o no válido, con la foto y los datos.',
                'Si es válido, muestra el valor a cobrar según la ruta y el descuento de la categoría.',
              ]} />
              <Nota>Para instalarlo como app: abra el verificador en Chrome o Safari y toque “Instalar app”. Queda un ícono en la pantalla de inicio del celular.</Nota>
            </Seccion>

            <Seccion id="proveedores" n={10} icon={Building2} titulo="Proveedores">
              <p>Recibe las postulaciones de empresas que ofrecen insumos, materiales o servicios. Cada postulación incluye los datos de la empresa y sus propuestas en PDF.</p>
              <Pasos items={[
                <>Entre a <strong>Proveedores</strong> y abra una postulación.</>,
                'Descargue y revise los archivos adjuntos (propuestas).',
                <>Cambie el estado: <strong>En estudio</strong>, <strong>Seleccionado</strong> o <strong>Descartado</strong>.</>,
                'Use la nota interna (confidencial) para registrar observaciones del estudio.',
              ]} />
              <Nota>El contacto con el proveedor elegido se hace por fuera del sistema (correo o llamada), de forma confidencial.</Nota>
            </Seccion>

            <Seccion id="usuarios" n={11} icon={Users} titulo="Usuarios">
              <p>Administre las cuentas que pueden ingresar al panel. Desde aquí se crean o gestionan los usuarios administradores del sistema.</p>
              <Nota tono="warn">Comparta el acceso solo con personas de confianza y pídales una contraseña segura.</Nota>
            </Seccion>

            <Seccion id="ajustes" n={12} icon={Settings} titulo="Ajustes y notificaciones">
              <p>Configuración general del sistema, incluida la del <strong>servicio de correos</strong> con el que se notifica a los estudiantes cuando se aprueba su carnet.</p>
              <Cards items={[
                { t: 'Correo de notificaciones', d: 'Datos del remitente para los correos automáticos del sistema.' },
                { t: 'Envío de prueba', d: 'Botón para verificar que los correos se están enviando correctamente.' },
              ]} />
              <Nota>Para que los correos no lleguen a spam, es recomendable usar un remitente con dominio propio verificado.</Nota>
            </Seccion>

            <Seccion id="asistencia" n={13} icon={Fingerprint} titulo="Asistencia biométrica">
              <p>Sistema independiente de control de asistencia por reconocimiento facial, con su propio panel. Se abre desde <strong>Herramientas → Asistencia</strong>.</p>
              <Nota>La asistencia biométrica tiene su propio manual de usuario detallado, entregado por separado.</Nota>
            </Seccion>

            <Seccion id="faq" n={14} icon={HelpCircle} titulo="Preguntas frecuentes">
              <Sub>¿Los cambios se ven de inmediato en el sitio?</Sub>
              <p>Sí. Al guardar en cualquier módulo, el sitio público se actualiza al instante.</p>
              <Sub>¿Necesito instalar algún programa?</Sub>
              <p>No. Todo funciona desde el navegador, en computador o celular.</p>
              <Sub>¿Por qué una publicación no aparece en el banner de inicio?</Sub>
              <p>Porque el banner solo muestra las publicaciones con la casilla <strong>“Mostrar en el banner de inicio”</strong> marcada. Todas las demás salen en el Blog.</p>
              <Sub>¿Los comentarios se publican solos?</Sub>
              <p>No. Ningún comentario aparece hasta que usted lo apruebe en la sección <strong>Comentarios</strong>.</p>
              <Sub>¿Cómo respondo un PQR a tiempo?</Sub>
              <p>Guíese por el semáforo y la fecha límite que muestra cada PQR (15 días hábiles). Priorice los que estén en ámbar o rojo.</p>
            </Seccion>

            <p className="pt-8 text-center text-xs text-gray-400">COOTRANSA Ltda. · Manual de usuario del panel administrativo · {new Date().getFullYear()}</p>
          </main>
        </div>
      </div>
    </div>
  )
}
