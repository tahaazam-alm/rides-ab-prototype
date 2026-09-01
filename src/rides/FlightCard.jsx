import EK from '@ds-icons/airline-logos/EK.svg'
import FZ from '@ds-icons/airline-logos/FZ.svg'
import QR from '@ds-icons/airline-logos/QR.svg'
import SV from '@ds-icons/airline-logos/SV.svg'
import { Icon } from './icons'
import { formatArrival, formatTime } from './data'

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
          <span>{flight.origin}</span>
          <Icon name="planeLine" size={16} className="ds-icon" />
          <span>Dubai</span>
        </span>

        <span className="flight-card__times">
          {formatTime(flight.depart)} to {formatTime(flight.arrive)}
        </span>
        <span className="flight-card__airline">
          {flight.airlineName} &bull; {flight.number}
        </span>

        <span className="flight-card__arrival">{formatArrival(date, flight)}</span>
      </span>

      {selected && (
        <span className="flight-card__check">
          <Icon name="check" size={24} className="ds-icon" />
        </span>
      )}
    </button>
  )
}
