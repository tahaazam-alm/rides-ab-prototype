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
  // Where to return to when Landing is closed. `null` means the reviewer is on
  // first-run (no screen underneath) and close falls back to 'home' so the app
  // is still useable if the picker is dismissed.
  const [previousScreen, setPreviousScreen] = useState(null)
  // Bumped every time the reviewer starts a fresh prototype run (Landing's
  // primary CTA), which keys Home and RidesFlow so they remount from clean
  // state — any pickup / destination / date / time / flight the previous run
  // left behind is dropped, so the demo always begins from empty.
  const [session, setSession] = useState(0)
  const [ridesVisited, setRidesVisited] = useState(false)
  const [variant, setVariant] = useState(() => initialArm('variant', ['v1', 'v2']))
  // Arabic is the default language; the Landing lets the reviewer flip to
  // English and the DS provider's `dir` keys off it so the whole app
  // (including RTL layout) follows the choice.
  const [lang, setLang] = useState('ar')
  // Light is the app's default theme; the reviewer can flip to dark from the
  // Landing picker and the choice persists to every downstream screen because
  // the design system's tokens flip via `[data-theme='dark']` on the document
  // root.
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Shared "open the settings panel" — used by both the three-finger tap and
  // the debugger button below. Guards against re-triggering when Landing is
  // already open so extra fingers / double-clicks don't clobber the saved
  // previousScreen.
  const openLanding = () => {
    setScreen((current) => {
      if (current === 'landing') return current
      setPreviousScreen(current)
      return 'landing'
    })
  }

  // Three-finger tap anywhere in the app re-opens the Landing so a reviewer
  // can switch variant / language / theme mid-session without a hard reload.
  // touchstart fires per finger going down; the `>= 3` check catches the
  // moment the third finger lands.
  useEffect(() => {
    const onTouchStart = (e) => {
      if (e.touches.length < 3) return
      openLanding()
    }
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    return () => document.removeEventListener('touchstart', onTouchStart)
  }, [])

  const closeLanding = () => {
    setScreen(previousScreen ?? 'home')
    setPreviousScreen(null)
  }

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
              onContinue={() => {
                // Fresh run: drop any state left behind by the last session by
                // bumping the key on the funnels below and forcing Rides back
                // to its unvisited state. `previousScreen` is cleared so a
                // later triple-tap → close doesn't try to restore the stale
                // Rides screen.
                setSession((n) => n + 1)
                setRidesVisited(false)
                setPreviousScreen(null)
                setScreen('home')
              }}
              onClose={closeLanding}
            />
          )}

          <div hidden={screen !== 'home'}>
            <Home key={`home-${session}`} onOpenProduct={openProduct} />
          </div>

          {ridesVisited && (
            <div hidden={screen !== 'rides'}>
              <RidesFlow
                key={`rides-${session}`}
                variant={variant}
                onVariantChange={setVariant}
                onExit={() => setScreen('home')}
              />
            </div>
          )}

          {/* iOS-Debug-style prototype settings shortcut. Rendered only on the
              home screen (the app's default resting state), tap opens the
              Landing panel — the same door as the three-finger tap gesture,
              but visible for reviewers on desktop or in a preview iframe
              where multi-touch isn't available. */}
          {screen === 'home' && (
            <button
              type="button"
              className="debug-btn"
              onClick={openLanding}
              aria-label="Prototype settings"
              title="Prototype settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 6h12M4 12h16M4 18h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="18" cy="6" r="2.4" fill="currentColor" />
                <circle cx="6" cy="12" r="2.4" fill="currentColor" />
                <circle cx="16" cy="18" r="2.4" fill="currentColor" />
              </svg>
            </button>
          )}
          </div>
        </DesignSystemProvider>
      </ThemeProvider>
    </LangProvider>
  )
}

export default App
