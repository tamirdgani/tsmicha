import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { FIN_LIT, courseMinutes } from '../curriculum/course'
import { Icon, type IconName } from '../ds/Icon'
import { Sprout, type SproutMood } from '../ds/Sprout'
import { BUDDIES, buddyInfo, type BuddyId } from '../ds/buddies'
import { LangThemeToggles, Logo, useShortScreen } from '../ds/ui'
import { useI18n } from '../i18n/I18n'
import type { StrKey } from '../i18n/strings'
import { useAuth, type User } from '../lib/auth'
import { focusUnits, goalXp, type AgeRange, type Goal, type Minutes, type Profile, type Situation } from '../lib/profile'
import { sfx } from '../lib/sfx'
import { Emo } from '../worlds/Art'
import { setCurrentWorld } from '../worlds/current'

type Step = 'name' | 'welcome' | 'age' | 'goal' | 'sit' | 'time' | 'buddy' | 'plant'
const ORDER: Step[] = ['name', 'welcome', 'age', 'goal', 'sit', 'time', 'buddy', 'plant']
const QUESTIONS: Step[] = ['age', 'goal', 'sit', 'time', 'buddy']

const AGES: AgeRange[] = ['pre', 'k', 'g1', 'g2']
const GOALS: { id: Goal; icon: IconName }[] = [
  { id: 'heroes', icon: 'shield' },
  { id: 'magic', icon: 'sparkle' },
  { id: 'space', icon: 'star' },
  { id: 'cars', icon: 'flag' },
  { id: 'animals', icon: 'heart' },
  { id: 'dinos', icon: 'sparkle' },
]
const SITS: { id: Situation; icon: IconName }[] = [
  { id: 'count', icon: 'target' },
  { id: 'colors', icon: 'sparkle' },
  { id: 'letters', icon: 'book' },
  { id: 'name', icon: 'user' },
  { id: 'none', icon: 'star' },
]
const TIMES: Minutes[] = [5, 10, 15, 20]

