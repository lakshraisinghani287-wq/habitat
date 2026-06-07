// ---------- Time helpers ----------
export const dayKey = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}
export const todayKey = () => dayKey(new Date())
export const yesterdayKey = () => {
  const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d)
}
export const daysBetween = (a, b) => {
  const ms = new Date(b) - new Date(a)
  return Math.round(ms / 86400000)
}
export const lastNDays = (n) => {
  const out = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); out.push(dayKey(d))
  }
  return out
}

// ---------- Math / game tuning ----------
export const xpForDifficulty = {
  trivial: 5,
  easy: 10,
  medium: 25,
  hard: 50,
  epic: 90,
}
export const energyCost = {
  trivial: 3,
  easy: 5,
  medium: 8,
  hard: 12,
  epic: 18,
}
export const energyMax = 100

// Level curve: gentle but rewarding
export const xpForLevel = (lvl) => Math.round(50 * Math.pow(lvl, 1.65))
export const levelFromXP = (xp) => {
  let lvl = 1
  while (xp >= xpForLevel(lvl + 1)) lvl++
  return lvl
}

// Title ladder
export const TITLES = [
  { min: 1, name: 'Spark', color: '#94a3b8' },
  { min: 3, name: 'Initiate', color: '#5eead4' },
  { min: 7, name: 'Adventurer', color: '#22d3ee' },
  { min: 12, name: 'Pathfinder', color: '#a78bfa' },
  { min: 18, name: 'Champion', color: '#f472b6' },
  { min: 26, name: 'Mythwalker', color: '#fbbf24' },
  { min: 36, name: 'Sage', color: '#a3e635' },
  { min: 50, name: 'Grandmaster', color: '#fb7185' },
]
export const titleForLevel = (lvl) =>
  [...TITLES].reverse().find((t) => lvl >= t.min) || TITLES[0]

// Seasons
export const currentSeason = () => {
  const m = new Date().getMonth() + 1
  if ([12, 1, 2].includes(m)) return 'winter'
  if ([3, 4, 5].includes(m)) return 'spring'
  if ([6, 7, 8].includes(m)) return 'summer'
  return 'autumn'
}
export const seasonMeta = {
  spring: { name: 'Spring of Beginnings', accent: '#a3e635', bonus: 'Growth: +10% XP on easy habits' },
  summer: { name: 'Summer of Power', accent: '#fbbf24', bonus: 'Power: combo decay 2x slower' },
  autumn: { name: 'Autumn of Mastery', accent: '#f472b6', bonus: 'Mastery: +5 gems per hard habit' },
  winter: { name: 'Winter of Focus', accent: '#22d3ee', bonus: 'Focus: -1 energy cost on trivial habits' },
}

// Categories — each maps to a habitat biome
export const CATEGORIES = {
  body:    { name: 'Body',    icon: '🫀', color: '#fb7185', biome: 'forest'   },
  mind:    { name: 'Mind',    icon: '🧠', color: '#a78bfa', biome: 'mountain' },
  soul:    { name: 'Soul',    icon: '🌌', color: '#22d3ee', biome: 'ocean'    },
  craft:   { name: 'Craft',   icon: '⚒️', color: '#fbbf24', biome: 'desert'   },
  social:  { name: 'Social',  icon: '🫂', color: '#5eead4', biome: 'meadow'   },
  growth:  { name: 'Growth',  icon: '🌱', color: '#a3e635', biome: 'meadow'   },
}

// Habit frequencies
export const FREQUENCIES = ['daily', 'weekly', 'weekdays', 'custom']

