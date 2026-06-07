import { motion } from 'framer-motion'
import { useGame } from '../store/useGame'
import { LivingHabitat } from '../components/LivingHabitat'
import { Constellation } from '../components/Constellation'
import { Card, SectionTitle, ProgressBar } from '../components/Card'
import { Icon } from '../components/Icon'
import { PETS, CATEGORIES } from '../lib/constants'
import { FUSIONS } from '../lib/achievements'
import { useState } from 'react'

export const Habitat = () => {
  const biomeXP = useGame((s) => s.biomeXP)
  const pet = useGame((s) => s.pet)
  const hatch = useGame((s) => s.hatchPet)
  const gems = useGame((s) => s.gems)
  const fusions = useGame((s) => s.fusions)
  const unlockFusion = useGame((s) => s.unlockFusion)
  const petsOwned = useGame((s) => s.petsOwned)
  const [tab, setTab] = useState('world')

  return (
    <div className="space-y-5">
      <div>
        <div className="label text-neon-mint">The Living World</div>
        <h1 className="h-display text-2xl sm:text-3xl text-white">Your habitat</h1>
        <p className="text-sm text-slate-400 mt-1">Your habits grow a real place. Every category is a biome. Every choice shapes the world.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['world','biomes','pets','fusions','sky'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`chip capitalize ${tab === t ? 'border-neon-mint/60 text-white bg-white/5' : ''}`}>
            {t === 'sky' ? 'constellation' : t}
          </button>
        ))}
      </div>

      {tab === 'world' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <LivingHabitat height={420} />
          </div>
          <div className="space-y-4">
            <Card>
              <SectionTitle eyebrow="Your companion">Pet</SectionTitle>
              {pet ? (
                <div className="flex items-center gap-3">
                  <motion.div className="text-5xl"
                    animate={{ y: [0, -3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                    {PETS.find((p) => p.id === pet.id)?.icon || '🐣'}
                  </motion.div>
                  <div>
                    <div className="h-display text-lg text-white">{PETS.find((p) => p.id === pet.id)?.name}</div>
                    <div className="text-xs text-slate-400">{PETS.find((p) => p.id === pet.id)?.desc}</div>
                    <div className="chip mt-1.5 text-neon-mint border-neon-mint/40">{PETS.find((p) => p.id === pet.id)?.bonus}</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-400">You haven't hatched a companion yet. Visit the Pets tab to adopt one.</div>
              )}
            </Card>

            <Card>
              <SectionTitle eyebrow="Today's weather">Mood</SectionTitle>
              <p className="text-xs text-slate-400 mb-2">Your mood tunes the sky above your habitat.</p>
              <MoodInline />
            </Card>
          </div>
        </div>
      )}

      {tab === 'biomes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(CATEGORIES).map(([k, c]) => {
            const v = biomeXP[c.biome] || 0
            const pct = Math.min(100, (v / 600) * 100)
            return (
              <Card key={k} glow={pct >= 60}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl" style={{ color: c.color }}>{c.icon}</span>
                  <div>
                    <div className="h-display text-white">{c.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Biome · {c.biome}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-400">{v} biome XP</div>
                <ProgressBar value={v} max={600} color={c.color} />
                <div className="mt-1 text-[10px] text-slate-500">{pct.toFixed(0)}% grown</div>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'pets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PETS.map((p) => {
            const owned = petsOwned.includes(p.id)
            const active = pet?.id === p.id
            return (
              <Card key={p.id} glow={active}>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{p.icon}</div>
                  <div className="flex-1">
                    <div className="h-display text-white">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.desc}</div>
                    <div className="chip mt-1.5">{p.bonus}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-slate-500">{p.cost} 💎</div>
                  {active ? (
                    <span className="chip text-neon-mint border-neon-mint/40">Active</span>
                  ) : owned ? (
                    <button className="btn-primary text-xs" onClick={() => hatch(p.id)}>Summon</button>
                  ) : (
                    <button
                      className={`btn-primary text-xs ${gems < p.cost ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => hatch(p.id)}>
                      Hatch ({p.cost} 💎)
                    </button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'fusions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FUSIONS.map((f) => {
            const have = fusions.includes(f.id)
            const a = CATEGORIES[f.a], b = CATEGORIES[f.b]
            return (
              <Card key={f.id} glow={have}>
                <div className="flex items-center gap-2 text-2xl">
                  <span style={{ color: a.color }}>{a.icon}</span>
                  <span className="text-slate-500">+</span>
                  <span style={{ color: b.color }}>{b.icon}</span>
                  <span className="text-slate-500">=</span>
                  <span>{f.icon}</span>
                </div>
                <div className="mt-2 h-display text-white">{f.name}</div>
                <div className="text-sm text-slate-400">{f.desc}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{have ? 'Unlocked' : '100 💎'}</span>
                  {have ? <span className="chip text-neon-mint border-neon-mint/40">Active</span>
                    : <button className={`btn-primary text-xs ${gems < 100 ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => unlockFusion(f.id, 100)}>Unlock</button>}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'sky' && <Constellation />}
    </div>
  )
}

const MoodInline = () => {
  const mood = useGame((s) => s.mood?.[new Date().toISOString().slice(0,10)])
  const setMood = useGame((s) => s.setMood)
  const opts = [
    { v: 1, e: '😞' }, { v: 2, e: '😕' }, { v: 3, e: '😐' }, { v: 4, e: '🙂' }, { v: 5, e: '😄' },
  ]
  return (
    <div className="flex items-center gap-2">
      {opts.map((o) => (
        <button key={o.v} onClick={() => setMood(o.v)}
          className={`flex-1 py-2 text-xl rounded-xl border transition-all ${mood === o.v ? 'border-neon-mint bg-white/10 scale-105' : 'border-white/10 hover:bg-white/5'}`}>
          {o.e}
        </button>
      ))}
    </div>
  )
}
