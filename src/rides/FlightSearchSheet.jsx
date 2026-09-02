import { useEffect, useRef } from 'react'
import { Chip, Search } from 'design-system'
import { FlightCard } from './FlightCard'
import { Icon } from './icons'
import { Keyboard } from './Keyboard'
import { searchFlights } from './data'
import { useIsMobile } from './useIsMobile'
import { useT } from '../i18n.jsx'

/**
 * The sheet's search field. The on-screen keyboard below is the input surface,
 * so the device's own keyboard is suppressed and both previews stay identical —
 * the same thing `RouteField` does with `inputMode="none"`. Set on the node
 * because the design system's Search spreads leftover props onto its root, not
 * onto the input.
 */
export function FlightSearchField({ value, onChange, onFocus }) {
  const t = useT()
  const isMobile = useIsMobile()
  const ref = useRef(null)

  useEffect(() => {
    // On desktop the in-app on-screen keyboard is the input surface, so
    // suppress the device's own keyboard. On mobile leave the attribute off
    // so the native keyboard opens as travellers expect.
    const input = ref.current?.querySelector('input')
    if (!input) return
    if (isMobile) input.removeAttribute('inputmode')
    else input.setAttribute('inputmode', 'none')
  }, [isMobile])

  // Autofocus on mount — the sheet mounts as a direct result of the "Track
  // flight" tap, so the field lands ready to type. onFocus() is fired
  // explicitly so the desktop visual keyboard opens even if `.focus()` is
  // preempted by the sheet's slide-in transition. Also nudged inside a
  // rAF so the input has been laid out before the caret lands.
  useEffect(() => {
    const input = ref.current?.querySelector('input')
    if (!input) return
    const raf = requestAnimationFrame(() => {
      input.focus({ preventScroll: true })
      onFocus?.()
    })
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} onFocus={onFocus}>
      <Search
        value={value}
        placeholder={t('rides.flightSearch.placeholder')}
        onChange={(e) => onChange(e.target.value)}
        onClear={() => onChange('')}
      />
    </div>
  )
}

/**
 * The tracking half of the fork. Only flights *landing* at the pickup airport
 * are searchable — the traveller is being collected from their arrival, so a
 * departure out of the same airport can never be the flight they mean.
 */
export function FlightSearchSheet({
  airport,
  query,
  date,
  selectedId,
  keyboardOpen,
  onQueryChange,
  onDismissKeyboard,
  onSelect,
}) {
  const t = useT()
  const isMobile = useIsMobile()
  const hasQuery = query.trim().length > 0
  const results = searchFlights(query, airport.airport)

  // Fall through the dict on a missing key so unknown cities/airlines still
  // render their raw English string rather than exposing a raw dot-path.
  const localise = (key, fallback) => {
    const v = t(key)
    return v === key ? fallback : v
  }
  const cityLabel = localise(`rides.city.${airport.city}`, airport.city)

  // Same shape as the route sheet's: the raw query first, the way iOS autocorrect
  // mirrors what you typed, then the carriers it matched (localised).
  const suggestions = [
    query.trim() || t('rides.flightSearch.flightWord'),
    ...[
      ...new Set(
        results.map((f) => localise(`rides.airline.${f.airlineName}`, f.airlineName)),
      ),
    ].slice(0, 2),
  ].slice(0, 3)

  return (
    <div className="sheet sheet--flights">
      {/* Dragging the list dismisses the keyboard, as iOS does on scroll. */}
      <div
        className="sheet__results sheet__results--flights"
        onScroll={onDismissKeyboard}
        onWheel={onDismissKeyboard}
        onTouchMove={onDismissKeyboard}
      >
        {!hasQuery ? (
          // Pre-query empty state — the sheet opens with nothing typed yet, so
          // instead of dumping every inbound flight we prompt the traveller for
          // input. Filter row + count are suppressed to match the frame.
          <div className="flight-empty">
            <span className="flight-empty__icon" aria-hidden="true">
              <Icon name="maginfyingGlass" size={24} className="ds-icon" />
            </span>
            <p className="flight-empty__caption">
              {t('rides.flightSearch.emptyStart')}
            </p>
          </div>
        ) : (
          <>
            {/* The filter surface behind this chip isn't designed yet, so the row
                is the frame's trigger and nothing behind it — as on the results
                screen. */}
            <div className="flight-filter">
              <span className="flight-filter__label">
                {t('rides.flightSearch.filterBy')}
              </span>
              <Chip label={t('rides.flightSearch.originAirport')} dropdown />
            </div>

            <p className="eyebrow flight-results__count">
              {results.length}{' '}
              {results.length === 1
                ? t('rides.flightSearch.flightTo')
                : t('rides.flightSearch.flightsTo')}{' '}
              {/* Isolate the city + airport so an RTL container doesn't split
                  "Dubai (DXB)" (or its Arabic equivalent) into separately
                  positioned runs. */}
              <bdi>{cityLabel} ({airport.airport})</bdi>
            </p>

            {results.length > 0 ? (
              results.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  date={date}
                  selected={flight.id === selectedId}
                  onSelect={() => onSelect(flight)}
                />
              ))
            ) : (
              <p className="sheet__hint" style={{ whiteSpace: 'pre-line' }}>
                {t('rides.flightSearch.emptyResults')}
                {'\n'}
                {t('rides.flightSearch.emptyHint')}
              </p>
            )}
          </>
        )}
      </div>

      {/* On mobile the OS keyboard is the input surface, so we skip our own
          fake keyboard. `keyboardOpen` still governs focus behaviour above. */}
      {keyboardOpen && !isMobile && (
        <Keyboard
          suggestions={suggestions}
          empty={query.length === 0}
          onKey={(ch) => onQueryChange(query + ch)}
          onBackspace={() => onQueryChange(query.slice(0, -1))}
          onSubmit={() => results[0] && onSelect(results[0])}
          onSuggestion={(word) => onQueryChange(word)}
        />
      )}
    </div>
  )
}
