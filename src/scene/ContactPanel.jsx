import { useRef }           from 'react'
import { useFrame }         from '@react-three/fiber'
import { Text, Html }       from '@react-three/drei'
import * as THREE           from 'three'
import GlassPanelBase       from './GlassPanelBase'
import { SECTION_SLOTS }    from './worldConfig'

const slot = SECTION_SLOTS.find((s) => s.id === 'contact')

/**
 * ContactPanel — JK² Software Solutions Contact
 * Corporate contact information and CTA
 */
export default function ContactPanel() {
  const pos = slot.position

  return (
    <GlassPanelBase
      width={5.0} height={3.4}
      position={[pos.x, pos.y, pos.z]}
      rotationY={slot.rotationY}
      floatPhase={3.0}
      floatAmp={0.1}
    >
      {/* Background orb */}
      <OrbGlow />

      {/* Section eyebrow */}
      <Text
        position={[0, 1.52, 0.05]}
        fontSize={0.08} color="#49C4FF"
        anchorX="center" letterSpacing={0.35}
      >
        05  ·  CONTACT
      </Text>

      <Text
        position={[0, 1.08, 0.05]}
        fontSize={0.09} color="rgba(255,255,255,0.6)"
        anchorX="center" letterSpacing={0.2}
      >
        LET'S CONNECT
      </Text>

      {/* Main headline */}
      <Text
        position={[0, 0.6, 0.05]}
        fontSize={0.28} color="#FFFFFF"
        anchorX="center" anchorY="middle"
        maxWidth={4.2} textAlign="center" lineHeight={1.3}
      >
        {"Ready to transform\nyour business?"}
      </Text>

      <Text
        position={[0, 0.05, 0.05]}
        fontSize={0.094} color="rgba(255,255,255,0.50)"
        anchorX="center" textAlign="center"
        maxWidth={3.4} lineHeight={1.55}
      >
        {'Partner with us to build scalable,\ninnovative software solutions.'}
      </Text>

      {/* Divider */}
      <mesh position={[0, -0.38, 0.05]}>
        <planeGeometry args={[4.2, 0.002]} />
        <meshBasicMaterial color="#49C4FF" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* ── Interactive buttons via Html ── */}
      <Html
        position={[0, -0.96, 0.08]}
        center
        distanceFactor={4}
        style={{ pointerEvents: 'auto' }}
      >
        <div style={htmlStyles.row}>
          <ContactLink href="mailto:info@jksoftware.com" icon="✉" label="Email Us" />
          <ContactLink href="https://linkedin.com/company/jk-software" icon="in" label="LinkedIn" target="_blank" />
          <ContactLink href="tel:+1234567890" icon="☎" label="Call Us" />
          <ContactLink href="/company-profile.pdf" icon="↓" label="Company Profile" download />
        </div>
      </Html>

    </GlassPanelBase>
  )
}

function ContactLink({ href, icon, label, target, download }) {
  return (
    <a
      href={href}
      target={target}
      download={download}
      style={htmlStyles.btn}
      onMouseEnter={(e) => {
        e.currentTarget.style.background    = 'rgba(73,196,255,0.2)'
        e.currentTarget.style.borderColor   = 'rgba(73,196,255,0.8)'
        e.currentTarget.style.boxShadow     = '0 0 18px rgba(73,196,255,0.5)'
        e.currentTarget.style.cursor        = 'pointer'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background  = 'rgba(11,31,91,0.75)'
        e.currentTarget.style.borderColor = 'rgba(73,196,255,0.3)'
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      <span style={htmlStyles.icon}>{icon}</span>
      <span style={htmlStyles.label}>{label.toUpperCase()}</span>
    </a>
  )
}

function OrbGlow() {
  const ref = useRef()
  useFrame(() => {
    // STABLE opacity - no flickering
    if (ref.current?.material) {
      ref.current.material.opacity = 0.06
    }
  })
  return (
    <mesh ref={ref} position={[0, 0.4, -0.01]}>
      <circleGeometry args={[2.0, 32]} />
      <meshBasicMaterial color="#49C4FF" transparent opacity={0.06} depthWrite={false} />
    </mesh>
  )
}

const htmlStyles = {
  row: {
    display: 'flex',
    gap: 8,
    fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif",
  },
  btn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
    padding: '10px 14px',
    minWidth: 72,
    background: 'rgba(11,31,91,0.75)',
    border: '1px solid rgba(73,196,255,0.3)',
    borderRadius: 8,
    textDecoration: 'none',
    transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  icon: {
    fontSize: 14,
    color: '#49C4FF',
  },
  label: {
    fontSize: 7,
    letterSpacing: '0.14em',
    color: 'rgba(255,255,255,0.8)',
    whiteSpace: 'nowrap',
  },
}
