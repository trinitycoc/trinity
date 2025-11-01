import React from 'react'
import { useNavigate } from 'react-router-dom'
import cwlImage from '/cwl.webp'

function CWLClanCard({ clan, isLoading, error, sheetData = null, isVisibleToUsers = true, isAdminMode = false }) {
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

  // Calculate available space for the banner
  const calculateAvailableSpace = () => {
    if (!sheetData?.members || !thCount) return null
    
    const required = parseInt(sheetData.members) || 0
    const eligible = parseInt(thCount) || 0
    const available = Math.max(0, required - eligible)
    const isFull = eligible >= required
    
    return { required, eligible, available, isFull }
  }

  const spaceInfo = calculateAvailableSpace()

  // Check if current date/time is within CWL period (1st 1:30 PM IST to 3rd 1:30 PM IST)
  const isCWLPeriod = () => {
    const now = new Date()
    
    // Convert current UTC time to IST (UTC+5:30)
    // Get UTC time in milliseconds
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
    // Add IST offset (5 hours 30 minutes = 5.5 hours)
    const istTime = utcTime + (5.5 * 60 * 60 * 1000)
    
    // Create a new date object for IST
    const istNow = new Date(istTime)
    
    const currentDate = istNow.getUTCDate()
    const currentHour = istNow.getUTCHours()
    const currentMinute = istNow.getUTCMinutes()
    
    // Check if current date/time is between start and end
    if (currentDate === 1) {
      // On 1st: check if time is >= 1:30 PM IST
      return currentHour > 13 || (currentHour === 13 && currentMinute >= 30)
    } else if (currentDate === 2) {
      // On 2nd: always within period
      return true
    } else if (currentDate === 3) {
      // On 3rd: check if time is <= 1:30 PM IST
      return currentHour < 13 || (currentHour === 13 && currentMinute <= 30)
    }
    
    return false
  }

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
    <div className={`clan-card clan-card-detailed cwl-clan-card clan-status-${clan.type || 'unknown'} ${isAdminMode && !isVisibleToUsers ? 'cwl-clan-hidden' : ''} ${isAdminMode && isVisibleToUsers ? 'cwl-clan-visible' : ''}`} onClick={handleClick}>
      {/* Space Available Banner with String and Nail */}
      {spaceInfo && (
        <div className="cwl-banner-container">
          {/* Nail at the top */}
          <div className="cwl-nail"></div>
          {/* String hanging from nail */}
          <div className="cwl-string"></div>
          {/* Banner attached to string */}
          <div className={`cwl-space-banner ${spaceInfo.isFull ? 'cwl-space-banner-full' : ''}`}>
            {/* Show CWL started message if clan is closed during CWL period (1st-3rd, 1:30 PM IST) */}
            {clan.type === 'closed' && isCWLPeriod() ? (
              <span className="cwl-banner-message">CWL already started in this clan</span>
            ) : spaceInfo.isFull ? (
              <span className="cwl-banner-message">Join Next Clans</span>
            ) : (
              <span className="cwl-banner-message">
                <span className="cwl-banner-space">Space: {spaceInfo.available}</span>
              </span>
            )}
          </div>
        </div>
      )}
      
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
          {/* Admin Mode Indicator - Under clan tag */}
          {isAdminMode && (
            <div className={`cwl-admin-indicator ${isVisibleToUsers ? 'cwl-visible-badge' : 'cwl-hidden-badge'}`}>
              {isVisibleToUsers ? 'Currently Visible' : 'Hidden from Users'}
            </div>
          )}
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

