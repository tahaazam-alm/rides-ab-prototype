import { useEffect, useState } from 'react'

// The touch-and-no-hover pair is what "real handset" reduces to across
// vendors: iOS Safari, Chrome/Android, Samsung Internet, and the Firefox
// mobile stack all match; iPad Safari matches too (desktop-mode iPad is a
// deliberate override the user chose). Desktops with a touchscreen fall out
// via `hover: hover`, so a plugged-in mouse still renders the fake keyboard.
const QUERY = '(hover: none) and (pointer: coarse)'

/**
 * Small subscription to the coarse-pointer media query. Used by the route and
 * flight-search sheets to decide whether to render the in-app on-screen
 * keyboard (desktop preview) or defer to the native mobile keyboard on real
 * handsets. Kept as its own module because both sheets and both fields need
 * to agree on the answer.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false,
  )
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return isMobile
}
