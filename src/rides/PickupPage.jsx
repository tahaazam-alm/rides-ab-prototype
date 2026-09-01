import { Navbar, Separator, WidgetField } from 'design-system'
import { CalendarGrid } from './CalendarGrid'
import { Collapse } from './Collapse'
import { PickupCard } from './PickupCard'
import { PickupFlightSummary } from './PickupFlightSummary'
import { PickupOption } from './PickupOption'
import { PickupTimeSummary } from './PickupTimeSummary'
import { TimeWheel } from './TimeWheel'
import { VariantSwitch } from './VariantSwitch'
import { formatDate, formatTime } from './data'
import { Icon } from './icons'

export const PICKUP_VARIANTS = ['v1', 'v2']

/**
 * The pickup step, itself under A/B test in two layouts.
 *
 * Both ask the same two questions — which date, and how the time should be
 * decided — and only an airport pickup is offered the second answer, since only
 * an arrival has a flight to read a time from. What differs is where the answer
 * gets given:
 *
 *   v1  Two tappable cards. Choosing one opens its picker in a sheet over the
 *       page, and confirming there ends the step.
 *   v2  Two expanding cards without radios, over one Confirm pinned to the
 *       bottom. The page reads as one question at a time: only the calendar
 *       is visible until a date is chosen, then the calendar collapses and
 *       the time picker takes its place — with the flight card sitting below
 *       so a tap on it is still one step away. Only one section opens at a
 *       time (the calendar and the time card are an accordion) so switching
 *       between date and time is unambiguous. Picking a flight commits the
 *       whole step and drops straight back to the widget in its filled state.
 *
 * Split into a shared shell plus one sub-component per layout, following the
 * pattern the design system uses for its platform variants: same public
 * component, same prop contract, the variant as a single input.
 */

/** Navbar, scroll body, and the date card — identical in both layouts. */
function PickupShell({
  airport,
  date,
  view,
  onViewChange,
  calendarOpen,
  onOpenCalendar,
  onDateChange,
  onBack,
  inert,
  dateHeading,
  showOptions = true,
  optionsSubtext,
  variant,
  onVariantChange,
  children,
  footer,
}) {
  return (
    <div className="pickup-page" inert={inert}>
      <header className="pickup-page__header">
        <Navbar
          toolbar={{
            variant: 'default',
            title: airport ? 'Airport pickup' : 'Pickup date & time',
            onBack,
          }}
        />

        {/* This step's arm is switched here rather than back on the home screen,
            so the control sits on the screen it rearranges. Unlabelled: on this
            page there is only one test it could mean. */}
        {onVariantChange && (
          <VariantSwitch
            className="variant-switch--step"
            variants={PICKUP_VARIANTS}
            value={variant}
            onChange={onVariantChange}
          />
        )}
      </header>

      <div className="pickup-page__body">
        <section className="pickup-page__section">
          {dateHeading && (
            <h2 className="pickup-page__heading">Select your pickup date</h2>
          )}

          {/* The card carries the focus ring while its picker is open, so the
              open calendar reads as part of the field it is filling. */}
          <div className={`rides-card${calendarOpen ? ' rides-card--focused' : ''}`}>
            <WidgetField
              className={calendarOpen ? 'widget-field--focused' : undefined}
              variant={date ? 'populated' : 'empty'}
              label={airport ? 'Pickup/Arrival date' : 'Pickup date'}
              value={date ? formatDate(date) : undefined}
              icon={<Icon name="calendar" className="ds-icon" />}
              onPress={onOpenCalendar}
            />
            <Collapse open={calendarOpen}>
              <Separator className="rides-card__rule rides-card__rule--picker" />
              <CalendarGrid
                view={view}
                selected={date}
                onSelect={onDateChange}
                onViewChange={onViewChange}
              />
            </Collapse>
          </div>
        </section>

        {/* v2 pickup hides the options until a date has been picked, so the
            screen reads as one question at a time and nothing below the
            calendar can distract from it. */}
        {showOptions && (
          <section className="pickup-page__section">
            <div className="pickup-page__section-head">
              <h2 className="pickup-page__heading">When should we pick you up?</h2>
              {/* v1's two option cards both look like affordances rather than
                  answers, so this line names the choice explicitly. v2 has the
                  accordion + pinned Confirm carrying the same cue, and doesn't
                  need it. */}
              {optionsSubtext && (
                <p className="pickup-page__subheading">{optionsSubtext}</p>
              )}
            </div>
            <div className="pickup-page__options">{children}</div>
          </section>
        )}
      </div>

      {footer}
    </div>
  )
}

