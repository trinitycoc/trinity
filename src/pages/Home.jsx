import React, { useState } from 'react'
import Button from '../components/Button'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-title">Welcome to Trinity</h2>
          <p className="hero-subtitle">
            Join the Trinity family - A community of Clash of Clans players united by passion and excellence
          </p>
          <div className="hero-actions">
            <Button variant="primary" onClick={() => setCount(count + 1)}>
              Clicked {count} times
            </Button>
            <Button variant="secondary" href="https://github.com">
              View on GitHub
            </Button>
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

