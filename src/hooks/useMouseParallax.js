import { useRef, useEffect } from 'react'

/**
 * useMouseParallax
 * Tracks normalised mouse position [-1, 1] on both axes.
 * Returns a ref (not state) — zero re-renders, safe to read in useFrame.
 *
 * Usage:
 *   const mouse = useMouseParallax()
 *   // inside useFrame:
 *   mesh.rotation.y = mouse.current.x * 0.1
 */
export function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useEffect(() => {
    function onMove(e) {
      mouse.current.tx = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Smooth the raw target in a rAF loop so consumers always get eased values
  useEffect(() => {
    let id
    function tick() {
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.06
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.06
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  return mouse
}
