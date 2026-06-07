// HABITAT service worker — handles:
//   1. Offline app shell (cache-first for static assets)
//   2. Periodic background sync for daily reminder notifications
//
// This is a no-op if the browser doesn't support the API (Safari, etc.).
// In that case the in-page scheduler (src/lib/reminder.js) takes over.

const CACHE = 'habitat-v1'
const ASSETS = ['/', '/index.html', '/favicon.svg']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim())
})

// Network-first for the app shell, cache fallback
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {})
        return res
      })
      .catch(() => caches.match(e.request))
  )
})

// Receive a reminder schedule from the page: { hour, minute }
self.addEventListener('message', (e) => {
  const { type, hour, minute, title, body } = e.data || {}
  if (type === 'SCHEDULE') scheduleNext(hour, minute, title, body)
  if (type === 'CANCEL') clearAll()
})

let timer = null
const clearAll = () => { if (timer) { clearTimeout(timer); timer = null } }

const scheduleNext = (hour, minute, title = 'HABITAT awaits', body = 'Your world is withering. Plant a habit today.') => {
  clearAll()
  const now = new Date()
  const next = new Date()
  next.setHours(hour, minute, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)
  const ms = next - now
  timer = setTimeout(() => {
    self.registration.showNotification(title, {
      body, icon: '/favicon.svg', badge: '/favicon.svg', tag: 'habitat-daily',
      renotify: true, requireInteraction: false,
    })
    // reschedule for the next day
    scheduleNext(hour, minute, title, body)
  }, ms)
}

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((list) => {
    if (list.length) return list[0].focus()
    return self.clients.openWindow('/')
  }))
})
