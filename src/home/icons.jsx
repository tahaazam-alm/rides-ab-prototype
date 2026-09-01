// Single-colour glyphs for the homepage: the five tab-bar marks (filled
// variants, as the design system asks for) and the coupon copy icon, which the
// design system doesn't ship — exported from Figma and committed under
// src/assets/home with its baked aqua fill rewritten to `currentColor`.
import calendarFilled from '@ds-icons/line-icons/calendarFilled.svg?raw'
import chaletFilled from '@ds-icons/line-icons/chaletFilled.svg?raw'
import compassFilled from '@ds-icons/line-icons/compassFilled.svg?raw'
import discountFilled from '@ds-icons/line-icons/discountFilled.svg?raw'
import userCircleFilled from '@ds-icons/line-icons/userCircleFilled.svg?raw'

import copy from '../assets/home/icon-copy.svg?raw'

import { makeIcon } from '../shared/Icon'

export const Icon = makeIcon({
  calendarFilled,
  chaletFilled,
  compassFilled,
  discountFilled,
  userCircleFilled,
  copy,
})
