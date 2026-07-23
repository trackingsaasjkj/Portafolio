import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus, RoundedBox, Octahedron } from '@react-three/drei'
import * as THREE from 'three'
import { HELIX_CONFIG } from '../data/projects'

/**
 * TowerDecor
 * Decorative elements that surround the central helix:
 *
 * 1. Three orbital rings (torus) at different heights — rotate continuously
 * 2. Floor ring — flat glowing circle at the base
 * 3. Top beacon  — pulsing point of light at the crown
 * 4. Mid-axis floating crystals — small octahedra orbiting the axis
 */
export default function TowerDecor() {
  const { totalHeight } = HELIX_CONFIG
  const topY    =  totalHeight * 0.5 + 2
  const midY    =  0
  const botY    = -totalHeight * 0.5 - 2

  return (
    <group>
      {/* Orbital rings */}
      <OrbitalRing y={topY}  radius={3.8} speed={0.28}  color="#3b82f6" tilt={0.15} />
      <OrbitalRing y={midY}  radius={4.5} speed={-0.18} color="#6366f1" tilt={0.08} />
      <OrbitalRing y={botY}  radius={3.2} speed={0.22}  color="#0ea5e9" tilt={0.2}  />

      {/* Floor ring */}
      <FloorRing y={botY - 1} />

      {/* Top beacon */}
      <TopBeacon y={topY + 1.5} />

      {/* Orbiting crystals */}
      <OrbitingCrystals />
    </group>
  )
}

function OrbitalRing({ y, radius, speed, color, tilt }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * speed
      ref.current.material.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 0.8) * 0.25
    }
  })
  return (
    <Torus
      ref={ref}
      position={[0, y, 0]}
      rotation={[Math.PI / 2 + tilt, 0, 0]}
      args={[radius, 0.022, 16, 96]}
    >
      <meshStandardMaterial
        color={color} emissive={color}
        emissiveIntensity={0.5}
        roughness={0.1} metalness={0.8}
        transparent opacity={0.7}
      />
    </Torus>
  )
}

function FloorRing({ y }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current?.material) {
      ref.current.material.opacity = 0.06 + Math.sin(clock.elapsedTime * 0.45) * 0.03
    }
  })
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[3, 12, 64]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function TopBeacon({ y }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.intensity = 8 + Math.sin(clock.elapsedTime * 1.5) * 4
    }
  })
  return (
    <>
      <pointLight ref={ref} position={[0, y, 0]} intensity={8} color="#60a5fa" distance={20} decay={2} />
      <mesh position={[0, y, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={3} />
      </mesh>
    </>
  )
}

function OrbitingCrystals() {
  const CRYSTALS = [
    { r: 2.2, s: 0.35, y:  5, p: 0,   scale: 0.14 },
    { r: 2.8, s: -0.28, y: -3, p: 2.1, scale: 0.11 },
    { r: 2.0, s: 0.42, y:  1, p: 4.2, scale: 0.09 },
    { r: 3.0, s: -0.22, y: -7, p: 1.1, scale: 0.13 },
    { r: 2.4, s: 0.31, y:  8, p: 3.5, scale: 0.1  },
  ]
  return (
    <group>
      {CRYSTALS.map((c, i) => <FloatingCrystal key={i} {...c} />)}
    </group>
  )
}

function FloatingCrystal({ r, s, y, p, scale }) {
  const ref  = useRef()
  const velY = useRef(0)
  const curY = useRef(y)

  useFrame(({ clock }, delta) => {
    const t   = clock.elapsedTime + p
    const tgt = y + Math.sin(t * 0.5) * 0.8
    velY.current += (tgt - curY.current) * 4 * delta
    velY.current *= Math.exp(-6 * delta)
    curY.current += velY.current * delta

    if (ref.current) {
      ref.current.position.x = Math.cos(t * s) * r
      ref.current.position.z = Math.sin(t * s) * r
      ref.current.position.y = curY.current
      ref.current.rotation.x = t * 0.4
      ref.current.rotation.y = t * 0.6
    }
  })

  return (
    <Octahedron ref={ref} args={[scale, 0]}>
      <meshStandardMaterial
        color="#1d4ed8" roughness={0.1} metalness={0.9}
        emissive="#3b82f6" emissiveIntensity={0.5}
        transparent opacity={0.85}
      />
    </Octahedron>
  )
}
