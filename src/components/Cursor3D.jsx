import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Cursor3D — A floating 3D-looking object that follows the cursor with parallax.
 * Pure SVG + transform math (no Three.js needed for this scale).
 *
 * Props:
 *   size: pixel size of the object
 *   accent: base color
 *   intensity: how aggressively it follows the cursor (0..1)
 *   children: optional inner content (defaults to a low-poly island)
 */
export const Cursor3D = ({ size = 220, accent = '#5eead4', intensity = 1, className = '', children }) => {
  const wrapRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 80, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 80, damping: 18, mass: 0.4 })
  const rotX = useTransform(sy, [-1, 1], [12 * intensity, -12 * intensity])
  const rotY = useTransform(sx, [-1, 1], [-12 * intensity, 12 * intensity])
  const tx = useTransform(sx, [-1, 1], [-18 * intensity, 18 * intensity])
  const ty = useTransform(sy, [-1, 1], [-12 * intensity, 12 * intensity])

  useEffect(() => {
    const onMove = (e) => {
      const el = wrapRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = (e.clientX - cx) / (window.innerWidth / 2)
      const dy = (e.clientY - cy) / (window.innerHeight / 2)
      x.set(Math.max(-1, Math.min(1, dx)))
      y.set(Math.max(-1, Math.min(1, dy)))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', (e) => onMove(e.touches[0]), { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <div ref={wrapRef} className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* glow halo */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, ${accent}55, transparent 60%)`,
          x: tx, y: ty,
        }}
      />
      {/* the 3D card */}
      <motion.div
        className="absolute inset-0"
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', x: tx, y: ty }}
      >
        <div className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {children || <LowPolyIsland accent={accent} />}
        </div>
      </motion.div>
    </div>
  )
}

/**
 * A faux-3D low-poly island with stacked translucent layers.
 * Not real 3D, but the layered transforms give the illusion.
 */
export const LowPolyIsland = ({ accent = '#5eead4' }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.4))' }}>
    <defs>
      <linearGradient id="islandBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e293b" />
        <stop offset="1" stopColor="#0b0d14" />
      </linearGradient>
      <linearGradient id="islandTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={accent} stopOpacity="0.8" />
        <stop offset="1" stopColor={accent} stopOpacity="0.2" />
      </linearGradient>
      <radialGradient id="islandGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={accent} stopOpacity="0.4" />
        <stop offset="1" stopColor={accent} stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* glow under the island */}
    <ellipse cx="100" cy="160" rx="80" ry="14" fill="url(#islandGlow)" />

    {/* bottom shadow layer (deepest) */}
    <path d="M 30 130 Q 100 110 170 130 L 160 165 Q 100 175 40 165 Z" fill="#07080d" transform="translate(0, 8)" opacity="0.6" />

    {/* base layer */}
    <path d="M 30 130 Q 100 110 170 130 L 160 165 Q 100 175 40 165 Z" fill="url(#islandBase)" stroke="#334155" strokeWidth="0.5" />

    {/* mid layer */}
    <path d="M 45 115 Q 100 100 155 115 L 150 138 Q 100 148 50 138 Z" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />

    {/* top grass/crystal layer */}
    <path d="M 60 100 Q 100 88 140 100 L 135 122 Q 100 132 65 122 Z" fill="url(#islandTop)" />

    {/* crystal spire */}
    <g transform="translate(100, 70)">
      <polygon points="0,0 -10,30 0,25 10,30" fill={accent} opacity="0.95" />
      <polygon points="0,0 -10,30 0,50" fill={accent} opacity="0.7" />
      <polygon points="0,0 10,30 0,50" fill={accent} opacity="0.5" />
      <line x1="0" y1="0" x2="0" y2="50" stroke="white" strokeOpacity="0.6" strokeWidth="0.5" />
    </g>

    {/* sparkle ring */}
    <g>
      <circle cx="60" cy="105" r="1.2" fill="white" opacity="0.8" />
      <circle cx="140" cy="108" r="1" fill="white" opacity="0.6" />
      <circle cx="80" cy="118" r="0.8" fill="white" opacity="0.5" />
      <circle cx="120" cy="120" r="0.8" fill="white" opacity="0.5" />
    </g>
  </svg>
)

/**
 * ParticleField — a faint ambient particle layer that drifts on the cursor.
 */
export const ParticleField = ({ count = 30, color = '#5eead4' }) => {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: 0.4 + Math.random() * 1.2,
      d: 3 + Math.random() * 6,
      delay: Math.random() * 3,
    }))
  )
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 20 })
  const sy = useSpring(my, { stiffness: 40, damping: 20 })

  useEffect(() => {
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 30)
      my.set((e.clientY / window.innerHeight - 0.5) * 30)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ x: sx, y: sy }}>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.r,
            height: p.r,
            background: color,
            boxShadow: `0 0 ${p.r * 4}px ${color}`,
            opacity: 0.6,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -p.d, 0] }}
          transition={{ duration: 3 + p.d, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  )
}
