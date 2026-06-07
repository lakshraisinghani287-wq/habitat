// SVG previews for shop items. Each preview is a small animated square.
import { motion } from 'framer-motion'

const Frame = ({ children, ring }) => (
  <div className="relative w-14 h-14 grid place-items-center text-2xl">
    {ring}
    <span className="relative z-10">👤</span>
  </div>
)

const Void = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <defs>
      <radialGradient id="voidBg" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#0b0d14" />
        <stop offset="1" stopColor="#000" />
      </radialGradient>
    </defs>
    <rect width="56" height="56" rx="10" fill="url(#voidBg)" />
    <circle cx="28" cy="28" r="14" fill="none" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="2 3" />
    <motion.circle cx="28" cy="28" r="8" fill="none" stroke="#5eead4" strokeWidth="1"
      animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '28px 28px' }}
    />
    <circle cx="28" cy="28" r="2" fill="#5eead4" />
  </svg>
)

const Aurora = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <defs>
      <linearGradient id="auroraBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b0d14" />
        <stop offset="1" stopColor="#1e1b4b" />
      </linearGradient>
    </defs>
    <rect width="56" height="56" rx="10" fill="url(#auroraBg)" />
    <motion.path d="M 0 28 Q 14 8 28 28 T 56 28 L 56 56 L 0 56 Z" fill="#5eead4" opacity="0.35"
      animate={{ y: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.path d="M 0 32 Q 14 16 28 32 T 56 32 L 56 56 L 0 56 Z" fill="#a78bfa" opacity="0.35"
      animate={{ y: [2, -2, 2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
    <circle cx="44" cy="12" r="1.5" fill="#fbbf24" />
  </svg>
)

const Ember = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <defs>
      <linearGradient id="emberBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1c1917" />
        <stop offset="1" stopColor="#7c2d12" />
      </linearGradient>
    </defs>
    <rect width="56" height="56" rx="10" fill="url(#emberBg)" />
    <motion.path d="M 28 10 Q 20 22 26 32 Q 14 30 18 42 L 38 42 Q 42 30 30 32 Q 36 22 28 10 Z"
      fill="#fb7185" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
      style={{ transformOrigin: '28px 42px' }} />
    <path d="M 28 18 Q 24 26 28 32 Q 32 26 28 18 Z" fill="#fbbf24" />
  </svg>
)

const Zen = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <defs>
      <linearGradient id="zenBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b0d14" />
        <stop offset="1" stopColor="#14532d" />
      </linearGradient>
    </defs>
    <rect width="56" height="56" rx="10" fill="url(#zenBg)" />
    <motion.circle cx="28" cy="20" r="1.2" fill="#a3e635" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
    <g stroke="#86efac" strokeWidth="1" opacity="0.6">
      <path d="M 22 38 Q 28 32 34 38" fill="none" />
      <path d="M 18 42 Q 28 34 38 42" fill="none" />
      <path d="M 14 46 Q 28 36 42 46" fill="none" />
    </g>
    <circle cx="28" cy="12" r="2" fill="#f472b6" />
  </svg>
)

const FrameGold = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <defs>
      <linearGradient id="goldR" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fbbf24" />
        <stop offset="0.5" stopColor="#fde68a" />
        <stop offset="1" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <circle cx="28" cy="28" r="20" fill="none" stroke="url(#goldR)" strokeWidth="3" />
    <circle cx="28" cy="28" r="14" fill="#1e293b" />
    <text x="28" y="34" textAnchor="middle" fontSize="14">👤</text>
  </svg>
)

const FrameNeon = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <motion.circle cx="28" cy="28" r="20" fill="none" stroke="#a78bfa" strokeWidth="2"
      animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }} />
    <motion.circle cx="28" cy="28" r="16" fill="none" stroke="#22d3ee" strokeWidth="1"
      animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
    <circle cx="28" cy="28" r="12" fill="#0b0d14" />
    <text x="28" y="33" textAnchor="middle" fontSize="13">👤</text>
  </svg>
)

const FrameRunic = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <circle cx="28" cy="28" r="20" fill="none" stroke="#fb7185" strokeWidth="1.5" />
    <g stroke="#5eead4" strokeWidth="0.6" fill="none">
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '28px 28px' }}>
        <path d="M 28 8 L 30 14 L 28 20 L 26 14 Z" />
        <path d="M 48 28 L 42 30 L 36 28 L 42 26 Z" />
        <path d="M 28 48 L 26 42 L 28 36 L 30 42 Z" />
        <path d="M 8 28 L 14 26 L 20 28 L 14 30 Z" />
      </motion.g>
    </g>
    <circle cx="28" cy="28" r="10" fill="#0b0d14" />
    <text x="28" y="33" textAnchor="middle" fontSize="12">👤</text>
  </svg>
)

