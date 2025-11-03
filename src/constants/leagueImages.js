// Use direct paths since files are in public folder
// Vite serves files from public/ at the root path
export const leagueImages = {
  // Format with "League" (from API)
  'Bronze League I': '/bronze1.png',
  'Bronze League II': '/bronze2.png',
  'Bronze League III': '/bronze3.png',
  'Silver League I': '/silver1.png',
  'Silver League II': '/silver2.png',
  'Silver League III': '/silver3.png',
  'Gold League I': '/gold1.png',
  'Gold League II': '/gold2.png',
  'Gold League III': '/gold3.png',
  'Crystal League I': '/crystal1.png',
  'Crystal League II': '/crystal2.png',
  'Crystal League III': '/crystal3.png',
  'Master League I': '/master1.png',
  'Master League II': '/master2.png',
  'Master League III': '/master3.png',
  'Champion League I': '/champion1.png',
  'Champion League II': '/champion2.png',
  'Champion League III': '/champion3.png',
  // Format without "League" (fallback)
  'Bronze I': '/bronze1.png',
  'Bronze II': '/bronze2.png',
  'Bronze III': '/bronze3.png',
  'Silver I': '/silver1.png',
  'Silver II': '/silver2.png',
  'Silver III': '/silver3.png',
  'Gold I': '/gold1.png',
  'Gold II': '/gold2.png',
  'Gold III': '/gold3.png',
  'Crystal I': '/crystal1.png',
  'Crystal II': '/crystal2.png',
  'Crystal III': '/crystal3.png',
  'Master I': '/master1.png',
  'Master II': '/master2.png',
  'Master III': '/master3.png',
  'Champion I': '/champion1.png',
  'Champion II': '/champion2.png',
  'Champion III': '/champion3.png'
}

/**
 * Get league image by league name
 * @param {string} leagueName - League name (e.g., "Master I", "Crystal III")
 * @returns {string|null} Image path or null if not found
 */
export const getLeagueImage = (leagueName) => {
  if (!leagueName) return null
  return leagueImages[leagueName] || null
}

