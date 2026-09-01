import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The design-system package's `exports` map only exposes "." and "./dist/index.css",
// so its icon SVGs can't be reached by bare specifier. Alias straight to the folder
// on disk to use the line-icons / airline-logos / logotypes assets.
const dsIcons = fileURLToPath(
  new URL('./node_modules/design-system/src/icons', import.meta.url),
)

export default defineConfig({
  // The prototype is served from wherever the host tool unpacks it, not from a
  // domain root, so asset URLs have to be relative — Vite's default "/" makes
  // them absolute and they 404 off-root. This also covers public/favicon.svg,
  // which is copied verbatim and so can't be inlined below.
  base: './',
  plugins: [react()],
  resolve: {
    alias: { '@ds-icons': dsIcons },
  },
  build: {
    // Inline every imported asset as a data URI (the largest is the 667 KB
    // hero) instead of emitting sibling files, so the build is a single JS +
    // CSS pair that survives a host which only takes the source. The design
    // system raises this limit on its own icons for the same reason.
    assetsInlineLimit: 1024 * 1024,
  },
})