export function Onboarding({ user, onDone }: { user: User; onDone: (p: Profile) => void }) {
  const { t, dir } = useI18n()
  const { signOut } = useAuth()
  const [step, setStep] = useState<Step>('name')
  const [forward, setForward] = useState(true)
  const [name, setName] = useState('')
  const [age, setAge] = useState<AgeRange | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [sit, setSit] = useState<Situation[]>([])
  const [minutes, setMinutes] = useState<Minutes | null>(null)
  const [buddy, setBuddy] = useState<BuddyId | null>(null)
  const [react, setReact] = useState<string | null>(null)
  const advTimer = useRef<number>()

  const idx = ORDER.indexOf(step)
  const go = (to: Step) => {
    window.clearTimeout(advTimer.current)
    setForward(ORDER.indexOf(to) > idx)
    setReact(null)
    setStep(to)
  }
  const next = () => go(ORDER[Math.min(idx + 1, ORDER.length - 1)])
  const back = () => go(ORDER[Math.max(idx - 1, 0)])

  /** Single-choice answers: Sprout reacts, then the flow moves on by itself. */
  const pickAndGo = (line: string) => {
    setReact(line)
    window.clearTimeout(advTimer.current)
    advTimer.current = window.setTimeout(next, 1100)
  }
  useEffect(() => () => window.clearTimeout(advTimer.current), [])

  const canNext =
    (step === 'name' && name.trim().length > 0) || step === 'welcome' || (step === 'age' && !!age) || (step === 'goal' && !!goal) || (step === 'sit' && sit.length > 0) || (step === 'time' && !!minutes) || (step === 'buddy' && !!buddy)

  // Keyboard: 1–n picks an option, Enter continues.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      if (e.key === 'Enter' && canNext) { e.preventDefault(); next() }
      const n = Number(e.key)
      if (!n) return
      if (step === 'age' && AGES[n - 1]) { setAge(AGES[n - 1]); pickAndGo(t('ob.age.react')) }
      if (step === 'goal' && GOALS[n - 1]) { setGoal(GOALS[n - 1].id); setCurrentWorld(GOALS[n - 1].id); pickAndGo(t('ob.goal.react')) }
      if (step === 'sit' && SITS[n - 1]) toggleSit(SITS[n - 1].id)
      if (step === 'time' && TIMES[n - 1]) { setMinutes(TIMES[n - 1]); setReact(t('ob.time.react')) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const toggleSit = (s: Situation) => {
    setSit((cur) => {
      const nextSit = s === 'none' ? (cur.includes('none') ? [] : ['none']) : cur.includes(s) ? cur.filter((x) => x !== s) : [...cur.filter((x) => x !== 'none'), s]
      setReact(nextSit.length === 0 ? null : nextSit.includes('none') ? t('ob.sit.react.none') : t('ob.sit.react'))
      return nextSit as Situation[]
    })
  }

  const say: Record<Step, string> = {
    name: t('ob.name.say'),
    welcome: t('ob.welcome.say', { name }),
    age: t('ob.age.say'),
    goal: t('ob.goal.say'),
    sit: t('ob.sit.say'),
    time: t('ob.time.say'),
    buddy: t('ob.buddy.say', { name }),
    plant: t('ob.plant.say'),
  }
  const mood: SproutMood = react ? 'cheer' : step === 'welcome' ? 'happy' : 'think'
  const qIndex = QUESTIONS.indexOf(step)
  const slide = (forward ? 1 : -1) * (dir === 'rtl' ? -1 : 1) * 40

  const profile: Profile | null = age && goal && minutes && sit.length && buddy
    ? { name: name.trim() || user.firstName, age, goal, situation: sit, minutes, buddy, createdAt: new Date().toISOString() }
    : null

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <header className="shrink-0 max-w-2xl w-full mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3">
        <div className={step === 'welcome' || step === 'name' ? '' : 'w-11'}>
          {step === 'name' && <Logo size={28} />}
          {idx > 0 && step !== 'plant' && (
            <button className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))} onClick={back} aria-label={t('ob.back')}>
              <Icon name="chevron" style={{ transform: dir === 'rtl' ? 'none' : 'scaleX(-1)' }} />
            </button>
          )}
        </div>
        <div className="flex-1 flex gap-1.5" {...(qIndex >= 0 || step === 'plant' ? { role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': QUESTIONS.length, 'aria-valuenow': Math.max(0, qIndex), 'aria-label': t('ob.step', { i: Math.max(0, qIndex) + 1, n: QUESTIONS.length }) } : {})}>
          {step !== 'welcome' && step !== 'name' && QUESTIONS.map((q, i) => (
            <span key={q} className="h-2.5 flex-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
              <motion.i className="block h-full rounded-full" style={{ background: 'var(--brand)' }}
                initial={false} animate={{ width: step === 'plant' || i < qIndex ? '100%' : i === qIndex ? '50%' : '0%' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
            </span>
          ))}
        </div>
        <LangThemeToggles />
        {/* a way back to the login screen, e.g. to sign in with a different account */}
        <button className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))} onClick={signOut} aria-label={t('menu.signout')} title={t('menu.signout')}>
          <Icon name="logout" />
        </button>
      </header>

      <main className="flex-1 min-h-0 w-full max-w-2xl mx-auto flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-3" data-ob-main>
        {step !== 'plant' && step !== 'welcome' && step !== 'name' && step !== 'buddy' && <SproutSays mood={mood} text={react ?? say[step]} />}

        <AnimatePresence mode="wait" initial={false}>
          <motion.section key={step} className="mt-3 sm:mt-6"
            initial={{ opacity: 0, x: slide }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -slide }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>

            {step === 'name' && <NameStep text={say.name} name={name} setName={setName} onDone={() => { if (name.trim()) { setName(name.trim()); next() } }} />}

            {step === 'welcome' && <Welcome text={say.welcome} name={name} setName={setName} />}

            {step === 'age' && (
              <Options>
                {AGES.map((a, i) => (
                  <Option key={a} n={i + 1} selected={age === a} title={t(`ob.age.${a}` as StrKey)} desc={t(`ob.age.${a}.d` as StrKey)}
                    onClick={() => { setAge(a); pickAndGo(t('ob.age.react')) }} />
                ))}
              </Options>
            )}

            {step === 'goal' && (
              <Options>
                {GOALS.map((g, i) => (
                  <Option key={g.id} n={i + 1} icon={g.icon} art={`@${g.id}/badge`} selected={goal === g.id} title={t(`ob.goal.${g.id}` as StrKey)} desc={t(`ob.goal.${g.id}.d` as StrKey)}
                    onClick={() => { setGoal(g.id); setCurrentWorld(g.id); pickAndGo(t('ob.goal.react')) }} />
                ))}
              </Options>
            )}

            {step === 'sit' && (
              <Options multi>
                {SITS.map((s, i) => (
                  <Option key={s.id} n={i + 1} multi icon={s.icon} selected={sit.includes(s.id)} title={t(`ob.sit.${s.id}` as StrKey)} onClick={() => toggleSit(s.id)} />
                ))}
              </Options>
            )}

            {step === 'buddy' && <BuddyStep name={name} text={say.buddy} buddy={buddy} pick={setBuddy} />}

            {step === 'time' && <TimeStep minutes={minutes} pick={(m) => { setMinutes(m); setReact(t('ob.time.react')) }} />}

            {step === 'plant' && profile && <PlantStep profile={profile} onDone={() => onDone(profile)} />}
          </motion.section>
        </AnimatePresence>

        </div>
        {step !== 'plant' && (
          <div className="shrink-0 px-4 sm:px-6 py-3 sm:pt-6 sm:pb-10 max-sm:border-t" style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}>
            <div className={`max-w-2xl mx-auto flex items-center gap-4 ${step === 'welcome' || step === 'name' ? 'sm:justify-center' : ''}`}>
              <button className={cn(buttonVariants({ variant: 'default', size: 'xl' }), 'flex-1 sm:flex-none sm:min-w-56')} onClick={next} disabled={!canNext}>
                {step === 'name' ? t('ob.next') : step === 'welcome' ? t('ob.welcome.cta') : step === 'buddy' && buddy ? t('ob.buddy.cta') : t('ob.next')}
              </button>
              {qIndex >= 0 && step !== 'buddy' && <span className="hidden sm:inline t-small ink-3">{t('ob.hint.keys', { n: step === 'goal' || step === 'sit' ? 5 : 4 })}</span>}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

/* ─────────────────────────── Pieces ─────────────────────────── */

function SproutSays({ text, mood, big }: { text: string; mood: SproutMood; big?: boolean }) {
  const shown = useTypewriter(text)
  const short = useShortScreen()
  return (
    <div className={`flex items-end gap-3 sm:gap-4 ${big ? 'mt-6 sm:mt-12' : 'mt-2 sm:mt-6'}`}>
      <motion.div className="shrink-0" layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
        <Sprout size={big ? (short ? 100 : 140) : short ? 68 : 96} stage={1} mood={mood} />
      </motion.div>
      <div className="relative card px-4 py-3 sm:px-5 sm:py-4 mb-4 sm:mb-6 flex-1" style={{ borderRadius: 22, borderEndStartRadius: 6 }}>
        <p className={`m-0 font-semibold ${big ? 't-h2' : 't-h3'}`} aria-live="polite">
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{shown}</span>
          <span aria-hidden="true" className="invisible">{text.slice(shown.length)}</span>
        </p>
      </div>
    </div>
  )
}

/** Reveals text character by character; the full line reserves its space so nothing jumps. */
function useTypewriter(text: string) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(text.length); return }
    setN(0)
    const id = window.setInterval(() => setN((c) => { if (c >= text.length) { window.clearInterval(id); return c } return c + 1 }), 18)
    return () => window.clearInterval(id)
  }, [text])
  return text.slice(0, n)
}

