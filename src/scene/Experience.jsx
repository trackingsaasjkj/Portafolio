import React, { Suspense } from 'react'
import CinematicCamera from './CinematicCamera'
import Lights          from './Lights'
import Environment     from './Environment'
import Particles       from './Particles'
import FloatingGrid    from './FloatingGrid'
import FloatingObjects from './FloatingObjects'
import IntroPanel      from './IntroPanel'
import AboutPanel      from './AboutPanel'
import ProjectPanel    from './ProjectPanel'
import SkillsPanel     from './SkillsPanel'
import TimelinePanel   from './TimelinePanel'
import ContactPanel    from './ContactPanel'
import PostProcessing  from './PostProcessing'
import { PROJECTS }    from './worldConfig'

/**
 * Experience — scene director (final)
 *
 * Render order:
 *  Camera → Environment → Lights → Particles → Grid → FloatingObjects
 *  → Content panels → IntroPanel → PostProcessing (bloom / vignette)
 */
export default function Experience() {
  return (
    <>
      <CinematicCamera />
      <Environment />
      <Lights />
      <Particles count={260} radius={18} />
      <FloatingGrid />
      <FloatingObjects />

      {/* ── Section panels ── */}
      <AboutPanel />
      {PROJECTS.map((p) => <ProjectPanel key={p.id} project={p} />)}
      <SkillsPanel />
      <TimelinePanel />
      <ContactPanel />

      {/* ── Intro (fades on Enter) ── */}
      <IntroPanel />

      {/* ── Screen-space effects — last so they composite over everything ── */}
      <PostProcessing />
    </>
  )
}
