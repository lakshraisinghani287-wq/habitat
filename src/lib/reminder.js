// Daily reminder — schedules a browser notification at a chosen time each day.
// Two paths:
//   1. Service worker (preferred): survives page close, works offline.
//   2. In-page setTimeout fallback for browsers without SW / notification support.

let swReg = null
let inPageTimer = null

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null
  try {
    swReg = await navigator.serviceWorker.register('/sw.js')
    return swReg
  } catch (e) {
    console.warn('[habitat/sw] register failed', e)
    return null
  }
}

const canNotify = () => 'Notification' in window && Notification.permission === 'granted'

export const requestNotifyPermission = async () => {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  const res = await Notification.requestPermission()
  return res
}

const fireInPage = (title, body) => {
  if (canNotify()) new Notification(title, { body, icon: '/favicon.svg', tag: 'habitat-daily' })
}

const scheduleInPage = (hour, minute, title, body) => {
  if (inPageTimer) clearTimeout(inPageTimer)
  const now = new Date()
  const next = new Date()
  next.setHours(hour, minute, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)
  const ms = next - now
  inPageTimer = setTimeout(() => {
    fireInPage(title, body)
    scheduleInPage(hour, minute, title, body)
  }, ms)
}

export const scheduleReminder = async ({ hour, minute, title = 'HABITAT awaits', body = 'Your world is withering. Plant a habit today.' }) => {
  if (swReg?.active) {
    swReg.active.postMessage({ type: 'SCHEDULE', hour, minute, title, body })
  } else {
    scheduleInPage(hour, minute, title, body)
  }
}

export const cancelReminder = () => {
  if (swReg?.active) swReg.active.postMessage({ type: 'CANCEL' })
  if (inPageTimer) { clearTimeout(inPageTimer); inPageTimer = null }
}

const STORE_KEY = 'habitat-reminder-v1'

export const getSavedReminder = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null') } catch { return null }
}
export const saveReminder = (cfg) => {
  if (cfg) localStorage.setItem(STORE_KEY, JSON.stringify(cfg))
  else localStorage.removeItem(STORE_KEY)
}
