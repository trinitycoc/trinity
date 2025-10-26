import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import Clans from './pages/Clans'
import ClanDetails from './pages/ClanDetails'
import CWL from './pages/CWL'
import FarmingBaseLayouts from './pages/FarmingBaseLayouts'
import Contact from './pages/Contact'
import './styles/main.scss'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="clans" element={<Clans />} />
          <Route path="clans/:clanTag" element={<ClanDetails />} />
          <Route path="cwl" element={<CWL />} />
          <Route path="farming-base-layouts" element={<FarmingBaseLayouts />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
