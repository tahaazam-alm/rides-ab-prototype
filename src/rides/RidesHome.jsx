import { Button, Navbar, Separator, Stepper, Tag, WidgetField } from 'design-system'
import { Icon } from './icons'
import { UPCOMING } from './data'
import { useLang, useT, useTheme } from '../i18n.jsx'
import flynasLogo from '../assets/flynas-logo.svg'
import heroLightEn from '../assets/headerimg-light-en.png'
import heroDarkEn from '../assets/headerimg-dark-en.png'
import heroLightAr from '../assets/headerimg-light-ar.png'
import heroDarkAr from '../assets/headerimg-dark-ar.png'
import hotelThumb from '../assets/hotel-thumb.jpg'

// (theme, lang) → hero art. Four dedicated PNGs mean dark mode no longer
// leans on a CSS `filter: brightness()` hack; each combination has its own
// composition tuned to the direction the copy reads in.
const HEROES = {
  'light-en': heroLightEn,
  'dark-en': heroDarkEn,
  'light-ar': heroLightAr,
  'dark-ar': heroDarkAr,
}

function UpcomingCard({ booking, onBook }) {
  const t = useT()
  const lang = useLang()
  // Look up the booking's copy through the dict — missing keys fall back to
  // the field on the raw data, so any card that hasn't been localised still
  // renders (in English) rather than blanking.
  const title =
    booking.kind === 'stay'
      ? t(`rides.upcoming.${booking.id}.title`) || booking.title
      : null
  const line2 =
    t(`rides.upcoming.${booking.id}.line2`) === `rides.upcoming.${booking.id}.line2`
      ? booking.line2
      : t(`rides.upcoming.${booking.id}.line2`)
  const line3 =
    t(`rides.upcoming.${booking.id}.line3`) === `rides.upcoming.${booking.id}.line3`
      ? booking.line3
      : t(`rides.upcoming.${booking.id}.line3`)
  const routeFrom =
    booking.kind === 'flight'
      ? t(`rides.upcoming.route.${booking.route[0]}`) === `rides.upcoming.route.${booking.route[0]}`
        ? booking.route[0]
        : t(`rides.upcoming.route.${booking.route[0]}`)
      : null
  const routeTo =
    booking.kind === 'flight'
      ? t(`rides.upcoming.route.${booking.route[1]}`) === `rides.upcoming.route.${booking.route[1]}`
        ? booking.route[1]
        : t(`rides.upcoming.route.${booking.route[1]}`)
      : null

  return (
    <article className="upcoming-card">
      <div className="upcoming-card__row">
        {booking.kind === 'flight' ? (
          <img className="upcoming-card__logo" src={flynasLogo} alt="" />
        ) : (
          <img className="upcoming-card__thumb" src={hotelThumb} alt="" />
        )}

        <div className="upcoming-card__body">
          {booking.kind === 'flight' ? (
            <h3 className="upcoming-card__route">
              <span>{routeFrom}</span>
              <Icon name="airplaneTilt" size={16} className="ds-icon" />
              <span>{routeTo}</span>
            </h3>
          ) : (
            <h3 className="upcoming-card__title">{title}</h3>
          )}
          {/* `dir="auto"` picks direction from the first strong character —
              numeric-heavy strings stay LTR inside an RTL card, translated
              Arabic strings render RTL correctly. */}
          <p className="upcoming-card__meta" dir="auto">{line2}</p>
          <p className="upcoming-card__meta" dir="auto">{line3}</p>
        </div>
      </div>

      <button type="button" className="upcoming-card__link" onClick={onBook}>
        {t('rides.home.bookARide')}
        {/* Direction-aware caret — points forward in the reading direction:
            "→" in LTR, "←" in RTL. */}
        <Icon
          name={lang === 'ar' ? 'chevronLeft' : 'chevronRight'}
          size={16}
          className="ds-icon"
        />
      </button>
    </article>
  )
}

