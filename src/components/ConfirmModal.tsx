import { AlertTriangle } from 'lucide-react'

/** Modal de confirmación del sistema (reemplaza al confirm() del navegador). */
export default function ConfirmModal({
  titulo,
  mensaje,
  confirmLabel = 'Eliminar',
  danger = true,
  onConfirm,
  onCancel,
}: {
  titulo: string
  mensaje?: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[popIn_.2s_ease-out]" onClick={e => e.stopPropagation()}>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3 ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
          <AlertTriangle size={22} className={danger ? 'text-red-500' : 'text-amber-500'} />
        </div>
        <h3 className="text-base font-bold text-gray-900 text-center">{titulo}</h3>
        {mensaje && <p className="text-sm text-gray-500 text-center mt-1.5">{mensaje}</p>}
        <div className="flex gap-2 mt-5">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition ${danger ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}>{confirmLabel}</button>
        </div>
      </div>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}
