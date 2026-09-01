import { Icon } from './icons'
import { formatTime } from './data'

/**
 * The v2 pickup page's "manual time is committed" state — the time card, but
 * with its head morphed into a WidgetField-style caption + value and a trailing
 * "Change" link. Only visible on re-entry from the widget (or after the wheel
 * has been closed against a set time), never during initial picking.
 *
 * A separate component rather than a mode of `PickupCard` because the head is
 * genuinely different — no title, a two-line value stack, and an action link
 * on the trailing edge — and pretending it's the same head with a slot swap
 * would take more prop plumbing than a small dedicated component. The card
 * chrome (border, radius, selected ring, warning body) is shared through the
 * same `.pickup-card` classes so the two modes still read as one card.
 */
export function PickupTimeSummary({ time, airport, onChange }) {
  return (
    <div className="pickup-card pickup-card--selected">
      <button type="button" className="pickup-card__head" onClick={onChange}>
        <Icon name="clock" className="ds-icon pickup-card__icon" />
        <span className="pickup-card__content pickup-time-summary">
          <span className="pickup-time-summary__labels">
            <span className="pickup-time-summary__caption">Pickup time</span>
            <span className="pickup-time-summary__value">{formatTime(time)}</span>
          </span>
          <span className="pickup-time-summary__change">Change</span>
        </span>
      </button>

      {/* Same warning the picking state carries — the trade-off doesn't stop
          being true once the wheel has been closed. */}
      {airport && (
        <div className="pickup-card__expanded">
          <p className="pickup-note">
            <Icon name="flightDelayed" className="ds-icon pickup-note__icon" />
            Your driver arrives at {formatTime(time)} exactly. If your flight
            is late we can&rsquo;t hold the car.
          </p>
        </div>
      )}
    </div>
  )
}
