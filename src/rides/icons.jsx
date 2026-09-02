// Design-system line-icons. The package's `exports` map doesn't expose the icon
// folder, so these come through the `@ds-icons` alias in vite.config.js and are
// inlined as raw SVG so they tint via `currentColor` (the same approach the
// design system uses internally).
import calendar from '@ds-icons/line-icons/calendar.svg?raw'
import chevronDown from '@ds-icons/line-icons/chevronDown.svg?raw'
import chevronLeft from '@ds-icons/line-icons/chevronLeft.svg?raw'
import chevronRight from '@ds-icons/line-icons/chevronRight.svg?raw'
import check from '@ds-icons/line-icons/check.svg?raw'
import flightDelayed from '@ds-icons/line-icons/flightDelayed.svg?raw'
import planeLine from '@ds-icons/line-icons/planeLine.svg?raw'
import infoCircle from '@ds-icons/line-icons/infoCircle.svg?raw'
import pin from '@ds-icons/line-icons/pin.svg?raw'
import airplaneTilt from '@ds-icons/line-icons/airplaneTilt.svg?raw'
import target from '@ds-icons/line-icons/target.svg?raw'
import timer from '@ds-icons/line-icons/timer.svg?raw'
import usersTwo from '@ds-icons/line-icons/usersTwo.svg?raw'
import maginfyingGlass from '@ds-icons/line-icons/maginfyingGlass.svg?raw'
import mic from '@ds-icons/line-icons/mic.svg?raw'
import shieldCheck from '@ds-icons/line-icons/shieldCheck.svg?raw'
import smiley from '@ds-icons/line-icons/smiley.svg?raw'
import x from '@ds-icons/line-icons/x.svg?raw'
import xCircleFill from '@ds-icons/line-icons/xCircleFill.svg?raw'

// Glyphs the design system doesn't ship (the vehicle-feature and capacity marks,
// the filter sliders, the Saudi Riyal symbol), exported from Figma and committed
// under src/assets/cars. Their baked fills were rewritten to `currentColor` so
// they tint from the parent like the design-system icons above.
import arrowsDownUp from '../assets/cars/icon-arrows-down-up.svg?raw'
import cancellation from '../assets/cars/icon-cancellation.svg?raw'
import childSeat from '../assets/cars/icon-child-seat.svg?raw'
import driverLang from '../assets/cars/icon-driver-lang.svg?raw'
import luggage from '../assets/cars/icon-luggage.svg?raw'
import meetGreet from '../assets/cars/icon-meet-greet.svg?raw'
import passengers from '../assets/cars/icon-passengers.svg?raw'
import riyal from '../assets/cars/sar.svg?raw'
import sliders from '../assets/cars/icon-sliders.svg?raw'

// The design system's Figma library has a plain `clock` glyph but the npm
// package doesn't ship one (its `timer` is a stopwatch — crown bar on top, one
// hand — so it reads as elapsed time, not a time of day). Exported from the same
// library node and rewritten to `currentColor` like the glyphs above.
import clock from '../assets/rides/icon-clock.svg?raw'

import { makeIcon } from '../shared/Icon'

const RAW = {
  airplaneTilt,
  calendar,
  check,
  clock,
  flightDelayed,
  planeLine,
  chevronDown,
  chevronLeft,
  chevronRight,
  infoCircle,
  maginfyingGlass,
  pin,
  target,
  timer,
  mic,
  smiley,
  shieldCheck,
  usersTwo,
  x,
  xCircleFill,
  arrowsDownUp,
  cancellation,
  childSeat,
  driverLang,
  luggage,
  meetGreet,
  passengers,
  riyal,
  sliders,
}

export const Icon = makeIcon(RAW)
