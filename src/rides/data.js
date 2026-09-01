// Sample content for the Rides flow, matching the Figma frames.
// Places the two route fields search against.
export const PLACES = [
  { title: 'The Address hotel, Business bay', subtitle: 'Dubai, United Arab Emirates', distance: '10 km' },
  { title: 'Dubai International Airport - DXB', subtitle: 'Airport, Dubai', distance: '0 km', airport: 'DXB', city: 'Dubai', terminal: 'Terminal 2' },
  { title: 'Al Maktoum International Airport - DWC', subtitle: 'Airport, Dubai', distance: '48 km', airport: 'DWC', city: 'Dubai', terminal: 'Terminal 1' },
  { title: 'Burj Khalifa', subtitle: 'Downtown Dubai, United Arab Emirates', distance: '12 km' },
  { title: 'The Dubai Mall', subtitle: 'Downtown Dubai, United Arab Emirates', distance: '13 km' },
  { title: 'Palm Jumeirah', subtitle: 'Dubai, United Arab Emirates', distance: '25 km' },
  { title: 'Dubai Marina', subtitle: 'Dubai, United Arab Emirates', distance: '28 km' },
  { title: 'Business Bay', subtitle: 'Dubai, United Arab Emirates', distance: '11 km' },
]

export const searchPlaces = (query) => {
  const q = query.trim().toLowerCase()
  if (!q) return PLACES.slice(0, 4)
  return PLACES.filter((p) => (p.title + ' ' + p.subtitle).toLowerCase().includes(q))
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

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const formatDate = ({ year, month, day }) =>
  `${day} ${MONTHS[month]} ${year}`

export const formatTime = ({ hour, minute, meridiem }) =>
  `${hour}:${String(minute).padStart(2, '0')} ${meridiem}`

// "17 Sep, 9:20 PM" — the review screen's pickup line.
export const formatDayTime = (date, time) =>
  `${date.day} ${MONTHS[date.month]}, ${formatTime(time)}`

// Short itinerary label for the results navbar: "15 Sep – 12:30 PM".
export const formatShortDateTime = (date, time) =>
  `${date.day} ${MONTHS[date.month]} – ${formatTime(time)}`

/**
 * Free-cancellation deadline shown on every car card: 24 hours before pickup,
 * formatted the same way. Derived rather than hardcoded so the deadline stays
 * behind whatever pickup the user actually chose.
 */
export const formatCancellation = (date, time) => {
  const d = new Date(date.year, date.month, date.day - 1)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} - ${formatTime(time)}`
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
export const formatArrival = (date, flight) =>
  `Arrives on ${WEEKDAYS[new Date(date.year, date.month, date.day).getDay()]} ` +
  `${date.day} ${MONTHS[date.month]}, ${formatTime(flight.arrive)}`
