import { useGame, selectStats } from '../store/useGame'
import { Icon } from './Icon'
import { motion } from 'framer-motion'
import { xpForLevel, levelFromXP, titleForLevel, energyMax } from '../lib/constants'

export const Topbar = ({ onMenu }) => {
  const s = useGame()
  const stats = selectStats(s)
  const lvl = stats.lvl
  const title = stats.title
  const xpPct = (stats.xpIn / stats.xpNeeded) * 100
  const energyPct = (s.energy / energyMax) * 100

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={onMenu} className="md:hidden btn-ghost !p-2" aria-label="menu">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-mint to-neon-violet flex items-center justify-center font-bold text-ink-950">H</div>
          <div className="h-display text-white text-lg hidden sm:block">HABITAT</div>
        </div>

        <div className="flex-1 flex items-center gap-3 sm:gap-5 overflow-x-auto no-scrollbar">
          {/* Level + XP */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15" fill="none" stroke="#5eead4" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 15}
                  initial={false}
                  animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - xpPct / 100) }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-[11px] font-semibold text-white">{lvl}</div>
            </div>
            <div className="hidden md:block">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Level {lvl} · <span style={{ color: title.color }}>{title.name}</span></div>
              <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-mint to-neon-cyan" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>

          {/* Energy */}
          <div className="flex items-center gap-2 shrink-0">
            <Icon name="bolt" className="w-4 h-4 text-neon-amber" />
            <div className="w-20 sm:w-28">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Energy</div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-amber to-neon-pink" style={{ width: `${energyPct}%` }} />
              </div>
            </div>
            <div className="text-xs text-slate-300">{s.energy}/{energyMax}</div>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Icon name="gem" className="w-4 h-4 text-neon-cyan" />
            <div className="text-sm font-semibold text-white">{s.gems}</div>
          </div>

          {/* Combo */}
          {s.combo?.count > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 chip border-neon-pink/40 text-neon-pink">
              <Icon name="fire" className="w-3.5 h-3.5" />
              <span className="text-xs">x{s.combo.count} combo</span>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 grid place-items-center text-lg">
            {s.user.avatar}
          </div>
          <div className="hidden lg:block">
            <div className="text-sm font-semibold text-white">{s.user.name}</div>
            <div className="text-[11px] text-slate-400" style={{ color: title.color }}>{title.name}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
