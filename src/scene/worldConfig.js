import * as THREE from 'three'

// ─── Waypoints ──────────────────────────────────────────────
export const WAYPOINTS = [
  { id: 'origin',   label: 'Home',     position: new THREE.Vector3(0,  0.4,  6.5), target: new THREE.Vector3(0,   0,    0),   duration: 0,   pauseDuration: 0   },
  { id: 'about',    label: 'About',    position: new THREE.Vector3(-7, 1.0, -2),   target: new THREE.Vector3(-6,  0.5, -5),   duration: 4.2, pauseDuration: 3.0 },
  { id: 'projects', label: 'Projects', position: new THREE.Vector3(0,  0.6, -10),  target: new THREE.Vector3(0,   0,   -14),  duration: 3.8, pauseDuration: 4.0 },
  { id: 'skills',   label: 'Skills',   position: new THREE.Vector3(7,  1.2, -16),  target: new THREE.Vector3(6,   0.5, -20),  duration: 3.6, pauseDuration: 3.0 },
  { id: 'timeline', label: 'Timeline', position: new THREE.Vector3(2,  2.0, -24),  target: new THREE.Vector3(0,   0.5, -28),  duration: 4.0, pauseDuration: 3.5 },
  { id: 'contact',  label: 'Contact',  position: new THREE.Vector3(-4, 0.8, -32),  target: new THREE.Vector3(0,   0,   -34),  duration: 3.4, pauseDuration: 0   },
]

// ─── Section anchor slots (world positions for each panel) ──
export const SECTION_SLOTS = [
  { id: 'about',    position: new THREE.Vector3(-6,  0.5, -5),   rotationY:  0.4 },
  { id: 'projects', position: new THREE.Vector3(0,   0,   -14),  rotationY:  0   },
  { id: 'skills',   position: new THREE.Vector3(6,   0.5, -20),  rotationY: -0.4 },
  { id: 'timeline', position: new THREE.Vector3(0,   0.5, -28),  rotationY:  0.1 },
  { id: 'contact',  position: new THREE.Vector3(0,   0,   -34),  rotationY:  0   },
]

// ─── Projects ───────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 'taskflow', title: 'TaskFlow Dashboard',
    description: 'Real-time productivity platform with drag-and-drop boards, team collaboration and analytics.',
    tags: ['.NET', 'React', 'SQL', 'Figma'],
    link: '#',
    position: new THREE.Vector3(-2.6, 0, -14), rotationY: 0.18,
  },
  {
    id: 'financex', title: 'FinanceX App',
    description: 'Personal finance tracker with AI-driven insights, budget planning and beautiful data viz.',
    tags: ['Figma', 'C#', 'SQLite'],
    link: '#',
    position: new THREE.Vector3(2.6, 0, -14), rotationY: -0.18,
  },
  {
    id: 'inventorypro', title: 'Inventory Pro',
    description: 'Enterprise inventory system with barcode scanning, automated alerts and comprehensive reporting.',
    tags: ['C#', '.NET', 'SQL Server', 'WPF'],
    link: '#',
    position: new THREE.Vector3(0, 0, -17.5), rotationY: 0,
  },
]

// ─── Skills data — JK² Software Solutions Technology Stack ─────────────────────────────────────────────
export const SKILLS = [
  { category: 'Backend',     icon: '◈', items: [{ name: '.NET Core', pct: 95 }, { name: 'Node.js', pct: 90 }, { name: 'Python', pct: 88 }, { name: 'Java', pct: 85 }] },
  { category: 'Frontend',    icon: '✦', items: [{ name: 'React', pct: 92 }, { name: 'Angular', pct: 88 }, { name: 'Vue.js', pct: 85 }, { name: 'TypeScript', pct: 93 }] },
  { category: 'Cloud & DevOps', icon: '⬡', items: [{ name: 'Azure', pct: 90 }, { name: 'AWS', pct: 87 }, { name: 'Docker', pct: 92 }, { name: 'Kubernetes', pct: 85 }] },
]

// ─── Timeline entries — JK² Software Solutions Corporate History ────────────────────────────────────
export const TIMELINE = [
  { year: '2014', badge: 'Founded', color: '#49C4FF', title: 'Company Established', body: 'JK² Software Solutions founded with a vision to deliver enterprise-grade software that transforms businesses through innovation and technology.' },
  { year: '2016', badge: 'Growth',  color: '#49C4FF', title: 'Team Expansion', body: 'Scaled to 15+ developers and opened regional offices. Launched our flagship ERP platform serving 20+ enterprise clients.' },
  { year: '2019', badge: 'Innovation', color: '#49C4FF', title: 'AI Integration', body: 'Pioneered AI-powered business intelligence tools and predictive analytics. Received industry recognition for innovation in enterprise software.' },
  { year: '2022', badge: 'Scale',  color: '#49C4FF', title: 'International Reach', body: 'Expanded operations globally with 35+ team members. Successfully delivered 200+ projects across healthcare, finance, and logistics sectors.' },
  { year: '2024', badge: 'Now',    color: '#49C4FF', title: 'Leading Innovation', body: 'Continuing to push boundaries in cloud-native solutions, AI/ML integration, and enterprise digital transformation. Building the future of software.' },
]

// ─── Splines ─────────────────────────────────────────────────
export const CAMERA_PATH = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => w.position.clone()), false, 'catmullrom', 0.5)
export const TARGET_PATH = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => w.target.clone()),   false, 'catmullrom', 0.5)
export const TOTAL_FLIGHT_DURATION   = WAYPOINTS.reduce((a, w) => a + w.duration, 0)
export const PROJECTS_WAYPOINT_IDX   = WAYPOINTS.findIndex((w) => w.id === 'projects')
