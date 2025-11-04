import React, { useState } from 'react'
import { getValidWarTags } from '../../../utils/cwlUtils'
// import { calculateRoundStats, getRoundWars } from '../../../utils/roundStats' // Moved to backend
import { CWLWarDetails } from './CWLWarDetails'
import { RoundCard } from './RoundCard'

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

            // Use backend-provided values if available, otherwise calculate (backward compatibility)
            const ourAttacks = stats.ourAttacks !== undefined 
              ? stats.ourAttacks 
              : roundWars.reduce((sum, war) => {
                  const normalizedOurTag = (clanTag || '').replace('#', '')
                  const normalizedWarClanTag = (war.clan?.tag || '').replace('#', '')
                  if (normalizedWarClanTag === normalizedOurTag) {
                    return sum + (war.clan?.attacks || 0)
                  } else {
                    return sum + (war.opponent?.attacks || 0)
                  }
                }, 0)
            
            const opponentAttacks = stats.opponentAttacks !== undefined 
              ? stats.opponentAttacks 
              : roundWars.reduce((sum, war) => {
                  const normalizedOurTag = (clanTag || '').replace('#', '')
                  const normalizedWarClanTag = (war.clan?.tag || '').replace('#', '')
                  if (normalizedWarClanTag === normalizedOurTag) {
                    return sum + (war.opponent?.attacks || 0)
                  } else {
                    return sum + (war.clan?.attacks || 0)
                  }
                }, 0)
            
            const teamSize = stats.teamSize !== undefined 
              ? stats.teamSize 
              : (roundWars.length > 0 ? (roundWars[0].teamSize || 0) : 0)
            
            const maxAttacks = stats.maxAttacks !== undefined 
              ? stats.maxAttacks 
              : teamSize * 1

            return (
              <RoundCard
                key={day}
                day={day}
                stats={stats}
                roundWars={roundWars}
                ourAttacks={ourAttacks}
                opponentAttacks={opponentAttacks}
                maxAttacks={maxAttacks}
                teamSize={teamSize}
                isExpanded={isExpanded}
                onToggle={() => handleRoundClick(day)}
                getResultText={getResultText}
                getResultClass={getResultClass}
                getRoundCardClass={getRoundCardClass}
                cwlGroupData={cwlGroupData}
                clanTag={clanTag}
                selectedDay={selectedDay}
                fetchedWarsForDay={fetchedWarsForDay}
                fetchedWarsByRound={fetchedWarsByRound}
                loadingFetchedWars={loadingFetchedWars}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

