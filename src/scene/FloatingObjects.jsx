import { useRef, useMemo }    from 'react'
import { useFrame }            from '@react-three/fiber'
import { RoundedBox, Torus, Octahedron, Icosahedron } from '@react-three/drei'
import * as THREE              from 'three'

/**
 * FloatingObjects — JK² Brand Edition
 *
 * Premium floating geometric elements using brand colors:
 *  - Sky Blue (#49C4FF) for primary accents
 *  - Deep Navy (#0B1F5B) for depth and shadows
 *  - White for highlights and premium feel
 *
 * STABILITY: Spring physics with locked material properties
 * to prevent flickering during animation.
 */

// ── Shared materials ─────────────────────────────────────────
const glassMat = new THREE.MeshPhysicalMaterial({
  color: '#0B1F5B', transparent: true, opacity: 0.58,
  roughness: 0.02, metalness: 0.0,
  transmission: 0.65, thickness: 0.5, ior: 1.5,
  reflectivity: 0.98, side: THREE.DoubleSide, depthWrite: false,
})

const wireMat = new THREE.MeshBasicMaterial({
  color: '#49C4FF', wireframe: true, transparent: true, opacity: 0.20,
})

const glowEdgeMat = new THREE.MeshBasicMaterial({
  color: '#49C4FF', transparent: true, opacity: 0.14,
  side: THREE.BackSide, depthWrite: false,
})

const metalMat = new THREE.MeshStandardMaterial({
  color: '#0B1F5B', roughness: 0.10, metalness: 0.95,
  emissive: '#49C4FF', emissiveIntensity: 0.3,
})

const torusMat = new THREE.MeshStandardMaterial({
  color: '#49C4FF', roughness: 0.06, metalness: 0.88,
  emissive: '#49C4FF', emissiveIntensity: 0.8,
})

// ── Spring helper ──────────────────────────────────────────────
function spring(current, target, velocity, stiffness, damping, dt) {
  const force = (target - current) * stiffness
  velocity    += force * dt
  velocity    *= Math.exp(-damping * dt)
  return [current + velocity * dt, velocity]
}

// ── HeroCube ──────────────────────────────────────────────────
function HeroCube({ position = [0, 0, 0] }) {
  const group = useRef()
  const inner = useRef()
  const velY  = useRef(0)
  const curY  = useRef(position[1])

  useFrame(({ clock }, delta) => {
    const t   = clock.elapsedTime
    const tgt = position[1] + Math.sin(t * 0.42) * 0.22
    const [ny, nv] = spring(curY.current, tgt, velY.current, 4, 6, delta)
    curY.current = ny; velY.current = nv

    if (group.current) {
      group.current.position.y = ny
      group.current.rotation.x = t * 0.08
      group.current.rotation.y = t * 0.11
    }
    if (inner.current) {
      inner.current.rotation.x = -t * 0.14
      inner.current.rotation.z =  t * 0.09
    }
  })

  return (
    <group ref={group} position={position}>
      <RoundedBox args={[1.4, 1.4, 1.4]} radius={0.07} smoothness={4}>
        <primitive object={glassMat} attach="material" />
      </RoundedBox>
      <RoundedBox args={[1.46, 1.46, 1.46]} radius={0.08} smoothness={4}>
        <primitive object={glowEdgeMat} attach="material" />
      </RoundedBox>
      <mesh ref={inner}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <primitive object={wireMat} attach="material" />
      </mesh>
    </group>
  )
}

// ── GlowRing ─────────────────────────────────────────────────
function GlowRing({ position = [0,0,0], axis='y', speed=0.5, phase=0, scale=1 }) {
  const ref  = useRef()
  const velY = useRef(0)
  const curY = useRef(position[1])

  useFrame(({ clock }, delta) => {
    const t   = clock.elapsedTime + phase
    const tgt = position[1] + Math.sin(t * 0.36) * 0.2
    const [ny, nv] = spring(curY.current, tgt, velY.current, 3.5, 5.5, delta)
    curY.current = ny; velY.current = nv

    if (ref.current) {
      ref.current.rotation[axis] = t * speed
      ref.current.rotation.z     = Math.sin(t * 0.3) * 0.15
      ref.current.position.y     = ny
    }
  })

  return (
    <Torus ref={ref} position={position} args={[0.88 * scale, 0.038 * scale, 16, 80]}>
      <primitive object={torusMat} attach="material" />
    </Torus>
  )
}

