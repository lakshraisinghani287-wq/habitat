# 🌌 HABITAT

> A gamified habit tracker that **grows a living world with you.** Every habit you complete makes your world bloom a little more.

HABITAT is a dark, minimalistic, animated webapp for PC and mobile. It does the things every habit tracker does — and adds a full game layer on top: XP, levels, titles, gems, energy, combos, achievements, pets, fusions, leaderboards, weekly bosses, and a real-time living habitat you can watch evolve.

![HABITAT](https://img.shields.io/badge/habitat-v1.0-5eead4?style=flat-square) ![React](https://img.shields.io/badge/React-18-22d3ee?style=flat-square) ![Vite](https://img.shields.io/badge/Vite-5-a78bfa?style=flat-square)

---

## ✨ Features

### 🧭 The must-haves (every habit tracker has these)
- **Habit CRUD** with name, category, difficulty, and frequency (daily / weekdays / weekly / custom)
- **One-tap check-ins** with animated bursts
- **Streaks** (current and best)
- **Per-habit 7-day history** strip on every card
- **5-week activity heatmap** across all habits
- **Per-habit notes & mood journaling** with date selector
- **Categories & frequency filtering**
- **Statistics** (total check-ins, best streak, completions)

### 🎮 What makes HABITAT unique
- 🌱 **The Living Habitat** — a hand-drawn SVG world that grows in five biomes (forest, mountain, ocean, desert, meadow) based on which categories you practice. Trees rise, snow caps appear, fish swim, flowers bloom.
- ⚡ **Energy / Mana system** — every check-in costs energy that regenerates each day. Don't burn out.
- 🔥 **Combo chains** — complete habits back-to-back to multiply your XP. Hitting 5x grants a 50% XP boost.
- 🐉 **Weekly Boss Fights** — complete hard or epic habits to strike a boss. Defeat unlocks XP and gem rewards.
- ⭐ **Constellation Achievements** — achievements live in a star map. When you unlock two adjacent stars, a line connects them — slowly forming your personal constellation.
- 🐣 **Pet Companions** — hatch creatures with passive bonuses: XP+5%, streak freeze, energy regen, hard-habit XP boost, mind XP boost, full revive.
- 🧬 **Habit Fusion** — combine two habit categories to unlock a permanent mastery perk (e.g. *Mind + Body = Iron Clarity: +10% XP on hard habits*).
- 🛒 **Cosmetic Shop** — themes, avatar frames, and consumable boosts (Double XP, Streak Shield).
- 🏆 **Leaderboard** — see yourself ranked alongside mock travelers and a top-3 podium.
- 👑 **Title ladder** — Spark → Initiate → Adventurer → Pathfinder → Champion → Mythwalker → Sage → Grandmaster.
- 🌦️ **Mood weather** — your daily mood literally changes the sky over your habitat (sun, cloud, rain, stars).
- 📅 **Seasons** — Spring of Beginnings, Summer of Power, Autumn of Mastery, Winter of Focus. Each gives a different live bonus.

### 🎨 Design
- **Dark, minimalistic** — no clutter, plenty of glass surfaces and negative space
- **Cool animations** — Framer Motion throughout (check-in bursts, level-ups, constellation links, living world)
- **Fully responsive** — sidebar on desktop, bottom nav on mobile, animated mobile drawer
- **PWA-ready** — manifest + service worker + theme color; installable on mobile
- **3D cursor parallax** — island/spire follows the cursor on the welcome + onboarding screens
- **SEO-ready** — Open Graph, Twitter card, JSON-LD, sitemap, robots.txt

---

## 🚀 Run it

```bash
npm install
npm run dev      # development at http://localhost:5173
npm run build    # production build into ./dist
npm run preview  # preview the production build
```

No backend, no signup, no tracking. **Your data lives in your browser** via `localStorage` (Zustand + `persist` middleware).

---

## 🧱 Tech

| Layer        | Choice                                        |
|--------------|-----------------------------------------------|
| UI           | React 18 + Vite 5                             |
| Styling      | TailwindCSS 3 + custom CSS (glass, glow)      |
| Animation    | Framer Motion                                 |
| State        | Zustand (with `persist` to `localStorage`)    |
| Routing      | react-router-dom (HashRouter for portability) |
| Icons        | Inline SVG sprites                            |

No external APIs. No auth required. No telemetry. Pure single-page webapp.

**Cloud sync (optional):** add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars and run `supabase/schema.sql` to enable multi-device sync. Without them, the app runs in local-only mode using `localStorage`.

**Daily reminders:** the service worker requests notification permission and pings you at a chosen time each day. See `DEPLOY.md` for the full Vercel + Supabase setup.

## 🗂️ Project layout

```
src/
  App.jsx                  # router + shell
  main.jsx                 # React root
  index.css                # tailwind + design system
  lib/
    constants.js           # tuning, categories, achievements, pets
    achievements.js        # boss roster, fusion recipes, shop catalog
  store/
    useGame.js             # the entire game + habit engine
  components/
    Topbar.jsx             # sticky XP, energy, gems, combo, avatar
    Sidebar.jsx            # desktop nav + mobile bottom nav + drawer
    Toasts.jsx             # notification feed
    Card.jsx               # card, pill, progress primitives
    Icon.jsx               # SVG icon set + category icon
    HabitCard.jsx          # check-in card with bursts
    HabitEdit.jsx          # create/edit habit modal
    LivingHabitat.jsx      # the animated SVG world
    BossFight.jsx          # weekly boss component
    Constellation.jsx      # achievement star map
  pages/
    Home.jsx               # dashboard
    Habits.jsx             # full list + heatmap + breakdown
    Habitat.jsx            # world / biomes / pets / fusions / sky
    Journey.jsx            # timeline + title ladder
    Leaderboard.jsx        # rankings + top-3 podium
    Achievements.jsx       # all stars + progress
    Shop.jsx               # gems → cosmetics & boosts
    Journal.jsx            # mood + per-day notes
    Profile.jsx            # name, avatar, title ladder, reset
```

---

## 🎯 Roadmap ideas

If you want to push HABITAT further:

- **Cloud sync** (Supabase / Firebase) so progress follows you across devices
- **Friends** — invite real people, replace mock travelers with real leaderboard
- **Habit chains** — habits that unlock other habits
- **Audio** — ambient soundscape that adapts to the habitat
- **Quests** — daily/weekly missions on top of habits
- **PWA manifest** + offline support
- **Habit templates marketplace** — shareable habit packs

---

## 📜 License

MIT — fork it, ship it, grow your own world.
