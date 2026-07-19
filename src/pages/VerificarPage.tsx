import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { Loader2, CheckCircle2, XCircle, AlertTriangle, QrCode, Search, RotateCcw, Camera } from 'lucide-react'
import { supabase, type CarnetSolicitud } from '../lib/supabase'
import Brand from '../components/Brand'

type Estado = 'inicio' | 'buscando' | 'valido' | 'vencido' | 'no_iniciado' | 'invalido'

function fmt(d?: string) {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

// Extrae el código de un texto QR (puede venir como URL completa o código suelto)
function extraerCodigo(texto: string): string {
  const t = texto.trim()
  const m = t.match(/verificar\/([A-Za-z0-9-]+)/)
  return (m ? m[1] : t).toUpperCase()
}

export default function VerificarPage() {
  const { codigo: codigoParam } = useParams()
  const [estado, setEstado] = useState<Estado>('inicio')
  const [sol, setSol] = useState<CarnetSolicitud | null>(null)
  const [escaneando, setEscaneando] = useState(false)
  const [manual, setManual] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => { document.title = 'Verificar carnet – COOTRANSA' }, [])

  // Si llega por URL con código (escaneado con la cámara nativa), verifica directo
  useEffect(() => {
    if (codigoParam) verificar(codigoParam)
    return () => { detener() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoParam])

  const verificar = async (codigoRaw: string) => {
    const codigo = extraerCodigo(codigoRaw)
    setEstado('buscando'); setSol(null)
    const { data } = await supabase.rpc('verificar_carnet', { p_codigo: codigo })
    const row = Array.isArray(data) ? data[0] : data
    if (!row) { setEstado('invalido'); return }
    setSol(row)
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const ini = row.vigencia_inicio ? new Date(row.vigencia_inicio + 'T00:00:00') : null
    const fin = row.vigencia_fin ? new Date(row.vigencia_fin + 'T23:59:59') : null
    if (ini && hoy < ini) setEstado('no_iniciado')
    else if (fin && hoy > fin) setEstado('vencido')
    else setEstado('valido')
  }

  const detener = async () => {
    try { if (scannerRef.current?.isScanning) await scannerRef.current.stop() } catch {}
    scannerRef.current = null
    setEscaneando(false)
  }

  const escanear = async () => {
    setEscaneando(true)
    setEstado('inicio'); setSol(null)
    // esperar a que el div del lector esté montado
    setTimeout(async () => {
      try {
        const s = new Html5Qrcode('qr-reader')
        scannerRef.current = s
        await s.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 230, height: 230 } },
          async (txt) => { await detener(); verificar(txt) },
          () => {}
        )
      } catch {
        setEscaneando(false)
        alert('No se pudo abrir la cámara. Verifica los permisos.')
      }
    }, 100)
  }

  const buscarManual = (e: React.FormEvent) => { e.preventDefault(); if (manual.trim()) verificar(manual) }
  const reiniciar = () => { setEstado('inicio'); setSol(null); setManual('') }

  // ── Pantalla de resultado ──
  if (estado === 'valido' || estado === 'vencido' || estado === 'no_iniciado' || estado === 'invalido') {
    const cfg = {
      valido:      { bg: 'from-green-600 to-emerald-500', Icon: CheckCircle2, t: 'CARNET VÁLIDO', s: 'Tarifa preferencial vigente' },
      vencido:     { bg: 'from-orange-600 to-amber-500',  Icon: AlertTriangle, t: 'CARNET VENCIDO', s: 'La vigencia ha expirado' },
      no_iniciado: { bg: 'from-blue-600 to-sky-500',      Icon: AlertTriangle, t: 'AÚN NO VIGENTE', s: 'La vigencia todavía no ha iniciado' },
      invalido:    { bg: 'from-red-700 to-red-500',       Icon: XCircle,       t: 'NO VÁLIDO', s: 'Carnet no encontrado o no aprobado' },
    }[estado]
    const Icon = cfg.Icon
    return (
      <div className={`min-h-screen bg-gradient-to-br ${cfg.bg} flex flex-col items-center justify-center p-4 text-white`}>
        <Icon size={88} className="mb-3 drop-shadow-lg" strokeWidth={1.5} />
        <h1 className="text-3xl font-black tracking-tight text-center">{cfg.t}</h1>
        <p className="text-white/85 mt-1 text-center">{cfg.s}</p>
        {sol && (
          <div className="mt-7 w-full max-w-sm bg-white/12 backdrop-blur-sm rounded-2xl border border-white/20 p-5 space-y-3">
            {sol.foto_url && <img src={sol.foto_url} alt={sol.nombre} className="w-24 h-28 rounded-xl object-cover mx-auto border-2 border-white/40" />}
            <div className="text-center"><p className="text-xl font-bold">{sol.nombre}</p><p className="text-white/80 text-sm">{sol.tipo_documento || 'C.C.'} {sol.cedula}</p></div>
            <div className="border-t border-white/20 pt-3 space-y-2 text-sm">
              <Row label="Institución" value={sol.institucion} />
              {sol.categoria_nombre && <Row label="Categoría" value={sol.categoria_nombre} />}
              <Row label="Vigencia" value={`${fmt(sol.vigencia_inicio)} — ${fmt(sol.vigencia_fin)}`} />
            </div>
          </div>
        )}
        <button onClick={() => { reiniciar(); escanear() }} className="mt-7 inline-flex items-center gap-2 bg-white text-gray-800 font-bold text-sm px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
          <Camera size={18} /> Escanear otro carnet
        </button>
        <Link to="/verificar" onClick={reiniciar} className="mt-3 text-white/80 text-sm underline">Volver</Link>
      </div>
    )
  }

  // ── Pantalla inicial (escáner + búsqueda) ──
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Brand iconClass="h-9" textClass="text-lg text-white" /></Link>
          <span className="text-xs text-white/50 uppercase tracking-widest">Verificación</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 text-white max-w-lg mx-auto w-full">
        {estado === 'buscando' ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto mb-2" /> Verificando...</div>
        ) : (
          <>
            <QrCode size={48} className="text-green-400 mb-3" />
            <h1 className="text-2xl font-black text-center">Verificar carnet</h1>
            <p className="text-white/60 text-sm text-center mt-1 mb-6">Escanea el código QR del carnet del estudiante</p>

            {escaneando ? (
              <div className="w-full">
                <div id="qr-reader" className="w-full rounded-2xl overflow-hidden bg-black" />
                <button onClick={detener} className="mt-4 w-full py-3 rounded-full border border-white/25 text-white text-sm font-semibold">Cancelar</button>
              </div>
            ) : (
              <button onClick={escanear} className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold text-base flex items-center justify-center gap-2 transition shadow-lg">
                <Camera size={20} /> Escanear QR
              </button>
            )}

            {/* Búsqueda manual (respaldo) */}
            {!escaneando && (
              <form onSubmit={buscarManual} className="w-full mt-6">
                <p className="text-white/50 text-xs text-center mb-2">o busca por código del carnet</p>
                <div className="flex gap-2">
                  <input value={manual} onChange={e => setManual(e.target.value)} placeholder="COO-XXXX-XXXX" className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-green-400" />
                  <button type="submit" className="px-4 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20"><Search size={18} /></button>
                </div>
              </form>
            )}
          </>
        )}
      </main>
      <p className="text-center text-white/40 text-xs pb-6">COOTRANSA Ltda. · Verificación oficial de carnets</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3"><span className="text-white/70 shrink-0">{label}</span><span className="font-semibold text-right">{value}</span></div>
}
