import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../i18n/I18n'
import { Icon } from './Icon'

export function Logo({ size = 32, textClass }: { size?: number; textClass?: string }) {
  const { t } = useI18n()
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="18" fill="var(--brand)" />
        <path d="M32 23V14" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="12" r="5" fill="#C9F27B" />
        <rect x="14" y="23" width="36" height="28" rx="12" fill="#fff" />
        <circle cx="25" cy="36" r="3.6" fill="#10361C" />
        <circle cx="39" cy="36" r="3.6" fill="#10361C" />
        <path d="M27 43 Q32 47 37 43" stroke="#10361C" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
      <span className={`font-extrabold tracking-tight ${textClass ?? ''}`} style={{ fontSize: size * 0.72 }}>{t('brand')}</span>
    </span>
  )
}

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" fill="none" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/** Ring progress — daily goal, level. */
export function Ring({ value, size = 64, stroke = 8, color = 'var(--brand)', children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const [v, setV] = useState(0)
  useEffect(() => { const id = requestAnimationFrame(() => setV(Math.max(0, Math.min(1, value)))); return () => cancelAnimationFrame(id) }, [value])
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--bg-deep)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v)} style={{ transition: 'stroke-dashoffset 1s var(--ease-out)' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

/** Animated count-up for numbers that just changed or first appeared. */
export function CountUp({ to, duration = 900 }: { to: number; duration?: number }) {
  const { num } = useI18n()
  const [n, setN] = useState(0)
  const from = useRef(0)
  useEffect(() => {
    const start = performance.now(), a = from.current
    let raf = 0
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / duration)
      const e = 1 - Math.pow(1 - k, 3)
      setN(Math.round(a + (to - a) * e))
      if (k < 1) raf = requestAnimationFrame(tick); else from.current = to
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <span className="t-num">{num(n)}</span>
}

export function LangThemeToggles() {
  const { t, lang, setLang, theme, setTheme } = useI18n()
  return (
    <div className="flex items-center gap-1">
      <button className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))} onClick={() => setLang(lang === 'he' ? 'en' : 'he')}>
        <Icon name="globe" size={18} />{t('menu.lang')}
      </button>
      <button className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))} aria-label={theme === 'dark' ? t('menu.theme.light') : t('menu.theme.dark')} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
    </div>
  )
}

export function Toast({ text, onDone }: { text: string; onDone: () => void }) {
  useEffect(() => { const id = setTimeout(onDone, 2800); return () => clearTimeout(id) }, [onDone])
  return (
    <div role="status" className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="card px-5 py-3 t-small font-medium" style={{ boxShadow: 'var(--shadow-pop)', animation: 'bob .5s var(--ease-spring) 1' }}>{text}</div>
    </div>
  )
}

/** True on short viewports (small phones, landscape laptops) — screens shrink their art so nothing scrolls. */
export function useShortScreen(max = 760) {
  const q = `(max-height: ${max}px)`
  const [short, setShort] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setShort(m.matches)
    on(); m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return short
}

/** Current time, ticking every `ms` while `on`. For countdowns. */
export function useNow(on = true, ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!on) return
    const id = window.setInterval(() => setNow(Date.now()), ms)
    return () => window.clearInterval(id)
  }, [on, ms])
  return now
}

/** 5:42:07 — hours not padded, minutes and seconds padded. */
export function clock(msLeft: number) {
  const s = Math.max(0, Math.ceil(msLeft / 1000))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
