import { Icon } from './icons'
import { CAR_IMAGES } from './carImages'
import { useT } from '../i18n.jsx'

/**
 * The three vehicle atoms shared by the results card and the review summary:
 * the seats/bags pill, the feature list, and the cutout itself.
 */

export function VehicleCapacity({ seats, bags }) {
  const t = useT()
  return (
    <p className="vehicle-capacity">
      <span className="vehicle-capacity__item">
        <Icon name="passengers" size={12} className="ds-icon" />
        {seats}
        <span className="sr-only">{t('rides.review.passengersA11y')}</span>
      </span>
      <span className="vehicle-capacity__rule" aria-hidden="true" />
      <span className="vehicle-capacity__item">
        <Icon name="luggage" size={12} className="ds-icon" />
        {bags}
        <span className="sr-only">{t('rides.review.bagsA11y')}</span>
      </span>
    </p>
  )
}

function Feature({ icon, tone, children }) {
  return (
    <li className={`vehicle-feature${tone ? ` vehicle-feature--${tone}` : ''}`}>
      <Icon name={icon} size={16} className="ds-icon" />
      <span>{children}</span>
    </li>
  )
}

/**
 * `meetAndGreetLabel` differs between screens — the results card lists the perk
 * ("Meet & Greet"), the review confirms it ("Meet & Greet included").
 */
export function VehicleFeatures({ car, cancellation, meetAndGreetLabel }) {
  const t = useT()
  const meetGreetDefault = t('rides.results.meetGreet')
  return (
    <ul className="vehicle-features">
      <Feature icon="cancellation" tone="success">
        {t('rides.results.freeCancellation')} {cancellation}
      </Feature>
      {car.meetAndGreet && (
        <Feature icon="meetGreet">{meetAndGreetLabel ?? meetGreetDefault}</Feature>
      )}
      {car.arabicSpeakingDriver && (
        <Feature icon="driverLang">{t('rides.results.arabicSpeakingDriver')}</Feature>
      )}
      {car.childSeat && (
        <Feature icon="childSeat">{t('rides.results.childSeatAvailable')}</Feature>
      )}
    </ul>
  )
}

export function VehicleImage({ car }) {
  return (
    // The cutouts all face right; the design has them facing into the card.
    <div className="vehicle-img" style={{ '--car-width': `${car.width}px` }}>
      <img src={CAR_IMAGES[car.image]} alt="" />
    </div>
  )
}
