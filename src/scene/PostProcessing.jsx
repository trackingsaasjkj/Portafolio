import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 }       from 'three'

/**
 * PostProcessing — JK² Brand Edition
 *
 * Premium effects for the blue-on-navy aesthetic:
 *  - Bloom tuned for sky blue (#49C4FF) highlights
 *  - Subtle vignette for depth and focus
 *  - Minimal chromatic aberration for glass realism
 */
export default function PostProcessing() {
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={0.75}
        luminanceThreshold={0.75}
        luminanceSmoothing={0.95}
        radius={0.80}
      />
      <Vignette 
        offset={0.30} 
        darkness={0.55} 
        eskil={false} 
        blendFunction={BlendFunction.NORMAL} 
      />
      <ChromaticAberration 
        offset={new Vector2(0.0003, 0.0003)} 
        blendFunction={BlendFunction.NORMAL} 
      />
    </EffectComposer>
  )
}
