import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { fetchActiveCWLClanTags } from '../services/api'

const CWLContext = createContext()

export const useCWL = () => {
  const context = useContext(CWLContext)
  if (!context) {
    throw new Error('useCWL must be used within a CWLProvider')
  }
  return context
}

function normalizeClanTagForLookup(tag) {
  if (!tag) return ''
  return tag.startsWith('#') ? tag : `#${tag}`
}

export const CWLProvider = ({ children }) => {
  const [cwlClanTags, setCwlClanTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCWLTags = async () => {
      try {
        setLoading(true)
        const tags = await fetchActiveCWLClanTags()
        setCwlClanTags(tags)
        setError(null)
      } catch (err) {
        console.error('Error fetching CWL clan tags:', err)
        setError(err.message)
        // Set empty array on error so app can still function
        setCwlClanTags([])
      } finally {
        setLoading(false)
      }
    }

    fetchCWLTags()
  }, [])

  const cwlTagSet = useMemo(() => {
    const s = new Set()
    for (const t of cwlClanTags) {
      if (!t) continue
      s.add(t)
      s.add(normalizeClanTagForLookup(t))
    }
    return s
  }, [cwlClanTags])

  const isCWLClan = useCallback(
    (clanTag) => {
      if (!clanTag) return false
      return cwlTagSet.has(clanTag) || cwlTagSet.has(normalizeClanTagForLookup(clanTag))
    },
    [cwlTagSet]
  )

  const value = useMemo(
    () => ({
      cwlClanTags,
      loading,
      error,
      isCWLClan
    }),
    [cwlClanTags, loading, error, isCWLClan]
  )

  return <CWLContext.Provider value={value}>{children}</CWLContext.Provider>
}

