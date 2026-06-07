import { useGame, selectStats } from '../store/useGame'
import { motion } from 'framer-motion'
import { LivingHabitat } from '../components/LivingHabitat'
import { HabitCard } from '../components/HabitCard'
import { BossFight } from '../components/BossFight'
import { Card, SectionTitle, Pill, ProgressBar } from '../components/Card'
import { Icon, CategoryIcon } from '../components/Icon'
import { todayKey, seasonMeta, currentSeason, CATEGORIES } from '../lib/constants'
import { useState } from 'react'
import { HabitEdit } from '../components/HabitEdit'

const Greeting = () => {
  const s = useGame()
  const hour = new Date().getHours()
  const greet = hour < 6 ? 'Burning the midnight oil' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const season = seasonMeta[s.season] || seasonMeta[currentSeason()]
  return (
    <div className="card bg-gradient-to-br from-white/5 to-transparent">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-400">
        <Icon name="sparkle" className="w-3.5 h-3.5 text-neon-mint" /> {greet}
      </div>
      <div className="h-display text-2xl sm:text-3xl mt-1 text-white">
        {s.user.name}, <span className="shimmer-text">today is yours.</span>
      </div>
      <div className="mt-3 text-sm text-slate-400">{season.name} · {season.bonus}</div>
    </div>
  )
}

const StatTile = ({ icon, label, value, color }) => (
  <div className="card flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: `${color}22`, color }}>
      <Icon name={icon} className="w-5 h-5" />
    </div>
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="h-display text-xl text-white">{value}</div>
    </div>
  </div>
)

export const Home = () => {
  const s = useGame()
  const stats = selectStats(s)
  const habits = s.habits
  const [editing, setEditing] = useState(null)

  const todays = habits.filter((h) => {
    const d = new Date().getDay()
    if (h.frequency === 'daily') return true
    if (h.frequency === 'weekdays') return d >= 1 && d <= 5
    return true
  })
  const remaining = todays.filter((h) => !h.completions?.[todayKey()])

  return (
    <div className="space-y-6">
      <Greeting />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile icon="bolt" label="Energy" value={`${s.energy}/100`} color="#fbbf24" />
        <StatTile icon="gem" label="Gems" value={s.gems} color="#22d3ee" />
        <StatTile icon="fire" label="Best streak" value={Math.max(0, ...habits.map((h) => h.best || 0))} color="#fb7185" />
        <StatTile icon="star" label="Achievements" value={Object.keys(s.achievements || {}).length} color="#a78bfa" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <SectionTitle
              eyebrow="Today's path"
              action={<button className="btn-primary text-xs" onClick={() => setEditing({})}>
                <Icon name="plus" className="w-3.5 h-3.5" /> Plant habit
              </button>}
            >
              Habits for today
            </SectionTitle>
            {todays.length === 0 && (
              <div className="text-sm text-slate-400">No habits yet. Plant your first one to begin growing your habitat.</div>
            )}
            <div className="space-y-2">
              {todays.map((h) => (
                <HabitCard key={h.id} habit={h} onEdit={(hh) => setEditing(hh)} />
              ))}
            </div>
          </Card>

          <BossFight />
        </div>

        <div className="space-y-4">
          <LivingHabitat height={240} />
          <Card>
            <SectionTitle eyebrow="Quick view">Mood</SectionTitle>
            <MoodPicker small />
          </Card>
        </div>
      </div>

      {editing && <HabitEdit habit={editing?.id ? editing : null} onClose={() => setEditing(null)} />}

      {/* habit edit modal uses local component above */}
    </div>
  )
}

const MoodPicker = ({ small }) => {
  const mood = useGame((s) => s.mood?.[todayKey()])
  const setMood = useGame((s) => s.setMood)
  const options = [
    { v: 1, e: '😞' }, { v: 2, e: '😕' }, { v: 3, e: '😐' }, { v: 4, e: '🙂' }, { v: 5, e: '😄' },
  ]
  return (
    <div className="flex items-center justify-between gap-2">
      {options.map((o) => (
        <button key={o.v}
          onClick={() => setMood(o.v)}
          className={`flex-1 ${small ? 'py-2 text-xl' : 'py-3 text-2xl'} rounded-xl border transition-all ${
            mood === o.v ? 'border-neon-mint bg-white/10 scale-105' : 'border-white/10 hover:bg-white/5'
          }`}>
          {o.e}
        </button>
      ))}
    </div>
  )
}
