import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import './index.css'
import './worlds/worlds.css'
import { I18nProvider } from './i18n/I18n'
import { AuthProvider, useAuth } from './lib/auth'
import { DesignSystem } from './screens/DesignSystem'
import { Login } from './screens/Login'
import { PathMap } from './screens/PathMap'
import { Onboarding } from './screens/Onboarding'
import { LessonRoute } from './screens/Lesson'
import { Arcade } from './lesson/Arcade'
import { TileView } from './lesson/KidSteps'
import { BarGraph } from './lesson/Pictures'
import type { Tile } from './curriculum/lessonTypes'
import { useProfile } from './lib/profile'
import { Sprout } from './ds/Sprout'
import { BuddyProvider } from './ds/buddies'
import type { ReactNode } from 'react'
import { installTapSound } from './lib/sfx'
import { currentWorld, setCurrentWorld } from './worlds/current'
import { setCurrentStage } from './curriculum/stage'
import { carryFromLink, pullCloud } from './lib/cloud'
import { WorldBackdrop } from './worlds/Theme'

/** Arriving from the demo's "move my progress" link: keep it for the first sign-in, then go home. */
function MoveIn() {
  const { data } = useParams()
  const { user, ready } = useAuth()
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!ready || done || !data) return
    carryFromLink(data)
    setDone(true)
    // already signed in: merge it into the cloud copy now
    if (user) void pullCloud(user.id).then(() => location.replace(location.pathname))
  }, [ready, done, data, user])
  if (done && !user) return <Navigate to="/" replace />
  return <div className="min-h-dvh grid place-items-center"><Sprout size={96} stage={0} mood="calm" /></div>
}

/** Dev only: a break game on its own, to try it without playing a lesson part first. */
function PlayPreview() {
  const { game } = useParams()
  return <div className="max-w-3xl mx-auto p-4"><Arcade key={game} step={{ kind: 'arcade', game: game as 'dart', title: { he: game ?? '', en: game ?? '' }, seconds: 90 }} report={() => {}} /></div>
}

/** Dev only: every school picture once, to check how they look. */
function PicturesPreview() {
  const tiles: Tile[] = [{ clock: [3, 0] }, { clock: [7, 30] }, { clock: [10, 45] }, { coins: [10, 5, 2, 1, 1] }, { frac: [1, 4, 'pie'] }, { frac: [2, 3, 'bar'] }, { frac: [1, 2, 'pie', true] },
    { bar: { len: 9, ruler: true } }, { bar: { len: 12, color: '#6db7ff' } }, { poly: 'tri' }, { poly: 'rect' }, { poly: 'hex' }, { solid: 'cube' }, { solid: 'sphere' }, { solid: 'cylinder' }, { solid: 'cone' }, { solid: 'pyramid' }, { dice: [5] }, { dice: [3, 6] }, { frame: 7 }]
  return <div className="p-4 grid grid-cols-3 sm:grid-cols-5 gap-3">{tiles.map((t, i) => <div key={i} className="card p-3 grid place-items-center"><TileView tile={t} /></div>)}<div className="card p-3 col-span-3"><BarGraph items={[{ e: '🍎', n: 5 }, { e: '🍌', n: 8 }, { e: '🍓', n: 3 }]} /></div></div>
}

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
  // the world the child loves (onboarding) drives the questions, the pictures and the look of every screen
  setCurrentWorld(profile?.goal)
  // the stage (pre-K, kindergarten, first, second grade) picks the year and how hard it is
  setCurrentStage(profile?.age)
  return <BuddyProvider id={profile?.buddy ?? 'robot'}><WorldBackdrop world={currentWorld()} />{children}</BuddyProvider>
}

installTapSound()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <ChosenBuddy>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/lesson/:id" element={<LessonRoute />} />
            <Route path="/move/:data" element={<MoveIn />} />
            {import.meta.env.DEV && <Route path="/play/:game" element={<PlayPreview />} />}
            {import.meta.env.DEV && <Route path="/pictures" element={<PicturesPreview />} />}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
        </ChosenBuddy>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
)
