import { COURSE, allNodes } from '../course'
import { buildYear } from '../gen'
import type { Lesson } from '../lessonTypes'

/** Every node on the path has a lesson, built from its skills (see gen.ts). The year is built in one go,
    in path order, so no question is asked twice. */
export const LESSONS: Record<string, Lesson> = buildYear(allNodes(COURSE))
