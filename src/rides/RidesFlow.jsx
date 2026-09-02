import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { BottomSheet, Snackbar } from 'design-system'
import { RidesHome } from './RidesHome'
import { RidesResults } from './RidesResults'
import { RidesReview } from './RidesReview'
import { RouteSheet } from './RouteSheet'
import { DateTimeSheet } from './DateTimeSheet'
import { FlightPromptSheet } from './FlightPromptSheet'
import { FlightSearchField, FlightSearchSheet } from './FlightSearchSheet'
import { TODAY, findAirport, formatDate, formatTime } from './data'
import { useCalendarLabels, useT } from '../i18n.jsx'
import './rides.css'

const DEFAULT_TIME = { hour: 12, minute: 30, meridiem: 'PM' }

/**
 * The Rides funnel, in two variants under A/B test.
 *
 * Both describe the same trip and share the home screen, the results, and the
 * review — the test is only about *when* the flight-tracking question is
 * asked. Both variants use the same sheet-based navigation:
 *
 *   v1  The date & time sheet carries a "Track my flight" card alongside the
 *       date and time pickers. Flight tracking is a commitment that gets made
 *       up front, before the traveller sees car prices.
 *   v2  The date & time sheet only asks for date and time. After the
 *       traveller has picked a specific car in the results screen, a small
 *       "Add your flight" sheet slides up and offers tracking — or Skip
 *       straight to review.
 *
 * The trip itself lives here rather than in either variant, so flipping
 * between them mid-booking keeps everything already filled in and the two
 * arms are compared on the same trip.
 */
