import React from 'react'
import ClanTagLink from '../../ClanTagLink'

function WarLog({ warLog, isWarLogPublic }) {
  const validWars = warLog.filter(war => war.clan?.expEarned !== 0)

  return (
    <>
      {validWars.length > 0 && (
        <div className="detail-section">
          <h3>⚔️ War Log (Last {Math.min(validWars.length, 20)} wars)</h3>
          <div className="war-log">
            {validWars.slice(0, 20).map((war, index) => (
              <div key={index} className={`war-log-item war-result-${war.result?.toLowerCase() || 'unknown'}`}>
                <div className="war-info">
                  <div className="war-clans-matchup">
                    <span className="war-clan-name">{war.clan?.name || 'Unknown'}</span>
                    <span className="war-vs-text">vs</span>
                    <span className="war-clan-name">{war.opponent?.name || 'Unknown'}</span>
                  </div>
                  {(war.clan?.tag || war.opponent?.tag) && (
                    <div className="war-clan-tags-row">
                      <ClanTagLink tag={war.clan?.tag} /> <span className="war-vs-text">vs</span> <ClanTagLink tag={war.opponent?.tag} />
                    </div>
                  )}
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

      {!isWarLogPublic && validWars.length === 0 && (
        <div className="detail-section">
          <h3>⚔️ War Log</h3>
          <p className="war-log-private">🔒 War log is private</p>
        </div>
      )}
    </>
  )
}

export default WarLog

