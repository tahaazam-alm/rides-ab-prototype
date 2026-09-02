// Sample content for the Rides flow.
//
// The two route fields search against different pools: the pickup field only
// offers airports (the primary use case is a traveller being collected from
// an arrival), and the destination field offers hotels, landmarks, and
// districts. Titles carry no commas so the keyboard wordSuggestion split
// stays clean — the design uses a middle dot in the subtitle instead.
export const PLACES = [
  // ---- Airports (pickup pool) ----
  {
    title: 'Dubai International Airport (DXB)',
    subtitle: 'Airport · Dubai · UAE',
    address: 'Airport Road, Al Garhoud, Dubai',
    distance: '0 km',
    airport: 'DXB',
    city: 'Dubai',
    terminal: 'Terminal 2',
  },
  {
    title: 'Al Maktoum International Airport (DWC)',
    subtitle: 'Airport · Dubai · UAE',
    address: 'Jebel Ali, Dubai',
    distance: '48 km',
    airport: 'DWC',
    city: 'Dubai',
    terminal: 'Terminal 1',
  },
  // ---- Destinations (destination pool) ----
  {
    title: 'Burj Khalifa',
    subtitle: 'Downtown Dubai · UAE',
    address: 'Sheikh Mohammed Bin Rashed Boulevard, Downtown, Dubai',
    distance: '12 km',
  },
  {
    title: 'The Dubai Mall',
    subtitle: 'Downtown Dubai · UAE',
    address: 'Financial Center Road, Downtown, Dubai',
    distance: '13 km',
  },
  {
    title: 'Palm Jumeirah',
    subtitle: 'Dubai · UAE',
    address: 'Palm Jumeirah, Dubai',
    distance: '25 km',
  },
  {
    title: 'Dubai Marina',
    subtitle: 'Dubai · UAE',
    address: 'Al Marsa Street, Dubai Marina, Dubai',
    distance: '28 km',
  },
  {
    title: 'Burj Al Arab',
    subtitle: 'Jumeirah · Dubai · UAE',
    address: 'Jumeirah Street, Umm Suqeim, Dubai',
    distance: '22 km',
  },
  {
    title: 'Atlantis The Palm',
    subtitle: 'Palm Jumeirah · Dubai · UAE',
    address: 'Crescent Road, The Palm Jumeirah, Dubai',
    distance: '30 km',
  },
  {
    title: 'Global Village',
    subtitle: 'Dubailand · Dubai · UAE',
    address: 'Sheikh Mohammed Bin Zayed Road, Dubailand, Dubai',
    distance: '32 km',
  },
  {
    title: 'Dubai Frame',
    subtitle: 'Zabeel Park · Dubai · UAE',
    address: 'Zabeel Park, Al Kifaf, Dubai',
    distance: '14 km',
  },
]

/**
 * `field` narrows the pool — pickup shows airports, destination shows the
 * everything-else list. Falls back to the destination pool if unspecified,
 * which is what a caller without the field context (e.g. an early debug
 * console session) would want.
 */
export const searchPlaces = (query, field) => {
  const q = query.trim().toLowerCase()
  const pool =
    field === 'pickup'
      ? PLACES.filter((p) => p.airport)
      : PLACES.filter((p) => !p.airport)
  if (!q) return pool.slice(0, 4)
  return pool.filter((p) =>
    (p.title + ' ' + p.subtitle).toLowerCase().includes(q),
  )
}

export const findPlace = (title) => PLACES.find((p) => p.title === title)

/**
 * An airport pickup is the only case where the pickup time can be derived from
 * something the traveller already knows — their landing. It is what unlocks the
 * "set it myself / track my flight" fork in the v2 funnel, so the whole branch
 * hangs off this one lookup rather than a flag the screens pass around.
 */
export const findAirport = (title) => {
  const place = findPlace(title)
  return place?.airport ? place : null
}

