import { buttonVariants } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FIN_LIT, allNodes } from '../curriculum/course'
import { isChallenge, isQuestion, needsCheck, type Step } from '../curriculum/lessonTypes'
import type { L } from '../curriculum/course'
import { LESSONS } from '../curriculum/lessons'
import { Icon } from '../ds/Icon'
import { Sprout } from '../ds/Sprout'
import { clock, CountUp, useNow, useShortScreen } from '../ds/ui'
import { useI18n } from '../i18n/I18n'
import type { StrKey } from '../i18n/strings'
import { Calc, Explain, Mcq, Scenario, Sort, type Status, Basket, Week } from '../lesson/Steps'
import { Build, Match, Order, Pick, Trace } from '../lesson/KidSteps'
import { useAuth } from '../lib/auth'
import { CHALLENGE_XP, completePart, failPart, loadProgress, lockOf, PARTS_PER_LESSON, PASS_RATE, recordChoice, type PartLock, type PartResult } from '../lib/progress'
import { choiceKey } from '../lib/future'

const PRAISE: StrKey[] = ['lesson.ok.1', 'lesson.ok.2', 'lesson.ok.3', 'lesson.ok.4']

export function LessonRoute() {
  const { id } = useParams()
  const { user, ready } = useAuth()
  const [params] = useSearchParams()
  if (!ready) return null
  if (!user || !id || !LESSONS[id]) return <Navigate to="/" replace />
  const p = loadProgress(user.id)
  const fromUrl = params.get('part')
  const next = p.done.includes(id) ? 0 : Math.min(p.parts[id] ?? 0, PARTS_PER_LESSON - 1)
  // A part can be replayed, but never skipped ahead of the learner's real progress.
  const maxPart = p.done.includes(id) ? PARTS_PER_LESSON - 1 : next
  const part = fromUrl !== null ? Math.max(0, Math.min(maxPart, Number(fromUrl) || 0)) : next
  // A part failed on a first try rests for a few hours; earlier parts can still be replayed meanwhile.
  const lock = lockOf(p, id)
  if (lock && part === lock.part) return <LockedPart key={`${id}-lock`} lessonId={id} lock={lock} />
  return <LessonPlayer key={`${id}-${part}`} lessonId={id} partIndex={part} uid={user.id} />
}

type QItem = { step: Step; idx: number; retry: boolean }

