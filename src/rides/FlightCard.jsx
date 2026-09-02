import EK from '@ds-icons/airline-logos/EK.svg'
import FZ from '@ds-icons/airline-logos/FZ.svg'
import QR from '@ds-icons/airline-logos/QR.svg'
import SV from '@ds-icons/airline-logos/SV.svg'
import { Icon } from './icons'
import { formatTime } from './data'
import { useCalendarLabels, useT } from '../i18n.jsx'

// Design-system airline logos, keyed by the carrier's IATA code exactly as the
// files are named. Brand marks with baked-in colours, so they render as <img>
// rather than going through the currentColor icon path.
const LOGOS = { EK, FZ, QR, SV }

/**
 * One inbound flight. The landing line is set apart in semibold because it is
 * the only line that answers the question being asked — everything above it is
 * there to confirm this is the right flight.
 */
export function FlightCard({ flight, date, selected, onSelect }) {
  const t = useT()
  const { months, weekdays, arrivesOn } = useCalendarLabels()
  const weekday = weekdays[new Date(date.year, date.month, date.day).getDay()]
  // Fall through the dict so an unknown city/airline still renders its raw
  // English string rather than exposing a raw dot-path.
  const localise = (key, fallback) => {
    const v = t(key)
    return v === key ? fallback : v
  }
  const origin = localise(`rides.city.${flight.origin}`, flight.origin)
  const destination = localise('rides.city.Dubai', 'Dubai')
  const airlineName = localise(
    `rides.airline.${flight.airlineName}`,
    flight.airlineName,
  )
  // `<bdi>` isolates each LTR run so the RTL "إلى" connector and the RTL
  // container flow don't reorder the time tokens. Without it, "12:30 PM"
  // splits into a numeric run and a Latin-alpha run, and the two get
  // repositioned inside the RTL paragraph.
  return (
    <button
      type="button"
      className={`flight-card${selected ? ' flight-card--selected' : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <img className="flight-card__logo" src={LOGOS[flight.airline]} alt="" />

      <span className="flight-card__body">
        <span className="flight-card__route">
          <span>{origin}</span>
          <Icon name="planeLine" size={16} className="ds-icon" />
          <span>{destination}</span>
        </span>

        {/* No `dir="ltr"` here: the `<bdi>` wrappers isolate each time as an
            atomic LTR unit, and letting the span inherit the ambient direction
            keeps its `text-align: start` on the same side as the rest of the
            card body (right in RTL, left in LTR). */}
        <span className="flight-card__times">
          <bdi>{formatTime(flight.depart)}</bdi>{' '}
          {t('rides.flightSearch.timeConnector')}{' '}
          <bdi>{formatTime(flight.arrive)}</bdi>
        </span>
        <span className="flight-card__airline">
          {airlineName} &bull; <bdi>{flight.number}</bdi>
        </span>

        <span className="flight-card__arrival">
          {arrivesOn} {weekday} {date.day} {months[date.month]},{' '}
          <bdi>{formatTime(flight.arrive)}</bdi>
        </span>
      </span>

      {selected && (
        <span className="flight-card__check">
          <Icon name="check" size={24} className="ds-icon" />
        </span>
      )}
    </button>
  )
}
