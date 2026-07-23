import { useRef, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'

/**
 * useCinematicCamera
 * Provides a `flyTo` function that animates the R3F camera to a target
 * position + lookAt using GSAP for smooth, configurable easing.
 *
 * This hook is the foundation for all section transitions in the portfolio.
 * Replace OrbitControls with this when building the cinematic experience.
 *
 * Usage (inside a component that has Canvas context):
 *   const { flyTo } = useCinematicCamera()
 *
 *   flyTo({
 *     position: [0, 2, 8],
 *     target:   [0, 0, 0],
 *     duration: 2,
 *     ease:     'power3.inOut',
 *   })
 */
export function useCinematicCamera() {
  const { camera } = useThree()
  const currentTween = useRef(null)

  const flyTo = useCallback(({
    position = [0, 0, 6],
    target   = [0, 0, 0],
    duration = 2,
    ease     = 'power3.inOut',
    onComplete,
  }) => {
    // Kill any running tween before starting a new one
    currentTween.current?.kill()

    const proxy = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
    }

    currentTween.current = gsap.to(proxy, {
      px: position[0],
      py: position[1],
      pz: position[2],
      duration,
      ease,
      onUpdate() {
        camera.position.set(proxy.px, proxy.py, proxy.pz)
        camera.lookAt(target[0], target[1], target[2])
      },
      onComplete,
    })
  }, [camera])

  return { flyTo }
}
