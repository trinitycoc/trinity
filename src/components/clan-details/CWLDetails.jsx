import React, { useState, useEffect } from 'react'
import { fetchCWLGroup, fetchCWLStatus, fetchCWLWarByTag } from '../../services/api'
import { normalizeTag, getValidWarTags, filterWarsForDay, sortMembersByTH } from '../../utils/cwlUtils'
import { WarCountdown } from './WarCountdown'
import { WarStatsTable } from './WarStatsTable'
import { WarMembersTable } from './WarMembersTable'

function CWLDetails({ clanTag, showDetails: showDetailsProp = false }) {
  const [cwlStatus, setCwlStatus] = useState(null)
  const [cwlGroupData, setCwlGroupData] = useState(null)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingGroup, setLoadingGroup] = useState(false)
  const [showAllDetails, setShowAllDetails] = useState(false)
  const [showDetails, setShowDetails] = useState(showDetailsProp)
  const [selectedWarTag, setSelectedWarTag] = useState(null)
  const [warDetails, setWarDetails] = useState(null)
  const [loadingWar, setLoadingWar] = useState(false)
  const [warError, setWarError] = useState(null)
  const [expandedClans, setExpandedClans] = useState(new Set())
  const [selectedDay, setSelectedDay] = useState(null)
  const [dayWarNames, setDayWarNames] = useState({}) // Store clan vs opponent names for each day

  // Fetch CWL status when component mounts
  useEffect(() => {
    if (clanTag) {
      const fetchStatus = async () => {
        setLoadingStatus(true)
        try {
          const status = await fetchCWLStatus(clanTag)
          setCwlStatus(status)
        } catch (err) {
          console.error('Error fetching CWL status:', err)
          setCwlStatus({ error: err.message })
        } finally {
          setLoadingStatus(false)
        }
      }
      fetchStatus()
    }
  }, [clanTag])

  // Update showDetails when prop changes
  useEffect(() => {
    setShowDetails(showDetailsProp)
    if (showDetailsProp) {
      setShowAllDetails(true)
    }
  }, [showDetailsProp])

  // Fetch full CWL group data when showAllDetails is toggled
  useEffect(() => {
    if (showAllDetails && clanTag && !cwlGroupData && !loadingGroup) {
      const fetchGroupData = async () => {
        setLoadingGroup(true)
        try {
          // Fetch with all wars from all rounds
          const data = await fetchCWLGroup(clanTag, true)
          setCwlGroupData(data)
        } catch (err) {
          console.error('Error fetching CWL group data:', err)
          setCwlGroupData({ error: err.message })
        } finally {
          setLoadingGroup(false)
        }
      }
      fetchGroupData()
    }
  }, [showAllDetails, clanTag, cwlGroupData, loadingGroup])

  // Fetch war names for all days to show on buttons
  useEffect(() => {
    if (cwlGroupData?.group?.rounds && clanTag && !loadingGroup) {
      const fetchDayWarNames = async () => {
        const names = {}
        const promises = []

        // Process all rounds
        for (const round of cwlGroupData.group.rounds) {
          if (!round.warTags || round.warTags.length === 0) continue
          
          const validWarTags = getValidWarTags(round.warTags)
          if (validWarTags.length === 0) continue

          // Check if we already have war data for this round
          const existingWars = filterWarsForDay(
            cwlGroupData.allWars || [],
            round.warTags
          )

          // Also check currentWars
          if (existingWars.length === 0 && cwlGroupData.currentWars) {
            const currentWarsForDay = filterWarsForDay(
              cwlGroupData.currentWars,
              round.warTags
            )
            if (currentWarsForDay.length > 0) {
              existingWars.push(...currentWarsForDay)
            }
          }

          // If we have war data with clan names, use it
          if (existingWars.length > 0 && existingWars[0].clan && existingWars[0].opponent) {
            names[round.round] = `${existingWars[0].clan.name} vs ${existingWars[0].opponent.name}`
            if (existingWars.length > 1) {
              names[round.round] += ` (${existingWars.length} wars)`
            }
          } else if (validWarTags.length > 0) {
            // Fetch the first war to get clan names
            const firstWarTag = validWarTags[0]
            promises.push(
              fetchCWLWarByTag(firstWarTag, clanTag)
                .then(war => {
                  if (war && war.clan && war.opponent) {
                    const warCount = validWarTags.length
                    names[round.round] = `${war.clan.name} vs ${war.opponent.name}`
                    if (warCount > 1) {
                      names[round.round] += ` (${warCount} wars)`
                    }
                  }
                })
                .catch(() => {
                  // Silently fail - war data may not be available yet
                })
            )
          }
        }

        // Wait for all war fetches to complete
        if (promises.length > 0) {
          await Promise.allSettled(promises)
        }
        setDayWarNames(names)
      }

      fetchDayWarNames()
    }
  }, [cwlGroupData, clanTag, loadingGroup])

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
        <div className="cwl-details-loading">Loading CWL status...</div>
      </div>
    )
  }

  if (!cwlStatus || cwlStatus.error) {
    return null // Don't show anything if there's no CWL status or error
  }

  return (
    <div className="cwl-details-section">
      {showDetails && (
        <>
          {/* Full CWL Group Data */}
          {showAllDetails && (
            <>
              {loadingGroup ? (
                <div className="cwl-details-loading">Loading...</div>
              ) : cwlGroupData?.error ? (
                <div className="cwl-details-error">Error: {cwlGroupData.error}</div>
              ) : cwlGroupData ? (
                <>
                  {/* Group Details */}
                  {cwlGroupData.group && (
                    <>
                      {/* Other Clans in Group */}
                      {cwlGroupData.group.clans && cwlGroupData.group.clans.length > 0 && (
                        <div className="cwl-subsection cwl-clans-in-group">
                          <div className="cwl-subsection-title">Clans in Group ({cwlGroupData.group.clans.length})</div>
                          <div className="cwl-table-wrapper">
                            <table className="cwl-table">
                              <thead>
                                <tr>
                                  <th>Clan Name</th>
                                  <th>Tag</th>
                                  <th>Level</th>
                                  <th>Members</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cwlGroupData.group.clans.map((cwlClan, idx) => {
                                  const isExpanded = expandedClans.has(cwlClan.tag)
                                  const hasMembers = cwlClan.members && cwlClan.members.length > 0

                                  return (
                                    <tr key={idx}>
                                      <td className="cwl-table-value">{cwlClan.name}</td>
                                      <td className="cwl-table-value">{cwlClan.tag}</td>
                                      <td className="cwl-table-value">{cwlClan.level}</td>
                                      <td className="cwl-table-value">{cwlClan.members?.length || 0}</td>
                                      <td className="cwl-table-value">
                                        {hasMembers && (
                                          <button
                                            className={`cwl-toggle-members-btn ${isExpanded ? 'active' : ''}`}
                                            onClick={() => {
                                              const newExpanded = new Set(expandedClans)
                                              if (isExpanded) {
                                                newExpanded.delete(cwlClan.tag)
                                              } else {
                                                newExpanded.add(cwlClan.tag)
                                              }
                                              setExpandedClans(newExpanded)
                                            }}
                                            title={isExpanded ? 'Hide members' : 'Show members'}
                                          >
                                            {isExpanded ? 'Hide Members' : 'Show Members'}
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* CWL Members by Clan - Only show when expanded */}
                          {cwlGroupData.group.clans.some(clan =>
                            clan.members && clan.members.length > 0 && expandedClans.has(clan.tag)
                          ) && (
                              <div className="cwl-members-by-clan">
                            {cwlGroupData.group.clans.map((cwlClan, idx) => (
                                  cwlClan.members && cwlClan.members.length > 0 && expandedClans.has(cwlClan.tag) && (
                                    <div key={idx} className="cwl-clan-members">
                                      <div className="cwl-subsection-title-small">{cwlClan.name} - Members ({cwlClan.members.length})</div>
                                      <div className="cwl-table-wrapper">
                                        <table className="cwl-table">
                                          <thead>
                                            <tr>
                                              <th>Sr. No.</th>
                                              <th>Name</th>
                                              <th>Tag</th>
                                              <th>TH Level</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {sortMembersByTH(cwlClan.members).map((member, mIdx) => (
                                              <tr key={mIdx}>
                                                <td className="cwl-table-value">{mIdx + 1}</td>
                                                <td className="cwl-table-value">{member.name}</td>
                                                <td className="cwl-table-value">{member.tag}</td>
                                                <td className="cwl-table-value">{member.townHallLevel}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )
                                    ))}
                                  </div>
                                )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Wars by Day/Round */}
                  {cwlGroupData.group?.rounds && cwlGroupData.group.rounds.length > 0 && (
                    <div className="cwl-subsection">
                      <div className="cwl-wars-navigation">
                        <div className="cwl-wars-header">WARS</div>
                        <div className="cwl-days-container">
                          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                            const round = cwlGroupData.group?.rounds?.find(r => r.round === day)
                            const hasWars = round?.warTags && getValidWarTags(round.warTags).length > 0
                            
                            // Get wars for this day to show clan vs opponent names
                            let dayWars = []
                            if (round?.warTags) {
                              dayWars = filterWarsForDay(
                                cwlGroupData.allWars || [],
                                round.warTags
                              )
                              
                              if (dayWars.length === 0 && cwlGroupData.currentWars) {
                                dayWars = filterWarsForDay(
                                  cwlGroupData.currentWars,
                                  round.warTags
                                )
                              }
                            }
                            
                            // Get button label - prioritize stored names from fetched wars, then use war data, fallback to DAY X
                            let buttonLabel = dayWarNames[day] || `DAY ${day}`
                            if (!dayWarNames[day] && dayWars.length > 0 && dayWars[0].clan && dayWars[0].opponent) {
                              buttonLabel = `${dayWars[0].clan.name} vs ${dayWars[0].opponent.name}`
                              // If multiple wars, show count
                              if (dayWars.length > 1) {
                                buttonLabel += ` (${dayWars.length} wars)`
                              }
                            }

                            return (
                              <button
                                key={day}
                                className={`cwl-day-button ${selectedDay === day ? 'active' : ''} ${hasWars ? 'has-wars' : ''}`}
                                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                                disabled={!hasWars}
                                title={hasWars ? `View wars for Day ${day}` : `No wars for Day ${day}`}
                              >
                                {buttonLabel}
                              </button>
                            )
                          })}
                          </div>
                          </div>

                      {/* Show wars for selected day */}
                      {selectedDay && (
                        <div className="cwl-day-wars">
                          {(() => {
                            const selectedRound = cwlGroupData.group?.rounds?.find(r => r.round === selectedDay)
                            if (!selectedRound || !selectedRound.warTags) {
                              return <div className="cwl-no-wars">No wars found for Day {selectedDay}</div>
                            }

                            const validWarTags = getValidWarTags(selectedRound.warTags)
                            if (validWarTags.length === 0) {
                              return <div className="cwl-no-wars">No wars found for Day {selectedDay}</div>
                            }

                            // Find wars from allWars that match these war tags
                            let warsForDay = filterWarsForDay(
                              cwlGroupData.allWars || [],
                              selectedRound.warTags
                            )

                            // If no wars found in allWars, try currentWars as fallback
                            if (warsForDay.length === 0 && cwlGroupData.currentWars) {
                              warsForDay = filterWarsForDay(
                                cwlGroupData.currentWars,
                                selectedRound.warTags
                              )
                            }

                            // If still no wars found, show war tags as clickable elements to fetch details
                            if (warsForDay.length === 0) {
                              return (
                                <div className="cwl-no-wars">
                                  <p>War details not yet loaded. Click on war tags below to fetch details:</p>
                                  <div className="cwl-war-tags">
                                    {validWarTags.map((tag, i) => (
                                      <span
                                        key={i}
                                        className={`war-tag ${selectedWarTag === tag ? 'active' : ''}`}
                                        onClick={() => setSelectedWarTag(tag)}
                                        title="Click to view war details"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  {(!cwlGroupData.allWars || cwlGroupData.allWars.length === 0) && (
                                    <p className="cwl-wars-note">
                                      Note: All wars data is empty. Please enable "Show All Details" toggle above.
                                    </p>
                                  )}
                                </div>
                              )
                            }

                            return warsForDay.length > 0 ? (
                              warsForDay.map((war, idx) => (
                                <div key={idx} className="cwl-war-section">
                                  <div className="cwl-war-header">
                                    {war.clan && war.opponent ? (
                                      <div className="cwl-war-title-section">
                                        <h4>{war.clan.name} vs {war.opponent.name}</h4>
                                        <WarCountdown war={war} />
                                      </div>
                                    ) : (
                                      <div className="cwl-war-title-section">
                                        <h4>War {idx + 1}</h4>
                                        <WarCountdown war={war} />
                                      </div>
                                    )}
                                  </div>

                                  {/* War Stats */}
                                  {war.clan && war.opponent && (
                                    <WarStatsTable clan={war.clan} opponent={war.opponent} />
                                  )}

                                  {/* Clan Members */}
                                  {war.clan?.members?.length > 0 && (
                                    <WarMembersTable 
                                      members={war.clan.members}
                                      title="Our Clan Members"
                                    />
                                  )}

                                  {/* Opponent Members */}
                                  {war.opponent?.members?.length > 0 && (
                                    <WarMembersTable 
                                      members={war.opponent.members}
                                      title="Opponent Members"
                                    />
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="cwl-no-wars">No wars found for Day {selectedDay}</div>
                            )
                          })()}
                        </div>
                      )}
                    </div>
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
                        <div className="cwl-details-loading">Loading war details...</div>
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
                            />
                          )}

                          {/* Opponent Members */}
                          {warDetails.opponent?.members?.length > 0 && (
                            <WarMembersTable 
                              members={warDetails.opponent.members}
                              title="Opponent Members"
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
