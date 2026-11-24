# קפיצה · Kfitza

A learning path that gets a child ready for the next school year, built on the Shoresh app (same design system and lesson player).
Unit 1 — Kindergarten (גן חובה): 12 chapters, 132 short lessons, ready for first grade. Unit 2 — First grade comes next.
The parent reads the questions aloud; the child answers with big pictures. Piko the robot learns and upgrades along the way.

## Run

```bash
npm install
npm run dev        # http://localhost:5190 (and on the local network, for an iPad)
```

- `/` — login (demo mode without Supabase keys), onboarding for the parent, then the learning path
- `/#/lesson/u1-l1` — open a lesson directly
- `/design-system` — the shared design system and Piko

## How lessons work

- `src/curriculum/course.ts` — the year: chapters, lessons, and the skills each lesson practises
- `src/curriculum/gen.ts` — builds each lesson from its skills (3 parts; seeded by lesson id, so a lesson is stable)
- `src/curriculum/kdata.ts` — the word and picture bank (letters, rhymes, syllables, categories, stories…)
- `src/lesson/KidSteps.tsx` — kid exercises: pick a picture, put in order, match pairs, trace with a finger, build a word

A part needs 70% right on the first try; below that it rests for 6 hours (`src/lib/progress.ts`), same as Shoresh.

## Publish as a claude.ai artifact

```bash
npm run build:artifact   # writes dist/artifact.html + dist/assets/*
```
