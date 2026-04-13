import React, { useState } from 'react'
import ClanTagLink from '../../ClanTagLink'

function normalizeWarTag(tag) {
  return (tag || '').replace(/^#/, '').toUpperCase()
}

function findMemberByTag(members, tag) {
  if (!members?.length || !tag) return undefined
  const needle = normalizeWarTag(tag)
  return members.find((m) => normalizeWarTag(m.tag) === needle)
}

function CurrentWar({ currentWar }) {
  const [selectedTab, setSelectedTab] = useState('overview') // overview, warEvents, ourMembers, opponentMembers
  
  if (!currentWar || currentWar.state === 'notInWar') {
    return (
      <div className="detail-section">
        <h3>🗡️ Current War</h3>
        <div className="war-not-active">
          <p className="not-in-war-message">
            ⏸️ This clan is not currently in war
          </p>
          <p className="not-in-war-hint">
            Check back later or view the War Log for past wars
          </p>
        </div>
      </div>
    )
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

  // Render attack details (defenderMembers = opposing side's war map)
  const renderAttack = (attack, index, defenderMembers) => {
    const defender = findMemberByTag(defenderMembers, attack.defenderTag)
    const targetSuffix =
      defender?.mapPosition != null ? ` on #${defender.mapPosition}` : ''

    return (
      <div key={index} className="attack-item">
        <div className="attack-stats-row">
          <div className="attack-stars">
            {'⭐'.repeat(attack.stars || 0)}
            {attack.stars === 0 && '☆'}
          </div>
          <div className="attack-destruction">
            {(attack.destruction || 0).toFixed(1)}%
          </div>
        </div>
        <div className="attack-order">
          Attack #{attack.order}
          {targetSuffix}
        </div>
      </div>
    )
  }

  // Render member row (defenderMembers = bases this clan is attacking)
  const renderMemberRow = (member, index, defenderMembers) => {
    const attacks = member.attacks || []
    const hasAttacked = attacks.length > 0
    const totalStars = attacks.reduce((sum, atk) => sum + (atk.stars || 0), 0)
    const avgDestruction = attacks.length > 0 
      ? attacks.reduce((sum, atk) => sum + (atk.destruction || 0), 0) / attacks.length 
      : 0

    return (
      <div key={member.tag || index} className="war-member-row">
        <div className="member-info">
          <span className="member-position">#{member.mapPosition}</span>
          <div className="member-details">
            <span className="member-name">{member.name}</span>
            <span className="member-th">TH{member.townHallLevel}</span>
          </div>
        </div>
        
        <div className="member-attacks">
          <div className="attacks-label">Attacks ({attacks.length}/2):</div>
          {attacks.length > 0 ? (
            <div className="attacks-list">
              <div className="attacks-grid">
                {attacks.map((attack, idx) => renderAttack(attack, idx, defenderMembers))}
              </div>
              <div className="attacks-summary">
                <span>Total: {totalStars}⭐</span>
                <span>Avg: {avgDestruction.toFixed(1)}%</span>
              </div>
            </div>
          ) : (
            <div className="no-attacks">No attacks yet</div>
          )}
        </div>

        <div className="member-defenses">
          <div className="defenses-label">Defenses ({member.defenseCount || 0}):</div>
          {member.defenseCount > 0 ? (
            <div className="defense-count">
              Attacked {member.defenseCount} time{member.defenseCount !== 1 ? 's' : ''}
            </div>
          ) : (
            <div className="no-defenses">Not attacked</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="detail-section">
      <h3>🗡️ Current War - {getWarState()}</h3>
      
      {/* Tab Navigation */}
      <div className="war-tabs">
        <button 
          className={`war-tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`war-tab ${selectedTab === 'warEvents' ? 'active' : ''}`}
          onClick={() => setSelectedTab('warEvents')}
        >
          📜 War Events
        </button>
        <button 
          className={`war-tab ${selectedTab === 'ourMembers' ? 'active' : ''}`}
          onClick={() => setSelectedTab('ourMembers')}
        >
          🛡️ Our Members ({currentWar.clan?.members?.length || 0})
        </button>
        <button 
          className={`war-tab ${selectedTab === 'opponentMembers' ? 'active' : ''}`}
          onClick={() => setSelectedTab('opponentMembers')}
        >
          ⚔️ Opponents ({currentWar.opponent?.members?.length || 0})
        </button>
      </div>

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
                <p>{currentWar.clan.tag ? <ClanTagLink tag={currentWar.clan.tag} /> : 'N/A'}</p>
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
                <p>{currentWar.opponent.tag ? <ClanTagLink tag={currentWar.opponent.tag} /> : 'N/A'}</p>
              </div>
            </div>
          </div>
          {/* War Events Tab */}
          {selectedTab === 'warEvents' && (
            <div className="war-events-timeline">
              <h4 className="timeline-header">
                📜 Attack Timeline ({(() => {
                  const allAttacks = [];
                  currentWar.clan?.members?.forEach(member => {
                    member.attacks?.forEach(attack => allAttacks.push({ ...attack, isOurClan: true, attacker: member }));
                  });
                  currentWar.opponent?.members?.forEach(member => {
                    member.attacks?.forEach(attack => allAttacks.push({ ...attack, isOurClan: false, attacker: member }));
                  });
                  return allAttacks.length;
                })()})
              </h4>
              {(() => {
                // Collect all attacks from both clans
                const allAttacks = [];
                
                // Add our clan's attacks
                currentWar.clan?.members?.forEach(member => {
                  member.attacks?.forEach(attack => {
                    // Find defender
                    const defender = findMemberByTag(currentWar.opponent?.members, attack.defenderTag);
                    allAttacks.push({
                      ...attack,
                      attacker: member,
                      defender: defender,
                      attackerClan: currentWar.clan,
                      defenderClan: currentWar.opponent,
                      isOurAttack: true
                    });
                  });
                });
                
                // Add opponent's attacks
                currentWar.opponent?.members?.forEach(member => {
                  member.attacks?.forEach(attack => {
                    // Find defender
                    const defender = findMemberByTag(currentWar.clan?.members, attack.defenderTag);
                    allAttacks.push({
                      ...attack,
                      attacker: member,
                      defender: defender,
                      attackerClan: currentWar.opponent,
                      defenderClan: currentWar.clan,
                      isOurAttack: false
                    });
                  });
                });
                
                // Sort by attack order (descending - newest first)
                allAttacks.sort((a, b) => (b.order || 0) - (a.order || 0));
                
                return allAttacks.length > 0 ? (
                  <div className="events-list">
                    {allAttacks.map((attack, index) => {
                      // For defenses, swap attacker and defender positions
                      const leftPlayer = attack.isOurAttack ? attack.attacker : attack.defender;
                      const rightPlayer = attack.isOurAttack ? attack.defender : attack.attacker;
                      
                      return (
                        <div key={index} className={`event-item ${attack.isOurAttack ? 'our-attack' : 'our-defense'}`}>
                          <div className="event-order">#{attack.order}</div>
                          
                          <div className="event-attacker">
                            <div className="player-position">#{leftPlayer?.mapPosition || '?'}</div>
                            <div className="player-info">
                              <div className="player-name">{leftPlayer?.name || 'Unknown'}</div>
                              <div className="player-th">TH{leftPlayer?.townHallLevel || '?'}</div>
                            </div>
                          </div>
                          
                          <div className="event-arrow">{attack.isOurAttack ? '→' : '←'}</div>
                          
                          <div className="event-result">
                            <div className="result-stars">
                              {'⭐'.repeat(attack.stars || 0)}
                              {'☆'.repeat(3 - (attack.stars || 0))}
                            </div>
                            <div className="result-destruction">{(attack.destruction || 0).toFixed(0)}%</div>
                          </div>
                          
                          <div className="event-arrow">{attack.isOurAttack ? '→' : '←'}</div>
                          
                          <div className="event-defender">
                            <div className="player-position">#{rightPlayer?.mapPosition || '?'}</div>
                            <div className="player-info">
                              <div className="player-name">{rightPlayer?.name || 'Unknown'}</div>
                              <div className="player-th">TH{rightPlayer?.townHallLevel || '?'}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-events">No attacks have been made yet</div>
                );
              })()}
            </div>
          )}

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
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
          )}

          {/* Our Members Tab */}
          {selectedTab === 'ourMembers' && (
            <div className="war-members-list">
              <h4 className="members-header">
                🛡️ {currentWar.clan.name} - War Members
              </h4>
              {currentWar.clan.members && currentWar.clan.members.length > 0 ? (
                <div className="members-container">
                  {currentWar.clan.members
                    .sort((a, b) => (a.mapPosition || 0) - (b.mapPosition || 0))
                    .map((member, index) =>
                      renderMemberRow(member, index, currentWar.opponent?.members)
                    )}
                </div>
              ) : (
                <div className="no-members">No member data available</div>
              )}
            </div>
          )}

          {/* Opponent Members Tab */}
          {selectedTab === 'opponentMembers' && (
            <div className="war-members-list">
              <h4 className="members-header">
                ⚔️ {currentWar.opponent.name} - War Members
              </h4>
              {currentWar.opponent.members && currentWar.opponent.members.length > 0 ? (
                <div className="members-container">
                  {currentWar.opponent.members
                    .sort((a, b) => (a.mapPosition || 0) - (b.mapPosition || 0))
                    .map((member, index) =>
                      renderMemberRow(member, index, currentWar.clan?.members)
                    )}
                </div>
              ) : (
                <div className="no-members">No member data available</div>
              )}
            </div>
          )}
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

