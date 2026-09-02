import { useEffect, useRef } from 'react'

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = [0, 10, 20, 30, 40, 50]
const MERIDIEMS = ['AM', 'PM']

const ITEM_HEIGHT = 28

/**
 * One scroll-snapping column of the picker. Figma flattens the iOS wheel to a
 * bitmap, so this is a real control built from tokens instead of that image.
 * `kind` seeds a modifier class the CSS uses to reorder columns in RTL (see
 * `.wheel` rules) without touching JSX or React state.
 */
function Column({ items, value, onChange, format = (v) => v, label, kind }) {
  const ref = useRef(null)
  const settle = useRef(null)

  // Keep the column parked on the selected value when it changes externally.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const index = items.indexOf(value)
    if (index < 0) return
    const target = index * ITEM_HEIGHT
    if (Math.abs(el.scrollTop - target) > 1) el.scrollTop = target
  }, [items, value])

  const handleScroll = () => {
    const el = ref.current
    if (!el) return
    clearTimeout(settle.current)
    settle.current = setTimeout(() => {
      const index = Math.round(el.scrollTop / ITEM_HEIGHT)
      const next = items[Math.max(0, Math.min(items.length - 1, index))]
      if (next !== value) onChange(next)
    }, 90)
  }

  useEffect(() => () => clearTimeout(settle.current), [])

  return (
    <div
      className={`wheel__column${kind ? ` wheel__column--${kind}` : ''}`}
      ref={ref}
      onScroll={handleScroll}
      role="listbox"
      aria-label={label}
      tabIndex={0}
    >
      <div className="wheel__pad" />
      {items.map((item) => (
        <button
          key={item}
          type="button"
          role="option"
          aria-selected={item === value}
          className={`wheel__item${item === value ? ' wheel__item--active' : ''}`}
          onClick={() => onChange(item)}
        >
          {format(item)}
        </button>
      ))}
      <div className="wheel__pad" />
    </div>
  )
}

export function TimeWheel({ time, onChange }) {
  // DOM order is always [hour, minute, meridiem]. The RTL layout is done
  // purely in CSS with `order` on the modifier classes below — so this file
  // doesn't need to read the language, and the reorder can't be broken by a
  // missing context provider.
  return (
    <div className="wheel">
      <div className="wheel__selection" aria-hidden="true" />
      <Column
        kind="hour"
        label="Hour"
        items={HOURS}
        value={time.hour}
        onChange={(hour) => onChange({ ...time, hour })}
      />
      <Column
        kind="minute"
        label="Minute"
        items={MINUTES}
        value={time.minute}
        format={(m) => String(m).padStart(2, '0')}
        onChange={(minute) => onChange({ ...time, minute })}
      />
      <Column
        kind="meridiem"
        label="AM or PM"
        items={MERIDIEMS}
        value={time.meridiem}
        onChange={(meridiem) => onChange({ ...time, meridiem })}
      />
    </div>
  )
}
