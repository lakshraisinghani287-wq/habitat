import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useGame } from './store/useGame'
import { Topbar } from './components/Topbar'
import { Sidebar, BottomNav, MobileMenu } from './components/Sidebar'
import { Toasts } from './components/Toasts'
import { Home } from './pages/Home'
import { Habits } from './pages/Habits'
import { Habitat } from './pages/Habitat'
import { Journey } from './pages/Journey'
import { Leaderboard } from './pages/Leaderboard'
import { Achievements } from './pages/Achievements'
import { Shop } from './pages/Shop'
import { Journal } from './pages/Journal'
import { Profile } from './pages/Profile'
import { Onboarding } from './pages/Onboarding'

const Shell = () => {
  const loc = useLocation()
  const onboarded = useGame((s) => s.onboarded)
  const tickDaily = useGame((s) => s.tickDaily)
  const checkAchievements = useGame((s) => s.checkAchievements)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!onboarded) return
    tickDaily()
    checkAchievements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboarded])

  useEffect(() => { setMenu(false) }, [loc.pathname])

  // Gate the entire app behind onboarding.
  if (!onboarded) return <Onboarding />

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenu={() => setMenu(true)} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/habitat" element={<Habitat />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
      <Toasts />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
