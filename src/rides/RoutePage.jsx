import { Navbar } from 'design-system'
import { PICKUP_VARIANTS } from './PickupPage'
import { RouteSheet } from './RouteSheet'
import { VariantSwitch } from './VariantSwitch'

/**
 * v2's first step. The route search itself is unchanged from v1 — same fields,
 * same suggestions, same keyboard — so this is the sheet's body under a page
 * navbar rather than a second copy of it. What changes is the exit: a page is
 * left with a back button and hands the traveller on to the pickup step, where
 * a sheet just dropped them back on the home screen.
 *
 * The pickup step's A/B switch is echoed here in the same navbar corner so the
 * arm can be picked one step ahead of landing on the page it changes — useful
 * for the airport pickup, where the whole point of the test is what happens
 * when the destination is an airport, and having to open the page first to
 * flip the arm undoes the "before you land" framing.
 */
export function RoutePage({
  onBack,
  inert,
  pickupVariant,
  onPickupVariantChange,
  ...route
}) {
  return (
    <div className="route-page" inert={inert}>
      <header className="route-page__header">
        <Navbar toolbar={{ variant: 'default', title: 'Plan your route', onBack }} />

        {onPickupVariantChange && (
          <VariantSwitch
            className="variant-switch--step"
            variants={PICKUP_VARIANTS}
            value={pickupVariant}
            onChange={onPickupVariantChange}
          />
        )}
      </header>

      <RouteSheet {...route} />
    </div>
  )
}
