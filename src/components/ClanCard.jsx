import React from 'react'
import { useNavigate } from 'react-router-dom'

function ClanCard({ clan, isLoading, error }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (clan && clan.tag) {
      // Navigate to clan details page with the clan tag (remove # for URL)
      navigate(`/clans/${clan.tag.replace('#', '')}`)
    }
  }
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
    <div className="clan-card clan-card-detailed" onClick={handleClick}>
      <img 
        src={clan.badgeUrls?.medium || clan.badgeUrls?.small || clan.badgeUrls?.large} 
        alt={`${clan.name} badge`} 
        className="clan-badge"
      />
      
      <h4 className="clan-name">{clan.name}</h4>
      <p className="clan-tag">{clan.tag}</p>
      
      <div className="clan-info-row">
        {clan.warLeague && (
          <div className="clan-league-mini">
            <img 
              src={`${import.meta.env.BASE_URL}cwl.webp`}
              alt="CWL badge" 
              className="league-icon-img"
            />
            <span className="league-name">{clan.warLeague}</span>
          </div>
        )}
        
        <div className="clan-capital">
          <img 
            src={`${import.meta.env.BASE_URL}Capital.webp`}
            alt="Capital badge" 
            className="capital-icon-img"
          />
          <span className="capital-level">Capital Level {clan.clanCapitalLevel ?? 0}</span>
        </div>
      </div>
    </div>
  )
}

export default ClanCard

