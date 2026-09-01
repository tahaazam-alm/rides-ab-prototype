import { useState } from 'react'
import { Icon } from './icons'

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

/**
 * iOS on-screen keyboard, per the Keyboard component in the Figma frame. Its
 * greys are native platform chrome (like the Apple Pay button's black), not
 * design-system tokens.
 */
export function Keyboard({
  suggestions,
  empty,
  onKey,
  onBackspace,
  onSubmit,
  onSuggestion,
}) {
  const [shift, setShift] = useState(false)
  // iOS auto-capitalises the first letter of an empty field.
  const caps = shift || empty

  const type = (ch) => {
    onKey(caps ? ch.toUpperCase() : ch)
    if (shift) setShift(false)
  }

  return (
    <div className="keyboard" role="group" aria-label="Keyboard">
      <div className="keyboard__autocorrect">
        {suggestions.map((s, i) => (
          <button
            key={`${s}-${i}`}
            type="button"
            className="keyboard__suggestion"
            onPointerDown={(e) => { e.preventDefault(); onSuggestion(s) }}
          >
            {i === 0 ? `“${s}”` : s}
          </button>
        ))}
      </div>

      <div className="keyboard__keys">
        <div className="keyboard__row">
          {ROWS[0].map((k) => (
            <button key={k} type="button" className="key"
              onPointerDown={(e) => { e.preventDefault(); type(k) }}>
              {caps ? k.toUpperCase() : k}
            </button>
          ))}
        </div>

        <div className="keyboard__row keyboard__row--indent">
          {ROWS[1].map((k) => (
            <button key={k} type="button" className="key"
              onPointerDown={(e) => { e.preventDefault(); type(k) }}>
              {caps ? k.toUpperCase() : k}
            </button>
          ))}
        </div>

        <div className="keyboard__row">
          <button
            type="button"
            className={`key key--wide${caps ? ' key--on' : ''}`}
            aria-pressed={caps}
            aria-label="Shift"
            onPointerDown={(e) => { e.preventDefault(); setShift((s) => !s) }}
          >
            ⇧
          </button>
          {ROWS[2].map((k) => (
            <button key={k} type="button" className="key"
              onPointerDown={(e) => { e.preventDefault(); type(k) }}>
              {caps ? k.toUpperCase() : k}
            </button>
          ))}
          <button
            type="button"
            className="key key--wide"
            aria-label="Backspace"
            onPointerDown={(e) => { e.preventDefault(); onBackspace() }}
          >
            ⌫
          </button>
        </div>

        <div className="keyboard__row">
          <button type="button" className="key key--fn" aria-label="Numbers"
            onPointerDown={(e) => e.preventDefault()}>
            123
          </button>
          <button type="button" className="key key--space" aria-label="Space"
            onPointerDown={(e) => { e.preventDefault(); onKey(' ') }}>
            space
          </button>
          <button type="button" className="key key--return" aria-label="Search"
            onPointerDown={(e) => { e.preventDefault(); onSubmit() }}>
            search
          </button>
        </div>
      </div>

      <div className="keyboard__tray">
        <Icon name="smiley" size={26} className="ds-icon" />
        <Icon name="mic" size={20} className="ds-icon" />
      </div>
    </div>
  )
}
