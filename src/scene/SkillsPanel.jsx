import { useRef }             from 'react'
import { useFrame }           from '@react-three/fiber'
import { Text }               from '@react-three/drei'
import * as THREE             from 'three'
import GlassPanelBase         from './GlassPanelBase'
import { SECTION_SLOTS, WAYPOINTS } from './worldConfig'
import { usePortfolioStore }  from '../store/usePortfolioStore'

const slot      = SECTION_SLOTS.find((s) => s.id === 'skills')
const skillsIdx = WAYPOINTS.findIndex((w) => w.id === 'skills')

/**
 * SkillsPanel — JK² Software Solutions Technologies
 * Showcases core technology stack and expertise areas
 */

const TECH_STACK = [
  { 
    category: 'Backend', 
    icon: '◈', 
    items: [
      { name: '.NET Core', pct: 95 }, 
      { name: 'Node.js', pct: 90 }, 
      { name: 'Python', pct: 88 }, 
      { name: 'Java', pct: 85 }
    ] 
  },
  { 
    category: 'Frontend', 
    icon: '✦', 
    items: [
      { name: 'React', pct: 92 }, 
      { name: 'Angular', pct: 88 }, 
      { name: 'Vue.js', pct: 85 }, 
      { name: 'TypeScript', pct: 93 }
    ] 
  },
  { 
    category: 'Cloud & DevOps', 
    icon: '⬡', 
    items: [
      { name: 'Azure', pct: 90 }, 
      { name: 'AWS', pct: 87 }, 
      { name: 'Docker', pct: 92 }, 
      { name: 'Kubernetes', pct: 85 }
    ] 
  },
]

export default function SkillsPanel() {
  const pos            = slot.position
  const activeWaypoint = usePortfolioStore((s) => s.activeWaypoint)
  const triggered      = activeWaypoint >= skillsIdx

  return (
    <GlassPanelBase
      width={5.8} height={3.6}
      position={[pos.x, pos.y, pos.z]}
      rotationY={slot.rotationY}
      floatPhase={1.2}
    >
      <Text
        position={[0, 1.6, 0.05]}
        fontSize={0.08} color="#49C4FF"
        anchorX="center" letterSpacing={0.35}
      >
        03  ·  TECHNOLOGY STACK
      </Text>

      {TECH_STACK.map((cat, ci) => {
        const colX = (ci - 1) * 1.88
        return (
          <group key={cat.category} position={[colX, 0.3, 0.05]}>

            {/* Header */}
            <Text
              position={[0, 1.05, 0]}
              fontSize={0.11} color="#FFFFFF"
              anchorX="center" letterSpacing={0.12}
            >
              {cat.icon}  {cat.category.toUpperCase()}
            </Text>

            <mesh position={[0, 0.88, 0]}>
              <planeGeometry args={[1.5, 0.002]} />
              <meshBasicMaterial color="#49C4FF" transparent opacity={0.35} depthWrite={false} />
            </mesh>

            {/* Tech rows */}
            {cat.items.map((item, ii) => (
              <group key={item.name} position={[0, 0.52 - ii * 0.38, 0]}>
                <Text
                  position={[-0.68, 0.1, 0]}
                  fontSize={0.09} color="rgba(255,255,255,0.8)"
                  anchorX="left" anchorY="middle"
                >
                  {item.name}
                </Text>
                <Text
                  position={[0.68, 0.1, 0]}
                  fontSize={0.09} color="#49C4FF"
                  anchorX="right" anchorY="middle"
                >
                  {item.pct}%
                </Text>

                {/* Track */}
                <mesh position={[0, -0.05, 0]}>
                  <planeGeometry args={[1.38, 0.024]} />
                  <meshBasicMaterial color="#0B1F5B" transparent opacity={0.9} depthWrite={false} />
                </mesh>

                {/* Animated fill */}
                <SkillBar
                  pct={item.pct}
                  triggered={triggered}
                  delay={ci * 0.18 + ii * 0.08}
                />
              </group>
            ))}
          </group>
        )
      })}
    </GlassPanelBase>
  )
}

/** SkillBar — fills from 0 → pct once `triggered` is true */
function SkillBar({ pct, triggered, delay }) {
  const ref      = useRef()
  const startT   = useRef(null)
  const DURATION = 1.4   // seconds

  useFrame(({ clock }) => {
    if (!ref.current) return

    if (!triggered) {
      ref.current.scale.x = 0.001
      ref.current.position.x = -0.69
      return
    }

    if (startT.current === null) startT.current = clock.elapsedTime + delay

    const elapsed  = Math.max(clock.elapsedTime - startT.current, 0)
    const progress = Math.min(elapsed / DURATION, 1)
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3)
    const fill     = eased * (pct / 100)

    ref.current.scale.x    = Math.max(fill, 0.001)
    ref.current.position.x = -0.69 + (fill * 1.38) / 2 - 1.38 / 2
  })

  return (
    <mesh ref={ref} position={[-0.69, -0.05, 0.002]} scale={[0.001, 1, 1]}>
      <planeGeometry args={[1.38, 0.024]} />
      <meshBasicMaterial
        color="#49C4FF" transparent opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  )
}
