import { useEffect, useRef } from 'react'

/** Pause comet / pulse animations until the diagram is in view. */
export function useDiagramLive<T extends HTMLElement = HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.setAttribute('data-live', '')
      return
    }
    el.removeAttribute('data-live')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.setAttribute('data-live', '')
          else e.target.removeAttribute('data-live')
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}
