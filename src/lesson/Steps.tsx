import { RichText } from '../worlds/Art'
import { EmoLine } from '../worlds/Art'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { BasketStep, WeekStep, CalcStep, ExplainStep, McqStep, PredictStep, ScenarioStep, SortStep } from '../curriculum/lessonTypes'
import { Icon } from '../ds/Icon'
import { useI18n } from '../i18n/I18n'
import { LessonVisual } from './Visuals'
import { Sprout } from '../ds/Sprout'
import { Slider } from '@/components/ui/slider'
import { HABITS } from '../lib/future'
import { sfx } from '../lib/sfx'

/** Roomier track and thumb than the shadcn default, for thumbs on phones. */
const SLIDER = 'mt-4 py-2 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-thumb]]:size-6 [&_[data-slot=slider-thumb]]:border-2'

export type Status = 'answering' | 'correct' | 'wrong'
/** Every step reports whether it can be submitted, and whether the current answer is right. */
export type Report = (ready: boolean, correct: boolean) => void

const rise = (d = 0) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } })

/* ─────────────────────────── Explain ─────────────────────────── */

export function Explain({ step, report }: { step: ExplainStep; report: Report }) {
  const { pick } = useI18n()
  useEffect(() => report(true, true), [report])
  const list = step.body.length > 2 && !step.visual
  return (
    <div>
      {step.visual && <motion.div {...rise()}><LessonVisual v={step.visual} /></motion.div>}
      {step.scene && (
        <motion.div {...rise()} className="card flex items-center justify-center gap-4 sm:gap-6 px-4 py-5 sm:py-7" style={{ boxShadow: 'none', background: 'var(--brand-soft)', borderColor: 'transparent' }}>
          <Sprout size={110} stage={1} mood="cheer" />
          <EmoLine text={step.scene} size={step.scene.includes('@') ? 76 : 52} />
        </motion.div>
      )}
      <motion.h2 {...rise(0.05)} className="t-h1 mt-4 sm:mt-6 mb-0"><RichText text={pick(step.title)} /></motion.h2>
      {step.math && (
        <motion.div {...rise(0.1)} dir="ltr" className="card mt-4 grid gap-2 justify-items-center px-4 py-4" style={{ boxShadow: 'none', background: 'var(--surface-2)' }}>
          {step.math.map((m, i) => (
            <motion.span key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.45 }}
              className="font-extrabold t-num" style={{ fontSize: i === step.math!.length - 1 ? 40 : 32, lineHeight: 1.15, color: i === step.math!.length - 1 ? 'var(--brand-ink)' : 'var(--ink)' }}><RichText text={m} /></motion.span>
          ))}
        </motion.div>
      )}
      {list ? (
        <ul className="list-none p-0 m-0 mt-5 grid gap-3">
          {step.body.map((b, i) => (
            <motion.li key={i} {...rise(0.12 + i * 0.08)} className="card flex items-start gap-3 p-4" style={{ boxShadow: 'none' }}>
              <span className="grid place-items-center w-7 h-7 rounded-full shrink-0 t-small font-bold" style={{ background: 'var(--brand)', color: 'var(--on-brand)' }}>{i + 1}</span>
              <span className="t-body" style={{ fontSize: 17 }}><RichText text={pick(b)} /></span>
            </motion.li>
          ))}
        </ul>
      ) : (
        step.body.map((b, i) => (
          <motion.p key={i} {...rise(0.12 + i * 0.08)} className="mt-3 sm:mt-4 mb-0 ink-2 text-[17px] sm:text-[18px]" style={{ lineHeight: 1.6 }}><RichText text={pick(b)} /></motion.p>
        ))
      )}
    </div>
  )
}

/* ─────────────────────────── Multiple choice ─────────────────────────── */

