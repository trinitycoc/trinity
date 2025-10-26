import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function MainLayout() {
  // Set background image URL as CSS variable
  const bgImageUrl = `${import.meta.env.BASE_URL}trinity-bg.jpeg`
  
  return (
    <div className="app" style={{ '--bg-image-url': `url(${bgImageUrl})` }}>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout

