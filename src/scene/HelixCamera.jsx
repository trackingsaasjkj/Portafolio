import { useRef, useEffect }  from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera }  from '@react-three/drei'
import gsap                   from 'gsap'
import * as THREE             from 'three'
import { useStore }           from '../store/useStore'
import { PROJECTS, N, getCameraPosition, CAM_RADIUS, CARD_RADIUS, ANGLE_STEP } from '../data/projects'

/**
 * HelixCamera
 *
 * Single parameter t (0→N) drives everything.
 * At integer t=i: camera sits directly in front of card i, looking at it.
 *
 * getCameraPosition(t) returns:
 *   x,y,z      → camera world position (opposite side of cylinder from card)
 *   lookX,Y,Z  → exact card world position (lookAt target)
 *
 * Controls: scroll/drag down → t++, up → t--
 * Snap: power3.out to nearest integer after user releases input
 */

const AUTO_SPEED  = 0.04     // t/s passive advance
const SCROLL_MULT = 0.005    // t per px of wheel delta
const DRAG_MULT   = 0.009    // t per px of drag
const DAMPING     = 5.5
const SNAP_DELAY  = 380      // ms after last input before snap

const pos0 = getCameraPosition(0)
const INITIAL_Y = pos0.y + 10
const INITIAL_RADIUS = CAM_RADIUS * 1.7
const INITIAL_LOOK_Y = pos0.y

