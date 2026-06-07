import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  dayKey, todayKey, yesterdayKey, lastNDays, daysBetween,
  xpForDifficulty, energyCost, energyMax, levelFromXP, xpForLevel,
  titleForLevel, currentSeason, CATEGORIES, ACHIEVEMENTS, PETS,
} from '../lib/constants.js'

const uid = () => Math.random().toString(36).slice(2, 10)
const pushNotif = (arr, n) => [...arr, n].slice(-30)
const PET_BY_ID = PETS.reduce((a, p) => (a[p.id] = p, a), {})

const seedHabits = () => []

const initialState = {
  user: { name: '', joinedAt: todayKey(), avatar: '🌑', theme: 'default', cosmetics: [] },
  habits: [],
  onboarded: false,
  xp: 0,
  gems: 25,
  energy: energyMax,
  energyLastUpdate: todayKey(),
  combo: { count: 0, lastTs: 0 },
  mood: {}, // dayKey -> 1..5
  pet: null, // { id, hatchedAt, level }
  petsOwned: [],
  inventory: {}, // shop item id -> qty
  fusions: [], // fusion ids unlocked
  achievements: {}, // id -> { unlockedAt }
  boss: { id: 'procrastination', currentHP: 100, defeated: 0, lastReset: todayKey() },
  notifications: [], // ephemeral feed
  unlockedAchievements: [],
  biomeXP: { forest: 0, mountain: 0, ocean: 0, desert: 0, meadow: 0 },
  season: currentSeason(),
  perfectDays: 0,
}

const isScheduledToday = (h) => {
  const d = new Date()
  const day = d.getDay() // 0 sun
  if (h.frequency === 'daily') return true
  if (h.frequency === 'weekdays') return day >= 1 && day <= 5
  if (h.frequency === 'weekly') return true // free choice
  if (h.frequency === 'custom' && Array.isArray(h.customDays) && h.customDays.length) {
    return h.customDays.includes(day)
  }
  return true
}

const applySeasonBonuses = (season, baseXP, baseEnergy) => {
  let xp = baseXP, energy = baseEnergy
  if (season === 'spring') xp = Math.round(xp * 1.0) // placeholder
  if (season === 'autumn') { /* gems +5 on hard, applied in caller */ }
  if (season === 'winter') energy = Math.max(0, energy - 1) // trivial bonus
  return { xp, energy }
}

const petBonuses = (pet) => {
  if (!pet) return { xpMult: 1, hardMult: 1, mindMult: 1, energyRegen: 0, freeze: 0 }
  switch (pet.id) {
    case 'sprig':   return { xpMult: 1.05, hardMult: 1, mindMult: 1, energyRegen: 0, freeze: 0 }
    case 'ember':   return { xpMult: 1,    hardMult: 1, mindMult: 1, energyRegen: 0, freeze: 1 }
    case 'tide':    return { xpMult: 1,    hardMult: 1, mindMult: 1, energyRegen: 5, freeze: 0 }
    case 'phoenix': return { xpMult: 1,    hardMult: 1, mindMult: 1, energyRegen: 0, freeze: 5 }
    case 'wolf':    return { xpMult: 1,    hardMult: 1.15, mindMult: 1, energyRegen: 0, freeze: 0 }
    case 'owl':     return { xpMult: 1,    hardMult: 1, mindMult: 1.10, energyRegen: 0, freeze: 0 }
    default:        return { xpMult: 1, hardMult: 1, mindMult: 1, energyRegen: 0, freeze: 0 }
  }
}

const fusionBonuses = (fusions) => {
  const out = { xpMult: 1, hardMult: 1, mindMult: 1, energyRegen: 0, streakGems: 0, newBoost: 0 }
  fusions?.forEach((id) => {
    if (id === 'mind_body')    out.hardMult *= 1.10
    if (id === 'soul_social')  out.streakGems += 1
    if (id === 'craft_growth') out.newBoost = 1
    if (id === 'body_growth')  out.energyRegen += 3
  })
  return out
}

const computeStreak = (completions, todayStr, yesterdayStr) => {
  // Walk backwards from today (if today is done) or yesterday
  let cursor = completions[todayStr] ? todayStr : (completions[yesterdayStr] ? yesterdayStr : null)
  if (!cursor) return 0
  let streak = 0
  while (true) {
    if (completions[cursor]) {
      streak++
      const d = new Date(cursor); d.setDate(d.getDate() - 1)
      cursor = dayKey(d)
    } else {
      // allow one day freeze if today is missing
      const d = new Date(cursor); d.setDate(d.getDate() - 1)
      const prev = dayKey(d)
      if (completions[prev] && streak > 0) {
        // don't count freeze in streak
      }
      break
    }
  }
  return streak
}

