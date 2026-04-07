import React, { useMemo, useCallback, memo } from 'react'
import { thImages } from '../../../constants/thImages'

/** Keep sort rules aligned with backend getMemberSummaryComparator (cwlService.js). */
function getMemberSummaryComparator (sortBy) {
  if (sortBy === 'mapPosition') {
    return (a, b) => {
      const aPos = a.member?.mapPosition != null ? a.member.mapPosition : 9999
      const bPos = b.member?.mapPosition != null ? b.member.mapPosition : 9999
      if (aPos !== bPos) return aPos - bPos
      return (a.member?.name || '').localeCompare(b.member?.name || '', undefined, { sensitivity: 'base' })
    }
  }
  const roundNum = parseInt(sortBy, 10)
  if (!Number.isNaN(roundNum) && roundNum >= 1 && roundNum <= 7) {
    return (a, b) => {
      const aRoundData = a.rounds?.[roundNum]
      const bRoundData = b.rounds?.[roundNum]
      if (!aRoundData && !bRoundData) return 0
      if (!aRoundData) return 1
      if (!bRoundData) return -1
      if (bRoundData.stars !== aRoundData.stars) return bRoundData.stars - aRoundData.stars
      return bRoundData.destruction - aRoundData.destruction
    }
  }
  return null
}

