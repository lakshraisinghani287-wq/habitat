import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'

const nav = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/habits', label: 'Habits', icon: 'check' },
  { to: '/habitat', label: 'Habitat', icon: 'leaf' },
  { to: '/journey', label: 'Journey', icon: 'map' },
  { to: '/leaderboard', label: 'Leaderboard', icon: 'trophy' },
  { to: '/achievements', label: 'Achievements', icon: 'star' },
  { to: '/shop', label: 'Shop', icon: 'shop' },
  { to: '/journal', label: 'Journal', icon: 'book' },
  { to: '/profile', label: 'Profile', icon: 'user' },
]

export const Sidebar = () => (
  <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-white/5 bg-ink-900/40 backdrop-blur-xl">
    <div className="px-5 py-5">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-mint to-neon-violet flex items-center justify-center font-bold text-ink-950 text-lg">H</div>
        <div>
          <div className="h-display text-white text-lg leading-none">HABITAT</div>
          <div className="text-[10px] text-slate-400 mt-0.5">grow your world</div>
        </div>
      </div>
    </div>
    <nav className="px-3 flex-1">
      {nav.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              isActive
                ? 'bg-white/10 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Icon name={n.icon} className="w-4 h-4" />
          {n.label}
        </NavLink>
      ))}
    </nav>
    <div className="px-3 pb-4 text-[10px] text-slate-500">
      v1.0 · your data lives on your device
    </div>
  </aside>
)

export const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl bg-ink-950/80 border-t border-white/5">
    <div className="grid grid-cols-5 px-1 py-1.5">
      {nav.slice(0, 5).map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px] ${
              isActive ? 'text-neon-mint' : 'text-slate-500'
            }`
          }
        >
          <Icon name={n.icon} className="w-5 h-5" />
          {n.label}
        </NavLink>
      ))}
    </div>
  </nav>
)

export const MobileMenu = ({ open, onClose }) => {
  if (!open) return null
  return (
    <div className="md:hidden fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-xl p-5 overflow-y-auto animate-rise">
      <div className="flex items-center justify-between mb-6">
        <div className="h-display text-white text-xl">HABITAT</div>
        <button className="btn-ghost" onClick={onClose}><Icon name="close" /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl border ${
                isActive ? 'border-neon-mint/50 text-white bg-white/5' : 'border-white/10 text-slate-300'
              }`
            }
          >
            <Icon name={n.icon} className="w-4 h-4" />
            <span className="text-sm">{n.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