export const UPCOMING = [
  {
    id: 'flight',
    kind: 'flight',
    route: ['Riyadh', 'London'],
    line2: '02:30 PM – 11:50 PM • Thu 14 May',
    line3: 'Flynas • XY 30Z',
  },
  {
    id: 'stay',
    kind: 'stay',
    title: 'Sofitel Hotel London',
    line2: 'London, United Kingdom',
    line3: '12 May – 14 May',
  },
]

// The calendar frame shows Sep 2026, the 5th as today and the 15th selected.
export const TODAY = { year: 2026, month: 8, day: 5 }

// Default English month/weekday names. Locale-aware call sites go through
// the useT-bound hooks in i18n.jsx; these constants are the fallback used
// wherever the formatters are called directly (test scaffolding, non-React
// helpers), and the same source the CalendarGrid still reads.
export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Underlying formatters accept the month/weekday arrays as arguments so the
// output can be flipped between English and Arabic without either component
// or data touching each other's concerns. React consumers get the locale
// version through `useDateFormat()` in i18n.jsx.

export const formatDate = ({ year, month, day }, months = MONTHS) =>
  `${day} ${months[month]} ${year}`

export const formatTime = ({ hour, minute, meridiem }) =>
  `${hour}:${String(minute).padStart(2, '0')} ${meridiem}`

// "17 Sep 2026, 9:20 PM" — the review screen's pickup line. Year included so
// the row reads as an unambiguous commitment.
export const formatDayTime = (date, time, months = MONTHS) =>
  `${date.day} ${months[date.month]} ${date.year}, ${formatTime(time)}`

// Short itinerary label for the results navbar: "15 Sep – 12:30 PM".
export const formatShortDateTime = (date, time, months = MONTHS) =>
  `${date.day} ${months[date.month]} – ${formatTime(time)}`

/**
 * Free-cancellation deadline shown on every car card: 24 hours before pickup,
 * formatted the same way. Derived rather than hardcoded so the deadline stays
 * behind whatever pickup the user actually chose.
 */
export const formatCancellation = (date, time, months = MONTHS) => {
  const d = new Date(date.year, date.month, date.day - 1)
  return `${d.getDate()} ${months[d.getMonth()]} - ${formatTime(time)}`
}

// The cars the search returns, matching the Figma results frame. `width` is the
// rendered width of the vehicle cutout, which differs per body style.
export const CARS = [
  {
    id: 'economy-sedan',
    name: 'Economy Sedan',
    model: 'Toyota Altis or similar',
    image: 'economy',
    width: 164,
    price: 250,
    // Figma pairs a "dropped by 10%" badge with a *lower* struck price (230 vs
    // 250). Kept the badge and set the struck price above it so the two agree.
    wasPrice: 278,
    promo: 'Price dropped by 10%',
    seats: 3,
    bags: 2,
    meetAndGreet: true,
    arabicSpeakingDriver: false,
    childSeat: true,
  },
  {
    id: 'luxury-sedan',
    name: 'Luxury Sedan',
    model: 'Tesla model Y or similar',
    image: 'luxurySedan',
    width: 165,
    price: 250,
    seats: 3,
    bags: 2,
    meetAndGreet: true,
    arabicSpeakingDriver: true,
    childSeat: true,
  },
  {
    id: 'luxury-suv',
    name: 'Luxury SUV',
    model: 'GMC Yukon XL or similar',
    image: 'luxurySuv',
    width: 188,
    price: 320,
    seats: 5,
    bags: 7,
    meetAndGreet: true,
    arabicSpeakingDriver: true,
    childSeat: true,
  },
]

// ---------- Review your booking ----------

export const TITLES = ['Mr', 'Ms', 'Mrs']

export const DIAL_CODES = ['+966', '+971', '+965', '+973', '+974', '+968', '+20', '+44']

export const LANGUAGES = ['No preference', 'Arabic', 'English', 'Urdu', 'Hindi', 'Filipino']

/**
 * Loyalty programmes this booking can earn from. The first is featured on its
 * own card with its conversion rate; the rest share one card. Points are sample
 * figures from the frame rather than a function of the fare.
 */
export const FEATURED_REWARD = {
  id: 'almosafer',
  name: 'Almosafer points',
  points: '300',
  logo: 'almosafer',
  rate: '1',
}

