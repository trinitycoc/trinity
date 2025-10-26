import React from 'react'

function CurrentWar({ currentWar }) {
  if (!currentWar || currentWar.state === 'notInWar') {
    return null
  }

  const getWarState = () => {
    switch (currentWar.state) {
      case 'inWar':
        return 'Battle Day'
      case 'preparation':
        return 'Preparation'
      default:
        return currentWar.state
    }
  }

  return (
    <div className="detail-section">
      <h3>🗡️ Current War - {getWarState()}</h3>
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
  )
}

export default CurrentWar

