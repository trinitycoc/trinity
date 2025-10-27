// API client for making requests to the backend server

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://trinity-backend-6qzr.onrender.com/api'

/**
 * Fetch a single clan by tag
 */
export const fetchClan = async (clanTag) => {
  try {
    // Remove # from tag for URL encoding
    const encodedTag = encodeURIComponent(clanTag.replace('#', ''))
    const response = await fetch(`${API_BASE_URL}/clans/${encodedTag}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch clan: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching clan:', error)
    throw error
  }
}

/**
 * Fetch multiple clans by tags
 */
export const fetchMultipleClans = async (clanTags) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clans/multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clanTags }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch clans: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching multiple clans:', error)
    throw error
  }
}

/**
 * Get current war for a clan
 */
export const fetchClanWar = async (clanTag) => {
  try {
    const encodedTag = encodeURIComponent(clanTag.replace('#', ''))
    const response = await fetch(`${API_BASE_URL}/clans/${encodedTag}/war`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch war data: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching war data:', error)
    throw error
  }
}

/**
 * Get war log for a clan
 */
export const fetchClanWarLog = async (clanTag) => {
  try {
    const encodedTag = encodeURIComponent(clanTag.replace('#', ''))
    const response = await fetch(`${API_BASE_URL}/clans/${encodedTag}/warlog`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch war log: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching war log:', error)
    throw error
  }
}

/**
 * Get capital raid seasons for a clan
 */
export const fetchClanCapitalRaids = async (clanTag) => {
  try {
    const encodedTag = encodeURIComponent(clanTag.replace('#', ''))
    const response = await fetch(`${API_BASE_URL}/clans/${encodedTag}/capitalraids`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch capital raids: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching capital raids:', error)
    throw error
  }
}

/**
 * Check if backend server is running
 */
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    
    if (!response.ok) {
      return false
    }
    
    const data = await response.json()
    return data.status === 'ok'
  } catch (error) {
    return false
  }
}

// ============================================
// GOOGLE SHEETS ENDPOINTS
// ============================================

/**
 * Fetch Trinity clan tags from Google Sheets (via backend)
 */
export const fetchTrinityClansFromSheet = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sheets/trinity-clans`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Trinity clans: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.clanTags
  } catch (error) {
    console.error('Error fetching Trinity clans:', error)
    throw error
  }
}

/**
 * Fetch CWL clan tags from Google Sheets (via backend)
 */
export const fetchCWLClansFromSheet = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sheets/cwl-clans`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CWL clans: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.clanTags
  } catch (error) {
    console.error('Error fetching CWL clans:', error)
    throw error
  }
}

/**
 * Fetch CWL clan details from Google Sheets (via backend)
 */
export const fetchCWLClansDetailsFromSheet = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sheets/cwl-clans-details`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CWL clan details: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.clans
  } catch (error) {
    console.error('Error fetching CWL clan details:', error)
    throw error
  }
}

/**
 * Fetch all sheets data in one call
 */
export const fetchAllSheetsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sheets/all`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheets data: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching all sheets data:', error)
    throw error
  }
}

// ============================================
// CWL ENDPOINTS
// ============================================

/**
 * Get filtered CWL clans (with all logic applied on backend)
 * @param {boolean} showAll - If true, returns all clans without filtering
 */
export const fetchFilteredCWLClans = async (showAll = false) => {
  try {
    const url = showAll 
      ? `${API_BASE_URL}/cwl/clans?all=true`
      : `${API_BASE_URL}/cwl/clans`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch filtered CWL clans: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.clans
  } catch (error) {
    console.error('Error fetching filtered CWL clans:', error)
    throw error
  }
}

// ============================================
// STATS ENDPOINTS
// ============================================

/**
 * Get aggregated stats for a clan
 */
export const fetchClanStats = async (clanTag) => {
  try {
    const encodedTag = encodeURIComponent(clanTag.replace('#', ''))
    const response = await fetch(`${API_BASE_URL}/stats/clans/${encodedTag}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch clan stats: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching clan stats:', error)
    throw error
  }
}

/**
 * Get TH distribution for a clan
 */
export const fetchClanTHDistribution = async (clanTag) => {
  try {
    const encodedTag = encodeURIComponent(clanTag.replace('#', ''))
    const response = await fetch(`${API_BASE_URL}/stats/clans/${encodedTag}/th-distribution`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch TH distribution: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching TH distribution:', error)
    throw error
  }
}

/**
 * Get Trinity family-wide statistics
 */
export const fetchTrinityFamilyStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/family`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch family stats: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching family stats:', error)
    throw error
  }
}

// ============================================
// CACHE ENDPOINTS
// ============================================

/**
 * Get cache statistics
 */
export const fetchCacheStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cache/stats`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cache stats: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching cache stats:', error)
    throw error
  }
}

/**
 * Clear all cache
 */
export const clearCache = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cache/flush`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to clear cache: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error clearing cache:', error)
    throw error
  }
}

