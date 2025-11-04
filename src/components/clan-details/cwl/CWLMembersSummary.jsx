import React, { useMemo } from 'react'
import { getValidWarTags, filterWarsForDay, normalizeTag, sortMembersByPosition, getCWLTotalBonuses } from '../../../utils/cwlUtils'
import { thImages } from '../../../constants/thImages'

export const CWLMembersSummary = ({ cwlGroupData, clanTag, leagueName }) => {
  const summaryData = useMemo(() => {
    if (!cwlGroupData?.group?.rounds || !clanTag) {
      return []
    }

    // Get totalBonuses for the current clan from leaderboard
    let totalBonuses = null
    const normalizedOurTag = normalizeTag(clanTag) || clanTag
    if (cwlGroupData.leaderboard && Array.isArray(cwlGroupData.leaderboard)) {
      const clanLeaderboard = cwlGroupData.leaderboard.find(clan => {
        const normalizedClanTag = normalizeTag(clan.tag) || clan.tag
        return normalizedClanTag === normalizedOurTag || clan.tag === clanTag
      })
      if (clanLeaderboard) {
        // Use backend-provided totalBonuses if available
        if (clanLeaderboard.totalBonuses !== undefined && clanLeaderboard.totalBonuses !== null) {
          totalBonuses = clanLeaderboard.totalBonuses
        } else if (leagueName) {
          // Fallback to calculating if not provided by backend
          const wins = clanLeaderboard.wins !== undefined ? clanLeaderboard.wins : (clanLeaderboard.record ? parseInt(clanLeaderboard.record.split('-')[0]) || 0 : 0)
          totalBonuses = getCWLTotalBonuses(leagueName, wins)
        }
      }
    }

    const memberStatsMap = new Map() // Map of member tag -> { member, rounds: { 1: {...}, 2: {...}, ... }, totals: {...}, mirrorBonusRuleByRound: { 1: true/false, 2: true/false, ... }, hasMirrorBonusRule: boolean }

    // Process rounds - use array index + 1 as round number if round.round is not reliable
    // Process up to 7 rounds (or however many are available)
    const maxRounds = Math.min(cwlGroupData.group.rounds.length, 7)
    
    for (let i = 0; i < maxRounds; i++) {
      const round = cwlGroupData.group.rounds[i]
      const roundNum = i + 1 // Round numbers are 1-indexed
      
      if (!round?.warTags) {
        continue
      }

      const validWarTags = getValidWarTags(round.warTags)
      if (validWarTags.length === 0) {
        continue
      }

      // Get wars for this round
      let roundWars = filterWarsForDay(
        cwlGroupData.allWars || [],
        round.warTags
      )

      if (roundWars.length === 0 && cwlGroupData.currentWars) {
        roundWars = filterWarsForDay(
          cwlGroupData.currentWars,
          round.warTags
        )
      }

      if (roundWars.length === 0 && cwlGroupData.warsByRound?.[roundNum]) {
        roundWars = cwlGroupData.warsByRound[roundNum]
      }

      // Accumulate stats across all wars in this round
      const roundMemberStats = new Map() // Temporary map for this round: memberTag -> { stars, destruction, attacks }
      
      roundWars.forEach(war => {
        // Determine which clan is "our clan"
        const normalizedOurTag = normalizeTag(clanTag) || clanTag
        const normalizedWarClanTag = normalizeTag(war.clan?.tag) || war.clan?.tag
        
        const ourClan = normalizedWarClanTag === normalizedOurTag ? war.clan : war.opponent
        const opponentClan = normalizedWarClanTag === normalizedOurTag ? war.opponent : war.clan

        if (!ourClan?.members) return

        // Sort members by position for mirror bonus rule checking
        const sortedOurMembers = sortMembersByPosition(ourClan.members || [])
        const sortedOpponentMembers = sortMembersByPosition(opponentClan?.members || [])

        // Helper function to find defender by tag
        const findDefender = (defenderTag) => {
          if (!defenderTag || !sortedOpponentMembers) return null
          return sortedOpponentMembers.find(m => {
            const normalizedDefenderTag = normalizeTag(defenderTag)
            const normalizedMemberTag = normalizeTag(m.tag)
            return normalizedMemberTag === normalizedDefenderTag
          })
        }

        // Helper function to get sequential position (1-based) in sorted array
        const getSequentialPosition = (member, sortedArray) => {
          const index = sortedArray.findIndex(m => {
            const normalizedMemberTag = normalizeTag(m.tag)
            const normalizedSearchTag = normalizeTag(member.tag)
            return normalizedMemberTag === normalizedSearchTag
          })
          return index >= 0 ? index + 1 : null
        }

        // Process each member in our clan
        ourClan.members.forEach(member => {
          const memberTag = normalizeTag(member.tag) || member.tag
          
          // Initialize member in main map if not exists
          if (!memberStatsMap.has(memberTag)) {
            memberStatsMap.set(memberTag, {
              member: {
                name: member.name,
                tag: member.tag,
                townHallLevel: member.townHallLevel
              },
              rounds: {},
              totals: {
                stars: 0,
                destruction: 0,
                attacks: 0
              },
              mirrorBonusRuleByRound: {}, // Track mirror bonus rule compliance per round
              hasMirrorBonusRule: false
            })
          }

          // Initialize member in round stats if not exists
          if (!roundMemberStats.has(memberTag)) {
            roundMemberStats.set(memberTag, {
              stars: 0,
              destruction: 0,
              attacks: 0,
              hasAttacks: false,
              hasMirrorBonusInRound: false
            })
          }

          // Calculate stars and destruction for this war
          const attacks = member.attacks || []
          const warStars = attacks.reduce((sum, attack) => sum + (attack.stars || 0), 0)
          const warDestruction = attacks.reduce((sum, attack) => {
            const destruction = attack.destructionPercentage || attack.destruction || 0
            return sum + destruction
          }, 0)

          // Track if member had attacks in this round
          if (attacks.length > 0) {
            const roundStats = roundMemberStats.get(memberTag)
            roundStats.hasAttacks = true

            // Check if any attack is a mirror bonus attack
            const attackerSequentialPos = getSequentialPosition(member, sortedOurMembers)
            const hasMirrorBonusInThisWar = attackerSequentialPos && attacks.some((attack) => {
              const defender = findDefender(attack.defenderTag)
              if (!defender || !attackerSequentialPos) return false
              
              // Get sequential position of defender (1-based position in sorted opponent array)
              const defenderSequentialPos = getSequentialPosition(defender, sortedOpponentMembers)
              
              // Mirror bonus attack if sequential positions match
              return attackerSequentialPos === defenderSequentialPos
            })

            // Update mirror bonus rule status for this round
            if (hasMirrorBonusInThisWar) {
              roundStats.hasMirrorBonusInRound = true
            }
          }

          // Accumulate in round stats (across all wars in this round)
          const roundStats = roundMemberStats.get(memberTag)
          roundStats.stars += warStars
          roundStats.destruction += warDestruction
          roundStats.attacks += attacks.length
        })
      })

      // Now set the accumulated round stats for each member
      roundMemberStats.forEach((roundStats, memberTag) => {
        const memberStats = memberStatsMap.get(memberTag)
        if (memberStats) {
          // Set round data (accumulated across all wars in this round)
          memberStats.rounds[roundNum] = {
            stars: roundStats.stars,
            destruction: roundStats.destruction,
            attacks: roundStats.attacks
          }

          // Track mirror bonus rule compliance for this round
          // If member had attacks in this round, check if they followed mirror bonus rule
          if (roundStats.hasAttacks) {
            memberStats.mirrorBonusRuleByRound[roundNum] = roundStats.hasMirrorBonusInRound
          }

          // Update totals
          memberStats.totals.stars += roundStats.stars
          memberStats.totals.destruction += roundStats.destruction
          memberStats.totals.attacks += roundStats.attacks
        }
      })
    }

    // Determine final mirror bonus rule compliance: must follow mirror bonus rule in ALL rounds where they had attacks
    memberStatsMap.forEach((memberStats, memberTag) => {
      const roundsWithAttacks = Object.keys(memberStats.mirrorBonusRuleByRound)
      
      // If member participated in at least one round
      if (roundsWithAttacks.length > 0) {
        // Check if they followed mirror bonus rule in ALL rounds where they had attacks
        const allRoundsFollowMirrorBonusRule = roundsWithAttacks.every(roundNum => 
          memberStats.mirrorBonusRuleByRound[roundNum] === true
        )
        memberStats.hasMirrorBonusRule = allRoundsFollowMirrorBonusRule
      } else {
        // No attacks in any round, so no mirror bonus rule to follow
        memberStats.hasMirrorBonusRule = false
      }
    })

    // Convert map to array and sort by total stars (descending)
    const sortedMembers = Array.from(memberStatsMap.values()).sort((a, b) => {
      if (b.totals.stars !== a.totals.stars) {
        return b.totals.stars - a.totals.stars
      }
      return b.totals.destruction - a.totals.destruction
    })

    // Mark bonus-eligible members (top X members based on totalBonuses)
    // IMPORTANT: Only members who followed the mirror bonus rule are eligible for bonuses
    if (totalBonuses !== null && totalBonuses > 0) {
      // Filter members who followed the mirror bonus rule
      const mirrorBonusRuleMembers = sortedMembers.filter(member => member.hasMirrorBonusRule === true)
      
      // Take top X members from those who followed the mirror bonus rule
      const bonusCount = Math.min(totalBonuses, mirrorBonusRuleMembers.length)
      for (let i = 0; i < bonusCount; i++) {
        const member = mirrorBonusRuleMembers[i]
        // Find the member in the sortedMembers array and mark as bonus-eligible
        const memberIndex = sortedMembers.findIndex(m => m.member.tag === member.member.tag)
        if (memberIndex !== -1) {
          sortedMembers[memberIndex].isBonusEligible = true
        }
      }
    }

    return sortedMembers
  }, [cwlGroupData, clanTag, leagueName])

  if (summaryData.length === 0) {
    return null
  }

  const rounds = [1, 2, 3, 4, 5, 6, 7]

  return (
    <div className="cwl-members-summary-section">
      <h3 className="cwl-summary-title">📊 CWL Members Summary</h3>
      <div className="cwl-summary-table-wrapper">
        <table className="cwl-summary-table">
          <thead>
            <tr>
              <th className="cwl-summary-col-srno">Sr. No</th>
              <th className="cwl-summary-col-member">Member</th>
              {rounds.map(roundNum => (
                <th key={roundNum} className="cwl-summary-col-round">
                  <div>Round {roundNum}</div>
                  <div className="cwl-summary-subheaders">
                    <span>⭐</span>
                    <span>💥</span>
                  </div>
                </th>
              ))}
              <th className="cwl-summary-col-total">
                <div>Total</div>
                <div className="cwl-summary-subheaders">
                  <span>⭐</span>
                  <span>💥</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((memberData, idx) => {
              const rowClasses = []
              if (memberData.hasMirrorBonusRule) {
                rowClasses.push('mirror-bonus-rule-row')
              }
              if (memberData.isBonusEligible) {
                rowClasses.push('bonus-eligible-row')
              }
              return (
                <tr key={memberData.member.tag || idx} className={rowClasses.join(' ')}>
                  <td className="cwl-summary-srno-cell">
                    {idx + 1}
                  </td>
                  <td className="cwl-summary-member-cell">
                    <div className="cwl-summary-member-info">
                      {thImages[memberData.member.townHallLevel] && (
                        <img
                          src={thImages[memberData.member.townHallLevel]}
                          alt={`TH${memberData.member.townHallLevel}`}
                          className="cwl-summary-th-image"
                        />
                      )}
                      <div className="cwl-summary-member-details">
                        <div className="cwl-summary-member-name">
                          {memberData.member.name}
                          {memberData.isBonusEligible && (
                            <span className="bonus-indicator" title="Bonus Eligible">🏅</span>
                          )}
                        </div>
                        <div className="cwl-summary-member-tag">{memberData.member.tag}</div>
                      </div>
                    </div>
                  </td>
                {rounds.map(roundNum => {
                  const roundData = memberData.rounds[roundNum]
                  return (
                    <td key={roundNum} className="cwl-summary-round-cell">
                      {roundData ? (
                        <div className="cwl-summary-round-content">
                          <div className="cwl-summary-stars">{roundData.stars}⭐</div>
                          <div className="cwl-summary-destruction">{roundData.destruction.toFixed(1)}%</div>
                        </div>
                      ) : (
                        <div className="cwl-summary-no-data">-</div>
                      )}
                    </td>
                  )
                })}
                <td className="cwl-summary-total-cell">
                  <div className="cwl-summary-total-content">
                    <div className="cwl-summary-total-stars">{memberData.totals.stars}⭐</div>
                    <div className="cwl-summary-total-destruction">{memberData.totals.destruction.toFixed(1)}%</div>
                  </div>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