// ── Crystal (Octahedron) ──────────────────────────────────────
function Crystal({ position = [0,0,0], phase=0, scale=1 }) {
  const ref  = useRef()
  const velY = useRef(0)
  const curY = useRef(position[1])

  useFrame(({ clock }, delta) => {
    const t   = clock.elapsedTime + phase
    const tgt = position[1] + Math.sin(t * 0.48 + phase) * 0.22
    const [ny, nv] = spring(curY.current, tgt, velY.current, 5, 7, delta)
    curY.current = ny; velY.current = nv

    if (ref.current) {
      ref.current.rotation.x = t * 0.2
      ref.current.rotation.y = t * 0.28
      ref.current.position.y = ny
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <Octahedron args={[0.55, 0]}>
        <meshStandardMaterial
          color="#0B1F5B" roughness={0.10} metalness={0.95}
          emissive="#49C4FF" emissiveIntensity={0.3}
        />
      </Octahedron>
      <Octahedron args={[0.58, 0]}>
        <primitive object={wireMat} attach="material" />
      </Octahedron>
    </group>
  )
}

// ── Gem (Icosahedron) ────────────────────────────────────────
function Gem({ position = [0,0,0], phase=0, scale=1 }) {
  const ref  = useRef()
  const velY = useRef(0)
  const curY = useRef(position[1])

  useFrame(({ clock }, delta) => {
    const t   = clock.elapsedTime + phase
    const tgt = position[1] + Math.sin(t * 0.4 + phase) * 0.28
    const [ny, nv] = spring(curY.current, tgt, velY.current, 4.5, 6.5, delta)
    curY.current = ny; velY.current = nv

    if (ref.current) {
      ref.current.rotation.x = t * 0.16
      ref.current.rotation.y = t * 0.23
      ref.current.position.y = ny
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <Icosahedron args={[0.58, 0]}>
        <meshStandardMaterial
          color="#49C4FF" roughness={0.05} metalness={0.94}
          emissive="#49C4FF" emissiveIntensity={0.5}
        />
      </Icosahedron>
      <Icosahedron args={[0.62, 0]}>
        <primitive object={wireMat} attach="material" />
      </Icosahedron>
    </group>
  )
}

// ── GlassSlab ────────────────────────────────────────────────
function GlassSlab({ position = [0,0,0], rotation = [0,0,0], phase=0 }) {
  const ref  = useRef()
  const velY = useRef(0)
  const curY = useRef(position[1])

  useFrame(({ clock }, delta) => {
    const t   = clock.elapsedTime + phase
    const tgt = position[1] + Math.sin(t * 0.32) * 0.18
    const [ny, nv] = spring(curY.current, tgt, velY.current, 3, 5, delta)
    curY.current = ny; velY.current = nv

    if (ref.current) {
      ref.current.position.y = ny
      ref.current.rotation.y = rotation[1] + Math.sin(t * 0.18) * 0.07
    }
  })

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <RoundedBox args={[1, 1, 0.016]} radius={0.032} smoothness={4} scale={[2.2, 1.4, 1]}>
        <meshPhysicalMaterial
          color="#0B1F5B" transparent opacity={0.52}
          roughness={0.02} metalness={0}
          transmission={0.75} thickness={0.3} ior={1.5}
          side={THREE.DoubleSide} depthWrite={false}
        />
      </RoundedBox>
      <RoundedBox args={[1, 1, 0.01]} radius={0.035} smoothness={4} scale={[2.22, 1.42, 1]}>
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.16} side={THREE.BackSide} depthWrite={false} />
      </RoundedBox>
    </group>
  )
}

// ── OrbitingSpheres ───────────────────────────────────────────
function OrbitingSpheres({ count = 5, orbitRadius = 2.8, height = 0 }) {
  const group = useRef()
  const spheres = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2
      return { x: Math.cos(a) * orbitRadius, z: Math.sin(a) * orbitRadius, phase: (i/count)*Math.PI*2 }
    }), [count, orbitRadius])

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.elapsedTime * 0.16
      group.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.12
    }
  })

  return (
    <group ref={group} position={[0, height, 0]}>
      {spheres.map((s, i) => <Sphere key={i} {...s} />)}
    </group>
  )
}

function Sphere({ x, z, phase }) {
  const ref  = useRef()
  const velY = useRef(0)
  const curY = useRef(0)

  useFrame(({ clock }, delta) => {
    const tgt = Math.sin(clock.elapsedTime * 0.48 + phase) * 0.32
    const [ny, nv] = spring(curY.current, tgt, velY.current, 5, 8, delta)
    curY.current = ny; velY.current = nv
    if (ref.current) ref.current.position.y = ny
  })

  return (
    <mesh ref={ref} position={[x, 0, z]}>
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshStandardMaterial color="#49C4FF" roughness={0.06} metalness={0.94} emissive="#49C4FF" emissiveIntensity={1.0} />
    </mesh>
  )
}

