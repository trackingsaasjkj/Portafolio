import { useRef, useEffect }   from 'react'
import { PerspectiveCamera }    from '@react-three/drei'
import { useFrame, useThree }   from '@react-three/fiber'
import gsap                     from 'gsap'
import * as THREE               from 'three'
import { usePortfolioStore }    from '../store/usePortfolioStore'
import { useMouseParallax }     from '../hooks/useMouseParallax'
import { WAYPOINTS, CAMERA_PATH, TARGET_PATH } from './worldConfig'

/**
 * CinematicCamera — polish pass
 *
 * Improvements:
 *  - Mouse parallax on idle drift (camera tilts toward cursor)
 *  - Camera FOV breathes slightly during flight (cinematic zoom feel)
 *  - Intro fly-in starts from a wider FOV (70) that narrows to 58
 *  - All GSAP easings upgraded to power4.inOut for more elegance
 *  - Idle drift uses a smoother lemniscate with independent X/Y speeds
 *  - lookAt uses a smoothed target vector (lerp each frame) — no jitter
 */
export default function CinematicCamera() {
  const camRef  = useRef()
  const set     = useThree((s) => s.set)
  const mouse   = useMouseParallax()

  const setPhase          = usePortfolioStore((s) => s.setPhase)
  const setIsFlying       = usePortfolioStore((s) => s.setIsFlying)
  const setActiveWaypoint = usePortfolioStore((s) => s.setActiveWaypoint)
  const setFocusedProject = usePortfolioStore((s) => s.setFocusedProject)
  const phase             = usePortfolioStore((s) => s.phase)

  const phaseRef   = useRef(phase)
  const idleRef    = useRef(false)
  const idleT      = useRef(0)
  const pathT      = useRef({ v: 0 })
  const flyTween   = useRef(null)
  const segRef     = useRef(0)

  // Reused vectors — no per-frame allocation
  const camPos    = useRef(new THREE.Vector3())
  const lookRaw   = useRef(new THREE.Vector3())
  const lookSmooth = useRef(new THREE.Vector3(0, 0, 0))
  const origin    = new THREE.Vector3(0, 0, 0)

  const wpT = WAYPOINTS.map((_, i) => i / (WAYPOINTS.length - 1))

  // ── Register ─────────────────────────────────────────────
  useEffect(() => {
    if (camRef.current) set({ camera: camRef.current })
  }, [set])

  // ── Intro fly-in ─────────────────────────────────────────
  useEffect(() => {
    if (!camRef.current) return
    const cam = camRef.current
    cam.position.set(0, 2.2, 24)
    cam.fov = 72
    cam.updateProjectionMatrix()
    cam.lookAt(origin)

    // Animate position
    gsap.to(cam.position, {
      x: WAYPOINTS[0].position.x,
      y: WAYPOINTS[0].position.y,
      z: WAYPOINTS[0].position.z,
      duration: 3.8,
      ease: 'power4.inOut',
      onComplete: () => { idleRef.current = true },
    })

    // Animate FOV from 72 → 58
    gsap.to(cam, {
      fov: 58,
      duration: 3.8,
      ease: 'power2.inOut',
      onUpdate: () => cam.updateProjectionMatrix(),
    })
  }, []) // eslint-disable-line

  // ── Phase changes ─────────────────────────────────────────
  useEffect(() => {
    phaseRef.current = phase
    if (phase === 'flying') {
      segRef.current = 0
      pathT.current  = { v: 0 }
      flySegment(0)
    }
    // Nav jump: phase set to 'main' by NavSidebar + activeWaypoint changed
    if (phase === 'main') {
      flyTween.current?.kill()
      idleRef.current = true
      idleT.current   = 0
    }
  }, [phase]) // eslint-disable-line

  function flySegment(segIdx) {
    const nextIdx = segIdx + 1
    if (nextIdx >= WAYPOINTS.length) {
      setIsFlying(false)
      setPhase('main')
      phaseRef.current = 'main'
      setActiveWaypoint(WAYPOINTS.length - 1)
      idleRef.current = true
      idleT.current   = 0
      return
    }

    idleRef.current  = false
    setIsFlying(true)
    phaseRef.current = 'flying'

    const dur = WAYPOINTS[nextIdx].duration

    flyTween.current?.kill()
    flyTween.current = gsap.to(pathT.current, {
      v: wpT[nextIdx],
      duration: dur,
      ease: 'power2.inOut',
      onUpdate: () => {
        const idx = Math.round(pathT.current.v * (WAYPOINTS.length - 1))
        setActiveWaypoint(Math.min(idx, WAYPOINTS.length - 1))
      },
      onComplete: () => {
        setActiveWaypoint(nextIdx)
        setIsFlying(false)

        const wp       = WAYPOINTS[nextIdx]
        const pauseDur = wp.pauseDuration ?? 0

        if (pauseDur > 0) {
          if (wp.id === 'projects') setFocusedProject('taskflow')
          phaseRef.current = 'paused'
          setPhase('paused')
          idleRef.current  = true
          idleT.current    = 0
          segRef.current   = nextIdx

          gsap.delayedCall(pauseDur, () => {
            if (wp.id === 'projects') setFocusedProject(null)
            phaseRef.current = 'flying'
            idleRef.current  = false
            flySegment(nextIdx)
          })
        } else {
          flySegment(nextIdx)
        }
      },
    })
  }

  // ── Per-frame ─────────────────────────────────────────────
  useFrame((_, delta) => {
    if (!camRef.current) return
    const cam = camRef.current
    const ph  = phaseRef.current

    if (ph === 'flying') {
      CAMERA_PATH.getPoint(pathT.current.v, camPos.current)
      TARGET_PATH.getPoint(pathT.current.v, lookRaw.current)

      cam.position.copy(camPos.current)

      // Smooth the lookAt target — removes jitter on tight spline sections
      lookSmooth.current.lerp(lookRaw.current, 0.08)
      cam.lookAt(lookSmooth.current)

      // Subtle FOV pump during flight
      cam.fov = 58 + Math.sin(pathT.current.v * Math.PI) * 3
      cam.updateProjectionMatrix()
      return
    }

    if (!idleRef.current) return
    idleT.current += delta
    const t = idleT.current

    const isPaused = ph === 'paused'
    const isMain   = ph === 'main'

    const xAmp  = isPaused ? 0.18 : isMain ? 0.7 : 1.4
    const yAmp  = isPaused ? 0.06 : isMain ? 0.2 : 0.35
    const speed = 0.055

    const wpIdx   = isPaused ? segRef.current
                 : isMain    ? usePortfolioStore.getState().activeWaypoint
                 : 0
    const basePos = WAYPOINTS[wpIdx].position
    const baseTgt = WAYPOINTS[wpIdx].target

    // Lemniscate drift + mouse parallax
    cam.position.x = basePos.x + Math.sin(t * speed)             * xAmp + mouse.current.x * 0.25
    cam.position.y = basePos.y + Math.sin(t * speed * 0.618)     * yAmp + mouse.current.y * 0.12
    cam.position.z = basePos.z + Math.cos(t * speed * 0.382) * 0.4

    // Smooth lookAt
    lookRaw.current.set(
      baseTgt.x + mouse.current.x * 0.15,
      baseTgt.y + mouse.current.y * 0.08,
      baseTgt.z
    )
    lookSmooth.current.lerp(lookRaw.current, 0.04)
    cam.lookAt(lookSmooth.current)
  })

  return (
    <PerspectiveCamera ref={camRef} makeDefault fov={58} near={0.1} far={200} />
  )
}
