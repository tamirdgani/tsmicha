import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { LESSONS } from '../curriculum/lessons'
import { FIN_LIT, NEXT_COURSES, allNodes, type NodeKind, type PathNode, type Unit } from '../curriculum/course'
import { Icon, type IconName } from '../ds/Icon'
import { Sprout } from '../ds/Sprout'
import { CountUp, Logo, Ring, Toast, clock, useNow } from '../ds/ui'
import { useI18n } from '../i18n/I18n'
import type { StrKey } from '../i18n/strings'
import { useAuth, type User } from '../lib/auth'
import { Emo } from '../worlds/Art'
import { art } from '../worlds/kits'
import { WorldButton, worldKit } from '../worlds/Theme'
import { focusUnits, goalXp, resetLearner, type Profile as LearnerProfile } from '../lib/profile'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { BADGES, PARTS_PER_LESSON, currentNode, lockOf, levelOf, nodeStates, sproutStage, useProgress, type NodeState, type Progress } from '../lib/progress'
import { useSound } from '../lib/sfx'

/* fill + on: the step circle and its icon (≥3:1 against the page and each other, both themes).
   soft + ink: badges and labels for that kind (≥4.5:1). */
const KIND: Record<NodeKind, { icon: IconName; fill: string; on: string; soft: string; ink: string; edge?: string }> = {
  // pastel circles with a dark icon on top (the icon carries the contrast, ≥4.5:1 on every fill)
  lesson: { icon: 'book', fill: 'var(--primary)', on: 'var(--primary-foreground)', soft: 'var(--brand-soft)', ink: 'var(--brand-ink)', edge: 'var(--color-leaf-700)' },
  checkpoint: { icon: 'flag', fill: 'var(--color-berry)', on: 'var(--on-pastel)', soft: 'var(--berry-soft)', ink: 'var(--color-berry-ink)', edge: 'var(--berry-strong)' },
  review: { icon: 'refresh', fill: 'var(--color-sky)', on: 'var(--on-pastel)', soft: 'var(--sky-soft)', ink: 'var(--color-sky-ink)', edge: 'var(--sky-strong)' },
  test: { icon: 'trophy', fill: 'var(--color-sun)', on: 'var(--on-pastel)', soft: 'var(--sun-soft)', ink: 'var(--color-sun-ink)', edge: 'var(--sun-strong)' },
}

const UNITS = FIN_LIT.units.length
const PAGES = UNITS + 1 // the last page shows the courses that come after this one

