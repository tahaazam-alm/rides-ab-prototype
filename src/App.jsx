import { useEffect, useState } from 'react'
import { DesignSystemProvider } from 'design-system'
import { Home } from './home/Home'
import { Landing } from './landing/Landing'
import { RidesFlow } from './rides/RidesFlow'
import { LangProvider, ThemeProvider } from './i18n.jsx'
import 'design-system/dist/index.css'
import './landing/landing.css'

/**
 * App shell. A first-run Landing screen picks the arm and language for the
 * session, then hands off to the home screen that is the entry point for
 * every product. Each funnel mounts on first entry and stays mounted (hidden
 * behind the current screen), so leaving one and coming back keeps the trip
 * the traveller had already described.
 */

/**
 * Which arm of the Rides A/B test to open in. Stands in for the experiment
 * platform's assignment, so a link can pin the arm being reviewed
 * (?variant=v2) instead of having it switched by hand every time.
 */
const initialArm = (key, allowed) => {
  const value = new URLSearchParams(window.location.search).get(key)
  return allowed.includes(value) ? value : allowed[0]
}

// A ?variant= in the URL is a deep-link into a specific arm and skips the
// Landing gate — reviewers who already know the arm they want shouldn't have
// to click through the picker. Read once at load so a later replaceState
// (should we add one) doesn't re-hide the screen mid-session.
const HAS_VARIANT_PARAM = new URLSearchParams(window.location.search).has(
  'variant',
)

function App() {
  const [screen, setScreen] = useState(
    HAS_VARIANT_PARAM ? 'home' : 'landing',
  ) // 'landing' | 'home' | 'rides'
  const [ridesVisited, setRidesVisited] = useState(false)
  const [variant, setVariant] = useState(() => initialArm('variant', ['v1', 'v2']))
  // Only 'en' is wired today; the Landing offers 'ar' behind a Coming-soon
  // gate. The DS provider's `dir` still keys off it so the wiring is ready.
  const [lang, setLang] = useState('en')
  // Landing defaults to dark to match the iOS-Debug-style reference; the
  // toggle then persists to every downstream screen because the design
  // system's tokens flip via `[data-theme='dark']` on the document root.
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Returning `true` tells the homepage the tap was routed somewhere; anything
  // still unbuilt falls through to its "coming soon" toast.
  const openProduct = (product) => {
    if (product.id !== 'rides') return false
    setRidesVisited(true)
    setScreen('rides')
    return true
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  return (
    <LangProvider lang={lang}>
      <ThemeProvider theme={theme}>
        <DesignSystemProvider platform="ios" dir={dir}>
        {/* `dir` is set on the outer wrapper so browser layout (grids, flex
            row order, text alignment) actually flips — the DS provider only
            broadcasts `dir` as context to its own components, not as a
            cascading HTML attribute for regular content. */}
        <div className="app" dir={dir}>
          {screen === 'landing' && (
            <Landing
              variant={variant}
              onVariantChange={setVariant}
              lang={lang}
              onLangChange={setLang}
              theme={theme}
              onThemeChange={setTheme}
              onContinue={() => setScreen('home')}
            />
          )}

          <div hidden={screen !== 'home'}>
            <Home onOpenProduct={openProduct} />
          </div>

          {ridesVisited && (
            <div hidden={screen !== 'rides'}>
              <RidesFlow
                variant={variant}
                onVariantChange={setVariant}
                onExit={() => setScreen('home')}
              />
            </div>
          )}
          </div>
        </DesignSystemProvider>
      </ThemeProvider>
    </LangProvider>
  )
}

export default App
