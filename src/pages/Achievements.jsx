import { useGame } from '../store/useGame'
import { Card, SectionTitle } from '../components/Card'
import { Icon } from '../components/Icon'
import { ACHIEVEMENTS } from '../lib/constants'
import { motion } from 'framer-motion'

export const Achievements = () => {
  const unlocked = useGame((s) => s.achievements)
  const total = ACHIEVEMENTS.length
  const got = Object.keys(unlocked).length
  const pct = (got / total) * 100

  return (
    <div className="space-y-5">
      <div>
        <div className="label text-neon-violet">Constellation</div>
        <h1 className="h-display text-2xl sm:text-3xl text-white">Achievements</h1>
        <p className="text-sm text-slate-400 mt-1">Each one is a star in your sky. Collect them all to forge your constellation.</p>
      </div>

      <Card glow>
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="h-display text-white text-lg">Sky progress</div>
            <div className="text-xs text-slate-400">{got} / {total} stars</div>
          </div>
          <div className="text-2xl h-display text-neon-mint">{pct.toFixed(0)}%</div>
        </div>
        <div className="progress"><span style={{ width: `${pct}%` }} /></div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a, i) => {
          const have = !!unlocked[a.id]
          return (
            <motion.div key={a.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card glow={have} className={have ? '' : 'opacity-60'}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl grid place-items-center text-2xl ${have ? 'bg-neon-violet/15 shadow-glowViolet' : 'bg-white/5 grayscale'}`}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-display text-white">{a.name}</div>
                      {have && <span className="chip text-neon-mint border-neon-mint/40">unlocked</span>}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{a.desc}</div>
                    <div className="text-[10px] text-slate-500 mt-1">+{a.xp} XP</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
