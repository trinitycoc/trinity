// CWL utility functions

/**
 * Normalize a tag to always have # prefix
 */
export const normalizeTag = (tag) => {
  if (!tag) return null
  return tag.startsWith('#') ? tag : `#${tag}`
}

/**
 * Filter valid war tags (non-zero, non-empty)
 */
export const getValidWarTags = (warTags) => {
  if (!warTags || !Array.isArray(warTags)) return []
  return warTags.filter(tag => tag && tag !== '#0' && tag !== '0')
}

/**
 * Filter wars for a specific day/round
 */
export const filterWarsForDay = (wars, warTags, normalizeFn = normalizeTag) => {
  if (!wars || !Array.isArray(wars) || !warTags || !Array.isArray(warTags)) return []
  
  const validWarTags = getValidWarTags(warTags)
  if (validWarTags.length === 0) return []
  
  const normalizedWarTags = validWarTags.map(normalizeFn)
  
  return wars.filter(war => {
    const warTag = normalizeFn(war.warTag || war.tag)
    return warTag && normalizedWarTags.includes(warTag)
  })
}

/**
 * Sort members by map position (ascending)
 */
export const sortMembersByPosition = (members) => {
  if (!members || !Array.isArray(members)) return []
  return [...members].sort((a, b) => (a.mapPosition || 0) - (b.mapPosition || 0))
}

/**
 * Sort members by town hall level (descending)
 */
export const sortMembersByTH = (members) => {
  if (!members || !Array.isArray(members)) return []
  return [...members].sort((a, b) => (b.townHallLevel || 0) - (a.townHallLevel || 0))
}

/**
 * Format destruction percentage to 2 decimal places
 */
export const formatDestruction = (value) => {
  if (typeof value === 'number') {
    return value.toFixed(2)
  }
  return value || '0.00'
}

/**
 * Calculate CWL leaderboard stats for each clan from wars data
 * Returns an array of clan stats with rank, stars, destruction, record (wins-ties-losses), and members
 * 
 * @deprecated This function is deprecated. Use backend endpoint /cwl/:clanTag/leaderboard instead.
 * This is kept for backward compatibility only.
 */
