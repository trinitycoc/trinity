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

