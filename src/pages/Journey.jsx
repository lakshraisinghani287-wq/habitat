import { useGame } from '../store/useGame'
import { Card, SectionTitle, ProgressBar } from '../components/Card'
import { Icon } from '../components/Icon'
import { levelFromXP, xpForLevel, TITLES, titleForLevel } from '../lib/constants'

export const Journey = () => {
  const s = useGame()
  const lvl = levelFromXP(s.xp)
  const xpIn = s.xp - xpForLevel(lvl)
  const xpNeed = xpForLevel(lvl + 1) - xpForLevel(lvl)
  const title = titleForLevel(lvl)
  const nextTitle = TITLES.find((t) => t.min > lvl)

  // Build a fake timeline from completed habits (recent first)
  const events = []
  s.habits.forEach((h) => {
    Object.keys(h.completions || {}).forEach((day) => {
      events.push({ day, habit: h })
    })
  })
  events.sort((a, b) => (a.day < b.day ? 1 : -1))

  return (
    <div className="space-y-5">
      <div>
        <div className="label text-neon-cyan">Your journey</div>
        <h1 className="h-display text-2xl sm:text-3xl text-white">Path of the traveler</h1>
        <p className="text-sm text-slate-400 mt-1">A timeline of your growth, every check-in a footstep.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card glow>
          <div className="text-xs uppercase tracking-wider text-slate-400">Current</div>
          <div className="h-display text-2xl" style={{ color: title.color }}>{title.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">Level {lvl}</div>
          <div className="mt-3 text-xs text-slate-400">Progress to Level {lvl + 1}</div>
          <ProgressBar value={xpIn} max={xpNeed} />
          <div className="text-[10px] text-slate-500 mt-1">{xpIn} / {xpNeed} XP</div>
          {nextTitle && (
            <div className="mt-3 text-xs text-slate-400">
              Next title at Level {nextTitle.min}: <span style={{ color: nextTitle.color }}>{nextTitle.name}</span>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle eyebrow="Season">Active bonus</SectionTitle>
          <SeasonCard />
        </Card>

        <Card>
          <SectionTitle eyebrow="Statistics">Lifetime</SectionTitle>
          <div className="space-y-1 text-sm">
            <Row k="Total check-ins" v={events.length} />
            <Row k="Habits" v={s.habits.length} />
            <Row k="Fusions" v={s.fusions.length} />
            <Row k="Achievements" v={Object.keys(s.achievements || {}).length} />
            <Row k="Best streak" v={Math.max(0, ...s.habits.map((h) => h.best || 0))} />
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle eyebrow="Timeline">Recent footsteps</SectionTitle>
        {events.length === 0 ? (
          <div className="text-sm text-slate-400">No check-ins yet — your first step awaits.</div>
        ) : (
          <ol className="relative pl-5">
            <span className="absolute left-1.5 top-1 bottom-1 w-px bg-white/10" />
            {events.slice(0, 25).map((e, i) => (
              <li key={i} className="relative py-2">
                <span className="absolute -left-[18px] top-3 w-2 h-2 rounded-full bg-neon-mint shadow-glow" />
                <div className="text-sm text-slate-200">
                  Completed <span className="text-white">{e.habit.name}</span>
                </div>
                <div className="text-[10px] text-slate-500">{e.day}</div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  )
}

const Row = ({ k, v }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-400">{k}</span>
    <span className="text-white font-semibold">{v}</span>
  </div>
)

const SeasonCard = () => {
  const s = useGame()
  const meta = {
    spring: { name: 'Spring of Beginnings', icon: '🌱', color: '#a3e635' },
    summer: { name: 'Summer of Power', icon: '☀️', color: '#fbbf24' },
    autumn: { name: 'Autumn of Mastery', icon: '🍂', color: '#f472b6' },
    winter: { name: 'Winter of Focus', icon: '❄️', color: '#22d3ee' },
  }[s.season]
  return (
    <div className="flex items-center gap-3">
      <div className="text-3xl">{meta.icon}</div>
      <div>
        <div className="h-display text-white" style={{ color: meta.color }}>{meta.name}</div>
        <div className="text-xs text-slate-400">Active seasonal bonus applies to completions.</div>
      </div>
    </div>
  )
}
