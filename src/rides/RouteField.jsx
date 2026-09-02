import { useEffect, useRef } from 'react'
import { Icon } from './icons'
import { useIsMobile } from './useIsMobile'

/**
 * Editable route field. WidgetField is a button that opens a picker, so it
 * can't host a caret — this matches its geometry (68px, 4px/16px padding,
 * 16px gap) while wrapping a real input.
 */
export function RouteField({
  id,
  label,
  value,
  icon,
  active,
  onFocus,
  onChange,
  onClear,
}) {
  const ref = useRef(null)
  const isMobile = useIsMobile()
  // Empty cell: the label drops into the placeholder position and is the only
  // text, matching WidgetField's `empty` variant. Once there is a value it rises
  // to the 12px caption line above it.
  const populated = value.length > 0

  useEffect(() => {
    // Follow the active flag both ways: going inactive (e.g. the keyboard was
    // dismissed by a scroll) must also drop DOM focus, or a physical keystroke
    // would still land in a field that no longer looks focused.
    if (active) ref.current?.focus({ preventScroll: true })
    else if (document.activeElement === ref.current) ref.current.blur()
  }, [active])

  return (
    <div
      className={`route-field${active ? ' route-field--active' : ''}`}
      onPointerDown={() => onFocus(id)}
    >
      <Icon name={icon} className="ds-icon route-field__icon" />

      <span className="route-field__content">
        {populated && (
          <label className="route-field__label" htmlFor={`route-${id}`}>
            {label}
          </label>
        )}
        <input
          id={`route-${id}`}
          ref={ref}
          className="route-field__input"
          type="text"
          value={value}
          placeholder={populated ? undefined : label}
          aria-label={label}
          autoComplete="off"
          /* On desktop the in-app on-screen keyboard is the input surface, so
             suppress the device's own keyboard and keep both previews
             identical. On mobile the browser's native keyboard is what the
             traveller expects, so let it open. */
          inputMode={isMobile ? undefined : 'none'}
          onFocus={() => onFocus(id)}
          onChange={(e) => onChange(id, e.target.value)}
        />
      </span>

      {active && value && (
        <button
          type="button"
          className="route-field__clear"
          aria-label="Clear"
          onPointerDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onClear(id)
          }}
        >
          <Icon name="xCircleFill" size={24} className="ds-icon" />
        </button>
      )}
    </div>
  )
}
