import { useCallback, useState } from 'react'
import { AlmosaferLogo, GlassButton, Snackbar, Tag, TabBar } from 'design-system'
import { DEALS, PRODUCTS, SERVICES, TABS } from './data'
import { Icon } from './icons'
import { useT } from '../i18n.jsx'
import './home.css'

/** One of the four funnel entry tiles. */
function ProductTile({ product, label, onOpen }) {
  const t = useT()
  return (
    <button type="button" className="product-tile" onClick={onOpen}>
      <img className="product-tile__icon" src={product.icon} alt="" />
      <span className="product-tile__label">{label}</span>
      {product.tag && (
        <span className="product-tile__tag">
          <Tag
            label={product.tag === 'New' ? t('common.new') : product.tag}
            variant="success"
            style="filled"
          />
        </span>
      )}
    </button>
  )
}

/** One entry on the secondary services shelf. */
function ServiceTile({ service, label, onOpen }) {
  return (
    <button type="button" className="service-tile" onClick={onOpen}>
      <span className="service-tile__disc">
        <img className="service-tile__icon" src={service.icon} alt="" />
      </span>
      <span className="service-tile__label">{label}</span>
    </button>
  )
}

function DealCard({ deal, onOpen, onCopy }) {
  const t = useT()
  return (
    <article className="deal">
      <button type="button" className="deal__image" onClick={onOpen}>
        <img src={deal.image} alt={deal.title} />
      </button>

      {/* Frosted panel over a mirrored copy of the card's own image — the
          reflection the Figma card carries under its text section. */}
      <div className="deal__text">
        <img className="deal__reflection" src={deal.image} alt="" aria-hidden="true" />
        <p className="deal__title">{deal.title}</p>

        {/* An automatic offer has no code, but the pill keeps its space (hidden,
            so it leaves the tab order too) and the two cards in a row stay the
            same height. */}
        <button
          type="button"
          className={`deal__coupon${deal.code ? '' : ' deal__coupon--empty'}`}
          onClick={() => onCopy(deal.code)}
        >
          <span className="deal__coupon-text">
            {t('home.dealCode')} <b>{deal.code}</b>
          </span>
          <Icon name="copy" className="ds-icon deal__copy" />
        </button>
      </div>
    </article>
  )
}

/**
 * App homepage — the entry point into every product and funnel.
 *
 * `onOpenProduct` / `onOpenService` return `true` when they navigated
 * somewhere; anything still unbuilt falls through to a toast, so the entries
 * read as real while the remaining flows are added one at a time.
 */
export function Home({ onOpenProduct, onOpenService }) {
  const t = useT()
  const [tab, setTab] = useState(0)
  const [toast, setToast] = useState('')

  // The DS Snackbar restarts its dismiss timer whenever `onClose` changes
  // identity, so this has to be stable across renders.
  const dismissToast = useCallback(() => setToast(''), [])

  const productLabel = (product) => t(`home.product.${product.id}`)
  const serviceLabel = (service) => t(`home.service.${service.id}`)
  const tabLabel = (tab) => t(`home.tab.${tab.id}`)

  const open = (handler, item, label) => {
    if (!handler?.(item)) setToast(`${label} ${t('home.comingSoon')}`)
  }

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code)
    setToast(`${t('home.dealCode')} ${code} ${t('home.copied')}`)
  }

  return (
    <div className="home">
      <div className="home__blob" aria-hidden="true" />

      <div className="home__scroll">
        <header className="home__header">
          <AlmosaferLogo type="wordmark" variant="colour" lang="en" width={132} />
          <GlassButton
            bg="primary"
            type="label"
            label={t('home.signUp')}
            onClick={() => setToast(`${t('home.signUp')} ${t('home.comingSoon')}`)}
          />
        </header>

        <nav className="home__products" aria-label="Products">
          {PRODUCTS.map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              label={productLabel(product)}
              onOpen={() => open(onOpenProduct, product, productLabel(product))}
            />
          ))}
        </nav>

        <nav className="home__services" aria-label="Services">
          {SERVICES.map((service) => (
            <ServiceTile
              key={service.id}
              service={service}
              label={serviceLabel(service)}
              onOpen={() => open(onOpenService, service, serviceLabel(service))}
            />
          ))}
        </nav>

        <section className="home__deals">
          <div className="home__section-title">
            <h2>{t('home.specialDeals')}</h2>
            <button
              type="button"
              className="home__view-all"
              onClick={() => setToast(`${t('home.viewAll')} ${t('home.comingSoon')}`)}
            >
              {t('home.viewAll')}
            </button>
          </div>

          <div className="home__deal-grid">
            {DEALS.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onOpen={() => setToast(`${deal.title} — ${t('home.offerDetails')}`)}
                onCopy={copyCode}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Pinned outside the scroll container so the glass pill floats over the
          content instead of scrolling away with it. */}
      <div className="home__tabbar">
        <TabBar
          items={TABS.map((tabItem) => ({
            icon: <Icon name={tabItem.icon} className="ds-icon" />,
            label: tabLabel(tabItem),
          }))}
          value={tab}
          onChange={(next) => {
            // Home is the only destination built so far, so the selection stays
            // put rather than highlighting a tab with nothing behind it.
            if (next === 0) setTab(next)
            else setToast(`${tabLabel(TABS[next])} ${t('home.comingSoon')}`)
          }}
        />
      </div>

      <Snackbar message={toast} show={!!toast} onClose={dismissToast} />
    </div>
  )
}
