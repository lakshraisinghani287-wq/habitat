import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/useGame'
import { BOSSES } from '../lib/achievements'
import { Icon } from './Icon'
import { useState } from 'react'

// Damage table — must stay in sync with useGame.js boss-damage block
const STRIKE_DMG = { trivial: 0, easy: 0, medium: 0, hard: 15, epic: 25 }

export const BossFight = () => {
  const boss = useGame((s) => s.boss)
  const strikeBoss = useGame((s) => s.strikeBoss)
  const habits = useGame((s) => s.habits)
  const meta = BOSSES.find((b) => b.id === boss.id) || BOSSES[0]
  const pct = Math.max(0, 100 - (boss.currentHP / meta.hp) * 100)
  const [shake, setShake] = useState(false)

  // Pick the most damaging not-yet-done habit. If nothing's available, fall
  // back to the hardest habit so the user always gets a response.
  const today = new Date().toISOString().slice(0, 10)
  const und = habits.filter((h) => !h.completions?.[today])
  const candidate =
    und.sort((a, b) => (STRIKE_DMG[b.difficulty] || 0) - (STRIKE_DMG[a.difficulty] || 0))[0]
    || habits.sort((a, b) => (STRIKE_DMG[b.difficulty] || 0) - (STRIKE_DMG[a.difficulty] || 0))[0]

  const dmg = candidate ? (STRIKE_DMG[candidate.difficulty] || 0) : 0
  const canHit = !!candidate && (dmg > 0) && boss.currentHP > 0

  const attack = () => {
    if (!canHit) return
    setShake(true)
    setTimeout(() => setShake(false), 500)
    // Direct damage: doesn't depend on the habit completion being valid
    strikeBoss(dmg, candidate?.name)
  }

  return (
    <div className="card relative overflow-hidden">
      <div className="flex items-start gap-4">
        <motion.div
          className="text-5xl"
          animate={shake ? { x: [-6, 6, -4, 4, 0], rotate: [-4, 4, -2, 2, 0] } : { y: [0, -3, 0] }}
          transition={{ duration: shake ? 0.5 : 2.5, repeat: shake ? 0 : Infinity }}
        >
          {meta.icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-neon-rose">Weekly Boss</div>
          <h3 className="h-display text-lg text-white">{meta.name}</h3>
          <p className="text-sm text-slate-400 mt-0.5 italic">"{meta.flavor}"</p>

          {/* HP bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>HP</span>
              <span>{boss.currentHP}/{meta.hp}</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
              <motion.div
                className="h-full"
                style={{ background: 'linear-gradient(90deg, #fb7185, #f472b6, #fbbf24)' }}
                initial={false}
                animate={{ width: `${Math.max(0, boss.currentHP / meta.hp) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <button onClick={attack} disabled={!canHit} className={`btn-primary ${!canHit ? 'opacity-50 pointer-events-none' : ''}`}>
          <Icon name="bolt" className="w-4 h-4" />
          {dmg > 0 ? `Strike with ${candidate.difficulty} (+${dmg})` : 'No hard habit to strike with'}
        </button>
        <span className="text-xs text-slate-500">
          {candidate ? `using: ${candidate.name}` : 'Add a hard or epic habit to deal damage'}
        </span>
      </div>

      <AnimatePresence>
        {boss.currentHP === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 grid place-items-center bg-ink-950/80 backdrop-blur"
          >
            <div className="text-center">
              <div className="text-5xl mb-2">🏆</div>
              <div className="h-display text-2xl shimmer-text">Victory</div>
              <div className="text-sm text-slate-300 mt-1">+{meta.rewards.xp} XP, +{meta.rewards.gems} 💎</div>
              <button className="btn-primary mt-3" onClick={() => useGame.getState().resetBoss()}>Next Encounter</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
