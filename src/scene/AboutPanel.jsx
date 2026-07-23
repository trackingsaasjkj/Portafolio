import React from 'react'
import { Text } from '@react-three/drei'
import GlassPanelBase from './GlassPanelBase'
import { SECTION_SLOTS } from './worldConfig'

const slot = SECTION_SLOTS.find((s) => s.id === 'about')

/**
 * AboutPanel — JK² Software Solutions
 * Corporate overview panel showcasing company mission and stats.
 */
export default function AboutPanel() {
  const pos = slot.position

  return (
    <GlassPanelBase
      width={5.2} height={3.4}
      position={[pos.x, pos.y, pos.z]}
      rotationY={slot.rotationY}
      floatPhase={0.5}
    >
      {/* ── Section eyebrow ── */}
      <Text position={[0, 1.48, 0.05]} fontSize={0.08} color="#49C4FF" anchorX="center" letterSpacing={0.35}>
        01  ·  ABOUT US
      </Text>

      {/* ── Company Logo Mark ── */}
      <mesh position={[0, 0.82, 0.05]}>
        <boxGeometry args={[0.70, 0.70, 0.03]} />
        <meshStandardMaterial color="#49C4FF" emissive="#49C4FF" emissiveIntensity={0.6} />
      </mesh>
      <Text position={[0, 0.82, 0.08]} fontSize={0.38} color="#FFFFFF" anchorX="center" anchorY="middle" fontWeight={800}>
        JK²
      </Text>

      {/* ── Company name ── */}
      <Text position={[0, 0.28, 0.05]} fontSize={0.20} color="#FFFFFF" anchorX="center" anchorY="middle" letterSpacing={0.03}>
        JK² SOFTWARE SOLUTIONS
      </Text>

      {/* ── Mission statement ── */}
      <Text position={[0, -0.08, 0.05]} fontSize={0.095} color="rgba(255,255,255,0.70)" anchorX="center" anchorY="middle" maxWidth={4.4} textAlign="center" lineHeight={1.6}>
        {'We build enterprise-grade software solutions that\nempower businesses to achieve digital excellence.\nFrom concept to deployment, we deliver innovation.'}
      </Text>

      {/* ── Divider ── */}
      <mesh position={[0, -0.50, 0.05]}>
        <planeGeometry args={[4.4, 0.002]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* ── Stats row ── */}
      {[
        { label: 'Enterprise Clients',  value: '50+', x: -1.6 },
        { label: 'Projects Delivered', value: '200+', x: -0.5 },
        { label: 'Team Members',       value: '35+', x:  0.6 },
        { label: 'Years Experience',   value: '10+',  x:  1.7 },
      ].map((s) => (
        <group key={s.label} position={[s.x, -0.96, 0.05]}>
          <Text position={[0, 0.22, 0]} fontSize={0.26} color="#49C4FF" anchorX="center" anchorY="middle" letterSpacing={-0.02}>{s.value}</Text>
          <Text position={[0, -0.06, 0]} fontSize={0.072} color="rgba(255,255,255,0.6)" anchorX="center" anchorY="middle" maxWidth={0.9} textAlign="center" letterSpacing={0.1}>{s.label}</Text>
        </group>
      ))}
    </GlassPanelBase>
  )
}
