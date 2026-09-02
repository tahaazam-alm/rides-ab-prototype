import { Separator, WidgetField } from 'design-system'
import { CalendarGrid } from './CalendarGrid'
import { Collapse } from './Collapse'
import { PickupCard } from './PickupCard'
import { PickupFlightSummary } from './PickupFlightSummary'
import { TimeWheel } from './TimeWheel'
import { formatDate, formatTime } from './data'
import { Icon } from './icons'
import { useCalendarLabels, useT } from '../i18n.jsx'

/**
 * The date-and-time sheet, shared by both funnel variants. Two questions —
 * which date, and how the time should be decided — expressed as a proper
 * accordion: each field is a WidgetField-style card whose picker (calendar
 * or wheel) expands inside it, and the two are mutually exclusive so at
 * most one is open at a time. Neither is a requirement — `step === null`
 * collapses both to summary rows, which is the "settled" state a traveller
 * sees on re-entry with an answered trip.
 *
 * `hideFlight` swaps out the flight-tracking branch: v1 shows the "Track my
 * flight" card below the time card (with an OR separator, and the flight
 * summary once one is picked); v2 asks the flight question after the
 * traveller picks a car, so this sheet is date and time only. In v2 mode the
 * empty-state placeholder is a plain "Pickup time" clock card rather than
 * the combined "Pickup time or flight tracking" entry point.
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
  onTrackFlight,
  onRemoveFlight,
  onAdvanceToTime,
  onConfirm,
  hideFlight = false,
}) {
  const t = useT()
  const { months } = useCalendarLabels()
  const dateLabel = date ? formatDate(date, months) : undefined
  const timeLabel = time ? formatTime(time) : undefined
  const dateOpen = step === 'date'
  const timeOpen = step === 'time'
  const hasAnswer = !!(time || flight)

  // Head taps toggle: tap an open card to collapse it (accordion goes to
  // null), tap a closed card to open it (the other card's open state is
  // replaced automatically since `step` is a single value).
  const toggleDate = () => onStepChange(dateOpen ? null : 'date')
  const toggleTime = () => onStepChange(timeOpen ? null : 'time')

  const confirmMeta = [dateLabel, timeLabel].filter(Boolean).join(' • ')

  return (
    <div className="sheet sheet--datetime">
      <div className="sheet__scroll">
        {/* Date card — WidgetField + Collapse pattern. Focus ring while the
            calendar is open, matching the treatment on the v2 pickup page. */}
        <div className={`rides-card${dateOpen ? ' rides-card--focused' : ''}`}>
          <WidgetField
            variant={dateLabel ? 'populated' : 'empty'}
            label={
              airport
                ? t('rides.dateTime.pickupArrivalDate')
                : t('rides.dateTime.pickupDate')
            }
            value={dateLabel}
            icon={<Icon name="calendar" className="ds-icon" />}
            onPress={toggleDate}
          />
          <Collapse open={dateOpen}>
            <Separator className="rides-card__rule rides-card__rule--picker" />
            <CalendarGrid
              view={view}
              selected={date}
              onSelect={onDateChange}
              onViewChange={onViewChange}
            />
          </Collapse>
        </div>

        {/* Nothing answered yet — one card entry point stands in for the
            whole time section. v1 offers "Pickup time or flight tracking"
            (either answer moves the trip forward); v2 asks the flight
            question after car selection, so its placeholder is a plain
            "Pickup time" clock card. */}
        {!hasAnswer && (
          <div className="pickup-page__options">
            <PickupCard
              icon={hideFlight ? 'clock' : 'flightDelayed'}
              title={
                hideFlight
                  ? t('rides.dateTime.pickupTime')
                  : t('rides.dateTime.setTimeOrFlight')
              }
              onSelect={onAdvanceToTime}
            />
          </div>
        )}

        {/* Flight tracked — the whole time section collapses down to the
            flight card. No time card, no OR: the answer is the flight, so
            offering a "set it myself" alongside would clutter the summary
            view. Removing the flight (via the details box's Remove link)
            drops back to the manual-time layout below. Only relevant on v1;
            v2 never sets a flight from this sheet. */}
        {flight && !hideFlight && (
          <div className="pickup-page__options">
            <PickupCard
              icon="flightDelayed"
              title={t('rides.dateTime.trackFlight')}
              tag={t('common.recommended')}
              selected
              onSelect={onTrackFlight}
            >
              <PickupFlightSummary
                flight={flight}
                airport={airport}
                onChange={onRemoveFlight}
                changeLabel={t('common.remove')}
                minimal
              />
            </PickupCard>
          </div>
        )}

        {/* Manual time — the time card is the WidgetField accordion, and for
            an airport pickup on v1 the Track my flight card sits below as an
            alternative. v2 hides that alternative here (the flight is asked
            for later, after car selection). */}
        {time && !flight && (
          <div className="pickup-page__options">
            <div
              className={`rides-card${timeOpen ? ' rides-card--focused' : ''}`}
            >
              <WidgetField
                variant={timeLabel ? 'populated' : 'empty'}
                label={t('rides.dateTime.pickupTime')}
                value={timeLabel}
                icon={<Icon name="clock" className="ds-icon" />}
                onPress={toggleTime}
              />
              <Collapse open={timeOpen}>
                <Separator className="rides-card__rule rides-card__rule--picker" />
                {time && <TimeWheel time={time} onChange={onTimeChange} />}
              </Collapse>
            </div>

            {!hideFlight && airport && <Separator variant="or" />}

            {!hideFlight && airport && (
              <PickupCard
                icon="flightDelayed"
                title={t('rides.dateTime.trackFlight')}
                tag={t('common.recommended')}
                description={t('rides.dateTime.trackDesc')}
                onSelect={onTrackFlight}
              />
            )}
          </div>
        )}

        <p className="sheet__footnote">{t('rides.dateTime.mustBook')}</p>
      </div>

      {/* Confirm sticks around once the time question has an answer, even if
          the calendar is reopened to change dates — the traveller has enough
          on the trip to commit, so the CTA shouldn't disappear on them. It
          only stays hidden in the very first "no time yet" state. */}
      <Collapse open={hasAnswer}>
        <div className="sheet__cta">
          <button type="button" className="confirm" onClick={onConfirm}>
            <span className="confirm__label">{t('common.confirm')}</span>
            {confirmMeta && (
              <span className="confirm__meta">{confirmMeta}</span>
            )}
          </button>
        </div>
      </Collapse>
    </div>
  )
}
