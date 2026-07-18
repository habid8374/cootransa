import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import QRCode from 'qrcode'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Loader2, Download, FileImage, FileText, ArrowLeft, XCircle } from 'lucide-react'
import { supabase, type CarnetSolicitud } from '../lib/supabase'
import CarnetCard from '../components/CarnetCard'
import Brand from '../components/Brand'

export default function CarnetPage() {
  const { codigo } = useParams()
  const [sol, setSol] = useState<CarnetSolicitud | null | undefined>(undefined)
  const [qr, setQr] = useState<string>()
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    async function load() {
      const { data } = await supabase.from('carnet_solicitudes').select('*').eq('codigo', codigo).eq('estado', 'aprobado').single()
      setSol(data ?? null)
      if (data) {
        const url = `${window.location.origin}/verificar/${data.codigo}`
        setQr(await QRCode.toDataURL(url, { margin: 1, width: 240, color: { dark: '#0d3b1e', light: '#ffffff' } }))
      }
    }
    load()
  }, [codigo])

  const descargarPNG = async () => {
    if (!cardRef.current) return
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true })
    const a = document.createElement('a'); a.href = dataUrl; a.download = `carnet-${sol?.codigo}.png`; a.click()
  }

  const descargarPDF = async () => {
    if (!cardRef.current) return
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true })
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const w = 90, h = w * (cardRef.current.offsetHeight / cardRef.current.offsetWidth)
    pdf.addImage(dataUrl, 'PNG', (210 - w) / 2, 30, w, h)
    pdf.setFontSize(10); pdf.setTextColor(120)
    pdf.text('Carnet de Tarifa Preferencial · COOTRANSA Ltda.', 105, 30 + h + 12, { align: 'center' })
    pdf.save(`carnet-${sol?.codigo}.pdf`)
  }

  if (sol === undefined) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-green-600" /></div>

  if (!sol) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <XCircle size={56} className="text-gray-300 mb-4" />
      <h1 className="text-lg font-bold text-gray-900">Carnet no disponible</h1>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">Este carnet no existe o aún no ha sido aprobado.</p>
      <Link to="/" className="mt-6 text-sm font-semibold text-green-600 hover:underline">Volver al inicio</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Brand iconClass="h-9" textClass="text-lg" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition"><ArrowLeft size={16}/> Inicio</Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Tu carnet está listo 🎉</h1>
        <p className="text-sm text-gray-500 mb-8">Descárgalo como imagen o PDF para imprimir.</p>

        <div className="flex justify-center mb-8"><CarnetCard solicitud={sol} qrDataUrl={qr} innerRef={el => (cardRef.current = el)} /></div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={descargarPNG} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"><FileImage size={16}/> Descargar imagen</button>
          <button onClick={descargarPDF} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-green-600 text-green-700 text-sm font-semibold hover:bg-green-50 transition"><FileText size={16}/> Descargar PDF</button>
        </div>
        <p className="mt-6 text-[11px] text-gray-400 flex items-center gap-1"><Download size={12}/> Guarda tu carnet. El conductor podrá verificarlo escaneando el QR.</p>
      </main>
    </div>
  )
}
