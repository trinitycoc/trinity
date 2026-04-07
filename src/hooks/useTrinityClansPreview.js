import { useEffect, useState } from 'react'
import { fetchTrinityClansBundled } from '../services/api'

function useTrinityClansPreview(limit = 3) {
  const [clanCount, setClanCount] = useState(0)
  const [clans, setClans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    const ac = new AbortController()

    const loadClans = async () => {
      setLoading(true)
      setError(null)

      try {
        const bundledLimit = limit <= 0 ? 0 : limit
        const data = await fetchTrinityClansBundled(bundledLimit, ac.signal)
        if (!isMounted) return

        const total =
          typeof data.totalTagCount === 'number'
            ? data.totalTagCount
            : (Array.isArray(data.clanTags) ? data.clanTags.length : 0)
        setClanCount(total)
        setClans(Array.isArray(data.clans) ? data.clans : [])
      } catch (err) {
        if (!isMounted || err.name === 'AbortError') return
        console.error('Error loading Trinity preview clans:', err)
        setError('Unable to load clan list right now.')
        setClanCount(0)
        setClans([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadClans()

    return () => {
      isMounted = false
      ac.abort()
    }
  }, [limit])

  return { clanCount, clans, loading, error }
}

export default useTrinityClansPreview

