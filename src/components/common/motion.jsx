import { useEffect, useRef, useState } from 'react'

/** Reveal-on-scroll wrapper (fade + slide up). */
export function Reveal({ children, delay = 0, style, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setShown(true), delay)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(30px)',
        transition:
          'opacity .8s cubic-bezier(.22,.61,.36,1), transform .8s cubic-bezier(.22,.61,.36,1)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

/** Count-up number, triggered when scrolled into view. */
export function Counter({ to, suffix = '', style }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let done = false
    const run = () => {
      const start = performance.now()
      const dur = 1500
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(to * eased))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    if (!('IntersectionObserver' in window)) { run(); return }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done) {
            done = true
            run()
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to])

  return (
    <span ref={ref} style={style}>
      {val}
      {suffix}
    </span>
  )
}

/** Image filling its container (used for the bundle's image-slot placeholders). */
export function ImageSlot({ src, alt = '', circle = false, radius = 0, style }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        borderRadius: circle ? '50%' : radius,
        ...style,
      }}
    />
  )
}
