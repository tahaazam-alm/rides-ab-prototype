import { Chip, Navbar } from 'design-system'
import { CarCard } from './CarCard'
import { Icon } from './icons'
import { CARS, formatCancellation, formatShortDateTime } from './data'

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
  const cancellation = formatCancellation(date, time)

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
            dates: formatShortDateTime(date, time),
          }}
        />

        {/* The sort and filter surfaces these open aren't designed yet, so the
            row is the frame's set of triggers and nothing behind them. */}
        <div className="rides-results__chips">
          <Chip
            aria-label="Sort"
            icon={<Icon name="arrowsDownUp" size={16} className="ds-icon" />}
          />
          <Chip
            aria-label="Filters"
            icon={<Icon name="sliders" size={16} className="ds-icon" />}
          />
          <Chip label="Child seat" />
          <Chip label="Luggage" dropdown />
          <Chip label="Car type" dropdown />
        </div>
      </header>

      <div className="rides-results__list">
        {CARS.map((car) => (
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
