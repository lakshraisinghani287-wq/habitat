import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useGame } from '../store/useGame'
import { Icon } from './Icon'

const kindToColor = (k) => ({
  xp: '#5eead4', gems: '#22d3ee', streak: '#fbbf24', combo: '#f472b6',
  ach: '#a78bfa', boss: '#fb7185', habit: '#a3e635', shop: '#22d3ee',
  pet: '#a3e635', fusion: '#f472b6', warn: '#fbbf24',
}[k] || '#5eead4')

export const Toasts = () => {
  const notifs = useGame((s) => s.notifications)
  const clear = useGame((s) => s.clearNotifications)
  useEffect(() => {
    if (!notifs.length) return
    const t = setTimeout(() => clear(), 4000)
    return () => clearTimeout(t)
  }, [notifs, clear])

  const last = notifs.slice(-4)
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-[90vw]">
      <AnimatePresence>
        {last.map((n, i) => (
          <motion.div
            key={i + ':' + n.text}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass px-3 py-2 flex items-center gap-2 text-sm"
            style={{ borderColor: `${kindToColor(n.kind)}55` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: kindToColor(n.kind) }} />
            <span className="text-slate-100">{n.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
