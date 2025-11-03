import React, { useState } from 'react'
import { getValidWarTags } from '../../../utils/cwlUtils'
// import { calculateRoundStats, getRoundWars } from '../../../utils/roundStats' // Moved to backend
import { CWLWarDetails } from './CWLWarDetails'

export const CWLRoundsTable = ({
  cwlGroupData,
  clanTag,
  selectedDay,
  setSelectedDay,
  fetchedWarsByRound,
  fetchedWarsForDay,
  loadingFetchedWars
}) => {
  const [expandedRound, setExpandedRound] = useState(null)

  if (!cwlGroupData?.group?.rounds || cwlGroupData.group.rounds.length === 0) {
    return null
  }

  const validRounds = [1, 2, 3, 4, 5, 6, 7].filter((day) => {
    const round = cwlGroupData.group?.rounds?.find(r => r.round === day)
    return round?.warTags && getValidWarTags(round.warTags).length > 0
  })

  if (validRounds.length === 0) {
    return null
  }

  const getResultText = (result) => {
    switch (result.toLowerCase()) {
      case 'win':
        return 'Victory'
      case 'loss':
        return 'Defeat'
      case 'draw':
        return 'Draw'
      default:
        return result || '-'
    }
  }

  const getResultClass = (result) => {
    switch (result.toLowerCase()) {
      case 'win':
        return 'victory'
      case 'loss':
        return 'defeat'
      case 'draw':
        return 'draw'
      default:
        return 'pending'
    }
  }

  const getRoundCardClass = (result, status) => {
    const resultLower = result?.toLowerCase() || ''
    const statusLower = status?.toLowerCase() || ''
    
    // Check if in progress (priority: if status is in progress, show yellow regardless of result)
    if (statusLower === 'in progress' || statusLower.includes('progress')) {
      return 'result-in-progress'
    }
    
    // If status is completed, check result
    if (statusLower === 'completed') {
      if (resultLower === 'win' || resultLower === 'victory') {
        return 'result-win'
      } else if (resultLower === 'loss' || resultLower === 'defeat') {
        return 'result-defeat'
      } else if (resultLower === 'draw' || resultLower === 'tie') {
        return 'result-draw'
      }
    }
    
    // Default: if result exists but status is unclear, use result
    if (resultLower === 'win' || resultLower === 'victory') {
      return 'result-win'
    } else if (resultLower === 'loss' || resultLower === 'defeat') {
      return 'result-defeat'
    } else if (resultLower === 'draw' || resultLower === 'tie') {
      return 'result-draw'
    }
    
    return ''
  }

  const handleRoundClick = (day) => {
    if (expandedRound === day) {
      setExpandedRound(null)
      setSelectedDay(null)
    } else {
      setExpandedRound(day)
      setSelectedDay(day)
    }
  }

  return (
    <div className="cwl-subsection">
      <div className="cwl-wars-navigation">
        <div className="cwl-rounds-cards-container">
          {validRounds.map((day) => {
            const round = cwlGroupData.group?.rounds?.find(r => r.round === day)
            if (!round) return null

            // Use pre-calculated stats from backend if available
            // Fallback to fetching wars if backend doesn't provide stats (backward compatibility)
            const backendStats = cwlGroupData.roundStats?.[day]
            const backendRoundWars = cwlGroupData.warsByRound?.[day] || []
            
            // Use backend data if available, otherwise fall back to frontend calculation
            const stats = backendStats || {
              status: 'In Progress',
              result: '-',
              ourClanName: 'Our Clan',
              opponentClanName: 'Opponent',
              ourClanTag: '',
              opponentClanTag: '',
              ourClanBadge: null,
              opponentClanBadge: null,
              ourClanLevel: 0,
              opponentClanLevel: 0,
              ourStars: 0,
              opponentStars: 0,
              ourDestruction: 0,
              opponentDestruction: 0
            }
            
            // Use backend wars if available, otherwise try to get from fetchedWars
            let roundWars = backendRoundWars
            if (roundWars.length === 0) {
              // Fallback: check fetchedWarsForDay or fetchedWarsByRound
              if (selectedDay === day && fetchedWarsForDay && fetchedWarsForDay.length > 0) {
                roundWars = fetchedWarsForDay
              } else if (fetchedWarsByRound[day] && fetchedWarsByRound[day].length > 0) {
                roundWars = fetchedWarsByRound[day]
              } else if (cwlGroupData.allWars) {
                // Last fallback: filter from allWars
                const validWarTags = (round.warTags || []).filter(tag => tag && tag !== '#0' && tag !== '0')
                roundWars = (cwlGroupData.allWars || []).filter(war => {
                  const warTag = war.warTag || war.tag
                  return warTag && validWarTags.includes(warTag)
                })
              }
            }
            
            const isExpanded = expandedRound === day

            // Calculate attacks used and team size from round wars
            const ourAttacks = roundWars.reduce((sum, war) => {
              const normalizedOurTag = (clanTag || '').replace('#', '')
              const normalizedWarClanTag = (war.clan?.tag || '').replace('#', '')
              if (normalizedWarClanTag === normalizedOurTag) {
                return sum + (war.clan?.attacks || 0)
              } else {
                return sum + (war.opponent?.attacks || 0)
              }
            }, 0)
            
            const opponentAttacks = roundWars.reduce((sum, war) => {
              const normalizedOurTag = (clanTag || '').replace('#', '')
              const normalizedWarClanTag = (war.clan?.tag || '').replace('#', '')
              if (normalizedWarClanTag === normalizedOurTag) {
                return sum + (war.opponent?.attacks || 0)
              } else {
                return sum + (war.clan?.attacks || 0)
              }
            }, 0)
            
            const teamSize = roundWars.length > 0 ? (roundWars[0].teamSize || 0) : 0
            const maxAttacks = teamSize * 1
            
            // Get the latest end time from round wars
            const latestEndTime = roundWars.length > 0 
              ? roundWars.map(war => war.endTime).filter(Boolean).sort().pop()
              : null

            return (
              <div
                key={day}
                className={`current-war cwl-round-card ${isExpanded ? 'expanded' : ''} ${getRoundCardClass(stats.result, stats.status)}`}
              >
                {/* Round Header - Status and Result */}
                <div className="cwl-round-card-header">
                  <div className="cwl-round-badge-header">
                    <div className="cwl-round-badge">R{day}</div>
                    <div className="cwl-round-header-text">
                      <div className="cwl-round-title">Round {day}</div>
                      <div className="cwl-round-status">{stats.status}</div>
                    </div>
                  </div>
                  <button
                    className={`cwl-result-button ${getResultClass(stats.result)}`}
                  >
                    <span className="cwl-result-text">{getResultText(stats.result)}</span>
                  </button>
                </div>

                {/* War Header - Clan vs Opponent */}
                <div className="war-header">
                  <div className="war-clan">
                    {stats.ourClanBadge && (
                      <img
                        src={stats.ourClanBadge.medium || stats.ourClanBadge.small || stats.ourClanBadge.large}
                        alt={stats.ourClanName}
                        className="war-clan-badge"
                      />
                    )}
                    <div>
                      <h4>{stats.ourClanName}</h4>
                      <p>{stats.ourClanTag || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="war-vs">VS</div>
                  <div className="war-clan">
                    {stats.opponentClanBadge && (
                      <img
                        src={stats.opponentClanBadge.medium || stats.opponentClanBadge.small || stats.opponentClanBadge.large}
                        alt={stats.opponentClanName}
                        className="war-clan-badge"
                      />
                    )}
                    <div>
                      <h4>{stats.opponentClanName}</h4>
                      <p>{stats.opponentClanTag || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* War Stats - 2x2 Grid */}
                <div className="war-stats">
                  <div className="war-stat-group">
                    <div className="war-stat">
                      <span className="stat-label">⭐ Stars</span>
                      <span className="stat-value">{stats.ourStars} - {stats.opponentStars}</span>
                    </div>
                    <div className="war-stat">
                      <span className="stat-label">💥 Destruction</span>
                      <span className="stat-value">
                        {stats.ourDestruction.toFixed(2)}% - {stats.opponentDestruction.toFixed(2)}%
                      </span>
                    </div>
                    <div className="war-stat">
                      <span className="stat-label">⚔️ Attacks Used</span>
                      <span className="stat-value">
                        {ourAttacks} / {maxAttacks} - {opponentAttacks} / {maxAttacks}
                      </span>
                    </div>
                    <div className="war-stat">
                      <span className="stat-label">🏢 Team Size</span>
                      <span className="stat-value">{teamSize} vs {teamSize}</span>
                    </div>
                  </div>
                  {/* {latestEndTime && (
                    <div className="war-time">
                      <span>⏰ Ends: {new Date(latestEndTime).toLocaleString()}</span>
                    </div>
                  )} */}
                </div>
                
                {/* Show/Hide Attacks Button */}
                <div className="cwl-attacks-toggle-container">
                  <button
                    className="cwl-show-attacks-btn"
                    onClick={() => handleRoundClick(day)}
                  >
                    {isExpanded ? 'Hide Attacks' : 'Show Attacks'}
                    <span className={`cwl-attacks-chevron ${isExpanded ? 'expanded' : ''}`}>▼</span>
                  </button>
                </div>
                
                {/* War Details - Show under this specific round card when expanded */}
                {isExpanded && (
                  <CWLWarDetails
                    selectedDay={day}
                    cwlGroupData={cwlGroupData}
                    clanTag={clanTag}
                    fetchedWarsForDay={
                      day === selectedDay 
                        ? fetchedWarsForDay 
                        : (fetchedWarsByRound[day] || [])
                    }
                    loadingFetchedWars={day === selectedDay ? loadingFetchedWars : false}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

