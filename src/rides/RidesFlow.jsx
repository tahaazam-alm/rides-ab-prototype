import { useCallback, useState } from 'react'
import { BottomSheet, Snackbar } from 'design-system'
import { RidesHome } from './RidesHome'
import { RidesResults } from './RidesResults'
import { RidesReview } from './RidesReview'
import { RouteSheet } from './RouteSheet'
import { RoutePage } from './RoutePage'
import { DateTimeSheet } from './DateTimeSheet'
import { PickupPage } from './PickupPage'
import { PickupTimeSheet } from './PickupTimeSheet'
import { FlightSearchField, FlightSearchSheet } from './FlightSearchSheet'
import { VariantSwitch } from './VariantSwitch'
import { TODAY, findAirport, formatDate, formatTime } from './data'
import './rides.css'

const DEFAULT_TIME = { hour: 12, minute: 30, meridiem: 'PM' }

/**
 * The Rides funnel, in two variants under A/B test.
 *
 * Both describe the same trip and share the home screen, the results, and the
 * review — the test is only about how the trip gets *described*:
 *
 *   v1  Bottom sheets. Route in one, date-and-time in another, each returning
 *       straight to the home screen.
 *   v2  Pages, in order: route, then pickup. And because the pickup step is a
 *       screen of its own, it has room to ask the question a sheet had nowhere
 *       to put — whether an airport pickup should be timed by hand or read off
 *       the traveller's inbound flight.
 *
 * That pickup step is itself under test, in two layouts of its own (see
 * `PickupPage`), so `pickupVariant` is a second axis nested inside v2 — it has
 * no effect on v1, which has no pickup page to lay out. Its switch lives on that
 * page rather than here, next to the layout it changes.
 *
 * The trip itself lives here rather than in either variant, so flipping between
 * them mid-booking keeps everything already filled in and the two are compared
 * on the same trip.
 */
