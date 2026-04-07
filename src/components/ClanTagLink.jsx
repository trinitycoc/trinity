import { Link } from 'react-router-dom'

/**
 * HashRouter path for a CoC clan tag (tag with or without leading #).
 * Returns null if the value is not a usable clan tag.
 */
export function clanTagToPath (tag) {
  if (tag == null) return null
  const s = String(tag).trim()
  if (!s || /^n\/a$/i.test(s)) return null
  const stripped = s.replace(/^#/, '').trim()
  if (!stripped) return null
  return `/clans/${encodeURIComponent(stripped)}`
}

/**
 * Renders an in-app link to the clan details page. Non-link fallback for missing/invalid tags.
 */
export default function ClanTagLink ({ tag, className = '', children, stopPropagation = false }) {
  const path = clanTagToPath(tag)
  const label = children !== undefined && children !== null ? children : (tag ?? '')
  if (!path) {
    return <span className={className}>{label}</span>
  }
  const combined = className ? `${className} clan-tag-link`.trim() : 'clan-tag-link'
  return (
    <Link
      to={path}
      className={combined}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      {label}
    </Link>
  )
}
