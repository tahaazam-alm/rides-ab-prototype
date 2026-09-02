import EK from '@ds-icons/airline-logos/EK.svg'
import FZ from '@ds-icons/airline-logos/FZ.svg'
import QR from '@ds-icons/airline-logos/QR.svg'
import SV from '@ds-icons/airline-logos/SV.svg'
import { Icon } from './icons'
import { formatTime } from './data'

// Same map `FlightCard` uses — brand marks are keyed by the carrier's IATA
// code, which is also the SVG filename. Kept per file rather than centralised
// so each consumer imports only the logos it renders.
const LOGOS = { EK, FZ, QR, SV }

/**
 * The "a flight is committed" state, rendered inside the flight card's
 * expanded body. States the picked flight back the way the search list showed
 * it (logo, route, times, carrier + number, landing + terminal) with an
 * action link on the corner of the details box.
 *
 * Two flavours via `minimal`:
 *   Full (default) — v2 pickup page. "Change" label + the two commitment
 *     chips ("Delay tracked", "60 min free wait") + the "we track your
 *     flight" blurb below, so the traveller sees exactly what tracking
 *     buys them.
 *   Minimal — v1 date & time sheet. "Remove" label, no chips, no blurb — the
 *     traveller is on the summary screen and just wants to confirm or undo.
 */
export function PickupFlightSummary({
  flight,
  airport,
  onChange,
  changeLabel = 'Change',
  minimal = false,
}) {
  return (
    <div className="pickup-flight-summary">
      <div className="pickup-flight-summary__box">
        <img
          className="pickup-flight-summary__logo"
          src={LOGOS[flight.airline]}
          alt=""
        />

        <div className="pickup-flight-summary__body">
          <div className="pickup-flight-summary__route">
            <span>{flight.origin}</span>
            <Icon name="planeLine" size={16} className="ds-icon" />
            <span>{airport.city}</span>
          </div>
          <div className="pickup-flight-summary__meta">
            {formatTime(flight.depart)} to {formatTime(flight.arrive)}
          </div>
          <div className="pickup-flight-summary__meta">
            {flight.airlineName} &bull; {flight.number}
          </div>
          <div className="pickup-flight-summary__landing">
            Lands {formatTime(flight.arrive)} &middot; {airport.airport}{' '}
            {flight.terminal}
          </div>
        </div>

        <button
          type="button"
          className="pickup-flight-summary__change"
          onClick={onChange}
        >
          {changeLabel}
        </button>
      </div>

      {!minimal && (
        <p className="pickup-flight-summary__blurb">
          Your flight will be tracked and driver will arrive accordingly
        </p>
      )}

      {/* The two commitments that come with tracking, made visible so the
          traveller knows exactly what "we'll adjust for delays" turns into. */}
      {!minimal && (
        <div className="pickup-flight-summary__chips">
          <span className="pickup-chip pickup-chip--success">
            <Icon name="shieldCheck" size={16} className="ds-icon" />
            Delay tracked
          </span>
          <span className="pickup-chip pickup-chip--info">
            <Icon name="timer" size={16} className="ds-icon" />
            60 min free wait
          </span>
        </div>
      )}
    </div>
  )
}
