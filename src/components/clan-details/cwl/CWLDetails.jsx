import React, { useState, useEffect } from 'react'
import { fetchCWLWarByTag } from '../../../services/api'
import { useCWLStatus, useCWLGroup, useCWLDailyWars } from '../../../hooks/useCWLData'
import { useCWLWarNames } from '../../../hooks/useCWLWarNames'
import { CWLLeaderboard } from './CWLLeaderboard'
import { CWLRoundsTable } from './CWLRoundsTable'
import { CWLWarDetails } from './CWLWarDetails'
import { CWLMembersSummary } from './CWLMembersSummary'
import { WarStatsTable } from '../wars/WarStatsTable'
import { WarMembersTable } from '../wars/WarMembersTable'

function CWLDetails({ clanTag, showDetails: showDetailsProp = false, leagueName, isAdmin = false }) {
  const [showAllDetails, setShowAllDetails] = useState(false)
  const [showDetails, setShowDetails] = useState(showDetailsProp)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedWarTag, setSelectedWarTag] = useState(null)
  const [warDetails, setWarDetails] = useState(null)
  const [loadingWar, setLoadingWar] = useState(false)
  const [warError, setWarError] = useState(null)
  const [expandedClans, setExpandedClans] = useState(new Set())

  // Use custom hooks for data fetching
  const { cwlStatus, loading: loadingStatus } = useCWLStatus(clanTag)
  const { cwlGroupData, loading: loadingGroup } = useCWLGroup(clanTag, showAllDetails, leagueName)
  const { fetchedWarsForDay, fetchedWarsByRound, loading: loadingFetchedWars } = useCWLDailyWars(
    selectedDay,
    cwlGroupData,
    clanTag
  )
  const dayWarNames = useCWLWarNames(cwlGroupData, clanTag, loadingGroup)

  // Update showDetails when prop changes
  useEffect(() => {
    setShowDetails(showDetailsProp)
    if (showDetailsProp) {
      setShowAllDetails(true)
    }
  }, [showDetailsProp])

  // Fetch war details when war tag is selected
  useEffect(() => {
    if (selectedWarTag && clanTag) {
      const fetchWarDetails = async () => {
        setLoadingWar(true)
        setWarError(null)
        try {
          const war = await fetchCWLWarByTag(selectedWarTag, clanTag)
          setWarDetails(war)
        } catch (err) {
          console.error('Error fetching war details:', err)
          setWarError(err.message)
          setWarDetails(null)
        } finally {
          setLoadingWar(false)
        }
      }
      fetchWarDetails()
    } else {
      setWarDetails(null)
      setWarError(null)
    }
  }, [selectedWarTag, clanTag])

  if (loadingStatus) {
    return (
      <div className="cwl-details-section">
        <div className="cwl-details-loading">
          <div className="spinner"></div>
          <p>Loading CWL status...</p>
        </div>
      </div>
    )
  }

  if (!cwlStatus || cwlStatus.error) {
    return null
  }

  return (
    <div className="cwl-details-section">
      {showDetails && (
        <>
          {/* Full CWL Group Data */}
          {showAllDetails && (
            <>
              {loadingGroup ? (
                <div className="cwl-details-loading">
                  <div className="spinner"></div>
                  <p>Loading...</p>
                </div>
              ) : cwlGroupData?.error ? (
                <div className="cwl-details-error">Error: {cwlGroupData.error}</div>
              ) : cwlGroupData ? (
                <>
                  {/* CWL Leaderboard */}
                  {cwlGroupData.group && (
                    <>
                      {/* Leaderboard Card */}
                      <div className="cwl-card-container">
                        <CWLLeaderboard
                          cwlGroupData={cwlGroupData}
                          expandedClans={expandedClans}
                          setExpandedClans={setExpandedClans}
                          leagueName={leagueName}
                        />
                      </div>

                      {/* Rounds Card */}
                      <div className="cwl-card-container">
                        <CWLRoundsTable
                          cwlGroupData={cwlGroupData}
                          clanTag={clanTag}
                          selectedDay={selectedDay}
                          setSelectedDay={setSelectedDay}
                          fetchedWarsByRound={fetchedWarsByRound}
                          fetchedWarsForDay={fetchedWarsForDay}
                          loadingFetchedWars={loadingFetchedWars}
                          isAdmin={isAdmin}
                        />
                      </div>

                      {/* CWL Members Summary */}
                      <div className="cwl-card-container">
                        <CWLMembersSummary
                          cwlGroupData={cwlGroupData}
                          clanTag={clanTag}
                          leagueName={leagueName}
                        />
                      </div>
                    </>
                  )}

                  {/* War Details Modal/Section */}
                  {selectedWarTag && (
                    <div className="cwl-war-details-modal">
                      <div className="cwl-war-details-header">
                        <h3>War Details: {selectedWarTag}</h3>
                        <button
                          className="cwl-close-button"
                          onClick={() => {
                            setSelectedWarTag(null)
                            setWarDetails(null)
                            setWarError(null)
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      {loadingWar ? (
                        <div className="cwl-details-loading">
                          <div className="spinner"></div>
                          <p>Loading war details...</p>
                        </div>
                      ) : warError ? (
                        <div className="cwl-details-error">Error: {warError}</div>
                      ) : warDetails ? (
                        <div className="cwl-war-details-content">
                          {/* War Stats */}
                          {warDetails.clan && warDetails.opponent && (
                            <WarStatsTable clan={warDetails.clan} opponent={warDetails.opponent} />
                          )}

                          {/* Clan Members */}
                          {warDetails.clan?.members?.length > 0 && (
                            <WarMembersTable
                              members={warDetails.clan.members}
                              title="Our Clan Members"
                              opponentMembers={warDetails.opponent?.members || []}
                            />
                          )}

                          {/* Opponent Members */}
                          {warDetails.opponent?.members?.length > 0 && (
                            <WarMembersTable
                              members={warDetails.opponent.members}
                              title="Opponent Members"
                              opponentMembers={warDetails.clan?.members || []}
                            />
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
                </>
              ) : (
                <div className="cwl-details-placeholder">Click to load full CWL group data</div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default CWLDetails

