import { useGame, selectStats } from '../store/useGame'
import { Card, SectionTitle } from '../components/Card'
import { Icon } from '../components/Icon'
import { MOCK_TRAVELERS, titleForLevel, levelFromXP, TITLES } from '../lib/constants'
import { motion } from 'framer-motion'

export const Leaderboard = () => {
  const s = useGame()
  const stats = selectStats(s)
  const you = {
    name: s.user.name,
    title: stats.title.name,
    xp: s.xp,
    streak: Math.max(0, ...s.habits.map((h) => h.streak || 0)),
    badges: Object.keys(s.achievements || {}).length,
    isYou: true,
  }
  const all = [...MOCK_TRAVELERS, you].sort((a, b) => b.xp - a.xp)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="label text-neon-amber">Hall of travelers</div>
          <h1 className="h-display text-2xl sm:text-3xl text-white">Leaderboard</h1>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="chip">This week</span>
          <span className="chip">All time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {all.slice(0, 3).map((u, i) => <Podium key={u.name} u={u} place={i + 1} />)}
      </div>

      <Card>
        <SectionTitle eyebrow="All travelers">Rankings</SectionTitle>
        <div className="divide-y divide-white/5">
          {all.map((u, i) => (
            <motion.div key={u.name}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 py-3 ${u.isYou ? 'bg-white/5 -mx-2 px-2 rounded-xl' : ''}`}>
              <div className="w-8 text-center text-slate-400 font-mono">#{i + 1}</div>
              <div className="w-9 h-9 rounded-full bg-white/5 grid place-items-center text-lg">{u.isYou ? s.user.avatar : avatar(u.name)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold truncate">{u.isYou ? `${u.name} (you)` : u.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">{u.title}</div>
              </div>
              <Stat label="XP" value={u.xp} color="#5eead4" />
              <Stat label="Streak" value={u.streak} color="#fb7185" />
              <Stat label="Badges" value={u.badges} color="#a78bfa" />
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

const Stat = ({ label, value, color }) => (
  <div className="text-right px-2 hidden sm:block">
    <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    <div className="font-mono text-sm" style={{ color }}>{value}</div>
  </div>
)

const Podium = ({ u, place }) => {
  const heights = ['h-32', 'h-40', 'h-28']
  const colors = ['#fbbf24', '#94a3b8', '#fb923c']
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: place * 0.1 }}
      className="card flex flex-col items-center pt-4"
    >
      <div className="text-3xl mb-2">{place === 1 ? '👑' : place === 2 ? '🥈' : '🥉'}</div>
      <div className="w-12 h-12 rounded-full bg-white/5 grid place-items-center text-xl border-2" style={{ borderColor: colors[place - 1] }}>{u.name[0]}</div>
      <div className="h-display text-white mt-2">{u.name}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{u.title}</div>
      <div className="mt-2 flex items-center gap-1.5 text-sm font-mono" style={{ color: colors[place - 1] }}>{u.xp.toLocaleString()} XP</div>
    </motion.div>
  )
}

const avatar = (name) => name[0].toUpperCase()
