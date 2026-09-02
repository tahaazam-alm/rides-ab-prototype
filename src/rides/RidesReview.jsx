import { useState } from 'react'
import { Button, Checkbox, Chip, Navbar, Separator, TextInput } from 'design-system'
import { ReviewSummary } from './ReviewSummary'
import { Icon } from './icons'
import {
  DIAL_CODES,
  FEATURED_REWARD,
  LANGUAGES,
  REWARDS,
  TITLES,
  findPlace,
  formatCancellation,
  formatDayTime,
} from './data'
import almosaferLogo from '@ds-icons/logotypes/payment/almosafer.svg'
import qitafLogo from '@ds-icons/logotypes/payment/qitaf.svg'
import mokafaaLogo from '@ds-icons/logotypes/payment/mokafaa.svg'
import shukranLogo from '../assets/cars/logo-shukran.png'
import childSeatArt from '../assets/cars/addon-child-seat.png'
import languageArt from '../assets/cars/addon-language.png'
import { useCalendarLabels, useT } from '../i18n.jsx'

// The design system ships the first three as brand logotypes; Shukran isn't in
// that set, so its coin comes from the frame. All four are brand-locked — sized
// but never recoloured.
const LOGOS = {
  almosafer: almosaferLogo,
  qitaf: qitafLogo,
  mokafaa: mokafaaLogo,
  shukran: shukranLogo,
}

function SectionHeading({ title, note }) {
  return (
    <div className="review-section__heading">
      <h2>{title}</h2>
      {note && <p>{note}</p>}
    </div>
  )
}

/** The earned amount. Reads as the row's value, so it carries the default ink
 *  rather than the muted DS `Tag`. */
function Points({ children }) {
  return <span className="reward__points">{children}</span>
}

function RewardRow({ reward }) {
  const t = useT()
  return (
    <div className="reward">
      <img className="reward__logo" src={LOGOS[reward.logo]} alt="" />
      <p className="reward__name">{reward.name}</p>
      <Points>{reward.points}</Points>
      <button type="button" className="reward__info">
        <Icon name="infoCircle" size={24} className="ds-icon" />
        <span className="sr-only">{t('rides.review.aboutReward')} {reward.name}</span>
      </button>
    </div>
  )
}

