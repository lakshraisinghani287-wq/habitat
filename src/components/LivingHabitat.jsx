import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useGame } from '../store/useGame'
import { Icon } from './Icon'

// Scale: 0..500 biome XP => 0..1 growth
const growth = (xp) => Math.max(0, Math.min(1, xp / 600))

// A simple 24-hour cycle moon
const Moon = ({ size = 14 }) => (
  <circle r={size} fill="#e2e8f0" opacity="0.85" />
)

// Stars that twinkle
const Stars = ({ count = 30 }) => (
  <g>
    {Array.from({ length: count }).map((_, i) => {
      const x = (i * 37) % 400
      const y = (i * 53) % 140
      const r = 0.6 + ((i * 7) % 3) * 0.3
      return <motion.circle key={i} cx={x} cy={y} r={r} fill="white" initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2 + (i % 5) * 0.3, repeat: Infinity, delay: i * 0.05 }} />
    })}
  </g>
)

// Mountain biome: peaks rise with mountain XP
const Mountains = ({ value }) => {
  const h = 20 + value * 60
  return (
    <g>
      <path d={`M 0 200 L 60 ${200 - h * 0.6} L 120 ${200 - h} L 180 ${200 - h * 0.7} L 240 ${200 - h * 0.9} L 320 ${200 - h * 0.5} L 400 200 Z`} fill="#1e293b" />
      <path d={`M 0 200 L 80 ${200 - h * 0.4} L 160 ${200 - h * 0.7} L 220 ${200 - h * 0.5} L 300 ${200 - h * 0.8} L 400 200 Z`} fill="#0f172a" />
      {/* snow caps when very grown */}
      {value > 0.6 && (
        <g fill="#e2e8f0" opacity="0.8">
          <path d={`M ${110} ${200 - h + 4} l 10 -8 l 10 8 z`} />
          <path d={`M ${230} ${200 - h * 0.9 + 4} l 8 -6 l 8 6 z`} />
        </g>
      )}
    </g>
  )
}

// Forest biome
const Forest = ({ value }) => {
  const trees = 8
  return (
    <g>
      {Array.from({ length: trees }).map((_, i) => {
        const x = 20 + i * 45 + (i % 2) * 10
        const baseY = 195
        const th = 12 + value * (i % 3 === 0 ? 30 : 20)
        const grow = 0.4 + value * 0.6
        return (
          <g key={i} transform={`translate(${x}, ${baseY}) scale(${grow})`}>
            <rect x="-2" y={-th * 0.4} width="4" height={th * 0.4} fill="#3f2a1a" />
            <circle cx="0" cy={-th * 0.55} r={th * 0.45} fill="#14532d" />
            <circle cx={-th * 0.2} cy={-th * 0.7} r={th * 0.3} fill="#166534" />
            <circle cx={th * 0.2} cy={-th * 0.7} r={th * 0.3} fill="#166534" />
            {/* glow on high growth */}
            {value > 0.5 && <circle cx="0" cy={-th * 0.55} r={th * 0.45} fill="#5eead4" opacity="0.08" />}
          </g>
        )
      })}
    </g>
  )
}

