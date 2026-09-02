import { Separator, Tag } from 'design-system'
import { Icon } from './icons'
import { VehicleCapacity, VehicleFeatures, VehicleImage } from './Vehicle'
import { useT } from '../i18n.jsx'

function TimeRow({ label, dateTimeLabel, trackingLabel }) {
  return (
    <div className="review-leg review-leg--time">
      <Icon name="calendar" size={24} className="ds-icon review-leg__icon" />
      <div className="review-leg__body">
        <p className="review-leg__label">{label}</p>
        <p className="review-leg__value">{dateTimeLabel}</p>
      </div>
      {trackingLabel && (
        <Tag
          className="review-leg__track"
          label={trackingLabel}
          variant="success"
          style="tinted"
          trailingIcon={
            <Icon name="flightDelayed" size={16} className="ds-icon" />
          }
        />
      )}
    </div>
  )
}

function PlaceRow({ icon, label, place, address }) {
  return (
    <div className="review-leg">
      <Icon name={icon} size={24} className="ds-icon review-leg__icon" />
      <div className="review-leg__body">
        <p className="review-leg__label">{label}</p>
        <p className="review-leg__place">{place}</p>
        {address && <p className="review-leg__address">{address}</p>}
      </div>
    </div>
  )
}

/**
 * What the traveller is about to book: the car they picked, what it includes,
 * and the itinerary — pickup time, from, to. The pickup date row carries the
 * flight-tracking tag when one is set, so the traveller sees at a glance
 * which flight the pickup is timed against.
 */
export function ReviewSummary({
  car,
  cancellation,
  pickup,
  pickupAddress,
  destination,
  destinationAddress,
  dateTimeLabel,
  trackingLabel,
  onViewDetails,
}) {
  const t = useT()
  // Fall through the dict so an unlocalised car still renders its raw name.
  const localise = (key, fallback) => {
    const v = t(key)
    return v === key ? fallback : v
  }
  const carName = localise(`rides.car.${car.id}.name`, car.name)
  const carModel = localise(`rides.car.${car.id}.model`, car.model)
  return (
    <section className="review-card">
      <div className="review-trip__head">
        <div className="review-trip__lead">
          <p className="review-trip__kicker">{t('rides.review.airportPickup')}</p>
          <h2 className="review-trip__name">{carName}</h2>
          <p className="review-trip__model">{carModel}</p>
          <VehicleCapacity seats={car.seats} bags={car.bags} />
        </div>
        <VehicleImage car={car} />
      </div>

      <Separator />

      <VehicleFeatures
        car={car}
        cancellation={cancellation}
        meetAndGreetLabel={t('rides.review.meetGreetIncluded')}
      />

      <Separator />

      <div className="review-trip__itinerary">
        <TimeRow
          label={t('rides.review.pickupDateAndTime')}
          dateTimeLabel={dateTimeLabel}
          trackingLabel={trackingLabel}
        />
        {/* Route rows share a dashed connector between the two icons — the
            same visual grammar the widget's route card uses on the home
            screen, so the itinerary reads as one journey. */}
        <div className="review-trip__route">
          <PlaceRow
            icon="target"
            label={t('rides.review.from')}
            place={pickup}
            address={pickupAddress}
          />
          <PlaceRow
            icon="pin"
            label={t('rides.review.to')}
            place={destination}
            address={destinationAddress}
          />
          <span className="review-trip__connector" aria-hidden="true" />
        </div>
      </div>

      <Separator />

      <button type="button" className="review-trip__more" onClick={onViewDetails}>
        {t('common.viewMoreDetails')}
        <Icon name="chevronRight" size={16} className="ds-icon" />
      </button>
    </section>
  )
}
