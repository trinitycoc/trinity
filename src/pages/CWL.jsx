import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import CWLClanCard from '../components/CWLClanCard'
import LazyRender from '../components/LazyRender'
import { fetchFilteredCWLClans } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { backendReachabilityMessage } from '../utils/backendReachabilityMessage'

function CWL({ family = 'Trinity' }) {
  const { isAdmin, isRoot, loading: authLoading } = useAuth()
  const [clansData, setClansData] = useState([])
  const [filteredClanTags, setFilteredClanTags] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const showAll = isAdmin || isRoot

  const [cwlPeriod, setCwlPeriod] = useState('start')
  const [comeBackDateLabel, setComeBackDateLabel] = useState('')

  const showSeasonEndedNotice = !showAll && cwlPeriod === 'end'

  useEffect(() => {
    if (authLoading) return

    const ac = new AbortController()
    const { signal } = ac

    const fetchClansData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetchFilteredCWLClans(showAll, showAll, family, signal)
        if (signal.aborted) return

        if (response.cwlPeriod) setCwlPeriod(response.cwlPeriod)
        if (response.comeBackDateLabel) setComeBackDateLabel(response.comeBackDateLabel)

        const tags = showAll ? new Set(response.filteredClanTags || []) : new Set()
        if (!response.clans?.length) {
          setClansData([])
          setFilteredClanTags(tags)
          setLoading(false)
          return
        }

        setClansData(response.clans)
        setFilteredClanTags(tags)
        setLoading(false)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Error loading CWL clans:', err)
        setLoading(false)
        setError(
          backendReachabilityMessage(err) ||
            "We couldn't load CWL clan information right now. Please refresh the page or try again in a little while."
        )
        setClansData([])
      }
    }

    fetchClansData()
    return () => ac.abort()
  }, [showAll, family, authLoading])

  const pageTitle =
    family === 'Indian Glory'
      ? 'Indian Glory Clan War League (CWL)'
      : 'Trinity Clan War League (CWL)'

  return (
    <section className="cwl-page">
      <div className="cwl-title-wrapper">
        <SectionTitle>{pageTitle}</SectionTitle>
      </div>

      <div className="clans-grid">
        {loading ? (
          <div className="clan-card clan-card-loading">
            <div className="clan-loading">
              <div className="spinner"></div>
              <p>Loading CWL clan data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="clan-card clan-card-error">
            <div className="clan-error">
              <p className="error-title">Unable to load CWL clans</p>
              <p className="error-message">{error}</p>
            </div>
          </div>
        ) : showSeasonEndedNotice ? (
          <div className="cwl-notice cwl-season-ended-notice">
            <div className="cwl-notice-inner">
              <p className="cwl-notice-body">
                CWL is over for this month, come back on{' '}
                <strong>{comeBackDateLabel}</strong>, to join us in CWL.
              </p>
            </div>
          </div>
        ) : clansData.length === 0 ? (
          <div className="cwl-notice">
            <div className="cwl-notice-inner">
              <p className="cwl-notice-body">
                No CWL clans are available right now. You can explore our{' '}
                <Link to="/clans">Trinity clans</Link>.
              </p>
            </div>
          </div>
        ) : (
          clansData.map((clan) => (
            <LazyRender
              key={clan.tag}
              placeholder={<CWLClanCard isLoading={true} />}
            >
              <CWLClanCard
                clan={clan}
                isLoading={false}
                error={false}
                cwlConfig={clan.cwlConfig}
                isVisibleToUsers={showAll ? filteredClanTags.has(clan.tag) : true}
                isAdminMode={showAll}
              />
            </LazyRender>
          ))
        )}
      </div>
    </section>
  )
}

export default CWL
