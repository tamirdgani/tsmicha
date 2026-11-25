/* Checks the whole year: every question valid, none repeated, styles rotating. Run: npm run check:lessons */
import { COURSE, allNodes } from '../src/curriculum/course'
import { LESSONS } from '../src/curriculum/lessons'
import { STYLES } from '../src/curriculum/bank'
import { GEN_LOG } from '../src/curriculum/gen'
import { isQuestion } from '../src/curriculum/lessonTypes'
import { signature } from '../src/curriculum/bank/util'

const nodes = allNodes(COURSE)
const problems: string[] = []
const texts = new Map<string, string>()
let questions = 0
const kinds: Record<string, number> = {}
const sig = signature
for (const n of nodes) {
  const l = LESSONS[n.id]
  l.parts.forEach((p, pi) => p.steps.forEach((s, si) => {
    const at = `${n.id} p${pi + 1}#${si + 1}`
    kinds[s.kind] = (kinds[s.kind] ?? 0) + 1
    if (!isQuestion(s)) return
    questions++
    const k = sig(s)
    if (texts.has(k)) problems.push(`repeat: ${at} = ${texts.get(k)} :: ${'q' in s ? s.q.he : ''}`)
    texts.set(k, at)
    if (s.kind === 'pick') {
      if (s.correct < 0 || s.correct >= s.options.length) problems.push(`bad correct ${at}`)
      const o = s.options.map((x) => JSON.stringify(x))
      if (new Set(o).size !== o.length && !s.options.every((x, i, a) => i === s.correct || JSON.stringify(x) === JSON.stringify(a[(s.correct + 1) % a.length]))) problems.push(`dup options ${at}: ${s.q.he} ${o.join(' ')}`)
      if (o.length < 2) problems.push(`one option ${at}: ${s.q.he}`)
    }
    if (s.kind === 'tapall') {
      if (!s.right.length || s.right.length === s.options.length) problems.push(`tapall all/none ${at}`)
      const rs = new Set(s.right.map((i) => JSON.stringify(s.options[i])))
      s.options.forEach((o, i) => { if (!s.right.includes(i) && rs.has(JSON.stringify(o))) problems.push(`tapall wrong looks right ${at}: ${s.q.he}`) })
    }
    if (s.kind === 'order') { const o = s.items.map((x) => JSON.stringify(x)); if (new Set(o).size !== o.length) problems.push(`order dup ${at}`) }
    if (s.kind === 'match') { const a = s.pairs.map((x) => JSON.stringify(x[0])), b = s.pairs.map((x) => JSON.stringify(x[1])); if (new Set(a).size !== a.length || new Set(b).size !== b.length) problems.push(`match dup ${at}: ${s.q.he}`) }
    if (s.kind === 'sort') { const o = s.items.map((x) => x.text.he); if (new Set(o).size !== o.length) problems.push(`sort dup ${at}`) }
    const txt = JSON.stringify(s)
    if (/undefined|NaN|null/.test(txt)) problems.push(`undefined in ${at}: ${txt.slice(0, 160)}`)
  }))
}
console.log(`styles: ${STYLES.length} · questions: ${questions} · steps:`, kinds)
console.log(`problems: ${problems.length}`)
for (const p of problems.slice(0, 60)) console.log(' ', p)

// how styles were spread
const uses = new Map<string, number>()
for (const g of GEN_LOG) uses.set(g.style, (uses.get(g.style) ?? 0) + 1)
const passes = GEN_LOG.reduce<Record<number, number>>((a, g) => ({ ...a, [g.pass]: (a[g.pass] ?? 0) + 1 }), {})
const unused = STYLES.filter((s) => !uses.has(s.id)).map((s) => s.id)
const perLesson = new Map<string, Map<string, number>>()
for (const g of GEN_LOG) { const m = perLesson.get(g.node) ?? new Map(); m.set(g.style, (m.get(g.style) ?? 0) + 1); perLesson.set(g.node, m) }
let twice = 0
for (const m of perLesson.values()) for (const v of m.values()) if (v > 1) twice += v - 1
// distance (in lessons) between two uses of the same style
const order = nodes.map((n) => n.id)
const lastAt = new Map<string, number>(), gaps: number[] = []
for (const g of GEN_LOG) { const i = order.indexOf(g.node); const p = lastAt.get(g.style); if (p !== undefined && p !== i) gaps.push(i - p); lastAt.set(g.style, i) }
gaps.sort((a, b) => a - b)
console.log(`styles used: ${uses.size}/${STYLES.length}${unused.length ? ` · never used: ${unused.join(', ')}` : ''}`)
console.log('picked in pass (0 right skill & level · 1 any level · 2 lesson skills · 3 related skill · 4 riddle · 5 style again · 9 forced repeat):', passes)
console.log(`same style twice in one lesson: ${twice} times · median gap between uses: ${gaps[Math.floor(gaps.length / 2)]} lessons, shortest: ${gaps[0]}`)
const t0 = performance.now(); console.log('most used:', [...uses.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k}:${v}`).join(' '))
