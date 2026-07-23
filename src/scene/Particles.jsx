import { useRef, useMemo } from 'react'
import { useFrame }        from '@react-three/fiber'
import * as THREE          from 'three'

/**
 * Particles — JK² Brand Edition
 * 
 * Three independent layers using brand colors:
 *  A — Sky Blue (#49C4FF) medium dots, slow upward drift
 *  B — White micro specks, faster drift
 *  C — Deep Navy (#0B1F5B) background cloud, very slow
 *
 * STABILITY: Reduced rotation speeds for smoother appearance
 */
export default function Particles({ count = 280, radius = 22 }) {
  const layerA = useRef()
  const layerB = useRef()
  const layerC = useRef()

  const { posA, posB, posC, spdA, spdB, spdC } = useMemo(() => {
    const cA = count, cB = Math.floor(count * 0.55), cC = Math.floor(count * 0.35)

    const posA = new Float32Array(cA * 3), spdA = new Float32Array(cA)
    const posB = new Float32Array(cB * 3), spdB = new Float32Array(cB)
    const posC = new Float32Array(cC * 3), spdC = new Float32Array(cC)

    const place = (arr, i, r, ySpread) => {
      const theta = Math.random() * Math.PI * 2
      const dist  = Math.cbrt(Math.random()) * r
      arr[i*3]   = Math.cos(theta) * dist
      arr[i*3+1] = (Math.random() - 0.5) * ySpread
      arr[i*3+2] = Math.sin(theta) * dist
    }

    for (let i = 0; i < cA; i++) { place(posA, i, radius,     40); spdA[i] = Math.random() * 0.005 + 0.001 }
    for (let i = 0; i < cB; i++) { place(posB, i, radius*0.7, 30); spdB[i] = Math.random() * 0.003 + 0.002 }
    for (let i = 0; i < cC; i++) { place(posC, i, radius*1.4, 55); spdC[i] = Math.random() * 0.002 + 0.0003 }

    return { posA, posB, posC, spdA, spdB, spdC }
  }, [count, radius])

  const cB = Math.floor(count * 0.55)
  const cC = Math.floor(count * 0.35)

  useFrame((_, delta) => {
    if (layerA.current) {
      const p = layerA.current.geometry.attributes.position
      for (let i = 0; i < count; i++) {
        p.array[i*3+1] += spdA[i]
        if (p.array[i*3+1] > 20) p.array[i*3+1] = -20
      }
      p.needsUpdate = true
      layerA.current.rotation.y += delta * 0.008
    }
    if (layerB.current) {
      const p = layerB.current.geometry.attributes.position
      for (let i = 0; i < cB; i++) {
        p.array[i*3+1] += spdB[i]
        if (p.array[i*3+1] > 15) p.array[i*3+1] = -15
      }
      p.needsUpdate = true
      layerB.current.rotation.y -= delta * 0.005
    }
    if (layerC.current) {
      const p = layerC.current.geometry.attributes.position
      for (let i = 0; i < cC; i++) {
        p.array[i*3+1] += spdC[i]
        if (p.array[i*3+1] > 27) p.array[i*3+1] = -27
      }
      p.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={layerA}>
        <bufferGeometry><bufferAttribute attach="attributes-position" array={posA} count={count} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.025} color="#49C4FF" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={layerB}>
        <bufferGeometry><bufferAttribute attach="attributes-position" array={posB} count={cB} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.01} color="#FFFFFF" transparent opacity={0.32} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={layerC}>
        <bufferGeometry><bufferAttribute attach="attributes-position" array={posC} count={cC} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.016} color="#0B1F5B" transparent opacity={0.22} sizeAttenuation depthWrite={false} />
      </points>
    </>
  )
}
