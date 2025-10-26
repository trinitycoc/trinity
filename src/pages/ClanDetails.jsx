import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { fetchClan, fetchClanWarLog } from '../services/api'

function ClanDetails() {
  const { clanTag } = useParams()
  const navigate = useNavigate()
  const [clan, setClan] = useState(null)
  const [warLog, setWarLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showWarLog, setShowWarLog] = useState(false)

  useEffect(() => {
    const loadClanDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch clan data and war log
        const [clanData, warLogData] = await Promise.all([
          fetchClan(clanTag),
          fetchClanWarLog(clanTag).catch(() => [])
        ])
        
        setClan(clanData)
        setWarLog(Array.isArray(warLogData) ? warLogData : [])
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
    switch(role) {
      case 'leader': return '👑'
      case 'coLeader': return '⭐'
      case 'admin': return '🛡️'
      case 'member': return '👤'
      default: return '👤'
    }
  }

  const getRoleName = (role) => {
    switch(role) {
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
            {(warLog.length > 0 || clan.isWarLogPublic) && (
              <button 
                className="war-log-toggle"
                onClick={() => setShowWarLog(!showWarLog)}
              >
                {showWarLog ? '📊 Hide War Log' : '📊 Show War Log'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="clan-details-content">
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

        {/* War Log */}
        {showWarLog && (
          <>
            {warLog.length > 0 && (
              <div className="detail-section">
                <h3>⚔️ War Log (Last {Math.min(warLog.length, 20)} wars)</h3>
                <div className="war-log">
                  {warLog.slice(0, 20).map((war, index) => (
                    <div key={index} className={`war-log-item war-result-${war.result?.toLowerCase() || 'unknown'}`}>
                      <div className="war-result-badge">
                        {war.result === 'win' ? '✅' : war.result === 'lose' ? '❌' : '➖'}
                      </div>
                      <div className="war-info">
                        <div className="war-opponent">
                          vs {war.opponent?.name || 'Unknown'}
                        </div>
                        <div className="war-details">
                          <span>⭐ {war.teamStars || 0} - {war.opponent?.stars || 0}</span>
                          <span>💥 {war.destructionPercentage?.toFixed(1) || 0}%</span>
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
      </div>
    </section>
  )
}

export default ClanDetails