const FrameCosmic = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <defs>
      <radialGradient id="cosmicBg" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#1e1b4b" />
        <stop offset="1" stopColor="#000" />
      </radialGradient>
    </defs>
    <circle cx="28" cy="28" r="22" fill="url(#cosmicBg)" />
    <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '28px 28px' }}>
      <circle cx="28" cy="6" r="0.8" fill="#5eead4" />
      <circle cx="50" cy="28" r="0.8" fill="#a78bfa" />
      <circle cx="28" cy="50" r="0.8" fill="#f472b6" />
      <circle cx="6" cy="28" r="0.8" fill="#fbbf24" />
      <circle cx="44" cy="12" r="0.6" fill="white" />
      <circle cx="12" cy="44" r="0.6" fill="white" />
    </motion.g>
    <circle cx="28" cy="28" r="10" fill="#0b0d14" />
    <text x="28" y="33" textAnchor="middle" fontSize="12">👤</text>
  </svg>
)

const BiomeNeon = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <rect width="56" height="56" rx="10" fill="#0b0d14" />
    <motion.path d="M 0 36 L 56 36" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2 2" animate={{ strokeDashoffset: [0, -16] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
    <g>
      <rect x="14" y="36" width="2" height="6" fill="#a78bfa" />
      <motion.circle cx="15" cy="32" r="4" fill="#22d3ee" opacity="0.6" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <rect x="30" y="36" width="2" height="8" fill="#a78bfa" />
      <motion.circle cx="31" cy="30" r="5" fill="#5eead4" opacity="0.6" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }} />
      <rect x="44" y="36" width="2" height="5" fill="#a78bfa" />
      <motion.circle cx="45" cy="33" r="3" fill="#f472b6" opacity="0.6" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.8 }} />
    </g>
  </svg>
)

const BiomeLava = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <rect width="56" height="56" rx="10" fill="#0b0d14" />
    <path d="M 0 44 L 18 30 L 28 36 L 42 18 L 56 30 L 56 56 L 0 56 Z" fill="#1c1917" />
    <path d="M 0 44 L 18 30 L 28 36 L 42 18 L 56 30" fill="none" stroke="#fb7185" strokeWidth="1" />
    <motion.path d="M 18 30 Q 22 26 26 30" stroke="#fbbf24" strokeWidth="1" fill="none" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} />
    <motion.path d="M 42 18 Q 46 14 50 18" stroke="#fbbf24" strokeWidth="1" fill="none" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }} />
  </svg>
)

const Boost = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <rect width="56" height="56" rx="10" fill="#0b0d14" />
    <motion.path d="M 32 6 L 18 30 L 26 30 L 22 50 L 38 24 L 30 24 Z" fill="#fbbf24"
      animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.8, repeat: Infinity }} />
  </svg>
)

const Shield = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <rect width="56" height="56" rx="10" fill="#0b0d14" />
    <path d="M 28 8 L 44 14 L 44 30 Q 44 42 28 50 Q 12 42 12 30 L 12 14 Z" fill="#1e293b" stroke="#5eead4" strokeWidth="1.5" />
    <motion.path d="M 20 28 L 26 34 L 38 20" stroke="#5eead4" strokeWidth="2" fill="none" strokeLinecap="round"
      animate={{ pathLength: [0, 1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
  </svg>
)

const Magnet = () => (
  <svg viewBox="0 0 56 56" className="w-14 h-14">
    <rect width="56" height="56" rx="10" fill="#0b0d14" />
    <path d="M 18 8 L 18 28 Q 18 40 28 40 Q 38 40 38 28 L 38 8 L 30 8 L 30 28 Q 30 32 28 32 Q 26 32 26 28 L 26 8 Z" fill="#fb7185" />
    <path d="M 18 8 L 26 8 L 26 14 L 18 14 Z" fill="#5eead4" />
    <path d="M 30 8 L 38 8 L 38 14 L 30 14 Z" fill="#5eead4" />
    <motion.circle cx="42" cy="38" r="1" fill="#fbbf24" animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />
    <motion.circle cx="44" cy="42" r="1" fill="#a3e635" animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} />
  </svg>
)

export const ShopPreview = ({ kind, icon }) => {
  switch (kind) {
    case 'void': return <Void />
    case 'aurora': return <Aurora />
    case 'ember': return <Ember />
    case 'zen': return <Zen />
    case 'frame_gold': return <FrameGold />
    case 'frame_neon': return <FrameNeon />
    case 'frame_runic': return <FrameRunic />
    case 'frame_cosmic': return <FrameCosmic />
    case 'biome_neon': return <BiomeNeon />
    case 'biome_lava': return <BiomeLava />
    case 'boost': return <Boost />
    case 'shield': return <Shield />
    case 'magnet': return <Magnet />
    default: return <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl bg-white/5 border border-white/10">{icon}</div>
  }
}
