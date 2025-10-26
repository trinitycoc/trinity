import React from 'react'
import trinityLogo from '/Trinity_Logo.png'

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-watermark">
          <img src={trinityLogo} alt="Trinity Watermark" />
        </div>
        <div className="hero-content">
          <h2 className="hero-title">Welcome to Trinity</h2>
          <p className="hero-subtitle">
            Join the Trinity family - A community of Clash of Clans players united by passion and excellence
          </p>
        </div>
        <div className="hero-image">
          <div className="geometric-shape"></div>
        </div>
      </section>
    </>
  )
}

export default Home

