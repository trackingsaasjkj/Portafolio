import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text }     from '@react-three/drei'
import * as THREE   from 'three'
import GlassPanelBase from './GlassPanelBase'
import { SECTION_SLOTS, TIMELINE } from './worldConfig'

const slot = SECTION_SLOTS.find((s) => s.id === 'timeline')

/**
 * TimelinePanel — JK² Software Solutions
 * Corporate history timeline with glowing milestone markers.
 * Entries show company evolution from 2014 to present.
 * The active (Now) entry pulses.
 */
export default function TimelinePanel() {
  const pos = slot.position

  return (
    <GlassPanelBase
      width={5.4} height={4.2}
      position={[pos.x, pos.y, pos.z]}
      rotationY={slot.rotationY}
      floatPhase={2.1}
    >
      <Text position={[0, 1.92, 0.05]} fontSize={0.08} color="#49C4FF" anchorX="center" letterSpacing={0.35}>
        04  ·  COMPANY HISTORY
      </Text>

      {/* Vertical spine */}
      <mesh position={[-1.8, -0.1, 0.04]}>
        <planeGeometry args={[0.002, 3.4]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.5} depthWrite={false} />
      </mesh>

      {TIMELINE.map((entry, i) => {
        const y      = 1.38 - i * 0.78
        const isNow  = entry.badge === 'Now'
        return (
          <group key={entry.year} position={[0, y, 0.05]}>
            {/* Dot */}
            <TimelineDot color={entry.color} pulse={isNow} x={-1.8} />

            {/* Year */}
            <Text position={[-1.44, 0, 0]} fontSize={0.09} color="rgba(255,255,255,0.50)" anchorX="left" anchorY="middle" letterSpacing={0.15}>
              {entry.year}
            </Text>

            {/* Badge */}
            <BadgeMesh label={entry.badge} color={entry.color} x={-0.7} />

            {/* Title */}
            <Text position={[0.0, 0.14, 0]} fontSize={0.13} color="#ffffff" anchorX="left" anchorY="middle" maxWidth={2.8}>
              {entry.title}
            </Text>

            {/* Body */}
            <Text position={[0.0, -0.13, 0]} fontSize={0.082} color="rgba(255,255,255,0.60)" anchorX="left" anchorY="middle" maxWidth={2.8} lineHeight={1.5}>
              {entry.body}
            </Text>
          </group>
        )
      })}
    </GlassPanelBase>
  )
}

function TimelineDot({ color, pulse, x }) {
  const ref = useRef()
  useFrame(() => {
    // STABLE intensity - only pulse the "Now" badge
    if (!ref.current) return
    if (pulse) {
      ref.current.material.emissiveIntensity = 1.0
    } else {
      ref.current.material.emissiveIntensity = 0.7
    }
  })
  return (
    <mesh ref={ref} position={[x, 0, 0]}>
      <sphereGeometry args={[0.055, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
    </mesh>
  )
}

function BadgeMesh({ label, color, x }) {
  return (
    <group position={[x, -0.01, 0]}>
      <mesh>
        <planeGeometry args={[0.56, 0.17]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <Text position={[0, 0, 0.002]} fontSize={0.07} color={color} anchorX="center" anchorY="middle" letterSpacing={0.1}>
        {label.toUpperCase()}
      </Text>
    </group>
  )
}