const PREVIEW: { k: StrKey; icon: IconName }[] = [
  { k: 'ob.prev.age', icon: 'user' },
  { k: 'ob.prev.goal', icon: 'target' },
  { k: 'ob.prev.sit', icon: 'map' },
  { k: 'ob.prev.time', icon: 'clock' },
  { k: 'ob.prev.buddy', icon: 'heart' },
]

function Welcome({ text, name, setName }: { text: string; name: string; setName: (s: string) => void }) {
  const { t } = useI18n()
  const shown = useTypewriter(text)
  const short = useShortScreen()
  return (
    <div className="flex flex-col items-center text-center pt-2 sm:pt-8">
      <div className="relative card px-6 py-5 max-w-md" style={{ borderRadius: 24 }}>
        <p className="m-0 t-h2" aria-live="polite">
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{shown}</span><span aria-hidden="true" className="invisible">{text.slice(shown.length)}</span>
        </p>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45" style={{ background: 'var(--surface)', borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }} />
      </div>
      <motion.div className="mt-4" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.1 }}>
        <Sprout size={short ? 120 : 170} stage={1} mood="happy" />
      </motion.div>
      <ol className="list-none p-0 m-0 mt-4 sm:mt-6 flex flex-wrap justify-center gap-2">
        {PREVIEW.map((p, i) => (
          <motion.li key={p.k} className="chip" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}>
            <Icon name={p.icon} size={16} className="ink-2" />{t(p.k)}
          </motion.li>
        ))}
      </ol>
      <p className="t-small ink-3 mt-3 mb-2">{t('ob.prev.time.total')}</p>
    </div>
  )
}

