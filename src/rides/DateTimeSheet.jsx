import { Separator, WidgetField } from 'design-system'
import { CalendarGrid } from './CalendarGrid'
import { Collapse } from './Collapse'
import { PickupCard } from './PickupCard'
import { PickupFlightSummary } from './PickupFlightSummary'
import { TimeWheel } from './TimeWheel'
import { formatDate, formatTime } from './data'
import { Icon } from './icons'

/**
 * v1's date-and-time sheet. Two questions in sequence — which date, and how
 * the time should be decided — with the second one only unlocking once the
 * first is answered. Same accordion mental model as the v2 pickup page, just
 * inside a sheet instead of a page: date card at the top, and a time/flight
 * section below that only appears after the traveller picks a cell.
 *
 * For an airport pickup the time section reads as a real two-option choice
 * (wheel + warning · OR · Track my flight), matching the v2 pickup layout
 * exactly. For a city pickup there's no flight to track, so the section is
 * just the wheel and its warning.
 */
export function DateTimeSheet({
  airport,
  date,
  time,
  flight,
  view,
  onViewChange,
  step,
  onStepChange,
  onDateChange,
  onTimeChange,
  onSetTimeMyself,
  onTrackFlight,
  onConfirm,
}) {
  const dateLabel = date ? formatDate(date) : undefined
  const timeLabel = time ? formatTime(time) : undefined
  const onDate = step === 'date'
  // Wheel visible when the traveller is answering "set it myself"; hidden
  // when a flight is tracked (that's the answer, not a time to scroll to).
  const timePicking = !flight

  return (
    <div className="sheet sheet--datetime">
      <div className="sheet__scroll">
        <p className="sheet__blurb">
          This helps us find your terminal, suggest pickup time and track your
          flight in case of delays.
        </p>

        {/* Date card stays mounted so tapping its head after a pick reopens
            the calendar. Focus ring while the calendar is open, matching the
            treatment on the v2 pickup page. */}
        <div className={`rides-card${onDate ? ' rides-card--focused' : ''}`}>
          <WidgetField
            variant={dateLabel ? 'populated' : 'empty'}
            label="Pickup date"
            value={dateLabel}
            icon={<Icon name="calendar" className="ds-icon" />}
            onPress={() => onStepChange('date')}
          />
          <Collapse open={onDate}>
            <Separator className="rides-card__rule rides-card__rule--picker" />
            <CalendarGrid
              view={view}
              selected={date}
              onSelect={onDateChange}
              onViewChange={onViewChange}
            />
          </Collapse>
        </div>

        {/* Time / flight section — only after a date has been picked, so the
            sheet reads as one question at a time. Same class + gap as the v2
            pickup page's options, so the two share their visual rhythm. */}
        {!onDate && (
          <div className="pickup-page__options">
            {timePicking ? (
              <PickupCard
                icon="clock"
                title="Set a pickup time"
                selected
                onSelect={onSetTimeMyself}
              >
                {time && <TimeWheel time={time} onChange={onTimeChange} />}
                {airport && time && (
                  <p className="pickup-note">
                    <Icon
                      name="flightDelayed"
                      className="ds-icon pickup-note__icon"
                    />
                    Your driver arrives at {formatTime(time)} exactly. If your
                    flight is late we can&rsquo;t hold the car.
                  </p>
                )}
              </PickupCard>
            ) : (
              // A flight is tracked, so the wheel would compete with it — the
              // card sits collapsed as a way back to a manual time instead.
              <PickupCard
                icon="clock"
                title="Set a pickup time myself"
                onSelect={onSetTimeMyself}
              />
            )}

            {airport && <Separator variant="or" />}

            {airport && (
              <PickupCard
                icon="flightDelayed"
                title="Track my flight"
                tag="Recommended"
                description={
                  flight
                    ? undefined
                    : 'We set the time from your landing, find your terminal, and adjust for delays'
                }
                selected={!!flight}
                onSelect={onTrackFlight}
              >
                {flight && (
                  <PickupFlightSummary
                    flight={flight}
                    airport={airport}
                    onChange={onTrackFlight}
                  />
                )}
              </PickupCard>
            )}
          </div>
        )}

        <p className="sheet__footnote">
          Rides must be booked 24 hours in advance
        </p>
      </div>

      <Collapse open={!onDate}>
        <div className="sheet__cta">
          <button type="button" className="confirm" onClick={onConfirm}>
            <span className="confirm__label">Confirm</span>
            <span className="confirm__meta">
              {dateLabel} &bull; {timeLabel}
            </span>
          </button>
        </div>
      </Collapse>
    </div>
  )
}
