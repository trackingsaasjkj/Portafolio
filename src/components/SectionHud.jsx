import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '../store/usePortfolioStore'
import { WAYPOINTS } from '../scene/worldConfig'

/**
 * SectionHud
 * Top-left section identifier that appears when the camera
 * pauses at a waypoint (phase === 'paused').
 *
 * Shows:  01 / ABOUT  (or 02 / PROJECTS etc.)
 * Fades out when the camera resumes flying.
 */
export default function SectionHud() {
  const phase          = usePortfolioStore((s) => s.phase)
  const activeWaypoint = usePortfolioStore((s) => s.activeWaypoint)

  const isPaused = phase === 'paused'
  const wp       = WAYPOINTS[activeWaypoint]

  // Section number excludes 'origin' waypoint
  const sectionNum = activeWaypoint   // origin = 0, about = 1, etc.
  const numStr = String(sectionNum).padStart(2, '0')

  return (
    <AnimatePresence>
      {isPaused && wp && wp.id !== 'origin' && (
        <motion.div
          key={wp.id}
          style={styles.root}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1,  y: 0   }}
          exit={{    opacity: 0,  y: -12  }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <span style={styles.num}>{numStr}</span>
          <span style={styles.slash}>/</span>
          <span style={styles.name}>{wp.label.toUpperCase()}</span>

          {/* Animated underline */}
          <motion.div
            style={styles.underline}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const styles = {
  root: {
    position: 'fixed',
    top: 80,
    left: 36,
    zIndex: 20,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    fontFamily: "'SF Pro Display','Inter',-apple-system,sans-serif",
  },
  num: {
    fontSize: 11,
    letterSpacing: '0.25em',
    color: 'rgba(59,130,246,0.7)',
    fontWeight: 300,
  },
  slash: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.15)',
    fontWeight: 100,
  },
  name: {
    fontSize: 22,
    fontWeight: 200,
    letterSpacing: '0.12em',
    color: 'rgba(224,242,254,0.85)',
  },
  underline: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    height: 1,
    background: 'linear-gradient(90deg, rgba(59,130,246,0.7), transparent)',
    transformOrigin: 'left',
  },
}
