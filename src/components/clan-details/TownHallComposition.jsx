import React from 'react'

function TownHallComposition({ memberList, totalMembers }) {
  const getTownHallComposition = () => {
    if (!memberList) return {}

    const composition = {}
    memberList.forEach(member => {
      const th = member.townHallLevel
      composition[th] = (composition[th] || 0) + 1
    })

    return composition
  }

  const thComposition = getTownHallComposition()

  return (
    <div className="detail-section">
      <h3>🏠 Town Hall Composition</h3>
      <div className="th-composition">
        {Object.keys(thComposition).sort((a, b) => b - a).map(th => {
          const count = thComposition[th]
          const percentage = (count / totalMembers) * 100
          return (
            <div key={th} className="th-bar-container">
              <div className="th-label">
                <span className="th-level">TH{th}</span>
                <span className="th-count">{count} members</span>
              </div>
              <div className="th-bar">
                <div
                  className="th-bar-fill"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="th-percentage">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TownHallComposition

