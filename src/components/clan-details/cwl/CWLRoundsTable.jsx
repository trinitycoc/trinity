import React, { useState } from 'react'
import { getValidWarTags } from '../../../utils/cwlUtils'
import { CWLWarDetails } from './CWLWarDetails'
import { RoundCard } from './RoundCard'

export const CWLRoundsTable = ({
  cwlGroupData,
  clanTag,
  selectedDay,
  setSelectedDay,
  fetchedWarsByRound,
  fetchedWarsForDay,
  loadingFetchedWars,
  isAdmin = false
}) => {
  const [expandedRound, setExpandedRound] = useState(null)

  // Check for rounds from multiple sources (for backward compatibility)
  // Priority: 1. rounds from /all endpoint (has wars), 2. group.rounds (has warTags only), 3. roundStats
  const hasRounds = (cwlGroupData?.rounds && cwlGroupData.rounds.length > 0) ||
    (cwlGroupData?.group?.rounds && cwlGroupData.group.rounds.length > 0) ||
    (cwlGroupData?.roundStats && Object.keys(cwlGroupData.roundStats).length > 0)

  if (!hasRounds) {
    return null
  }

  const validRounds = [1, 2, 3, 4, 5, 6, 7].filter((day) => {
    // First check if round has data in rounds array (from /all endpoint with wars)
    if (cwlGroupData?.rounds && Array.isArray(cwlGroupData.rounds)) {
      const roundWithWars = cwlGroupData.rounds.find(r => r.round === day)
      // Include round if it exists (even if wars array is empty, round still exists)
      if (roundWithWars) {
        return true
      }
    }

    // Check roundStats (pre-calculated stats from backend - includes all rounds)
    if (cwlGroupData?.roundStats && cwlGroupData.roundStats[day]) {
      return true
    }

    // Check warsByRound (wars organized by round number from /all endpoint)
    if (cwlGroupData?.warsByRound && cwlGroupData.warsByRound[day] && cwlGroupData.warsByRound[day].length > 0) {
      return true
    }

    // Fallback: check group.rounds for warTags (from /current endpoint)
    const round = cwlGroupData?.group?.rounds?.find(r => r.round === day)
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
            // Find round from multiple sources (for backward compatibility)
            // Priority: 1. rounds from /all endpoint (has wars), 2. group.rounds (has warTags only)
            let round = null
            if (cwlGroupData?.rounds && Array.isArray(cwlGroupData.rounds)) {
              round = cwlGroupData.rounds.find(r => r.round === day)
            }
            if (!round && cwlGroupData?.group?.rounds) {
              round = cwlGroupData.group.rounds.find(r => r.round === day)
            }

            // Use pre-calculated stats from backend if available
            // Fallback to fetching wars if backend doesn't provide stats (backward compatibility)
            const backendStats = cwlGroupData.roundStats?.[day]
            const backendRoundWars = cwlGroupData.warsByRound?.[day] || []

            // If we have stats or wars for this round, show it even if round object is missing
            // This handles cases where /all endpoint provides data but group.rounds doesn't
            if (!round && !backendStats && backendRoundWars.length === 0) {
              return null
            }

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
                isAdmin={isAdmin}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