/** The very first screen: Piko asks the child's name, so everything after can talk to them by name. */
function NameStep({ text, name, setName, onDone }: { text: string; name: string; setName: (s: string) => void; onDone: () => void }) {
  const { t } = useI18n()
  const short = useShortScreen()
  const shown = useTypewriter(text)
  return (
    <form className="flex flex-col items-center text-center pt-2 sm:pt-8" onSubmit={(e) => { e.preventDefault(); onDone() }}>
      <div className="relative card px-6 py-5 max-w-md" style={{ borderRadius: 24 }}>
        <p className="m-0 t-h2" aria-live="polite">
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{shown}</span><span aria-hidden="true" className="invisible">{text.slice(shown.length)}</span>
        </p>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45" style={{ background: 'var(--surface)', borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }} />
      </div>
      <motion.div className="mt-4" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.1 }}>
        <Sprout size={short ? 110 : 150} stage={1} mood={name.trim() ? 'cheer' : 'happy'} />
      </motion.div>
      <label className="w-full max-w-sm mt-5 text-start">
        <span className="t-small ink-2 font-medium">{t('ob.name.label')}</span>
        <input id="child-name" autoFocus value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder={t('ob.name.placeholder')}
          className="mt-1 w-full h-14 px-4 rounded-xl font-bold outline-none text-center"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--line-strong)', color: 'var(--ink)', font: 'inherit', fontSize: 22 }} />
      </label>
      <p className="t-small ink-3 mt-2 mb-0">{t('ob.name.hint')}</p>
    </form>
  )
}

function Options({ children, multi }: { children: ReactNode; multi?: boolean }) {
  return <div role={multi ? 'group' : 'radiogroup'} className="grid sm:grid-cols-2 gap-2 sm:gap-3">{children}</div>
}

