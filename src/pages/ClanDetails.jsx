import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchClan, fetchClanWarLog, fetchClanWar, fetchClanCapitalRaids } from '../services/api'
import { CWL_CLAN_TAGS } from '../config/clans'
import ClanHeader from '../components/clan-details/ClanHeader'
import ClanDescription from '../components/clan-details/ClanDescription'
import TownHallComposition from '../components/clan-details/TownHallComposition'
import MembersList from '../components/clan-details/MembersList'
import CurrentWar from '../components/clan-details/CurrentWar'
import WarLog from '../components/clan-details/WarLog'
import CapitalRaids from '../components/clan-details/CapitalRaids'

function ClanDetails() {
  const { clanTag } = useParams()
  const navigate = useNavigate()
  const [clan, setClan] = useState(null)
  const [warLog, setWarLog] = useState([])
  const [currentWar, setCurrentWar] = useState(null)
  const [capitalRaids, setCapitalRaids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showWarLog, setShowWarLog] = useState(false)
  const [showCurrentWar, setShowCurrentWar] = useState(false)
  const [showCapitalRaids, setShowCapitalRaids] = useState(false)
  
  // Check if this is a CWL clan
  const isCWLClan = clan && CWL_CLAN_TAGS.includes(clan.tag)

  useEffect(() => {
    const loadClanDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch clan data, war log, current war, and capital raids
        const [clanData, warLogData, currentWarData, capitalRaidsData] = await Promise.all([
          fetchClan(clanTag),
          fetchClanWarLog(clanTag).catch(() => []),
          fetchClanWar(clanTag).catch((err) => {
            console.error('Error fetching current war:', err)
            return null
          }),
          fetchClanCapitalRaids(clanTag).catch(() => [])
        ])

        setClan(clanData)
        setWarLog(Array.isArray(warLogData) ? warLogData : [])
        setCurrentWar(currentWarData)
        // Handle capital raids - API might return {items: [...]} or direct array
        const raidsArray = Array.isArray(capitalRaidsData) 
          ? capitalRaidsData 
          : (capitalRaidsData?.items || [])
        setCapitalRaids(raidsArray)
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
          src={clan.badgeUrls?.large || clan.badgeUrls?.medium || clan.badgeUrls?.small}
          alt={`${clan.name} badge`}
          className="clan-badge-large"
        />
        <ClanHeader
          clan={clan}
          currentWar={currentWar}
          warLog={warLog}
          showCurrentWar={showCurrentWar}
          showWarLog={showWarLog}
          showCapitalRaids={showCapitalRaids}
          setShowCurrentWar={setShowCurrentWar}
          setShowWarLog={setShowWarLog}
          setShowCapitalRaids={setShowCapitalRaids}
          isCWLClan={isCWLClan}
        />
      </div>

      <div className="clan-details-content">
        {/* Show clan info sections only when war sections are not shown */}
        {!showCurrentWar && !showWarLog && !showCapitalRaids && (
          <>
            <ClanDescription description={clan.description} />
            <TownHallComposition memberList={clan.memberList} totalMembers={clan.members} />
            <MembersList memberList={clan.memberList} totalMembers={clan.members} />
          </>
        )}

        {/* Current War */}
        {showCurrentWar && <CurrentWar currentWar={currentWar} />}

        {/* War Log */}
        {showWarLog && <WarLog warLog={warLog} isWarLogPublic={clan.isWarLogPublic} />}

        {/* Capital Raids */}
        {showCapitalRaids && <CapitalRaids capitalRaids={capitalRaids} />}
      </div>
    </section>
  )
}

export default ClanDetails
