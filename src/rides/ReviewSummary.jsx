import { Separator } from 'design-system'
import { Icon } from './icons'
import { VehicleCapacity, VehicleFeatures, VehicleImage } from './Vehicle'

function Leg({ icon, label, place, detail }) {
  return (
    <div className="review-leg">
      <Icon name={icon} size={24} className="ds-icon review-leg__icon" />
      <div className="review-leg__body">
        <p className="review-leg__label">{label}</p>
        <p className="review-leg__place">{place}</p>
        {detail && <p className="review-leg__detail">{detail}</p>}
      </div>
    </div>
  )
}

/**
 * What the traveller is about to book: the car they picked, what it includes,
 * and the two ends of the journey.
 */
export function ReviewSummary({
  car,
  cancellation,
  pickup,
  pickupLabel,
  terminal,
  destination,
  onViewDetails,
}) {
  return (
    <section className="review-card">
      <div className="review-trip__head">
        <div className="review-trip__lead">
          <p className="review-trip__kicker">Your airport pick up</p>
          <h2 className="review-trip__name">{car.name}</h2>
          <p className="review-trip__model">{car.model}</p>
          <VehicleCapacity seats={car.seats} bags={car.bags} />
        </div>
        <VehicleImage car={car} />
      </div>

      <Separator />

      <VehicleFeatures
        car={car}
        cancellation={cancellation}
        meetAndGreetLabel="Meet & Greet included"
      />

      <Separator />

      <div className="review-trip__legs">
        <Leg
          icon="airplaneTilt"
          label={`Pickup at ${pickupLabel}`}
          place={pickup}
          detail={terminal}
        />
        <Leg icon="pin" label="Drop-off" place={destination} />
      </div>

      <Separator />

      <button type="button" className="review-trip__more" onClick={onViewDetails}>
        View more details
        <Icon name="chevronRight" size={16} className="ds-icon" />
      </button>
    </section>
  )
}