export const calculateCWLLeaderboard = (clans, wars) => {
  if (!clans || !Array.isArray(clans) || clans.length === 0) return []
  // Allow empty wars array - will show groups with zero stats
  let warsArray = wars && Array.isArray(wars) ? wars : []

  // Deduplicate wars to prevent double-counting stars
  // Same war might appear twice (once from each clan's perspective)
  const warsMap = new Map()
  warsArray.forEach(war => {
    if (!war || !war.clan || !war.opponent) return
    
    // Create unique key for deduplication
    let warKey = war.warTag || war.tag
    
    // If no war tag, use sorted clan tags + start time for consistent key
    if (!warKey && war.clan.tag && war.opponent.tag && war.startTime) {
      const clanTags = [war.clan.tag, war.opponent.tag].sort()
      warKey = `${clanTags[0]}_${clanTags[1]}_${war.startTime}`
    }
    
    // Fallback: use start time
    if (!warKey && war.startTime) {
      warKey = `war_${war.startTime}`
    }
    
    // Only add if we haven't seen this war before
    if (warKey && !warsMap.has(warKey)) {
      warsMap.set(warKey, war)
    }
  })
  
  // Use deduplicated wars
  warsArray = Array.from(warsMap.values())

  // Initialize stats for each clan
  const clanStatsMap = new Map()
  
  clans.forEach(clan => {
    clanStatsMap.set(clan.tag, {
      tag: clan.tag,
      name: clan.name || 'Unknown',
      level: clan.level || 0,
      badgeUrls: clan.badgeUrls || {},
      shareLink: clan.shareLink || null,
      members: clan.members?.length || 0,
      totalStars: 0,
      totalDestruction: 0,
      warCount: 0,
      wins: 0,
      ties: 0,
      losses: 0
    })
  })

  // Process each war to accumulate stats
  warsArray.forEach(war => {
    if (!war || !war.clan || !war.opponent) return

    const clanTag = war.clan.tag
    const opponentTag = war.opponent.tag
    
    const clanStats = clanStatsMap.get(clanTag)
    const opponentStats = clanStatsMap.get(opponentTag)

    // Get team size for calculating actual destruction points
    // Max destruction per round = teamSize * 100 (15v15 = 1500, 30v30 = 3000)
    const teamSize = war.teamSize || 0

    if (clanStats) {
      clanStats.totalStars += war.clan.stars || 0
      // Convert destruction percentage to actual points
      // Formula: (percentage / 100) * (teamSize * 100) = percentage * teamSize
      const clanDestructionPoints = (war.clan.destructionPercentage || 0) * teamSize
      clanStats.totalDestruction += clanDestructionPoints
      clanStats.warCount += 1
    }

    if (opponentStats) {
      opponentStats.totalStars += war.opponent.stars || 0
      // Convert destruction percentage to actual points
      // Formula: (percentage / 100) * (teamSize * 100) = percentage * teamSize
      const opponentDestructionPoints = (war.opponent.destructionPercentage || 0) * teamSize
      opponentStats.totalDestruction += opponentDestructionPoints
      opponentStats.warCount += 1
    }

    // Determine win/loss/tie
    const clanStars = war.clan.stars || 0
    const opponentStars = war.opponent.stars || 0
    const clanDestruction = war.clan.destructionPercentage || 0
    const opponentDestruction = war.opponent.destructionPercentage || 0

    if (clanStats && opponentStats) {
      if (clanStars > opponentStars) {
        clanStats.wins += 1
        opponentStats.losses += 1
      } else if (clanStars < opponentStars) {
        clanStats.losses += 1
        opponentStats.wins += 1
      } else {
        // Tie on stars, check destruction
        if (clanDestruction > opponentDestruction) {
          clanStats.wins += 1
          opponentStats.losses += 1
        } else if (clanDestruction < opponentDestruction) {
          clanStats.losses += 1
          opponentStats.wins += 1
        } else {
          // Complete tie
          clanStats.ties += 1
          opponentStats.ties += 1
        }
      }
    }
  })

  // Convert map to array and calculate average destruction
  const leaderboard = Array.from(clanStatsMap.values()).map(stats => ({
    ...stats,
    averageDestruction: stats.warCount > 0 ? stats.totalDestruction / stats.warCount : 0,
    record: `${stats.wins}-${stats.ties}-${stats.losses}`
  }))

  // Sort by stars (descending), then by destruction (descending)
  leaderboard.sort((a, b) => {
    if (b.totalStars !== a.totalStars) {
      return b.totalStars - a.totalStars
    }
    return b.averageDestruction - a.averageDestruction
  })

  // Add rank
  leaderboard.forEach((stats, index) => {
    stats.rank = index + 1
  })

  return leaderboard
}

/**
 * Get promotion and demotion slots based on league name
 * @param {string} leagueName - League name (e.g., "Master I", "Crystal II", "Bronze III")
 * @returns {Object} Object with promotionCount and demotionCount
 */
export const getPromotionDemotionSlots = (leagueName) => {
  if (!leagueName) {
    return { promotionCount: 0, demotionCount: 0 }
  }

  const leagueNameUpper = leagueName.toUpperCase()
  
  // Bronze III: 3 promoted, 0 demoted
  if (leagueNameUpper.includes('BRONZE') && leagueNameUpper.includes('III')) {
    return { promotionCount: 3, demotionCount: 0 }
  }
  
  // Bronze I & II: 3 promoted, 2 demoted
  if (leagueNameUpper.includes('BRONZE') && (leagueNameUpper.includes('I') || leagueNameUpper.includes('II'))) {
    return { promotionCount: 3, demotionCount: 2 }
  }
  
  // Champion I: 0 promoted, 2 demoted
  if (leagueNameUpper.includes('CHAMPION') && leagueNameUpper.includes('I') && !leagueNameUpper.includes('II') && !leagueNameUpper.includes('III')) {
    return { promotionCount: 0, demotionCount: 2 }
  }
  
  // Silver III to Champion II: 2 promoted, 2 demoted
  // This includes: Silver I, II, III; Gold I, II, III; Crystal I, II, III; Master I, II, III; Champion II, III
  return { promotionCount: 2, demotionCount: 2 }
}

/**
 * Check if a rank is in promotion zone
 * @param {number} rank - Clan rank (1-8)
 * @param {number} promotionCount - Number of promotion slots
 * @returns {boolean}
 */
export const isPromotionRank = (rank, promotionCount) => {
  return rank <= promotionCount
}

/**
 * Check if a rank is in demotion zone
 * @param {number} rank - Clan rank (1-8)
 * @param {number} demotionCount - Number of demotion slots
 * @returns {boolean}
 */
export const isDemotionRank = (rank, demotionCount) => {
  if (demotionCount === 0) return false
  return rank > (8 - demotionCount)
}

