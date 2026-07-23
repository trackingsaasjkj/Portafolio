import React, { useRef } from 'react'
import { useFrame }      from '@react-three/fiber'
import { RoundedBox }    from '@react-three/drei'
import * as THREE        from 'three'
import { useMouseParallax } from '../hooks/useMouseParallax'

/**
 * GlassPanelBase — JK² Brand Edition
 *
 * Premium glassmorphism panels using brand identity:
 *  - Deep navy base with frosted glass effect
 *  - Sky blue (#49C4FF) neon edge glow
 *  - Smooth spring-physics float
 *  - Minimal mouse parallax tilt
 *
 * STABILITY FIX: Glow opacity is LOCKED to fixed values during float.
 * No per-frame sine oscillation = zero opacity flickering.
 */
export default function GlassPanelBase({
  width      = 4.8,
  height     = 3.2,
  position   = [0, 0, 0],
  rotationY  = 0,
  floatAmp   = 0.12,
  floatSpeed = 0.32,
  floatPhase = 0,
  focused    = false,
  children,
}) {
  const groupRef  = useRef()
  const glowRef   = useRef()
  const outerRef  = useRef()
  const mouse     = useMouseParallax()

  const baseY     = position[1]
  // Spring state
  const floatY    = useRef(0)
  const floatV    = useRef(0)

  useFrame(({ clock }, delta) => {
    const t   = clock.elapsedTime
    const grp = groupRef.current
    if (!grp) return

    // ── Spring float ──
    const target  = Math.sin(t * floatSpeed + floatPhase) * floatAmp
                  + (focused ? 0.12 : 0)
    const spring  = 4.2
    const damping = 6.8
    floatV.current  += (target - floatY.current) * spring  * delta
    floatV.current  *= Math.exp(-damping * delta)
    floatY.current  += floatV.current * delta

    grp.position.y = baseY + floatY.current

    // ── Mouse parallax tilt (very subtle) ──
    const maxTilt  = 0.025
    grp.rotation.x = -mouse.current.y * maxTilt
    grp.rotation.y =  rotationY + mouse.current.x * maxTilt

    // ── Focus scale ──
    const scaleTarget = focused ? 1.08 : 1.0
    grp.scale.setScalar(THREE.MathUtils.lerp(grp.scale.x, scaleTarget, 0.05))

    // ── STABLE Glow — FIXED opacity, no flickering ──
    if (glowRef.current?.material) {
      glowRef.current.material.opacity = focused ? 0.40 : 0.18
    }
    if (outerRef.current?.material) {
      outerRef.current.material.opacity = focused ? 0.14 : 0.06
    }
  })

  const d = 0.055
  const r = 0.12

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>

      {/* Outer soft halo — premium blue glow */}
      <RoundedBox
        ref={outerRef}
        args={[width + 0.6, height + 0.6, 0.01]}
        radius={r + 0.03} smoothness={4}
      >
        <meshBasicMaterial
          color="#49C4FF" transparent opacity={0.06}
          side={THREE.BackSide} depthWrite={false}
        />
      </RoundedBox>

      {/* Glass body — deep navy frosted glass */}
      <RoundedBox args={[width, height, d]} radius={r} smoothness={6}>
        <meshPhysicalMaterial
          color="#0B1F5B"
          transparent opacity={0.75}
          roughness={0.01}
          metalness={0.0}
          reflectivity={0.98}
          envMapIntensity={0.9}
          depthWrite={true}
        />
      </RoundedBox>

      {/* Inner border glow — sharp sky blue line */}
      <RoundedBox
        ref={glowRef}
        args={[width + 0.04, height + 0.04, d - 0.01]}
        radius={r + 0.006} smoothness={6}
      >
        <meshBasicMaterial
          color="#49C4FF" transparent opacity={0.18}
          side={THREE.BackSide} depthWrite={false}
        />
      </RoundedBox>

      {/* Top accent line */}
      <mesh position={[0, height / 2 - 0.02, d / 2 + 0.002]}>
        <planeGeometry args={[width - 0.5, 0.003]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.95} depthWrite={false} />
      </mesh>

      {/* Bottom accent line — thinner, more subtle */}
      <mesh position={[0, -(height / 2) + 0.04, d / 2 + 0.002]}>
        <planeGeometry args={[width * 0.6, 0.0015]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* Corner brackets — 4 corners */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy], i) => (
        <group
          key={i}
          position={[sx * (width / 2 - 0.14), sy * (height / 2 - 0.1), d / 2 + 0.003]}
        >
          <mesh>
            <planeGeometry args={[0.24, 0.0028]} />
            <meshBasicMaterial color="#49C4FF" transparent opacity={0.85} depthWrite={false} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[0.24, 0.0028]} />
            <meshBasicMaterial color="#49C4FF" transparent opacity={0.85} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {/* Content */}
      {children}
    </group>
  )
}
