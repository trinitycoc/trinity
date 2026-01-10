import React, { useMemo } from 'react'
import { thImages } from '../../../constants/thImages'

export const CWLMembersSummary = ({ cwlGroupData, clanTag, leagueName }) => {
  // Use pre-calculated member summary from backend if available
  // This eliminates ~200 lines of client-side calculation
  const summaryData = useMemo(() => {
    if (!cwlGroupData) {
      return []
    }

    // Backend now provides pre-calculated memberSummary from /all endpoint
    if (cwlGroupData.memberSummary && Array.isArray(cwlGroupData.memberSummary) && cwlGroupData.memberSummary.length > 0) {
      return cwlGroupData.memberSummary
    }

    // Fallback: If backend doesn't provide memberSummary (e.g., using /current endpoint), return empty
    // This maintains backward compatibility but encourages using /all endpoint for full features
    return []
  }, [cwlGroupData])

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
                      {thImages[memberData.member.townHallLevel || memberData.member.townhallLevel] && (
                        <img
                          src={thImages[memberData.member.townHallLevel || memberData.member.townhallLevel]}
                          alt={`TH${memberData.member.townHallLevel || memberData.member.townhallLevel}`}
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
