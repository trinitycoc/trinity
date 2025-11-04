import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import trinityLogo from '/Trinity_Logo.png'

function Home() {
  const [clanTag, setClanTag] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (!clanTag.trim()) return

    // Normalize clan tag: remove # if present, trim whitespace
    const normalizedTag = clanTag.trim().replace(/^#+/, '')
    
    if (normalizedTag) {
      navigate(`/clans/${normalizedTag}`)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

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
          <div className="hero-search">
            <input
              type="text"
              className="clan-search-input"
              placeholder="Enter clan tag (e.g., #J9UGCPR2)"
              value={clanTag}
              onChange={(e) => setClanTag(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="clan-search-button"
              onClick={handleSearch}
              disabled={!clanTag.trim()}
            >
              Search
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="geometric-shape"></div>
        </div>
      </section>
    </>
  )
}

export default Home

