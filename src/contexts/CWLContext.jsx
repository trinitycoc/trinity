import { useState, useEffect } from 'react'
import { fetchIsCWLClan } from '../services/api'

/**
 * Whether the given clan tag is an active CWL satellite (fetches once per tag).
 */
export const useIsCWLClan = (clanTag) => {
  const [isCWLClan, setIsCWLClan] = useState(false)
  const [loading, setLoading] = useState(Boolean(clanTag))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!clanTag) {
      setIsCWLClan(false)
      setLoading(false)
      setError(null)
      return
    }

    const ac = new AbortController()
    setLoading(true)
    setError(null)

    fetchIsCWLClan(clanTag, ac.signal)
      .then((result) => {
        if (!ac.signal.aborted) setIsCWLClan(result)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error('Error checking CWL clan:', err)
        if (!ac.signal.aborted) {
          setError(err.message)
          setIsCWLClan(false)
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false)
      })

    return () => ac.abort()
  }, [clanTag])

  return { isCWLClan, loading, error }
}
