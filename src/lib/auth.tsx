import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** null when the project has no Supabase keys yet — the app then runs in demo mode. */
export const supabase: SupabaseClient | null = URL && KEY ? createClient(URL, KEY) : null
export const DEMO = !supabase

export type User = { id: string; name: string; firstName: string; avatar?: string; email?: string }

type Ctx = {
  user: User | null
  ready: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthCtx = createContext<Ctx | null>(null)
const DEMO_KEY = 'kfitza.demoUser'

function fromSupabase(u: { id: string; email?: string; user_metadata?: Record<string, unknown> }): User {
  const m = u.user_metadata ?? {}
  const name = String(m.full_name ?? m.name ?? u.email?.split('@')[0] ?? '')
  return { id: u.id, name, firstName: name.split(' ')[0], avatar: (m.avatar_url ?? m.picture) as string | undefined, email: u.email }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) {
      try { const raw = localStorage.getItem(DEMO_KEY); if (raw) setUser(JSON.parse(raw)) } catch { /* ignore */ }
      setReady(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session ? fromSupabase(data.session.user) : null)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session ? fromSupabase(session.user) : null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = useMemo<Ctx>(() => ({
    user,
    ready,
    async signInWithGoogle() {
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
        if (error) throw error
        return
      }
      // Demo: a short pause so the button's loading state is visible, then a local user.
      await new Promise((r) => setTimeout(r, 900))
      const demo: User = { id: 'demo', name: 'נועה לוי', firstName: 'נועה' }
      try { localStorage.setItem(DEMO_KEY, JSON.stringify(demo)) } catch { /* ignore */ }
      setUser(demo)
    },
    async signOut() {
      if (supabase) await supabase.auth.signOut()
      try { localStorage.removeItem(DEMO_KEY) } catch { /* ignore */ }
      setUser(null)
    },
  }), [user, ready])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const c = useContext(AuthCtx)
  if (!c) throw new Error('useAuth outside provider')
  return c
}
