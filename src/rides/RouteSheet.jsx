import { Separator } from 'design-system'
import { Highlight } from './Highlight'
import { Icon } from './icons'
import { Keyboard } from './Keyboard'
import { RouteField } from './RouteField'
import { searchPlaces } from './data'
import { useT } from '../i18n.jsx'

export function RouteSheet({
  pickup,
  destination,
  focused,
  keyboardOpen,
  onFocus,
  onDismissKeyboard,
  onChange,
  onClear,
  onPickSuggestion,
}) {
  const t = useT()
  // `focused` keeps naming the field being edited even after the keyboard is
  // dismissed, so the results list stays put instead of resetting. It also
  // narrows the pool — pickup only shows airports, destination shows the
  // everything-else list.
  const query = focused === 'pickup' ? pickup : destination
  const results = searchPlaces(query, focused)

  // First slot mirrors the raw query the way iOS autocorrect does; the rest are
  // the best-matching place names.
  const wordSuggestions = [
    query.trim() || t('common.search'),
    ...results.slice(0, 2).map((r) => r.title.split(',')[0]),
  ].slice(0, 3)

  const commit = (title) => onPickSuggestion(focused, title)

  return (
    <div className="sheet sheet--route">
      <div className="rides-card rides-card--route">
        <RouteField
          id="pickup"
          label={t('rides.route.pickupLabel')}
          value={pickup}
          icon="target"
          active={keyboardOpen && focused === 'pickup'}
          onFocus={onFocus}
          onChange={onChange}
          onClear={onClear}
        />
        <Separator className="rides-card__rule" />
        <RouteField
          id="destination"
          label={t('rides.route.destinationLabel')}
          value={destination}
          icon="pin"
          active={keyboardOpen && focused === 'destination'}
          onFocus={onFocus}
          onChange={onChange}
          onClear={onClear}
        />
        {/* Dotted connector between the two pins, as in the Figma frame. */}
        <span className="rides-card__connector" aria-hidden="true" />
      </div>

      {/* Full-bleed divider between the widget and the results, per the frame. */}
      <Separator />

      {/* Dragging the list dismisses the keyboard, as iOS does on scroll. */}
      <div
        className="sheet__results"
        onScroll={onDismissKeyboard}
        onWheel={onDismissKeyboard}
        onTouchMove={onDismissKeyboard}
      >
        {results.length > 0 ? (
          results.map((place) => (
            <button
              key={place.title}
              type="button"
              className="suggestion"
              onPointerDown={(e) => { e.preventDefault(); commit(place.title) }}
            >
              <Icon name="pin" size={24} className="ds-icon suggestion__pin" />
              <span className="suggestion__body">
                <span className="suggestion__title">
                  <Highlight text={place.title} query={query} />
                </span>
                <span className="suggestion__subtitle">
                  <Highlight text={place.subtitle} query={query} />
                </span>
              </span>
              <span className="suggestion__distance">{place.distance}</span>
            </button>
          ))
        ) : (
          <p className="sheet__hint" style={{ whiteSpace: 'pre-line' }}>
            {t('rides.route.hint')}
          </p>
        )}
      </div>

      {keyboardOpen && (
        <Keyboard
          suggestions={wordSuggestions}
          empty={query.length === 0}
          onKey={(ch) => onChange(focused, query + ch)}
          onBackspace={() => onChange(focused, query.slice(0, -1))}
          onSubmit={() => results[0] && commit(results[0].title)}
          onSuggestion={(word) => {
            const match = results.find((r) => r.title.startsWith(word))
            if (match) commit(match.title)
            else onChange(focused, word)
          }}
        />
      )}
    </div>
  )
}
