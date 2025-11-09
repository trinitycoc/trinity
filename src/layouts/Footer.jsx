import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-about">
          <h4 className="footer-heading">About Trinity</h4>
          <p>
            Trinity is a family of dedicated Clash of Clans players committed to growth,
            teamwork, and competitive excellence. Discover our clans, track CWL progress,
            and join a community that supports every member.
          </p>
          <p className="footer-cta">
            Looking to join? Head over to our{' '}
            <Link to="/contact" className="footer-link">
              Contact page
            </Link>{' '}
            for next steps.
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-heading">Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/clans">Clans</Link>
            </li>
            <li>
              <Link to="/cwl">CWL</Link>
            </li>
            <li>
              <Link to="/features">Features</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy;{year} Trinity. Built by{' '}
          <a href="https://github.com/abhiiiijain" target="_blank" rel="noopener noreferrer">
            Hell Raiser
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer

