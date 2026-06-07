import { useState, useEffect } from 'react'
import { useGame, selectStats } from '../store/useGame'
import { Card, SectionTitle, ProgressBar } from '../components/Card'
import { Icon } from '../components/Icon'
import { TITLES, titleForLevel, levelFromXP, xpForLevel } from '../lib/constants'
import { AuthPanel } from './Auth'
import {
  registerServiceWorker, requestNotifyPermission,
  scheduleReminder, cancelReminder, getSavedReminder, saveReminder,
} from '../lib/reminder'

const AVATARS = ['🌑','🌒','🌓','🌔','🌕','🌟','✨','🪐','🌌','🌊','🌳','🐉','🐺','🦉','🐙','🦜']

const DailyReminder = () => {
  const [perm, setPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported')
  const [cfg, setCfg] = useState(getSavedReminder() || { hour: 20, minute: 0 })
  const [supported, setSupported] = useState(typeof Notification !== 'undefined')

  useEffect(() => { registerServiceWorker() }, [])

  const enable = async () => {
    const res = await requestNotifyPermission()
    setPerm(res)
    if (res === 'granted') {
      scheduleReminder(cfg)
      saveReminder(cfg)
    }
  }

  const update = (patch) => {
    const next = { ...cfg, ...patch }
    setCfg(next)
    if (perm === 'granted') {
      scheduleReminder(next)
      saveReminder(next)
    }
  }

  const off = () => {
    cancelReminder()
    saveReminder(null)
  }

  if (!supported) {
    return <div className="text-xs text-slate-500">Notifications not supported in this browser.</div>
  }

  return (
    <div className="space-y-3">
      {perm !== 'granted' ? (
        <div className="flex items-center gap-3">
          <button onClick={enable} className="btn-primary text-sm">Enable daily reminder</button>
          {perm === 'denied' && <span className="text-xs text-neon-rose">Blocked. Allow in browser settings.</span>}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs text-slate-400">Time</label>
          <input
            type="time"
            value={`${String(cfg.hour).padStart(2, '0')}:${String(cfg.minute).padStart(2, '0')}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(':').map(Number)
              update({ hour: h, minute: m })
            }}
            className="input w-auto"
          />
          <span className="chip border-neon-mint/40 text-neon-mint">
            <Icon name="bolt" className="w-3 h-3" /> Active
          </span>
          <button onClick={off} className="btn-ghost text-xs">Turn off</button>
        </div>
      )}
    </div>
  )
}

export const Profile = () => {
  const s = useGame()
  const stats = selectStats(s)
  const [name, setLocalName] = useState(s.user.name)
  const saveName = useGame((st) => st.setName)
  const setAvatar = useGame((st) => st.setAvatar)
  const resetAll = useGame((st) => st.resetAll)
  const lvl = levelFromXP(s.xp)
  const xpIn = s.xp - xpForLevel(lvl)
  const xpNeed = xpForLevel(lvl + 1) - xpForLevel(lvl)
  const title = titleForLevel(lvl)

  return (
    <div className="space-y-5">
      <div>
        <div className="label text-neon-mint">You</div>
        <h1 className="h-display text-2xl sm:text-3xl text-white">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card glow className="text-center">
          <div className="w-24 h-24 rounded-full mx-auto grid place-items-center text-5xl bg-white/5 border-2 border-white/10 shadow-glow">
            {s.user.avatar}
          </div>
          <div className="h-display text-2xl text-white mt-3">{s.user.name}</div>
          <div className="text-xs uppercase tracking-wider" style={{ color: title.color }}>{title.name}</div>
          <div className="mt-3 text-xs text-slate-400">Level {lvl}</div>
          <ProgressBar value={xpIn} max={xpNeed} />
          <div className="text-[10px] text-slate-500 mt-1">{xpIn} / {xpNeed} XP to L{lvl + 1}</div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <SectionTitle eyebrow="Identity">Your name</SectionTitle>
            <div className="flex gap-2">
              <input className="input" value={name} onChange={(e) => setLocalName(e.target.value)} />
              <button className="btn-primary" onClick={() => saveName(name)}>Save</button>
            </div>
          </Card>

          <Card>
            <SectionTitle eyebrow="Avatar">Choose your sigil</SectionTitle>
            <div className="grid grid-cols-8 gap-2">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => setAvatar(a)}
                  className={`aspect-square rounded-xl text-2xl grid place-items-center border ${s.user.avatar === a ? 'border-neon-mint bg-white/10' : 'border-white/10 hover:bg-white/5'}`}>
                  {a}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle eyebrow="Title ladder">Path</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TITLES.map((t) => (
                <div key={t.name} className={`p-3 rounded-xl border ${lvl >= t.min ? 'border-white/20 bg-white/5' : 'border-white/5 opacity-50'}`}>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">L{t.min}+</div>
                  <div className="h-display text-sm" style={{ color: lvl >= t.min ? t.color : '#475569' }}>{t.name}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Cloud sync panel — only renders anything meaningful if Supabase is configured */}
          <AuthPanel />

          <Card>
            <SectionTitle eyebrow="Daily reminder">Nudge me</SectionTitle>
            <p className="text-xs text-slate-400 mb-3">Get a browser notification at a time you choose.</p>
            <DailyReminder />
          </Card>

          <Card>
            <SectionTitle eyebrow="Danger zone">Reset</SectionTitle>
            <p className="text-xs text-slate-400 mb-3">Wipe all data and start fresh. Cannot be undone.</p>
            <button className="btn text-neon-rose border-neon-rose/40"
              onClick={() => { if (confirm('Reset everything?')) resetAll() }}>
              Reset all progress
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
