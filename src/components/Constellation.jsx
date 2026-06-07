import { motion } from 'framer-motion'
import { useGame } from '../store/useGame'
import { ACHIEVEMENTS } from '../lib/constants'

// Position achievements on a star map
const POSITIONS = {
  first_step:  { x: 50,  y: 70 },
  streak_3:    { x: 110, y: 50 },
  streak_7:    { x: 180, y: 80 },
  streak_30:   { x: 270, y: 60 },
  streak_100:  { x: 360, y: 100 },
  level_5:     { x: 80,  y: 130 },
  level_10:    { x: 160, y: 150 },
  level_25:    { x: 280, y: 170 },
  boss_1:      { x: 360, y: 200 },
  combo_5:     { x: 50,  y: 200 },
  mood_7:      { x: 130, y: 220 },
  all_biomes:  { x: 240, y: 240 },
  pet_hatch:   { x: 320, y: 270 },
  fusion_1:    { x: 100, y: 280 },
  perfect_day: { x: 200, y: 300 },
  gems_500:    { x: 300, y: 320 },
}

// Connections between achievements that form constellations
const LINKS = [
  ['first_step', 'streak_3'],
  ['streak_3', 'streak_7'],
  ['streak_7', 'streak_30'],
  ['streak_30', 'streak_100'],
  ['first_step', 'level_5'],
  ['level_5', 'level_10'],
  ['level_10', 'level_25'],
  ['level_25', 'boss_1'],
  ['first_step', 'combo_5'],
  ['combo_5', 'mood_7'],
  ['mood_7', 'all_biomes'],
  ['all_biomes', 'pet_hatch'],
  ['pet_hatch', 'fusion_1'],
  ['fusion_1', 'perfect_day'],
  ['perfect_day', 'gems_500'],
]

export const Constellation = () => {
  const unlocked = useGame((s) => s.achievements)

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="label text-neon-violet">Constellation</div>
          <h3 className="h-display text-lg text-white">Achievement Sky</h3>
        </div>
        <div className="text-xs text-slate-400">{Object.keys(unlocked).length} / {ACHIEVEMENTS.length} stars</div>
      </div>

      <div className="relative w-full" style={{ aspectRatio: '4/3.6' }}>
        <svg viewBox="0 0 400 360" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a78bfa" stopOpacity="0.4" />
              <stop offset="1" stopColor="#5eead4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* background stars */}
          {Array.from({length: 60}).map((_,i) => (
            <motion.circle key={i}
              cx={(i*71)%400} cy={(i*113)%360} r="0.6" fill="white"
              initial={{ opacity: 0.2 }} animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 3, delay: (i%10)*0.2, repeat: Infinity }} />
          ))}

          {/* lines */}
          {LINKS.map(([a, b], i) => {
            const ua = !!unlocked[a], ub = !!unlocked[b]
            if (!ua || !ub) return null
            const A = POSITIONS[a], B = POSITIONS[b]
            return (
              <motion.line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="url(#lineGrad)" strokeWidth="1.2"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            )
          })}

          {/* nodes */}
          {ACHIEVEMENTS.map((a) => {
            const p = POSITIONS[a.id]
            const got = !!unlocked[a.id]
            return (
              <g key={a.id} transform={`translate(${p.x}, ${p.y})`}>
                {got && (
                  <motion.circle r="14" fill="#a78bfa" opacity="0.2"
                    initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ duration: 1 }}
                  />
                )}
                <circle r={got ? 6 : 4} fill={got ? '#a78bfa' : '#1e293b'} stroke={got ? '#5eead4' : '#334155'} strokeWidth="1" />
                <text y="-10" textAnchor="middle" fontSize="9" fill={got ? 'white' : '#475569'}>{a.icon}</text>
                <title>{a.name} — {a.desc}</title>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
