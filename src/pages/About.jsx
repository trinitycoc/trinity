import React from 'react'
import SectionTitle from '../components/SectionTitle'

function About() {
  return (
    <section className="about">
      <SectionTitle>About Trinity</SectionTitle>
      
      <div className="about-hero">
        <div className="about-intro">
          <h3>Trinity Family of Clans</h3>
          <p>Led by Hell Raiser, Trinity is a thriving community of 8 Clash of Clans clans united by passion, strategy, and excellence.</p>
        </div>
      </div>

      <div className="about-features">
        <div className="about-card">
          <div className="card-icon">👥</div>
          <h4>8 Clans Strong</h4>
          <p>A diverse family of clans welcoming players of all skill levels and Town Hall tiers.</p>
        </div>

        <div className="about-card">
          <div className="card-icon">🌍</div>
          <h4>GFL Member</h4>
          <p>Proud member of the Global Farming League (GFL), competing at the highest level.</p>
        </div>

        <div className="about-card">
          <div className="card-icon">⚔️</div>
          <h4>50 vs 50 Wars</h4>
          <p>Regular large-scale wars bringing our entire community together for epic battles.</p>
        </div>

        <div className="about-card">
          <div className="card-icon">🏆</div>
          <h4>CWL Organization</h4>
          <p>Organized CWL in satellite clans, offering high leagues for competitive players.</p>
        </div>
      </div>

      <div className="about-cta">
        <p>Explore our clans in the <strong>Clans</strong> section and find CWL opportunities in the <strong>CWL</strong> section.</p>
      </div>
    </section>
  )
}

export default About

