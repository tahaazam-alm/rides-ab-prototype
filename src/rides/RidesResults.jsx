import { Chip, Navbar } from 'design-system'
import { CarCard } from './CarCard'
import { Icon } from './icons'
import { CARS, formatCancellation, formatShortDateTime } from './data'
import { useCalendarLabels, useT } from '../i18n.jsx'

export function RidesResults({
  pickup,
  destination,
  date,
  time,
  passengers,
  onBack,
  onEditItinerary,
  onSelectCar,
  inert,
}) {
  const t = useT()
  const { months } = useCalendarLabels()
  const cancellation = formatCancellation(date, time, months)

  return (
    // Inert while the review sits on top, so the cards behind it can't be tabbed to.
    <div className="rides-results" inert={inert}>
      <header className="rides-results__header">
        <Navbar
          toolbar={{
            variant: 'flights',
            onBack,
            onItinerary: onEditItinerary,
            origin: pickup,
            destination,
            travelers: passengers,
            dates: formatShortDateTime(date, time, months),
          }}
        />

        {/* The sort and filter surfaces these open aren't designed yet, so the
            row is the frame's set of triggers and nothing behind them. */}
        <div className="rides-results__chips">
          <Chip
            aria-label={t('common.search')}
            icon={<Icon name="arrowsDownUp" size={16} className="ds-icon" />}
          />
          <Chip
            aria-label={t('common.search')}
            icon={<Icon name="sliders" size={16} className="ds-icon" />}
          />
          <Chip label={t('rides.results.filterChildSeat')} />
          <Chip label={t('rides.results.filterLuggage')} dropdown />
          <Chip label={t('rides.results.filterCarType')} dropdown />
        </div>
      </header>

      <div className="rides-results__list">
        {/* Filter by pax so a party of 4/5 doesn't see a 3-seat sedan; the
            catalogue spans 3 → 10 seats so every realistic party gets at
            least one match. */}
        {CARS.filter((car) => car.seats >= passengers).map((car) => (
          <CarCard
            key={car.id}
            car={car}
            cancellation={cancellation}
            onSelect={() => onSelectCar(car)}
          />
        ))}
      </div>
    </div>
  )
}
