import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import bgImage from '/trinity-bg.jpeg'

function MainLayout() {
  // Set background image URL as CSS variable
  
  return (
    <div className="app" style={{ '--bg-image-url': `url(${bgImage})` }}>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout

