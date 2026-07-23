import { create } from 'zustand'

/**
 * useStore — global state for the helix portfolio
 *
 * phase:
 *   'intro'   — loading/entrance animation
 *   'explore' — helix is rotating, user can interact
 *
 * hoveredProject — id of the project card the cursor is over
 * activeProject  — id of the card closest to camera (for HUD label)
 * helixPaused    — true when user hovers a card (slows rotation)
 */
export const useStore = create((set) => ({
  phase:          'intro',
  hoveredProject: null,
  activeProject:  null,
  helixPaused:    false,

  setPhase:          (phase)          => set({ phase }),
  setHoveredProject: (hoveredProject) => set({ hoveredProject }),
  setActiveProject:  (activeProject)  => set({ activeProject }),
  setHelixPaused:    (helixPaused)    => set({ helixPaused }),
}))
