import { useState } from 'react'
import { useGame } from '../store/useGame'
import { CATEGORIES } from '../lib/constants'
import { Icon } from '../components/Icon'

export const HabitEdit = ({ habit, onClose }) => {
  const updateHabit = useGame((s) => s.updateHabit)
  const deleteHabit = useGame((s) => s.deleteHabit)
  const addHabit = useGame((s) => s.addHabit)
  const [name, setName] = useState(habit?.name || '')
  const [category, setCategory] = useState(habit?.category || 'growth')
  const [difficulty, setDifficulty] = useState(habit?.difficulty || 'easy')
  const [frequency, setFrequency] = useState(habit?.frequency || 'daily')

  const save = () => {
    if (!name.trim()) return
    if (habit) updateHabit(habit.id, { name, category, difficulty, frequency })
    else addHabit({ name, category, difficulty, frequency })
    onClose()
  }
  const remove = () => {
    if (habit) { deleteHabit(habit.id); onClose() }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink-950/80 backdrop-blur animate-rise">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <div className="h-display text-lg text-white">{habit ? 'Edit habit' : 'Plant a new habit'}</div>
          <button className="btn-ghost" onClick={onClose}><Icon name="close" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <div className="label mb-1">Name</div>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Read 20 minutes" autoFocus />
          </div>
          <div>
            <div className="label mb-1">Category</div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CATEGORIES).map(([k, c]) => (
                <button key={k}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-sm ${category === k ? 'border-neon-mint/50 bg-white/5 text-white' : 'border-white/10 text-slate-400'}`}
                  onClick={() => setCategory(k)}>
                  <span>{c.icon}</span>{c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="label mb-1">Difficulty</div>
            <div className="flex flex-wrap gap-2">
              {['trivial','easy','medium','hard','epic'].map((d) => (
                <button key={d}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize border ${difficulty === d ? 'border-neon-amber/50 text-white bg-white/5' : 'border-white/10 text-slate-400'}`}
                  onClick={() => setDifficulty(d)}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="label mb-1">Frequency</div>
            <div className="flex flex-wrap gap-2">
              {['daily','weekdays','weekly'].map((f) => (
                <button key={f}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize border ${frequency === f ? 'border-neon-cyan/50 text-white bg-white/5' : 'border-white/10 text-slate-400'}`}
                  onClick={() => setFrequency(f)}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            {habit ? (
              <button className="btn text-neon-rose" onClick={remove}>Delete</button>
            ) : <span />}
            <div className="flex gap-2">
              <button className="btn" onClick={onClose}>Cancel</button>
              <button className="btn-primary" onClick={save}>{habit ? 'Save' : 'Plant'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
