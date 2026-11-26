import { LANG_STYLES } from './stylesLang'
import { MATH_STYLES } from './stylesMath'
import { SEE_STYLES } from './stylesSee'
import { WORLD_STYLES } from './stylesWorld'
import { ARITH_STYLES } from './stylesArith'
import { READ_SCHOOL_STYLES } from './stylesRead'
import { TOPIC_STYLES } from './stylesTopics'
import type { Style } from './util'

/** Every question style in the app. */
export const STYLES: Style[] = [...SEE_STYLES, ...MATH_STYLES, ...LANG_STYLES, ...WORLD_STYLES, ...ARITH_STYLES, ...READ_SCHOOL_STYLES, ...TOPIC_STYLES]
export type { Style, Topic } from './util'
