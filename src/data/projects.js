export const PROJECTS = [
  {
    id: 'erp-system', title: 'Enterprise ERP Solution', category: 'Enterprise Software',
    description: 'Complete business management platform with inventory control, financial tracking, and real-time analytics for mid-size companies.',
    tags: ['C#', '.NET Core', 'SQL Server', 'Azure'], color: '#49C4FF', link: '#',
  },
  {
    id: 'mobile-banking', title: 'SecureBank Mobile', category: 'Mobile Application',
    description: 'Next-generation banking app with biometric authentication, instant transfers, and AI-powered financial insights.',
    tags: ['React Native', 'Node.js', 'PostgreSQL'], color: '#49C4FF', link: '#',
  },
  {
    id: 'healthcare-portal', title: 'MediConnect Portal', category: 'Healthcare Platform',
    description: 'HIPAA-compliant patient management system with telemedicine, appointment scheduling, and electronic health records.',
    tags: ['ASP.NET', 'Angular', 'SQL', 'Azure'], color: '#49C4FF', link: '#',
  },
  {
    id: 'logistics-ai', title: 'LogiTrack AI', category: 'AI & Logistics',
    description: 'Machine learning-powered logistics optimizer with route planning, fleet management, and predictive maintenance.',
    tags: ['Python', 'TensorFlow', 'React', 'AWS'], color: '#49C4FF', link: '#',
  },
  {
    id: 'retail-pos', title: 'SmartRetail POS', category: 'Retail Technology',
    description: 'Cloud-connected point-of-sale system with inventory sync, customer loyalty programs, and detailed sales analytics.',
    tags: ['C#', 'WPF', 'SQL Lite', 'REST API'], color: '#49C4FF', link: '#',
  },
  {
    id: 'workflow-automation', title: 'FlowSync Automation', category: 'Business Process',
    description: 'No-code workflow automation platform enabling businesses to streamline operations and integrate multiple systems.',
    tags: ['.NET', 'Vue.js', 'Redis', 'Docker'], color: '#49C4FF', link: '#',
  },
]

/**
 * COORDINATE SYSTEM — single source of truth
 *
 * Both camera and cards use the SAME angle formula:
 *
 *   cardAngle(i)   = i * ANGLE_STEP          (where card i sits on the cylinder)
 *   cameraAngle(t) = t * ANGLE_STEP + PI      (camera is OPPOSITE the card, outside)
 *
 * Card position:   x = sin(cardAngle) * CARD_RADIUS,  z = cos(cardAngle) * CARD_RADIUS
 * Camera position: x = sin(camAngle)  * CAM_RADIUS,   z = cos(camAngle)  * CAM_RADIUS
 *
 * Card rotationY:  cardAngle + PI  → makes the card FACE OUTWARD (toward camera)
 *
 * This guarantees: when t == i, the camera is directly in front of card i.
 */
export const CARD_RADIUS  = 6.0      // cards sit at this distance from center
export const CAM_RADIUS   = 10.0     // camera orbits at this distance
export const ANGLE_STEP   = (2 * Math.PI) / PROJECTS.length   // even angular spacing
export const VERT_STEP    = 3.8      // vertical gap between cards (world units)
export const N            = PROJECTS.length - 1

/** Y position of card at index i (top card = highest Y) */
export function cardY(i) {
  return (N - i) * VERT_STEP - (N * VERT_STEP) / 2
}

/** Full world position + facing for card at index i */
export function getCardTransform(i) {
  const a = i * ANGLE_STEP
  return {
    x:         Math.sin(a) * CARD_RADIUS,
    y:         cardY(i),
    z:         Math.cos(a) * CARD_RADIUS,
    rotationY: a,   // face outward toward camera (same side)
  }
}

/** Camera world position when focused on card at index t (can be fractional) */
export function getCameraPosition(t) {
  const a   = t * ANGLE_STEP
  const y0  = cardY(0), yN = cardY(N)
  const y   = N > 0 ? y0 + (yN - y0) * (t / N) : y0

  // Camera is on the SAME side of the cylinder as the card
  const camX = Math.sin(a) * CAM_RADIUS
  const camZ = Math.cos(a) * CAM_RADIUS

  // lookAt points directly at the card position (not the cylinder center)
  const lookX = Math.sin(a) * CARD_RADIUS
  const lookZ = Math.cos(a) * CARD_RADIUS

  return {
    x: camX,
    y,
    z: camZ,
    lookX,
    lookY: y,
    lookZ,
  }
}

// Keep for backward compat
export const HELIX_CONFIG = {
  radius: CARD_RADIUS, angleStep: ANGLE_STEP * (180 / Math.PI),
  verticalStep: VERT_STEP, totalHeight: N * VERT_STEP + 4,
  tiltRange: 2.5,
}
export function getHelixPosition(i) {
  const t = getCardTransform(i)
  return { x: t.x, y: t.y, z: t.z, rotationY: t.rotationY, angleDeg: i * (360 / PROJECTS.length) }
}
