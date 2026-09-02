import { AlmosaferLogo, Button, SegmentedControl, Tag } from 'design-system'
import gbFlag from '@ds-icons/logotypes/flags/gb.svg'
import saFlag from '@ds-icons/logotypes/flags/sa.svg'
import { useT } from '../i18n.jsx'

const THEMES = ['light', 'dark']

/**
 * First-run configuration screen for the prototype — an iOS-Debug-style dark
 * settings screen for picking which arm and which language the review session
 * should run in, plus the app-wide appearance.
 *
 * Selectable choices carry an aqua radio; gated ones (v2, Arabic) carry a
 * "Coming soon" tag in place of the radio and are non-interactive. Deep links
 * with `?variant=…` skip this screen entirely, so a reviewer who already
 * knows the arm doesn't have to click through the picker.
 */
export function Landing({
  variant,
  onVariantChange,
  lang,
  onLangChange,
  theme,
  onThemeChange,
  onContinue,
}) {
  const t = useT()
  // Section labels stay bilingual so the traveller sees both languages while
  // still choosing which one to run in. The variant cards flip based on the
  // active language, so previewing a variant reads in the language the app
  // would actually run in.
  const themeLabels = [`☀️  ${t('landing.light')}`, `🌙  ${t('landing.dark')}`]

  return (
    <div className="landing">
      <div className="landing__inner">
        <header className="landing__brand">
          <div className="landing__icon">
            <AlmosaferLogo type="applogo" variant="colour" width={64} />
          </div>
          <h1 className="landing__name">Almosafer</h1>
          <div className="landing__tagline">
            <p>{t('landing.taglineEn')}</p>
            <p lang="ar" dir="rtl">
              {t('landing.taglineAr')}
            </p>
          </div>
        </header>

        <section className="landing__section">
          <h2 className="landing__section-label">{t('landing.appearance')}</h2>
          <SegmentedControl
            items={themeLabels}
            value={THEMES.indexOf(theme)}
            onChange={(index) => onThemeChange(THEMES[index])}
          />
        </section>

        <section className="landing__section">
          <h2 className="landing__section-label">
            {t('landing.searchVersion')}
          </h2>
          <div className="landing__options">
            <LandingCard
              selected={variant === 'v1'}
              onSelect={() => onVariantChange('v1')}
              title={t('landing.variant1')}
              subtitle={t('landing.variant1Sub')}
            />
            <LandingCard
              selected={variant === 'v2'}
              onSelect={() => onVariantChange('v2')}
              title={t('landing.variant2')}
              subtitle={t('landing.variant2Sub')}
            />
          </div>
        </section>

        <section className="landing__section">
          <h2 className="landing__section-label">
            {t('landing.chooseLanguage')}
          </h2>
          <div className="landing__options">
            <LandingCard
              selected={lang === 'en'}
              onSelect={() => onLangChange('en')}
              leading={
                <img className="landing__flag" src={gbFlag} alt="" />
              }
              title={t('landing.english')}
              subtitle={t('landing.englishSub')}
            />
            <LandingCard
              selected={lang === 'ar'}
              onSelect={() => onLangChange('ar')}
              rtl
              leading={
                <img className="landing__flag" src={saFlag} alt="" />
              }
              title={t('landing.arabic')}
              subtitle={t('landing.arabicSub')}
            />
          </div>
        </section>

        <div className="landing__actions">
          <Button
            variant="primary"
            label={t('common.startPrototype')}
            onClick={onContinue}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * One row of the settings list — leading visual, title + subtitle stack,
 * trailing radio (or "Coming soon" tag when disabled). The whole card is the
 * tap target, matching how iOS settings cells work. `rtl` flips the row so
 * the Arabic label reads from the trailing edge.
 */
function LandingCard({
  selected,
  disabled,
  onSelect,
  leading,
  title,
  subtitle,
  tag,
  rtl,
}) {
  return (
    <button
      type="button"
      className={
        'landing-card' +
        (selected ? ' landing-card--selected' : '') +
        (disabled ? ' landing-card--disabled' : '')
      }
      disabled={disabled}
      onClick={onSelect}
      dir={rtl ? 'rtl' : undefined}
    >
      {leading && <span className="landing-card__leading">{leading}</span>}
      <span className="landing-card__body">
        <span className="landing-card__title">{title}</span>
        {subtitle && (
          <span className="landing-card__subtitle">{subtitle}</span>
        )}
      </span>
      <span className="landing-card__trailing">
        {tag ? (
          <Tag label={tag} variant="neutral" style="tinted" />
        ) : (
          <span
            className={
              'landing-card__radio' +
              (selected ? ' landing-card__radio--selected' : '')
            }
          />
        )}
      </span>
    </button>
  )
}
