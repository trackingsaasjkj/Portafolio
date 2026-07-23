import React, { useRef, useMemo } from 'react'
import { useFrame }  from '@react-three/fiber'
import { Text }      from '@react-three/drei'
import * as THREE    from 'three'
import GlassPanelBase from './GlassPanelBase'
import { usePortfolioStore } from '../store/usePortfolioStore'

/**
 * ProjectPanel — JK² Software Solutions Brand Edition
 * Premium project showcase cards with glassmorphism and blue neon accents.
 * 
 * STABILITY FIX: Scanline opacity is STABLE (no oscillation).
 */
export default function ProjectPanel({ project }) {
  const focusedProject = usePortfolioStore((s) => s.focusedProject)
  const focused        = focusedProject === project.id

  return (
    <GlassPanelBase
      width={4.4} height={3.0}
      position={[project.position.x, project.position.y, project.position.z]}
      rotationY={project.rotationY}
      floatPhase={project.position.x * 0.4}
      focused={focused}
    >
      {/* Image area */}
      <ImageArea focused={focused} />

      {/* Divider */}
      <mesh position={[0, -0.02, 0.05]}>
        <planeGeometry args={[3.8, 0.002]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* Title */}
      <Text position={[0, -0.2, 0.05]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle" letterSpacing={0.02} maxWidth={4.0}>
        {project.title}
      </Text>

      {/* Description */}
      <Text position={[0, -0.52, 0.05]} fontSize={0.09} color="rgba(255,255,255,0.65)" anchorX="center" anchorY="middle" letterSpacing={0.03} maxWidth={3.8} textAlign="center" lineHeight={1.5}>
        {project.description}
      </Text>

      {/* Tags */}
      <TagRow tags={project.tags} y={-0.88} />

      {/* Button */}
      <ViewButton y={-1.2} />
    </GlassPanelBase>
  )
}

/* ── Image placeholder with scanline ───────────────────────── */
function ImageArea({ focused }) {
  const scanRef  = useRef()
  const shimRef  = useRef()
  const scanMat  = useMemo(() => new THREE.MeshBasicMaterial({ color: '#49C4FF', transparent: true, opacity: 0.20, depthWrite: false }), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const speed = focused ? 0.9 : 0.4
    const halfH = 0.56
    if (scanRef.current) {
      scanRef.current.position.y = ((t * speed) % (halfH * 2)) - halfH
      // STABLE opacity
      scanMat.opacity = focused ? 0.22 : 0.10
    }
    if (shimRef.current?.material) {
      // STABLE opacity - no flickering
      shimRef.current.material.opacity = focused ? 0.12 : 0.08
    }
  })

  return (
    <group position={[0, 0.62, 0.05]}>
      <mesh><planeGeometry args={[3.8, 1.14]} /><meshBasicMaterial color="#0B1F5B" transparent opacity={0.90} depthWrite={false} /></mesh>
      <mesh ref={shimRef}><planeGeometry args={[3.8, 1.14]} /><meshBasicMaterial color="#49C4FF" transparent opacity={0.08} depthWrite={false} /></mesh>
      {[-0.32, 0, 0.32].map((gy, i) => (
        <mesh key={i} position={[0, gy, 0.001]}><planeGeometry args={[3.78, 0.002]} /><meshBasicMaterial color="#49C4FF" transparent opacity={0.12} depthWrite={false} /></mesh>
      ))}
      <mesh ref={scanRef} position={[0, 0, 0.002]}>
        <planeGeometry args={[3.8, 0.022]} />
        <primitive object={scanMat} attach="material" />
      </mesh>
      <Text position={[0, 0, 0.004]} fontSize={0.09} color="rgba(73,196,255,0.35)" anchorX="center" anchorY="middle" letterSpacing={0.3}>
        PROJECT PREVIEW
      </Text>
    </group>
  )
}

/* ── Tech tag row ───────────────────────────────────────────── */
function TagRow({ tags, y }) {
  const spacing = 0.88
  const total   = (tags.length - 1) * spacing
  const startX  = -total / 2

  return (
    <group position={[0, y, 0.05]}>
      {tags.map((tag, i) => (
        <group key={tag} position={[startX + i * spacing, 0, 0]}>
          <mesh><planeGeometry args={[0.78, 0.19]} /><meshBasicMaterial color="#0B1F5B" transparent opacity={0.7} depthWrite={false} /></mesh>
          <Text position={[0, 0, 0.003]} fontSize={0.072} color="#49C4FF" anchorX="center" anchorY="middle" letterSpacing={0.1}>{tag}</Text>
        </group>
      ))}
    </group>
  )
}

/* ── View Project button ────────────────────────────────────── */
function ViewButton({ y }) {
  const glowRef = useRef()
  useFrame(() => {
    // STABLE opacity - no flickering
    if (glowRef.current?.material) {
      glowRef.current.material.opacity = 0.25
    }
  })
  return (
    <group position={[0, y, 0.05]}>
      <mesh><planeGeometry args={[1.4, 0.26]} /><meshBasicMaterial color="#49C4FF" transparent opacity={0.50} depthWrite={false} /></mesh>
      <mesh ref={glowRef} position={[0, 0, -0.001]}>
        <planeGeometry args={[1.44, 0.30]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.25} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <Text position={[0, 0, 0.003]} fontSize={0.088} color="#FFFFFF" anchorX="center" anchorY="middle" letterSpacing={0.22}>VIEW PROJECT</Text>
    </group>
  )
}
