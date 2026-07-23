import { useRef, useState, useMemo } from 'react'
import { useFrame }                  from '@react-three/fiber'
import { RoundedBox, Text }          from '@react-three/drei'
import * as THREE                    from 'three'
import { useStore }                  from '../store/useStore'
import { PROJECTS }                  from '../data/projects'

const IDX = new Map(PROJECTS.map((p, i) => [p.id, i + 1]))

/**
 * ProjectCard
 * Floating holographic panel positioned on the helix.
 * rotationY is computed by getCardTransform so it always faces the camera
 * when t == this card's index.
 *
 * Spring float  — gentle up/down motion
 * Hover scale   — grows 1.0 → 1.08
 * Glow border   — pulses, intensifies on hover
 * Side bars     — vertical accent lines that pulse
 */
export default function ProjectCard({ project, position, rotationY, index }) {
  const groupRef  = useRef()
  const glowRef   = useRef()
  const outerRef  = useRef()
  const sideL     = useRef()
  const sideR     = useRef()

  const [hovered, setHovered] = useState(false)
  const setHoveredProject = useStore((s) => s.setHoveredProject)
  const setHelixPaused    = useStore((s) => s.setHelixPaused)

  const floatY   = useRef(position[1])
  const floatV   = useRef(0)
  const scaleS   = useRef(1)
  const phaseOff = useMemo(() => index * 1.35, [index])

  function onPointerOver() {
    setHovered(true)
    setHoveredProject(project.id)
    setHelixPaused(true)
  }
  function onPointerOut() {
    setHovered(false)
    setHoveredProject(null)
    setHelixPaused(false)
  }

  useFrame(({ clock }, delta) => {
    const grp = groupRef.current
    if (!grp) return

    // Lock position to stable pixels to prevent any micro-shaking or sub-pixel text shimmering
    grp.position.y = position[1]

    // Hover scale (using smooth frame-rate independent interpolation)
    const st = hovered ? 1.08 : 1.0
    const lerpFactor = 1 - Math.exp(-6.0 * delta)
    scaleS.current += (st - scaleS.current) * lerpFactor
    grp.scale.setScalar(scaleS.current)

    // Glow (constant opacity to prevent pulsing brightness flickers)
    if (glowRef.current?.material) {
      glowRef.current.material.opacity = hovered ? 0.42 : 0.10
    }
    if (outerRef.current?.material) {
      outerRef.current.material.opacity = hovered ? 0.10 : 0.03
    }

    // Side bars (constant opacity for stability)
    const sop = hovered ? 0.3 : 0.14
    if (sideL.current?.material) sideL.current.material.opacity = sop
    if (sideR.current?.material) sideR.current.material.opacity = sop
  })

  const W = 5.4, H = 3.5

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Outer ambient halo */}
      <RoundedBox ref={outerRef} args={[W+1.0, H+1.0, 0.01]} radius={0.14} smoothness={4} renderOrder={1}>
        <meshBasicMaterial color={project.color} transparent opacity={0.03} side={THREE.BackSide} depthWrite={false}/>
      </RoundedBox>

      {/* Glass body */}
      <RoundedBox args={[W, H, 0.06]} radius={0.12} smoothness={6} renderOrder={3}>
        <meshPhysicalMaterial
          color="#030918" transparent opacity={0.78}
          roughness={0.015} metalness={0}
          reflectivity={0.96}
          depthWrite={true}
        />
      </RoundedBox>

      {/* Glow border */}
      <RoundedBox ref={glowRef} args={[W+0.05, H+0.05, 0.045]} radius={0.125} smoothness={6} renderOrder={2}>
        <meshBasicMaterial color={project.color} transparent opacity={0.10} side={THREE.BackSide} depthWrite={false}/>
      </RoundedBox>

      {/* Top accent line */}
      <mesh position={[0, H/2-0.02, 0.052]} renderOrder={4}>
        <planeGeometry args={[W-0.3, 0.004]}/>
        <meshBasicMaterial color={project.color} transparent opacity={1} depthWrite={false}/>
      </mesh>

      {/* Bottom thin line */}
      <mesh position={[0, -(H/2)+0.04, 0.052]} renderOrder={4}>
        <planeGeometry args={[W*0.5, 0.002]}/>
        <meshBasicMaterial color={project.color} transparent opacity={0.4} depthWrite={false}/>
      </mesh>

      {/* Side glow bars */}
      <mesh ref={sideL} position={[-(W/2)+0.012, 0, 0.05]} renderOrder={4}>
        <planeGeometry args={[0.003, H-0.5]}/>
        <meshBasicMaterial color={project.color} transparent opacity={0.14} depthWrite={false}/>
      </mesh>
      <mesh ref={sideR} position={[W/2-0.012, 0, 0.05]} renderOrder={4}>
        <planeGeometry args={[0.003, H-0.5]}/>
        <meshBasicMaterial color={project.color} transparent opacity={0.14} depthWrite={false}/>
      </mesh>

      {/* Corner brackets */}
      {[[-1,1],[1,1],[-1,-1],[1,-1]].map(([sx,sy],i) => (
        <group key={i} position={[sx*(W/2-0.16), sy*(H/2-0.12), 0.055]}>
          <mesh renderOrder={4}><planeGeometry args={[0.26,0.003]}/><meshBasicMaterial color={project.color} transparent opacity={0.9} depthWrite={false}/></mesh>
          <mesh rotation={[0,0,Math.PI/2]} renderOrder={4}><planeGeometry args={[0.26,0.003]}/><meshBasicMaterial color={project.color} transparent opacity={0.9} depthWrite={false}/></mesh>
        </group>
      ))}

      {/* Image area */}
      <ImageArea color={project.color} hovered={hovered} W={W} />

      {/* Index badge */}
      <Text
        position={[-(W/2-0.38), H/2-0.28, 0.055]}
        fontSize={0.11} color={project.color}
        anchorX="center" anchorY="middle" letterSpacing={0.1}
        renderOrder={5}
      >
        {String(IDX.get(project.id) ?? index+1).padStart(2,'0')}
      </Text>

      {/* Category */}
      <Text
        position={[0.12, 0.2, 0.055]}
        fontSize={0.076} color={project.color}
        anchorX="center" anchorY="middle" letterSpacing={0.32}
        renderOrder={5}
      >
        {project.category.toUpperCase()}
      </Text>

      {/* Title */}
      <Text
        position={[0, -0.15, 0.055]}
        fontSize={0.235} color="#ffffff"
        anchorX="center" anchorY="middle"
        letterSpacing={0.01} maxWidth={4.8}
        renderOrder={5}
      >
        {project.title}
      </Text>

      {/* Description */}
      <Text
        position={[0, -0.57, 0.055]}
        fontSize={0.09} color="rgba(178,210,255,0.58)"
        anchorX="center" anchorY="middle"
        maxWidth={4.6} textAlign="center" lineHeight={1.55}
        renderOrder={5}
      >
        {project.description}
      </Text>

      {/* Tags */}
      <TagRow tags={project.tags} color={project.color} y={-1.1} />

      {/* Invisible hit surface */}
      <mesh renderOrder={6}>
        <planeGeometry args={[W, H]}/>
        <meshBasicMaterial transparent opacity={0} depthWrite={false}/>
      </mesh>
    </group>
  )
}

