import { useState, useEffect } from 'react'
import { fetchCWLStatus, fetchCWLGroup, fetchCWLWarByTag } from '../services/api'
import { getValidWarTags, filterWarsForDay } from '../utils/cwlUtils'

/**
 * Hook for fetching and managing CWL status
 */
export const useCWLStatus = (clanTag) => {
  const [cwlStatus, setCwlStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!clanTag) return

    const fetchStatus = async () => {
      setLoading(true)
      try {
        const status = await fetchCWLStatus(clanTag)
        setCwlStatus(status)
      } catch (err) {
        console.error('Error fetching CWL status:', err)
        setCwlStatus({ error: err.message })
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [clanTag])

  return { cwlStatus, loading }
}

/**
 * Hook for fetching and managing CWL group data
 */
export const useCWLGroup = (clanTag, shouldFetch) => {
  const [cwlGroupData, setCwlGroupData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!shouldFetch || !clanTag || cwlGroupData || loading) return

    const fetchGroupData = async () => {
      setLoading(true)
      try {
        const data = await fetchCWLGroup(clanTag, true)
        setCwlGroupData(data)
      } catch (err) {
        console.error('Error fetching CWL group data:', err)
        setCwlGroupData({ error: err.message })
      } finally {
        setLoading(false)
      }
    }

    fetchGroupData()
  }, [shouldFetch, clanTag, cwlGroupData, loading])

  return { cwlGroupData, loading }
}

/**
 * Hook for fetching wars for a selected day/round
 */
export const useCWLDailyWars = (selectedDay, cwlGroupData, clanTag) => {
  const [fetchedWarsForDay, setFetchedWarsForDay] = useState([])
  const [fetchedWarsByRound, setFetchedWarsByRound] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedDay || !cwlGroupData?.group?.rounds || !clanTag) {
      setFetchedWarsForDay([])
      return
    }

    const selectedRound = cwlGroupData.group.rounds.find(r => r.round === selectedDay)
    if (!selectedRound || !selectedRound.warTags) {
      setFetchedWarsForDay([])
      return
    }

    const validWarTags = getValidWarTags(selectedRound.warTags)
    if (validWarTags.length === 0) {
      setFetchedWarsForDay([])
      return
    }

    // Check if we already have wars in loaded data
    let warsForDay = filterWarsForDay(
      cwlGroupData.allWars || [],
      selectedRound.warTags
    )

    if (warsForDay.length === 0 && cwlGroupData.currentWars) {
      warsForDay = filterWarsForDay(
        cwlGroupData.currentWars,
        selectedRound.warTags
      )
    }

    // If no wars found in loaded data, automatically fetch them
    if (warsForDay.length === 0 && validWarTags.length > 0) {
      const fetchAllWars = async () => {
        setLoading(true)
        setFetchedWarsForDay([])
        try {
          const warPromises = validWarTags.map(tag =>
            fetchCWLWarByTag(tag, clanTag).catch(err => {
              console.error(`Error fetching war ${tag}:`, err)
              return null
            })
          )
          const wars = await Promise.all(warPromises)
          const validWars = wars.filter(war => war !== null)
          setFetchedWarsForDay(validWars)
          setFetchedWarsByRound(prev => ({
            ...prev,
            [selectedDay]: validWars
          }))
        } catch (err) {
          console.error('Error fetching wars:', err)
          setFetchedWarsForDay([])
        } finally {
          setLoading(false)
        }
      }
      fetchAllWars()
    } else {
      setFetchedWarsForDay([])
    }
  }, [selectedDay, cwlGroupData, clanTag])

  return { fetchedWarsForDay, fetchedWarsByRound, loading }
}

