import React, { useMemo } from 'react'
import ClanTagLink from '../../ClanTagLink'
import { useCountdown } from '../../../hooks/useCountdown'
import { warInvolvesClan, cwlOtherWarHighlightClasses } from '../../../utils/cwlUtils'
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
    const { warsForSearchedClan, otherGroupWars } = useMemo(() => {
        if (!clanTag) {
            return { warsForSearchedClan: roundWars, otherGroupWars: [] }
        }
        const ours = []
        const other = []
        for (const w of roundWars) {
            if (warInvolvesClan(w, clanTag)) ours.push(w)
            else other.push(w)
        }
        return { warsForSearchedClan: ours, otherGroupWars: other }
    }, [roundWars, clanTag])

    // Find active war for countdown display (priority: inWar > preparation) — searched clan's matchup only
    const activeWar = warsForSearchedClan.find(war =>
        war.state === 'inWar'
    ) || warsForSearchedClan.find(war =>
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
    const ourTeamSize = teamSize ?? stats.teamSize ?? stats.ourTeamSize ?? 'N/A'
    const opponentTeamSize = stats.opponentTeamSize ?? teamSize ?? stats.teamSize ?? 'N/A'

    const formatPercentage = value => {
        if (typeof value === 'number') {
            return `${value.toFixed(2)}%`
        }
        if (value === null || value === undefined || value === '') {
            return 'N/A'
        }
        return value
    }

    const formatPercentagePlain = value => {
        if (typeof value === 'number') {
            return value.toFixed(2)
        }
        if (value === null || value === undefined || value === '') {
            return 'N/A'
        }
        return String(value)
    }

    const formatAttacks = value => {
        if (value === null || value === undefined) {
            return 'N/A'
        }
        return value
    }

    const getOtherWarBadgeUrl = (clan) => {
        const b = clan?.badgeUrls
        if (!b || typeof b !== 'object') return null
        return b.medium || b.small || b.large || b.url || null
    }

    const statComparisons = [
        {
            key: 'stars',
            label: 'Stars',
            ourValue: stats.ourStars ?? 'N/A',
            opponentValue: stats.opponentStars ?? 'N/A'
        },
        {
            key: 'destruction',
            label: 'Destruction',
            ourValue: formatPercentage(stats.ourDestruction),
            opponentValue: formatPercentage(stats.opponentDestruction)
        },
        {
            key: 'attacks',
            label: 'Attacks Used',
            ourValue: `${formatAttacks(ourAttacks)}`,
            opponentValue: `${formatAttacks(opponentAttacks)}`
        },
        {
            key: 'team-size',
            label: 'Team Size',
            ourValue: ourTeamSize,
            opponentValue: opponentTeamSize
        }
    ]

    // Calculate dynamic gradient for in-progress cards based on star comparison
    const getInProgressGradient = () => {
        const isInProgress = stats.status?.toLowerCase() === 'in progress' || stats.status?.toLowerCase().includes('progress')
        if (!isInProgress) return null

        const ourStars = stats.ourStars || 0
        const opponentStars = stats.opponentStars || 0
        const totalStars = ourStars + opponentStars

        // Calculate green percentage based on our stars
        // Clamp between 20% and 80% for visual effect (never fully green or red)
        let greenPercentage = 50 // Default 50/50 split
        if (totalStars > 0) {
            greenPercentage = (ourStars / totalStars) * 100
            greenPercentage = Math.max(20, Math.min(80, greenPercentage))
        }

        // Calculate border color based on star comparison
        // More green if we're winning, more red if we're losing
        let borderColor = 'rgba(102, 126, 234, 0.3)' // Default neutral
        if (totalStars > 0) {
            if (ourStars > opponentStars) {
                borderColor = 'rgba(74, 222, 128, 0.6)' // Green when winning
            } else if (ourStars < opponentStars) {
                borderColor = 'rgba(239, 68, 68, 0.6)' // Red when losing
            }
        }

        return {
            '--gradient-stop': `${greenPercentage}%`,
            'borderLeftColor': borderColor
        }
    }

    const inProgressStyle = getInProgressGradient()

    return (
        <div
            className={`current-war cwl-round-card ${isExpanded ? 'expanded' : ''} ${getRoundCardClass(stats.result, stats.status)}`}
            style={inProgressStyle || {}}
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

            <div className="cwl-round-body">
            {/* War Summary - Comparison Layout */}
            <div className="war-summary-grid">
                <div className="war-summary-col clan-overview our-clan">
                    {stats.ourClanBadge && (
                        <img
                            src={stats.ourClanBadge.medium || stats.ourClanBadge.small || stats.ourClanBadge.large || stats.ourClanBadge.url}
                            alt={stats.ourClanName}
                            className="war-clan-badge"
                        />
                    )}
                    <div className="clan-overview-text">
                        <h4>{stats.ourClanName}</h4>
                        <p>{stats.ourClanTag ? <ClanTagLink tag={stats.ourClanTag} /> : 'N/A'}</p>
                    </div>
                </div>
                <div className="war-summary-col stats-comparison">
                    {statComparisons.map(item => (
                        <div className="stats-row" key={`comparison-${item.key}`}>
                            <span className="stat-value our-value">{item.ourValue}</span>
                            <span className="stat-label">{item.label}</span>
                            <span className="stat-value opponent-value">{item.opponentValue}</span>
                        </div>
                    ))}
                </div>
                <div className="war-summary-col clan-overview opponent-clan">
                    {stats.opponentClanBadge && (
                        <img
                            src={stats.opponentClanBadge.medium || stats.opponentClanBadge.small || stats.opponentClanBadge.large || stats.opponentClanBadge.url}
                            alt={stats.opponentClanName}
                            className="war-clan-badge"
                        />
                    )}
                    <div className="clan-overview-text">
                        <h4>{stats.opponentClanName}</h4>
                        <p>{stats.opponentClanTag ? <ClanTagLink tag={stats.opponentClanTag} /> : 'N/A'}</p>
                    </div>
                </div>
            </div>

            {otherGroupWars.length > 0 ? (
                <div className="cwl-other-matchups">
                    <div className="cwl-other-matchups-title">Other wars this round</div>
                    <div className="cwl-other-matchups-grid">
                        {otherGroupWars.map((war, idx) => {
                            const leftBadgeUrl = getOtherWarBadgeUrl(war.clan)
                            const rightBadgeUrl = getOtherWarBadgeUrl(war.opponent)
                            const { left: leftHighlight, right: rightHighlight } = cwlOtherWarHighlightClasses(war.result)
                            return (
                            <div
                                key={war.warTag || `other-${idx}`}
                                className="cwl-other-matchup-card"
                            >
                                <div className="cwl-other-matchup-title">
                                    <span className={`cwl-other-matchup-clan-name ${leftHighlight}`}>
                                        {war.clan?.name || '—'}
                                    </span>{' '}
                                    <span className="cwl-other-matchup-vs-word">vs</span>{' '}
                                    <span className={`cwl-other-matchup-clan-name ${rightHighlight}`}>
                                        {war.opponent?.name || '—'}
                                    </span>
                                </div>
                                <div className="cwl-other-matchup-tags-row">
                                    <span className={`cwl-other-matchup-tag ${leftHighlight}`}>
                                        {war.clan?.tag ? <ClanTagLink tag={war.clan.tag} /> : '—'}
                                    </span>
                                    <span className="cwl-other-matchup-tags-sep" aria-hidden>·</span>
                                    <span className={`cwl-other-matchup-tag ${rightHighlight}`}>
                                        {war.opponent?.tag ? <ClanTagLink tag={war.opponent.tag} /> : '—'}
                                    </span>
                                </div>
                                <div className="cwl-other-matchup-stats-with-badges">
                                    <div className={`cwl-other-matchup-badge-col cwl-other-matchup-badge-col--left ${leftHighlight}`}>
                                        {leftBadgeUrl ? (
                                            <img
                                                src={leftBadgeUrl}
                                                alt=""
                                                className="cwl-other-matchup-badge-img"
                                            />
                                        ) : (
                                            <div className="cwl-other-matchup-badge-placeholder" aria-hidden />
                                        )}
                                    </div>
                                    <div className="cwl-other-matchup-stats">
                                        <div className="cwl-other-matchup-stat-line" aria-label="Attacks">
                                            <span className={`cwl-other-matchup-stat-left ${leftHighlight}`}>{formatAttacks(war.clan?.attacks)}</span>
                                            <span className="cwl-other-matchup-stat-sep" aria-hidden>⚔️</span>
                                            <span className={`cwl-other-matchup-stat-right ${rightHighlight}`}>{formatAttacks(war.opponent?.attacks)}</span>
                                        </div>
                                        <div className="cwl-other-matchup-stat-line" aria-label="Stars">
                                            <span className={`cwl-other-matchup-stat-left ${leftHighlight}`}>{war.clan?.stars ?? '—'}</span>
                                            <span className="cwl-other-matchup-stat-sep" aria-hidden>⭐</span>
                                            <span className={`cwl-other-matchup-stat-right ${rightHighlight}`}>{war.opponent?.stars ?? '—'}</span>
                                        </div>
                                        <div className="cwl-other-matchup-stat-line" aria-label="Destruction percentage">
                                            <span className={`cwl-other-matchup-stat-left ${leftHighlight}`}>
                                                {formatPercentagePlain(war.clan?.destructionPercentage)}
                                            </span>
                                            <span className="cwl-other-matchup-stat-sep cwl-other-matchup-stat-sep--pct" aria-hidden>
                                                %
                                            </span>
                                            <span className={`cwl-other-matchup-stat-right ${rightHighlight}`}>
                                                {formatPercentagePlain(war.opponent?.destructionPercentage)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`cwl-other-matchup-badge-col cwl-other-matchup-badge-col--right ${rightHighlight}`}>
                                        {rightBadgeUrl ? (
                                            <img
                                                src={rightBadgeUrl}
                                                alt=""
                                                className="cwl-other-matchup-badge-img"
                                            />
                                        ) : (
                                            <div className="cwl-other-matchup-badge-placeholder" aria-hidden />
                                        )}
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>
            ) : null}

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

