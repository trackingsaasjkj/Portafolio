import { Suspense } from 'react'
import { Canvas }   from '@react-three/fiber'
import { preloadFont } from 'troika-three-text'
import HelixCamera    from './scene/HelixCamera'
import HelixWorld     from './scene/HelixWorld'
import PostProcessing from './scene/PostProcessing'
import IntroOverlay   from './components/IntroOverlay'
import HUD            from './components/HUD'

// Pre-load the default font used by @react-three/drei <Text> before any
// component mounts. This prevents troika from triggering Suspense boundaries
// mid-frame (which flash the canvas to black) when it lazily loads glyphs.
preloadFont({ characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,·-/:!?#@©·✦ ' }, () => {})

/**
 * App — root
 *
 * Canvas:
 *  - CineonToneMapping + 0.9 exposure → best for neon-on-black
 *  - dpr capped at 1.5 for perf with postprocessing
 *
 * HTML layers (bottom → top):
 *  1. Canvas + Postprocessing
 *  2. IntroOverlay   (fullscreen entrance)
 *  3. HUD            (badge + tooltip + hints)
 */
export default function App() {
  return (
    <>
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: 4,             // CineonToneMapping
          toneMappingExposure: 0.9,
        }}
        dpr={[1, 1.5]}
        shadows={false}
        style={{ background: '#0B1F5B', width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <HelixCamera />
          <HelixWorld />
          <PostProcessing />
        </Suspense>
      </Canvas>

      <IntroOverlay />
      <HUD />
    </>
  )
}
