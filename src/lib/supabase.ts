import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** null when the build has no Supabase keys (the claude.ai preview): the app then runs in demo mode, saving on the device only. */
export const supabase: SupabaseClient | null = URL && KEY ? createClient(URL, KEY, { auth: { flowType: 'pkce' } }) : null // pkce: the sign-in comes back as ?code=, which the # router leaves alone
export const DEMO = !supabase
/** Where the real app lives (with Google sign-in), for the "move my progress there" link in the demo. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? ''
