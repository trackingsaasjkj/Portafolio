import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '../store/usePortfolioStore'

/**
 * IntroHud
 * "ENTER PORTFOLIO" button — HTML layer over the canvas.
 * Clicking sets phase → 'flying', which triggers the full drone path.
 * The button fades out immediately on click via AnimatePresence.
 */
export default function IntroHud() {
  const phase    = usePortfolioStore((s) => s.phase)
  const setPhase = usePortfolioStore((s) => s.setPhase)

  function handleEnter() {
    setPhase('flying')
  }

  return (
    <AnimatePresence>
      {phase === 'intro' && (
        <motion.div
          key="intro-hud"
          style={styles.root}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          transition={{ delay: 3.6, duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
        >
          <div style={styles.buttonWrap}>
            <EnterButton onClick={handleEnter} />
            <motion.p
              style={styles.hint}
              animate={{ opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              CLICK TO EXPLORE
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function EnterButton({ onClick }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
      whileTap={{ scale: 0.95 }}
      style={{
        ...styles.btn,
        boxShadow: hovered
          ? '0 0 30px rgba(59,130,246,0.7), 0 0 64px rgba(59,130,246,0.25), inset 0 0 20px rgba(59,130,246,0.1)'
          : '0 0 14px rgba(59,130,246,0.3), inset 0 0 10px rgba(59,130,246,0.04)',
        borderColor: hovered ? 'rgba(96,165,250,0.9)' : 'rgba(59,130,246,0.5)',
        letterSpacing: hovered ? '0.38em' : '0.28em',
        background: hovered ? 'rgba(59,130,246,0.13)' : 'rgba(6,13,31,0.6)',
      }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      <span style={styles.line} />
      ENTER PORTFOLIO
      <span style={styles.line} />
    </motion.button>
  )
}

const styles = {
  root: {
    position: 'fixed', inset: 0,
    pointerEvents: 'none', zIndex: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'SF Pro Display','Inter',-apple-system,sans-serif",
  },
  buttonWrap: {
    pointerEvents: 'auto',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
    marginTop: '14vh',
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 14,
    padding: '14px 36px',
    fontSize: 11, fontWeight: 500,
    letterSpacing: '0.28em', textTransform: 'uppercase',
    color: '#e0f2fe',
    border: '1px solid', borderRadius: 40,
    cursor: 'pointer',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    outline: 'none',
    transition: 'letter-spacing 0.35s, box-shadow 0.35s, border-color 0.35s, background 0.35s',
  },
  line: {
    display: 'inline-block', width: 20, height: 1,
    background: 'rgba(96,165,250,0.7)', borderRadius: 1, flexShrink: 0,
  },
  hint: {
    fontSize: 9, letterSpacing: '0.4em',
    color: 'rgba(147,197,253,0.4)', margin: 0, userSelect: 'none',
  },
}
