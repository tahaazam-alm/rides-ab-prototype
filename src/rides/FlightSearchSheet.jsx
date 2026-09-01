import { useEffect, useRef } from 'react'
import { Chip, Search } from 'design-system'
import { FlightCard } from './FlightCard'
import { Keyboard } from './Keyboard'
import { searchFlights } from './data'

/**
 * The sheet's search field. The on-screen keyboard below is the input surface,
 * so the device's own keyboard is suppressed and both previews stay identical —
 * the same thing `RouteField` does with `inputMode="none"`. Set on the node
 * because the design system's Search spreads leftover props onto its root, not
 * onto the input.
 */
export function FlightSearchField({ value, onChange, onFocus }) {
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.querySelector('input')?.setAttribute('inputmode', 'none')
  }, [])

  return (
    <div ref={ref} onFocus={onFocus}>
      <Search
        value={value}
        placeholder="Airline, flight number or city"
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
  const results = searchFlights(query, airport.airport)

  // Same shape as the route sheet's: the raw query first, the way iOS autocorrect
  // mirrors what you typed, then the carriers it matched.
  const suggestions = [
    query.trim() || 'Flight',
    ...[...new Set(results.map((f) => f.airlineName))].slice(0, 2),
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
        {/* The filter surface behind this chip isn't designed yet, so the row is
            the frame's trigger and nothing behind it — as on the results screen. */}
        <div className="flight-filter">
          <span className="flight-filter__label">Filter by</span>
          <Chip label="Origin airport" dropdown />
        </div>

        <p className="eyebrow flight-results__count">
          {results.length} {results.length === 1 ? 'flight' : 'flights'} to{' '}
          {airport.city} ({airport.airport})
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
          <p className="sheet__hint">
            No flights match that search.
            <br />
            Try the airline, the flight number, or where you&rsquo;re flying from.
          </p>
        )}
      </div>

      {keyboardOpen && (
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
