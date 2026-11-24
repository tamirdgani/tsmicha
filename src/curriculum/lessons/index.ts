import { COURSE, allNodes } from '../course'
import { buildLesson } from '../gen'
import type { Lesson } from '../lessonTypes'

/** Every node on the path has a lesson, built from its skills (see gen.ts). */
export const LESSONS: Record<string, Lesson> = Object.fromEntries(allNodes(COURSE).map((n) => [n.id, buildLesson(n)]))