const MemberRow = memo(({ memberData, idx, rounds: roundNumbers }) => {
  const townHall = memberData.member.townHallLevel || memberData.member.townhallLevel
  const rowClasses = []
  const roundKeys = Object.keys(memberData.rounds || {})
  const avgStars = memberData.totals.averageStars != null
    ? memberData.totals.averageStars
    : (roundKeys.length ? Math.round((memberData.totals.stars / roundKeys.length) * 10) / 10 : 0)
  const avgDestruction = memberData.totals.averageDestruction != null
    ? memberData.totals.averageDestruction
    : (roundKeys.length ? Math.round((memberData.totals.destruction / roundKeys.length) * 10) / 10 : 0)
  if (memberData.hasMirrorBonusRule) {
    rowClasses.push('mirror-bonus-rule-row')
  }
  if (memberData.isBonusEligible) {
    rowClasses.push('bonus-eligible-row')
  }

  return (
    <tr className={rowClasses.join(' ')}>
      <td className="cwl-summary-srno-cell">
        {idx + 1}
      </td>
      <td className="cwl-summary-member-cell">
        <div className="cwl-summary-member-info">
          {thImages[townHall] && (
            <img
              src={thImages[townHall]}
              alt={`TH${townHall}`}
              className="cwl-summary-th-image"
            />
          )}
          <div className="cwl-summary-member-details">
            <div className="cwl-summary-member-name">
              {memberData.member.name}
              {memberData.member.mapPosition != null && (
                <span className="cwl-summary-map-position" title="War map position">
                  {' '}#{memberData.member.mapPosition}
                </span>
              )}
              {memberData.isBonusEligible && (
                <span className="bonus-indicator" title="Bonus Eligible">🏅</span>
              )}
            </div>
            <div className="cwl-summary-member-tag">{memberData.member.tag}</div>
          </div>
        </div>
      </td>
      {roundNumbers.map(roundNum => {
        const roundData = memberData.rounds[roundNum]
        const attackedBases = roundData?.attackedBases
        const basesLabel = attackedBases?.length
          ? attackedBases.map(b => `Base ${b}`).join(' & ')
          : null
        return (
          <td key={roundNum} className="cwl-summary-round-cell">
            {roundData ? (
              <div className="cwl-summary-round-content">
                {basesLabel && (
                  <div className="cwl-summary-attacked-bases" title={`Attacked: ${basesLabel}`}>
                    {basesLabel}
                  </div>
                )}
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
      <td className="cwl-summary-average-cell">
        <div className="cwl-summary-average-content">
          <div className="cwl-summary-average-stars">{avgStars}⭐</div>
          <div className="cwl-summary-average-destruction">{avgDestruction.toFixed(1)}%</div>
        </div>
      </td>
    </tr>
  )
})

MemberRow.displayName = 'MemberRow'

export const CWLMembersSummary = ({ cwlGroupData, clanTag, leagueName, sortBy = 'total', onSortChange }) => {
  const baseSummaryData = useMemo(() => {
    if (!cwlGroupData) {
      return []
    }

    if (cwlGroupData.memberSummary && Array.isArray(cwlGroupData.memberSummary) && cwlGroupData.memberSummary.length > 0) {
      return cwlGroupData.memberSummary
    }

    return []
  }, [cwlGroupData])

  const summaryData = useMemo(() => {
    if (baseSummaryData.length === 0) {
      return []
    }

    if (sortBy === 'total' || sortBy === 'average') {
      return baseSummaryData
    }

    const cmp = getMemberSummaryComparator(sortBy)
    if (cmp) {
      return baseSummaryData.slice().sort(cmp)
    }

    return baseSummaryData
  }, [baseSummaryData, sortBy])

  const validRounds = useMemo(() => {
    const fromApi = cwlGroupData?.validRounds
    if (Array.isArray(fromApi) && fromApi.length > 0) {
      return [...fromApi].sort((a, b) => a - b)
    }

    const roundsWithData = new Set()

    if (cwlGroupData?.roundStats) {
      Object.keys(cwlGroupData.roundStats).forEach(roundNum => {
        const round = parseInt(roundNum, 10)
        if (!Number.isNaN(round) && round >= 1 && round <= 7) {
          roundsWithData.add(round)
        }
      })
    }

    if (baseSummaryData.length > 0 && roundsWithData.size < 7) {
      baseSummaryData.forEach(memberData => {
        if (memberData.rounds) {
          Object.keys(memberData.rounds).forEach(roundNum => {
            const round = parseInt(roundNum, 10)
            if (!Number.isNaN(round) && round >= 1 && round <= 7) {
              roundsWithData.add(round)
            }
          })
        }
      })
    }

    if (roundsWithData.size < 3 && cwlGroupData?.rounds && Array.isArray(cwlGroupData.rounds)) {
      cwlGroupData.rounds.forEach(round => {
        if (round.round && round.round >= 1 && round.round <= 7) {
          roundsWithData.add(round.round)
        }
      })
    }

    return Array.from(roundsWithData).sort((a, b) => a - b)
  }, [baseSummaryData, cwlGroupData, cwlGroupData?.validRounds])

  const rounds = useMemo(() =>
    validRounds.length > 0 ? validRounds : [1, 2, 3, 4, 5, 6, 7],
  [validRounds]
  )

  const handleSortChange = useCallback((e) => {
    if (onSortChange) {
      onSortChange(e.target.value)
    }
  }, [onSortChange])

  if (summaryData.length === 0) {
    return null
  }

  return (
    <div className="cwl-members-summary-section">
      <div className="cwl-summary-header">
        <h3 className="cwl-summary-title">📊 CWL Members Summary</h3>
        <div className="cwl-summary-sort-control">
          <label htmlFor="cwl-sort-select">Sort by:</label>
          <select
            id="cwl-sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="cwl-summary-sort-select"
          >
            <option value="total">Total (Stars & Destruction)</option>
            <option value="average">Average (Stars & Destruction)</option>
            <option value="mapPosition">Map position</option>
            {rounds.map(roundNum => (
              <option key={roundNum} value={roundNum.toString()}>
                Round {roundNum}
              </option>
            ))}
          </select>
        </div>
      </div>
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
              <th className="cwl-summary-col-average">
                <div>Average</div>
                <div className="cwl-summary-subheaders">
                  <span>⭐</span>
                  <span>💥</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((memberData, idx) => (
              <MemberRow
                key={memberData.member.tag || idx}
                memberData={memberData}
                idx={idx}
                rounds={rounds}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
