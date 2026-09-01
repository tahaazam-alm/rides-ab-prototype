import { useState } from 'react'
import { Button } from 'design-system'
import { TimeWheel } from './TimeWheel'
import { formatTime } from './data'
import { Icon } from './icons'

/**
 * The manual half of the fork: a wheel, the consequence of picking by hand, and
 * a Confirm.
 *
 * The wheel edits a draft rather than the trip's time, so closing the sheet
 * leaves the booking as it was. That matters more here than in v1's inline
 * picker: this sheet is one of two ways to set a time, and backing out of it is
 * how someone changes their mind and tracks a flight instead.
 */
export function PickupTimeSheet({ time, airport, onConfirm }) {
  const [draft, setDraft] = useState(time)

  return (
    <div className="sheet sheet--time">
      <TimeWheel time={draft} onChange={setDraft} />

      {/* Only an airport pickup can be undone by a late flight, so the warning
          is only true — and only useful — there. */}
      {airport && (
        <p className="pickup-note">
          <Icon name="flightDelayed" className="ds-icon pickup-note__icon" />
          Your driver arrives at {formatTime(draft)} exactly. If your flight is
          late we can&rsquo;t hold the car.
        </p>
      )}

      <Button variant="primary" label="Confirm" onClick={() => onConfirm(draft)} />
    </div>
  )
}
