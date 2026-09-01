import { Icon } from './icons'
import { MONTHS, TODAY, WEEKDAYS } from './data'

const isSameDay = (a, b) =>
  !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day

// Ordinal day number, used to grey out anything before "today".
const ordinal = ({ year, month, day }) => year * 10000 + month * 100 + day

export function CalendarGrid({ view, selected, onSelect, onViewChange }) {
  const { year, month } = view
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const rows = Array.from({ length: cells.length / 7 }, (_, r) =>
    cells.slice(r * 7, r * 7 + 7),
  )

  const shift = (delta) => {
    const next = new Date(year, month + delta, 1)
    onViewChange({ year: next.getFullYear(), month: next.getMonth() })
  }

  return (
    <div className="calendar">
      <div className="calendar__head">
        <p className="calendar__month">
          <span className="calendar__month-name">{MONTHS[month]}</span>
          <span className="calendar__year">{year}</span>
        </p>
        <button
          type="button"
          className="calendar__nav"
          aria-label="Previous month"
          onClick={() => shift(-1)}
        >
          <Icon name="chevronLeft" size={24} className="ds-icon" />
        </button>
        <button
          type="button"
          className="calendar__nav"
          aria-label="Next month"
          onClick={() => shift(1)}
        >
          <Icon name="chevronRight" size={24} className="ds-icon" />
        </button>
      </div>

      <table className="calendar__table">
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th key={d} scope="col" className="calendar__weekday">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((day, ci) => {
                if (day === null) return <td key={ci} className="calendar__cell" />
                const date = { year, month, day }
                const past = ordinal(date) < ordinal(TODAY)
                const isToday = isSameDay(date, TODAY)
                const isSelected = isSameDay(date, selected)
                return (
                  <td key={ci} className="calendar__cell">
                    <button
                      type="button"
                      className={[
                        'calendar__day',
                        past && 'calendar__day--past',
                        isToday && 'calendar__day--today',
                        isSelected && 'calendar__day--selected',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      disabled={past}
                      aria-current={isToday ? 'date' : undefined}
                      aria-pressed={isSelected}
                      onClick={() => onSelect(date)}
                    >
                      {day}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
