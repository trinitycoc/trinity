import React from 'react'

function ClanCard({ clan, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="clan-card clan-card-loading">
        <div className="clan-loading">
          <div className="spinner"></div>
          <p>Loading clan data...</p>
        </div>
      </div>
    )
  }

  if (error || !clan) {
    return (
      <div className="clan-card clan-card-error">
        <div className="clan-icon">❌</div>
        <h4>{clan?.tag || 'Unknown'}</h4>
        <p className="error-message">Failed to load clan data</p>
        <p className="error-hint">Check clan tag or API connection</p>
      </div>
    )
  }

  return (
    <div className="clan-card clan-card-detailed">
      <img 
        src={clan.badgeUrls?.medium || clan.badgeUrls?.small || clan.badgeUrls?.large} 
        alt={`${clan.name} badge`} 
        className="clan-badge"
      />
      
      <h4 className="clan-name">{clan.name}</h4>
      <p className="clan-tag">{clan.tag}</p>
      
      <div className="clan-stats">
        <div className="stat">
          <span className="stat-label">Level</span>
          <span className="stat-value">{clan.clanLevel ?? 'N/A'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Members</span>
          <span className="stat-value">{clan.members ?? 0}/50</span>
        </div>
      </div>

      {clan.leader && (
        <div className="clan-leader">
          <span className="leader-icon">👑</span>
          <span className="leader-name">{clan.leader.name}</span>
        </div>
      )}

      {clan.warLeague && (
        <div className="clan-league">
          <span className="league-badge">🏆</span>
          <span>{clan.warLeague}</span>
        </div>
      )}

      {clan.location && (
        <div className="clan-location">
          <span>📍 {clan.location}</span>
        </div>
      )}

      <div className="clan-type">
        <span className={`type-badge type-${clan.type}`}>
          {clan.type === 'open' ? '🔓 Open' : clan.type === 'inviteOnly' ? '🔒 Invite Only' : '⛔ Closed'}
        </span>
      </div>

      {clan.description && (
        <p className="clan-description">{clan.description}</p>
      )}
    </div>
  )
}

export default ClanCard

