// Daily ZenQuotes fetcher — caches one quote per day in localStorage so we
// only hit the network once per calendar day. Falls back to a small built-in
// library if the request fails (offline, rate-limited, blocked, etc).
import { useEffect, useState } from 'react'
import { todayKey } from './constants'

const STORAGE_KEY = 'habitat-quote-v1'
const CACHE_DAYS = 30 // how many days of cache to keep

const FALLBACK_QUOTES = [
  { q: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', a: 'Aristotle' },
  { q: 'Small daily improvements are the key to staggering long-term results.', a: 'Robin Sharma' },
  { q: 'Discipline is choosing between what you want now and what you want most.', a: 'Abraham Lincoln' },
  { q: 'The cave you fear to enter holds the treasure you seek.', a: 'Joseph Campbell' },
  { q: 'A river cuts through rock not by its power, but by its persistence.', a: 'James N. Watkins' },
  { q: 'You do not rise to the level of your goals. You fall to the level of your systems.', a: 'James Clear' },
  { q: 'What we do every day matters more than what we do once in a while.', a: 'Gretchen Rubin' },
  { q: 'The best time to plant a tree was twenty years ago. The second best time is now.', a: 'Chinese Proverb' },
  { q: 'Sow a thought, reap an action. Sow an action, reap a habit. Sow a habit, reap a character.', a: 'Stephen Covey' },
  { q: 'A journey of a thousand miles begins with a single step.', a: 'Lao Tzu' },
  { q: 'The world breaks everyone, and afterward, some are strong at the broken places.', a: 'Ernest Hemingway' },
  { q: 'You have power over your mind — not outside events. Realize this, and you will find strength.', a: 'Marcus Aurelius' },
]

const readCache = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
const writeCache = (cache) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cache.slice(-CACHE_DAYS))) } catch {}
}

const pickFallback = () => FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]

// Synchronous: returns today's quote from cache or a deterministic fallback.
export const getTodaysQuote = () => {
  const today = todayKey()
  const cache = readCache()
  const found = cache.find((c) => c.day === today)
  if (found) return found
  // Deterministic fallback for the day so it doesn't shuffle mid-session.
  const dayNum = parseInt(today.replaceAll('-', ''), 10) || 0
  const fb = FALLBACK_QUOTES[dayNum % FALLBACK_QUOTES.length]
  return { ...fb, day: today, source: 'fallback' }
}

// Async: try to fetch a fresh one, cache it, return updated.
const fetchAndCache = async () => {
  try {
    const res = await fetch('https://zenquotes.io/api/today', { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data) || !data[0]?.q) throw new Error('bad shape')
    const entry = { q: data[0].q, a: data[0].a, day: todayKey(), source: 'zenquotes' }
    const cache = readCache().filter((c) => c.day !== entry.day)
    cache.push(entry)
    writeCache(cache)
    return entry
  } catch {
    return null
  }
}

// React hook — returns today's quote and refreshes from network on mount.
export const useDailyQuote = () => {
  const [quote, setQuote] = useState(() => getTodaysQuote())
  useEffect(() => {
    let alive = true
    // Only hit the network if we don't have a fresh one already.
    const have = readCache().some((c) => c.day === todayKey() && c.source === 'zenquotes')
    if (!have) {
      fetchAndCache().then((fresh) => {
        if (alive && fresh) setQuote(fresh)
      })
    }
    return () => { alive = false }
  }, [])
  return quote
}
