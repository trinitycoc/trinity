import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchClan, fetchClanWarLog, fetchClanWar /* fetchClanCapitalRaids */ } from '../services/api'
import { useCWL } from '../contexts/CWLContext'
import ClanHeader from '../components/clan-details/ClanHeader'
const ClanDescription = lazy(() => import('../components/clan-details/ClanDescription'))
const TownHallComposition = lazy(() => import('../components/clan-details/TownHallComposition'))
const MembersList = lazy(() => import('../components/clan-details/MembersList'))
const CurrentWar = lazy(() => import('../components/clan-details/wars/CurrentWar'))
const WarLog = lazy(() => import('../components/clan-details/wars/WarLog'))
// import CapitalRaids from '../components/clan-details/CapitalRaids'
const CWLDetails = lazy(() => import('../components/clan-details/cwl/CWLDetails'))

function ClanDetails() {
  const { clanTag } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isCWLClan: checkIsCWLClan } = useCWL()
  const badgeRef = useRef(null)
  const tapCountRef = useRef(0)
  const tapTimerRef = useRef(null)
  
  // Check if admin view is enabled via URL parameter
  const isAdmin = searchParams.get('admin') === 'true' || searchParams.get('all') === 'true'

  const toggleAdminView = useCallback(() => {
    const newIsAdmin = searchParams.get('admin') !== 'true' && searchParams.get('all') !== 'true'
    const newParams = new URLSearchParams(searchParams)
    if (newIsAdmin) {
      newParams.set('admin', 'true')
    } else {
      newParams.delete('admin')
      newParams.delete('all')
    }
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])
  const [clan, setClan] = useState(null)
  const [warLog, setWarLog] = useState([])
  const [currentWar, setCurrentWar] = useState(null)
  // const [capitalRaids, setCapitalRaids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showWarLog, setShowWarLog] = useState(false)
  const [showCurrentWar, setShowCurrentWar] = useState(false)
  // const [showCapitalRaids, setShowCapitalRaids] = useState(false)
  const [showCWLDetails, setShowCWLDetails] = useState(false)
  
  // Check if this is a CWL clan - show button if clan has warLeague or is in CWL list
  const isCWLClan = clan && (clan.warLeague?.name || checkIsCWLClan(clan.tag))

  useEffect(() => {
    const loadClanDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch clan data, war log, current war, and capital raids
        // TODO: Capital Raids not integrated yet - commenting out to prevent unnecessary API calls
        const [clanData, warLogData, currentWarData /* , capitalRaidsData */] = await Promise.all([
          fetchClan(clanTag),
          fetchClanWarLog(clanTag).catch(() => []),
          fetchClanWar(clanTag).catch((err) => {
            console.error('Error fetching current war:', err)
            return null
          }),
          // fetchClanCapitalRaids(clanTag).catch(() => [])
        ])

        setClan(clanData)
        setWarLog(Array.isArray(warLogData) ? warLogData : [])
        setCurrentWar(currentWarData)
        // Handle capital raids - API might return {items: [...]} or direct array
        // TODO: Capital Raids not integrated yet
        // const raidsArray = Array.isArray(capitalRaidsData) 
        //   ? capitalRaidsData 
        //   : (capitalRaidsData?.items || [])
        // setCapitalRaids(raidsArray)
      } catch (err) {
        console.error('Error loading clan details:', err)
        setError(err.message || 'Failed to load clan details')
      } finally {
        setLoading(false)
      }
    }

    if (clanTag) {
      loadClanDetails()
    }
  }, [clanTag])

  // Keyboard shortcut to toggle admin view (Alt+Shift+A) - Desktop
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger if user is typing in an input, textarea, or contenteditable element
      const target = e.target
      const isInputElement = target.tagName === 'INPUT' || 
                            target.tagName === 'TEXTAREA' || 
                            target.isContentEditable ||
                            target.closest('input, textarea, [contenteditable="true"]')
      
      // Alt+Shift+A to toggle admin view (won't conflict with browser shortcuts)
      if (e.altKey && e.shiftKey && e.key === 'A' && !isInputElement) {
        e.preventDefault()
        e.stopPropagation()
        toggleAdminView()
      }
    }

    window.addEventListener('keydown', handleKeyPress, true) // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyPress, true)
  }, [toggleAdminView])

  // Triple tap on clan badge to toggle admin view - Mobile
  useEffect(() => {
    const badgeElement = badgeRef.current
    if (!badgeElement) return

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

    badgeElement.addEventListener('click', handleTap)
    badgeElement.style.cursor = 'pointer'

    return () => {
      badgeElement.removeEventListener('click', handleTap)
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current)
      }
    }
  }, [toggleAdminView])

  if (loading) {
    return (
      <section className="clan-details-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading clan details...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="clan-details-page">
        <div className="error-container">
          <h2>❌ Error Loading Clan</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </section>
    )
  }

  if (!clan) {
    return (
      <section className="clan-details-page">
        <div className="error-container">
          <h2>⚠️ No Clan Data</h2>
          <p>Clan data could not be loaded</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="clan-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="clan-details-header">
        <img
          ref={badgeRef}
          src={clan.badgeUrls?.large || clan.badgeUrls?.medium || clan.badgeUrls?.small}
          alt={`${clan.name} badge`}
          className="clan-badge-large"
          title={isAdmin ? 'Admin mode active - Triple tap or Alt+Shift+A to disable' : 'Triple tap or Alt+Shift+A to enable admin mode'}
        />
        <ClanHeader
          clan={clan}
          currentWar={currentWar}
          warLog={warLog}
          showCurrentWar={showCurrentWar}
          showWarLog={showWarLog}
          showCapitalRaids={false /* showCapitalRaids */}
          showCWLDetails={showCWLDetails}
          setShowCurrentWar={setShowCurrentWar}
          setShowWarLog={setShowWarLog}
          setShowCapitalRaids={() => {} /* setShowCapitalRaids */}
          setShowCWLDetails={setShowCWLDetails}
          isCWLClan={isCWLClan}
        />
      </div>

      <div className="clan-details-content">
        {/* Show clan info sections only when war sections are not shown */}
        {/* TODO: Capital Raids not integrated yet - removed showCapitalRaids check */}
        {!showCurrentWar && !showWarLog && !showCWLDetails && (
          <Suspense fallback={<div className="section-loading">Loading clan overview...</div>}>
            <ClanDescription description={clan.description} />
            <TownHallComposition 
              memberList={clan.memberList} 
              totalMembers={clan.members} 
              thComposition={clan.thComposition} 
            />
            <MembersList memberList={clan.memberList} totalMembers={clan.members} />
          </Suspense>
        )}

        {/* Current War */}
        {showCurrentWar && (
          <Suspense fallback={<div className="section-loading">Loading current war...</div>}>
            <CurrentWar currentWar={currentWar} />
          </Suspense>
        )}

        {/* CWL Details - Only show for CWL clans */}
        {isCWLClan && showCWLDetails && (
          <Suspense fallback={<div className="section-loading">Loading CWL details...</div>}>
            <CWLDetails 
              clanTag={clan.tag} 
              showDetails={showCWLDetails}
              leagueName={clan.warLeague?.name}
              isAdmin={isAdmin}
            />
          </Suspense>
        )}

        {/* War Log */}
        {showWarLog && (
          <Suspense fallback={<div className="section-loading">Loading war log...</div>}>
            <WarLog warLog={warLog} isWarLogPublic={clan.isWarLogPublic} />
          </Suspense>
        )}

        {/* Capital Raids */}
        {/* TODO: Capital Raids not integrated yet - commenting out to prevent unnecessary API calls */}
        {/* {showCapitalRaids && <CapitalRaids capitalRaids={capitalRaids} />} */}
      </div>
    </section>
  )
}

export default ClanDetails