export function PathMap({ profile }: { profile: LearnerProfile | null }) {
  const { user: authUser } = useAuth()
  const user = authUser && profile ? { ...authUser, firstName: profile.name } : authUser
  const raw = useProgress(user?.id)
  const p = useMemo(() => (profile ? { ...raw, dailyGoal: goalXp(profile.minutes) } : raw), [raw, profile])
  const forYou = useMemo(() => new Set(profile ? focusUnits(profile) : []), [profile])
  const states = useMemo(() => nodeStates(p), [p])
  const cur = currentNode(p)
  // A part failed on a first try rests for a while: the current step shows the countdown instead of "Start".
  const now = useNow(Object.keys(p.locks ?? {}).length > 0)
  const restLock = lockOf(p, cur.node.id, now)
  const rest = restLock ? clock(restLock.until - now) : null
  const [toast, setToast] = useState<string | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const { t, dir } = useI18n()
  const navigate = useNavigate()
  const clearToast = useCallback(() => setToast(null), [])
  const start = useCallback((id: string) => { if (LESSONS[id]) navigate(`/lesson/${id}`); else setToast(t('map.soon')) }, [navigate, t])

  // One unit per screen. Opens on the unit the learner is in.
  const [page, setPage] = useState(cur.unitIndex)
  const [moveSign, setMoveSign] = useState(1)
  useEffect(() => setPage(cur.unitIndex), [cur.unitIndex])
  const go = useCallback((i: number) => {
    const n = Math.max(0, Math.min(PAGES - 1, i))
    setPage((old) => { if (n !== old) setMoveSign(n > old ? 1 : -1); return n })
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (moreOpen || (e.target as HTMLElement)?.closest?.('input,textarea')) return
      const fwd = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
      const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
      if (e.key === fwd) go(page + 1)
      else if (e.key === back) go(page - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dir, go, page, moreOpen])

  // Screen direction of "forward": next unit sits to the left in Hebrew, to the right in English.
  const fwdX = dir === 'rtl' ? -1 : 1
  const slide = {
    enter: (s: number) => ({ x: `${s * fwdX * 60}%`, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (s: number) => ({ x: `${-s * fwdX * 60}%`, opacity: 0 }),
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <TopBar user={user!} p={p} onProgress={() => setMoreOpen(true)} />
      <div className="flex-1 min-h-0 w-full max-w-6xl mx-auto px-4 sm:px-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 min-h-0 flex flex-col pt-3 sm:pt-5 pb-3 lg:pb-6">
          <UnitPager p={p} page={page} onGo={go} />
          <UnitBanner page={page} forYou={page < UNITS && forYou.has(FIN_LIT.units[page].id)} states={states} onGo={go} />
          <div className="flex-1 min-h-0 relative">
            <AnimatePresence initial={false} custom={moveSign}>
              <motion.div key={page} custom={moveSign} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ x: { type: 'spring', stiffness: 320, damping: 34 }, opacity: { duration: 0.2 } }}
                className="absolute inset-0 touch-pan-y"
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} dragSnapToOrigin
                onDragEnd={(_, info) => {
                  const d = info.offset.x * fwdX
                  if (d < -70 || info.velocity.x * fwdX < -500) go(page + 1)
                  else if (d > 70 || info.velocity.x * fwdX > 500) go(page - 1)
                }}>
                {page < UNITS
                  ? <UnitPath unit={FIN_LIT.units[page]} states={states} parts={p.parts} currentId={cur.node.id} rest={rest} onStart={start} />
                  : <NextCourses />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="lg:hidden pt-2"><ContinueCard p={p} rest={rest} onStart={start} compact /></div>
        </main>
        <aside className="hidden lg:flex flex-col gap-3 py-5 min-h-0">
          <div className="[@media(max-height:820px)]:hidden"><Greeting user={user!} /></div>
          <ContinueCard p={p} rest={rest} onStart={start} />
          <DailyGoal p={p} />
          <SproutCard p={p} />
          <div className="[@media(max-height:900px)]:hidden"><Badges p={p} /></div>
        </aside>
      </div>
      <ProgressSheet open={moreOpen} onClose={() => setMoreOpen(false)} user={user!} p={p} />
      <AnimatePresence>{toast && <Toast key="t" text={toast} onDone={clearToast} />}</AnimatePresence>
    </div>
  )
}

/** Phones: daily goal, sprout and badges open from the top bar in a sheet. */
function ProgressSheet({ open, onClose, user, p }: { open: boolean; onClose: () => void; user: User; p: Progress }) {
  const { t } = useI18n()
  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="bottom" className="lg:hidden rounded-t-2xl gap-3 p-4 pb-6 max-w-lg mx-auto">
        <SheetHeader className="p-0 pe-8">
          <SheetTitle className="t-h2 text-start">{t('map.progress')}</SheetTitle>
          <SheetDescription className="sr-only">{user.firstName}</SheetDescription>
        </SheetHeader>
        <DailyGoal p={p} />
        <SproutCard p={p} />
        <Badges p={p} />
      </SheetContent>
    </Sheet>
  )
}

/* ─────────────────────────── Top bar ─────────────────────────── */

function TopBar({ user, p, onProgress }: { user: User; p: Progress; onProgress: () => void }) {
  const { t, num } = useI18n()
  const lv = levelOf(p.xp)
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--bg) 86%, transparent)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center gap-2 sm:gap-3">
        <Logo size={28} />
        <div className="flex-1" />
        <div className="chip chip-flame" title={t('top.streak')} aria-label={`${t('top.streak')}: ${p.streak}`}>
          <Icon name="flame" size={18} style={{ color: p.streak ? 'var(--flame-strong)' : 'var(--ink-3)' }} />
          <span className="t-num">{num(p.streak)}</span>
        </div>
        <div className="chip chip-sun" title={t('top.xp')} aria-label={`${t('top.xp')}: ${p.xp}`}>
          <Icon name="xp" size={18} style={{ color: 'var(--color-sun)' }} />
          <CountUp to={p.xp} />
        </div>
        <button className="lg:hidden grid place-items-center border-0 bg-transparent cursor-pointer p-0" aria-label={t('map.progress')} onClick={onProgress}>
          <Ring value={p.todayXp / p.dailyGoal} size={38} stroke={4} color={p.todayXp >= p.dailyGoal ? 'var(--brand)' : 'var(--sun-strong)'}>
            <Icon name={p.todayXp >= p.dailyGoal ? 'check' : 'target'} size={16} style={{ color: p.todayXp >= p.dailyGoal ? 'var(--brand)' : 'var(--color-sun-ink)' }} />
          </Ring>
        </button>
        <div className="hidden lg:flex items-center" title={`${t('top.level')} ${lv.level}`}>
          <Ring value={lv.into / lv.need} size={40} stroke={4}>
            <span className="t-caption font-bold t-num" style={{ fontSize: 13 }}>{num(lv.level)}</span>
          </Ring>
        </div>
        <WorldButton />
        <UserMenu user={user} />
      </div>
    </header>
  )
}

