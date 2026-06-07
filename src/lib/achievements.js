// Hand-curated mock data for the weekly boss — bosses rotate
export const BOSSES = [
  {
    id: 'procrastination',
    name: 'The Procrastination Hydra',
    icon: '🐉',
    flavor: 'It grows a new head for every task you postpone.',
    hp: 100,
    rewards: { xp: 250, gems: 30 },
  },
  {
    id: 'doubt',
    name: 'The Wyrm of Doubt',
    icon: '🐍',
    flavor: 'Its whispers are sharpest at sunrise.',
    hp: 120,
    rewards: { xp: 300, gems: 40 },
  },
  {
    id: 'comfort',
    name: 'The Comfort Kraken',
    icon: '🐙',
    flavor: 'It drags dreamers back to the shallows.',
    hp: 150,
    rewards: { xp: 400, gems: 50 },
  },
]

// Fusion recipes — combine two habit categories to unlock a mastery perk
export const FUSIONS = [
  { id: 'mind_body',   a: 'mind',  b: 'body',  name: 'Iron Clarity',  icon: '⚔️', desc: '+10% XP on hard habits of either type.', xp: 200 },
  { id: 'soul_social', a: 'soul',  b: 'social',name: 'Radiant Heart', icon: '✨', desc: 'Streaks grant +1 gem per day.',           xp: 220 },
  { id: 'craft_growth',a: 'craft', b: 'growth',name: 'Seed of Skill', icon: '🌳', desc: 'New habits start with a 3-day boost.',     xp: 240 },
  { id: 'body_growth', a: 'body',  b: 'growth',name: 'Verdant Vitality', icon: '🌿', desc: 'Energy regen +3.',                       xp: 180 },
]

// Shop items — each with a real SVG preview component
export const SHOP = [
  // Themes
  { id: 'theme_void',     name: 'Void Theme',     icon: '🕳️', type: 'theme',     cost: 200, desc: 'A deeper, darker aesthetic.',            preview: 'void' },
  { id: 'theme_aurora',   name: 'Aurora Theme',   icon: '🌈', type: 'theme',     cost: 300, desc: 'Shimmering northern lights.',           preview: 'aurora' },
  { id: 'theme_ember',    name: 'Ember Theme',    icon: '🔥', type: 'theme',     cost: 320, desc: 'Warm volcanic palette, glowing edges.',  preview: 'ember' },
  { id: 'theme_zen',      name: 'Zen Theme',      icon: '🎋', type: 'theme',     cost: 280, desc: 'Soft greens and gentle pinks.',          preview: 'zen' },

  // Avatar frames (cosmetic)
  { id: 'frame_gold',     name: 'Gold Frame',     icon: '🖼️', type: 'cosmetic',  cost: 150, desc: 'A gilded frame around your avatar.',     preview: 'frame_gold' },
  { id: 'frame_neon',     name: 'Neon Frame',     icon: '🟣', type: 'cosmetic',  cost: 120, desc: 'A pulsing neon frame.',                  preview: 'frame_neon' },
  { id: 'frame_runic',    name: 'Runic Frame',    icon: '🜂', type: 'cosmetic',  cost: 220, desc: 'Ancient glyphs orbit your sigil.',       preview: 'frame_runic' },
  { id: 'frame_cosmic',   name: 'Cosmic Frame',   icon: '🌌', type: 'cosmetic',  cost: 380, desc: 'A galaxy swirls behind you.',            preview: 'frame_cosmic' },

  // Biome recolors
  { id: 'biome_neon',     name: 'Neon Forest',    icon: '🌳', type: 'biome',     cost: 260, desc: 'Recolor your habitat forest in neon.',   preview: 'biome_neon' },
  { id: 'biome_lava',     name: 'Lava Mountains', icon: '🌋', type: 'biome',     cost: 260, desc: 'Molten peaks replace the snow caps.',    preview: 'biome_lava' },

  // Boosts
  { id: 'boost_double',   name: 'Double XP (1d)', icon: '⚡', type: 'boost',     cost: 80,  desc: 'Doubles XP earned for 24 hours.',         preview: 'boost' },
  { id: 'boost_shield',   name: 'Streak Shield',  icon: '🛡️', type: 'boost',     cost: 60,  desc: 'Protects a streak from one miss.',       preview: 'shield' },
  { id: 'boost_magnet',   name: 'XP Magnet (3d)', icon: '🧲', type: 'boost',     cost: 140, desc: 'Earn +25% XP for 72 hours.',             preview: 'magnet' },
]

// Preview kinds — referenced by the Shop page
export const SHOP_PREVIEW_KINDS = ['void', 'aurora', 'ember', 'zen', 'frame_gold', 'frame_neon', 'frame_runic', 'frame_cosmic', 'biome_neon', 'biome_lava', 'boost', 'shield', 'magnet']
