import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import CWLClanCard from '../components/CWLClanCard'
import { checkServerHealth, fetchFilteredCWLClans } from '../services/api'

function CWL() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [clansData, setClansData] = useState([])
  const [filteredClanTags, setFilteredClanTags] = useState(new Set()) // Track which clans are visible to regular users
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverOnline, setServerOnline] = useState(false)
  const titleRef = useRef(null)
  const tapCountRef = useRef(0)
  const tapTimerRef = useRef(null)
  
  // Check if admin view is enabled via URL parameter
  const showAll = searchParams.get('admin') === 'true' || searchParams.get('all') === 'true'

  const toggleAdminView = useCallback(() => {
    const newShowAll = searchParams.get('admin') !== 'true' && searchParams.get('all') !== 'true'
    const newParams = new URLSearchParams(searchParams)
    if (newShowAll) {
      newParams.set('admin', 'true')
    } else {
      newParams.delete('admin')
      newParams.delete('all')
    }
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  useEffect(() => {
    const fetchClansData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if backend server is running
        const isOnline = await checkServerHealth()
        setServerOnline(isOnline)

        if (!isOnline) {
          setLoading(false)
          setError('Backend server is not running. Please start it with: cd Trinity_Backend && npm install && npm run dev')
          return
        }

        // Fetch CWL clans from backend with capacity-based filtering
        if (showAll) {
          // In admin mode: fetch both filtered and all clans
          const [filteredClans, allClans] = await Promise.all([
            fetchFilteredCWLClans(false), // What regular users see
            fetchFilteredCWLClans(true)   // All clans
          ])
          
          if (allClans.length === 0) {
            setLoading(false)
            setError('No CWL clan data available. Please check your configuration.')
            return
          }
          
          // Create a set of clan tags that are visible to regular users
          const visibleTags = new Set(filteredClans.map(clan => clan.tag))
          setFilteredClanTags(visibleTags)
          setClansData(allClans)
        } else {
          // Regular user mode: fetch only filtered clans
          const filteredClans = await fetchFilteredCWLClans(false)
          
          if (filteredClans.length === 0) {
            setLoading(false)
            setError('No CWL clan data available. Please check your configuration.')
            return
          }
          
          setClansData(filteredClans)
          setFilteredClanTags(new Set())
        }
        
        setLoading(false)
      } catch (err) {
        // Catch all errors (API_BASE_URL undefined, network errors, etc.)
        console.error('Error loading CWL clans:', err)
        setLoading(false)
        setError(err.message || 'Failed to load CWL clans. Please check your connection and try again.')
        setClansData([])
      }
    }

    fetchClansData()
  }, [showAll])

  // Keyboard shortcut to toggle admin view (Ctrl+Shift+A) - Desktop
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+Shift+A to toggle admin view
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        toggleAdminView()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggleAdminView])

  // Triple tap on title to toggle admin view - Mobile
  useEffect(() => {
    const titleElement = titleRef.current
    if (!titleElement) return

    const handleTap = (e) => {
      // Clear previous timer
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current)
      }

      tapCountRef.current++

      // Reset tap count after 1 second
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0
      }, 1000)

      // If triple tap (3 taps within 1 second)
      if (tapCountRef.current === 3) {
        e.preventDefault()
        toggleAdminView()
        tapCountRef.current = 0
      }
    }

    titleElement.addEventListener('click', handleTap)
    titleElement.style.cursor = 'pointer'

    return () => {
      titleElement.removeEventListener('click', handleTap)
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current)
      }
    }
  }, [toggleAdminView])

  return (
    <section className="cwl-page">
      <div ref={titleRef} className="cwl-title-wrapper">
        <SectionTitle>Trinity Clan War League (CWL)</SectionTitle>
      </div>
      <p className="page-description">
        Our CWL clans are organized in satellite leagues, offering high-tier competitive play for Trinity players.
        Each clan competes in its respective league to maximize rewards and glory for our family.
      </p>

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
        ) : clansData.length > 0 ? (
          // Show CWL clan cards with fetched data
          clansData.map((clan) => (
            <CWLClanCard
              key={clan.tag}
              clan={clan}
              isLoading={false}
              error={false}
              sheetData={clan.sheetData}
              isVisibleToUsers={showAll ? filteredClanTags.has(clan.tag) : true}
              isAdminMode={showAll}
            />
          ))
        ) : (
          <div className="no-data-message">
            <p>No CWL clan data available. Please check your configuration.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CWL

