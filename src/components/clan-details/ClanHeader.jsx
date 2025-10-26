import React from 'react'
import SectionTitle from '../SectionTitle'

function ClanHeader({ clan, currentWar, warLog, showCurrentWar, showWarLog, showCapitalRaids, setShowCurrentWar, setShowWarLog, setShowCapitalRaids }) {
  return (
    <div className="clan-header-info">
      <SectionTitle>{clan.name}</SectionTitle>
      <p className="clan-tag-large">{clan.tag}</p>
      
      {/* First Row: Location, Members, Wins, CWL League */}
      <div className="clan-info-grid clan-info-row-1">
        {clan.location?.name && (
          <div className="clan-info-item clan-info-inline">
            <span className="info-value">📍 {clan.location.name}</span>
          </div>
        )}
        <div className="clan-info-item clan-info-inline">
          <span className="info-value">👥 {clan.members}/50</span>
        </div>
        <div className="clan-info-item clan-info-inline">
          <span className="info-value">⚔️ {clan.warWins} Wins</span>
        </div>
        {clan.warLeague?.name && (
          <div className="clan-info-item clan-info-inline">
            <span className="info-value">
              <img src="/cwl.webp" alt="CWL" className="cwl-icon-inline" /> {clan.warLeague.name}
            </span>
          </div>
        )}
      </div>
      
      {/* Second Row: Type, War Log, Leader, TH Required */}
      <div className="clan-info-grid clan-info-row-2">
        <div className="clan-info-item clan-info-inline">
          <span className="info-value">
            {clan.type === 'open' && '🟢 Open'}
            {clan.type === 'inviteOnly' && '🔵 Invite Only'}
            {clan.type === 'closed' && '🔴 Closed'}
          </span>
        </div>
        <div className="clan-info-item clan-info-inline">
          <span className="info-value">
            {clan.isWarLogPublic ? '🔓 Public' : '🔒 Private'}
          </span>
        </div>
        {clan.memberList?.find(m => m.role === 'leader') && (
          <div className="clan-info-item clan-info-inline">
            <span className="info-value">
              👑 {clan.memberList.find(m => m.role === 'leader').name}
            </span>
          </div>
        )}
        {clan.requiredTownhallLevel > 0 && (
          <div className="clan-info-item clan-info-inline">
            <span className="info-value">🏠 TH {clan.requiredTownhallLevel}+</span>
          </div>
        )}
      </div>
      
      <div className="header-actions">
        {currentWar && currentWar.state !== 'notInWar' && (
          <button
            className="war-log-toggle"
            onClick={() => {
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
        <button
          className="war-log-toggle"
          onClick={() => {
            if (!showCapitalRaids) {
              setShowCurrentWar(false)
              setShowWarLog(false)
            }
            setShowCapitalRaids(!showCapitalRaids)
          }}
        >
          {showCapitalRaids ? '🏰 Hide Capital Raids' : '🏰 Show Capital Raids'}
        </button>
      </div>
    </div>
  )
}

export default ClanHeader