function UserMenu({ user }: { user: User }) {
  const { t, lang, setLang, theme, setTheme } = useI18n()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const initials = user.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  const [resetOpen, setResetOpen] = useState(false)
  const [sound, setSound] = useSound()
  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full p-0.5 cursor-pointer border-0 bg-transparent outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
        <Avatar className="size-9">
          {user.avatar && <AvatarImage src={user.avatar} alt="" referrerPolicy="no-referrer" />}
          <AvatarFallback className="font-semibold" style={{ background: 'var(--brand-soft)', color: 'var(--brand-ink)' }}>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="font-semibold truncate">{user.name}</div>
          {user.email && <div className="text-xs text-muted-foreground truncate">{user.email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setLang(lang === 'he' ? 'en' : 'he')}><Icon name="globe" size={16} />{t('menu.lang')}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />{theme === 'dark' ? t('menu.theme.light') : t('menu.theme.dark')}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSound(!sound)}><Icon name={sound ? 'mute' : 'volume'} size={16} />{t(sound ? 'sound.off' : 'sound.on')}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/design-system')}><Icon name="sparkle" size={16} />{t('menu.ds')}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setResetOpen(true)}><Icon name="refresh" size={16} />{t('menu.reset')}</DropdownMenuItem>
        <DropdownMenuItem onSelect={signOut}><Icon name="logout" size={16} />{t('menu.signout')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
      <AlertDialogContent className="sm:max-w-sm text-center">
        <AlertDialogHeader className="items-center text-center sm:text-center">
          <Sprout size={88} stage={1} mood="think" />
          <AlertDialogTitle className="t-h2">{t('menu.reset.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('menu.reset.body')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction variant="default" size="xl" className="w-full m-0" onClick={() => { resetLearner(user.id); navigate('/') }}>{t('menu.reset.yes')}</AlertDialogAction>
          <AlertDialogCancel variant="ghost" size="xl" className="w-full m-0">{t('menu.reset.no')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

/* ─────────────────────────── Side rail ─────────────────────────── */

function greetingKey(): StrKey {
  const h = new Date().getHours()
  return h < 5 ? 'greet.night' : h < 12 ? 'greet.morning' : h < 17 ? 'greet.day' : h < 22 ? 'greet.evening' : 'greet.night'
}

function Greeting({ user }: { user: User }) {
  const { t } = useI18n()
  return <h1 className="t-h1 m-0">{t(greetingKey())}, {user.firstName}</h1>
}

function ContinueCard({ p, rest, onStart, compact }: { p: Progress; rest: string | null; onStart: (id: string) => void; compact?: boolean }) {
  const { t, pick, num } = useI18n()
  const { node, unitIndex, indexInUnit } = currentNode(p)
  const unit = FIN_LIT.units[unitIndex]
  const k = KIND[node.kind]
  const partsDone = p.parts[node.id] ?? 0
  const fresh = p.done.length === 0 && partsDone === 0
  if (compact) return (
    <div className="card p-3 flex items-center gap-3">
      <span className="grid place-items-center w-11 h-11 rounded-lg shrink-0" style={{ background: k.soft, color: k.ink }}><Icon name={k.icon} size={20} /></span>
      <div className="min-w-0 flex-1">
        <div className="t-caption ink-2 truncate">{t('map.unit', { n: num(unit.n) })} · {partsDone > 0 ? t('map.partOf', { i: num(partsDone + 1), n: num(PARTS_PER_LESSON) }) : t('map.lessonOf', { i: num(indexInUnit + 1), n: num(unit.nodes.length) })}</div>
        <div className="font-bold truncate">{pick(node.title)}</div>
      </div>
      <button className={cn(buttonVariants({ variant: rest ? 'outline' : 'default', size: 'lg' }), 'shrink-0')} onClick={() => onStart(node.id)}>
        <Icon name={rest ? 'clock' : 'play'} size={16} />{rest ? <bdi dir="ltr" className="t-num">{rest}</bdi> : fresh ? t('map.start') : t('map.continue')}
      </button>
    </div>
  )
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 t-small ink-2">
        <span className="badge">{t('map.unit', { n: num(unit.n) })}</span>
        <span>{t('map.lessonOf', { i: num(indexInUnit + 1), n: num(unit.nodes.length) })}</span>
        {partsDone > 0 && <span className="badge badge-sky">{t('map.partOf', { i: num(partsDone + 1), n: num(PARTS_PER_LESSON) })}</span>}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <span className="grid place-items-center w-12 h-12 rounded-lg shrink-0" style={{ background: k.soft, color: k.ink }}>
          <Icon name={k.icon} size={22} />
        </span>
        <div className="min-w-0">
          <div className="t-h3 truncate">{pick(node.title)}</div>
          <div className="t-small ink-2 flex gap-3 mt-0.5">
            <span className="inline-flex items-center gap-1"><Icon name="clock" size={14} />{t('map.min', { m: num(node.minutes) })}</span>
            <span className="inline-flex items-center gap-1" style={{ color: 'var(--color-sun-ink)' }}><Icon name="xp" size={14} style={{ color: 'var(--color-sun)' }} /><bdi dir="ltr">{t('map.xp', { x: num(node.xp) })}</bdi></span>
          </div>
        </div>
      </div>
      <button className={cn(buttonVariants({ variant: rest ? 'outline' : 'default', size: 'xl' }), 'w-full mt-5')} onClick={() => onStart(node.id)}>
        <Icon name={rest ? 'clock' : 'play'} size={18} />{rest ? t('map.lockedFor', { t: rest }) : fresh ? t('map.start') : t('map.continue')}
      </button>
    </div>
  )
}

function DailyGoal({ p }: { p: Progress }) {
  const { t, num } = useI18n()
  const v = p.todayXp / p.dailyGoal
  return (
    <div className="card p-4 flex items-center gap-4">
      <Ring value={v} size={56} stroke={8} color={v >= 1 ? 'var(--brand)' : 'var(--sun-strong)'}>
        <Icon name={v >= 1 ? 'check' : 'xp'} size={22} style={{ color: v >= 1 ? 'var(--brand)' : 'var(--color-sun)' }} />
      </Ring>
      <div>
        <div className="t-h3">{t('side.goal')}</div>
        <div className="t-small ink-2">{p.todayXp >= p.dailyGoal ? t('side.goal.done', { d: num(p.todayXp) }) : p.todayXp ? t('side.goal.d', { d: num(p.todayXp), g: num(p.dailyGoal) }) : t('side.goal.start')}</div>
      </div>
    </div>
  )
}

function SproutCard({ p }: { p: Progress }) {
  const { t, num } = useI18n()
  const unitsDone = FIN_LIT.units.filter((u) => u.nodes.every((n) => p.done.includes(n.id))).length
  const stage = p.done.length === 0 ? 0 : sproutStage(unitsDone)
  const nextUnit = Math.min(FIN_LIT.units.length, (Math.floor(unitsDone / 3) + 1) * 3)
  return (
    <div className="card overflow-hidden flex items-stretch">
      <div className="grid place-items-end w-24 shrink-0" style={{ background: 'var(--brand-soft)' }}>
        <Sprout size={88} stage={stage} mood="happy" />
      </div>
      <div className="p-4 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="t-h3">{t('side.sprout')}</div>
          <span className="badge">{t('side.sprout.stage', { s: num(stage + 1) })}</span>
        </div>
        <p className="t-small ink-2 mt-1 mb-0">{t('side.sprout.next', { n: num(nextUnit) })}</p>
      </div>
    </div>
  )
}

function Badges({ p }: { p: Progress }) {
  const { t, num } = useI18n()
  const meta: Record<(typeof BADGES)[number], { icon: IconName; color: string; k: StrKey }> = {
    first: { icon: 'star', color: 'var(--brand)', k: 'badge.first' },
    streak7: { icon: 'flame', color: 'var(--flame-strong)', k: 'badge.streak7' },
    unit1: { icon: 'medal', color: 'var(--sun-strong)', k: 'badge.unit1' },
    perfect: { icon: 'shield', color: 'var(--berry-strong)', k: 'badge.perfect' },
  }
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="t-h3">{t('side.badges')}</div>
        <span className="t-small ink-3">{t('side.badges.d', { n: num(p.badges.length), t: num(BADGES.length) })}</span>
      </div>
      <ul className="grid grid-cols-4 gap-2 mt-3 p-0 m-0 list-none">
        {BADGES.map((b) => {
          const got = p.badges.includes(b)
          return (
            <li key={b} className="flex flex-col items-center gap-1.5 text-center" title={t(meta[b].k)}>
              <span className="grid place-items-center w-11 h-11 rounded-full transition-transform hover:scale-110"
                style={{ background: got ? meta[b].color : 'var(--bg-deep)', color: got ? 'var(--on-strong)' : 'var(--ink-3)', boxShadow: 'none' }}>
                <Icon name={got ? meta[b].icon : 'lock'} size={20} filled={got ? undefined : false} />
              </span>
              <span className="t-caption font-normal ink-2 leading-tight">{t(meta[b].k)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ─────────────────────────── Path ─────────────────────────── */

/** Course progress in one line: a segment per unit, tap one to jump there. */
function UnitPager({ p, page, onGo }: { p: Progress; page: number; onGo: (i: number) => void }) {
  const { t, pick, num } = useI18n()
  const nodes = allNodes(FIN_LIT)
  const doneSet = new Set(p.done)
  const leftMin = nodes.filter((n) => !doneSet.has(n.id)).reduce((s, n) => s + n.minutes, 0)
  return (
    <div className="shrink-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="t-h3 m-0 truncate">{pick(FIN_LIT.title)}</h2>
        <span className="t-small ink-2 shrink-0">{t('map.hoursLeft', { h: num(Math.round(leftMin / 60)) })}</span>
      </div>
      <div className="flex gap-1 mt-1.5" role="tablist" aria-label={t('map.course')}>
        {FIN_LIT.units.map((u, i) => {
          const f = u.nodes.filter((n) => doneSet.has(n.id)).length / u.nodes.length
          const on = i === page
          return (
            <button key={u.id} role="tab" aria-selected={on} aria-label={`${t('map.unit', { n: num(u.n) })}: ${pick(u.title)}`} onClick={() => onGo(i)}
              className="flex-1 h-5 grid items-center border-0 bg-transparent cursor-pointer p-0">
              <span className="block h-1.5 rounded-full overflow-hidden transition-[height] duration-200" style={{ height: on ? 8 : 6, background: 'var(--bg-deep)', outline: on ? '2px solid var(--brand)' : 'none', outlineOffset: 1 }}>
                <span className="block h-full rounded-full" style={{ width: `${f * 100}%`, background: 'var(--brand)' }} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function UnitBanner({ page, forYou, states, onGo }: { page: number; forYou: boolean; states: Map<string, NodeState>; onGo: (i: number) => void }) {
  const { t, pick, num, dir } = useI18n()
  const unit = page < UNITS ? FIN_LIT.units[page] : null
  const doneCount = unit ? unit.nodes.filter((n) => states.get(n.id) === 'done').length : 0
  const locked = !unit || states.get(unit.nodes[0].id) === 'locked'
  const flip = dir === 'rtl' ? 'scaleX(-1)' : undefined
  const kit = worldKit()
  return (
    <div className="shrink-0 flex items-center gap-2 mt-2">
      <button className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }), 'shrink-0')} aria-label={t('map.prevUnit')} disabled={page === 0} style={{ opacity: page === 0 ? 0.3 : 1 }} onClick={() => onGo(page - 1)}>
        <Icon name="chevron" style={{ transform: dir === 'rtl' ? undefined : 'scaleX(-1)' }} />
      </button>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={page} className="flex-1 min-w-0 rounded-xl px-4 py-3 flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.15 }}
          style={{ background: locked ? 'var(--surface)' : 'var(--brand)', color: locked ? 'var(--ink)' : 'var(--on-brand)', border: locked ? '1px solid var(--line)' : '1px solid transparent', boxShadow: 'var(--shadow-card)' }}>
          <div className="min-w-0 flex-1">
            <div className="t-caption flex items-center gap-2" style={{ opacity: 0.9 }}>
              {unit ? t('map.unit', { n: num(unit.n) }) : t('map.course')}
              {forYou && <span className="badge" style={{ height: 20, background: locked ? 'var(--brand-soft)' : 'var(--color-lime)', color: 'var(--color-leaf-900)' }}><Icon name="target" size={12} />{t('map.forYou')}</span>}
            </div>
            <h3 className="t-h2 m-0 truncate">{unit ? pick(unit.title) : t('map.nextCourses')}</h3>
            <p className="t-small m-0 mt-0.5 truncate hidden sm:block" style={{ opacity: 0.85 }}>{unit ? pick(unit.goal) : t('map.nextCourses.d')}</p>
          </div>
          {unit && kit && <Emo e={art(kit.id, kit.chars[(unit.n - 1) % kit.chars.length].k)} size={32} className="shrink-0 hidden min-[380px]:inline-block" />}
          {unit && !locked && (
            <Ring value={doneCount / unit.nodes.length} size={48} stroke={5} color="var(--color-lime)">
              <span className="t-caption font-bold t-num" style={{ fontSize: 11 }}>{num(doneCount)}/{num(unit.nodes.length)}</span>
            </Ring>
          )}
          {locked && <Icon name="lock" size={22} className="ink-3" />}
        </motion.div>
      </AnimatePresence>
      <button className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }), 'shrink-0')} aria-label={t('map.nextUnit')} disabled={page === PAGES - 1} style={{ opacity: page === PAGES - 1 ? 0.3 : 1 }} onClick={() => onGo(page + 1)}>
        <Icon name="chevron" style={{ transform: flip }} />
      </button>
    </div>
  )
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

const PAD_TOP = 44   // room for the "Start" chip above the current step
const PAD_BOTTOM = 10

/** Lays the unit's steps out as a snake that fills the space it has, so nothing scrolls. */
function snake(n: number, w: number, h: number, rtl: boolean) {
  const ih = Math.max(0, h - PAD_TOP - PAD_BOTTOM)
  let best = { cols: 3, size: 0 }
  for (let cols = 2; cols <= 6; cols++) {
    const rows = Math.ceil(n / cols)
    const size = Math.min(60, (w / cols) * 0.5, (ih / rows) * 0.48)
    if (size > best.size + 1) best = { cols, size }
  }
  const { cols } = best
  const size = Math.max(36, Math.round(best.size))
  const rows = Math.ceil(n / cols)
  const cw = Math.min(w / cols, 120)
  const ch = Math.min(ih / rows, 110)
  const ox = (w - cw * cols) / 2
  // Sits 40px above centre (as much as the free space allows), closer to the unit banner.
  const oy = PAD_TOP + Math.max(0, (ih - ch * rows) / 2 - 40)
  const wave = Math.min(10, ch * 0.07)
  const at = (i: number) => {
    const r = Math.floor(i / cols)
    let c = i % cols
    if (r % 2) c = cols - 1 - c
    let x = ox + (c + 0.5) * cw
    if (rtl) x = w - x
    return { x, y: oy + (r + 0.5) * ch + (i % 2 ? wave : -wave) }
  }
  const pts = Array.from({ length: n }, (_, i) => at(i))
  return { pts, size, cols, cw, ch, spare: n % cols ? at(n) : null }
}

function curve(pts: { x: number; y: number }[], w: number, cw: number) {
  return pts.map((pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`
    const a = pts[i - 1]
    if (Math.abs(a.y - pt.y) < 30) return `L ${pt.x} ${pt.y}`
    const out = (a.x > w / 2 ? 1 : -1) * cw * 0.45   // U-turn at the end of a row
    return `C ${a.x + out} ${a.y} ${pt.x + out} ${pt.y} ${pt.x} ${pt.y}`
  }).join(' ')
}

function UnitPath({ unit, states, parts, currentId, rest, onStart }: { rest: string | null; unit: Unit; states: Map<string, NodeState>; parts: Record<string, number>; currentId: string; onStart: (id: string) => void }) {
  const { dir, pick } = useI18n()
  const [hover, setHover] = useState<number | null>(null)
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const [sel, setSel] = useState<string | null>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const L = useMemo(() => (w && h ? snake(unit.nodes.length, w, h, dir === 'rtl') : null), [unit.nodes.length, w, h, dir])
  const doneCount = unit.nodes.filter((n) => states.get(n.id) === 'done').length

  useEffect(() => {
    if (!sel) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) { if (e.key === 'Escape') setSel(null); return }
      const el = e.target as HTMLElement
      if (!popRef.current?.contains(el) && !el.closest('[data-node]')) setSel(null)
    }
    document.addEventListener('mousedown', close); document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [sel])

  const selIdx = unit.nodes.findIndex((n) => n.id === sel)
  const kit = worldKit()
  return (
    <div ref={ref} className="absolute inset-0">
      {L && (
        <>
          <PathTrail L={L} w={w} doneCount={doneCount} total={unit.nodes.length} />
          {unit.nodes.map((n, i) => (
            <NodeButton key={n.id} node={n} title={n.kind === 'lesson' ? pick(n.title) : pick(unit.title)} state={states.get(n.id)!} current={n.id === currentId}
              x={L.pts[i].x} y={L.pts[i].y} size={n.id === currentId ? Math.round(L.size * 1.15) : L.size} partsDone={parts[n.id] ?? 0} chip={L.ch - L.size * 1.15 >= 2 * 46 || i < L.cols} rest={n.id === currentId ? rest : null}
              open={sel === n.id} onToggle={() => setSel((s) => (s === n.id ? null : n.id))}
              onHover={(on) => setHover((cur) => (on ? i : cur === i ? null : cur))} />
          ))}
          <AnimatePresence>
            {hover !== null && sel === null && (
              <NodePeek key={hover} node={unit.nodes[hover]} title={unit.nodes[hover].kind === 'lesson' ? pick(unit.nodes[hover].title) : pick(unit.title)}
                state={states.get(unit.nodes[hover].id)!} x={L.pts[hover].x} y={L.pts[hover].y} size={L.size} w={w} />
            )}
          </AnimatePresence>
          {L.spare && (
            <motion.div className="absolute" style={{ left: L.spare.x, top: L.spare.y, x: '-50%', y: '-62%' }}
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}>
              <span className="flex items-end">
                <Sprout size={Math.min(72, L.ch * 0.85, L.cw * 0.75)} stage={1} mood="happy" />
                {kit && <Emo e={art(kit.id, kit.chars[(unit.n + 4) % kit.chars.length].k)} size={Math.min(46, L.ch * 0.5, L.cw * 0.42)} />}
              </span>
            </motion.div>
          )}
          <AnimatePresence>
            {selIdx >= 0 && (
              <NodePopover key={sel} ref={popRef} node={unit.nodes[selIdx]} unitTitle={pick(unit.title)} prev={unit.nodes[selIdx - 1] ?? null}
                state={states.get(unit.nodes[selIdx].id)!} partsDone={parts[unit.nodes[selIdx].id] ?? 0}
                x={L.pts[selIdx].x} y={L.pts[selIdx].y} size={L.size} w={w} h={h} rest={unit.nodes[selIdx].id === currentId ? rest : null}
                onStart={(id) => { setSel(null); onStart(id) }} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

function NodeButton({ node, title, state, current, x, y, size, partsDone, chip, rest, open, onToggle, onHover }: { rest: string | null; node: PathNode; title: string; state: NodeState; current: boolean; x: number; y: number; size: number; partsDone: number; chip: boolean; open: boolean; onToggle: () => void; onHover: (on: boolean) => void }) {
  const { t } = useI18n()
  const k = KIND[node.kind]
  const fill = state === 'locked' ? 'var(--bg-deep)' : k.fill
  const ink = state === 'locked' ? 'var(--ink-3)' : k.on
  const icon: IconName = state === 'done' ? 'check' : state === 'locked' ? 'lock' : k.icon
  return (
    <div data-node className="absolute" style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, zIndex: open || current ? 5 : 2 }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') onHover(true) }} onPointerLeave={() => onHover(false)}>
      {current && partsDone > 0 && node.kind === 'lesson' && (
        <svg className="absolute pointer-events-none -rotate-90" style={{ inset: -8, width: size + 16, height: size + 16 }} viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--bg-deep)" strokeWidth="6" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--sun-strong)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - partsDone / PARTS_PER_LESSON)} />
        </svg>
      )}
      {current && (
        <>
          {!rest && <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: k.fill, animation: 'ping-ring 1.8s var(--ease-out) infinite' }} />}
          {chip && <span className="absolute left-1/2 -translate-x-1/2 chip whitespace-nowrap pointer-events-none"
            style={{ top: -42, height: 30, background: 'var(--surface)', color: 'var(--brand-ink)', boxShadow: 'var(--shadow-card)', animation: rest ? undefined : 'bob 2.4s ease-in-out infinite' }}>
            {rest ? <><Icon name="clock" size={14} /><bdi dir="ltr" className="t-num">{rest}</bdi></> : t('map.start')}
          </span>}
        </>
      )}
      <motion.button aria-label={`${t(`map.kind.${node.kind}` as StrKey)}: ${title}`} aria-expanded={open} onClick={onToggle}
        onFocus={() => onHover(true)} onBlur={() => onHover(false)}
        whileHover={{ scale: 1.14, y: -3 }} whileTap={{ scale: 0.92 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }}
        className="relative grid place-items-center w-full h-full rounded-full border-0 cursor-pointer"
        style={{ background: fill, color: ink, boxShadow: state === 'locked' ? 'inset 0 0 0 1.5px var(--ink-3)' : k.edge ? `inset 0 0 0 2px ${k.edge}, 0 0 0 4px color-mix(in oklab, ${k.fill} 18%, transparent)` : `0 1px 2px rgb(0 0 0 / .12), 0 0 0 4px color-mix(in oklab, ${k.fill} 18%, transparent)` }}>
        <motion.span className="grid place-items-center" whileHover={{ rotate: state === 'locked' ? [0, -12, 10, -6, 0] : 0 }} transition={{ duration: 0.4 }}>
          <Icon name={icon} size={Math.round(size * 0.4)} />
        </motion.span>
      </motion.button>
    </div>
  )
}

type PopProps = { rest: string | null; node: PathNode; unitTitle: string; prev: PathNode | null; state: NodeState; partsDone: number; x: number; y: number; size: number; w: number; h: number; onStart: (id: string) => void }

/** Step details. Placed above or below the step, wherever there's more room, and kept inside the screen. */
const NodePopover = forwardRef<HTMLDivElement, PopProps>(function NodePopover({ node, unitTitle, prev, state, partsDone, x, y, size, w, h, rest, onStart }, ref) {
  const { t, pick, num } = useI18n()
  const k = KIND[node.kind]
  const pw = Math.min(288, w - 8)
  const left = Math.max(4, Math.min(w - pw - 4, x - pw / 2))
  const below = h - y > y
  const gap = size / 2 + 14
  const desc: StrKey | null = node.kind === 'lesson' ? null : (`map.kind.${node.kind}.d` as StrKey)
  const title = node.kind === 'lesson' ? pick(node.title) : unitTitle
  const arrow = { left: x - left - 8, background: 'var(--surface)', borderColor: 'var(--line)' }
  return (
    <motion.div ref={ref} role="dialog" className="card absolute p-4 z-30"
      style={{ left, width: pw, boxShadow: 'var(--shadow-pop)', ...(below ? { top: y + gap } : { bottom: h - y + gap }) }}
      initial={{ opacity: 0, y: below ? -8 : 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: below ? -8 : 8, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}>
      <span className="absolute w-4 h-4 rotate-45" style={{ ...arrow, ...(below ? { top: -8, borderTop: '1px solid var(--line)', borderLeft: '1px solid var(--line)' } : { bottom: -8, borderBottom: '1px solid var(--line)', borderRight: '1px solid var(--line)' }) }} />
      <span className="badge" style={{ background: k.soft, color: k.ink }}>{t(`map.kind.${node.kind}` as StrKey)}</span>
      <div className="t-h3 mt-2">{title}</div>
      {desc && <p className="t-small ink-2 mt-1 mb-0">{t(desc)}</p>}
      {state === 'current' && partsDone > 0 && <span className="badge badge-sky mt-2">{t('map.partOf', { i: num(partsDone + 1), n: num(PARTS_PER_LESSON) })}</span>}
      <div className="t-small ink-2 flex gap-3 mt-2">
        <span className="inline-flex items-center gap-1"><Icon name="clock" size={14} />{t('map.min', { m: num(node.minutes) })}</span>
        <span className="inline-flex items-center gap-1"><Icon name="xp" size={14} style={{ color: 'var(--color-sun)' }} /><bdi dir="ltr">{t('map.xp', { x: num(node.xp) })}</bdi></span>
      </div>
      {state === 'locked' ? (
        <p className="t-small mt-3 mb-0 rounded-lg px-3 py-2 inline-flex items-center gap-2" style={{ background: 'var(--bg-deep)', color: 'var(--ink-2)' }}>
          <Icon name="lock" size={14} />{t('map.locked', { prev: prev ? pick(prev.title) : '' })}
        </p>
      ) : (
        <button className={cn(buttonVariants({ variant: state === 'current' && !rest ? 'default' : 'outline', size: 'lg' }), 'w-full mt-3')} onClick={() => onStart(node.id)}>
          {rest ? <><Icon name="clock" size={16} />{t('map.lockedFor', { t: rest })}</> : state === 'done' ? t('map.reviewLesson') : partsDone > 0 ? t('map.continue') : t('map.startLesson')}
        </button>
      )}
    </motion.div>
  )
})

/** The trail between steps: dotted ahead, solid green where you've been. The green part draws itself
 *  when the unit opens, a glint runs along it, and little sparkles twinkle on the way. */
function PathTrail({ L, w, doneCount, total }: { L: NonNullable<ReturnType<typeof snake>>; w: number; doneCount: number; total: number }) {
  const full = curve(L.pts, w, L.cw)
  const reached = Math.min(doneCount, total - 1)
  const done = doneCount > 0 ? curve(L.pts.slice(0, reached + 1), w, L.cw) : null
  const sparkles = doneCount > 0 ? L.pts.slice(0, reached).map((p, i) => ({ x: (p.x + L.pts[i + 1].x) / 2, y: (p.y + L.pts[i + 1].y) / 2 })) : []
  return (
    <svg className="absolute inset-0 overflow-visible pointer-events-none" width="100%" height="100%" aria-hidden="true">
      <path d={full} fill="none" stroke="var(--line-strong)" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 12" />
      {done && (
        <>
          <motion.path d={done} fill="none" stroke="var(--brand)" strokeWidth="5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 + reached * 0.18, ease: 'easeInOut', delay: 0.15 }} />
          <circle r="4" fill="#fff" opacity="0">
            <animateMotion dur={`${0.6 + reached * 0.25}s`} begin="0.3s" repeatCount="1" fill="freeze" path={done} />
            <animate attributeName="opacity" values="0;1;1;0" dur={`${0.6 + reached * 0.25}s`} begin="0.3s" fill="freeze" />
          </circle>
          {sparkles.map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <path d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5Z" fill="var(--sun-strong)"
                style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `twinkle 2.4s ease-in-out ${0.6 + i * 0.35}s infinite` }} />
            </g>
          ))}
        </>
      )}
    </svg>
  )
}

/** A quick look at a step on hover, before clicking: what it is, how long, what it's worth. */
function NodePeek({ node, title, state, x, y, size, w }: { node: PathNode; title: string; state: NodeState; x: number; y: number; size: number; w: number }) {
  const { t, num } = useI18n()
  const k = KIND[node.kind]
  const pw = 200
  const left = Math.max(4, Math.min(w - pw - 4, x - pw / 2))
  return (
    <motion.div className="absolute z-20 pointer-events-none rounded-lg border bg-popover text-popover-foreground shadow-md px-3 py-2"
      style={{ left, width: pw, ...(y - size / 2 < 90 ? { top: y + size / 2 + 12 } : { bottom: `calc(100% - ${y - size / 2 - 12}px)` }) }}
      initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.97 }} transition={{ duration: 0.14 }}>
      <div className="flex items-center gap-1.5 text-xs" style={{ color: k.ink }}>
        <Icon name={state === 'done' ? 'check' : state === 'locked' ? 'lock' : k.icon} size={12} />
        {t(`map.kind.${node.kind}` as StrKey)}
        {state === 'done' && <span className="text-muted-foreground">· {t('map.done')}</span>}
      </div>
      <div className="text-sm font-semibold leading-snug mt-0.5">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{t('map.min', { m: num(node.minutes) })} · <bdi dir="ltr">{t('map.xp', { x: num(node.xp) })}</bdi></div>
    </motion.div>
  )
}

function NextCourses() {
  const { pick } = useI18n()
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="w-full grid sm:grid-cols-2 gap-3">
        {NEXT_COURSES.map((c) => (
          <div key={c.id} className="card p-5 flex items-center gap-4" style={{ boxShadow: 'none', background: 'var(--surface-2)' }}>
            <span className="grid place-items-center w-12 h-12 rounded-lg shrink-0" style={{ background: 'var(--bg-deep)', color: 'var(--ink-3)' }}><Icon name="lock" size={20} /></span>
            <div>
              <div className="t-h3">{pick(c.title)}</div>
              <div className="t-small ink-2">{pick(c.tagline)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
