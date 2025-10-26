import React from 'react'
import SectionTitle from '../components/SectionTitle'

function FarmingBaseLayouts() {
  return (
    <section className="farming-page">
      <SectionTitle>Farming Base Layouts</SectionTitle>
      <div className="page-content">
        <p className="page-description">
          Discover proven farming base layouts designed to protect your resources while you're offline.
        </p>
        <div className="layouts-grid">
          <div className="layout-card">
            <div className="layout-placeholder">🏰 Town Hall 15</div>
            <h4>TH15 Farm Base</h4>
            <p>Optimized for resource protection</p>
          </div>
          <div className="layout-card">
            <div className="layout-placeholder">🏰 Town Hall 14</div>
            <h4>TH14 Farm Base</h4>
            <p>Balanced defense layout</p>
          </div>
          <div className="layout-card">
            <div className="layout-placeholder">🏰 Town Hall 13</div>
            <h4>TH13 Farm Base</h4>
            <p>Maximum storage protection</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FarmingBaseLayouts

