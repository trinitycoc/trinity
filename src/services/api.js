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

