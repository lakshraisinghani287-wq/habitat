import { motion } from 'framer-motion'

export const Card = ({ children, className = '', glow = false, ...rest }) => (
  <div {...rest} className={`card ${glow ? 'shadow-glow' : ''} ${className}`}>
    {children}
  </div>
)

export const SectionTitle = ({ children, action, eyebrow }) => (
  <div className="flex items-end justify-between mb-3">
    <div>
      {eyebrow && <div className="label text-neon-mint">{eyebrow}</div>}
      <h2 className="h-display text-lg sm:text-xl text-white">{children}</h2>
    </div>
    {action}
  </div>
)

export const Pill = ({ children, color = '#5eead4' }) => (
  <span
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border"
    style={{ color, borderColor: `${color}55`, background: `${color}14` }}
  >
    {children}
  </span>
)

export const ProgressBar = ({ value, max = 100, color }) => (
  <div className="progress">
    <motion.span
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={color ? { background: `linear-gradient(90deg, ${color}, #22d3ee)` } : undefined}
    />
  </div>
)
