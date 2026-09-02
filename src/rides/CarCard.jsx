import { Icon } from './icons'
import { VehicleCapacity, VehicleFeatures, VehicleImage } from './Vehicle'
import { useT } from '../i18n.jsx'

// Fall through the dict on a missing key so a car without a translation still
// renders (in English) rather than exposing the raw dot-path.
const localise = (t, key, fallback) => {
  const v = t(key)
  return v === key ? fallback : v
}

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
  const t = useT()
  const name = localise(t, `rides.car.${car.id}.name`, car.name)
  const model = localise(t, `rides.car.${car.id}.model`, car.model)
  const promo = car.promo ? localise(t, `rides.car.${car.id}.promo`, car.promo) : null
  return (
    <article className="car-card">
      <header className="car-card__head">
        <h3 className="car-card__name">{name}</h3>
        <p className="car-card__model">{model}</p>
      </header>

      <div className="car-card__pricing">
        {promo && <p className="car-card__promo">{promo}</p>}
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
        <span className="sr-only">{t('rides.review.selectCar')} {name}</span>
      </button>
    </article>
  )
}
