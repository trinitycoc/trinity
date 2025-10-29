import React from 'react'
import { useNavigate } from 'react-router-dom'
import cwlImage from '/cwl.webp'

function CWLClanCard({ clan, isLoading, error, sheetData = null }) {
  const navigate = useNavigate()

  // Calculate matching TH count based on sheet requirements
  const calculateTHCount = () => {
    if (!sheetData?.townHall || !clan?.memberList) return null

    const thRequirement = sheetData.townHall.toLowerCase()
    
    // Parse TH levels from the requirement string
    const thNumbers = []
    const matches = thRequirement.match(/th\s*(\d+)/gi)
    
    if (matches) {
      matches.forEach(match => {
        const num = parseInt(match.replace(/th\s*/i, ''))
        if (!isNaN(num)) thNumbers.push(num)
      })
    }

    if (thNumbers.length === 0) return null

    // Determine if it's "and below" requirement
    const isAndBelow = thRequirement.includes('and below') || thRequirement.includes('below')
    
    // Get min and max TH from requirements
    const minTH = Math.min(...thNumbers)
    const maxTH = Math.max(...thNumbers)

    // Count members matching the criteria
    let count = 0
    if (isAndBelow) {
      // Count members with TH <= maxTH
      count = clan.memberList.filter(member => member.townHallLevel <= maxTH).length
      return `${count}`
    } else if (thNumbers.length === 1) {
      // Single TH requirement
      count = clan.memberList.filter(member => member.townHallLevel === thNumbers[0]).length
      return `${count}`
    } else {
      // Multiple TH requirements (e.g., Th17, Th16, Th15)
      count = clan.memberList.filter(member => 
        member.townHallLevel >= minTH && member.townHallLevel <= maxTH
      ).length
      return `${count}`
    }
  }

  const thCount = calculateTHCount()

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
          <p>Loading CWL clan data...</p>
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
    <div className={`clan-card clan-card-detailed cwl-clan-card clan-status-${clan.type || 'unknown'}`} onClick={handleClick}>
      {/* Header Row with Badge and Name */}
      <div className="clan-header-row">
        <img 
          src={clan.badgeUrls?.medium || clan.badgeUrls?.small || clan.badgeUrls?.large} 
          alt={`${clan.name} badge`} 
          className="clan-badge"
        />
        
        <div className="clan-name-section">
          <div className="clan-name-status-row">
            <h4 className="clan-name">{clan.name}</h4>
            {/* Clan Status - inline with name */}
            {clan.type && (
              <div className="clan-status-inline">
                {clan.type === 'open' && (
                  <>
                    <span className="status-icon">🟢</span>
                    <span className="status-label">Open</span>
                  </>
                )}
                {clan.type === 'inviteOnly' && (
                  <>
                    <span className="status-icon">🔵</span>
                    <span className="status-label">Invite Only</span>
                  </>
                )}
                {clan.type === 'closed' && (
                  <>
                    <span className="status-icon">🔴</span>
                    <span className="status-label">Closed</span>
                  </>
                )}
              </div>
            )}
          </div>
          <p className="clan-tag">{clan.tag}</p>
        </div>
      </div>
      
      {/* Show Google Sheets data for CWL clans */}
      {sheetData && (
        <div className="clan-sheet-info">
          {sheetData.format && (
            <div className="sheet-info-item">
              <span className="info-label">Format:</span>
              <span className="info-value">{sheetData.format}</span>
            </div>
          )}
          {sheetData.members && (
            <div className="sheet-info-item">
              <span className="info-label">Allowed Members:</span>
              <span className="info-value">{sheetData.members}</span>
            </div>
          )}
          {sheetData.townHall && (
            <div className="sheet-info-item">
              <span className="info-label">TH Allowed:</span>
              <span className="info-value">{sheetData.townHall}</span>
            </div>
          )}
          {thCount && (
            <div className="sheet-info-item">
              <span className="info-label">Eligible Members:</span>
              <span className="info-value">{thCount}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Members Count and CWL League Badge */}
      <div className="clan-info-row">
        {clan.members !== undefined && (
          <div className="clan-members-count">
            <span className="members-label">👥 {clan.members}/50</span>
          </div>
        )}
        {clan.warLeague && (
          <div className="clan-league-mini">
            <img 
              src={cwlImage}
              alt="CWL badge" 
              className="league-icon-img"
            />
            <span className="league-name">{clan.warLeague.name}</span>
          </div>
        )}
      </div>

      {/* Visit In-Game Button */}
      <a 
        href={`https://link.clashofclans.com/en/?action=OpenClanProfile&tag=${clan.tag.replace('#', '%23')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="visit-ingame-btn"
        onClick={(e) => e.stopPropagation()}
      >
        Visit In-Game
      </a>
    </div>
  )
}

export default CWLClanCard

