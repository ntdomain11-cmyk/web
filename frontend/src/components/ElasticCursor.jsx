import { useEffect, useRef, useState } from 'react'
import './ElasticCursor.css'

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isCoarsePointer() {
  return window.matchMedia && window.matchMedia('(pointer: coarse)').matches
}

export default function ElasticCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ok = !prefersReducedMotion() && !isCoarsePointer()
    setEnabled(ok)
    if (!ok) return

    const onMove = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      setActive(true)
    }

    const onLeave = () => setActive(false)

    const isInteractive = (el) => {
      if (!el) return false
      return Boolean(
        el.closest(
          'a,button,[role="button"],input,textarea,select,label,summary,[data-cursor="pointer"]',
        ),
      )
    }

    const onOver = (e) => setIsPointer(isInteractive(e.target))
    const onDown = () => document.documentElement.classList.add('nt-cursorDown')
    const onUp = () => document.documentElement.classList.remove('nt-cursorDown')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    document.documentElement.classList.add('nt-hasCursor')

    const tick = () => {
      const dot = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring) {
        raf.current = requestAnimationFrame(tick)
        return
      }

      const { x, y } = pos.current

      const rp = ringPos.current
      const stiffness = isPointer ? 0.2 : 0.14
      rp.x += (x - rp.x) * stiffness
      rp.y += (y - rp.y) * stiffness

      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.style.transform = `translate3d(${rp.x}px, ${rp.y}px, 0)`

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.classList.remove('nt-hasCursor')
      document.documentElement.classList.remove('nt-cursorDown')
    }
  }, [isPointer])

  if (!enabled) return null

  return (
    <div className={`nt-cursor ${active ? 'nt-cursor--on' : ''} ${isPointer ? 'nt-cursor--pointer' : ''}`}>
      <div ref={ringRef} className="nt-cursor__ring" aria-hidden="true" />
      <div ref={dotRef} className="nt-cursor__dot" aria-hidden="true" />
    </div>
  )
}
