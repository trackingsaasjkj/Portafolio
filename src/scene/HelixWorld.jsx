import { useRef }    from 'react'
import { useFrame }  from '@react-three/fiber'
import { Grid }      from '@react-three/drei'
import ProjectCard   from './ProjectCard'
import Particles     from './Particles'
import AmbientSpheres from './AmbientSpheres'
import TowerDecor    from './TowerDecor'
import { PROJECTS, getCardTransform, HELIX_CONFIG } from '../data/projects'

/**
 * HelixWorld
 * Assembles the full 3D scene:
 *  - Project cards positioned on the helix
 *  - Particle field
 *  - Ambient glowing spheres
 *  - Central axis glow beam
 *
 * The world itself does NOT rotate — only the camera moves.
 */
export default function HelixWorld() {
  return (
    <>
      {/* Atmosphere */}
      <color attach="background" args={['#0B1F5B']} />
      <fogExp2 attach="fog" args={['#0B1F5B', 0.020]} />

      {/* Lighting */}
      <SceneLights />

      {/* Particles */}
      <Particles count={280} radius={22} />

      {/* Ambient glowing spheres */}
      <AmbientSpheres />

      {/* Tower decorative elements */}
      <TowerDecor />

      {/* Holographic floor grid */}
      <HoloGrid />

      {/* Central axis glow beam */}
      <CentralAxis />

      {/* Project cards on the helix */}
      {PROJECTS.map((project, index) => {
        const pos = getCardTransform(index)
        return (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            position={[pos.x, pos.y, pos.z]}
            rotationY={pos.rotationY}
          />
        )
      })}
    </>
  )
}

/* ── Scene lighting ─────────────────────────────────────────── */
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.08} color="#0B1F5B" />
      <directionalLight position={[-6, 10, 4]} intensity={0.9} color="#49C4FF" />
      {/* Strong rim lights — STATIC for absolute stability */}
      <pointLight position={[8, 3, 0]}   intensity={10}  color="#49C4FF" distance={32} decay={2} />
      <pointLight position={[-7, 0, 8]}  intensity={9}   color="#49C4FF" distance={30} decay={2} />
      <pointLight position={[0, -6, -8]} intensity={6}   color="#49C4FF" distance={28} decay={2} />
      <pointLight position={[0,  14, 0]} intensity={8}   color="#49C4FF" distance={36} decay={2} />
      <pointLight position={[0, -14, 0]} intensity={5}   color="#0B1F5B" distance={30} decay={2} />
      <pointLight position={[10,  0, 0]} intensity={4}   color="#49C4FF" distance={24} decay={2} />
      <pointLight position={[-10, 0, 0]} intensity={4}   color="#49C4FF" distance={24} decay={2} />
    </>
  )
}

/* ── Holographic floor grid ─────────────────────────────────── */
function HoloGrid() {
  const ref = useRef()
  const { totalHeight } = HELIX_CONFIG
  useFrame(() => {
    if (ref.current?.material && ref.current.material.opacity !== 0.060) {
      ref.current.material.opacity = 0.060
    }
  })
  return (
    <Grid
      ref={ref}
      position={[0, -totalHeight * 0.5 - 3, 0]}
      args={[60, 60]}
      cellSize={1}
      cellThickness={0.30}
      cellColor="#0B1F5B"
      sectionSize={6}
      sectionThickness={0.65}
      sectionColor="#49C4FF"
      fadeDistance={30}
      fadeStrength={3}
      infiniteGrid
    />
  )
}

/* ── Central axis beam ───────────────────────────────────────── */
function CentralAxis() {
  return (
    <mesh rotation={[0, 0, 0]}>
      <cylinderGeometry args={[0.020, 0.020, 80, 8]} />
      <meshBasicMaterial color="#49C4FF" transparent opacity={0.05} depthWrite={false} />
    </mesh>
  )
}
