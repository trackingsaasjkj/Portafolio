import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

/**
 * IntroOverlay — JK² Software Solutions Brand Intro
 * 
 * Timeline:
 *  0.0s — White background, logo fades in center with scale
 *  0.5s — Logo fully visible, blue glow appears
 *  1.0s — Logo text illuminates with blue glow
 *  2.0s — Begin transition to navy environment
 *  3.0s — Logo moves to upper-left corner
 *  3.5s — Phase changes to 'explore'
 */
export default function IntroOverlay() {
  const phase    = useStore((s) => s.phase)
  const setPhase = useStore((s) => s.setPhase)
  const [logoPhase, setLogoPhase] = useState('enter') // enter → glow → move → complete

  useEffect(() => {
    if (phase !== 'intro') return
    
    // Logo animation timeline
    const t1 = setTimeout(() => setLogoPhase('glow'), 500)
    const t2 = setTimeout(() => setLogoPhase('illuminate'), 1000)
    const t3 = setTimeout(() => setLogoPhase('move'), 2000)
    const t4 = setTimeout(() => {
      setPhase('explore')
      setLogoPhase('complete')
    }, 3500)
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [phase, setPhase])

  return (
    <AnimatePresence>
      {phase === 'intro' && (
        <motion.div
          key="intro"
          style={s.root}
          initial={{ background: '#FFFFFF' }}
          animate={{ 
            background: logoPhase === 'move' ? '#0B1F5B' : '#FFFFFF' 
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* JK² Logo */}
          <motion.div
            style={s.logoContainer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: logoPhase === 'enter' ? 1 : logoPhase === 'move' ? 0.4 : 1,
              opacity: 1,
              x: logoPhase === 'move' ? 'calc(-50vw + 120px)' : 0,
              y: logoPhase === 'move' ? 'calc(-50vh + 60px)' : 0,
            }}
            transition={{
              duration: logoPhase === 'enter' ? 1.2 : 1.0,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            {/* Blue glow behind logo */}
            <motion.div
              style={s.glow}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: logoPhase === 'glow' || logoPhase === 'illuminate' || logoPhase === 'move' ? 0.4 : 0,
                scale: logoPhase === 'glow' || logoPhase === 'illuminate' || logoPhase === 'move' ? 1.5 : 0.5,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            
            {/* Logo Text (JK²) */}
            <motion.div 
              style={s.logoText}
              animate={{
                textShadow: logoPhase === 'illuminate' || logoPhase === 'move'
                  ? '0 0 30px rgba(73,196,255,0.6), 0 0 60px rgba(73,196,255,0.3)'
                  : '0 0 0px rgba(73,196,255,0)',
              }}
              transition={{ duration: 0.6 }}
            >
              <span style={{...s.logoChar, color: logoPhase === 'move' ? '#FFFFFF' : '#0B1F5B'}}>J</span>
              <span style={{...s.logoChar, color: logoPhase === 'move' ? '#FFFFFF' : '#0B1F5B'}}>K</span>
              <span style={{...s.logoSup, color: logoPhase === 'move' ? '#49C4FF' : '#49C4FF'}}>²</span>
            </motion.div>
            
            {/* Company Name */}
            <motion.p
              style={{...s.companyName, color: logoPhase === 'move' ? 'rgba(255,255,255,0.8)' : 'rgba(11,31,91,0.8)'}}
              initial={{ opacity: 0 }}
              animate={{ opacity: logoPhase === 'glow' || logoPhase === 'illuminate' || logoPhase === 'move' ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              SOFTWARE SOLUTIONS
            </motion.p>
          </motion.div>

          {/* Loading hint */}
          <motion.p
            style={{...s.hint, color: logoPhase === 'move' ? 'rgba(73,196,255,0.4)' : 'rgba(11,31,91,0.3)'}}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            LOADING EXPERIENCE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const s = {
  root: {
    position: 'fixed', inset: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif",
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    background: 'radial-gradient(circle, rgba(73,196,255,0.3) 0%, transparent 70%)',
    filter: 'blur(40px)',
    zIndex: 0,
  },
  logoText: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 2,
    zIndex: 1,
    transition: 'text-shadow 0.6s ease',
  },
  logoChar: {
    fontSize: 80,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    transition: 'color 1.0s ease',
  },
  logoSup: {
    fontSize: 48,
    fontWeight: 700,
    transition: 'color 1.0s ease',
  },
  companyName: {
    fontSize: 12,
    letterSpacing: '0.3em',
    fontWeight: 600,
    textAlign: 'center',
    zIndex: 1,
    transition: 'color 1.0s ease',
  },
  hint: {
    position: 'absolute',
    bottom: 40,
    fontSize: 9,
    letterSpacing: '0.4em',
    fontWeight: 500,
    transition: 'color 1.0s ease',
  },
}
