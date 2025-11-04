import React from 'react'
import { useCountdown } from '../../../hooks/useCountdown'
import { CWLWarDetails } from './CWLWarDetails'

export const RoundCard = ({
    day,
    stats,
    roundWars,
    ourAttacks,
    opponentAttacks,
    maxAttacks,
    teamSize,
    isExpanded,
    onToggle,
    getResultText,
    getResultClass,
    getRoundCardClass,
    cwlGroupData,
    clanTag,
    selectedDay,
    fetchedWarsForDay,
    fetchedWarsByRound,
    loadingFetchedWars,
    isAdmin = false
}) => {
    // Find active war for countdown display (priority: inWar > preparation)
    const activeWar = roundWars.find(war =>
        war.state === 'inWar'
    ) || roundWars.find(war =>
        war.state === 'preparation'
    ) || null

    // Determine target time based on war state
    const isPreparation = activeWar?.state === 'preparation'
    const isInWar = activeWar?.state === 'inWar'
    const targetTime = isPreparation ? activeWar?.startTime : (isInWar ? activeWar?.endTime : null)
    const countdown = useCountdown(targetTime)

    // Format countdown message
    const getCountdownMessage = () => {
        if (!activeWar || !targetTime || !countdown || countdown === 'Ended') return null

        if (isPreparation) {
            return `Battle starts in ${countdown}`
        } else if (isInWar) {
            return `Battle ends in ${countdown}`
        }
        return null
    }

    const countdownMessage = getCountdownMessage()

    return (
        <div
            className={`current-war cwl-round-card ${isExpanded ? 'expanded' : ''} ${getRoundCardClass(stats.result, stats.status)}`}
        >
            {/* Round Header - 3 Column Layout */}
            <div className="cwl-round-card-header">
                {/* Column 1: Round Info */}
                <div className="cwl-round-header-col-1">
                    <div className="cwl-round-badge-header">
                        <div className="cwl-round-badge">R{day}</div>
                        <div className="cwl-round-header-text">
                            <div className="cwl-round-title">Round {day}</div>
                            <div className="cwl-round-status">{stats.status}</div>
                        </div>
                    </div>
                </div>
                
                {/* Column 2: Countdown Timer */}
                <div className="cwl-round-header-col-2">
                    {countdownMessage && (
                        <div className="cwl-round-countdown-inline">
                            <span className="cwl-round-countdown-message">{countdownMessage}</span>
                        </div>
                    )}
                </div>
                
                {/* Column 3: Result Button */}
                <div className="cwl-round-header-col-3">
                    <button
                        className={`cwl-result-button ${getResultClass(stats.result)}`}
                    >
                        <span className="cwl-result-text">{getResultText(stats.result)}</span>
                    </button>
                </div>
            </div>

            {/* War Header - Clan vs Opponent */}
            <div className="war-header">
                <div className="war-clan">
                    {stats.ourClanBadge && (
                        <img
                            src={stats.ourClanBadge.medium || stats.ourClanBadge.small || stats.ourClanBadge.large}
                            alt={stats.ourClanName}
                            className="war-clan-badge"
                        />
                    )}
                    <div>
                        <h4>{stats.ourClanName}</h4>
                        <p>{stats.ourClanTag || 'N/A'}</p>
                    </div>
                </div>
                <div className="war-vs">VS</div>
                <div className="war-clan">
                    {stats.opponentClanBadge && (
                        <img
                            src={stats.opponentClanBadge.medium || stats.opponentClanBadge.small || stats.opponentClanBadge.large}
                            alt={stats.opponentClanName}
                            className="war-clan-badge"
                        />
                    )}
                    <div>
                        <h4>{stats.opponentClanName}</h4>
                        <p>{stats.opponentClanTag || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* War Stats - 2x2 Grid */}
            <div className="war-stats">
                <div className="war-stat-group">
                    <div className="war-stat">
                        <span className="stat-label">⭐ Stars</span>
                        <span className="stat-value">{stats.ourStars} - {stats.opponentStars}</span>
                    </div>
                    <div className="war-stat">
                        <span className="stat-label">💥 Destruction</span>
                        <span className="stat-value">
                            {stats.ourDestruction.toFixed(2)}% - {stats.opponentDestruction.toFixed(2)}%
                        </span>
                    </div>
                    <div className="war-stat">
                        <span className="stat-label">⚔️ Attacks Used</span>
                        <span className="stat-value">
                            {ourAttacks} / {maxAttacks} - {opponentAttacks} / {maxAttacks}
                        </span>
                    </div>
                    <div className="war-stat">
                        <span className="stat-label">🏢 Team Size</span>
                        <span className="stat-value">{teamSize} vs {teamSize}</span>
                    </div>
                </div>
            </div>

            {/* Show/Hide Attacks Button */}
            <div className="cwl-attacks-toggle-container">
                <button
                    className="cwl-show-attacks-btn"
                    onClick={onToggle}
                >
                    {isExpanded ? 'Hide Attacks' : 'Show Attacks'}
                    <span className={`cwl-attacks-chevron ${isExpanded ? 'expanded' : ''}`}>▼</span>
                </button>
            </div>

            {/* War Details - Show under this specific round card when expanded */}
            {isExpanded && (
                <CWLWarDetails
                    selectedDay={day}
                    cwlGroupData={cwlGroupData}
                    clanTag={clanTag}
                    fetchedWarsForDay={
                        day === selectedDay
                            ? fetchedWarsForDay
                            : (fetchedWarsByRound[day] || [])
                    }
                    loadingFetchedWars={day === selectedDay ? loadingFetchedWars : false}
                    isAdmin={isAdmin}
                />
            )}
        </div>
    )
}