// Mock leaderboard "other travelers" — purely cosmetic, the user sees themselves too
export const MOCK_TRAVELERS = [
  { name: 'Nova',      title: 'Pathfinder', xp: 4200, streak: 41, badges: 7 },
  { name: 'Orion',     title: 'Champion',   xp: 7800, streak: 22, badges: 9 },
  { name: 'Lyra',      title: 'Sage',       xp: 11200, streak: 67, badges: 14 },
  { name: 'Vega',      title: 'Adventurer', xp: 2100, streak: 9,  badges: 4 },
  { name: 'Cassio',    title: 'Initiate',   xp: 980,  streak: 5,  badges: 2 },
  { name: 'Rin',       title: 'Mythwalker', xp: 9600, streak: 30, badges: 12 },
  { name: 'Kai',       title: 'Champion',   xp: 6300, streak: 18, badges: 8 },
  { name: 'Mira',      title: 'Grandmaster',xp: 18100, streak: 122,badges: 21 },
]

// Pet catalog — hatchable
export const PETS = [
  { id: 'sprig',   name: 'Sprig',   icon: '🌱', cost: 50,   bonus: 'XP +5%',  desc: 'A tiny seedling of potential.' },
  { id: 'ember',   name: 'Ember',   icon: '🔥', cost: 120,  bonus: 'Streak +1 freeze', desc: 'A warm spark that forgives a miss.' },
  { id: 'tide',    name: 'Tide',    icon: '🌊', cost: 200,  bonus: 'Energy regen +5', desc: 'Restores your energy each day.' },
  { id: 'phoenix', name: 'Phoenix', icon: '🦜', cost: 500,  bonus: 'Revive once', desc: 'Revives a broken streak once.' },
  { id: 'wolf',    name: 'Wolf',    icon: '🐺', cost: 350,  bonus: 'Hard +15% XP', desc: 'Loves a challenge.' },
  { id: 'owl',     name: 'Owl',     icon: '🦉', cost: 300,  bonus: 'Mind +10% XP', desc: 'A wise night companion.' },
]

// Achievements (defines the constellation graph)
export const ACHIEVEMENTS = [
  { id: 'first_step',    name: 'First Step',     icon: '👣', desc: 'Complete your first habit.',          xp: 25  },
  { id: 'streak_3',      name: 'Kindling',        icon: '🔥', desc: 'Reach a 3-day streak on any habit.',  xp: 30  },
  { id: 'streak_7',      name: 'Week of Will',    icon: '⚡', desc: 'Reach a 7-day streak on any habit.',  xp: 80  },
  { id: 'streak_30',     name: 'Lunar Cycle',     icon: '🌙', desc: 'Reach a 30-day streak.',              xp: 300 },
  { id: 'streak_100',    name: 'Solstice',        icon: '☀️', desc: 'Reach a 100-day streak.',             xp: 1500},
  { id: 'level_5',       name: 'Apprentice',      icon: '🎓', desc: 'Reach Level 5.',                      xp: 100 },
  { id: 'level_10',      name: 'Adept',           icon: '📜', desc: 'Reach Level 10.',                     xp: 250 },
  { id: 'level_25',      name: 'Mythic',          icon: '🌌', desc: 'Reach Level 25.',                     xp: 1000},
  { id: 'boss_1',        name: 'First Blood',     icon: '⚔️', desc: 'Defeat your first weekly boss.',     xp: 200 },
  { id: 'combo_5',       name: 'On Fire',         icon: '🧨', desc: 'Hit a 5x combo in a single day.',     xp: 60  },
  { id: 'mood_7',        name: 'Inner Weather',   icon: '🌦️', desc: 'Log your mood 7 days in a row.',      xp: 120 },
  { id: 'all_biomes',    name: 'World Builder',   icon: '🗺️', desc: 'Grow every biome at least once.',      xp: 400 },
  { id: 'pet_hatch',     name: 'Companion',       icon: '🐣', desc: 'Hatch your first pet.',               xp: 80  },
  { id: 'fusion_1',      name: 'Alchemist',       icon: '🧪', desc: 'Perform your first habit fusion.',    xp: 200 },
  { id: 'perfect_day',   name: 'Perfect Day',     icon: '💎', desc: 'Complete every daily habit in a day.',xp: 150 },
  { id: 'gems_500',      name: 'Hoarder',         icon: '💰', desc: 'Earn 500 gems.',                      xp: 250 },
]
