// Homepage content, matching the Figma "Variant A +Rides" frame.
//
// Product icons and visual icons are brand assets with baked-in fills, so they
// are imported as URLs and rendered as <img>. The four product marks come from
// the design system except Rides, which it doesn't ship yet — that one is
// exported from Figma and committed under src/assets/home.
import productActivities from '@ds-icons/product-icons/productActivities.svg'
import productFlights from '@ds-icons/product-icons/productFlights.svg'
import productHotel from '@ds-icons/product-icons/productHotel.svg'
import productRides from '../assets/home/product-rides.svg'

import serviceTransfers from '@ds-icons/visual-icons/serviceTransfers.svg'
import addonEsim from '@ds-icons/visual-icons/addonEsim.svg'
import servicePackages from '@ds-icons/visual-icons/servicePackages.svg'
import serviceConcierge from '@ds-icons/visual-icons/serviceConciergeServices.svg'
import serviceTrainTickets from '@ds-icons/visual-icons/serviceTrainTickets.svg'
import servicePrivateJet from '@ds-icons/visual-icons/servicePrivateJet.svg'
import iconAttractions from '@ds-icons/visual-icons/iconAttractions.svg'
import serviceOverflow from '@ds-icons/visual-icons/serviceOverflow.svg'

import dealActivities from '../assets/home/deal-activities.jpg'
import dealSaudia from '../assets/home/deal-saudia.jpg'
import dealAlfursan from '../assets/home/deal-alfursan.jpg'
import dealSaudiEscape from '../assets/home/deal-saudi-escape.jpg'

/**
 * The four funnel entry points. `tag` puts a label over the tile — today only
 * Rides carries one, as the newest product.
 */
export const PRODUCTS = [
  { id: 'flights', label: 'Flights', icon: productFlights },
  { id: 'stays', label: 'Stays', icon: productHotel },
  { id: 'activities', label: 'Activities', icon: productActivities },
  { id: 'rides', label: 'Rides', icon: productRides, tag: 'New' },
]

// The secondary services shelf — two rows of four, in reading order. The last
// entry opens the full list rather than a funnel of its own.
export const SERVICES = [
  { id: 'transfers', label: 'Airport Transfers', icon: serviceTransfers },
  { id: 'esim', label: 'eSIM', icon: addonEsim },
  { id: 'packages', label: 'Packages', icon: servicePackages },
  { id: 'concierge', label: 'Concierge', icon: serviceConcierge },
  { id: 'haramain', label: 'Haramain Train', icon: serviceTrainTickets },
  { id: 'private-jet', label: 'Private Jet', icon: servicePrivateJet },
  { id: 'six-flags', label: 'Six Flags Qiddiya City', icon: iconAttractions },
  { id: 'more', label: 'See More', icon: serviceOverflow },
]

/**
 * Promo cards. `code` is optional — an offer that applies automatically has no
 * coupon to copy, and the card keeps the pill's space so the grid stays even.
 */
export const DEALS = [
  {
    id: 'activities',
    title: 'Up to 25% OFF on activities',
    code: 'ACT',
    image: dealActivities,
  },
  {
    id: 'saudia',
    title: 'Save big with Saudia',
    code: 'SV500',
    image: dealSaudia,
  },
  {
    id: 'alfursan',
    title: 'Enjoy bonus AlFursan Miles',
    code: null,
    image: dealAlfursan,
  },
  {
    id: 'saudi-escape',
    title: 'A Saudi Arabian escape awaits',
    code: 'FLASH',
    image: dealSaudiEscape,
  },
]

export const TABS = [
  { id: 'home', label: 'Home', icon: 'chaletFilled' },
  { id: 'explore', label: 'Explore', icon: 'compassFilled' },
  { id: 'bookings', label: 'Bookings', icon: 'calendarFilled' },
  { id: 'offers', label: 'Top offers', icon: 'discountFilled' },
  { id: 'profile', label: 'Profile', icon: 'userCircleFilled' },
]