export const REWARDS = [
  { id: 'qitaf', name: 'Qitaf points', points: '200', logo: 'qitaf' },
  { id: 'mokafaa', name: 'Mokafaa points', points: '2,000', logo: 'mokafaa' },
  { id: 'shukran', name: 'Shukrans', points: '12,120', logo: 'shukran' },
]

// ---------- Inbound flights (v2 "Track my flight") ----------

/**
 * Flights landing at the pickup airport, which is the only set worth searching:
 * the traveller is being collected *from* their arrival, so a departure out of
 * DXB can never be the flight they mean.
 *
 * `airline` is the carrier's two-character IATA code, which is also the filename
 * of its logo in the design system's `airline-logos` folder.
 *
 * `terminal` rides on the flight rather than the airport because it is the whole
 * point of tracking: DXB has three, and only the flight number says which one
 * the driver should wait at.
 */
export const FLIGHTS = [
  {
    id: 'sv202',
    airline: 'SV',
    airlineName: 'Saudia Airlines',
    number: 'SV 202',
    origin: 'London',
    arrivesAt: 'DXB',
    terminal: 'Terminal 1',
    depart: { hour: 3, minute: 15, meridiem: 'AM' },
    arrive: { hour: 12, minute: 30, meridiem: 'PM' },
  },
  {
    id: 'sv552',
    airline: 'SV',
    airlineName: 'Saudia Airlines',
    number: 'SV 552',
    origin: 'Riyadh',
    arrivesAt: 'DXB',
    terminal: 'Terminal 1',
    depart: { hour: 1, minute: 20, meridiem: 'PM' },
    arrive: { hour: 4, minute: 30, meridiem: 'PM' },
  },
  {
    id: 'ek8',
    airline: 'EK',
    airlineName: 'Emirates',
    number: 'EK 8',
    origin: 'London',
    arrivesAt: 'DXB',
    terminal: 'Terminal 3',
    depart: { hour: 9, minute: 40, meridiem: 'AM' },
    arrive: { hour: 8, minute: 0, meridiem: 'PM' },
  },
  {
    id: 'qr1006',
    airline: 'QR',
    airlineName: 'Qatar Airways',
    number: 'QR 1006',
    origin: 'Doha',
    arrivesAt: 'DXB',
    terminal: 'Terminal 1',
    depart: { hour: 7, minute: 10, meridiem: 'AM' },
    arrive: { hour: 8, minute: 20, meridiem: 'AM' },
  },
  {
    id: 'fz8',
    airline: 'FZ',
    airlineName: 'flydubai',
    number: 'FZ 8',
    origin: 'Jeddah',
    arrivesAt: 'DWC',
    terminal: 'Terminal 1',
    depart: { hour: 6, minute: 20, meridiem: 'AM' },
    arrive: { hour: 10, minute: 50, meridiem: 'AM' },
  },
]

/**
 * Matches on carrier name, flight number, and origin city, so "saudi", "SV202"
 * and "london" all find something — travellers rarely remember the number and
 * usually reach for whichever of the three they do know. The number is matched
 * with and without its space so "SV202" hits "SV 202".
 */
export const searchFlights = (query, airportCode) => {
  const inbound = FLIGHTS.filter((f) => f.arrivesAt === airportCode)
  const q = query.trim().toLowerCase()
  if (!q) return inbound
  return inbound.filter((f) => {
    const haystack = [f.airlineName, f.number, f.number.replace(' ', ''), f.origin]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

// "Arrives on Thu 15 Sep, 12:30 PM" — the flight card's landing line. The day
// comes from the pickup date the traveller already picked, so the two agree.
export const formatArrival = (
  date,
  flight,
  months = MONTHS,
  weekdays = WEEKDAYS,
  arrivesOn = 'Arrives on',
) =>
  `${arrivesOn} ${weekdays[new Date(date.year, date.month, date.day).getDay()]} ` +
  `${date.day} ${months[date.month]}, ${formatTime(flight.arrive)}`
