import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '../store/usePortfolioStore'
import { WAYPOINTS, PROJECTS } from '../scene/worldConfig'

/**
 * FlightHud — bottom-center overlay
 * Visible during: flying, flying_resume, paused, main
 *
 * Contains:
 *  - Section spotlight card (when camera pauses at a section)
 *  - Progress dots — one per waypoint, lights up as camera passes
 *  - Current section label (AnimatePresence swap)
 *  - Progress bar (only while flying)
 */
export default function FlightHud() {
  const phase          = usePortfolioStore((s) => s.phase)
  const activeWaypoint = usePortfolioStore((s) => s.activeWaypoint)
  const isFlying       = usePortfolioStore((s) => s.isFlying)
  const focusedProject = usePortfolioStore((s) => s.focusedProject)

  const visible  = ['flying', 'flying_resume', 'paused', 'main'].includes(phase)
  const wp       = WAYPOINTS[activeWaypoint] ?? WAYPOINTS[0]
  const project  = PROJECTS.find((p) => p.id === focusedProject) ?? null
  const progress = activeWaypoint / (WAYPOINTS.length - 1)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="flight-hud"
          style={styles.root}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{    opacity: 0, y: 16  }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* ── Section spotlight (paused) ── */}
          <AnimatePresence>
            {phase === 'paused' && (
              <motion.div
                key={wp.id + '-spotlight'}
                style={styles.spotlight}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{    opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              >
                <span style={styles.spotEye}>NOW AT</span>
                <p style={styles.spotTitle}>{wp.label}</p>
                {project && (
                  <div style={styles.spotTags}>
                    {project.tags.map((t) => (
                      <span key={t} style={styles.spotTag}>{t}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Progress dots ── */}
          <div style={styles.dotsRow}>
            {WAYPOINTS.map((w, i) => (
              <motion.div
                key={w.id}
                style={styles.dot}
                animate={{
                  background:
                    i === activeWaypoint ? '#3b82f6' :
                    i  < activeWaypoint  ? 'rgba(59,130,246,0.4)' :
                                           'rgba(255,255,255,0.1)',
                  scale:     i === activeWaypoint ? 1.7 : 1,
                  boxShadow: i === activeWaypoint
                    ? '0 0 12px rgba(59,130,246,1)'
                    : 'none',
                }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>

          {/* ── Section label ── */}
          <AnimatePresence mode="wait">
            <motion.p
              key={wp.id}
              style={styles.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -5 }}
              transition={{ duration: 0.35 }}
            >
              {wp.label.toUpperCase()}
            </motion.p>
          </AnimatePresence>

          {/* ── Progress bar ── */}
          <div style={styles.barTrack}>
            <motion.div
              style={styles.barFill}
              animate={{ scaleX: progress }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.9, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const styles = {
  root: {
    position: 'fixed', bottom: 32, left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20, pointerEvents: 'none',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    fontFamily: "'SF Pro Display','Inter',-apple-system,sans-serif",
  },
  spotlight: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
    marginBottom: 6,
    padding: '10px 22px',
    background: 'rgba(5,5,5,0.72)',
    border: '1px solid rgba(59,130,246,0.22)',
    borderRadius: 10,
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
  },
  spotEye: {
    fontSize: 8, letterSpacing: '0.4em', color: 'rgba(59,130,246,0.65)',
  },
  spotTitle: {
    fontSize: 14, fontWeight: 600, letterSpacing: '0.06em',
    color: '#e0f2fe', margin: 0,
  },
  spotTags: { display: 'flex', gap: 5 },
  spotTag: {
    fontSize: 8, letterSpacing: '0.1em', color: '#93c5fd',
    background: 'rgba(59,130,246,0.12)',
    border: '1px solid rgba(59,130,246,0.18)',
    padding: '2px 7px', borderRadius: 20,
  },
  dotsRow: { display: 'flex', gap: 10, alignItems: 'center' },
  dot:     { width: 6, height: 6, borderRadius: '50%' },
  label: {
    fontSize: 9, letterSpacing: '0.4em',
    color: 'rgba(147,197,253,0.55)', margin: 0,
  },
  barTrack: {
    width: 140, height: 1,
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 1, overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    background: 'linear-gradient(90deg,#1d4ed8,#3b82f6)',
    transformOrigin: 'left',
    boxShadow: '0 0 8px rgba(59,130,246,0.6)',
  },
}
