import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/useGame'
import { CATEGORIES } from '../lib/constants'
import { Cursor3D, LowPolyIsland, ParticleField } from '../components/Cursor3D'
import { Icon } from '../components/Icon'

const AVATARS = ['🌑','🌒','🌓','🌔','🌕','🌟','✨','🪐','🌌','🌊','🌳','🐉','🐺','🦉','🐙','🦜','🜂','🜁','🜄','🜃']
const STEPS = ['welcome', 'name', 'avatar', 'habit', 'reveal']
const ACCENTS = {
  welcome: '#5eead4',
  name: '#a78bfa',
  avatar: '#f472b6',
  habit: '#a3e635',
  reveal: '#fbbf24',
}

const pageVariants = {
  enter: { opacity: 0, y: 30, filter: 'blur(8px)' },
  center: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(8px)' },
}

export const Onboarding = () => {
  const s = useGame()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(s.user.name || '')
  const [avatar, setAvatar] = useState(s.user.avatar || '🌑')
  const [habitName, setHabitName] = useState('')
  const [habitCat, setHabitCat] = useState('growth')
  const [habitDiff, setHabitDiff] = useState('easy')

  const setNameStore = useGame((st) => st.setName)
  const setAvatarStore = useGame((st) => st.setAvatar)
  const addHabit = useGame((st) => st.addHabit)
  const completeOnboarding = useGame((st) => st.completeOnboarding)

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const skipHabit = () => { completeOnboarding(); }

  const finish = () => {
    if (name.trim()) setNameStore(name.trim())
    setAvatarStore(avatar)
    if (habitName.trim()) {
      addHabit({ name: habitName.trim(), category: habitCat, difficulty: habitDiff, frequency: 'daily' })
    }
    completeOnboarding()
  }

  const accent = ACCENTS[STEPS[step]]

  return (
    <div className="min-h-screen relative overflow-hidden grid-bg" style={{ background: '#07080d' }}>
      {/* Ambient background */}
      <ParticleField count={40} color={accent} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(50rem 50rem at 50% 50%, ${accent}10, transparent 60%)`
      }} />

      {/* Progress bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex gap-1.5 p-4 max-w-md mx-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
            <motion.div
              className="h-full"
              style={{ background: `linear-gradient(90deg, ${accent}, #22d3ee)` }}
              initial={false}
              animate={{ width: i <= step ? '100%' : '0%' }}
              transition={{ duration: 0.6 }}
            />
          </div>
        ))}
      </div>

      {/* Skip button (always available except on reveal) */}
      {STEPS[step] !== 'reveal' && (
        <button
          className="absolute top-4 right-4 z-20 btn-ghost text-xs"
          onClick={() => { if (name.trim()) setNameStore(name.trim()); setAvatarStore(avatar); completeOnboarding() }}
        >
          Skip
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={pageVariants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16"
        >
          {STEPS[step] === 'welcome' && <StepWelcome onNext={next} accent={accent} />}
          {STEPS[step] === 'name' && <StepName name={name} setName={setName} onNext={next} onBack={back} accent={accent} avatar={avatar} />}
          {STEPS[step] === 'avatar' && <StepAvatar avatar={avatar} setAvatar={setAvatar} name={name} onNext={next} onBack={back} accent={accent} />}
          {STEPS[step] === 'habit' && (
            <StepHabit
              name={habitName} setName={setHabitName}
              cat={habitCat} setCat={setHabitCat}
              diff={habitDiff} setDiff={setHabitDiff}
              onSkip={skipHabit} onBack={back} accent={accent}
            />
          )}
          {STEPS[step] === 'reveal' && <StepReveal onEnter={finish} accent={accent} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ----------------------- Steps ----------------------- */

const StepWelcome = ({ onNext, accent }) => (
  <div className="text-center max-w-xl mx-auto">
    <motion.div
      className="mx-auto mb-8"
      initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
    >
      <Cursor3D size={260} accent={accent} intensity={1.2}>
        <LowPolyIsland accent={accent} />
      </Cursor3D>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <div className="label" style={{ color: accent }}>Welcome to</div>
      <h1 className="h-display text-5xl sm:text-7xl mt-2 shimmer-text font-bold">HABITAT</h1>
      <p className="text-slate-400 mt-4 text-lg">
        A habit tracker that <span style={{ color: accent }}>grows a living world</span> with you.
      </p>
    </motion.div>

    <motion.button
      onClick={onNext}
      className="btn-primary mt-10 px-8 py-3 text-base"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}
    >
      Begin your journey <Icon name="bolt" className="w-4 h-4" />
    </motion.button>
  </div>
)

const StepName = ({ name, setName, onNext, onBack, accent, avatar }) => (
  <div className="w-full max-w-md mx-auto text-center">
    <div className="label" style={{ color: accent }}>Step 1 of 3</div>
    <h2 className="h-display text-3xl sm:text-4xl text-white mt-2">What should we call you?</h2>
    <p className="text-slate-400 mt-2 text-sm">This is the name that will appear on your leaderboard and journey.</p>

    <div className="mt-10 flex items-center gap-4 justify-center">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 grid place-items-center text-3xl shadow-glow">
        {avatar}
      </div>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && name.trim() && onNext()}
        placeholder="Your name"
        className="input text-lg py-3"
        style={{ borderColor: name ? `${accent}66` : undefined }}
      />
    </div>

    <div className="flex justify-between mt-10">
      <button onClick={onBack} className="btn-ghost">Back</button>
      <button onClick={onNext} disabled={!name.trim()} className={`btn-primary ${!name.trim() ? 'opacity-50 pointer-events-none' : ''}`}>
        Continue
      </button>
    </div>
  </div>
)

const StepAvatar = ({ avatar, setAvatar, name, onNext, onBack, accent }) => (
  <div className="w-full max-w-xl mx-auto text-center">
    <div className="label" style={{ color: accent }}>Step 2 of 3</div>
    <h2 className="h-display text-3xl sm:text-4xl text-white mt-2">Choose your sigil</h2>
    <p className="text-slate-400 mt-2 text-sm">A small symbol to mark your travels.</p>

    <motion.div
      key={avatar}
      initial={{ scale: 0.6, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
      className="mx-auto mt-8 w-32 h-32 rounded-full grid place-items-center text-6xl bg-white/5 border-2 shadow-glow"
      style={{ borderColor: `${accent}99` }}
    >
      {avatar}
    </motion.div>
    <div className="text-slate-300 mt-3">{name || 'Traveler'}</div>

    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mt-8">
      {AVATARS.map((a) => (
        <motion.button
          key={a}
          onClick={() => setAvatar(a)}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`aspect-square rounded-xl text-2xl grid place-items-center border transition-all ${
            avatar === a ? 'border-white/40 bg-white/10' : 'border-white/10 hover:bg-white/5'
          }`}
          style={avatar === a ? { boxShadow: `0 0 20px ${accent}55` } : undefined}
        >
          {a}
        </motion.button>
      ))}
    </div>

    <div className="flex justify-between mt-10">
      <button onClick={onBack} className="btn-ghost">Back</button>
      <button onClick={onNext} className="btn-primary">Continue</button>
    </div>
  </div>
)

const StepHabit = ({ name, setName, cat, setCat, diff, setDiff, onSkip, onBack, accent }) => {
  const meta = CATEGORIES[cat]
  const canContinue = name.trim().length > 0
  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <div className="label" style={{ color: accent }}>Step 3 of 3</div>
      <h2 className="h-display text-3xl sm:text-4xl text-white mt-2">Plant your first habit</h2>
      <p className="text-slate-400 mt-2 text-sm">A small seed. Everything in your habitat starts here.</p>

      <div className="mt-8 text-left">
        <div className="label mb-1">Habit name</div>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink a glass of water"
          className="input text-lg py-3"
          onKeyDown={(e) => e.key === 'Enter' && canContinue && onSkip()}
        />
      </div>

      <div className="mt-6 text-left">
        <div className="label mb-2">What kind of world does it grow?</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(CATEGORIES).map(([k, c]) => (
            <button key={k} onClick={() => setCat(k)}
              className={`p-3 rounded-xl border text-sm flex items-center gap-2 ${cat === k ? 'border-white/30 bg-white/5 text-white' : 'border-white/10 text-slate-400'}`}
              style={cat === k ? { borderColor: `${c.color}99`, boxShadow: `0 0 16px ${c.color}22` } : undefined}
            >
              <span style={{ color: c.color }} className="text-lg">{c.icon}</span> {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-left">
        <div className="label mb-2">Difficulty</div>
        <div className="flex flex-wrap gap-2">
          {['trivial','easy','medium','hard','epic'].map((d) => (
            <button key={d} onClick={() => setDiff(d)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize border ${diff === d ? 'border-white/30 bg-white/5 text-white' : 'border-white/10 text-slate-400'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {canContinue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 card text-left flex items-center gap-3"
        >
          <span className="text-2xl" style={{ color: meta.color }}>{meta.icon}</span>
          <div>
            <div className="text-white font-semibold">{name}</div>
            <div className="text-xs text-slate-400">{meta.name} · {diff}</div>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="btn-ghost">Back</button>
        <div className="flex gap-2">
          <button onClick={onSkip} className="btn-ghost">Skip for now</button>
          <button onClick={onSkip} disabled={!canContinue} className={`btn-primary ${!canContinue ? 'opacity-50 pointer-events-none' : ''}`}>
            Plant & enter
          </button>
        </div>
      </div>
    </div>
  )
}

const StepReveal = ({ onEnter, accent }) => {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500)
    const t2 = setTimeout(() => setPhase(2), 3000)
    const t3 = setTimeout(() => onEnter(), 4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onEnter])

  return (
    <div className="text-center">
      <motion.div
        className="mx-auto"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80 }}
      >
        <Cursor3D size={320} accent={accent} intensity={1.5}>
          <LowPolyIsland accent={accent} />
        </Cursor3D>
      </motion.div>

      <motion.h2
        className="h-display text-4xl sm:text-5xl mt-8 shimmer-text"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      >
        Your world awakens
      </motion.h2>

      <motion.p
        className="text-slate-400 mt-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
      >
        {phase === 0 && 'A blank horizon...'}
        {phase === 1 && 'Light gathers. The first seed stirs.'}
        {phase === 2 && 'Welcome, traveler.'}
      </motion.p>

      <motion.div
        className="mt-10 flex items-center gap-2 justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      >
        <span className="w-2 h-2 rounded-full bg-neon-mint animate-pulse" />
        <span className="text-sm text-slate-300">entering your habitat…</span>
      </motion.div>
    </div>
  )
}