function Option({ n, title, desc, icon, art, selected, multi, onClick }: { n: number; title: string; desc?: string; icon?: IconName; art?: string; selected: boolean; multi?: boolean; onClick: () => void }) {
  const { num } = useI18n()
  return (
    <motion.button
      role={multi ? 'checkbox' : 'radio'} aria-checked={selected} onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="relative flex items-center gap-4 p-4 min-h-[76px] [@media(max-height:760px)]:p-3 [@media(max-height:760px)]:min-h-[58px] rounded-xl cursor-pointer text-start hover:bg-accent/60"
      style={{
        font: 'inherit', color: 'var(--ink)',
        background: selected ? 'var(--brand-soft)' : 'var(--surface)',
        border: `1.5px solid ${selected ? 'var(--brand)' : 'var(--line)'}`,
        boxShadow: selected ? '0 0 0 3px color-mix(in oklab, var(--brand) 22%, transparent)' : 'var(--shadow-card)',
        transition: 'background .18s, border-color .18s, box-shadow .18s',
      }}
    >
      {art ? (
        <span className="grid place-items-center w-14 h-14 shrink-0"><Emo e={art} size={34} /></span>
      ) : icon ? (
        <span className="grid place-items-center w-11 h-11 rounded-lg shrink-0" style={{ background: selected ? 'var(--brand)' : 'var(--bg-deep)', color: selected ? 'var(--on-brand)' : 'var(--ink-2)', transition: 'background .18s' }}>
          <Icon name={icon} size={22} />
        </span>
      ) : (
        <span className="hidden sm:grid place-items-center w-8 h-8 rounded-[9px] shrink-0 t-small font-bold t-num" style={{ border: '1.5px solid var(--line-strong)', color: 'var(--ink-3)' }}>{num(n)}</span>
      )}
      <span className="flex-1 min-w-0">
        <span className="block font-semibold" style={{ fontSize: 17 }}>{title}</span>
        {desc && <span className="block t-small ink-2">{desc}</span>}
      </span>
      <span className="grid place-items-center w-7 h-7 rounded-full shrink-0" style={{ background: selected ? 'var(--brand)' : 'transparent', border: selected ? 'none' : '2px solid var(--line-strong)', color: 'var(--on-brand)' }}>
        <AnimatePresence>{selected && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 20 }} className="grid">
            <Icon name="check" size={16} />
          </motion.span>
        )}</AnimatePresence>
      </span>
    </motion.button>
  )
}

