import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { fetchClan, fetchClanWarLog, fetchClanWar, fetchClanCapitalRaids } from '../services/api'

function ClanDetails() {
  const { clanTag } = useParams()
  const navigate = useNavigate()
  const [clan, setClan] = useState(null)
  const [warLog, setWarLog] = useState([])
  const [currentWar, setCurrentWar] = useState(null)
  const [capitalRaids, setCapitalRaids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showWarLog, setShowWarLog] = useState(false)
  const [showCurrentWar, setShowCurrentWar] = useState(false)
  const [showCapitalRaids, setShowCapitalRaids] = useState(false)

  useEffect(() => {
    const loadClanDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch clan data, war log, current war, and capital raids
        const [clanData, warLogData, currentWarData, capitalRaidsData] = await Promise.all([
          fetchClan(clanTag),
          fetchClanWarLog(clanTag).catch(() => []),
          fetchClanWar(clanTag).catch((err) => {
            console.error('Error fetching current war:', err)
            return null
          }),
          fetchClanCapitalRaids(clanTag).catch(() => [])
        ])

        setClan(clanData)
        setWarLog(Array.isArray(warLogData) ? warLogData : [])
        setCurrentWar(currentWarData)
        setCapitalRaids(Array.isArray(capitalRaidsData) ? capitalRaidsData : [])
      } catch (err) {
        console.error('Error loading clan details:', err)
        setError(err.message || 'Failed to load clan details')
      } finally {
        setLoading(false)
      }
    }

    if (clanTag) {
      loadClanDetails()
    }
  }, [clanTag])

  // Calculate Town Hall composition
  const getTownHallComposition = () => {
    if (!clan?.memberList) return {}

    const composition = {}
    clan.memberList.forEach(member => {
      const th = member.townHallLevel
      composition[th] = (composition[th] || 0) + 1
    })

    return composition
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'leader': return '👑'
      case 'coLeader': return '⭐'
      case 'admin': return '🛡️'
      case 'member': return '👤'
      default: return '👤'
    }
  }

  const getRoleName = (role) => {
    switch (role) {
      case 'leader': return 'Leader'
      case 'coLeader': return 'Co-Leader'
      case 'admin': return 'Elder'
      case 'member': return 'Member'
      default: return role
    }
  }

  if (loading) {
    return (
      <section className="clan-details-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading clan details...</p>
        </div>
      </section>
    )
  }

  if (error || !clan) {
    return (
      <section className="clan-details-page">
        <div className="error-container">
          <h2>❌ Error Loading Clan</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/clans')}>
            Back to Clans
          </button>
        </div>
      </section>
    )
  }

  const thComposition = getTownHallComposition()
  const maxTH = Math.max(...Object.keys(thComposition).map(Number))

  return (
    <section className="clan-details-page">
      <button className="back-button" onClick={() => navigate('/clans')}>
        ← Back to Clans
      </button>

      <div className="clan-details-header">
        <img
          src={clan.badgeUrls?.large || clan.badgeUrls?.medium || clan.badgeUrls?.small}
          alt={`${clan.name} badge`}
          className="clan-badge-large"
        />
        <div className="clan-header-info">
          <SectionTitle>{clan.name}</SectionTitle>
          <p className="clan-tag-large">{clan.tag}</p>
          <div className="header-stats">
            <span>🏆 Level {clan.clanLevel}</span>
            <span>👥 {clan.members}/50</span>
            <span>⚔️ {clan.warWins} Wins</span>
          </div>
          <div className="header-actions">
            {currentWar && currentWar.state !== 'notInWar' && (
              <button
                className="war-log-toggle"
                onClick={() => {
                  // If turning on current war, turn off others
                  if (!showCurrentWar) {
                    setShowWarLog(false)
                    setShowCapitalRaids(false)
                  }
                  setShowCurrentWar(!showCurrentWar)
                }}
              >
                {showCurrentWar ? '🗡️ Hide Current War' : '🗡️ Show Current War'}
              </button>
            )}
            {(warLog.length > 0 || clan.isWarLogPublic) && (
              <button
                className="war-log-toggle"
                onClick={() => {
                  // If turning on war log, turn off others
                  if (!showWarLog) {
                    setShowCurrentWar(false)
                    setShowCapitalRaids(false)
                  }
                  setShowWarLog(!showWarLog)
                }}
              >
                {showWarLog ? '📊 Hide War Log' : '📊 Show War Log'}
              </button>
            )}
            {capitalRaids.length > 0 && (
              <button
                className="war-log-toggle"
                onClick={() => {
                  // If turning on capital raids, turn off others
                  if (!showCapitalRaids) {
                    setShowCurrentWar(false)
                    setShowWarLog(false)
                  }
                  setShowCapitalRaids(!showCapitalRaids)
                }}
              >
                {showCapitalRaids ? '🏰 Hide Capital Raids' : '🏰 Show Capital Raids'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="clan-details-content">
        {/* Show clan info sections only when war sections are not shown */}
        {!showCurrentWar && !showWarLog && !showCapitalRaids && (
          <>
            {/* Description */}
            <div className="detail-section">
              <h3>📝 Description</h3>
              <p className="clan-description-full">{clan.description}</p>
            </div>

            {/* Town Hall Composition */}
            <div className="detail-section">
              <h3>🏠 Town Hall Composition</h3>
              <div className="th-composition">
                {Object.keys(thComposition).sort((a, b) => b - a).map(th => {
                  const count = thComposition[th]
                  const percentage = (count / clan.members) * 100
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

            {/* Members List */}
            <div className="detail-section">
              <h3>👥 Members ({clan.members})</h3>
              <div className="members-list">
                <div className="members-table">
                  <div className="members-header">
                    <div className="member-rank">#</div>
                    <div className="member-name">Name</div>
                    <div className="member-role">Role</div>
                    <div className="member-th">TH</div>
                    <div className="member-trophies">Trophies</div>
                    <div className="member-donations">Donations</div>
                  </div>
                  {clan.memberList?.map((member, index) => (
                    <div key={member.tag} className="member-row">
                      <div className="member-rank">{member.clanRank}</div>
                      <div className="member-name">
                        {getRoleIcon(member.role)} {member.name}
                      </div>
                      <div className="member-role">{getRoleName(member.role)}</div>
                      <div className="member-th">TH{member.townHallLevel}</div>
                      <div className="member-trophies">🏆 {member.trophies.toLocaleString()}</div>
                      <div className="member-donations">
                        ⬆️ {member.donations} | ⬇️ {member.donationsReceived}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Current War */}
        {showCurrentWar && currentWar && currentWar.state !== 'notInWar' && (
          <div className="detail-section">
            <h3>🗡️ Current War - {currentWar.state === 'inWar' ? 'Battle Day' : currentWar.state === 'preparation' ? 'Preparation' : currentWar.state}</h3>
            {currentWar.clan && currentWar.opponent ? (
              <div className="current-war">
                <div className="war-header">
                  <div className="war-clan">
                    {currentWar.clan.badgeUrls?.medium && (
                      <img
                        src={currentWar.clan.badgeUrls.medium || currentWar.clan.badgeUrls.small || currentWar.clan.badgeUrls.large}
                        alt={currentWar.clan.name || 'Clan'}
                        className="war-clan-badge"
                      />
                    )}
                    <div>
                      <h4>{currentWar.clan.name || 'Unknown Clan'}</h4>
                      <p>{currentWar.clan.tag || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="war-vs">VS</div>
                  <div className="war-clan">
                    {currentWar.opponent.badgeUrls?.medium && (
                      <img
                        src={currentWar.opponent.badgeUrls.medium || currentWar.opponent.badgeUrls.small || currentWar.opponent.badgeUrls.large}
                        alt={currentWar.opponent.name || 'Opponent'}
                        className="war-clan-badge"
                      />
                    )}
                    <div>
                      <h4>{currentWar.opponent.name || 'Unknown Clan'}</h4>
                      <p>{currentWar.opponent.tag || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="war-stats">
                  <div className="war-stat-group">
                    <div className="war-stat">
                      <span className="stat-label">⭐ Stars</span>
                      <span className="stat-value">{currentWar.clan.stars || 0} - {currentWar.opponent.stars || 0}</span>
                    </div>
                    <div className="war-stat">
                      <span className="stat-label">💥 Destruction</span>
                      <span className="stat-value">
                        {(currentWar.clan.destructionPercentage || 0).toFixed(2)}% - {(currentWar.opponent.destructionPercentage || 0).toFixed(2)}%
                      </span>
                    </div>
                    <div className="war-stat">
                      <span className="stat-label">⚔️ Attacks Used</span>
                      <span className="stat-value">
                        {currentWar.clan.attacks || 0} / {(currentWar.teamSize || 0) * 2} - {currentWar.opponent.attacks || 0} / {(currentWar.teamSize || 0) * 2}
                      </span>
                    </div>
                    <div className="war-stat">
                      <span className="stat-label">🏢 Team Size</span>
                      <span className="stat-value">{currentWar.teamSize || 0} vs {currentWar.teamSize || 0}</span>
                    </div>
                  </div>
                  {currentWar.endTime && (
                    <div className="war-time">
                      <span>⏰ Ends: {new Date(currentWar.endTime).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="war-log-private">
                <p>⚠️ War data is incomplete or unavailable</p>
              </div>
            )}
          </div>
        )}

        {/* War Log */}
        {showWarLog && (
          <>
            {warLog.length > 0 && (
              <div className="detail-section">
                <h3>⚔️ War Log (Last {Math.min(warLog.length, 20)} wars)</h3>
                <div className="war-log">
                  {warLog.slice(0, 20).map((war, index) => (
                    <div key={index} className={`war-log-item war-result-${war.result?.toLowerCase() || 'unknown'}`}>
                      <div className="war-info">
                        <div className="war-clans-matchup">
                          <span className="war-clan-name">{war.clan?.name || 'Unknown'}</span>
                          <span className="war-vs-text">vs</span>
                          <span className="war-clan-name">{war.opponent?.name || 'Unknown'}</span>
                        </div>
                         <div className="war-details">
                           <span>⭐ {war.clan?.stars || 0} - {war.opponent?.stars || 0}</span>
                           <span>💥 {(war.clan?.destruction || 0).toFixed(1)}% - {(war.opponent?.destruction || 0).toFixed(1)}%</span>
                           {war.clan?.attackCount != null && <span>⚔️ Attacks: {war.clan.attackCount}</span>}
                           {war.clan?.expEarned != null && <span>✨ XP: {war.clan.expEarned}</span>}
                           {war.teamSize > 0 && <span>👥 {war.teamSize}v{war.teamSize}</span>}
                           <span>📅 {war.endTime ? new Date(war.endTime).toLocaleDateString() : 'N/A'}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!clan.isWarLogPublic && warLog.length === 0 && (
              <div className="detail-section">
                <h3>⚔️ War Log</h3>
                <p className="war-log-private">🔒 War log is private</p>
              </div>
            )}
          </>
        )}

        {/* Capital Raids */}
        {showCapitalRaids && capitalRaids.length > 0 && (
          <div className="detail-section">
            <h3>🏰 Capital Raids (Last {Math.min(capitalRaids.length, 10)} weekends)</h3>
            <div className="capital-raids">
              {capitalRaids.slice(0, 10).map((raid, index) => (
                <div key={index} className="capital-raid-item">
                  <div className="raid-header">
                    <div className="raid-date">
                      📅 {raid.endTime ? new Date(raid.endTime).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="raid-state">
                      {raid.state || 'Completed'}
                    </div>
                  </div>
                  <div className="raid-stats">
                    <div className="raid-stat">
                      <span className="stat-label">🎯 Total Loot</span>
                      <span className="stat-value">{raid.capitalTotalLoot?.toLocaleString() || 0}</span>
                    </div>
                    <div className="raid-stat">
                      <span className="stat-label">⚔️ Raids Completed</span>
                      <span className="stat-value">{raid.raidsCompleted || 0}</span>
                    </div>
                    <div className="raid-stat">
                      <span className="stat-label">⚡ Total Attacks</span>
                      <span className="stat-value">{raid.totalAttacks || 0}</span>
                    </div>
                    <div className="raid-stat">
                      <span className="stat-label">🏆 Offensive Reward</span>
                      <span className="stat-value">{raid.offensiveReward?.toLocaleString() || 0}</span>
                    </div>
                    <div className="raid-stat">
                      <span className="stat-label">🛡️ Defensive Reward</span>
                      <span className="stat-value">{raid.defensiveReward?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                  {raid.attackLog && raid.attackLog.length > 0 && (
                    <div className="raid-attacks">
                      <h5>Attack Log:</h5>
                      <div className="attack-log">
                        {raid.attackLog.slice(0, 5).map((attack, attackIndex) => (
                          <div key={attackIndex} className="attack-item">
                            <span>🏰 {attack.defender?.name || 'Unknown'}</span>
                            <span>⭐ {attack.stars || 0} stars</span>
                            <span>💥 {attack.destructionPercent || 0}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ClanDetails