/** v1 — cards that open their picker in a sheet. */
function PickupPageOptions({ airport, onSetTimeMyself, onTrackFlight, ...shell }) {
  return (
    <PickupShell
      airport={airport}
      dateHeading
      optionsSubtext="Select your preferred option"
      {...shell}
    >
      <PickupOption
        icon="clock"
        title="Set a pickup time myself"
        description={
          airport
            ? 'Choose a time and tell. No delay tracking.'
            : 'Choose the time your driver should arrive.'
        }
        onSelect={onSetTimeMyself}
      />

      {/* Tracking needs a flight number to follow, so it is offered only where
          there is one — an arrival. */}
      {airport && (
        <PickupOption
          icon="flightDelayed"
          title="Track my flight"
          tag="Recommended"
          description="We set the time from your landing, find your terminal, and move the pickup if you're delayed."
          onSelect={onTrackFlight}
        />
      )}
    </PickupShell>
  )
}

/**
 * v2 — cards without radios, the picker expanding inside the chosen one.
 *
 * The two option cards behave as one accordion with the calendar above them —
 * only one section is open at a time, so switching between date and time is a
 * single tap, and there is never any ambiguity about which picker the visible
 * controls belong to. The `expanded` prop (`'date' | 'time' | null`) is
 * managed by the funnel so this mutual exclusion also covers the calendar in
 * the shell above.
 *
 * The card that is currently expanded carries the aqua focus ring — the same
 * treatment the calendar card gets — so the ring reads as "this picker is
 * open" rather than "this is your committed answer". The committed answer is
 * echoed on the pinned Confirm bar instead.
 */
function PickupPageExpanding({
  airport,
  date,
  time,
  flight,
  expanded,
  onSetTimeMyself,
  onTimeChange,
  onTrackFlight,
  onConfirm,
  ...shell
}) {
  // The time card has three modes; each is a distinct visual, so this reads
  // more clearly as a triage than as one card with a lot of conditional
  // children. `timePicking` is the wheel; `timeCommitted` is the summary
  // seen on re-entry from the widget; the fall-through is the empty prompt.
  const timePicking = expanded === 'time' && time
  const timeCommitted = expanded !== 'time' && time && !flight

  return (
    <PickupShell
      airport={airport}
      date={date}
      dateHeading
      showOptions={!!date}
      {...shell}
      footer={
        <div className="pickup-page__bar">
          {/* The step's only exit, and the one place the whole answer is stated
              back — hence the two lines. Guarded for a chosen option that has
              nothing to give yet. */}
          <button
            type="button"
            className="confirm"
            disabled={!time}
            onClick={onConfirm}
          >
            <span className="confirm__label">Confirm</span>
            {date && time && (
              <span className="confirm__meta">
                {formatDate(date)} &bull; {formatTime(time)}
              </span>
            )}
          </button>
        </div>
      }
    >
      {timePicking ? (
        <PickupCard
          icon="clock"
          title="Set a pickup time"
          selected
          onSelect={onSetTimeMyself}
        >
          <TimeWheel time={time} onChange={onTimeChange} />

          {/* Only an airport pickup can be undone by a late flight, so the
              warning is only true — and only useful — there. */}
          {airport && (
            <p className="pickup-note">
              <Icon name="flightDelayed" className="ds-icon pickup-note__icon" />
              Your driver arrives at {formatTime(time)} exactly. If your flight
              is late we can&rsquo;t hold the car.
            </p>
          )}
        </PickupCard>
      ) : timeCommitted ? (
        <PickupTimeSummary
          time={time}
          airport={airport}
          onChange={onSetTimeMyself}
        />
      ) : (
        <PickupCard
          icon="clock"
          title="Set a pickup time myself"
          onSelect={onSetTimeMyself}
        />
      )}

      {/* Both options answer the same question, so the OR line spells out that
          the choice is exclusive rather than additive — a "pick one" cue that
          the two cards on their own don't carry. Rendered inside the same flex
          column, so its 12px gap sits it evenly between the cards. */}
      {airport && <Separator variant="or" />}

      {airport && (
        <PickupCard
          icon="flightDelayed"
          title="Track my flight"
          tag="Recommended"
          // Description gives way to the flight summary once one is picked —
          // the card body swaps from "here's what tracking does" to "here's
          // the flight you're tracking".
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
    </PickupShell>
  )
}

export function PickupPage({ variant = 'v1', ...props }) {
  if (variant === 'v2')
    return <PickupPageExpanding variant={variant} {...props} />
  return <PickupPageOptions variant={variant} {...props} />
}