const computeBest = (completions) => {
  const keys = Object.keys(completions).sort()
  if (!keys.length) return 0
  let best = 0, run = 0, prev = null
  for (const k of keys) {
    if (prev && daysBetween(prev, k) === 1) run += 1
    else run = 1
    best = Math.max(best, run)
    prev = k
  }
  return best
}

export const useGame = create()(
  persist(
    (set, get) => ({
      ...initialState,

      // ---------- Setup ----------
      setName: (name) => set((s) => ({ user: { ...s.user, name } })),
      setAvatar: (emoji) => set((s) => ({ user: { ...s.user, avatar: emoji } })),
      resetAll: () => set({ ...initialState, habits: [], onboarded: false }),
      completeOnboarding: () => set({ onboarded: true }),

      // ---------- Habits CRUD ----------
      addHabit: ({ name, category = 'growth', difficulty = 'easy', frequency = 'daily', customDays = [] }) => set((s) => {
        const h = { id: uid(), name, category, difficulty, frequency, customDays, createdAt: todayKey(), completions: {}, notes: {}, streak: 0, best: 0 }
        return { habits: [...s.habits, h], notifications: pushNotif(s.notifications, { kind: 'habit', text: `New habit planted: ${name}` }) }
      }),
      updateHabit: (id, patch) => set((s) => ({
        habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h))
      })),
      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
      setHabitNote: (id, day, note) => set((s) => ({
        habits: s.habits.map((h) => h.id === id ? { ...h, notes: { ...h.notes, [day]: note } } : h)
      })),

      // ---------- Daily mechanics ----------
      // Regen energy each new day
      tickDaily: () => set((s) => {
        const today = todayKey()
        if (s.energyLastUpdate === today) return {}
        const pet = s.pet ? PET_BY_ID[s.pet.id] || null : null
        const regen = (pet ? 5 : 0) + (s.fusions?.includes('body_growth') ? 3 : 0) + 10 // base 10/day
        return {
          energy: Math.min(energyMax, s.energy + regen),
          energyLastUpdate: today,
          // decay combo if yesterday had no completions
          combo: s.combo?.count && !s.combo.lastTs ? { count: 0, lastTs: 0 } : s.combo,
        }
      }),

      completeHabit: (id, opts = {}) => set((s) => {
        // Ensure energy regen first
        if (s.energyLastUpdate !== todayKey()) {
          // no-op here; tickDaily will be called separately. But compute safely:
        }
        const h = s.habits.find((x) => x.id === id)
        if (!h) return {}
        const today = todayKey()
        if (h.completions?.[today]) return {} // already done

        // Energy cost
        const cost = energyCost[h.difficulty] ?? 5
        if (s.energy < cost) {
          return { notifications: pushNotif(s.notifications, { kind: 'warn', text: 'Not enough energy. Rest and try again.' }) }
        }

        // XP and gems reward
        let baseXP = xpForDifficulty[h.difficulty] ?? 10
        let baseGems = h.difficulty === 'hard' ? 5 : h.difficulty === 'epic' ? 9 : 2

        // Season bonuses
        if (s.season === 'spring' && h.difficulty === 'easy') baseXP = Math.round(baseXP * 1.10)
        if (s.season === 'autumn' && h.difficulty === 'hard') baseGems += 5
        if (s.season === 'winter' && h.difficulty === 'trivial') baseXP = Math.round(baseXP * 1.15)

        // Fusion bonuses
        const fb = fusionBonuses(s.fusions)
        baseXP = Math.round(baseXP * fb.xpMult)
        if (h.difficulty === 'hard' || h.difficulty === 'epic') baseXP = Math.round(baseXP * fb.hardMult)
        if (h.category === 'mind') baseXP = Math.round(baseXP * fb.mindMult)

        // Pet bonuses
        const pet = s.pet
        const pb = petBonuses(pet)
        if (pb.xpMult !== 1) baseXP = Math.round(baseXP * pb.xpMult)
        if ((h.difficulty === 'hard' || h.difficulty === 'epic') && pb.hardMult !== 1) baseXP = Math.round(baseXP * pb.hardMult)
        if (h.category === 'mind' && pb.mindMult !== 1) baseXP = Math.round(baseXP * pb.mindMult)

        // New habit boost (craft_growth fusion): first 3 days +25%
        const daysDone = Object.keys(h.completions || {}).length
        const boosted = s.fusions?.includes('craft_growth') && daysDone < 3
        if (boosted) baseXP = Math.round(baseXP * 1.25)

        // Update completions + streak
        const completions = { ...(h.completions || {}), [today]: true }
        const streak = computeStreak(completions, today, yesterdayKey())
        const best = Math.max(computeBest(completions), h.best || 0)
        const newHabit = { ...h, completions, streak, best }

        // Combo — increment if within window
        const now = Date.now()
        const sameDay = s.combo?.lastTs && (now - s.combo.lastTs) < (s.season === 'summer' ? 12 * 3600 * 1000 : 6 * 3600 * 1000)
        const newComboCount = sameDay ? (s.combo?.count || 0) + 1 : 1
        const comboMult = newComboCount >= 5 ? 1.5 : newComboCount >= 3 ? 1.2 : 1
        baseXP = Math.round(baseXP * comboMult)

        // Streak gem bonus
        if (fb.streakGems && streak > 0) baseGems += 1

        // Apply to user
        const xp = s.xp + baseXP
        const gems = s.gems + baseGems
        const energy = Math.max(0, s.energy - cost)

        // Update biomes
        const biome = CATEGORIES[h.category]?.biome || 'meadow'
        const biomeXP = { ...s.biomeXP, [biome]: (s.biomeXP[biome] || 0) + baseXP }

        // Notifications
        const notes = [
          { kind: 'xp', text: `+${baseXP} XP from ${h.name}` },
          { kind: 'gems', text: `+${baseGems} 💎` },
        ]
        if (streak > 0 && streak % 7 === 0) notes.push({ kind: 'streak', text: `${streak}-day streak on ${h.name}!` })
        if (newComboCount === 5) notes.push({ kind: 'combo', text: '5x COMBO! +50% XP' })

        // Check perfect day
        const todays = s.habits
          .filter((hh) => isScheduledToday(hh))
          .map((hh) => hh.id)
        const willBeComplete = todays.every((hid) => hid === h.id ? true : s.habits.find((x) => x.id === hid)?.completions?.[today])

        // Append all notes once, then cap at 30.
        const finalNotifs = [...s.notifications, ...notes].slice(-30)

        // Boss damage from hard/epic
        let boss = s.boss
        if (h.difficulty === 'hard' || h.difficulty === 'epic') {
          const dmg = h.difficulty === 'epic' ? 25 : 15
          const newHP = Math.max(0, (s.boss.currentHP || 0) - dmg)
          boss = { ...s.boss, currentHP: newHP }
          if (newHP === 0) {
            finalNotifs.push({ kind: 'boss', text: `Boss defeated! +${250 + s.boss.defeated * 50} XP, +30 💎` })
          }
        }

        return {
          habits: s.habits.map((x) => (x.id === id ? newHabit : x)),
          xp, gems, energy, combo: { count: newComboCount, lastTs: now },
          biomeXP, notifications: finalNotifs, boss,
          perfectDays: willBeComplete ? (s.perfectDays + 1) : s.perfectDays,
        }
      }),

      uncompleteHabit: (id) => set((s) => {
        const h = s.habits.find((x) => x.id === id)
        if (!h) return {}
        const today = todayKey()
        const completions = { ...(h.completions || {}) }
        delete completions[today]
        const newHabit = { ...h, completions, streak: computeStreak(completions, today, yesterdayKey()) }
        return { habits: s.habits.map((x) => (x.id === id ? newHabit : x)) }
      }),

      // ---------- Mood ----------
      setMood: (val) => set((s) => ({ mood: { ...s.mood, [todayKey()]: val } })),

      // ---------- Boss ----------
      // Direct strike — used by the BossFight "Strike" button. Always deals
      // damage, doesn't depend on habit completion state.
      strikeBoss: (dmg, habitName) => set((s) => {
        if (s.boss.currentHP <= 0 || dmg <= 0) return {}
        const newHP = Math.max(0, s.boss.currentHP - dmg)
        const defeated = newHP === 0
        const meta = { procrastination: { xp: 250, gems: 30 }, doubt: { xp: 300, gems: 40 }, comfort: { xp: 400, gems: 50 } }
        const reward = meta[s.boss.id] || meta.procrastination
        const bonusXP = defeated ? (reward.xp + (s.boss.defeated || 0) * 50) : 0
        const bonusGems = defeated ? reward.gems : 0
        const notifs = [
          { kind: 'boss', text: habitName ? `Strike! -${dmg} HP (${habitName})` : `Strike! -${dmg} HP` },
        ]
        if (defeated) notifs.push({ kind: 'boss', text: `Boss defeated! +${bonusXP} XP, +${bonusGems} 💎` })
        return {
          boss: { ...s.boss, currentHP: newHP, defeated: (s.boss.defeated || 0) + (defeated ? 1 : 0) },
          xp: s.xp + bonusXP,
          gems: s.gems + bonusGems,
          notifications: [...s.notifications, ...notifs].slice(-30),
        }
      }),
      resetBoss: () => set((s) => ({ boss: { ...s.boss, currentHP: 100, lastReset: todayKey() } })),

      // ---------- Pets ----------
      hatchPet: (petId) => set((s) => {
        if (s.pet) return {}
        if (s.petsOwned.includes(petId)) {
          return { pet: { id: petId, hatchedAt: todayKey(), level: 1 }, notifications: [...s.notifications, { kind: 'pet', text: `A companion returns!` }] }
        }
        return { pet: { id: petId, hatchedAt: todayKey(), level: 1 }, petsOwned: [...s.petsOwned, petId], notifications: [...s.notifications, { kind: 'pet', text: `You hatched a new companion!` }] }
      }),

      // ---------- Fusions ----------
      unlockFusion: (fusionId, cost) => set((s) => {
        if (s.fusions.includes(fusionId)) return {}
        if (s.gems < cost) return { notifications: [...s.notifications, { kind: 'warn', text: 'Not enough gems.' }] }
        return { fusions: [...s.fusions, fusionId], gems: s.gems - cost, xp: s.xp + 100, notifications: [...s.notifications, { kind: 'fusion', text: `Fusion unlocked!` }] }
      }),

      // ---------- Achievements ----------
      checkAchievements: () => set((s) => {
        const unlocked = new Set(Object.keys(s.achievements || {}))
        const newly = []
        const state = s
        const lvl = levelFromXP(state.xp)
        ACHIEVEMENTS.forEach((a) => {
          if (unlocked.has(a.id)) return
          let ok = false
          if (a.id === 'first_step') ok = Object.values(state.habits).some((h) => Object.keys(h.completions || {}).length > 0)
          if (a.id === 'streak_3')  ok = state.habits.some((h) => h.streak >= 3)
          if (a.id === 'streak_7')  ok = state.habits.some((h) => h.streak >= 7)
          if (a.id === 'streak_30') ok = state.habits.some((h) => h.streak >= 30)
          if (a.id === 'streak_100')ok = state.habits.some((h) => h.streak >= 100)
          if (a.id === 'level_5')   ok = lvl >= 5
          if (a.id === 'level_10')  ok = lvl >= 10
          if (a.id === 'level_25')  ok = lvl >= 25
          if (a.id === 'boss_1')    ok = (state.boss.defeated || 0) >= 1 || (state.boss.currentHP === 0)
          if (a.id === 'combo_5')   ok = (state.combo?.count || 0) >= 5
          if (a.id === 'mood_7')    ok = Object.keys(state.mood || {}).length >= 7
          if (a.id === 'all_biomes')ok = Object.values(state.biomeXP || {}).every((v) => v > 0)
          if (a.id === 'pet_hatch') ok = !!state.pet
          if (a.id === 'fusion_1')  ok = (state.fusions?.length || 0) >= 1
          if (a.id === 'perfect_day') ok = (state.perfectDays || 0) >= 1
          if (a.id === 'gems_500')  ok = state.gems >= 500
          if (ok) newly.push(a)
        })
        if (!newly.length) return {}
        const next = { ...state.achievements }
        newly.forEach((a) => { next[a.id] = { unlockedAt: todayKey() } })
        const xpGain = newly.reduce((s, a) => s + a.xp, 0)
        return {
          achievements: next,
          xp: state.xp + xpGain,
          notifications: [...state.notifications, ...newly.map((a) => ({ kind: 'ach', text: `Achievement: ${a.name}!` }))].slice(-30),
        }
      }),

      // ---------- Shop ----------
      buyShopItem: (item) => set((s) => {
        if (s.gems < item.cost) return { notifications: [...s.notifications, { kind: 'warn', text: 'Not enough gems.' }] }
        if (item.type === 'theme' || item.type === 'cosmetic') {
          if (s.user.cosmetics.includes(item.id)) return {}
          return { gems: s.gems - item.cost, user: { ...s.user, cosmetics: [...s.user.cosmetics, item.id] }, inventory: { ...s.inventory, [item.id]: 1 }, notifications: [...s.notifications, { kind: 'shop', text: `Acquired ${item.name}.` }] }
        }
        const inv = { ...s.inventory, [item.id]: (s.inventory[item.id] || 0) + 1 }
        return { gems: s.gems - item.cost, inventory: inv, notifications: [...s.notifications, { kind: 'shop', text: `Acquired ${item.name}.` }] }
      }),

      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: 'habitat-game-v1', storage: createJSONStorage(() => localStorage) }
  )
)

// Re-export derived selectors / utilities
export const selectStats = (s) => {
  const lvl = levelFromXP(s.xp)
  const xpIn = s.xp - xpForLevel(lvl)
  const xpNeeded = xpForLevel(lvl + 1) - xpForLevel(lvl)
  const title = titleForLevel(lvl)
  const habitsTodayDone = s.habits.filter((h) => h.completions?.[todayKey()]).length
  const habitsTodayTotal = s.habits.filter((h) => isScheduledToday(h)).length
  const totalCompletions = s.habits.reduce((sum, h) => sum + Object.keys(h.completions || {}).length, 0)
  return { lvl, xpIn, xpNeeded, title, habitsTodayDone, habitsTodayTotal, totalCompletions }
}
