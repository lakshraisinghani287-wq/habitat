// Thin Supabase wrapper. If the env vars aren't set, the client is null and
// the app falls back to local-only mode. This means the same build works
// locally without secrets and on Vercel once you add them.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (url && anon) ? createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
}) : null

export const isCloudEnabled = () => !!supabase
