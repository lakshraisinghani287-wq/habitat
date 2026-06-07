import { useState, useMemo } from 'react'
import { useGame } from '../store/useGame'
import { Card, SectionTitle } from '../components/Card'
import { Icon } from '../components/Icon'
import { lastNDays, todayKey } from '../lib/constants'

export const Journal = () => {
  const habits = useGame((s) => s.habits)
  const setNote = useGame((s) => s.setHabitNote)
  const mood = useGame((s) => s.mood)
  const setMood = useGame((s) => s.setMood)
  const [activeHabit, setActiveHabit] = useState(habits[0]?.id)
  const [day, setDay] = useState(todayKey())

  const days = lastNDays(14).reverse()
  const habit = habits.find((h) => h.id === activeHabit)
  const note = habit?.notes?.[day] || ''

  const moodEmoji = (v) => ({ 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' }[v] || '·')

  return (
    <div className="space-y-5">
      <div>
        <div className="label text-neon-rose">Journal</div>
        <h1 className="h-display text-2xl sm:text-3xl text-white">Inner weather</h1>
        <p className="text-sm text-slate-400 mt-1">Capture thoughts and moods. Your habitat listens.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <SectionTitle eyebrow="Last 14 days">Mood</SectionTitle>
          <div className="space-y-1">
            {days.map((d) => (
              <button key={d} onClick={() => setDay(d)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm ${d === day ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                <span className="text-slate-400 font-mono text-xs">{d.slice(5)}</span>
                <span className="text-xl">{moodEmoji(mood[d])}</span>
              </button>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <SectionTitle eyebrow="How do you feel?">Mood for {day}</SectionTitle>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((v) => (
                <button key={v} onClick={() => setMood(v)}
                  className={`flex-1 py-3 text-2xl rounded-xl border ${mood[day] === v ? 'border-neon-mint bg-white/10 scale-105' : 'border-white/10 hover:bg-white/5'}`}>
                  {moodEmoji(v)}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <SectionTitle eyebrow="Free write">Notes for {day}</SectionTitle>
              <select className="input max-w-[200px]" value={activeHabit || ''} onChange={(e) => setActiveHabit(e.target.value)}>
                {habits.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <textarea
              className="input min-h-[160px] resize-y"
              placeholder={habit ? `Notes for ${habit.name} on ${day}…` : 'Pick a habit'}
              value={note}
              onChange={(e) => habit && setNote(habit.id, day, e.target.value)}
              disabled={!habit}
            />
            <div className="text-[10px] text-slate-500 mt-2">Saved automatically. Use it to reflect on why you showed up.</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