function LessonPlayer({ lessonId, partIndex, uid }: { lessonId: string; partIndex: number; uid: string }) {
  const { t, pick, num, dir } = useI18n()
  const navigate = useNavigate()
  const lesson = LESSONS[lessonId]
  const part = lesson.parts[partIndex]
  const node = allNodes(FIN_LIT).find((n) => n.id === lessonId)!

  const [queue, setQueue] = useState<QItem[]>(() => part.steps.map((step, idx) => ({ step, idx, retry: false })))
  const [pos, setPos] = useState(0)
  const [status, setStatus] = useState<Status>('answering')
  const [combo, setCombo] = useState(0)
  const [showCombo, setShowCombo] = useState(0)
  const [missed, setMissed] = useState<Set<number>>(new Set())
  const [exitOpen, setExitOpen] = useState(false)
  const [result, setResult] = useState<PartResult | null>(null)
  const [failed, setFailed] = useState<{ lock: PartLock; score: number } | null>(null)
  // Rushing: two answers checked within 3 seconds of the question appearing → a gentle nudge to listen.
  const shownAt = useRef(Date.now())
  const rushStreak = useRef(0)
  const [rushNote, setRushNote] = useState(false)
  useEffect(() => {
    if (!rushNote) return
    const id = window.setTimeout(() => setRushNote(false), 5000)
    return () => window.clearTimeout(id)
  }, [rushNote])
  const started = useRef(Date.now())
  const answer = useRef({ ready: false, correct: false })
  const [ready, setReady] = useState(false)

  const challengeWon = useRef(false)
  const item = queue[pos]
  const q = needsCheck(item.step)
  const guess = item.step.kind === 'predict'
  const challenge = isChallenge(item.step)
  const questions = part.steps.filter(isQuestion).length

  const report = useCallback((r: boolean, c: boolean) => { answer.current = { ready: r, correct: c }; setReady(r) }, [])

  const check = () => {
    if (!answer.current.ready) return
    if (Date.now() - shownAt.current < 3000) { rushStreak.current += 1; if (rushStreak.current >= 2) { setRushNote(true); rushStreak.current = 0 } }
    else rushStreak.current = 0
    // A guess is never graded: no missed mark, no retry, the streak of right answers stays.
    if (guess) { setStatus(answer.current.correct ? 'correct' : 'wrong'); return }
    if (answer.current.correct) {
      if (challenge && !item.retry) challengeWon.current = true
      setStatus('correct')
      if (!item.retry) { const c = combo + 1; setCombo(c); if (c >= 3) setShowCombo(c) }
    } else {
      setStatus('wrong')
      setCombo(0)
      setMissed((m) => new Set(m).add(item.idx))
      // Comes back at the end of the part — no punishment, just another go.
      if (!item.retry) setQueue((qq) => [...qq, { step: item.step, idx: item.idx, retry: true }])
    }
  }

  const advance = () => {
    if (pos + 1 >= queue.length) {
      // Below the pass rate on first tries, a first attempt doesn't count: no XP, and the part rests.
      const score = questions ? (questions - missed.size) / questions : 1
      if (score < PASS_RATE) {
        const lock = failPart(uid, lessonId, partIndex)
        if (lock) { setFailed({ lock, score }); return }
      }
      setResult(completePart(uid, lessonId, partIndex, missed.size === 0, challengeWon.current))
      return
    }
    setPos(pos + 1)
    shownAt.current = Date.now()
    setStatus('answering')
    setReady(false)
    answer.current = { ready: false, correct: false }
    setShowCombo(0)
  }

  const primary = () => (q && status === 'answering' ? check() : advance())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !exitOpen && !result && (ready || status !== 'answering')) { e.preventDefault(); primary() }
      if (e.key === 'Escape' && !exitOpen) setExitOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const praise = useMemo(() => t(PRAISE[(pos * 7 + partIndex) % PRAISE.length]), [pos, partIndex, t])
  const progress = (pos + (status === 'answering' ? 0 : 1)) / queue.length

  if (failed) return <LockedPart lessonId={lessonId} lock={failed.lock} score={failed.score} />

  if (result) {
    const nodes = allNodes(FIN_LIT)
    const after = nodes[nodes.findIndex((n) => n.id === lessonId) + 1]
    const nextLesson = after && LESSONS[after.id] ? after.id : null
    const lastPart = partIndex + 1 >= PARTS_PER_LESSON
    return <PartComplete lessonTitle={pick(node.title)} partIndex={partIndex} result={result} questions={questions} missed={missed.size}
      seconds={Math.round((Date.now() - started.current) / 1000)}
      teaser={lastPart ? lesson.teaser : part.teaser}
      onNext={() => navigate(`/lesson/${lessonId}?part=${partIndex + 1}`)} onMap={() => navigate('/')}
      onNextLesson={nextLesson ? () => navigate(`/lesson/${nextLesson}`) : undefined} />
  }

  const why = 'why' in item.step ? pick(item.step.why) : ''

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* top bar */}
      <header className="shrink-0 max-w-3xl w-full mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3">
        <button className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))} aria-label={t('lesson.exit')} onClick={() => setExitOpen(true)}><Icon name="x" /></button>
        <div className="flex-1">
          <div className="bar" style={{ height: 14 }} role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${Math.max(3, progress * 100)}%`, background: 'var(--brand)', boxShadow: 'inset 0 -4px 0 rgb(0 0 0 / .12)' }} />
          </div>
        </div>
        <span className="t-small font-semibold ink-2 whitespace-nowrap">{t('lesson.partOf', { i: num(partIndex + 1), n: num(PARTS_PER_LESSON) })}</span>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain" data-lesson-main>
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-4">
        <div className="flex items-center gap-2 t-small ink-3 mb-3 sm:mb-4 empty:hidden">
          <span className="[@media(max-height:700px)]:hidden">{pick(part.title)}</span>
          {item.retry && <span className="badge badge-sky"><Icon name="refresh" size={12} />{t('lesson.retry')}</span>}
          {guess && <span className="badge badge-sky"><Icon name="sparkle" size={12} />{t('lesson.predict.badge')}</span>}
          {challenge && <span className="badge note-sun"><Icon name="trophy" size={12} />{t('lesson.challenge.badge')} · <bdi dir="ltr">+{num(CHALLENGE_XP)} XP</bdi></span>}
          <AnimatePresence>
            {rushNote && (
              <motion.span key="rush" role="status" className="badge note-sun h-auto py-1 whitespace-normal" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Icon name="clock" size={12} />{t('lesson.rush')}
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showCombo >= 3 && status === 'correct' && (
              <motion.span key={showCombo} className="chip chip-flame" style={{ height: 28 }} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 15 }}>
                <Icon name="flame" size={14} style={{ color: 'var(--flame-strong)' }} />{t('lesson.combo', { n: num(showCombo) })}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={pos} data-step={pos} initial={{ opacity: 0, x: dir === 'rtl' ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir === 'rtl' ? 30 : -30 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
            {item.step.kind === 'explain' && <Explain step={item.step} report={report} />}
            {(item.step.kind === 'mcq' || item.step.kind === 'predict') && <Mcq step={item.step} status={status} report={report} />}
            {item.step.kind === 'sort' && <Sort step={item.step} status={status} report={report} />}
            {item.step.kind === 'calc' && <Calc step={item.step} report={report} />}
            {item.step.kind === 'basket' && <Basket step={item.step} report={report} />}
            {item.step.kind === 'week' && <Week step={item.step} report={report} />}
            {item.step.kind === 'pick' && <Pick step={item.step} status={status} report={report} />}
            {item.step.kind === 'order' && <Order step={item.step} status={status} report={report} />}
            {item.step.kind === 'match' && <Match step={item.step} status={status} report={report} />}
            {item.step.kind === 'build' && <Build step={item.step} status={status} report={report} />}
            {item.step.kind === 'trace' && <Trace step={item.step} report={report} />}
            {item.step.kind === 'scenario' && <Scenario step={item.step} report={report} onChoose={(i) => recordChoice(uid, choiceKey(lessonId, partIndex, item.idx), i)} />}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>

      {/* bottom action / feedback sheet */}
      <footer className="shrink-0 z-20">
        <motion.div initial={false}
          animate={{ backgroundColor: status === 'answering' ? 'var(--bg)' : guess ? 'var(--sky-soft)' : status === 'correct' ? 'var(--brand-soft)' : 'var(--flame-soft)' }}
          className="border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <AnimatePresence mode="wait">
              {status !== 'answering' && (
                <motion.div key={status} className="flex-1 flex items-start gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="shrink-0 -my-2"><Sprout size={56} stage={1} mood={status === 'correct' ? 'cheer' : guess ? 'wink' : 'think'} /></div>
                  <div className="min-w-0" role="status">
                    <div className="t-h3 flex items-center gap-2 flex-wrap" style={{ color: guess ? 'var(--color-sky-ink)' : status === 'correct' ? 'var(--brand-ink)' : 'var(--flame-text)' }}>
                      {guess ? t(status === 'correct' ? 'lesson.predict.right' : 'lesson.predict.wrong') : status === 'correct' ? (challenge && !item.retry ? t('lesson.challenge.right') : praise) : t('lesson.notQuite')}
                      {status === 'wrong' && !guess && !item.retry && <span className="badge badge-sky" title={t('lesson.comeBack')}><Icon name="refresh" size={12} />{t('lesson.comeBack.short')}</span>}
                    </div>
                    {why && <p className="t-small m-0 mt-1" style={{ color: 'var(--ink)' }}>{why}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {status === 'answering' && <div className="hidden sm:block flex-1" />}
            <button className={cn(buttonVariants({ variant: 'default', size: 'xl' }), 'sm:min-w-48', status === 'wrong' && !guess && 'bg-[var(--flame-strong)] text-[var(--on-strong)] hover:bg-[var(--flame-strong)]/90')} onClick={primary} disabled={status === 'answering' && !ready}>
              {q && status === 'answering' ? t(guess ? 'lesson.predict.check' : 'lesson.check') : t('lesson.continue')}
            </button>
          </div>
        </motion.div>
      </footer>

      <ExitDialog open={exitOpen} onStay={() => setExitOpen(false)} onLeave={() => navigate('/')} />
    </div>
  )
}

function ExitDialog({ open, onStay, onLeave }: { open: boolean; onStay: () => void; onLeave: () => void }) {
  const { t } = useI18n()
  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) onStay() }}>
      <AlertDialogContent className="sm:max-w-sm text-center">
        <AlertDialogHeader className="items-center text-center sm:text-center">
          <Sprout size={88} stage={1} mood="think" />
          <AlertDialogTitle className="t-h2">{t('lesson.exit.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('lesson.exit.body')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogCancel variant="default" size="xl" className="w-full m-0" autoFocus>{t('lesson.exit.stay')}</AlertDialogCancel>
          <AlertDialogAction variant="ghost" size="xl" className="w-full m-0 text-[var(--flame-text)]" onClick={onLeave}>{t('lesson.exit.leave')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/* ─────────────────────────── Failed / resting part ─────────────────────────── */

/** Shown right after a failed first attempt (with the score), and whenever the learner comes back
 *  before the cool-down ends. Points to something useful to do meanwhile: review what came before. */
function LockedPart({ lessonId, lock, score }: { lessonId: string; lock: PartLock; score?: number }) {
  const { t, pick, num } = useI18n()
  const navigate = useNavigate()
  const now = useNow()
  const left = lock.until - now
  useEffect(() => { if (left <= 0) navigate(`/lesson/${lessonId}?part=${lock.part}`, { replace: true }) }, [left, lessonId, lock.part, navigate])

  // Something to review meanwhile: the part before this one, or else the previous lesson.
  const nodes = allNodes(FIN_LIT)
  const idx = nodes.findIndex((n) => n.id === lessonId)
  const prevLesson = nodes.slice(0, idx).reverse().find((n) => LESSONS[n.id])
  const review = lock.part > 0
    ? { label: t('lesson.lock.review'), go: () => navigate(`/lesson/${lessonId}?part=${lock.part - 1}`) }
    : prevLesson ? { label: t('lesson.lock.reviewLesson', { t: pick(prevLesson.title) }), go: () => navigate(`/lesson/${prevLesson.id}?part=0`) } : null

  return (
    <div className="h-dvh overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-6 text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}>
        <Sprout size={120} stage={1} mood={score !== undefined ? 'think' : 'calm'} />
      </motion.div>
      <h1 className="t-h1 mt-3 mb-0">{score !== undefined ? t('lesson.fail.title') : t('lesson.lock.title')}</h1>
      {score !== undefined && (
        <p className="ink-2 mt-2 mb-0 max-w-sm">{t('lesson.fail.score', { p: num(Math.round(score * 100)), need: num(Math.round(PASS_RATE * 100)) })}</p>
      )}
      <div className="card mt-5 px-6 py-4 w-full max-w-sm">
        <div className="t-small ink-2">{t('lesson.lock.opens')}</div>
        <div className="t-num font-extrabold mt-1" style={{ fontSize: 40, lineHeight: 1.1, color: 'var(--brand-ink)' }} role="timer" aria-live="off">
          <bdi dir="ltr">{clock(left)}</bdi>
        </div>
      </div>
      <p className="t-small ink-2 mt-4 mb-0 max-w-sm">{t('lesson.lock.why')}</p>
      <div className="w-full max-w-sm mt-5 grid gap-2">
        {review && <button className={cn(buttonVariants({ variant: 'default', size: 'xl' }), 'w-full')} onClick={review.go}>{review.label}</button>}
        <button className={cn(buttonVariants({ variant: review ? 'ghost' : 'default', size: 'xl' }), 'w-full')} onClick={() => navigate('/')}>{t('lesson.toMap')}</button>
      </div>
    </div>
  )
}

/* ─────────────────────────── Part complete ─────────────────────────── */

function PartComplete({ lessonTitle, partIndex, result, questions, missed, seconds, teaser, onNext, onMap, onNextLesson }: {
  lessonTitle: string; partIndex: number; result: PartResult; questions: number; missed: number; seconds: number; teaser?: L
  onNext: () => void; onMap: () => void; onNextLesson?: () => void
}) {
  const { t, num, pick } = useI18n()
  const last = partIndex + 1 >= PARTS_PER_LESSON
  const accuracy = questions ? Math.round(((questions - missed) / questions) * 100) : 100
  const mm = Math.floor(seconds / 60), ss = String(seconds % 60).padStart(2, '0')
  const streakUp = result.streakAfter > result.streakBefore
  const short = useShortScreen()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') (last ? onNextLesson ?? onMap : onNext)() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [last, onMap, onNext, onNextLesson])

  return (
    <div className="h-dvh overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-4 text-center">
      <motion.div initial={{ scale: 0.3, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 13 }} className="relative">
        <Sprout size={short ? 104 : 150} stage={1} mood="cheer" />
        <Burst />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="t-display mt-4 mb-0" style={{ fontSize: 'clamp(28px, 5vw, 38px)' }}>
        {last ? t('lesson.done.lesson') : t('lesson.done.part', { i: num(partIndex + 1) })}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ink-2 mt-2 mb-0">{lessonTitle}</motion.p>

      {/* lesson parts tracker */}
      <div className="flex gap-2 mt-4" aria-label={t('lesson.partOf', { i: num(partIndex + 1), n: num(PARTS_PER_LESSON) })}>
        {Array.from({ length: PARTS_PER_LESSON }, (_, i) => (
          <motion.span key={i} className="h-3 w-14 rounded-full" initial={{ background: 'var(--bg-deep)' }}
            animate={{ background: i <= partIndex ? 'var(--brand)' : 'var(--bg-deep)' }} transition={{ delay: i === partIndex ? 0.6 : 0, duration: 0.4 }} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5 sm:mt-8 w-full max-w-md">
        <Tile delay={0.45} tone="var(--sun-soft)" ink="var(--sun-text)" icon="xp" label={t('lesson.stat.xp')}>
          {result.xpGained ? <bdi dir="ltr">+<CountUp to={result.xpGained} /></bdi> : '—'}
        </Tile>
        <Tile delay={0.55} tone="var(--brand-soft)" ink="var(--brand-ink)" icon="target" label={t('lesson.stat.accuracy')}>
          <CountUp to={accuracy} />%
        </Tile>
        <Tile delay={0.65} tone="var(--sky-soft)" ink="var(--color-sky-ink)" icon="clock" label={t('lesson.stat.time')}>
          <span className="t-num">{mm}:{ss}</span>
        </Tile>
      </div>

      <div className="grid gap-2 mt-3 w-full max-w-md">
        {result.challengeBonus > 0 && <Note delay={0.75} icon="trophy" tone="var(--sun-soft)" color="var(--sun-strong)">{t('lesson.challenge.won', { x: num(result.challengeBonus) })}</Note>}
        {result.bonus > 0 && <Note delay={0.8} icon="star" tone="var(--sun-soft)" color="var(--sun-strong)">{t('lesson.bonus', { x: num(result.bonus) })}</Note>}
        {streakUp && <Note delay={0.9} icon="flame" tone="var(--flame-soft)" color="var(--flame-strong)">{result.streakAfter === 1 ? t('lesson.streak.start') : t('lesson.streak', { n: num(result.streakAfter) })}</Note>}
        {result.newBadges.map((b, i) => <Note key={b} delay={1 + i * 0.1} icon="medal" tone="var(--berry-soft)" color="var(--berry-strong)">{t('lesson.badge', { b: t(`badge.${b}` as StrKey) })}</Note>)}
        {!result.xpGained && <Note delay={0.8} icon="refresh" tone="var(--bg-deep)" color="var(--ink-2)">{t('lesson.replay')}</Note>}
      </div>

      {/* What's next: a question from the next part or lesson, to leave them curious. */}
      {teaser && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="card w-full max-w-md mt-4 p-3 sm:p-4 flex items-center gap-3 text-start">
          <div className="shrink-0 -my-2"><Sprout size={52} stage={1} mood="wink" /></div>
          <div className="min-w-0">
            <div className="t-caption ink-3">{t(last ? 'lesson.teaser.lesson' : 'lesson.teaser.part')}</div>
            <div className="font-semibold leading-snug">{pick(teaser)}</div>
            <div className="t-small font-semibold mt-0.5" style={{ color: 'var(--brand-ink)' }}>{t('lesson.teaser.dare')}</div>
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-md mt-4 sm:mt-6 grid gap-2">
        {!last && <button className={cn(buttonVariants({ variant: 'default', size: 'xl' }), 'w-full')} onClick={onNext}>{t('lesson.nextPart', { i: num(partIndex + 2) })}</button>}
        {last && onNextLesson && <button className={cn(buttonVariants({ variant: 'default', size: 'xl' }), 'w-full')} onClick={onNextLesson}>{t('lesson.nextLesson')}</button>}
        <button className={cn(buttonVariants({ variant: last && !onNextLesson ? 'default' : 'ghost', size: 'xl' }), 'w-full')} onClick={onMap}>{t('lesson.toMap')}</button>
      </div>
    </div>
  )
}

function Tile({ delay, tone, ink, icon, label, children }: { delay: number; tone: string; ink: string; icon: 'xp' | 'target' | 'clock'; label: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: 'spring', stiffness: 300, damping: 22 }}
      className="rounded-xl p-3 sm:p-4" style={{ background: tone }}>
      <div className="flex items-center justify-center gap-1 t-caption" style={{ color: ink }}><Icon name={icon} size={14} />{label}</div>
      <div className="t-h1 mt-1" style={{ color: ink }}>{children}</div>
    </motion.div>
  )
}

function Note({ delay, icon, tone, color, children }: { delay: number; icon: 'star' | 'flame' | 'medal' | 'refresh' | 'trophy'; tone: string; color: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: 'spring', stiffness: 400, damping: 20 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-start font-medium t-small" style={{ background: tone }}>
      <Icon name={icon} size={20} style={{ color }} />{children}
    </motion.div>
  )
}

function Burst() {
  const bits = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2
    return { x: Math.cos(a) * (100 + (i % 3) * 24), y: Math.sin(a) * (80 + (i % 2) * 20), c: ['#C9F27B', '#4FB65A', '#FFC83D', '#4DA3FF', '#FF7A45'][i % 5], r: i * 41 }
  })
  return (
    <span className="absolute left-1/2 top-1/2 pointer-events-none" aria-hidden="true">
      {bits.map((b, i) => (
        <motion.span key={i} className="absolute w-3 h-3" style={{ background: b.c, borderRadius: i % 2 ? 999 : 3 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: b.x, y: b.y, opacity: 0, rotate: b.r }} transition={{ duration: 1.2, delay: 0.15, ease: 'easeOut' }} />
      ))}
    </span>
  )
}