/* ── Image area ─────────────────────────────────────────────── */
function ImageArea({ color, hovered, W }) {
  const scanRef = useRef()
  const shimRef = useRef()
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#93c5fd', transparent: true, opacity: 0.16, depthWrite: false,
  }), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const spd = hovered ? 1.2 : 0.5
    if (scanRef.current) {
      scanRef.current.position.y = ((t * spd) % 1.2) - 0.6
      mat.opacity = hovered ? 0.22 : 0.09
    }
    if (shimRef.current?.material) {
      shimRef.current.material.opacity = hovered ? 0.11 : 0.07
    }
  })

  const iW = W - 0.4
  return (
    <group position={[0, 0.82, 0.054]}>
      <mesh renderOrder={4}><planeGeometry args={[iW, 1.15]}/><meshBasicMaterial color="#020810" transparent opacity={0.95} depthWrite={false}/></mesh>
      <mesh ref={shimRef} position={[0, 0, 0.0005]} renderOrder={4}><planeGeometry args={[iW, 1.15]}/><meshBasicMaterial color={color} transparent opacity={0.07} depthWrite={false}/></mesh>
      {[-0.35,-0.12,0.12,0.35].map((gy,i) => (
        <mesh key={i} position={[0,gy,0.001]} renderOrder={4}><planeGeometry args={[iW-0.1,0.0016]}/><meshBasicMaterial color={color} transparent opacity={0.09} depthWrite={false}/></mesh>
      ))}
      <mesh ref={scanRef} position={[0,0,0.002]} renderOrder={4}>
        <planeGeometry args={[iW, 0.024]}/>
        <primitive object={mat} attach="material"/>
      </mesh>
      <Text position={[0,0,0.004]} fontSize={0.09} color="rgba(147,197,253,0.18)" anchorX="center" anchorY="middle" letterSpacing={0.35} renderOrder={5}>
        PROJECT PREVIEW
      </Text>
    </group>
  )
}

/* ── Tag row ─────────────────────────────────────────────────── */
function TagRow({ tags, color, y }) {
  const spacing = 0.92
  const total   = (tags.length - 1) * spacing
  const startX  = -total / 2
  return (
    <group position={[0, y, 0.055]}>
      {tags.map((tag, i) => (
        <group key={tag} position={[startX + i * spacing, 0, 0]}>
          <mesh renderOrder={4}><planeGeometry args={[0.82,0.22]}/><meshBasicMaterial color={color} transparent opacity={0.11} depthWrite={false}/></mesh>
          <mesh position={[0,0,-0.001]} renderOrder={4}><planeGeometry args={[0.84,0.24]}/><meshBasicMaterial color={color} transparent opacity={0.16} side={THREE.BackSide} depthWrite={false}/></mesh>
          <Text position={[0,0,0.003]} fontSize={0.077} color={color} anchorX="center" anchorY="middle" letterSpacing={0.1} renderOrder={5}>{tag}</Text>
        </group>
      ))}
    </group>
  )
}
