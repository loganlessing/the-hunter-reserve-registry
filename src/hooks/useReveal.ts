import { useEffect, useRef } from 'react'

/**
 * Adds `revealed` the first time the element scrolls into view, so cards can
 * rise into place instead of just appearing.
 *
 * Fails open by design — this is a reference sheet read mid-hunt, so it must
 * never leave data invisible. Anything already in or above the viewport, any
 * browser without IntersectionObserver, and anyone who prefers reduced motion
 * is revealed immediately.
 */
export default function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => el.classList.add('revealed')

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      el.getBoundingClientRect().top < window.innerHeight
    ) {
      show()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show()
            io.disconnect()
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}
