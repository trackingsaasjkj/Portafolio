import { useRef, useEffect } from 'react'

/**
 * useScroll
 * Tracks normalised scroll progress (0 → 1) of a target element,
 * or the window if no ref is passed.
 *
 * Returns a ref containing { progress, direction, velocity }.
 * Using a ref (not state) keeps reads in animation loops zero-cost.
 *
 * Usage:
 *   const scroll = useScroll()
 *   // inside useFrame: scroll.current.progress
 */
export function useScroll(targetRef) {
  const data = useRef({ progress: 0, direction: 1, velocity: 0 })

  useEffect(() => {
    let last = 0

    function onScroll() {
      const el = targetRef?.current ?? document.documentElement
      const max = el.scrollHeight - el.clientHeight
      const y   = el === document.documentElement ? window.scrollY : el.scrollTop

      const progress  = max > 0 ? y / max : 0
      const direction = y > last ? 1 : -1
      const velocity  = Math.abs(y - last)

      data.current = { progress, direction, velocity }
      last = y
    }

    const target = targetRef?.current ?? window
    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [targetRef])

  return data
}
