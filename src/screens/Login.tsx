import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { useState } from 'react'
import { FIN_LIT, allNodes, courseMinutes } from '../curriculum/course'
import { GoogleMark, Icon, type IconName } from '../ds/Icon'
import { Sprout } from '../ds/Sprout'
import { LangThemeToggles, Logo, Spinner, useShortScreen } from '../ds/ui'
import { useI18n } from '../i18n/I18n'
import type { StrKey } from '../i18n/strings'
import { DEMO, useAuth } from '../lib/auth'
import { hasCarried } from '../lib/cloud'

const rise = (d: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const },
})

const FEATURES: { icon: IconName; tone: string; t: StrKey; d: StrKey }[] = [
  { icon: 'clock', tone: 'var(--sky-soft)', t: 'login.f1.t', d: 'login.f1.d' },
  { icon: 'target', tone: 'var(--sun-soft)', t: 'login.f2.t', d: 'login.f2.d' },
  { icon: 'sparkle', tone: 'var(--brand-soft)', t: 'login.f3.t', d: 'login.f3.d' },
]

export function Login() {
  const { t, num } = useI18n()
  const { signInWithGoogle } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const [mood, setMood] = useState<'happy' | 'cheer' | 'wink'>('happy')
  const short = useShortScreen()

  const go = async () => {
    setBusy(true); setError(false); setMood('cheer')
    try { await signInWithGoogle() } catch { setError(true); setBusy(false); setMood('happy') }
  }

  const hours = Math.round(courseMinutes(FIN_LIT) / 60)
  const lessons = allNodes(FIN_LIT).filter((n) => n.kind === 'lesson').length

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center justify-between px-4 sm:px-8 h-14 sm:h-18 sm:py-4 max-w-6xl w-full mx-auto">
        <Logo />
        <LangThemeToggles />
      </header>

      <main className="flex-1 min-h-0 w-full max-w-6xl mx-auto px-4 sm:px-8 pb-4 lg:pb-8 grid content-center gap-4 sm:gap-8 lg:gap-x-14 lg:gap-y-8 lg:grid-cols-[1.05fr_1fr] items-center
        [grid-template-areas:'intro'_'card'_'more'] lg:[grid-template-areas:'intro_card'_'more_card']">

        <section className="[grid-area:intro] pt-2 lg:pt-0 lg:self-end">
          <motion.span {...rise(0)} className="badge">{t('login.eyebrow')}</motion.span>
          <motion.h1 {...rise(0.06)} className="t-display mt-2 sm:mt-4 max-w-[14ch] [@media(max-height:760px)]:text-[30px]">{t('login.title')}</motion.h1>
          <motion.p {...rise(0.12)} className="t-body ink-2 mt-2 sm:mt-4 max-w-[46ch] max-lg:[@media(max-height:760px)]:hidden" style={{ fontSize: 17 }}>{t('login.lead')}</motion.p>
        </section>

        <motion.section {...rise(0.15)} className="[grid-area:card] w-full max-w-md mx-auto lg:max-w-none">
          <div className="card overflow-hidden" style={{ boxShadow: 'var(--shadow-pop)' }}>
            {/* stage */}
            <div className="relative h-[clamp(150px,26dvh,256px)] overflow-hidden" style={{ background: 'var(--brand-soft)' }}>
              <div className="absolute inset-x-[-10%] bottom-[-55%] h-[90%] rounded-[50%]" style={{ background: 'var(--surface)', opacity: 0.55 }} />
              <motion.div
                className="absolute top-6 start-6 sm:start-8 max-w-[60%]"
                initial={{ opacity: 0, scale: 0.6, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 380, damping: 18 }}
              >
                <div className="card px-4 py-2.5 t-small font-semibold relative" style={{ borderRadius: 18 }}>
                  {t('login.bubble')}
                  <span className="absolute -bottom-1.5 end-8 w-3 h-3 rotate-45" style={{ background: 'var(--surface)', borderInlineEnd: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }} />
                </div>
              </motion.div>
              <div className="absolute bottom-0 end-8 sm:end-12" onMouseEnter={() => !busy && setMood('wink')} onMouseLeave={() => !busy && setMood('happy')}>
                <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 16 }}>
                  <Sprout size={short ? 120 : 170} stage={1} mood={mood} title="Sprout" />
                </motion.div>
              </div>
              <FloatChip className="bottom-10 start-6 sm:start-8" delay={1.0} tone="sun" icon="xp" text="+20 XP" />
              <FloatChip className="bottom-24 start-28 sm:start-32 [@media(max-height:760px)]:bottom-10 [@media(max-height:760px)]:start-36" delay={1.2} tone="flame" icon="flame" text={num(3)} />
            </div>

            <div className="p-5 sm:p-8 [@media(max-height:760px)]:sm:p-6">
              <h2 className="t-h2">{t('login.cardTitle')}</h2>
              <p className="ink-2 t-small mt-1">{t('login.cardSub')}</p>
              <button className={cn(buttonVariants({ variant: 'outline', size: 'xl' }), 'w-full mt-4 sm:mt-6')} onClick={go} disabled={busy} aria-busy={busy}>
                {busy ? <Spinner /> : <GoogleMark />}
                {busy ? t('login.signing') : t('login.google')}
              </button>
              {error && <p role="alert" className="t-small mt-3" style={{ color: 'var(--danger)' }}>{t('login.error')}</p>}
              <p className="t-caption ink-3 mt-4 font-normal">{t('login.terms')}</p>
              {!DEMO && hasCarried() && (
                <p role="status" className="note-sun t-caption mt-3 font-normal rounded-lg px-3 py-2">
                  <strong>{t('move.title')}</strong> {t('move.body')}
                </p>
              )}
              {DEMO && (
                <p className="note-sun t-caption mt-3 font-normal rounded-lg px-3 py-2">
                  {t('login.demo')}
                </p>
              )}
            </div>
          </div>
        </motion.section>

        <section className="[grid-area:more] lg:self-start hidden lg:block">
          <ul className="grid gap-4 [@media(max-height:820px)]:gap-2">
            {FEATURES.map((f, i) => (
              <motion.li key={f.t} {...rise(0.25 + i * 0.07)} className="flex items-center gap-4">
                <span className="grid place-items-center w-12 h-12 rounded-lg shrink-0" style={{ background: f.tone, color: 'var(--ink)' }}>
                  <Icon name={f.icon} size={22} />
                </span>
                <span>
                  <span className="block font-semibold">{t(f.t)}</span>
                  <span className="block t-small ink-2">{t(f.d)}</span>
                </span>
              </motion.li>
            ))}
          </ul>
          <motion.dl {...rise(0.5)} className="flex gap-8 mt-6 pt-4 border-t [@media(max-height:820px)]:hidden" style={{ borderColor: 'var(--line)' }}>
            <Stat n={`${hours}+`} label={t('login.stat.hours')} />
            <Stat n={num(FIN_LIT.units.length)} label={t('login.stat.units')} />
            <Stat n={num(lessons)} label={t('login.stat.lessons')} />
          </motion.dl>
        </section>
      </main>
    </div>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <dt className="t-h1 t-num" style={{ color: 'var(--brand-ink)' }}>{n}</dt>
      <dd className="t-small ink-2 m-0">{label}</dd>
    </div>
  )
}

function FloatChip({ className, delay, tone, icon, text }: { className: string; delay: number; tone: 'sun' | 'flame'; icon: IconName; text: string }) {
  return (
    <motion.div className={`absolute ${className}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: 'spring', stiffness: 400, damping: 15 }}>
      <div className={`chip chip-${tone}`} style={{ animation: `bob 3.2s ease-in-out ${delay}s infinite`, boxShadow: 'var(--shadow-card)' }}>
        <Icon name={icon} size={16} style={{ color: `var(--color-${tone})` }} /><bdi dir="ltr">{text}</bdi>
      </div>
    </motion.div>
  )
}