function TimeStep({ minutes, pick }: { minutes: Minutes | null; pick: (m: Minutes) => void }) {
  const { t, num } = useI18n()
  const total = courseMinutes(FIN_LIT)
  const finish = (m: Minutes) => {
    const days = total / m
    return days < 90 ? t('ob.time.finishWeeks', { w: num(Math.round(days / 7)) }) : t('ob.time.finish', { m: num(Math.round(days / 30)) })
  }
  return (
    <>
      <div role="radiogroup" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TIMES.map((m, i) => {
          const sel = minutes === m
          return (
            <motion.button key={m} role="radio" aria-checked={sel} onClick={() => pick(m)} whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center justify-center gap-1 py-5 rounded-xl cursor-pointer"
              style={{ font: 'inherit', color: 'var(--ink)', background: sel ? 'var(--brand-soft)' : 'var(--surface)', border: `1.5px solid ${sel ? 'var(--brand)' : 'var(--line)'}`, boxShadow: sel ? '0 0 0 3px color-mix(in oklab, var(--brand) 22%, transparent)' : 'var(--shadow-card)', transition: 'background .18s, border-color .18s, box-shadow .18s' }}>
              <TimeGlyph level={i} active={sel} />
              <span className="t-h3 t-num">{t(`ob.time.${m}` as StrKey)}</span>
              <span className="t-small ink-2">{t(`ob.time.${m}.d` as StrKey)}</span>
            </motion.button>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        {minutes && (
          <motion.div key={minutes} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-5 inline-flex items-center gap-2 chip chip-leaf">
            <Icon name="flag" size={16} />{finish(minutes)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Little bars that fill up with the time level — a playful read of "how much". */
function TimeGlyph({ level, active }: { level: number; active: boolean }) {
  return (
    <span className="flex items-end gap-1 h-7 mb-1" aria-hidden="true">
      {[0, 1, 2, 3].map((b) => (
        <motion.span key={b} className="w-2 rounded-full" initial={false}
          animate={{ height: 8 + b * 6, background: b <= level ? (active ? 'var(--brand)' : 'var(--color-leaf-300)') : 'var(--bg-deep)' }}
          transition={{ delay: active ? b * 0.06 : 0 }} />
      ))}
    </span>
  )
}

/* ─────────────────────────── Choose your Piko ─────────────────────────── */

/** Ten friends to choose from. Tapping one puts it in the spotlight with a short story the parent reads
 *  aloud; the child decides. The chosen one becomes Piko on every screen from here on. */
function BuddyStep({ name, text, buddy, pick }: { name: string; text: string; buddy: BuddyId | null; pick: (b: BuddyId) => void }) {
  const { t } = useI18n()
  const short = useShortScreen()
  const [shown, setShown] = useState<BuddyId>(buddy ?? BUDDIES[0].id)
  const [pop, setPop] = useState(0)
  const info = buddyInfo(shown)
  const choose = (id: BuddyId) => { sfx.chosen(); setShown(id); pick(id); setPop((n) => n + 1) }
  return (
    <div>
      <h2 className="t-h2 m-0 text-center" style={{ textWrap: 'balance' }}>{text}</h2>
      <p className="t-small ink-2 text-center mt-1 mb-0">{t('ob.buddy.hint', { name })}</p>

      {/* the spotlight: the friend in front, its story for the parent to read aloud */}
      <div className="card mt-4 overflow-hidden" style={{ borderRadius: 22 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={shown} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 p-4 sm:p-5"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
            <div className="relative shrink-0 grid place-items-center rounded-2xl" style={{ background: info.tint, width: short ? 132 : 160, height: short ? 132 : 160 }}>
              <motion.div key={pop} initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
                <Sprout size={short ? 112 : 136} stage={buddy === shown ? 2 : 1} mood={buddy === shown ? 'cheer' : 'happy'} kind={shown} />
              </motion.div>
              {buddy === shown && pop > 0 && <ChoiceBurst key={pop} />}
            </div>
            <div className="min-w-0 text-center sm:text-start">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h3 className="t-h2 m-0">{info.name}</h3>
                {buddy === shown && <span className="badge"><Icon name="check" size={12} />{t('ob.buddy.mine')}</span>}
              </div>
              <p className="ink-2 m-0 mt-0.5 t-small">{info.tagline}</p>
              <span className="chip chip-sun mt-2" style={{ height: 28 }}>{info.power}</span>
              <p className="m-0 mt-3" style={{ fontSize: 17, lineHeight: 1.6 }}>
                <span className="t-caption ink-3 block mb-0.5"><Icon name="book" size={12} /> {t('ob.buddy.read')}</span>
                {info.story}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* the lineup */}
      <div role="radiogroup" aria-label={text} className="grid grid-cols-5 gap-2 sm:gap-3 mt-4">
        {BUDDIES.map((b, i) => {
          const on = buddy === b.id, looking = shown === b.id
          return (
            <motion.button key={b.id} role="radio" aria-checked={on} aria-label={b.name} onClick={() => choose(b.id)}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, type: 'spring', stiffness: 400, damping: 22 }}
              whileHover={{ y: -4 }} whileTap={{ scale: 0.92 }}
              className="relative flex flex-col items-center gap-0.5 rounded-2xl p-1.5 sm:p-2 cursor-pointer"
              style={{ font: 'inherit', color: 'var(--ink)', background: on ? 'var(--brand-soft)' : looking ? b.tint : 'var(--surface)',
                border: `2px solid ${on ? 'var(--brand)' : looking ? 'var(--line-strong)' : 'var(--line)'}`,
                boxShadow: on ? '0 0 0 3px color-mix(in oklab, var(--brand) 22%, transparent)' : 'var(--shadow-card)' }}>
              <Sprout size={short ? 50 : 62} stage={1} mood={on ? 'cheer' : 'happy'} kind={b.id} interactive={false} />
              <span className="t-caption font-semibold truncate max-w-full">{b.name.split(' ')[1]}</span>
              {on && <span className="absolute -top-2 -end-2 grid place-items-center w-6 h-6 rounded-full" style={{ background: 'var(--brand)', color: 'var(--on-brand)' }}><Icon name="check" size={14} /></span>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function ChoiceBurst() {
  const bits = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    return { x: Math.cos(a) * (70 + (i % 3) * 14), y: Math.sin(a) * (60 + (i % 2) * 12), c: ['#C9F27B', '#4FB65A', '#FFC83D', '#4DA3FF', '#FF7A45'][i % 5] }
  })
  return (
    <span className="absolute left-1/2 top-1/2 pointer-events-none" aria-hidden="true">
      {bits.map((b, i) => (
        <motion.span key={i} className="absolute w-2.5 h-2.5" style={{ background: b.c, borderRadius: i % 2 ? 999 : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }} animate={{ x: b.x, y: b.y, opacity: 0, scale: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
      ))}
    </span>
  )
}

/* ─────────────────────────── Plant the seed ─────────────────────────── */

function PlantStep({ profile, onDone }: { profile: Profile; onDone: () => void }) {
  const { t, pick, num } = useI18n()
  const [phase, setPhase] = useState<'idle' | 'dropping' | 'grown'>('idle')
  const plant = () => {
    if (phase !== 'idle') return
    setPhase('dropping')
    sfx.wake()
    window.setTimeout(() => setPhase('grown'), 750)
  }
  const focus = useMemo(() => focusUnits(profile).map((id) => FIN_LIT.units.find((u) => u.id === id)!).filter(Boolean).slice(0, 4), [profile])
  const firstLesson = FIN_LIT.units[0].nodes[0]
  const short = useShortScreen()

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-end gap-3 sm:gap-4 mt-2 sm:mt-6">
        <div className="card px-5 py-4 flex-1" style={{ borderRadius: 22 }}>
          <p className="m-0 t-h3" aria-live="polite">{phase === 'grown' ? t('ob.plant.done') : t('ob.plant.say')}</p>
        </div>
      </div>

      {/* scene */}
      <button onClick={plant} disabled={phase !== 'idle'} aria-label={`${t('ob.plant.hint')}: ${t('ob.plant.cta')}`}
        className={`relative mt-4 sm:mt-6 w-full max-w-md rounded-2xl overflow-hidden border-0 p-0 transition-[height] duration-700 ${phase === 'grown' ? 'h-[clamp(170px,26dvh,288px)]' : 'h-[clamp(200px,40dvh,288px)]'}`}
        style={{ background: 'var(--brand-soft)', cursor: phase === 'idle' ? 'pointer' : 'default' }}>
        {/* sun */}
        <motion.span className="absolute top-6 end-8 w-14 h-14 rounded-full" style={{ background: 'var(--color-sun)' }}
          animate={phase === 'grown' ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.8 }} />
        {/* soil */}
        <motion.svg viewBox="0 0 400 120" className="absolute bottom-0 inset-x-0 w-full" aria-hidden="true"
          animate={phase === 'dropping' ? { y: [0, 4, -2, 0] } : {}} transition={{ duration: 0.4, delay: 0.35 }}>
          <path d="M0 60 C80 30 140 28 200 30 C260 28 320 30 400 60 V120 H0Z" fill="#8d99ae" />
          <path d="M0 60 C80 30 140 28 200 30 C260 28 320 30 400 60" stroke="#5c677d" strokeWidth="4" fill="none" />
          {[60, 120, 270, 330].map((x) => <circle key={x} cx={x} cy={80 + (x % 3) * 8} r="4" fill="#5c677d" />)}
        </motion.svg>

        {/* seed */}
        <AnimatePresence>
          {phase !== 'grown' && (
            <motion.span className="absolute left-1/2 -translate-x-1/2" style={{ top: 70 }}
              initial={{ y: -12 }} animate={phase === 'dropping' ? { y: 150, scale: 0.7 } : { y: [-12, -2, -12] }}
              exit={{ opacity: 0 }}
              transition={phase === 'dropping' ? { duration: 0.4, ease: 'easeIn' } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <svg width="34" height="44" viewBox="0 0 34 44" aria-hidden="true"><path d="M20 2 L4 26 H16 L12 42 L30 16 H18 Z" fill="#FFC83D" stroke="#946200" strokeWidth="2" strokeLinejoin="round" /></svg>
            </motion.span>
          )}
        </AnimatePresence>

        {/* sprout rises */}
        <AnimatePresence>
          {phase === 'grown' && (
            <motion.span className="absolute left-1/2 -translate-x-1/2 bottom-12"
              initial={{ y: 90, scale: 0.3 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 12 }}>
              <Sprout size={short ? 110 : 150} stage={1} mood="cheer" kind={profile.buddy} />
            </motion.span>
          )}
        </AnimatePresence>
        {phase === 'grown' && <LeafBurst />}

        {phase === 'idle' && (
          <span className="absolute bottom-4 inset-x-0 text-center t-small font-semibold" style={{ color: '#fff' }}>{t('ob.plant.hint')}</span>
        )}
      </button>

      {phase === 'idle' && (
        <button className={cn(buttonVariants({ variant: 'default', size: 'xl' }), 'mt-4 sm:mt-6 min-w-56')} onClick={plant}>
          <Icon name="sparkle" size={18} />{t('ob.plant.cta')}
        </button>
      )}

      <AnimatePresence>
        {phase === 'grown' && (
          <motion.div className="card w-full max-w-md mt-4 sm:mt-6 p-5 sm:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <h2 className="t-h2 m-0">{t('ob.sum.title')}</h2>
            <ul className="list-none p-0 m-0 mt-3 sm:mt-4 grid gap-2 sm:gap-3">
              <SumRow icon="xp" tone="var(--sun-soft)" color="var(--sun-strong)">{t('ob.sum.goal', { x: num(goalXp(profile.minutes)), m: num(profile.minutes) })}</SumRow>
              {focus.length > 0 && <SumRow icon="target" tone="var(--brand-soft)" color="var(--brand)">{t('ob.sum.focus', { u: focus.map((u) => pick(u.title)).join(' · ') })}</SumRow>}
              <SumRow icon="book" tone="var(--sky-soft)" color="var(--sky-strong)">{t('ob.sum.first', { t: pick(firstLesson.title) })}</SumRow>
            </ul>
            <button className={cn(buttonVariants({ variant: 'default', size: 'xl' }), 'w-full mt-4 sm:mt-6')} onClick={onDone}>{t('ob.sum.cta')}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SumRow({ icon, tone, color, children }: { icon: IconName; tone: string; color: string; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid place-items-center w-10 h-10 rounded-lg shrink-0" style={{ background: tone, color }}><Icon name={icon} size={20} /></span>
      <span className="t-small font-medium">{children}</span>
    </li>
  )
}

function LeafBurst() {
  const leaves = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return { x: Math.cos(a) * (90 + (i % 3) * 20), y: Math.sin(a) * 70 - 40, r: (i * 47) % 360, c: i % 3 === 0 ? '#C9F27B' : i % 3 === 1 ? '#4FB65A' : '#FFC83D' }
  })
  return (
    <span className="absolute left-1/2 bottom-28 pointer-events-none" aria-hidden="true">
      {leaves.map((l, i) => (
        <motion.svg key={i} width="16" height="16" viewBox="0 0 16 16" className="absolute"
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }} animate={{ x: l.x, y: l.y, opacity: 0, rotate: l.r, scale: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}>
          <path d="M2 14 C2 6 8 2 14 2 C14 8 10 14 2 14Z" fill={l.c} />
        </motion.svg>
      ))}
    </span>
  )
}
