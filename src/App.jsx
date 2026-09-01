import { useState } from 'react'
import { DesignSystemProvider } from 'design-system'
import { Home } from './home/Home'
import { RidesFlow } from './rides/RidesFlow'
import 'design-system/dist/index.css'

/**
 * App shell. The homepage is the entry point into every product; each funnel is
 * a screen mounted alongside it, so the remaining ones can be added here as
 * they are built.
 *
 * A funnel mounts on first entry and then stays mounted, hidden — so leaving it
 * and coming back keeps the trip the user had already described.
 */

/**
 * Which arm of each Rides A/B test to open in — the search funnel, and the
 * pickup step nested inside its v2. Stands in for the experiment platform's
 * assignment, so a link can pin the arms being reviewed
 * (?variant=v2&pickup=v2) instead of them being switched by hand every time.
 */
const initialArm = (key, allowed) => {
  const value = new URLSearchParams(window.location.search).get(key)
  return allowed.includes(value) ? value : allowed[0]
}

function App() {
  const [screen, setScreen] = useState('home') // 'home' | 'rides'
  const [ridesVisited, setRidesVisited] = useState(false)
  const [variant, setVariant] = useState(() => initialArm('variant', ['v1', 'v2']))
  const [pickupVariant, setPickupVariant] = useState(() =>
    initialArm('pickup', ['v1', 'v2']),
  )

  // Returning `true` tells the homepage the tap was routed somewhere; anything
  // still unbuilt falls through to its "coming soon" toast.
  const openProduct = (product) => {
    if (product.id !== 'rides') return false
    setRidesVisited(true)
    setScreen('rides')
    return true
  }

  return (
    <DesignSystemProvider platform="ios" dir="ltr">
      <div hidden={screen !== 'home'}>
        <Home onOpenProduct={openProduct} />
      </div>

      {ridesVisited && (
        <div hidden={screen !== 'rides'}>
          <RidesFlow
            variant={variant}
            pickupVariant={pickupVariant}
            onVariantChange={setVariant}
            onPickupVariantChange={setPickupVariant}
            onExit={() => setScreen('home')}
          />
        </div>
      )}
    </DesignSystemProvider>
  )
}

export default App