export function RidesFlow({
  variant = 'v1',
  pickupVariant = 'v1',
  onVariantChange,
  onPickupVariantChange,
  onExit,
}) {
  const v2 = variant === 'v2'
  // The pickup step's inline layout — its own v2, keeping its pickers on the
  // page instead of opening a sheet like v1 does. Only exists inside the paged
  // funnel, so both flags have to be set for it to matter.
  const inlinePickup = v2 && pickupVariant === 'v2'

  const [screen, setScreen] = useState('home') // 'home' | 'results' | 'review'
  const [car, setCar] = useState(null)
  // v1: 'route' | 'datetime'. v2: 'time' | 'flights' — both open over a page.
  const [sheet, setSheet] = useState(null)
  /**
   * v2 only: the step stack. v2 is a wizard — describing a trip from scratch is
   * route, then date and time — so it needs to remember how the traveller got
   * to a step, not just which one they are on. Back off the pickup step returns
   * to the route it was reached through, but returns to the home screen when the
   * pickup step was opened straight from the widget.
   */
  const [pages, setPages] = useState([]) // e.g. ['route', 'pickup']
  const page = pages.at(-1) ?? null
  const pushPage = (next) => setPages((stack) => [...stack, next])
  const popPage = () => setPages((stack) => stack.slice(0, -1))
  const [focused, setFocused] = useState('destination')
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [view, setView] = useState({ year: TODAY.year, month: TODAY.month })
  const [step, setStep] = useState('date')
  const [passengers, setPassengers] = useState(2)
  const [toast, setToast] = useState('')

  // v2 only: the inbound flight the pickup is timed from, and the flight search.
  const [flight, setFlight] = useState(null)
  const [flightQuery, setFlightQuery] = useState('')
  /**
   * The pickup page's currently-open picker: 'date' (calendar), 'time' (wheel,
   * v2 pickup only), or null. Held here rather than inside the page so the
   * calendar in the shell and the time card in the v2 body share one accordion
   * state — opening either closes the other, without either component having
   * to know about the one it displaces. Meaningless outside the pickup page,
   * and reset each time the page opens.
   */
  const [pickupExpanded, setPickupExpanded] = useState(null)

  /**
   * Switching arms mid-booking keeps the trip but drops where the traveller was
   * standing, because the two variants have no screens in common: v2's pushed
   * page and its sheets don't exist in v1, so carrying them over would leave the
   * home screen inert behind chrome that no longer renders. Adjusted during
   * render rather than in an effect, so the new arm's first paint is already
   * correct.
   */
  const [arm, setArm] = useState(variant)
  if (arm !== variant) {
    setArm(variant)
    setScreen('home')
    setPages([])
    setSheet(null)
    setKeyboardOpen(false)
  }

  /**
   * The pickup step's own arm switch. Sheets on the pickup page belong to the
   * variant that opened them — v2's time wheel is inline, v1's is a sheet, and
   * both share the flight search — so a sheet left open from the previous arm
   * would render on top of the new arm's default state (e.g. a flight search
   * covering v1's date-expanded page). Reset just enough to give each arm its
   * own clean entry, without touching the trip the traveller has entered so
   * far. Only runs while on the pickup page — a switch flipped ahead of time
   * on the route page has nothing to reset.
   */
  const [pickupArm, setPickupArm] = useState(pickupVariant)
  if (pickupArm !== pickupVariant) {
    setPickupArm(pickupVariant)
    if (page === 'pickup') {
      setSheet(null)
      setKeyboardOpen(false)
      setPickupExpanded('date')
    }
  }

  // The DS Snackbar restarts its dismiss timer whenever `onClose` changes
  // identity, so an inline arrow here would keep the toast up for as long as
  // the user keeps touching the screen.
  const dismissToast = useCallback(() => setToast(''), [])

  // The pickup airport, when the pickup is one. This single lookup is what opens
  // v2's flight-tracking branch — everything downstream keys off it.
  const airport = findAirport(pickup)

  // Show whatever is known rather than nothing: v2 can leave the page with a
  // date but no time yet, and losing the date the traveller just picked would
  // read as the tap not having registered.
  const dateTimeLabel = date
    ? time
      ? `${formatDate(date)}, ${formatTime(time)}`
      : formatDate(date)
    : ''

  const focusField = (field) => {
    setFocused(field)
    setKeyboardOpen(true)
  }

  const openRoute = (field) => {
    focusField(field)
    if (v2) pushPage('route')
    else setSheet('route')
  }

  // Opens the pickup page. First entry lands on the date question; re-entry
  // from the widget with an answer already in place skips straight to that
  // answer's summary card — see the branching below.
  const openPickupPage = () => {
    // v1 pickup seeds a date so its calendar opens on a chosen cell — the
    // frame shows Sep 15 selected. v2 pickup leaves the calendar unsourced so
    // the user's own tap answers the question; the "when should we pick you
    // up?" section stays hidden until it does.
    if (!inlinePickup) {
      const seeded = date ?? { ...TODAY, day: 15 }
      setDate(seeded)
      setView({ year: seeded.year, month: seeded.month })
    } else {
      const anchor = date ?? TODAY
      setView({ year: anchor.year, month: anchor.month })
    }
    // v2 pickup re-entered with a committed answer (a manual time or a
    // tracked flight) leaves the calendar closed, so the answer card is the
    // first thing on the page rather than sitting under an open picker the
    // traveller didn't ask to reopen. Fresh entry (or v1 pickup) still opens
    // the calendar.
    if (inlinePickup && (time || flight)) {
      setPickupExpanded(null)
    } else {
      setPickupExpanded('date')
    }
    setKeyboardOpen(false)
    pushPage('pickup')
  }

  const openDateTime = () => {
    if (v2) {
      openPickupPage()
      return
    }
    // Fresh entry (no answer yet): leave the calendar unsourced so the
    // traveller's own tap picks the date, and hide the time section until it
    // does — same "one question at a time" framing as v2 pickup. Re-entry
    // with a committed answer (a manual time or a tracked flight) skips
    // straight to the time section so the answer card reads first.
    const hasAnswer = !!(time || flight)
    setStep(hasAnswer ? 'time' : 'date')
    const anchor = date ?? TODAY
    setView({ year: anchor.year, month: anchor.month })
    setSheet('datetime')
  }

  /**
   * A route field was filled in. Once both legs are described the step is done
   * and the trip moves on to date & time — always, even when a time is already
   * on the trip. Both variants read as a wizard: v1 swaps the route sheet for
   * the date & time sheet, v2 pushes the pickup page. Dropping someone back on
   * the widget mid-sequence would make them find the next field themselves,
   * which is the thing this chaining exists to avoid.
   */
  const commitRoute = (field, value) => {
    const next = { pickup, destination, [field]: value }
    if (field === 'pickup') setPickup(value)
    else setDestination(value)

    // Move on to the leg the traveller still has to fill.
    if (!next.pickup || !next.destination) {
      focusField(next.pickup ? 'destination' : 'pickup')
      return
    }

    setKeyboardOpen(false)
    if (v2) openPickupPage()
    else openDateTime()
  }

  // Timing by hand replaces any flight that was being tracked — the two are
  // alternative answers to the same question, so holding both would leave the
  // home screen claiming to track a flight it no longer times the pickup from.
  const confirmTime = (picked) => {
    setTime(picked)
    setFlight(null)
    setSheet(null)
    setPages([])
  }

  /**
   * "Time it myself" is the two pickup layouts' shared verb: v1 (cards) opens
   * the wheel in a sheet; v2 (accordion) expands it inside the option, which
   * closes the calendar above it. Either way the flight is dropped — the two
   * options are alternative answers to the same question — and a time seeded
   * so the wheel has a value to start from.
   */
  const chooseManualTime = () => {
    if (!inlinePickup) {
      setSheet('time')
      return
    }
    setFlight(null)
    if (!time) setTime(DEFAULT_TIME)
    setPickupExpanded('time')
  }

  const openFlightSheet = () => {
    setFlightQuery('')
    setKeyboardOpen(true)
    setSheet('flights')
  }

  // Picking a flight *is* the whole answer to the pickup step — a landing time
  // and a terminal, with delay tracking around them — so both pickup layouts
  // commit on selection and drop straight back to the widget. Its tracking tag
  // and terminal subtext are already wired to `flight`, so no confirm handoff
  // is needed here.
  const trackFlight = (picked) => {
    setFlight(picked)
    setTime(picked.arrive)
    setKeyboardOpen(false)
    setSheet(null)
    setPages([])
  }

  // The CTA only leaves the home screen once the whole trip is described —
  // otherwise it names the leg that is still missing rather than searching.
  const searchCars = () => {
    if (!pickup || !destination) {
      setToast('Add a pickup location and destination first')
      return
    }
    if (!date || !time) {
      setToast('Add a pickup date and time first')
      return
    }
    setScreen('results')
  }

  // Shared by v1's route sheet and v2's route page — the search itself is
  // identical in both, only the chrome around it differs.
  const routeProps = {
    pickup,
    destination,
    focused,
    keyboardOpen,
    onFocus: focusField,
    onDismissKeyboard: () => setKeyboardOpen(false),
    onChange: (field, value) =>
      field === 'pickup' ? setPickup(value) : setDestination(value),
    onClear: (field) => (field === 'pickup' ? setPickup('') : setDestination('')),
    onPickSuggestion: commitRoute,
  }

  return (
    <div className="rides-screen">
      <RidesHome
        onBack={onExit}
        pickup={pickup}
        pickupSubtext={flight?.terminal}
        destination={destination}
        dateTimeLabel={dateTimeLabel}
        trackingLabel={flight ? `Tracking ${flight.number.replace(' ', '')}` : ''}
        passengers={passengers}
        onPassengersChange={setPassengers}
        onEditRoute={openRoute}
        onEditDateTime={openDateTime}
        onSearch={searchCars}
        inert={sheet !== null || page !== null || screen !== 'home'}
      />

      {/* Kept mounted behind the results so going back is instant and the
          filled-in fields are exactly as the user left them. */}
      {screen !== 'home' && (
        <RidesResults
          pickup={pickup}
          destination={destination}
          date={date}
          time={time}
          passengers={passengers}
          onBack={() => setScreen('home')}
          onEditItinerary={() => setScreen('home')}
          inert={screen !== 'results'}
          onSelectCar={(picked) => {
            setCar(picked)
            setScreen('review')
          }}
        />
      )}

      {screen === 'review' && car && (
        <RidesReview
          car={car}
          pickup={pickup}
          destination={destination}
          date={date}
          time={time}
          flight={flight}
          onBack={() => setScreen('results')}
          onContinue={({ firstName }) =>
            setToast(`Thanks ${firstName} — taking you to payment`)
          }
        />
      )}

      {/* ---------- v1: the trip is described in sheets ---------- */}

      {!v2 && (
        <>
          <BottomSheet
            open={sheet === 'route'}
            size="fullscreen"
            platform="ios"
            title="Plan your route"
            onClose={() => setSheet(null)}
          >
            {sheet === 'route' && <RouteSheet {...routeProps} />}
          </BottomSheet>

          <BottomSheet
            open={sheet === 'datetime'}
            size="fullscreen"
            platform="ios"
            title="Add pickup date & time"
            onClose={() => setSheet(null)}
          >
            {sheet === 'datetime' && (
              <DateTimeSheet
                airport={airport}
                date={date}
                time={time}
                flight={flight}
                view={view}
                onViewChange={setView}
                step={step}
                onStepChange={setStep}
                onDateChange={(next) => {
                  setDate(next)
                  // Seed the wheel so the time section that appears next has
                  // a value to sit on — same seed the v2 pickup accordion
                  // uses when the date question is answered.
                  if (!time) setTime(DEFAULT_TIME)
                  setStep('time')
                }}
                onTimeChange={setTime}
                // Manual time drops any tracked flight — the two answer the
                // same question, so holding both would leave the widget
                // tracking a flight it no longer times the pickup from.
                onSetTimeMyself={() => {
                  setFlight(null)
                  if (!time) setTime(DEFAULT_TIME)
                }}
                onTrackFlight={openFlightSheet}
                onConfirm={() => setSheet(null)}
              />
            )}
          </BottomSheet>
        </>
      )}

      {/* ---------- v2: the trip is described in pages ---------- */}

      {v2 && page === 'route' && (
        <RoutePage
          {...routeProps}
          onBack={() => {
            setKeyboardOpen(false)
            popPage()
          }}
          // The pickup step's arm is offered here too, so it can be picked
          // ahead of arriving on the page it changes — useful for reviewing
          // the airport case, where the point of the test is what happens
          // once the destination lands on an airport.
          pickupVariant={pickupVariant}
          onPickupVariantChange={onPickupVariantChange}
          inert={sheet !== null}
        />
      )}

      {v2 && page === 'pickup' && (
        <PickupPage
          airport={airport}
          date={date}
          view={view}
          onViewChange={setView}
          // Shell reads the boolean it always has; v2 pickup reads the whole
          // string to control its own time card. One state, two derived views.
          calendarOpen={pickupExpanded === 'date'}
          expanded={pickupExpanded}
          // Toggles the calendar. In v2 pickup opening it also closes any time
          // card that was expanded (the state itself is exclusive), so the
          // accordion rule is enforced without either card having to know about
          // the other.
          onOpenCalendar={() =>
            setPickupExpanded((cur) => (cur === 'date' ? null : 'date'))
          }
          onDateChange={(next) => {
            setDate(next)
            // v1: collapse the calendar and put the two option cards back in
            // view. v2: same collapse, but also open the time picker so the
            // user's next choice is right in front of them — either the wheel
            // that just appeared, or the "Track my flight" card below it. The
            // wheel needs a value to sit on, so seed one if the trip doesn't
            // already have one.
            if (!inlinePickup) {
              setPickupExpanded(null)
              return
            }
            if (!time) setTime(DEFAULT_TIME)
            setPickupExpanded('time')
          }}
          variant={pickupVariant}
          onVariantChange={onPickupVariantChange}
          time={time}
          flight={flight}
          onTimeChange={setTime}
          onSetTimeMyself={chooseManualTime}
          onTrackFlight={openFlightSheet}
          onConfirm={() => setPages([])}
          onBack={popPage}
          inert={sheet !== null}
        />
      )}

      {/* Manual-time sheet — used only by v2 pickup's v1 layout, where the
          wheel opens in a sheet rather than inline. */}
      {v2 && (
        <BottomSheet
          open={sheet === 'time'}
          size="small"
          platform="ios"
          title="Pickup time"
          onClose={() => setSheet(null)}
        >
          {sheet === 'time' && (
            <PickupTimeSheet
              time={time ?? DEFAULT_TIME}
              airport={airport}
              onConfirm={confirmTime}
            />
          )}
        </BottomSheet>
      )}

      {/* Flight search — shared across both funnel variants. In v1 it's opened
          from the date & time sheet's Track my flight card; in v2 it's opened
          from the pickup page's flight card. Both close it the same way, so
          one sheet serves both. */}
      <BottomSheet
        open={sheet === 'flights'}
        size="fullscreen"
        platform="ios"
        title="Add your flight"
        onClose={() => {
          setKeyboardOpen(false)
          setSheet(null)
        }}
        search={
          <FlightSearchField
            value={flightQuery}
            onChange={setFlightQuery}
            onFocus={() => setKeyboardOpen(true)}
          />
        }
      >
        {sheet === 'flights' && airport && (
          <FlightSearchSheet
            airport={airport}
            query={flightQuery}
            date={date}
            selectedId={flight?.id}
            keyboardOpen={keyboardOpen}
            onQueryChange={setFlightQuery}
            onDismissKeyboard={() => setKeyboardOpen(false)}
            onSelect={trackFlight}
          />
        )}
      </BottomSheet>

      {/* Offered only at the top of the funnel — which is where an arm gets
          chosen anyway, and the one screen with a free corner: every step below
          it fills the trailing navbar slot with a title or the bottom edge with
          a keyboard. Keeping it off those screens also keeps it out of the way
          when they are being reviewed against the design. */}
      {onVariantChange && screen === 'home' && page === null && sheet === null && (
        <VariantSwitch label="Search" value={variant} onChange={onVariantChange} />
      )}

      <Snackbar message={toast} show={!!toast} onClose={dismissToast} />
    </div>
  )
}
