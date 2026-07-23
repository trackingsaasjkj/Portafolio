import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Environment — JK² Brand Edition
 *
 * Deep navy background (#0B1F5B) with subtle breathing fog.
 * Creates the premium, futuristic atmosphere for JK² Software Solutions.
 *
 * Base density: 0.020 (objects visible to ~30 units)
 * Peak density: 0.028 (atmospheric mystery)
 * Cycle: ~24s (slow, luxurious feel)
 */
export default function Environment() {
  const fogRef = useRef()

  useFrame(({ clock, scene }) => {
    if (!scene.fog) return
    const t = clock.elapsedTime
    // Very slow, subtle breathing — no jarring changes
    scene.fog.density = 0.020 + Math.sin(t * 0.06) * 0.004
  })

  return (
    <>
      <color attach="background" args={['#0B1F5B']} />
      <fogExp2 ref={fogRef} attach="fog" args={['#0B1F5B', 0.022]} />
    </>
  )
}