export function RidesHome({
  onBack,
  pickup,
  pickupSubtext,
  destination,
  dateTimeLabel,
  trackingLabel,
  passengers,
  onPassengersChange,
  onEditRoute,
  onEditDateTime,
  onSearch,
  inert,
}) {
  const t = useT()
  const lang = useLang()
  const theme = useTheme()
  const heroSrc = HEROES[`${theme}-${lang}`] ?? HEROES['light-en']
  return (
    // Inert behind an open sheet, so the fields underneath it can't be tabbed to.
    <div className="rides-home" inert={inert}>
      <div className="rides-home__hero">
        <img className="rides-home__hero-img" src={heroSrc} alt="" />
      </div>

      {/* DS Navbar supplies the iOS status bar + glass back button. */}
      <Navbar toolbar={{ variant: 'default', title: t('rides.home.title'), onBack }} />

      <header className="rides-home__intro">
        <div className="rides-home__headline">
          <h1>{t('rides.home.headline')}</h1>
          <Tag label={t('common.new')} variant="success" style="filled" />
        </div>
        <p className="rides-home__tagline">{t('rides.home.tagline')}</p>
      </header>

      <h2 className="rides-home__section">{t('rides.home.bookNow')}</h2>

      <div className="rides-home__form">
        <div className="rides-card">
          <WidgetField
            variant={pickup ? 'populated' : 'empty'}
            label={t('rides.home.pickupLocation')}
            value={pickup || undefined}
            /* A tracked flight knows its terminal, so the widget can name the
               kerb the driver will be waiting at rather than just the airport. */
            subtext={pickupSubtext || undefined}
            icon={<Icon name="target" className="ds-icon" />}
            onPress={() => onEditRoute('pickup')}
          />
          <Separator className="rides-card__rule" />
          <WidgetField
            variant={destination ? 'populated' : 'empty'}
            label={t('rides.home.destination')}
            value={destination || undefined}
            icon={<Icon name="pin" className="ds-icon" />}
            onPress={() => onEditRoute('destination')}
          />
          <Separator className="rides-card__rule" />
          {/* The tag sits over the row rather than inside it: WidgetField has
              no slot for one, and the frame anchors it to the trailing edge of
              the value line, which a flex child can't reach without reflowing
              the value it belongs to. */}
          <div className="rides-card__tagged">
            <WidgetField
              variant={dateTimeLabel ? 'populated' : 'empty'}
              label={t('rides.home.pickupDateTime')}
              value={dateTimeLabel || undefined}
              icon={<Icon name="calendar" className="ds-icon" />}
              onPress={onEditDateTime}
            />
            {trackingLabel && (
              <Tag
                className="rides-card__tag"
                label={trackingLabel}
                variant="success"
                style="tinted"
                trailingIcon={<Icon name="flightDelayed" size={16} className="ds-icon" />}
              />
            )}
          </div>
          <Separator className="rides-card__rule" />
          {/* Composed rather than using Cell's trailing stepper: Cell has its own
              padding/icon tint, which sits 16px inboard of the WidgetField rows
              above it and uses the darker default icon colour. */}
          <div className="passengers">
            <Icon name="usersTwo" className="ds-icon passengers__icon" />
            <span className="passengers__label">{t('rides.home.passengers')}</span>
            <Stepper
              value={passengers}
              min={1}
              max={8}
              onChange={onPassengersChange}
            />
          </div>
        </div>

        <Button variant="primary" label={t('rides.home.searchCars')} onClick={onSearch} />
      </div>

      <section className="rides-home__upcoming">
        <div className="rides-home__eyebrow">
          <span className="rides-home__dot" aria-hidden="true" />
          <span className="eyebrow">{t('rides.home.upcoming')}</span>
        </div>
        <div className="rides-home__cards">
          {UPCOMING.map((booking) => (
            <UpcomingCard
              key={booking.id}
              booking={booking}
              onBook={() => onEditRoute('pickup')}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
