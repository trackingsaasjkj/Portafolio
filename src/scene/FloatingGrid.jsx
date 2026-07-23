import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid }     from '@react-three/drei'

/**
 * FloatingGrid — JK² Brand Edition
 *
 * Two premium holographic grid layers using brand colors:
 *  Near  — tight cells with Sky Blue accents
 *  Far   — wider cells for infinite depth illusion
 *
 * STABILITY FIX: Opacity is LOCKED to fixed values.
 * No per-frame breathing = zero flickering.
 */
export default function FloatingGrid() {
  const nearRef = useRef()
  const farRef  = useRef()

  useFrame(() => {
    // LOCKED opacity values — no animation, no flickering
    if (nearRef.current?.material) {
      nearRef.current.material.opacity = 0.065
    }
    if (farRef.current?.material) {
      farRef.current.material.opacity = 0.028
    }
  })

  return (
    <>
      {/* Near holographic grid — Sky Blue (#49C4FF) */}
      <Grid
        ref={nearRef}
        position={[0, -2.6, -16]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.30}
        cellColor="#0B1F5B"
        sectionSize={5}
        sectionThickness={0.70}
        sectionColor="#49C4FF"
        fadeDistance={26}
        fadeStrength={3}
        infiniteGrid
      />

      {/* Far deep grid — Deep Navy depth layer */}
      <Grid
        ref={farRef}
        position={[0, -4.0, -30]}
        args={[200, 200]}
        cellSize={8}
        cellThickness={0.2}
        cellColor="#0B1F5B"
        sectionSize={40}
        sectionThickness={0.4}
        sectionColor="#49C4FF"
        fadeDistance={85}
        fadeStrength={4}
        infiniteGrid
      />
    </>
  )
}
