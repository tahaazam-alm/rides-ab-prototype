import { SegmentedControl } from 'design-system'

const DEFAULT_VARIANTS = ['v1', 'v2']

/**
 * Prototype-only control for flipping between variants. In production these come
 * from the experiment platform and nobody sees this; here it exists so the arms
 * can be walked through on the same device, back to back, without a rebuild.
 *
 * One of these sits on each screen whose own layout is under test — the funnel's
 * home screen, and the pickup step — so the switch is always next to the thing
 * it changes and needs no label to say which test it belongs to.
 *
 * The `variants` prop lets each test set its own arm list; the pill widens with
 * it so a three-arm switch keeps the same per-segment size as a two-arm one.
 *
 * Deliberately styled as a dev affordance rather than a design-system surface —
 * it is not part of any variant, and it should not be mistaken for one.
 */
export function VariantSwitch({
  label,
  value,
  onChange,
  variants = DEFAULT_VARIANTS,
  className,
}) {
  return (
    <div
      className={`variant-switch${className ? ` ${className}` : ''}`}
      style={{ '--variant-count': variants.length }}
    >
      {label && <span className="variant-switch__label">{label}</span>}
      <SegmentedControl
        items={variants}
        value={variants.indexOf(value)}
        onChange={(index) => onChange(variants[index])}
      />
    </div>
  )
}
