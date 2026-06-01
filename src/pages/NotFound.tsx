import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col items-center justify-center gap-6 px-4 text-center">
      <img src="/favicon.png" alt="COOTRANSA" className="h-20 w-auto"/>
      <h1 className="text-5xl font-black font-display">404</h1>
      <p className="text-zinc-400">La página que buscas no existe.</p>
      <Link to="/" className="px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold">Volver al inicio</Link>
    </div>
  )
}
