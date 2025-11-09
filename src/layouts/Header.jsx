import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import trinityLogo from '/Trinity_Logo.png'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev)
  const handleLinkClick = () => setIsMenuOpen(false)

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">
          <img src={trinityLogo} alt="Trinity Logo" className="logo-image" />
          <h1 className="logo-text">Trinity</h1>
        </Link>
        <button
          type="button"
          className={`nav-toggle${isMenuOpen ? ' open' : ''}`}
          onClick={handleToggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
        <ul className={`nav-links${isMenuOpen ? ' open' : ''}`}>
          <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
          <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
          <li><Link to="/clans" onClick={handleLinkClick}>Clans</Link></li>
          <li><Link to="/cwl" onClick={handleLinkClick}>Cwl</Link></li>
          <li><Link to="/farming-base-layouts" onClick={handleLinkClick}>Farming base layouts</Link></li>
          <li><Link to="/features" onClick={handleLinkClick}>Features</Link></li>
          <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header

