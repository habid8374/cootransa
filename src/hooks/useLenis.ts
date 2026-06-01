import { useEffect } from 'react'

export function useLenis() {
  useEffect(() => {
    let lenis: any
    const initLenis = async () => {
      try {
        const { default: Lenis } = await import('@studio-freight/lenis')
        lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
        function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
        requestAnimationFrame(raf)
      } catch (e) { console.warn('Lenis not available', e) }
    }
    initLenis()
    return () => { if (lenis) lenis.destroy() }
  }, [])
}
