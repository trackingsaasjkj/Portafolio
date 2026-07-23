import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '../store/usePortfolioStore'

export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] } },
}
export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const PHASE_LABELS = {
  intro:          'JK² SOFTWARE SOLUTIONS',
  flying:         'NAVIGATING ···',
  flying_resume:  'NAVIGATING ···',
  paused:         'EXPLORING SECTION',
  main:           'EXPLORE THE EXPERIENCE',
}

/**
 * HudOverlay — JK² Brand Edition
 * Persistent layer:
 *  - Top-left: JK² logo badge (always visible)
 *  - Bottom-center: phase label (pulses)
 */
export default function HudOverlay() {
  const phase = usePortfolioStore((s) => s.phase)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      style={styles.root}
    >
      {/* ── JK² logo badge ── */}
      <motion.div variants={fadeUp} style={styles.badge}>
        <div style={styles.badgeSymbol}>K</div>
        <div style={styles.badgeText}>
          <span style={styles.badgeTitle}>JK²</span>
          <span style={styles.badgeSubtitle}>SOFTWARE SOLUTIONS</span>
        </div>
        <span style={styles.badgeDot} />
      </motion.div>

      {/* ── Bottom phase label ── */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          style={styles.hint}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0.3, 0.6, 0.3], y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {PHASE_LABELS[phase] ?? ''}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

const styles = {
  root: {
    position: 'fixed', inset: 0,
    pointerEvents: 'none', zIndex: 10,
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '28px 36px',
    fontFamily: "'SF Pro Display','Inter',-apple-system,sans-serif",
  },
  badge: {
    alignSelf: 'flex-start',
    display: 'flex', alignItems: 'center', gap: 12,
    fontSize: 13, fontWeight: 700,
    color: '#FFFFFF',
    border: '1px solid rgba(73,196,255,0.3)',
    padding: '8px 18px', borderRadius: 50,
    background: 'rgba(11,31,91,0.7)',
    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 0 20px rgba(73,196,255,0.15)',
  },
  badgeSymbol: {
    width: 28,
    height: 28,
    background: '#49C4FF',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 800,
    color: '#FFFFFF',
  },
  badgeText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#FFFFFF',
  },
  badgeSubtitle: {
    fontSize: 7,
    letterSpacing: '0.2em',
    color: 'rgba(73,196,255,0.8)',
    fontWeight: 600,
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#49C4FF',
    boxShadow: '0 0 10px rgba(73,196,255,0.9)',
    display: 'inline-block',
    marginLeft: 4,
  },
  hint: {
    alignSelf: 'center',
    fontSize: 9, letterSpacing: '0.38em',
    color: 'rgba(73,196,255,0.4)',
    marginBottom: 8,
  },
}
