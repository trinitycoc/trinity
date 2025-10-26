import React, { useState } from 'react'
import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <h1 className="logo">Trinity</h1>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <h2 className="hero-title">Welcome to Trinity</h2>
            <p className="hero-subtitle">
              A modern React website built with Vite and ready for GitHub Pages
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setCount(count + 1)}>
                Clicked {count} times
              </button>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
              >
                View on GitHub
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="geometric-shape"></div>
          </div>
        </section>

        <section className="features">
          <h3 className="section-title">Features</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Lightning Fast</h4>
              <p>Built with Vite for blazing fast development and optimized builds</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h4>Modern Design</h4>
              <p>Clean and responsive UI that works on all devices</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h4>Easy Deploy</h4>
              <p>One command deployment to GitHub Pages</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Trinity. Built with React + Vite.</p>
      </footer>
    </div>
  )
}

export default App

