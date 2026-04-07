import React, { useState, useEffect } from 'react'
import SectionTitle from '../components/SectionTitle'
import ClanCard from '../components/ClanCard'
import LazyRender from '../components/LazyRender'
import { fetchTrinityClansBundled } from '../services/api'
import { backendReachabilityMessage } from '../utils/backendReachabilityMessage'

function Clans() {
  const [clansData, setClansData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    const { signal } = ac

    const fetchClansData = async () => {
      try {
        setLoading(true)
        setError(null)

        const bundled = await fetchTrinityClansBundled(null, signal)
        const fetchedClans = Array.isArray(bundled.clans) ? bundled.clans : []
        const totalConfigured =
          typeof bundled.totalTagCount === 'number'
            ? bundled.totalTagCount
            : (Array.isArray(bundled.clanTags) ? bundled.clanTags.length : 0)

        if (totalConfigured === 0) {
          setLoading(false)
          setError('No clan tags found. Please check your configuration.')
          return
        }

        if (fetchedClans.length === 0) {
          setLoading(false)
          setError(`No clan data available. Attempted to fetch ${totalConfigured} clans but received an empty response. Check backend logs for API errors.`)
          return
        }

        setClansData(fetchedClans)
        setLoading(false)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Error loading clans:', err)
        setLoading(false)
        setError(
          backendReachabilityMessage(err) ||
            err.message ||
            'Failed to load clans. Please check your connection and try again.'
        )
        setClansData([])
      }
    }

    fetchClansData()
    return () => ac.abort()
  }, [])

  return (
    <section className="clans-page">
      <SectionTitle>Trinity Family Clans</SectionTitle>

      <div className="clans-grid">
        {loading ? (
          // Show single loading skeleton
          <ClanCard isLoading={true} />
        ) : error ? (
          // Show error message
          <div className="clan-card clan-card-error">
            <div className="clan-error">
              <p className="error-title">⚠️ Error Loading Clans</p>
              <p className="error-message">{error}</p>
            </div>
          </div>
        ) : clansData.length > 0 ? (
          // Show clan cards with fetched data
          clansData.map((clan) => (
            <LazyRender
              key={clan.tag}
              placeholder={<ClanCard isLoading={true} />}
            >
              <ClanCard
                clan={clan}
                isLoading={false}
                error={false}
              />
            </LazyRender>
          ))
        ) : (
          <div className="no-data-message">
            <p>No clan data available. Please check your configuration.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Clans