export default function HelixCamera() {
  const camRef  = useRef()
  const set     = useThree((s) => s.set)

  const setPhase         = useStore((s) => s.setPhase)
  const setActiveProject = useStore((s) => s.setActiveProject)
  const phase            = useStore((s) => s.phase)
  const helixPaused      = useStore((s) => s.helixPaused)

  const t          = useRef(0)
  const tVel       = useRef(0)
  const isSnapping = useRef(false)
  const snapTween  = useRef(null)
  const phaseRef   = useRef(phase)
  const userActive = useRef(false)
  const isDragging = useRef(false)
  const lastY      = useRef(0)

  // Parametric smoothed tracking values for cylindrical mapping
  const smoothT      = useRef(0)
  const smoothY      = useRef(INITIAL_Y)
  const smoothRadius = useRef(INITIAL_RADIUS)
  const smoothLookY  = useRef(INITIAL_LOOK_Y)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { if (camRef.current) set({ camera: camRef.current }) }, [set])

  // ── Intro ──────────────────────────────────────────────
  useEffect(() => {
    if (!camRef.current) return
    const cam  = camRef.current
    const pos0 = getCameraPosition(0)

    // Start pulled back and high
    cam.position.set(pos0.x * 1.7, pos0.y + 10, pos0.z * 1.7)
    cam.lookAt(pos0.lookX, pos0.lookY, pos0.lookZ)
    cam.fov = 80
    cam.updateProjectionMatrix()

    // Init smoothed tracking values to the starting position
    smoothT.current      = 0
    smoothY.current      = pos0.y + 10
    smoothRadius.current = CAM_RADIUS * 1.7
    smoothLookY.current  = pos0.y

    const tl = gsap.timeline({ delay: 0.3, onComplete: () => setPhase('explore') })
    tl.to(cam, {
      fov: 60,
      duration: 2.0,
      ease: 'power2.inOut',
      onUpdate: () => cam.updateProjectionMatrix(),
    })
    return () => tl.kill()
  }, []) // eslint-disable-line

  // ── Snap ───────────────────────────────────────────────
  function snapToNearest() {
    if (isSnapping.current) return
    const nearest = Math.round(t.current)
    const target  = Math.max(0, Math.min(N, nearest))
    if (Math.abs(t.current - target) < 0.005) {
      t.current = target
      userActive.current = false // Reset active state when snap is already finished
      return
    }
    isSnapping.current = true
    tVel.current = 0
    snapTween.current?.kill()
    snapTween.current = gsap.to(t, {
      current: target,
      duration: 1.1,
      ease: 'power3.out',
      onComplete: () => {
        isSnapping.current = false
        setActiveProject(PROJECTS[target]?.id ?? null)
        userActive.current = false // Reset active state when snap animation finishes
      },
    })
  }

  // ── Input ──────────────────────────────────────────────
  useEffect(() => {
    let snapTimer = null
    const scheduleSnap = (delay = SNAP_DELAY) => {
      clearTimeout(snapTimer)
      snapTimer = setTimeout(snapToNearest, delay)
    }

    const onWheel = (e) => {
      if (phaseRef.current !== 'explore') return
      e.preventDefault()
      snapTween.current?.kill()
      isSnapping.current = false
      userActive.current = true
      // Normalize across trackpads (deltaMode 0=px, 1=lines, 2=page)
      const delta = e.deltaMode === 0 ? e.deltaY : e.deltaY * 30
      tVel.current += delta * SCROLL_MULT
      tVel.current = THREE.MathUtils.clamp(tVel.current, -3.5, 3.5) // Clamp scroll speed to prevent massive jumps
      scheduleSnap()
    }

    const onDown = (e) => {
      const isMouse = e.type === 'mousedown'
      if (isMouse && e.button !== 0) return
      isDragging.current  = true
      lastY.current       = isMouse ? e.clientY : e.touches[0].clientY
      snapTween.current?.kill()
      isSnapping.current  = false
      userActive.current  = true
    }

    const onMove = (e) => {
      if (!isDragging.current || phaseRef.current !== 'explore') return
      const cy  = e.touches ? e.touches[0].clientY : e.clientY
      const dy  = cy - lastY.current
      lastY.current = cy
      // Drag up = scroll to next card (invert dy direction to feel natural)
      tVel.current -= dy * DRAG_MULT
      tVel.current = THREE.MathUtils.clamp(tVel.current, -3.5, 3.5) // Clamp drag speed
    }

    const onUp = () => {
      isDragging.current = false
      userActive.current = false
      scheduleSnap(200)
    }

    window.addEventListener('wheel',      onWheel,  { passive: false })
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('touchstart', onDown,   { passive: true })
    window.addEventListener('touchmove',  onMove,   { passive: true })
    window.addEventListener('touchend',   onUp)

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('touchstart', onDown)
      window.removeEventListener('touchmove',  onMove)
      window.removeEventListener('touchend',   onUp)
      clearTimeout(snapTimer)
    }
  }, []) // eslint-disable-line

  // ── Per-frame ──────────────────────────────────────────
  useFrame((state, delta) => {
    if (!camRef.current) return
    const cam = camRef.current
    const ph  = phaseRef.current

    if (ph === 'explore' && !isSnapping.current) {
      // Auto-advance very slowly when idle and not paused (hovered)
      if (!userActive.current && !helixPaused && Math.abs(tVel.current) < 0.025) {
        tVel.current += AUTO_SPEED * delta
      }

      t.current    += tVel.current * delta
      tVel.current *= Math.exp(-DAMPING * delta)

      // Seamless wrap
      if (t.current > N + 0.3) t.current = 0
      if (t.current < -0.3)    t.current = N
    }

    // Smoothly interpolate coordinates using framerate-independent damp factor
    const lambda = isSnapping.current ? 6.5 : 5.0
    const lerpFactor = 1 - Math.exp(-lambda * delta)

    // Interpolate smoothT using shortest-path circular interpolation (L = PROJECTS.length)
    let diff = t.current - smoothT.current
    const L = PROJECTS.length
    diff = ((diff + L / 2) % L + L) % L - L / 2 // wrap diff to [-L/2, L/2]
    smoothT.current += diff * lerpFactor
    smoothT.current = (smoothT.current % L + L) % L

    // Interpolate smoothY linearly using the target Y position of clamped t.current
    const tc = Math.max(0, Math.min(N, t.current))
    const posTarget = getCameraPosition(tc)
    smoothY.current = THREE.MathUtils.lerp(smoothY.current, posTarget.y, lerpFactor)
    smoothLookY.current = THREE.MathUtils.lerp(smoothLookY.current, posTarget.y, lerpFactor)

    // Interpolate smoothRadius (swoops in during intro, then remains stable at CAM_RADIUS)
    smoothRadius.current = THREE.MathUtils.lerp(smoothRadius.current, CAM_RADIUS, lerpFactor)

    // Reconstruct camera position and lookAt target in cylindrical space
    const a = smoothT.current * ANGLE_STEP
    const camX = Math.sin(a) * smoothRadius.current
    const camZ = Math.cos(a) * smoothRadius.current

    const lookX = Math.sin(a) * CARD_RADIUS
    const lookZ = Math.cos(a) * CARD_RADIUS

    cam.position.set(camX, smoothY.current, camZ)
    cam.lookAt(lookX, smoothLookY.current, lookZ)

    // Tell HUD which project is closest based on the current camera position (smoothT)
    const ni = Math.round(smoothT.current) % PROJECTS.length
    setActiveProject(PROJECTS[ni]?.id ?? null)
  })

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      fov={80}
      near={0.1}
      far={300}
      position={[pos0.x * 1.7, INITIAL_Y, pos0.z * 1.7]}
    />
  )
}