// Ocean biome: waves
const Ocean = ({ value }) => {
  const amp = 2 + value * 6
  return (
    <g>
      <path d={`M 0 210 Q 50 ${210 - amp} 100 210 T 200 210 T 300 210 T 400 210 L 400 260 L 0 260 Z`} fill="#0c4a6e" />
      <path d={`M 0 220 Q 50 ${220 - amp * 0.7} 100 220 T 200 220 T 300 220 T 400 220 L 400 260 L 0 260 Z`} fill="#075985" />
      {/* fish */}
      {value > 0.3 && (
        <g>
          <motion.g animate={{ x: [0, 360, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
            <path d="M 30 235 q 4 -4 8 0 q -4 4 -8 0 z" fill="#22d3ee" />
            <path d="M 38 235 l 4 -3 l 0 6 z" fill="#22d3ee" />
          </motion.g>
          {value > 0.6 && (
            <motion.g animate={{ x: [400, 0, 400] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
              <path d="M 360 240 q 4 -4 8 0 q -4 4 -8 0 z" fill="#a78bfa" />
              <path d="M 368 240 l 4 -3 l 0 6 z" fill="#a78bfa" />
            </motion.g>
          )}
        </g>
      )}
    </g>
  )
}

// Meadow (social + growth)
const Meadow = ({ value }) => {
  const blades = 30
  return (
    <g>
      {Array.from({ length: blades }).map((_, i) => {
        const x = (i * 13.3) % 400
        const h = 6 + ((i * 17) % 5) + value * 12
        const c = i % 3 === 0 ? '#bef264' : i % 3 === 1 ? '#a3e635' : '#86efac'
        return <rect key={i} x={x} y={200 - h} width="1.4" height={h} fill={c} opacity="0.9" />
      })}
      {/* flowers */}
      {value > 0.4 && Array.from({ length: 5 }).map((_, i) => {
        const x = 30 + i * 80
        return (
          <g key={`f${i}`} transform={`translate(${x}, ${190 - value * 10})`}>
            <circle r="2" fill="#f472b6" />
            <circle r="0.8" fill="#fbbf24" />
          </g>
        )
      })}
    </g>
  )
}

// Desert (craft)
const Desert = ({ value }) => {
  const dunes = 3
  return (
    <g>
      {Array.from({ length: dunes }).map((_, i) => (
        <path key={i} d={`M ${i * 130} 195 q 65 ${-20 - value * 15} 130 0 L ${i * 130 + 130} 210 L ${i * 130} 210 Z`} fill="#3a2a17" />
      ))}
      {/* cactus */}
      {value > 0.3 && (
        <g transform="translate(80, 175)">
          <rect x="-3" y="0" width="6" height="20" fill="#365314" />
          <rect x="-8" y="5" width="3" height="8" fill="#365314" />
          <rect x="5" y="3" width="3" height="10" fill="#365314" />
        </g>
      )}
      {value > 0.6 && (
        <g transform="translate(310, 170)">
          <rect x="-3" y="0" width="6" height="25" fill="#4d7c0f" />
          <rect x="-8" y="6" width="3" height="8" fill="#4d7c0f" />
          <rect x="5" y="4" width="3" height="12" fill="#4d7c0f" />
        </g>
      )}
    </g>
  )
}

// A small traveler character on the ground
const Traveler = ({ x }) => (
  <g transform={`translate(${x}, 188)`}>
    <circle cx="0" cy="-7" r="3" fill="#fbbf24" />
    <rect x="-2" y="-4" width="4" height="6" fill="#22d3ee" rx="1" />
    <rect x="-2" y="2" width="1.5" height="4" fill="#0b0d14" />
    <rect x="0.5" y="2" width="1.5" height="4" fill="#0b0d14" />
  </g>
)

export const LivingHabitat = ({ height = 260 }) => {
  const biomeXP = useGame((s) => s.biomeXP)
  const pet = useGame((s) => s.pet)
  const mood = useGame((s) => s.mood?.[new Date().toISOString().slice(0,10)])
  const season = useGame((s) => s.season)

  const f = useMemo(() => ({
    forest: growth(biomeXP.forest || 0),
    mountain: growth(biomeXP.mountain || 0),
    ocean: growth(biomeXP.ocean || 0),
    desert: growth(biomeXP.desert || 0),
    meadow: growth(biomeXP.meadow || 0),
  }), [biomeXP])

  // weather from mood
  const weather = mood >= 4 ? 'sun' : mood === 3 ? 'cloud' : mood && mood <= 2 ? 'rain' : 'cloud'

  const seasonTint = {
    spring: 'rgba(163,230,53,0.10)',
    summer: 'rgba(251,191,36,0.10)',
    autumn: 'rgba(244,114,182,0.10)',
    winter: 'rgba(34,211,238,0.10)',
  }[season] || 'transparent'

  return (
    <div className="card p-0 overflow-hidden relative" style={{ height }}>
      <div className="absolute top-3 left-3 z-10 chip">
        <Icon name="leaf" className="w-3.5 h-3.5 text-neon-mint" /> Living Habitat
      </div>
      <div className="absolute top-3 right-3 z-10 chip capitalize">
        {season} · {weather}
      </div>
      <svg viewBox="0 0 400 260" className="w-full h-full block">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b0d14" />
            <stop offset="1" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1f2937" />
            <stop offset="1" stopColor="#0b0d14" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* sky */}
        <rect width="400" height="200" fill="url(#sky)" />
        <rect width="400" height="200" fill={seasonTint} />
        <Stars count={28} />

        {/* moon */}
        <g transform="translate(330, 50)">
          <circle r="32" fill="url(#moonGlow)" />
          <Moon size={14} />
        </g>

        {/* weather overlay */}
        {weather === 'cloud' && (
          <g opacity="0.7">
            <ellipse cx="80" cy="50" rx="22" ry="9" fill="#475569" />
            <ellipse cx="100" cy="46" rx="28" ry="11" fill="#64748b" />
            <ellipse cx="250" cy="70" rx="20" ry="8" fill="#475569" />
          </g>
        )}
        {weather === 'rain' && (
          <g>
            <ellipse cx="100" cy="45" rx="30" ry="11" fill="#334155" />
            {Array.from({length: 12}).map((_,i) => (
              <motion.line key={i}
                x1={50 + i * 28} y1={55} x2={45 + i * 28} y2={70}
                stroke="#22d3ee" strokeWidth="1"
                initial={{ y: 0, opacity: 0.7 }} animate={{ y: 80, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }} />
            ))}
          </g>
        )}
        {weather === 'sun' && (
          <g transform="translate(60,55)">
            <circle r="14" fill="#fbbf24" opacity="0.9" />
            {Array.from({length:8}).map((_,i) => (
              <line key={i} x1="0" y1="-20" x2="0" y2="-26" stroke="#fbbf24" strokeWidth="2"
                transform={`rotate(${(i/8)*360})`} opacity="0.8" />
            ))}
          </g>
        )}

        {/* ground */}
        <rect y="195" width="400" height="65" fill="url(#ground)" />

        {/* biomes — layered so they blend */}
        <Mountains value={f.mountain} />
        <Desert value={f.desert} />
        <Meadow value={f.meadow} />
        <Ocean value={f.ocean} />
        <Forest value={f.forest} />

        {/* traveler + pet */}
        <Traveler x={200} />
        {pet && (
          <motion.g
            transform="translate(212, 188)"
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <text x="0" y="0" fontSize="14" textAnchor="middle">{petEmoji(pet.id)}</text>
          </motion.g>
        )}

        {/* ground sparkles if overall grown */}
        {Object.values(f).some((v) => v > 0.5) && (
          <g>
            {Array.from({length: 12}).map((_,i) => (
              <motion.circle key={i}
                cx={(i*31)%400} cy={220 + ((i*7)%15)} r="1"
                fill="#5eead4"
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 2, delay: i*0.15, repeat: Infinity }} />
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}

const petEmoji = (id) => ({
  sprig: '🌱', ember: '🔥', tide: '🌊', phoenix: '🦜', wolf: '🐺', owl: '🦉',
}[id] || '🐣')
