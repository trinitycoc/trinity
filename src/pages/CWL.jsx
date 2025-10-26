import React from 'react'
import SectionTitle from '../components/SectionTitle'

function CWL() {
  return (
    <section className="cwl-page">
      <SectionTitle>Clan War League (CWL)</SectionTitle>
      <div className="page-content">
        <p className="page-description">
          Information about our Clan War League participation, strategies, and achievements.
        </p>
        <div className="cwl-info">
          <div className="info-card">
            <h4>🏆 CWL Strategy</h4>
            <p>Learn about our winning strategies and how we coordinate across Trinity family clans.</p>
          </div>
          <div className="info-card">
            <h4>📊 League Tiers</h4>
            <p>Check which league each of our clans is competing in and their current standings.</p>
          </div>
          <div className="info-card">
            <h4>⭐ Best Performances</h4>
            <p>Celebrate our top performers and most memorable CWL moments.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CWL

