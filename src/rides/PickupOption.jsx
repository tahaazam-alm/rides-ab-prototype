import { Tag } from 'design-system'
import { Icon } from './icons'

/**
 * One answer to "When should we pick you up?" — a bordered card holding a glyph,
 * a title, and the trade-off spelled out underneath.
 *
 * The description is the whole point of the card: both options produce a pickup
 * time, so the only thing separating them is what happens when the flight slips.
 * Saying that on the card is what lets someone choose without tapping into both.
 */
export function PickupOption({ icon, title, description, tag, onSelect }) {
  return (
    <button type="button" className="pickup-option" onClick={onSelect}>
      <Icon name={icon} className="ds-icon pickup-option__icon" />

      <span className="pickup-option__body">
        <span className="pickup-option__head">
          <span className="pickup-option__title">{title}</span>
          {tag && <Tag label={tag} variant="success" style="tinted" />}
        </span>
        <span className="pickup-option__description">{description}</span>
      </span>
    </button>
  )
}
