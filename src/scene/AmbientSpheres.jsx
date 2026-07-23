import { useRef, useMemo } from 'react'
import { useFrame }        from '@react-three/fiber'
import * as THREE          from 'three'

/**
 * AmbientSpheres
 * 18 glowing spheres scattered around the helix tower.
 * Each has its own orbit radius, speed and color — all blue palette.
 * They serve as ambient volumetric light sources.
 */
const SPHERE_DATA = [
  { r: 10, s: 0.14, y:  8,  p: 0,    c: '#3b82f6', size: 0.14 },
  { r: 13, s: 0.10, y:  4,  p: 1.2,  c: '#6366f1', size: 0.18 },
  { r:  8, s: 0.18, y: -2,  p: 2.4,  c: '#0ea5e9', size: 0.12 },
  { r: 14, s: 0.08, y: -7,  p: 3.6,  c: '#3b82f6', size: 0.2  },
  { r:  9, s: 0.16, y:  0,  p: 0.8,  c: '#60a5fa', size: 0.1  },
  { r: 12, s: 0.12, y:  6,  p: 4.0,  c: '#818cf8', size: 0.16 },
  { r:  7, s: 0.22, y: -5,  p: 1.6,  c: '#38bdf8', size: 0.09 },
  { r: 11, s: 0.09, y:  2,  p: 5.2,  c: '#1d4ed8', size: 0.22 },
  { r: 15, s: 0.07, y: -10, p: 2.0,  c: '#3b82f6', size: 0.15 },
  { r:  6, s: 0.25, y:  9,  p: 3.1,  c: '#60a5fa', size: 0.08 },
  { r: 13, s: 0.11, y: -3,  p: 0.5,  c: '#6366f1', size: 0.13 },
  { r:  8, s: 0.19, y:  5,  p: 4.8,  c: '#0ea5e9', size: 0.11 },
]

export default function AmbientSpheres() {
  return (
    <group>
      {SPHERE_DATA.map((d, i) => <GlowSphere key={i} data={d} index={i} />)}
    </group>
  )
}

function GlowSphere({ data, index }) {
  const ref    = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + data.p

    if (ref.current) {
      ref.current.position.x = Math.cos(t * data.s) * data.r
      ref.current.position.z = Math.sin(t * data.s) * data.r
      ref.current.position.y = data.y

      ref.current.scale.setScalar(1.0)

      if (ref.current.material && ref.current.material.emissiveIntensity !== 0.7) {
        ref.current.material.emissiveIntensity = 0.7
      }
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[data.size, 12, 12]} />
      <meshStandardMaterial
        color={data.c}
        emissive={data.c}
        emissiveIntensity={0.7}
        roughness={0.1}
        metalness={0.3}
        transparent opacity={0.85}
      />
    </mesh>
  )
}
