import React, { useRef } from 'react'
import { useFrame }      from '@react-three/fiber'
import { useMouseParallax } from '../hooks/useMouseParallax'

/**
 * Lights — JK² Software Solutions Brand Edition
 *
 * Premium lighting rig using brand colors:
 *  - Sky Blue (#49C4FF) for main rim lights
 *  - Deep Navy (#0B1F5B) for ambient base
 *  - White highlights for premium feel
 *
 * STABILITY FIX: All lights are COMPLETELY STATIC.
 * No animation, no pulses, no movement = zero flickering.
 * Only the key light subtly tracks mouse for depth.
 */
export default function Lights() {
  const keyLight  = useRef()
  const mouse     = useMouseParallax()

  useFrame(() => {
    // ONLY the key light has subtle mouse parallax
    // All other lights remain absolutely fixed
    if (keyLight.current) {
      keyLight.current.position.x = -4 + mouse.current.x * 2
      keyLight.current.position.y =  9 + mouse.current.y * 1.5
    }
  })

  return (
    <>
      {/* Ambient — deep navy base, very subtle */}
      <ambientLight intensity={0.08} color="#0B1F5B" />

      {/* Key — mouse-tracked directional, bright sky blue */}
      <directionalLight
        ref={keyLight}
        position={[-4, 9, 5]}
        intensity={1.0}
        color="#49C4FF"
      />

      {/* Rim lights — STATIC premium blue accents */}
      <pointLight position={[0, 2, -8]}   intensity={16} color="#49C4FF" distance={28} decay={2} />
      <pointLight position={[-10, 4, 0]}  intensity={10} color="#49C4FF" distance={22} decay={2} />
      <pointLight position={[10, 3, -4]}  intensity={9}  color="#49C4FF" distance={20} decay={2} />

      {/* Fill lights — STATIC white accents for premium highlights */}
      <pointLight position={[-8, 1, -10]} intensity={6}  color="#FFFFFF" distance={18} decay={2} />
      <pointLight position={[8, 1, -10]}  intensity={5}  color="#FFFFFF" distance={18} decay={2} />

      {/* Top bloom source — STATIC */}
      <pointLight position={[0, 14, -16]} intensity={7}  color="#49C4FF" distance={32} decay={2} />

      {/* Deep accent — STATIC indigo depth */}
      <pointLight position={[0, -4, -20]} intensity={4}  color="#0B1F5B" distance={24} decay={2} />
    </>
  )
}
