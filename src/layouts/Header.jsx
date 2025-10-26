import React from 'react'
import { Link } from 'react-router-dom'
import trinityLogo from '/Trinity_Logo.png'

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">
          <img src={trinityLogo} alt="Trinity Logo" className="logo-image" />
          <h1 className="logo-text">Trinity</h1>
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/clans">Clans</Link></li>
          <li><Link to="/cwl">Cwl</Link></li>
          <li><Link to="/farming-base-layouts">Farming base layouts</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header

