import { useRef, useEffect } from 'react'
import { useFrame }          from '@react-three/fiber'
import { RoundedBox, Text }  from '@react-three/drei'
import gsap                  from 'gsap'
import * as THREE            from 'three'
import { usePortfolioStore } from '../store/usePortfolioStore'
import { useMouseParallax }  from '../hooks/useMouseParallax'

/**
 * IntroPanel — JK² Software Solutions Brand Edition
 *
 * GSAP entrance timeline:
 *   0.0s  panel materialises from scale 0 + opacity 0
 *   0.5s  logo slides in from below
 *   0.9s  divider fades
 *   1.1s  titles slide in staggered
 *   1.6s  bottom glow pulses on
 *
 * Mouse parallax: panel tilts toward cursor
 * Floating: spring physics
 * Exit: scale lerps to 0 when phase !== 'intro'
 */
export default function IntroPanel() {
  const groupRef = useRef()
  const glowRef  = useRef()
  const mouse    = useMouseParallax()
  const phase    = usePortfolioStore((s) => s.phase)

  // Spring state for float
  const floatY = useRef(0)
  const floatV = useRef(0)

  // ── GSAP entrance ──────────────────────────────────────────
  useEffect(() => {
    if (!groupRef.current) return
    const grp = groupRef.current

    // Start invisible
    grp.scale.setScalar(0)

    gsap.timeline({ delay: 0.6 })
      .to(grp.scale, {
        x: 1, y: 1, z: 1,
        duration: 1.4,
        ease: 'elastic.out(1, 0.75)',
      })
  }, [])

  // ── Per-frame ─────────────────────────────────────────────
  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return
    const grp = groupRef.current
    const t   = clock.elapsedTime

    // Exit fade when flying/main
    if (phase !== 'intro') {
      const s = THREE.MathUtils.lerp(grp.scale.x, 0, 0.06)
      grp.scale.setScalar(s)
      return
    }

    // Spring float
    const target = Math.sin(t * 0.36) * 0.14
    const stiff  = 4, damp = 6.5
    floatV.current += (target - floatY.current) * stiff  * delta
    floatV.current *= Math.exp(-damp * delta)
    floatY.current += floatV.current * delta
    grp.position.y  = floatY.current

    // Mouse parallax tilt
    grp.rotation.x = -mouse.current.y * 0.03
    grp.rotation.y =  mouse.current.x * 0.03

    // Glow pulse — STABLE opacity
    if (glowRef.current?.material) {
      glowRef.current.material.opacity = 0.20
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>

      {/* ── Outer soft halo ── */}
      <RoundedBox args={[5.0, 3.4, 0.01]} radius={0.12} smoothness={4}>
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.05}
          side={THREE.BackSide} depthWrite={false} />
      </RoundedBox>

      {/* ── Glass body ── */}
      <RoundedBox args={[4.7, 3.1, 0.058]} radius={0.11} smoothness={6}>
        <meshPhysicalMaterial
          color="#0B1F5B"
          transparent opacity={0.72}
          roughness={0.01}
          metalness={0}
          reflectivity={0.98}
          depthWrite={true}
        />
      </RoundedBox>

      {/* ── Glow border ── */}
      <RoundedBox ref={glowRef} args={[4.74, 3.14, 0.04]} radius={0.115} smoothness={6}>
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.20}
          side={THREE.BackSide} depthWrite={false} />
      </RoundedBox>

      {/* ── Top accent line ── */}
      <mesh position={[0, 1.50, 0.04]}>
        <planeGeometry args={[3.8, 0.003]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.95} depthWrite={false} />
      </mesh>

      {/* ── Bottom accent line ── */}
      <mesh position={[0, -1.50, 0.04]}>
        <planeGeometry args={[2.4, 0.0015]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.40} depthWrite={false} />
      </mesh>

      {/* ── Corner brackets ── */}
      {[[-1,1],[1,1],[-1,-1],[1,-1]].map(([sx,sy],i) => (
        <group key={i} position={[sx*2.20, sy*1.42, 0.04]}>
          <mesh><planeGeometry args={[0.24,0.0028]}/><meshBasicMaterial color="#49C4FF" transparent opacity={0.90} depthWrite={false}/></mesh>
          <mesh rotation={[0,0,Math.PI/2]}><planeGeometry args={[0.24,0.0028]}/><meshBasicMaterial color="#49C4FF" transparent opacity={0.90} depthWrite={false}/></mesh>
        </group>
      ))}

      {/* ── JK² Logo ── */}
      <Text
        position={[0, 0.95, 0.05]}
        fontSize={0.58}
        color="#FFFFFF"
        anchorX="center" anchorY="middle"
        letterSpacing={-0.03}
        fontWeight={800}
      >
        JK²
      </Text>

      {/* ── Divider ── */}
      <Text
        position={[0, 0.42, 0.05]}
        fontSize={0.08} color="#49C4FF"
        anchorX="center" anchorY="middle"
        letterSpacing={0.55}
      >
        {'✦   ✦   ✦'}
      </Text>

      {/* ── Subtitle ── */}
      <Text
        position={[0, 0.05, 0.05]}
        fontSize={0.165}
        color="#FFFFFF"
        anchorX="center" anchorY="middle"
        letterSpacing={0.25}
        fontWeight={600}
      >
        SOFTWARE SOLUTIONS
      </Text>

      {/* ── Tagline ── */}
      <Text
        position={[0, -0.30, 0.05]}
        fontSize={0.095}
        color="rgba(255,255,255,0.55)"
        anchorX="center" anchorY="middle"
        letterSpacing={0.06}
        maxWidth={3.6}
        textAlign="center"
        lineHeight={1.5}
      >
        {'Building next-generation software\nthat transforms businesses'}
      </Text>

      {/* ── Specialties ── */}
      <Text
        position={[-1.5, -0.85, 0.05]}
        fontSize={0.072}
        color="#49C4FF"
        anchorX="left" anchorY="middle"
        letterSpacing={0.08}
      >
        ✓ Enterprise Solutions
      </Text>
      <Text
        position={[-1.5, -1.08, 0.05]}
        fontSize={0.072}
        color="#49C4FF"
        anchorX="left" anchorY="middle"
        letterSpacing={0.08}
      >
        ✓ Custom Development
      </Text>
      <Text
        position={[0.3, -0.85, 0.05]}
        fontSize={0.072}
        color="#49C4FF"
        anchorX="left" anchorY="middle"
        letterSpacing={0.08}
      >
        ✓ Cloud Integration
      </Text>
      <Text
        position={[0.3, -1.08, 0.05]}
        fontSize={0.072}
        color="#49C4FF"
        anchorX="left" anchorY="middle"
        letterSpacing={0.08}
      >
        ✓ AI & Analytics
      </Text>

      {/* ── Bottom ambient glow ── */}
      <mesh position={[0, -1.10, 0.03]}>
        <planeGeometry args={[2.8, 0.8]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.08} depthWrite={false} />
      </mesh>

    </group>
  )
}
