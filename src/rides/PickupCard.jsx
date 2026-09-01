import { Tag } from 'design-system'
import { Icon } from './icons'

/**
 * A tappable answer to "When should we pick you up?", the picker expanding
 * inside the chosen card.
 *
 * The v2-pickup counterpart to v1's `PickupOption` (which opens its picker in
 * a sheet). Same question, no radio: the card is the target, its aqua border
 * and expanded body are the selection state. Only the header is a button —
 * wrapping the whole card would count every drag of the time wheel as a click
 * on the option.
 */
export function PickupCard({
  icon,
  title,
  description,
  tag,
  selected,
  onSelect,
  children,
}) {
  return (
    <div className={`pickup-card${selected ? ' pickup-card--selected' : ''}`}>
      <button type="button" className="pickup-card__head" onClick={onSelect}>
        <Icon name={icon} className="ds-icon pickup-card__icon" />

        <span className="pickup-card__content">
          <span className="pickup-card__head-row">
            <span className="pickup-card__title">{title}</span>
            {tag && <Tag label={tag} variant="success" style="tinted" />}
          </span>
          {description && (
            <span className="pickup-card__description">{description}</span>
          )}
        </span>
      </button>

      {selected && children && (
        <div className="pickup-card__expanded">{children}</div>
      )}
    </div>
  )
}
