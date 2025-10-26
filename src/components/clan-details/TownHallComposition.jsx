import React from 'react'
import th1Image from '/th-1.png'
import th2Image from '/th-2.png'
import th3Image from '/th-3.png'
import th4Image from '/th-4.png'
import th5Image from '/th-5.png'
import th6Image from '/th-6.png'
import th7Image from '/th-7.png'
import th8Image from '/th-8.png'
import th9Image from '/th-9.png'
import th10Image from '/th-10.png'
import th11Image from '/th-11.png'
import th12Image from '/th-12.png'
import th13Image from '/th-13.png'
import th14Image from '/th-14.png'
import th15Image from '/th-15.png'
import th16Image from '/th-16.png'
import th17Image from '/th-17.png'

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

  const thImages = {
    1: th1Image,
    2: th2Image,
    3: th3Image,
    4: th4Image,
    5: th5Image,
    6: th6Image,
    7: th7Image,
    8: th8Image,
    9: th9Image,
    10: th10Image,
    11: th11Image,
    12: th12Image,
    13: th13Image,
    14: th14Image,
    15: th15Image,
    16: th16Image,
    17: th17Image
  }

  const thComposition = getTownHallComposition()

  return (
    <div className="detail-section">
      <h3>🏠 Town Hall Composition</h3>
      <div className="th-composition">
        {Object.keys(thComposition).sort((a, b) => b - a).map(th => {
          const count = thComposition[th]
          const percentage = (count / totalMembers) * 100
          const thImage = thImages[th]
          
          return (
            <div key={th} className="th-bar-container">
              <div className="th-label">
                {thImage && (
                  <img src={thImage} alt={`TH${th}`} className="th-icon" />
                )}
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

