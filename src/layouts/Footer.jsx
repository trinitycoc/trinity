import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-note">
        <p className="footer-note-text">
          This website is exclusively for <strong>Trinity Family clans</strong>.
          <br />
          If you'd like to <strong>join the Trinity Family</strong>, please visit the{' '}
          <Link to="/contact" className="footer-link">Contact Us</Link> section for details. ✨
        </p>
      </div>
      <p className="footer-copyright">
        &copy;2025 Trinity. built by <a href="https://github.com/abhiiiijain" target="_blank" rel="noopener noreferrer">Hell Raiser</a>
      </p>
    </footer>
  )
}

export default Footer

