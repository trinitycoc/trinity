import React from 'react'
import SectionTitle from '../components/SectionTitle'
import th17Image from '/th-17.png'
import th16Image from '/th-16.png'
import th15Image from '/th-15.png'
import th14Image from '/th-14.png'
import th13Image from '/th-13.png'
import th12Image from '/th-12.png'

function FarmingBaseLayouts() {
  return (
    <section className="farming-page">
      <SectionTitle>Farming Base Layout Rules</SectionTitle>
      <div className="page-content">
        <p className="page-description">
          A typical farming base consists of 5 sections. Follow these rules to create an effective farming base.
        </p>

        <div className="rules-list">
          {/* TH Section */}
          <div className="rule-section">
            <h3 className="section-title">🏛️ TH Section</h3>
            <ul>
              <li><strong>TownHall</strong> (Must not overlap any other building)</li>
              <li>For <strong>TH 12 to TH 16</strong> there must be <strong>5 Tiles Gap</strong></li>
              <li>For <strong>TH 17</strong> must be <strong>6 tiles Gap</strong></li>
            </ul>
          </div>

          {/* Storage Section */}
          <div className="rule-section">
            <h3 className="section-title">💰 Storage Section</h3>
            <ul>
              <li>Eagle Artillery</li>
              <li>Air Defence</li>
              <li>Spell Towers (Must be set to <strong>Rage Mode</strong>)</li>
              <li>Air Sweeper</li>
              <li>Storages and Collectors</li>
              <li>All other Non-Defensive Buildings</li>
              <li>CC can be included (Either Storage or King Section)</li>
            </ul>
          </div>

          {/* King Section */}
          <div className="rule-section">
            <h3 className="section-title">👑 King Section</h3>
            <ul>
              <li>King Only</li>
              <li>Cannons</li>
              <li>Mortars</li>
              <li>Bomb Towers</li>
              <li>X-Bow (Must be on <strong>ground mode</strong>)</li>
              <li>CC can be included (Either Storage or King Section)</li>
              <li>Fire Spitter (Must be <strong>facing away from edge</strong>)</li>
            </ul>
          </div>

          {/* Queen Section */}
          <div className="rule-section">
            <h3 className="section-title">👸 Queen Section</h3>
            <ul>
              <li>Remaining 3 Heroes (Out of 4)</li>
              <li>Archer Towers</li>
              <li>Wizard Tower</li>
              <li>Hidden Tesla</li>
              <li>Inferno Tower (Must be on <strong>Single Target Mode</strong>)</li>
              <li>Scatter Shots</li>
              <li>Monolith</li>
              <li>Fire Spitter (Must be <strong>facing edge</strong>)</li>
              <li>Multi-Gear Tower (<strong>Long range mode</strong>)</li>
              <li>Crafting Station must be on <strong>Crusher Mode</strong> or <strong>No Defence</strong></li>
            </ul>
          </div>

          {/* Traps & Walls */}
          <div className="rule-section">
            <h3 className="section-title">🧱 Traps & Walls</h3>
            <ul>
              <li>All the walls must be placed <strong>together</strong> keeping space for traps in between.</li>
              <li>Traps must be <strong>enclosed in the walls</strong>.</li>
              <li>Skeleton traps can be on either <strong>Ground or Air</strong>.</li>
            </ul>
          </div>
        </div>

        {/* Base Layout Links */}
        <div className="base-links-section">
          <h3 className="links-title">📋 Copy Farm War Layouts</h3>
          <p className="links-description">
            The links below allow you to directly copy a farm war layout for any TH level!
          </p>
          
          <div className="base-links-grid">
            <a 
              href="https://link.clashofclans.com/en?action=OpenLayout&id=TH17%3AWB%3AAAAASQAAAAH7Ro8xiCMQ04FOKPXoE4Bu"
              target="_blank"
              rel="noopener noreferrer"
              className="base-link-card"
            >
              <img src={th17Image} alt="TH17" className="base-link-image" />
              <span className="base-link-th">TH17</span>
            </a>

            <a 
              href="https://link.clashofclans.com/en?action=OpenLayout&id=TH16%3AWB%3AAAAAFAAAAAKVSF59rsHsGIF4LfJeXhCS"
              target="_blank"
              rel="noopener noreferrer"
              className="base-link-card"
            >
              <img src={th16Image} alt="TH16" className="base-link-image" />
              <span className="base-link-th">TH16</span>
            </a>

            <a 
              href="https://link.clashofclans.com/en?action=OpenLayout&id=TH15%3AWB%3AAAAACAAAAALIH4f53xM6pggJHTwWvF5_"
              target="_blank"
              rel="noopener noreferrer"
              className="base-link-card"
            >
              <img src={th15Image} alt="TH15" className="base-link-image" />
              <span className="base-link-th">TH15</span>
            </a>

            <a 
              href="https://link.clashofclans.com/en?action=OpenLayout&id=TH14%3AWB%3AAAAAXQAAAAG1_9Za4FikUiFTsiZAoYew"
              target="_blank"
              rel="noopener noreferrer"
              className="base-link-card"
            >
              <img src={th14Image} alt="TH14" className="base-link-image" />
              <span className="base-link-th">TH14</span>
            </a>

            <a 
              href="https://link.clashofclans.com/en?action=OpenLayout&id=TH13%3AWB%3AAAAAFAAAAAKOTjVupZ084j5rcN4mi6qz"
              target="_blank"
              rel="noopener noreferrer"
              className="base-link-card"
            >
              <img src={th13Image} alt="TH13" className="base-link-image" />
              <span className="base-link-th">TH13</span>
            </a>

            <a 
              href="https://link.clashofclans.com/en?action=OpenLayout&id=TH12%3AWB%3AAAAAUQAAAAHVDfJe2UzXU9dHXBoRIdzj"
              target="_blank"
              rel="noopener noreferrer"
              className="base-link-card"
            >
              <img src={th12Image} alt="TH12" className="base-link-image" />
              <span className="base-link-th">TH12</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}

export default FarmingBaseLayouts

