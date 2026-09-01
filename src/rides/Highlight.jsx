const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Renders `text` with every occurrence of `query` marked. The row itself stays
 * in the default ink — only the characters the user typed are highlighted.
 */
export function Highlight({ text, query }) {
  const q = query.trim()
  if (!q) return text

  const parts = text.split(new RegExp(`(${escape(q)})`, 'ig'))
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