export function RidesReview({
  car,
  pickup,
  destination,
  date,
  time,
  flight,
  onBack,
  onContinue,
}) {
  const t = useT()
  const { months } = useCalendarLabels()
  const [title, setTitle] = useState(TITLES[0])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dialCode, setDialCode] = useState(DIAL_CODES[0])
  const [phone, setPhone] = useState('')
  const [marketing, setMarketing] = useState(false)
  // v2 asks for the flight up front so it can set the pickup time from the
  // landing, and this section asks for the same number for the same reason —
  // so a tracked flight arrives here already filled in rather than typed twice.
  const [flightNumber, setFlightNumber] = useState(flight?.number ?? '')
  const [childSeat, setChildSeat] = useState(false)
  const [language, setLanguage] = useState(LANGUAGES[0])
  // Populated by Continue, so the fields stay clean until the traveller asks to
  // move on. Editing a field clears its own error.
  const [errors, setErrors] = useState({})

  const clearError = (field) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev))

  const submit = () => {
    const next = {}
    if (!firstName.trim()) next.firstName = t('rides.review.errFirstName')
    if (!lastName.trim()) next.lastName = t('rides.review.errLastName')
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = t('rides.review.errEmail')
    if (!/^\d{6,}$/.test(phone.replace(/\s/g, ''))) next.phone = t('rides.review.errPhone')
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onContinue({ title, firstName, lastName, email, dialCode, phone, marketing, flightNumber, childSeat, language })
  }

  return (
    <div className="rides-review">
      <div className="rides-review__header">
        <Navbar toolbar={{ variant: 'default', title: t('rides.review.title'), onBack }} />
      </div>

      <div className="rides-review__body">
        <ReviewSummary
          car={car}
          cancellation={formatCancellation(date, time, months)}
          pickup={pickup}
          pickupAddress={findPlace(pickup)?.address}
          destination={destination}
          destinationAddress={findPlace(destination)?.address}
          dateTimeLabel={formatDayTime(date, time, months)}
          trackingLabel={
            flight
              ? `${t('rides.home.tracking')} ${flight.number}`
              : undefined
          }
        />

        <section className="review-section">
          <SectionHeading title={t('rides.review.contactDetails')} />

          <div className="review-titles" role="group" aria-label={t('rides.review.titleAria')}>
            {TITLES.map((option) => (
              <Chip
                key={option}
                label={t(`rides.review.title.${option}`)}
                selected={title === option}
                aria-pressed={title === option}
                onClick={() => setTitle(option)}
              />
            ))}
          </div>

          <TextInput
            label={t('rides.review.firstName')}
            value={firstName}
            errorText={errors.firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              clearError('firstName')
            }}
          />
          <TextInput
            label={t('rides.review.lastName')}
            value={lastName}
            errorText={errors.lastName}
            onChange={(e) => {
              setLastName(e.target.value)
              clearError('lastName')
            }}
          />
          <TextInput
            label={t('rides.review.email')}
            type="email"
            value={email}
            errorText={errors.email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearError('email')
            }}
          />

          <div className="review-phone">
            <TextInput label={t('rides.review.code')} value={dialCode} dropdown readOnly>
              <ul className="review-codes">
                {DIAL_CODES.map((code) => (
                  <li key={code}>
                    <button
                      type="button"
                      // Commit before the field blurs, which would close the panel.
                      onPointerDown={(e) => {
                        e.preventDefault()
                        setDialCode(code)
                      }}
                    >
                      {/* Dial codes are LTR numeric strings — force LTR so the
                          "+966" doesn't reverse to "٦٦٩+" inside an RTL menu. */}
                      <span dir="ltr">{code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </TextInput>
            <TextInput
              label={t('rides.review.phone')}
              type="tel"
              value={phone}
              errorText={errors.phone}
              onChange={(e) => {
                setPhone(e.target.value)
                clearError('phone')
              }}
            />
          </div>

          <div className="review-optin">
            <label className="review-optin__label">
              <Checkbox
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>{t('rides.review.marketingOptIn')}</span>
            </label>
            <button type="button" className="review-optin__info">
              <Icon name="infoCircle" size={24} className="ds-icon" />
              <span className="sr-only">{t('rides.review.howWeUseInfo')}</span>
            </button>
          </div>
        </section>

        <section className="review-section">
          <SectionHeading
            title={t('rides.review.flightNumberTitle')}
            note={t('rides.review.flightNumberNote')}
          />
          <TextInput
            label={t('rides.review.flightNumberPlaceholder')}
            value={flightNumber}
            leadingIcon={<Icon name="airplaneTilt" className="ds-icon" />}
            onChange={(e) => setFlightNumber(e.target.value)}
          />
        </section>

        <section className="review-section">
          <SectionHeading
            title={t('rides.review.extras')}
            note={t('rides.review.extrasNote')}
          />

          {car.childSeat && (
            <div className="addon">
              <img className="addon__art" src={childSeatArt} alt="" />
              <label className="addon__body">
                <span className="addon__name">{t('rides.review.childSeatName')}</span>
                <span className="addon__note">{t('rides.review.childSeatNote')}</span>
                <Checkbox
                  className="addon__check"
                  checked={childSeat}
                  onChange={(e) => setChildSeat(e.target.checked)}
                />
              </label>
            </div>
          )}

          <div className="addon addon--stacked">
            <img className="addon__art" src={languageArt} alt="" />
            <div className="addon__body">
              <span className="addon__name">
                {t('rides.review.languageName')}{' '}
                <span className="addon__optional">
                  {t('rides.review.languageOptional')}
                </span>
              </span>
              <span className="addon__note">{t('rides.review.languageNote')}</span>
            </div>
            {/* A 40px pill, not the 56px DS field the frame's legacy component
                maps to. A native select gives it real behaviour. */}
            <div className="pill-select">
              <select
                value={language}
                aria-label={t('rides.review.languageAria')}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((option) => (
                  <option key={option} value={option}>
                    {t(`rides.review.language.${option}`)}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={24} className="ds-icon" />
            </div>
          </div>
        </section>

        <section className="review-section">
          <SectionHeading
            title={t('rides.review.rewards')}
            note={t('rides.review.rewardsNote')}
          />

          <div className="reward-featured">
            <p className="reward-featured__rate">
              {t('rides.review.pointEquals')}
              <Icon name="riyal" size={11} height={13} className="ds-icon" />
              {FEATURED_REWARD.rate}
            </p>
            <div className="reward-featured__card">
              <RewardRow reward={FEATURED_REWARD} />
            </div>
          </div>

          <div className="review-card review-card--rows">
            {REWARDS.map((reward, i) => (
              <div key={reward.id}>
                {i > 0 && <Separator />}
                <RewardRow reward={reward} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="review-bar">
        <div className="review-bar__content">
          <p className="review-bar__price">
            {t('rides.review.currency')} {car.price}
          </p>
          <button type="button" className="review-bar__link">
            {t('rides.review.priceBreakdown')}
          </button>
        </div>
        <Button variant="primary" size="default" label={t('common.continue')} onClick={submit} />
      </footer>
    </div>
  )
}
