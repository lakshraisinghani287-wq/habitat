import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/useGame'
import { CATEGORIES, todayKey, lastNDays, xpForDifficulty, energyCost } from '../lib/constants'
import { Icon, CategoryIcon } from './Icon'

export const HabitCard = ({ habit, onEdit }) => {
  const completeHabit = useGame((s) => s.completeHabit)
  const uncompleteHabit = useGame((s) => s.uncompleteHabit)
  const cat = CATEGORIES[habit.category] || CATEGORIES.growth
  const done = !!habit.completions?.[todayKey()]
  const last7 = lastNDays(7).map((d) => !!habit.completions?.[d])
  const energy = useGame((s) => s.energy)
  const cost = energyCost[habit.difficulty] ?? 5
  const xp = xpForDifficulty[habit.difficulty] ?? 10

  const [burst, setBurst] = useState(false)

  const onCheck = () => {
    if (done) {
      uncompleteHabit(habit.id)
      return
    }
    if (energy < cost) return
    setBurst(true)
    setTimeout(() => setBurst(false), 800)
    completeHabit(habit.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card relative overflow-hidden ${done ? 'ring-1 ring-neon-mint/40' : ''}`}
    >
      {/* biome accent strip */}
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: `linear-gradient(180deg, ${cat.color}, transparent)` }}
      />

      <div className="flex items-start gap-3">
        <button
          onClick={onCheck}
          className={`relative shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all
            ${done
              ? 'bg-gradient-to-br from-neon-mint to-neon-cyan text-ink-950 border-transparent shadow-glow'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
          title={done ? 'Uncheck' : `Check in (cost ${cost} energy)`}
        >
          <AnimatePresence>
            {done ? (
              <motion.span key="d" initial={{ scale: 0.4, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.4 }}>
                <Icon name="check" className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span key="x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl">
                {cat.icon}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Burst particles */}
          <AnimatePresence>
            {burst && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ background: cat.color }}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos((i / 8) * Math.PI * 2) * 28,
                      y: Math.sin((i / 8) * Math.PI * 2) * 28,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.7 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <CategoryIcon category={habit.category} className="text-base" />
            <span className="text-[11px] uppercase tracking-wider text-slate-400">{cat.name}</span>
            <span className="chip capitalize">{habit.difficulty}</span>
            <span className="chip capitalize">{habit.frequency}</span>
          </div>
          <div className="text-white font-medium truncate">{habit.name}</div>

          {/* Streak + last 7 days */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs">
              <Icon name="flame" className="w-3.5 h-3.5 text-neon-amber" />
              <span className="text-slate-200 font-semibold">{habit.streak}</span>
              <span className="text-slate-500">streak</span>
              {habit.best > 0 && <span className="text-slate-500 ml-1">· best {habit.best}</span>}
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {last7.map((d, i) => (
                <span key={i} className={`w-2.5 h-2.5 rounded-sm ${d ? 'bg-neon-mint' : 'bg-white/5'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
          <div className="text-xs text-slate-400">+{xp} XP · {cost}⚡</div>
          <button className="btn-ghost text-xs" onClick={(e) => { e.stopPropagation(); onEdit?.(habit) }}>edit</button>
        </div>
      </div>
    </motion.div>
  )
}
