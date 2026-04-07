import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import CWLClanCard from '../components/CWLClanCard'
import LazyRender from '../components/LazyRender'
import { fetchFilteredCWLClans } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { backendReachabilityMessage } from '../utils/backendReachabilityMessage'

function CWL({ family = 'Trinity' }) {
  const { isAdmin, isRoot } = useAuth()
  const [clansData, setClansData] = useState([])
  const [filteredClanTags, setFilteredClanTags] = useState(new Set()) // Track which clans are visible to regular users
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Admin and root users automatically see all clans
  const showAll = isAdmin || isRoot

  // Store display period info from backend
  const [displayPeriodInfo, setDisplayPeriodInfo] = useState({ isDisplayPeriod: false, monthName: '' })
  
  const shouldHoldRegularView = useMemo(() => {
    if (showAll) {
      return false
    }
    // Only show notice if it's display period AND there are no clans to show
    return displayPeriodInfo.isDisplayPeriod && clansData.length === 0
  }, [showAll, displayPeriodInfo, clansData.length])

  useEffect(() => {
    const ac = new AbortController()
    const signal = ac.signal

    const fetchClansData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (showAll) {
          const response = await fetchFilteredCWLClans(true, true, family, signal)
          if (signal.aborted) return
          if (!response.clans || response.clans.length === 0) {
            setLoading(false)
            setError('No CWL clan data available. Please check your configuration.')
            return
          }
          
          // Set display period info from backend
          if (response.isDisplayPeriod !== undefined && response.monthName) {
            setDisplayPeriodInfo({ isDisplayPeriod: response.isDisplayPeriod, monthName: response.monthName })
          }
          
          setFilteredClanTags(new Set(response.filteredClanTags || []))
          setClansData(response.clans)
        } else {
          const response = await fetchFilteredCWLClans(false, false, family, signal)
          if (signal.aborted) return
          if (!response.clans || response.clans.length === 0) {
            setLoading(false)
            setError('No CWL clan data available. Please check your configuration.')
            return
          }
          
          // Set display period info from backend
          if (response.isDisplayPeriod !== undefined && response.monthName) {
            setDisplayPeriodInfo({ isDisplayPeriod: response.isDisplayPeriod, monthName: response.monthName })
          }
          
          setClansData(response.clans || [])
          setFilteredClanTags(new Set())
        }
        setLoading(false)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Error loading CWL clans:', err)
        setLoading(false)
        setError(
          backendReachabilityMessage(err) ||
            err.message ||
            'Failed to load CWL clans. Please check your connection and try again.'
        )
        setClansData([])
      }
    }

    fetchClansData()
    return () => ac.abort()
  }, [showAll, family])

  const pageTitle = family === 'Indian Glory' ? 'Indian Glory Clan War League (CWL)' : 'Trinity Clan War League (CWL)'

  return (
    <section className="cwl-page">
      <div className="cwl-title-wrapper">
        <SectionTitle>{pageTitle}</SectionTitle>
      </div>

      <div className="clans-grid">
        {loading ? (
          // Show loading state
          <div className="clan-card clan-card-loading">
            <div className="clan-loading">
              <div className="spinner"></div>
              <p>Loading CWL clan data...</p>
            </div>
          </div>
        ) : error ? (
          // Show error message
          <div className="clan-card clan-card-error">
            <div className="clan-error">
              <p className="error-title">⚠️ Error Loading CWL Clans</p>
              <p className="error-message">{error}</p>
            </div>
          </div>
        ) : shouldHoldRegularView ? (
          <div className="cwl-notice">
            <div className="cwl-notice-inner">
              <p className="cwl-notice-headline">
                We host Lazy CWL in satellite clans, ranging from Master 1 to Crystal 2 depending upon your Town Hall.
              </p>
              <p className="cwl-notice-body">
                Check the CWL page after 29th {displayPeriodInfo.monthName} (1:30&nbsp;PM IST). Until then, you can explore our{' '}
                <Link to="/clans">Trinity clans</Link>.
              </p>
            </div>
          </div>
        ) : clansData.length === 0 ? (
          <div className="no-data-message">
            <p>No clans in family &quot;{family}&quot;.</p>
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

