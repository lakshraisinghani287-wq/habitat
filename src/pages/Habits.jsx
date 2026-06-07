import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../store/useGame'
import { Card, SectionTitle, Pill, ProgressBar } from '../components/Card'
import { HabitCard } from '../components/HabitCard'
import { Icon, CategoryIcon } from '../components/Icon'
import { CATEGORIES, todayKey, lastNDays } from '../lib/constants'
import { HabitEdit } from '../components/HabitEdit'

export const Habits = () => {
  const habits = useGame((s) => s.habits)
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    if (filter === 'all') return habits
    return habits.filter((h) => h.category === filter)
  }, [habits, filter])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="label text-neon-mint">All habits</div>
          <h1 className="h-display text-2xl sm:text-3xl text-white">Your garden</h1>
        </div>
        <button className="btn-primary" onClick={() => setEditing({})}>
          <Icon name="plus" className="w-4 h-4" /> New habit
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`chip ${filter === 'all' ? 'border-neon-mint/60 text-white' : ''}`}
        >
          ✨ All ({habits.length})
        </button>
        {Object.entries(CATEGORIES).map(([k, c]) => (
          <button key={k}
            onClick={() => setFilter(k)}
            className={`chip ${filter === k ? 'border-white/30 text-white' : ''}`}
            style={{ borderColor: filter === k ? `${c.color}99` : '' }}
          >
            {c.icon} {c.name} ({habits.filter((h) => h.category === k).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {filtered.length === 0 && (
            <Card>
              <div className="text-slate-400 text-sm">No habits in this category yet.</div>
            </Card>
          )}
          {filtered.map((h) => (
            <HabitCard key={h.id} habit={h} onEdit={(hh) => setEditing(hh)} />
          ))}
        </div>

        <div className="space-y-4">
          <Heatmap />
          <CategoryBreakdown />
        </div>
      </div>

      {editing && <HabitEdit habit={editing?.id ? editing : null} onClose={() => setEditing(null)} />}
    </div>
  )
}

const Heatmap = () => {
  const habits = useGame((s) => s.habits)
  const days = 35
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i))
    const key = d.toISOString().slice(0,10)
    const c = habits.reduce((s, h) => s + (h.completions?.[key] ? 1 : 0), 0)
    return { key, count: c, isToday: key === todayKey() }
  })
  const max = Math.max(1, ...cells.map((c) => c.count))
  return (
    <Card>
      <SectionTitle eyebrow="Last 5 weeks">Activity</SectionTitle>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((c) => {
          const intensity = c.count / max
          return (
            <motion.div key={c.key}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              title={`${c.key} · ${c.count} habits`}
              className={`aspect-square rounded-md ${c.isToday ? 'ring-1 ring-neon-mint' : ''}`}
              style={{
                background: c.count === 0
                  ? 'rgba(255,255,255,0.04)'
                  : `linear-gradient(135deg, rgba(94,234,212,${0.25 + intensity*0.6}), rgba(167,139,250,${0.25 + intensity*0.6}))`,
              }}
            />
          )
        })}
      </div>
      <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
        <span>less</span>
        {[0.2, 0.4, 0.6, 0.8, 1].map((v) => (
          <span key={v} className="w-3 h-3 rounded-sm" style={{ background: `linear-gradient(135deg, rgba(94,234,212,${v}), rgba(167,139,250,${v}))` }} />
        ))}
        <span>more</span>
      </div>
    </Card>
  )
}

const CategoryBreakdown = () => {
  const habits = useGame((s) => s.habits)
  const counts = Object.entries(CATEGORIES).map(([k, c]) => ({
    k, c, count: habits.filter((h) => h.category === k).length
  }))
  const total = habits.length || 1
  return (
    <Card>
      <SectionTitle eyebrow="By biome">Categories</SectionTitle>
      <div className="space-y-2">
        {counts.map(({ k, c, count }) => (
          <div key={k}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-2 text-slate-300"><span style={{ color: c.color }}>{c.icon}</span> {c.name}</span>
              <span className="text-slate-500">{count}</span>
            </div>
            <ProgressBar value={count} max={total} color={c.color} />
          </div>
        ))}
      </div>
    </Card>
  )
}
