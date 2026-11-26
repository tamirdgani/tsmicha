import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { carryDemo, pullCloud } from './cloud'
import { DEMO, supabase } from './supabase'

export { DEMO, supabase }

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
    // a signed-in parent: bring the child's progress from the cloud before the first screen draws
    const arrive = async (u: Parameters<typeof fromSupabase>[0] | null) => {
      if (u) await pullCloud(u.id)
      setUser(u ? fromSupabase(u) : null)
      setReady(true)
    }
    let current: string | null = null
    supabase.auth.getSession().then(({ data }) => { current = data.session?.user.id ?? null; void arrive(data.session?.user ?? null) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const id = session?.user.id ?? null
      if (id === current) return // token refreshes: same parent, nothing to reload
      current = id
      void arrive(session?.user ?? null)
    })
    // back from Google: drop the ?code= from the address once it has been used
    if (new URLSearchParams(location.search).has('code')) history.replaceState(null, '', location.pathname + location.hash)
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = useMemo<Ctx>(() => ({
    user,
    ready,
    async signInWithGoogle() {
      if (supabase) {
        carryDemo()
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + window.location.pathname } })
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
