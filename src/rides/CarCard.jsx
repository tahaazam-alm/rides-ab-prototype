import { Icon } from './icons'
import { VehicleCapacity, VehicleFeatures, VehicleImage } from './Vehicle'

/**
 * A price, always in Riyal. The design system's `Price` isn't used here: this
 * amount is bold rather than semibold, its struck price is muted, and it leads
 * with the Riyal glyph — none of which `Price` exposes.
 */
function CarPrice({ price, wasPrice }) {
  return (
    <p className="car-card__price">
      {wasPrice != null && <s className="car-card__was">{wasPrice}</s>}
      <span className="car-card__amount">
        <Icon name="riyal" size={20} height={23} className="ds-icon" />
        {price}
      </span>
    </p>
  )
}

export function CarCard({ car, cancellation, onSelect }) {
  return (
    <article className="car-card">
      <header className="car-card__head">
        <h3 className="car-card__name">{car.name}</h3>
        <p className="car-card__model">{car.model}</p>
      </header>

      <div className="car-card__pricing">
        {car.promo && <p className="car-card__promo">{car.promo}</p>}
        <CarPrice price={car.price} wasPrice={car.wasPrice} />
      </div>

      <VehicleFeatures car={car} cancellation={cancellation} />

      <div className="car-card__footer">
        <VehicleCapacity seats={car.seats} bags={car.bags} />
        <VehicleImage car={car} />
      </div>

      {/* The whole card is the tap target. A `<button>` can't wrap the heading
          and list above, so it covers them instead and carries the label. */}
      <button type="button" className="car-card__select" onClick={onSelect}>
        <span className="sr-only">Select {car.name}</span>
      </button>
    </article>
  )
}
