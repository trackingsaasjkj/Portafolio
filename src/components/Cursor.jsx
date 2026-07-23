import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

/**
 * Cursor
 * Premium custom cursor — dot + lagging ring.
 * Expands when hovering interactive elements.
 * Changes color when hovering a project card.
 */
export default function Cursor() {
  const hoveredProject = useStore((s) => s.hoveredProject)
  const dot  = useRef(null)
  const ring = useRef(null)
  const pos  = useRef({ x: -100, y: -100 })
  const rpos = useRef({ x: -100, y: -100 })
  const raf  = useRef(null)

  useEffect(() => {
    dot.current  = document.getElementById('cursor')
    ring.current = document.getElementById('cursor-ring')

    const onMove = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
    }

    const animate = () => {
      if (dot.current) {
        dot.current.style.left = pos.current.x + 'px'
        dot.current.style.top  = pos.current.y + 'px'
      }
      if (ring.current) {
        rpos.current.x += (pos.current.x - rpos.current.x) * 0.09
        rpos.current.y += (pos.current.y - rpos.current.y) * 0.09
        ring.current.style.left = rpos.current.x + 'px'
        ring.current.style.top  = rpos.current.y + 'px'
      }
      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  // React to hover state
  useEffect(() => {
    const d = dot.current
    const r = ring.current
    if (!d || !r) return

    if (hoveredProject) {
      d.style.width  = '12px'
      d.style.height = '12px'
      d.style.background = '#60a5fa'
      r.style.width  = '44px'
      r.style.height = '44px'
      r.style.borderColor = 'rgba(96,165,250,0.75)'
    } else {
      d.style.width  = '8px'
      d.style.height = '8px'
      d.style.background = '#3b82f6'
      r.style.width  = '28px'
      r.style.height = '28px'
      r.style.borderColor = 'rgba(59,130,246,0.5)'
    }
  }, [hoveredProject])

  return null
}
