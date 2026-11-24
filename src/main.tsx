import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import { I18nProvider } from './i18n/I18n'
import { AuthProvider, useAuth } from './lib/auth'
import { DesignSystem } from './screens/DesignSystem'
import { Login } from './screens/Login'
import { PathMap } from './screens/PathMap'
import { Onboarding } from './screens/Onboarding'
import { LessonRoute } from './screens/Lesson'
import { useProfile } from './lib/profile'
import { Sprout } from './ds/Sprout'
import { BuddyProvider } from './ds/buddies'
import { PaperGrid } from './ds/PaperGrid'
import type { ReactNode } from 'react'

function Home() {
  const { user, ready } = useAuth()
  const { profile, loaded, save } = useProfile(user?.id)
  if (!ready || (user && !loaded)) return <div className="min-h-dvh grid place-items-center"><Sprout size={96} stage={0} mood="calm" /></div>
  if (!user) return <Login />
  if (!profile && !new URLSearchParams(location.search).has('preview')) return <Onboarding user={user} onDone={save} />
  return <PathMap profile={profile} />
}

/** Every Piko on every screen is the one this child picked. */
function ChosenBuddy({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  return <BuddyProvider id={profile?.buddy ?? 'robot'}>{children}</BuddyProvider>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <PaperGrid />
        <ChosenBuddy>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/lesson/:id" element={<LessonRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
        </ChosenBuddy>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
)
