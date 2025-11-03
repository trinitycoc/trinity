import React, { useState } from 'react'
import { getValidWarTags, filterWarsForDay } from '../../../utils/cwlUtils'
import { WarCountdown } from '../wars/WarCountdown'
import { WarMembersTable } from '../wars/WarMembersTable'

export const CWLWarDetails = ({
  selectedDay,
  cwlGroupData,
  fetchedWarsForDay,
  loadingFetchedWars
}) => {
  const [activeViews, setActiveViews] = useState({}) // Track view state per war index
  
  if (!selectedDay || !cwlGroupData?.group?.rounds) {
    return null
  }
  
  const getActiveView = (warIdx) => {
    return activeViews[warIdx] || 'ourClan' // Default to 'ourClan'
  }
  
  const setActiveView = (warIdx, view) => {
    setActiveViews(prev => ({
      ...prev,
      [warIdx]: view
    }))
  }

  const selectedRound = cwlGroupData.group.rounds.find(r => r.round === selectedDay)
  if (!selectedRound || !selectedRound.warTags) {
    return <div className="cwl-no-wars">No wars found for Day {selectedDay}</div>
  }

  const validWarTags = getValidWarTags(selectedRound.warTags)
  if (validWarTags.length === 0) {
    return <div className="cwl-no-wars">No wars found for Day {selectedDay}</div>
  }

  // Find wars from allWars that match these war tags
  let warsForDay = filterWarsForDay(
    cwlGroupData.allWars || [],
    selectedRound.warTags
  )

  // If no wars found in allWars, try currentWars as fallback
  if (warsForDay.length === 0 && cwlGroupData.currentWars) {
    warsForDay = filterWarsForDay(
      cwlGroupData.currentWars,
      selectedRound.warTags
    )
  }

  // If still no wars found, use automatically fetched wars
  if (warsForDay.length === 0) {
    if (loadingFetchedWars) {
      return (
        <div className="cwl-details-loading">
          <div className="spinner"></div>
          <p>Loading war details...</p>
        </div>
      )
    }
    if (fetchedWarsForDay.length > 0) {
      warsForDay = fetchedWarsForDay
    } else {
      return <div className="cwl-no-wars">No wars found for Day {selectedDay}</div>
    }
  }

  if (warsForDay.length === 0) {
    return <div className="cwl-no-wars">No wars found for Day {selectedDay}</div>
  }

  return (
    <div className="cwl-day-wars">
      {warsForDay.map((war, idx) => (
        <div key={idx} className="cwl-war-section">
          <div className="cwl-war-header">
            {war.clan && war.opponent ? (
              <div className="cwl-war-title-section">
                <h4>{war.clan.name} vs {war.opponent.name}</h4>
                <WarCountdown war={war} />
              </div>
            ) : (
              <div className="cwl-war-title-section">
                <h4>War {idx + 1}</h4>
                <WarCountdown war={war} />
              </div>
            )}
          </div>

          {/* Toggle Buttons */}
          <div className="cwl-members-view-toggle">
            <button
              className={`cwl-toggle-btn ${getActiveView(idx) === 'ourClan' ? 'active' : ''}`}
              onClick={() => setActiveView(idx, 'ourClan')}
            >
              Our Attacks
            </button>
            <button
              className={`cwl-toggle-btn ${getActiveView(idx) === 'opponent' ? 'active' : ''}`}
              onClick={() => setActiveView(idx, 'opponent')}
            >
              Opponent Attacks
            </button>
          </div>

          {/* Our Clan Members - Show when ourClan is selected */}
          {getActiveView(idx) === 'ourClan' && war.clan?.members?.length > 0 && (
            <WarMembersTable
              members={war.clan.members}
              title="Our Clan Members"
              opponentMembers={war.opponent?.members || []}
            />
          )}

          {/* Opponent Members - Show when opponent is selected */}
          {getActiveView(idx) === 'opponent' && war.opponent?.members?.length > 0 && (
            <WarMembersTable
              members={war.opponent.members}
              title="Opponent Members"
              opponentMembers={war.clan?.members || []}
            />
          )}
        </div>
      ))}
    </div>
  )
}

