import { useState }          from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '../store/usePortfolioStore'
import { WAYPOINTS }         from '../scene/worldConfig'

/**
 * NavSidebar — polish pass
 *
 * Clicking a dot now sets activeWaypoint AND adjusts pathT so the
 * camera idle drift re-anchors to that waypoint's position.
 * Full teleport is handled by setting phase → 'main' and activeWaypoint,
 * which CinematicCamera's idle loop picks up immediately.
 *
 * Only clickable after 'intro' phase. Origin dot hidden.
 */
export default function NavSidebar() {
  const phase            = usePortfolioStore((s) => s.phase)
  const activeWaypoint   = usePortfolioStore((s) => s.activeWaypoint)
  const isFlying         = usePortfolioStore((s) => s.isFlying)
  const setActiveWaypoint = usePortfolioStore((s) => s.setActiveWaypoint)
  const setPhase          = usePortfolioStore((s) => s.setPhase)

  const visible = !['intro'].includes(phase)

  function handleDotClick(realIdx) {
    if (isFlying) return   // don't interrupt active flight
    setActiveWaypoint(realIdx)
    setPhase('main')
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="nav-sidebar"
          style={styles.root}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0  }}
          exit={{    opacity: 0, x: 20  }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          {WAYPOINTS
            .filter((w) => w.id !== 'origin')
            .map((wp) => {
              const realIdx = WAYPOINTS.indexOf(wp)
              return (
                <NavDot
                  key={wp.id}
                  label={wp.label}
                  active={realIdx === activeWaypoint}
                  passed={realIdx < activeWaypoint}
                  onClick={() => handleDotClick(realIdx)}
                  disabled={isFlying}
                />
              )
            })}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

function NavDot({ label, active, passed, onClick, disabled }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      style={{ ...styles.dotWrap, opacity: disabled ? 0.4 : 1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
      onClick={onClick}
      whileTap={!disabled ? { scale: 0.85 } : {}}
    >
      {/* Label */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            style={styles.label}
            initial={{ opacity: 0, x: 8  }}
            animate={{ opacity: 1, x: 0  }}
            exit={{    opacity: 0, x: 8  }}
            transition={{ duration: 0.18 }}
          >
            {label.toUpperCase()}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Dot */}
      <motion.div
        style={styles.dot}
        animate={{
          background:
            active  ? '#3b82f6' :
            passed  ? 'rgba(59,130,246,0.38)' :
                      'rgba(255,255,255,0.1)',
          scale:     active ? 1.6 : hovered ? 1.25 : 1,
          boxShadow: active
            ? '0 0 10px rgba(59,130,246,0.95), 0 0 22px rgba(59,130,246,0.35)'
            : 'none',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

const styles = {
  root: {
    position: 'fixed',
    right: 28, top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 20, pointerEvents: 'auto',
    display: 'flex', flexDirection: 'column',
    alignItems: 'flex-end', gap: 20,
    fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif",
  },
  dotWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
    cursor: 'pointer',
  },
  label: {
    fontSize: 8, letterSpacing: '0.3em',
    color: 'rgba(147,197,253,0.72)',
    whiteSpace: 'nowrap', userSelect: 'none',
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
  },
}
