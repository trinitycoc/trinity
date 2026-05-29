/**
 * Plain-language message when a fetch failed (offline, server unavailable, etc.)
 */
export function backendReachabilityMessage(err) {
  if (!err || err.name === 'AbortError') return null

  const msg = String(err.message || '')
  const isNetwork =
    err.name === 'TypeError' ||
    /failed to fetch|networkerror|load failed|network request failed/i.test(msg)

  if (isNetwork) {
    return "We couldn't reach our servers. Please check your internet connection, wait a moment, and refresh the page."
  }

  if (/\b(500|502|503|504)\b/.test(msg) || /service unavailable|bad gateway/i.test(msg)) {
    return 'Our service is temporarily unavailable. Please try again in a few minutes.'
  }

  return null
}
