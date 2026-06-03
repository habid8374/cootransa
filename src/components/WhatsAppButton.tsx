import { useEffect, useState } from 'react'
import { getConfig } from '../lib/supabase'

export default function WhatsAppButton() {
  const [href, setHref] = useState('')

  useEffect(() => {
    async function load() {
      const activo  = await getConfig('whatsapp_activo', 'true')
      if (activo === 'false') { setHref(''); return }
      const numero  = (await getConfig('whatsapp_numero', '573000000000')).replace(/[^0-9]/g, '')
      const mensaje = await getConfig('whatsapp_mensaje', 'Hola, quisiera más información sobre sus servicios.')
      if (!numero) { setHref(''); return }
      setHref(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`)
    }
    load()
  }, [])

  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-green-900/30 hover:scale-110 active:scale-95 transition-transform duration-200 group"
    >
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60 animate-ping" style={{ animationDuration: '2.5s' }} />
      <svg viewBox="0 0 32 32" width="30" height="30" className="relative z-10 fill-white">
        <path d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.46 1.713 6.403L3.2 28.8l6.563-1.72a12.74 12.74 0 0 0 6.24 1.59h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.752-9.055A12.715 12.715 0 0 0 16.003 3.2zm0 23.04h-.004a10.63 10.63 0 0 1-5.42-1.485l-.39-.23-4.026 1.055 1.075-3.926-.254-.403a10.61 10.61 0 0 1-1.627-5.65c0-5.866 4.776-10.64 10.65-10.64 2.844 0 5.518 1.108 7.53 3.12a10.58 10.58 0 0 1 3.118 7.527c0 5.867-4.776 10.642-10.65 10.642zm5.838-7.967c-.32-.16-1.893-.934-2.187-1.04-.293-.107-.507-.16-.72.16-.214.32-.826 1.04-1.013 1.253-.187.214-.373.24-.693.08-.32-.16-1.35-.498-2.572-1.587-.95-.847-1.592-1.894-1.78-2.214-.186-.32-.02-.493.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.534.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.986-2.373-.26-.624-.524-.54-.72-.55l-.613-.01c-.214 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.667 0 1.573 1.146 3.093 1.306 3.307.16.213 2.253 3.44 5.46 4.824.763.33 1.358.527 1.822.674.766.244 1.463.21 2.014.127.614-.092 1.893-.774 2.16-1.52.266-.747.266-1.387.186-1.52-.08-.133-.293-.213-.613-.373z"/>
      </svg>
    </a>
  )
}