// ── Scene composition ─────────────────────────────────────────
export default function FloatingObjects() {
  return (
    <group>
      {/* ── Origin cluster (hero) ── */}
      <HeroCube     position={[0,   0,    0]} />
      <GlowRing     position={[0,   0,    0]} axis="y" speed={0.42} phase={0}   scale={1.6} />
      <GlowRing     position={[0,   0,    0]} axis="x" speed={0.26} phase={1.4} scale={2.0} />
      <OrbitingSpheres count={6} orbitRadius={2.6} height={0} />

      {/* ── Left/right accent at origin ── */}
      <Crystal   position={[-4.2,  0.4, -1.5]} phase={0.5}  scale={1.1} />
      <GlowRing  position={[-4.2,  0.4, -1.5]} axis="y" speed={0.52} phase={2}  scale={0.85} />
      <GlassSlab position={[-5.8, -0.2, -3.5]} rotation={[0,  0.44, 0]} phase={1.0} />
      <Gem       position={[ 4.2,  0.4, -1.5]} phase={1.8}  scale={1.1} />
      <GlowRing  position={[ 4.2,  0.4, -1.5]} axis="y" speed={0.38} phase={4}  scale={0.85} />
      <GlassSlab position={[ 5.8, -0.2, -3.5]} rotation={[0, -0.44, 0]} phase={2.5} />

      {/* ── About zone (z ≈ -5) ── */}
      <Crystal   position={[-8.5,  1.2, -5.0]} phase={1.1}  scale={0.9} />
      <GlowRing  position={[-8.5,  1.2, -5.0]} axis="y" speed={0.48} phase={1.5} scale={0.75} />
      <Gem       position={[-4.0,  2.4, -7.0]} phase={2.2}  scale={0.7} />

      {/* ── Projects zone (z ≈ -14 → -18) ── */}
      <Crystal   position={[-5.5,  1.6, -12.0]} phase={0.8}  scale={0.8} />
      <Gem       position={[ 5.5,  1.4, -12.0]} phase={1.5}  scale={0.8} />
      <GlassSlab position={[ 0.0,  2.5, -13.0]} rotation={[0.08, 0.05, 0]} phase={0.6} />
      <GlowRing  position={[-3.0, -0.5, -16.0]} axis="y" speed={0.35} phase={3}  scale={1.0} />
      <GlowRing  position={[ 3.0, -0.5, -16.0]} axis="x" speed={0.4}  phase={5}  scale={0.9} />

      {/* ── Skills zone (z ≈ -20) ── */}
      <Crystal   position={[ 9.5,  0.8, -19.0]} phase={2.8}  scale={0.9} />
      <GlassSlab position={[ 8.0,  1.8, -21.0]} rotation={[0, -0.3, 0]} phase={1.8} />
      <Gem       position={[ 4.5,  2.8, -23.0]} phase={0.3}  scale={0.6} />

      {/* ── Timeline zone (z ≈ -28) ── */}
      <GlowRing  position={[ 4.0,  1.5, -26.0]} axis="y" speed={0.44} phase={2.2} scale={1.1} />
      <Crystal   position={[-3.5,  0.5, -27.0]} phase={1.6}  scale={0.75} />
      <GlassSlab position={[ 5.0,  0.2, -29.0]} rotation={[0, -0.5, 0]} phase={3.2} />

      {/* ── Contact zone (z ≈ -34) ── */}
      <Gem       position={[-6.0,  1.0, -31.0]} phase={0.7}  scale={0.85} />
      <GlowRing  position={[-6.0,  1.0, -31.0]} axis="y" speed={0.3}  phase={1}   scale={0.9} />
      <Crystal   position={[ 5.5,  0.8, -33.0]} phase={2.4}  scale={0.8} />
      <GlassSlab position={[ 0.0,  2.0, -36.0]} rotation={[0.05, 0.1, 0]} phase={0.9} />

      {/* ── High altitude accents ── */}
      <Gem       position={[-2.0,  4.0, -2.0]}  phase={1.2}  scale={0.45} />
      <Crystal   position={[ 2.2,  3.8, -2.5]}  phase={2.6}  scale={0.45} />
      <Gem       position={[ 1.0,  4.2, -12.0]} phase={3.1}  scale={0.4} />
      <Crystal   position={[-1.5,  4.0, -22.0]} phase={0.4}  scale={0.4} />
    </group>
  )
}
