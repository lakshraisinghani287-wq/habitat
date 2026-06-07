// Cloud sync — pushes the persisted game state to Supabase on every change,
// and pulls the latest on sign-in. The local Zustand store is still the
// source of truth for the UI; this is a one-way write + one-shot read.
import { supabase, isCloudEnabled } from '../lib/supabase'

const TABLE = 'habitat_profiles'

// Strip ephemeral fields that don't belong in the cloud
const clean = (state) => {
  const { notifications, ...rest } = state
  return rest
}

let saveTimer = null

// Wire a Zustand store to cloud sync. Returns a teardown fn.
export const attachSync = (useStore, getUserId) => {
  if (!isCloudEnabled()) return () => {}

  const write = async () => {
    const userId = await getUserId()
    if (!userId) return
    const payload = clean(useStore.getState())
    try {
      await supabase.from(TABLE).upsert({
        user_id: userId,
        data: payload,
        updated_at: new Date().toISOString(),
      })
    } catch (e) {
      console.warn('[habitat/cloud] write failed', e)
    }
  }

  // Debounced write on any state change
  const unsub = useStore.subscribe(() => {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(write, 1500)
  })

  // Initial pull
  const pull = async () => {
    const userId = await getUserId()
    if (!userId) return
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('data')
        .eq('user_id', userId)
        .maybeSingle()
      if (error) throw error
      if (data?.data) useStore.setState(data.data)
    } catch (e) {
      console.warn('[habitat/cloud] pull failed', e)
    }
  }
  pull()

  return unsub
}

export const signOutCloud = async () => {
  if (!isCloudEnabled()) return
  await supabase.auth.signOut()
}