export function Mcq({ step, status, report }: { step: McqStep | PredictStep; status: Status; report: Report }) {
  const { pick, num } = useI18n()
  const [sel, setSel] = useState<number | null>(null)
  const locked = status !== 'answering'
  const choose = (i: number) => { if (locked) return; sfx.pick(); setSel(i); report(true, i === step.correct) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { const n = Number(e.key); if (n >= 1 && n <= step.options.length) choose(n - 1) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div>
      {/* Long questions (challenges, word problems) step down a size so the options stay in view. */}
      <motion.h2 {...rise()} className={`${pick(step.q).length > 80 ? 't-h2' : 't-h1'} m-0`}><RichText text={pick(step.q)} /></motion.h2>
      <div role="radiogroup" className="grid gap-3 mt-6 [@media(max-height:760px)]:gap-2 [@media(max-height:760px)]:mt-4">
        <AnimatePresence initial={false}>
        {step.options.map((o, i) => {
          const isSel = sel === i
          // After checking, only your pick and the right answer stay: the explanation gets the room.
          if (locked && !isSel && i !== step.correct) return null
          const showRight = locked && i === step.correct
          const showWrong = locked && isSel && i !== step.correct
          // A wrong guess isn't a mistake: it stays blue, no shake.
          const guess = step.kind === 'predict'
          const border = showRight ? 'var(--brand)' : showWrong ? (guess ? 'var(--sky-strong)' : 'var(--flame-strong)') : isSel ? 'var(--sky-strong)' : 'var(--line)'
          const bg = showRight ? 'var(--brand-soft)' : showWrong ? (guess ? 'var(--sky-soft)' : 'var(--flame-soft)') : isSel ? 'var(--sky-soft)' : 'var(--surface)'
          return (
            <motion.button key={i} {...rise(0.06 + i * 0.05)} exit={{ opacity: 0, height: 0, minHeight: 0, paddingTop: 0, paddingBottom: 0, marginTop: -8, transition: { duration: 0.25 } }} role="radio" aria-checked={isSel} onClick={() => choose(i)}
              whileTap={locked ? undefined : { scale: 0.98 }}
              animate={showWrong && !guess ? { x: [0, -6, 6, -4, 4, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 min-h-16 [@media(max-height:760px)]:p-3 [@media(max-height:760px)]:min-h-13 rounded-xl text-start overflow-hidden"
              style={{ font: 'inherit', color: 'var(--ink)', background: bg, border: `1.5px solid ${border}`, boxShadow: isSel || showRight || showWrong ? `0 0 0 3px color-mix(in oklab, ${border} 22%, transparent)` : 'var(--shadow-card)', cursor: locked ? 'default' : 'pointer', transition: 'background .15s, border-color .15s, box-shadow .15s' }}>
              <span className="grid place-items-center w-8 h-8 rounded-[9px] shrink-0 t-small font-bold t-num"
                style={{ border: `1.5px solid ${isSel || showRight ? border : 'var(--line-strong)'}`, color: isSel || showRight ? border : 'var(--ink-3)' }}>
                {showRight ? <Icon name="check" size={16} /> : showWrong ? <Icon name="x" size={16} /> : num(i + 1)}
              </span>
              <span className="flex-1 font-medium" style={{ fontSize: 17 }}><RichText text={pick(o)} /></span>
            </motion.button>
          )
        })}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─────────────────────────── Sort into buckets ─────────────────────────── */

export function Sort({ step, status, report }: { step: SortStep; status: Status; report: Report }) {
  const { t, pick } = useI18n()
  // Shuffle once so the order isn't a hint.
  const order = useMemo(() => step.items.map((_, i) => i).sort(() => Math.random() - 0.5), [step])
  const [placed, setPlaced] = useState<Record<number, number>>({})
  const [picked, setPicked] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)
  const locked = status !== 'answering'

  useEffect(() => {
    const all = Object.keys(placed).length === step.items.length
    report(all, all && step.items.every((it, i) => placed[i] === it.bucket))
  }, [placed, step, report])

  const allPlaced = Object.keys(placed).length === step.items.length
  const place = (item: number, bucket: number) => { if (locked) return; sfx.place(Object.keys(placed).length); setPlaced((p) => ({ ...p, [item]: bucket })); setPicked(null) }
  const unplace = (item: number) => { if (locked) return; setPlaced((p) => { const n = { ...p }; delete n[item]; return n }) }

  const chip = (i: number, inBucket: boolean) => {
    const wrong = locked && inBucket && placed[i] !== step.items[i].bucket
    const right = locked && inBucket && placed[i] === step.items[i].bucket
    return (
      <motion.button key={i} layout layoutId={`chip-${i}`} draggable={!locked}
        onDragStart={(e) => { (e as unknown as DragEvent).dataTransfer?.setData('text/plain', String(i)); setPicked(i) }}
        onClick={() => (inBucket ? unplace(i) : setPicked(picked === i ? null : i))}
        className={`inline-flex items-center gap-2 rounded-lg text-start font-medium ${inBucket ? 'px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 text-[14px] sm:text-[15px]' : 'px-3 py-2 sm:px-3.5 sm:py-2.5 text-[15px]'}`}
        style={{
          fontFamily: 'inherit', cursor: locked ? 'default' : 'grab', color: 'var(--ink)',
          background: wrong ? 'var(--flame-soft)' : right ? 'var(--brand-soft)' : 'var(--surface)',
          border: `2px solid ${wrong ? 'var(--flame-strong)' : right ? 'var(--brand)' : picked === i ? 'var(--sky-strong)' : 'var(--line-strong)'}`,
          boxShadow: picked === i ? '0 0 0 3px color-mix(in oklab, var(--sky-strong) 25%, transparent)' : 'var(--shadow-card)',
          transform: picked === i ? 'translateY(-2px)' : undefined,
        }}>
        {right && <Icon name="check" size={14} style={{ color: 'var(--brand)' }} />}
        {wrong && <Icon name="x" size={14} style={{ color: 'var(--flame-strong)' }} />}
        <span>
          <RichText text={pick(step.items[i].text)} />
          {wrong && <span className="sr-only">{t('lesson.sort.belongs', { b: pick(step.buckets[step.items[i].bucket]) })}</span>}
        </span>
      </motion.button>
    )
  }

  return (
    <div>
      <motion.h2 {...rise()} className="t-h1 m-0"><RichText text={pick(step.prompt)} /></motion.h2>
      {!locked && <p className="t-small ink-3 mt-2 mb-0">{t('lesson.sort.hint')}</p>}

      {/* The pool keeps a ghost slot for every placed item, so nothing jumps around. */}
      <div className="mt-3 sm:mt-5 flex flex-wrap gap-2">
        {!allPlaced && order.map((i) => placed[i] === undefined ? chip(i, false) : (
          <span key={`ghost-${i}`} aria-hidden="true" className="inline-flex items-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-medium"
            style={{ fontSize: 15, border: '2px dashed var(--line)', color: 'transparent' }}><RichText text={pick(step.items[i].text)} /></span>
        ))}
      </div>

      {/* Phones: one row per group, so chips get the full width. Wider screens: side-by-side columns. */}
      <div className={`grid gap-2 sm:gap-3 mt-3 sm:mt-5 ${step.buckets.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {step.buckets.map((b, bi) => {
          // After checking, wrong chips glide into the group they belong to (still marked in orange).
          const here = order.filter((i) => placed[i] !== undefined && (locked ? step.items[i].bucket : placed[i]) === bi)
          const target = picked !== null && !locked
          return (
            <div key={bi} role="button" tabIndex={target ? 0 : -1} aria-label={pick(b)}
              onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && picked !== null) { e.preventDefault(); e.stopPropagation(); place(picked, bi) } }}
              onClick={() => picked !== null && place(picked, bi)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(bi) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => { e.preventDefault(); setDragOver(null); const i = Number(e.dataTransfer.getData('text/plain')); if (!Number.isNaN(i)) place(i, bi) }}
              className="rounded-xl p-2 sm:p-3 min-h-14 sm:min-h-28 flex flex-row sm:flex-col items-center sm:items-stretch gap-2 transition-colors"
              style={{
                background: dragOver === bi ? 'var(--sky-soft)' : 'var(--surface-2)',
                border: `2px dashed ${target || dragOver === bi ? 'var(--sky-strong)' : 'var(--line-strong)'}`,
                cursor: target ? 'pointer' : 'default',
              }}>
              <div className="t-small font-semibold ink-2 w-24 shrink-0 text-start sm:w-auto sm:text-center sm:pb-1 ps-1 sm:ps-0"><RichText text={pick(b)} /></div>
              <div className="flex-1 flex flex-row flex-wrap sm:flex-col sm:items-stretch gap-2">{here.map((i) => chip(i, true))}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────── Calculator ─────────────────────────── */

export function Calc({ step, report }: { step: CalcStep; report: Report }) {
  return step.calc === 'earn-hours' ? <EarnHours step={step} report={report} /> : <SaveWeeks step={step} report={report} />
}

/** Hourly rate × hours a week → week, month and summer totals. */
function EarnHours({ step, report }: { step: CalcStep; report: Report }) {
  const { t, pick, num } = useI18n()
  const [rate, setRate] = useState(30)
  const [hours, setHours] = useState(6)
  const [touched, setTouched] = useState(false)
  useEffect(() => report(touched, true), [touched, report])
  const week = rate * hours
  const month = Math.round((week * 4.33) / 10) * 10
  const summer = week * 8
  const slider = (label: string, value: number, unit: string, min: number, max: number, stepBy: number, set: (n: number) => void) => (
    <div className="mt-3 first:mt-0">
      <div className="flex items-baseline justify-between">
        <span className="t-small ink-2 font-medium">{label}</span>
        <span className="t-h2 t-num" style={{ color: 'var(--brand-ink)' }}>{num(value)}{unit}</span>
      </div>
      <Slider min={min} max={max} step={stepBy} value={[value]} aria-label={label}
        onValueChange={([n]) => { set(n); setTouched(true) }} className={SLIDER} />
    </div>
  )
  const tiles: [string, number][] = [[t('lesson.calc.perWeek'), week], [t('lesson.calc.perMonth'), month], [t('lesson.calc.perSummer'), summer]]
  return (
    <div>
      <motion.h2 {...rise()} className="t-h1 m-0"><RichText text={pick(step.title)} /></motion.h2>
      <motion.p {...rise(0.05)} className="mt-3 mb-0 ink-2 text-[18px] [@media(max-height:760px)]:text-[16px] [@media(max-height:760px)]:mt-2"><RichText text={pick(step.body)} /></motion.p>
      <motion.div {...rise(0.1)} className="card p-5 sm:p-6 mt-6 [@media(max-height:760px)]:p-4 [@media(max-height:760px)]:mt-3">
        {slider(t('lesson.calc.rate'), rate, ' ₪', 25, 80, 5, setRate)}
        {slider(t('lesson.calc.hours'), hours, '', 2, 20, 1, setHours)}
        {!touched && <p className="t-small font-semibold mt-3 mb-0 text-center" style={{ color: 'var(--color-sky-ink)', animation: 'bob 1.6s ease-in-out infinite' }}>{t('lesson.calc.hint')}</p>}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 [@media(max-height:760px)]:mt-3">
          {tiles.map(([label, v], i) => (
            <div key={label} className="rounded-xl p-3 [@media(max-height:760px)]:p-2 text-center" style={{ background: i === 1 ? 'var(--brand)' : 'var(--brand-soft)', color: i === 1 ? 'var(--on-brand)' : 'var(--brand-ink)' }}>
              <div className="t-caption font-semibold" style={{ opacity: 0.85 }}>{label}</div>
              <motion.div key={v} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="font-extrabold t-num mt-0.5 whitespace-nowrap text-[17px] sm:text-[22px]">{num(v)} ₪</motion.div>
            </div>
          ))}
        </div>
      </motion.div>
      <AnimatePresence>
        {touched && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 mb-0 p-4 [@media(max-height:760px)]:mt-3 [@media(max-height:760px)]:p-3 [@media(max-height:760px)]:text-[15px] rounded-xl flex gap-3 items-start" style={{ background: 'var(--sun-soft)' }}>
            <Icon name="sparkle" size={20} style={{ color: 'var(--sun-strong)', flexShrink: 0, marginTop: 2 }} />
            <span className="font-medium"><RichText text={pick(step.takeaway)} /></span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/** How many weeks of saving until a 600 ₪ purchase. */
function SaveWeeks({ step, report }: { step: CalcStep; report: Report }) {
  const { t, pick, num } = useI18n()
  const price = 600
  const [weekly, setWeekly] = useState(50)
  const [touched, setTouched] = useState(false)
  useEffect(() => report(touched, true), [touched, report])
  const weeks = Math.ceil(price / weekly)
  const months = Math.round((weeks / 4.33) * 10) / 10

  return (
    <div>
      <motion.h2 {...rise()} className="t-h1 m-0"><RichText text={pick(step.title)} /></motion.h2>
      <motion.p {...rise(0.05)} className="mt-3 mb-0 ink-2 text-[18px] [@media(max-height:760px)]:text-[16px] [@media(max-height:760px)]:mt-2"><RichText text={pick(step.body)} /></motion.p>

      <motion.div {...rise(0.1)} className="card p-5 sm:p-6 mt-6 [@media(max-height:760px)]:p-4 [@media(max-height:760px)]:mt-3">
        <div className="flex items-baseline justify-between">
          <span className="t-small ink-2 font-medium">{t('lesson.calc.weekly')}</span>
          <span className="t-h1 t-num" style={{ color: 'var(--brand-ink)' }}>{num(weekly)} ₪</span>
        </div>
        <Slider min={10} max={200} step={10} value={[weekly]} aria-label={t('lesson.calc.weekly')}
          onValueChange={([n]) => { setWeekly(n); setTouched(true) }} className={SLIDER} />
        <div className="flex justify-between t-caption ink-3 font-normal mt-1"><span>10 ₪</span><span>200 ₪</span></div>
        {!touched && <p className="t-small font-semibold mt-3 mb-0 text-center" style={{ color: 'var(--color-sky-ink)', animation: 'bob 1.6s ease-in-out infinite' }}>{t('lesson.calc.hint')}</p>}

        <div className="grid grid-cols-[auto_1fr] items-center gap-4 mt-6 p-4 [@media(max-height:760px)]:mt-3 [@media(max-height:760px)]:p-3 rounded-xl" style={{ background: 'var(--brand-soft)' }}>
          <motion.span key={weeks} initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            className="grid place-items-center w-20 h-20 [@media(max-height:760px)]:w-14 [@media(max-height:760px)]:h-14 rounded-full t-h1 t-num" style={{ background: 'var(--brand)', color: 'var(--on-brand)' }}>
            {num(weeks)}
          </motion.span>
          <div>
            <div className="t-h3">{t('lesson.calc.weeks', { w: num(weeks) })}</div>
            <div className="t-small ink-2">{months < 1 ? t('lesson.calc.lessMonth') : t('lesson.calc.months', { m: num(months) })}</div>
          </div>
        </div>
        <WeeksBar weeks={weeks} />
      </motion.div>

      <AnimatePresence>
        {touched && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 mb-0 p-4 [@media(max-height:760px)]:mt-3 [@media(max-height:760px)]:p-3 [@media(max-height:760px)]:text-[15px] rounded-xl flex gap-3 items-start" style={{ background: 'var(--sun-soft)' }}>
            <Icon name="sparkle" size={20} style={{ color: 'var(--sun-strong)', flexShrink: 0, marginTop: 2 }} />
            <span className="font-medium"><RichText text={pick(step.takeaway)} /></span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/** One dot per week — makes the wait tangible. */
function WeeksBar({ weeks }: { weeks: number }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-4 [@media(max-height:760px)]:gap-1 [@media(max-height:760px)]:mt-3" aria-hidden="true">
      {Array.from({ length: Math.min(weeks, 60) }, (_, i) => (
        <motion.span key={i} className="w-3 h-3 [@media(max-height:760px)]:w-2.5 [@media(max-height:760px)]:h-2.5 rounded-full" style={{ background: 'var(--color-leaf-300)' }}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.012 }} />
      ))}
    </div>
  )
}

/* ─────────────────────────── Scenario ─────────────────────────── */

export function Scenario({ step, report, onChoose }: { step: ScenarioStep; report: Report; onChoose?: (i: number) => void }) {
  const { t, pick, dir } = useI18n()
  const [chosen, setChosen] = useState<number | null>(null)
  useEffect(() => report(chosen !== null, true), [chosen, report])
  const choose = (i: number) => { if (chosen !== null) return; setChosen(i); onChoose?.(i) }
  const fx = chosen !== null ? step.choices[chosen].future : undefined
  return (
    <div>
      <motion.div {...rise()} className="flex items-center gap-2 t-caption" style={{ color: 'var(--color-berry-ink)' }}>
        <span className="badge badge-berry"><Icon name="map" size={14} />{t('lesson.scenario')}</span>
        <AnimatePresence>
          {fx && (
            <motion.span key="fx" className="badge badge-sky min-w-0" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 16 }}>
              <motion.span className="inline-grid" initial={{ rotate: -25 }} animate={{ rotate: [-25, 12, 0] }} transition={{ delay: 0.6, duration: 0.5 }}><Icon name="mail" size={14} /></motion.span>
              <span className="truncate">{t('future.written', { h: pick(HABITS[fx.habit].name) })}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.p {...rise(0.05)} className="t-h2 mt-3 mb-0" style={{ lineHeight: 1.45 }}><RichText text={pick(step.story)} /></motion.p>
      <div className="grid gap-3 mt-6 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:gap-2">
        <AnimatePresence initial={false}>
        {step.choices.map((c, i) => {
          const isSel = chosen === i
          // Once a choice is made, the other paths fold away so the outcome has room.
          const gone = chosen !== null && !isSel && !(c.best && !step.choices[chosen].best)
          if (gone) return null
          return (
            <motion.div key={i} {...rise(0.1 + i * 0.06)} exit={{ opacity: 0, height: 0, transition: { duration: 0.25 } }} className="overflow-hidden">
              <button onClick={() => choose(i)} disabled={chosen !== null && !isSel}
                className="w-full flex items-center gap-3 p-4 [@media(max-height:760px)]:p-3 rounded-xl text-start"
                style={{ font: 'inherit', color: 'var(--ink)', background: isSel ? 'var(--berry-soft)' : 'var(--surface)', border: `1.5px solid ${isSel ? 'var(--berry-strong)' : 'var(--line)'}`, boxShadow: isSel ? '0 0 0 3px color-mix(in oklab, var(--berry-strong) 22%, transparent)' : 'var(--shadow-card)', cursor: chosen === null ? 'pointer' : 'default' }}>
                <span className="flex-1 font-medium" style={{ fontSize: 17 }}><RichText text={pick(c.text)} /></span>
                <Icon name="chevron" size={18} className="ink-3" style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : undefined }} />
              </button>
              <AnimatePresence>
                {chosen !== null && !step.choices[chosen].best && c.best && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ delay: 0.5 }} className="overflow-hidden">
                    <div className="mt-2 p-4 rounded-xl flex gap-3 items-start" style={{ background: 'var(--brand-soft)' }}>
                      <Icon name="star" size={20} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div className="t-small font-bold" style={{ color: 'var(--brand-ink)' }}>{t('lesson.scenario.better')}</div>
                        <div className="mt-0.5"><RichText text={pick(c.outcome)} /></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {isSel && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                    <div className="mt-2 p-4 rounded-xl flex gap-3 items-start" style={{ background: c.best ? 'var(--brand-soft)' : 'var(--sun-soft)' }}>
                      <Icon name={c.best ? 'star' : 'flag'} size={20} style={{ color: c.best ? 'var(--brand)' : 'var(--sun-strong)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div className="t-small font-bold" style={{ color: c.best ? 'var(--brand-ink)' : 'var(--sun-text)' }}>{c.best ? t('lesson.scenario.best') : t('lesson.scenario.result')}</div>
                        <div className="mt-0.5"><RichText text={pick(c.outcome)} /></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─────────────────────────── Budget basket ─────────────────────────── */

const TAG = {
  need: { bg: 'var(--brand-soft)', ink: 'var(--brand-ink)', k: 'lesson.basket.need' },
  want: { bg: 'var(--sky-soft)', ink: 'var(--color-sky-ink)', k: 'lesson.basket.want' },
  save: { bg: 'var(--sun-soft)', ink: 'var(--sun-text)', k: 'lesson.basket.save' },
} as const

/** Pick what fits in a monthly budget. Each pick reveals whether it's a need, a want or saving,
 *  and the note underneath reacts to the mix. There's no wrong basket, only a better-informed one. */
export function Basket({ step, report }: { step: BasketStep; report: Report }) {
  const { t, pick, num } = useI18n()
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [bounce, setBounce] = useState<number | null>(null)
  const spent = [...picked].reduce((sum, i) => sum + step.items[i].price, 0)
  const left = step.budget - spent
  useEffect(() => report(picked.size > 0 && left >= 0, true), [picked, left, report])
  useEffect(() => {
    if (bounce === null) return
    const id = window.setTimeout(() => setBounce(null), 1600)
    return () => window.clearTimeout(id)
  }, [bounce])

  const toggle = (i: number) => {
    const next = new Set(picked)
    if (next.has(i)) next.delete(i)
    else if (step.items[i].price > left) { setBounce(i); return }
    else next.add(i)
    setPicked(next)
  }

  const missing = step.items.map((it, i) => ({ it, i })).filter(({ it, i }) => it.kind === 'need' && !picked.has(i))
  const saved = [...picked].some((i) => step.items[i].kind === 'save')
  const note = bounce !== null ? { text: t('lesson.basket.over'), tone: 'var(--flame-soft)', ink: 'var(--flame-text)' }
    : picked.size === 0 ? { text: t('lesson.basket.start'), tone: 'var(--muted)', ink: 'var(--ink-2)' }
    : missing.length ? { text: t('lesson.basket.missing', { x: missing.map(({ it }) => pick(it.text)).join(', ') }), tone: 'var(--sun-soft)', ink: 'var(--sun-text)' }
    : { text: t(saved ? 'lesson.basket.goodSaved' : 'lesson.basket.good', { x: num(left) }), tone: 'var(--brand-soft)', ink: 'var(--brand-ink)' }

  return (
    <div>
      <motion.h2 {...rise()} className="t-h1 m-0"><RichText text={pick(step.title)} /></motion.h2>
      <motion.p {...rise(0.05)} className="mt-2 mb-0 ink-2 text-[17px] [@media(max-height:760px)]:text-[15px]"><RichText text={pick(step.body)} /></motion.p>

      {/* what's left of the budget */}
      <motion.div {...rise(0.1)} className="mt-4 [@media(max-height:760px)]:mt-3">
        <div className="flex items-baseline justify-between">
          <span className="t-small ink-2 font-medium">{t('lesson.basket.budget')}: <bdi className="t-num">{num(step.budget)} ₪</bdi></span>
          <motion.span key={left} initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="t-h3 t-num" style={{ color: left < 40 ? 'var(--flame-text)' : 'var(--brand-ink)' }}>
            {t('lesson.basket.left', { x: num(left) })}
          </motion.span>
        </div>
        <div className="bar mt-2" role="progressbar" aria-valuenow={spent} aria-valuemax={step.budget}>
          <i style={{ width: `${Math.min(100, (spent / step.budget) * 100)}%`, background: left < 40 ? 'var(--flame-strong)' : 'var(--brand)', transition: 'width .35s var(--ease-out), background .2s' }} />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-2 mt-4 [@media(max-height:760px)]:mt-3">
        {step.items.map((it, i) => {
          const on = picked.has(i)
          const tag = TAG[it.kind]
          return (
            <motion.button key={i} {...rise(0.12 + i * 0.03)} type="button" aria-pressed={on} onClick={() => toggle(i)}
              animate={bounce === i ? { x: [0, -6, 6, -4, 4, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }} whileTap={{ scale: 0.97 }}
              className="relative flex flex-col items-start gap-1 p-3 [@media(max-height:760px)]:p-2.5 rounded-xl text-start cursor-pointer"
              style={{ fontFamily: 'inherit', color: 'var(--ink)', background: on ? tag.bg : 'var(--surface)', border: `1.5px solid ${on ? tag.ink : 'var(--line)'}`,
                boxShadow: on ? `0 0 0 3px color-mix(in oklab, ${tag.ink} 18%, transparent)` : 'var(--shadow-card)', transition: 'background .15s, border-color .15s, box-shadow .15s' }}>
              <span className="flex w-full items-center justify-between gap-2">
                <span className="font-semibold text-[15px] leading-tight"><RichText text={pick(it.text)} /></span>
                <span className="grid place-items-center size-5 rounded-md shrink-0" style={{ background: on ? tag.ink : 'transparent', border: on ? 'none' : '1.5px solid var(--ink-3)', color: 'var(--card)' }}>
                  {on && <Icon name="check" size={13} />}
                </span>
              </span>
              <span className="flex w-full items-center justify-between gap-2">
                <span className="t-small t-num ink-2"><bdi>{num(it.price)} ₪</bdi></span>
                <AnimatePresence>
                  {on && (
                    <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
                      className="badge" style={{ background: 'var(--surface)', color: tag.ink, height: 20 }}>{t(tag.k)}</motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.p key={note.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          className="mt-4 [@media(max-height:760px)]:mt-3 mb-0 px-4 py-3 [@media(max-height:760px)]:py-2 rounded-xl t-small font-medium" style={{ background: note.tone, color: note.ink }} role="status">
          {note.text}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────── 168-hour week ─────────────────────────── */

const WEEK_HOURS = 168

/** A − / + button that keeps stepping while held, so moving 63 hours of sleep isn't 63 taps. */
function HoldButton({ label, icon, disabled, onStep }: { label: string; icon: 'minus' | 'plus'; disabled: boolean; onStep: () => void }) {
  const timer = useRef(0)
  const stop = () => { window.clearTimeout(timer.current); window.clearInterval(timer.current) }
  useEffect(() => stop, [])
  const start = () => {
    if (disabled) return
    onStep()
    timer.current = window.setTimeout(() => { timer.current = window.setInterval(onStep, 70) }, 380)
  }
  return (
    <button type="button" aria-label={label} disabled={disabled}
      onPointerDown={(e) => { e.preventDefault(); start() }} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStep() } }}
      className="grid place-items-center size-8 rounded-lg border cursor-pointer select-none disabled:opacity-35 disabled:cursor-default hover:bg-accent"
      style={{ borderColor: 'var(--line)', background: 'var(--surface)', color: 'var(--ink)', touchAction: 'manipulation' }}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d={icon === 'plus' ? 'M7 2v10M2 7h10' : 'M2 7h10'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    </button>
  )
}

/** Split the week's 168 hours. The bar fills as you plan; the note reacts to sleep, free time and earnings. */
export function Week({ step, report }: { step: WeekStep; report: Report }) {
  const { t, pick, num } = useI18n()
  const [hours, setHours] = useState<number[]>(() => step.rows.map((r) => r.hours))
  const [touched, setTouched] = useState(false)
  const total = hours.reduce((a, b) => a + b, 0)
  const free = WEEK_HOURS - total
  useEffect(() => report(touched && free >= 0, true), [touched, free, report])

  const bump = (i: number, d: number) => {
    setTouched(true)
    setHours((h) => {
      const used = h.reduce((a, b) => a + b, 0)
      if (d > 0 && used >= WEEK_HOURS) return h
      const n = [...h]
      n[i] = Math.max(0, Math.min(WEEK_HOURS, n[i] + d))
      return n
    })
  }

  const at = (key: string) => hours[step.rows.findIndex((r) => r.key === key)] ?? 0
  const work = at('work')
  const perWeek = work * step.rate
  const note = free < 0 ? { text: t('lesson.week.overNote'), tone: 'var(--flame-soft)', ink: 'var(--flame-text)' }
    : !touched ? { text: t('lesson.week.hint'), tone: 'var(--muted)', ink: 'var(--ink-2)' }
    : at('sleep') < 56 ? { text: t('lesson.week.sleepLow'), tone: 'var(--sun-soft)', ink: 'var(--sun-text)' }
    : free < 7 ? { text: t('lesson.week.noFree'), tone: 'var(--sun-soft)', ink: 'var(--sun-text)' }
    : work > 0 ? { text: t('lesson.week.goodWork', { h: num(work), x: num(perWeek), m: num(Math.round((perWeek * 4.33) / 10) * 10) }), tone: 'var(--brand-soft)', ink: 'var(--brand-ink)' }
    : { text: t('lesson.week.good'), tone: 'var(--brand-soft)', ink: 'var(--brand-ink)' }

  return (
    <div>
      <motion.h2 {...rise()} className="t-h1 m-0"><RichText text={pick(step.title)} /></motion.h2>
      <motion.p {...rise(0.05)} className="mt-2 mb-0 ink-2 text-[17px] [@media(max-height:760px)]:text-[15px]"><RichText text={pick(step.body)} /></motion.p>

      {/* the week as one bar: each activity takes its share, the rest is free */}
      <motion.div {...rise(0.1)} className="mt-4 [@media(max-height:760px)]:mt-3">
        <div className="flex h-5 w-full overflow-hidden rounded-full" style={{ background: 'var(--muted)', outline: free < 0 ? '2px solid var(--flame-strong)' : 'none', outlineOffset: 2 }} role="img"
          aria-label={step.rows.map((r, i) => `${pick(r.label)} ${hours[i]}`).join(', ')}>
          {step.rows.map((r, i) => (
            <motion.span key={r.key} className="h-full" style={{ background: r.color }} initial={false}
              animate={{ width: `${(hours[i] / Math.max(WEEK_HOURS, total)) * 100}%` }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} />
          ))}
        </div>
        <div className="flex items-baseline justify-between mt-2 t-small">
          <motion.span key={free} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="font-semibold t-num" style={{ color: free < 0 ? 'var(--flame-text)' : 'var(--ink)' }}>
            {free < 0 ? t('lesson.week.over', { h: num(-free) }) : t('lesson.week.left', { h: num(free) })}
          </motion.span>
          <span className="font-semibold t-num" style={{ color: 'var(--brand-ink)' }}>{t('lesson.week.earn', { x: num(perWeek) })}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {step.rows.map((r, i) => (
          <motion.div key={r.key} {...rise(0.12 + i * 0.03)} className="rounded-xl border p-2.5 [@media(max-height:760px)]:p-2 flex flex-col gap-1.5"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="size-2.5 rounded-full shrink-0" style={{ background: r.color }} />
              <span className="t-small font-semibold truncate"><RichText text={pick(r.label)} /></span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <HoldButton label={t('lesson.week.less', { x: pick(r.label) })} icon="minus" disabled={hours[i] === 0} onStep={() => bump(i, -1)} />
              <span className="font-bold t-num text-[17px]">{t('lesson.week.h', { h: num(hours[i]) })}</span>
              <HoldButton label={t('lesson.week.more', { x: pick(r.label) })} icon="plus" disabled={free <= 0} onStep={() => bump(i, 1)} />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p key={note.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          className="mt-3 mb-0 px-4 py-3 [@media(max-height:760px)]:py-2 rounded-xl t-small font-medium" style={{ background: note.tone, color: note.ink }} role="status">
          {note.text}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
