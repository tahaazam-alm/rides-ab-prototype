import { useEffect, useRef, useState } from 'react'

/**
 * Height-animated open/close. The content stays mounted so the two pickers can
 * cross-fade into each other instead of being swapped out; `inert` keeps the
 * closed one out of the tab order and off the accessibility tree.
 *
 * The height is measured rather than hardcoded because the calendar changes
 * height between 5- and 6-row months.
 */
export function Collapse({ open, children }) {
  const inner = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = inner.current
    if (!el) return
    const measure = () => setHeight(el.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`collapse${open ? ' collapse--open' : ''}`}
      style={{ maxHeight: open ? `${height}px` : '0px' }}
      inert={!open}
    >
      <div ref={inner}>{children}</div>
    </div>
  )
}
