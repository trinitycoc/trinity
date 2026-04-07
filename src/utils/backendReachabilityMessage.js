/**
 * User-facing hint when a fetch failed for network / CORS reasons (backend down, offline, etc.)
 */
export function backendReachabilityMessage(err) {
  if (!err || err.name === 'AbortError') return null
  const msg = String(err.message || '')
  const isNetwork =
    err.name === 'TypeError' || /failed to fetch|networkerror|load failed|network request failed/i.test(msg)
  if (isNetwork) {
    return 'Cannot reach the backend. Start the server (for example: cd backend && npm run dev) and check your connection.'
  }
  return null
}
