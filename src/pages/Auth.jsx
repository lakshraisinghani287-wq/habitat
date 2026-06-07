import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, isCloudEnabled } from '../lib/supabase'
import { Icon } from '../components/Icon'
import { useGame } from '../store/useGame'
import { attachSync, signOutCloud } from '../store/sync'

// Sign-in / sign-up screen — magic link only. Used as a modal panel from
// Profile, not a gate. App continues to work fully without signing in.
export const AuthPanel = ({ onClose }) => {
  const setName = useGame((s) => s.setName)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [session, setSession] = useState(supabase?.auth.getSession()?.data?.session || null)

  supabase?.auth.onAuthStateChange((_e, s) => {
    setSession(s)
    if (s?.user) {
      // Wire store sync to this user
      const getUserId = async () => s.user.id
      attachSync(useGame, getUserId)
      if (s.user.user_metadata?.name) setName(s.user.user_metadata.name)
      // Close after a moment
      setTimeout(() => onClose?.(), 1500)
    }
  })

  if (!isCloudEnabled()) {
    return (
      <div className="card text-center">
        <div className="text-sm text-slate-400">
          Cloud sync is not configured. Add <code className="text-neon-cyan">VITE_SUPABASE_URL</code> and
          {' '}<code className="text-neon-cyan">VITE_SUPABASE_ANON_KEY</code> to enable multi-device sync.
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="card text-center">
        <div className="w-12 h-12 rounded-xl bg-neon-mint/10 border border-neon-mint/30 mx-auto grid place-items-center text-2xl">✓</div>
        <div className="h-display text-white mt-3">Signed in</div>
        <div className="text-xs text-slate-400 mt-1">{session.user.email}</div>
        <div className="text-xs text-neon-mint mt-2">Your habitat will sync to this account.</div>
        <button onClick={async () => { await signOutCloud(); setSession(null) }} className="btn-ghost mt-4 text-xs">
          Sign out
        </button>
      </div>
    )
  }

  const sendLink = async () => {
    if (!email.trim()) return
    setBusy(true); setErr(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim() })
      if (error) throw error
      setSent(true)
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="card text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-mint to-neon-violet grid place-items-center font-bold text-ink-950">H</div>
        <div>
          <div className="h-display text-white">Cloud sync</div>
          <div className="text-xs text-slate-400">Sign in to follow your progress across devices.</div>
        </div>
      </div>

      {sent ? (
        <div className="mt-5 p-4 rounded-xl bg-neon-mint/10 border border-neon-mint/30 text-neon-mint text-sm">
          Check <strong>{email}</strong> for a magic link.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <input
            type="email" className="input" autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendLink()}
            placeholder="you@example.com"
          />
          {err && <div className="text-xs text-neon-rose">{err}</div>}
          <button onClick={sendLink} disabled={busy} className={`btn-primary w-full ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
            {busy ? 'Sending…' : 'Send magic link'} <Icon name="bolt" className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  )
}
