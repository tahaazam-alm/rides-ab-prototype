import { Button, Navbar, Separator, Stepper, Tag, WidgetField } from 'design-system'
import { Icon } from './icons'
import { UPCOMING } from './data'
import flynasLogo from '../assets/flynas-logo.svg'
import heroImg from '../assets/rides-hero.png'
import hotelThumb from '../assets/hotel-thumb.jpg'

function UpcomingCard({ booking, onBook }) {
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
              <span>{booking.route[0]}</span>
              <Icon name="airplaneTilt" size={16} className="ds-icon" />
              <span>{booking.route[1]}</span>
            </h3>
          ) : (
            <h3 className="upcoming-card__title">{booking.title}</h3>
          )}
          <p className="upcoming-card__meta">{booking.line2}</p>
          <p className="upcoming-card__meta">{booking.line3}</p>
        </div>
      </div>

      <button type="button" className="upcoming-card__link" onClick={onBook}>
        Book a ride
        <Icon name="chevronRight" size={16} className="ds-icon" />
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
  return (
    // Inert behind an open sheet, so the fields underneath it can't be tabbed to.
    <div className="rides-home" inert={inert}>
      <div className="rides-home__hero">
        <img className="rides-home__hero-img" src={heroImg} alt="" />
      </div>

      {/* DS Navbar supplies the iOS status bar + glass back button. */}
      <Navbar toolbar={{ variant: 'default', title: 'Rides', onBack }} />

      <header className="rides-home__intro">
        <div className="rides-home__headline">
          <h1>Rides for every journey</h1>
          <Tag label="New" variant="success" style="filled" />
        </div>
        <p className="rides-home__tagline">Airport rides • Within City • Hourly</p>
      </header>

      <h2 className="rides-home__section">Book a ride now</h2>

      <div className="rides-home__form">
        <div className="rides-card">
          <WidgetField
            variant={pickup ? 'populated' : 'empty'}
            label="Pickup location"
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
            label="Destination"
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
              label="Pickup date & time"
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
            <span className="passengers__label">Passengers</span>
            <Stepper
              value={passengers}
              min={1}
              max={8}
              onChange={onPassengersChange}
            />
          </div>
        </div>

        <Button variant="primary" label="Search cars" onClick={onSearch} />
      </div>

      <section className="rides-home__upcoming">
        <div className="rides-home__eyebrow">
          <span className="rides-home__dot" aria-hidden="true" />
          <span className="eyebrow">for your upcoming Bookings</span>
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
