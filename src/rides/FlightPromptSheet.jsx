import illustrationLight from '../assets/flight-light-mode.svg'
import illustrationDark from '../assets/flight-dark-mode.svg'
import { Icon } from './icons'
import { useT } from '../i18n.jsx'

/**
 * v2's "Add your flight" prompt — a medium bottom sheet that slides up over
 * the results screen the moment the traveller picks a car. Instead of asking
 * for flight tracking on the date & time sheet (as v1 does), v2 defers the
 * question until the car is picked and the traveller has the strongest
 * intent to commit; at that point the sheet spells out what tracking buys
 * them and lets them either type a flight number in or skip.
 *
 * The search field is a tap target rather than a live input — tapping it
 * hands off to the fullscreen flight search sheet, which already carries the
 * keyboard, filter and results list. Skip continues straight to review with
 * no flight on the trip.
 */
export function FlightPromptSheet({ onOpenSearch, onSkip }) {
  const t = useT()
  return (
    <div className="flight-prompt">
      <div className="flight-prompt__illustration">
        {/* Two art versions — the DS's `[data-theme]` attribute on the root
            hides the wrong one via CSS below, so the illustration flips with
            the app theme without a JS round-trip. */}
        <img
          src={illustrationLight}
          className="flight-prompt__illustration-art flight-prompt__illustration-art--light"
          alt=""
        />
        <img
          src={illustrationDark}
          className="flight-prompt__illustration-art flight-prompt__illustration-art--dark"
          alt=""
        />
      </div>

      <h2 className="flight-prompt__title">{t('rides.flightPrompt.title')}</h2>

      <ul className="flight-prompt__benefits">
        <li className="flight-prompt__benefit">
          <Icon name="pin" size={20} className="ds-icon flight-prompt__benefit-icon" />
          <span>{t('rides.flightPrompt.benefit1')}</span>
        </li>
        <li className="flight-prompt__benefit">
          <Icon name="clock" size={20} className="ds-icon flight-prompt__benefit-icon" />
          <span>{t('rides.flightPrompt.benefit2')}</span>
        </li>
      </ul>

      {/* Tapping the field opens the fullscreen flight-search sheet — the
          field itself isn't editable here, it's just the entry point. */}
      <button
        type="button"
        className="flight-prompt__search"
        onClick={onOpenSearch}
      >
        <Icon
          name="maginfyingGlass"
          size={20}
          className="ds-icon flight-prompt__search-icon"
        />
        <span className="flight-prompt__search-placeholder">
          {t('rides.flightPrompt.placeholder')}
        </span>
      </button>

      <button type="button" className="flight-prompt__skip" onClick={onSkip}>
        {t('common.skip')}
      </button>
    </div>
  )
}
