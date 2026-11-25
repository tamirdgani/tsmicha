import { COURSE, allNodes } from '../course'
import { buildYear } from '../gen'
import type { Lesson } from '../lessonTypes'
import { currentWorld } from '../../worlds/current'
import type { WorldId } from '../../worlds/kits'

/** Every node on the path has a lesson, built from its skills (see gen.ts). The year is built in one go,
    in path order, so no question is asked twice. Each world (the child's chosen interest) gets its own year,
    told with that world's characters; it's built the first time it's needed. */
const NODES = allNodes(COURSE)
const cache = new Map<string, Record<string, Lesson>>()
export function lessonsFor(world?: WorldId): Record<string, Lesson> {
  const k = world ?? 'none'
  let year = cache.get(k)
  if (!year) { year = buildYear(NODES, world); cache.set(k, year) }
  return year
}

/** The lessons of the child's current world. */
export const LESSONS: Record<string, Lesson> = new Proxy({} as Record<string, Lesson>, {
  get: (_t, id: string) => lessonsFor(currentWorld())[id],
  has: (_t, id: string) => id in lessonsFor(currentWorld()),
  ownKeys: () => Reflect.ownKeys(lessonsFor(currentWorld())),
  getOwnPropertyDescriptor: (_t, id: string) => Reflect.getOwnPropertyDescriptor(lessonsFor(currentWorld()), id),
})
