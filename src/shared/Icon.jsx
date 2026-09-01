/**
 * Design-system icons are inlined as raw SVG (through the `@ds-icons` alias in
 * vite.config.js) so they tint from `currentColor`, the same way the design
 * system does internally. Each feature folder owns its own glyph map and binds
 * it here, so the render logic stays in one place as the app grows.
 *
 * Colourful icons — product icons, visual icons, logotypes — are brand assets
 * with baked-in fills, so those are imported as plain URLs and rendered as
 * `<img>` instead of going through here.
 */
export function makeIcon(RAW) {
  /**
   * Renders one of the bound icons at `size`px, tinted by the parent's colour.
   * `height` only needs passing for a glyph that isn't square.
   */
  return function Icon({ name, size = 24, height = size, className }) {
    const svg = RAW[name]
    if (!svg) return null
    return (
      <span
        className={className}
        style={{ display: 'inline-flex', width: size, height, flex: 'none' }}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }
}