export function RidesFlow({
  variant = 'v1',
  onVariantChange,
  onExit,
}) {
  const t = useT()
  const { months } = useCalendarLabels()
  const v2 = variant === 'v2'

  const [screen, setScreen] = useState('home') // 'home' | 'results' | 'review'
  const [car, setCar] = useState(null)
  /**
   * Which sheet is on-screen.
   *   'route'          — route picker (both variants)
   *   'datetime'       — date & time picker (both variants)
   *   'flight-prompt'  — v2 only: post-car-selection prompt
   *   'flights'        — flight search — opened from v1's datetime sheet or
   *                      v2's flight prompt
   */
  const [sheet, setSheet] = useState(null)
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

  const [flight, setFlight] = useState(null)
  const [flightQuery, setFlightQuery] = useState('')

  /**
   * True while a sheet's open/close animation is playing. `useLayoutEffect`
   * flips it synchronously with the state change so the widget stays inert
   * before the browser dispatches the trailing click of the tap that closed
   * the sheet — otherwise that click, dispatched at a position the widget now
   * occupies (with pointer-events: auto), reopens the sheet in a loop.
   *
   * A ref-mirrored copy runs in parallel: the widget's tap handlers guard
   * against it synchronously, so even if React batching or `inert` propagation
   * lags a frame, a bleed-through click still hits the guard first.
   */
  const [sheetTransitioning, setSheetTransitioning] = useState(false)
  const sheetLockRef = useRef(false)
  const initialSheetMountRef = useRef(true)
  useLayoutEffect(() => {
    if (initialSheetMountRef.current) {
      initialSheetMountRef.current = false
      return
    }
    sheetLockRef.current = true
    setSheetTransitioning(true)
    // Sheet transitions on the DS BottomSheet run 350ms; a small buffer lets
    // the trailing click clear before we unlock the widget.
    const id = setTimeout(() => {
      sheetLockRef.current = false
      setSheetTransitioning(false)
    }, 400)
    return () => clearTimeout(id)
  }, [sheet])

  /**
   * Switching arms mid-booking keeps the trip but drops the traveller back on
   * the home screen — both variants share the widget, so this is the one
   * screen guaranteed to render either arm cleanly. Adjusted during render
   * rather than in an effect, so the new arm's first paint is already
   * correct.
   */
  const [arm, setArm] = useState(variant)
  if (arm !== variant) {
    setArm(variant)
    setScreen('home')
    setSheet(null)
    setKeyboardOpen(false)
  }

  // The DS Snackbar restarts its dismiss timer whenever `onClose` changes
  // identity, so an inline arrow here would keep the toast up for as long as
  // the user keeps touching the screen.
  const dismissToast = useCallback(() => setToast(''), [])

  // The pickup airport, when the pickup is one. This single lookup is what
  // opens the flight-tracking branch — everything downstream keys off it.
  const airport = findAirport(pickup)

  // Show whatever is known rather than nothing: the traveller can leave the
  // date & time sheet mid-answer, and losing what they just picked would
  // read as the tap not having registered.
  const dateTimeLabel = date
    ? time
      ? `${formatDate(date, months)}, ${formatTime(time)}`
      : formatDate(date, months)
    : ''

  const focusField = (field) => {
    setFocused(field)
    setKeyboardOpen(true)
  }

  const openRoute = (field) => {
    // Guard bleed-through clicks on the widget: only trip when the widget
    // was the entry point (sheet was null). A call from any other origin
    // has its own chrome and shouldn't be gated on the widget's animation.
    if (sheet === null && sheetLockRef.current) return
    focusField(field)
    setSheet('route')
  }

  const openDateTime = () => {
    // Guard against a widget-origin bleed-through click — the sheet=null
    // check keeps the wizard chain from commitRoute (sheet === 'route')
    // sailing through even mid-transition.
    if (sheet === null && sheetLockRef.current) return
    // Fresh entry (no answer yet): calendar expanded on the date question.
    // Re-entry with a committed answer (a manual time or a tracked flight)
    // opens with both cards collapsed to summary rows — the traveller can
    // review what they already picked and tap into either card to edit it.
    const hasAnswer = !!(time || flight)
    setStep(hasAnswer ? null : 'date')
    const anchor = date ?? TODAY
    setView({ year: anchor.year, month: anchor.month })

    if (sheet === null) {
      setSheet('datetime')
      return
    }

    // Chained from a route commit — the route sheet is still open. Wait for
    // its `.bottom-sheet__panel` to finish sliding down before opening the
    // date & time sheet: the DS panel transition only plays when the browser
    // sees the closed frame before the open frame, and firing both state
    // changes in the same commit skips that closed frame (the incoming panel
    // ends up stuck at translateY(100%)). Listening for the actual DOM
    // `transitionend` is bulletproof compared to guessing a delay — the
    // fallback timeout only exists in case the transition never fires
    // (prefers-reduced-motion strips it, for example).
    const outgoingPanel = document.querySelector(
      '.bottom-sheet--open .bottom-sheet__panel',
    )
    setSheet(null)
    if (!outgoingPanel) {
      setSheet('datetime')
      return
    }
    let done = false
    const finish = () => {
      if (done) return
      done = true
      outgoingPanel.removeEventListener('transitionend', onTransitionEnd)
      clearTimeout(safety)
      setSheet('datetime')
    }
    const onTransitionEnd = (e) => {
      if (e.target !== outgoingPanel || e.propertyName !== 'transform') return
      finish()
    }
    outgoingPanel.addEventListener('transitionend', onTransitionEnd)
    // DS panel transition is 0.35s; the safety net trips a hair past that so
    // the wizard never stalls if the event is somehow missed.
    const safety = setTimeout(finish, 500)
  }

  /**
   * A route field was filled in. If the other leg is still empty the sheet
   * stays open with focus flipped to it — a wizard that keeps the traveller
   * inside the current step until the whole route is answered.
   *
   * Once both legs are described, what happens next depends on whether the
   * trip already has a pickup time:
   *
   *   Fresh trip (no time, no flight) — chain into the date & time sheet.
   *     This is the wizard the empty widget was designed to walk the
   *     traveller through.
   *
   *   Trip already timed              — close the sheet and drop back to
   *     the widget. The traveller was editing the route on an otherwise
   *     complete trip; routing them through the wizard again would ask them
   *     to reconfirm answers they've already given.
   */
  const commitRoute = (field, value) => {
    const next = { pickup, destination, [field]: value }
    if (field === 'pickup') setPickup(value)
    else setDestination(value)

    if (!next.pickup || !next.destination) {
      focusField(next.pickup ? 'destination' : 'pickup')
      return
    }

    setKeyboardOpen(false)

    if (time || flight) {
      setSheet(null)
      return
    }

    openDateTime()
  }

  const openFlightSheet = () => {
    setFlightQuery('')
    setKeyboardOpen(true)
    setSheet('flights')
  }

  /**
   * Picking a flight commits it to the trip and continues the flow to the
   * spot the traveller was coming from:
   *
   *   v1 — the flight sheet was opened from the date & time sheet's "Track
   *     my flight" card. Commit the flight, close the sheet, drop back to
   *     the widget which now shows the tracking tag.
   *   v2 — the flight sheet was opened from the post-car-selection prompt.
   *     Commit the flight and advance to the review screen (screen state
   *     tells us which case we're in).
   */
  const trackFlight = (picked) => {
    setFlight(picked)
    setTime(picked.arrive)
    setKeyboardOpen(false)
    setSheet(null)
    if (screen === 'results') setScreen('review')
  }

  // The CTA only leaves the home screen once the whole trip is described —
  // otherwise it names the leg that is still missing rather than searching.
  const searchCars = () => {
    if (!pickup || !destination) {
      setToast(t('rides.toast.addRoute'))
      return
    }
    if (!date || !time) {
      setToast(t('rides.toast.addDateTime'))
      return
    }
    setScreen('results')
  }

  /**
   * The traveller picked a car in the results screen.
   *   v1 — go straight to review; flight tracking (if any) was set upstream.
   *   v2 — surface the "Add your flight" prompt sheet. Skip or a picked
   *     flight both close it and continue to review.
   */
  const selectCar = (picked) => {
    setCar(picked)
    if (v2 && airport) {
      setSheet('flight-prompt')
      return
    }
    setScreen('review')
  }

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
        trackingLabel={
          flight
            ? `${t('rides.home.tracking')} ${flight.number.replace(' ', '')}`
            : ''
        }
        passengers={passengers}
        onPassengersChange={setPassengers}
        onEditRoute={openRoute}
        onEditDateTime={openDateTime}
        onSearch={searchCars}
        inert={
          sheet !== null ||
          sheetTransitioning ||
          screen !== 'home'
        }
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
          onSelectCar={selectCar}
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
            setToast(
              `${t('rides.toast.thanks')} ${firstName} ${t('rides.toast.thanksSuffix')}`,
            )
          }
        />
      )}

      {/* ---------- Route sheet — shared by both variants ---------- */}

      <BottomSheet
        open={sheet === 'route'}
        size="fullscreen"
        platform="ios"
        title={t('rides.route.title')}
        onClose={() => setSheet(null)}
      >
        {sheet === 'route' && <RouteSheet {...routeProps} />}
      </BottomSheet>

      {/* ---------- Date & time sheet — shared, `hideFlight` on v2 ---------- */}

      <BottomSheet
        open={sheet === 'datetime'}
        size="fullscreen"
        platform="ios"
        title={v2 ? t('rides.dateTime.titleV2') : t('rides.dateTime.titleV1')}
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
              if (!time) setTime(DEFAULT_TIME)
              setStep('time')
            }}
            onTimeChange={setTime}
            onTrackFlight={openFlightSheet}
            onRemoveFlight={() => setFlight(null)}
            onAdvanceToTime={() => {
              // Advance to the time section without touching flight —
              // a traveller reopened the calendar and just wants to go
              // back to the answer they already gave. If they tapped the
              // placeholder on first landing (no date picked yet), seed
              // one so the Confirm bar reads cleanly; they can always
              // reopen the calendar and change it.
              if (!date) setDate({ ...TODAY, day: 15 })
              if (!time) setTime(DEFAULT_TIME)
              setStep('time')
            }}
            onConfirm={() => setSheet(null)}
            hideFlight={v2}
          />
        )}
      </BottomSheet>

      {/* ---------- v2 only: post-car-selection flight prompt ---------- */}

      <BottomSheet
        open={sheet === 'flight-prompt'}
        size="medium"
        platform="ios"
        onClose={() => {
          // Dismissing without answering cancels the car selection — dropping
          // the traveller back on the results with nothing committed feels
          // safer than silently sending them to review under one interpretation
          // of a tap that could have been misaimed.
          setSheet(null)
          setCar(null)
        }}
      >
        {sheet === 'flight-prompt' && (
          <FlightPromptSheet
            onOpenSearch={openFlightSheet}
            onSkip={() => {
              setSheet(null)
              setScreen('review')
            }}
          />
        )}
      </BottomSheet>

      {/* Flight search — shared across variants. In v1 it's opened from the
          date & time sheet's "Track my flight" card; in v2 it's opened from
          the post-car-selection prompt. Both close it the same way. */}
      <BottomSheet
        open={sheet === 'flights'}
        size="fullscreen"
        platform="ios"
        title={t('rides.flightSearch.title')}
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

      <Snackbar message={toast} show={!!toast} onClose={dismissToast} />
    </div>
  )
}
