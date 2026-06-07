import { useGame } from '../store/useGame'
import { Card, SectionTitle } from '../components/Card'
import { Icon } from '../components/Icon'
import { SHOP } from '../lib/achievements'
import { ShopPreview } from '../components/ShopPreviews'
import { motion } from 'framer-motion'

const BMC_URL = 'https://www.buymeacoffee.com/YOUR_HANDLE'

export const Shop = () => {
  const gems = useGame((s) => s.gems)
  const buy = useGame((s) => s.buyShopItem)
  const inventory = useGame((s) => s.inventory)
  const owned = useGame((s) => s.user.cosmetics)

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label text-neon-cyan">Bazaar of wonders</div>
          <h1 className="h-display text-2xl sm:text-3xl text-white">Shop</h1>
          <p className="text-sm text-slate-400 mt-1">Spend gems earned from your discipline.</p>
        </div>
        <div className="chip text-neon-cyan border-neon-cyan/40">
          <Icon name="gem" className="w-3.5 h-3.5" /> {gems} 💎
        </div>
      </div>

      {/* Support / Buy Me a Coffee */}
      <Card glow className="bg-gradient-to-br from-neon-amber/10 via-transparent to-neon-pink/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-2xl">☕</div>
            <div>
              <div className="h-display text-white">Support HABITAT</div>
              <div className="text-xs text-slate-400">Keep the world growing. Every tip funds new biomes & features.</div>
            </div>
          </div>
          <a
            href={BMC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            Buy me a coffee
          </a>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SHOP.map((it, i) => {
          const have = owned.includes(it.id) || (inventory[it.id] || 0) > 0
          return (
            <motion.div key={it.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card glow={have}>
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <ShopPreview kind={it.preview} icon={it.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="h-display text-white">{it.name}</div>
                      <span className="chip capitalize">{it.type}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{it.desc}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm font-mono text-neon-cyan">{it.cost} 💎</div>
                      <button
                        disabled={have || gems < it.cost}
                        onClick={() => buy(it)}
                        className={`btn-primary text-xs ${(have || gems < it.cost) ? 'opacity-50 pointer-events-none' : ''}`}>
                        {have ? 'Owned' : 'Buy'}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
