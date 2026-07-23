import { motion, AnimatePresence } from 'framer-motion'
import { useStore }                from '../store/useStore'
import { PROJECTS }                from '../data/projects'

export default function HUD() {
  const phase         = useStore((s) => s.phase)
  const activeProject = useStore((s) => s.activeProject)
  const hovered       = useStore((s) => s.hoveredProject)

  const project = PROJECTS.find((p) => p.id === activeProject) ?? PROJECTS[0]
  const index   = PROJECTS.findIndex((p) => p.id === activeProject)

  if (phase !== 'explore') return null

  return (
    <motion.div
      style={s.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* ── KM badge top-left ── */}
      <div style={s.badge}>
        <span style={s.dot} />
        KM
      </div>

      {/* ── Project counter top-right ── */}
      <div style={s.counter}>
        <span style={{ ...s.counterNum, color: project.color }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={s.counterSep}>/</span>
        <span style={s.counterTotal}>{String(PROJECTS.length).padStart(2, '0')}</span>
      </div>

      {/* ── Vertical progress dots right-center ── */}
      <div style={s.dots}>
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.id}
            style={s.dot2}
            animate={{
              background:  i === index ? p.color : 'rgba(255,255,255,0.12)',
              scale:       i === index ? 1.6 : 1,
              boxShadow:   i === index ? `0 0 10px ${p.color}` : 'none',
            }}
            transition={{ duration: 0.35 }}
          />
        ))}
      </div>

      {/* ── Project label bottom-center ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          style={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1,  y: 0  }}
          exit={{    opacity: 0,  y: -8 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        >
          <span style={{ ...s.labelCat, color: project.color }}>
            {project.category.toUpperCase()}
          </span>
          <p style={s.labelTitle}>{project.title}</p>
          <div style={s.labelTags}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{ ...s.tag, borderColor: project.color + '55', color: project.color }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Scroll hint bottom ── */}
      <motion.p
        style={s.hint}
        animate={{ opacity: [0.18, 0.5, 0.18] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        SCROLL  OR  DRAG  TO  NAVIGATE
      </motion.p>
    </motion.div>
  )
}

const s = {
  root: {
    position: 'fixed', inset: 0, zIndex: 20,
    pointerEvents: 'none',
    display: 'grid',
    gridTemplate: `
      "badge  .      counter" auto
      ".      .      dots   " 1fr
      ".      label  .      " auto
      ".      hint   .      " auto
    `,
    gridTemplateColumns: 'auto 1fr auto',
    padding: '28px 30px 22px',
    gap: 0,
    fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif",
  },
  badge: {
    gridArea: 'badge',
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 13, fontWeight: 700, letterSpacing: '0.22em',
    color: 'rgba(59,130,246,0.92)',
    border: '1px solid rgba(59,130,246,0.22)',
    padding: '6px 16px', borderRadius: 40,
    background: 'rgba(2,6,16,0.7)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    alignSelf: 'start',
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#3b82f6',
    boxShadow: '0 0 8px rgba(59,130,246,0.9)',
    display: 'inline-block', flexShrink: 0,
  },
  counter: {
    gridArea: 'counter',
    display: 'flex', alignItems: 'baseline', gap: 4,
    alignSelf: 'start',
    background: 'rgba(2,6,16,0.6)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    padding: '6px 14px', borderRadius: 30,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  counterNum:   { fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' },
  counterSep:   { fontSize: 11, color: 'rgba(255,255,255,0.2)' },
  counterTotal: { fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' },
  dots: {
    gridArea: 'dots',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 14, alignSelf: 'center',
  },
  dot2: {
    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
  },
  label: {
    gridArea: 'label',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    justifySelf: 'center',
    padding: '14px 28px',
    background: 'rgba(2,6,16,0.72)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    marginBottom: 10,
  },
  labelCat: {
    fontSize: 8, letterSpacing: '0.42em',
  },
  labelTitle: {
    fontSize: 17, fontWeight: 600, color: '#e8f4ff',
    margin: 0, letterSpacing: '0.03em',
  },
  labelTags: {
    display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center',
  },
  tag: {
    fontSize: 8, letterSpacing: '0.1em',
    border: '1px solid',
    padding: '2px 9px', borderRadius: 20,
    background: 'rgba(59,130,246,0.07)',
  },
  hint: {
    gridArea: 'hint',
    justifySelf: 'center',
    fontSize: 8, letterSpacing: '0.42em',
    color: 'rgba(147,197,253,0.28)',
    marginBottom: 2,
  },
}
