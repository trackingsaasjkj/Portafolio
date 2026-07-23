import { create } from 'zustand'

/**
 * usePortfolioStore
 *
 * phase:
 *  'intro'    — fly-in, intro panel visible
 *  'flying'   — drone flight through all waypoints
 *  'paused'   — camera stopped at a waypoint to showcase content
 *  'main'     — flight complete, idle drift at last waypoint
 *
 * activeWaypoint — current waypoint index
 * isFlying       — true while GSAP tween is running
 * focusedProject — id of the project being showcased, or null
 */
export const usePortfolioStore = create((set) => ({
  phase:           'intro',
  activeWaypoint:  0,
  isFlying:        false,
  focusedProject:  null,

  setPhase:          (phase)          => set({ phase }),
  setActiveWaypoint: (activeWaypoint) => set({ activeWaypoint }),
  setIsFlying:       (isFlying)       => set({ isFlying }),
  setFocusedProject: (focusedProject) => set({ focusedProject }),
}))
