import { useRef, useEffect } from 'react'
import gsap from 'gsap'

/**
 * useGsapTimeline
 * Creates a GSAP timeline that is automatically killed on unmount.
 * Pass a setup function that receives the timeline and builds animations.
 *
 * @param {Function} setupFn  - (tl: GSAPTimeline) => void
 * @param {Array}    deps     - effect deps (re-runs timeline when deps change)
 *
 * Returns the timeline ref for external control (play, pause, seek, etc.)
 *
 * Usage:
 *   const tl = useGsapTimeline((tl) => {
 *     tl.fromTo(meshRef.current.position, { y: -3 }, { y: 0, duration: 1.5 })
 *   }, [])
 */
export function useGsapTimeline(setupFn, deps = []) {
  const tlRef = useRef(null)

  useEffect(() => {
    tlRef.current = gsap.timeline({ paused: true })
    setupFn(tlRef.current)
    return () => {
      tlRef.current?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return tlRef
}
