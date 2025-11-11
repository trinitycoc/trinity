import React, { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import './styles/main.scss'

const MainLayout = lazy(() => import('./layouts/MainLayout'))
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Clans = lazy(() => import('./pages/Clans'))
const ClanDetails = lazy(() => import('./pages/ClanDetails'))
const CWL = lazy(() => import('./pages/CWL'))
const FarmingBaseLayouts = lazy(() => import('./pages/FarmingBaseLayouts'))
const Features = lazy(() => import('./pages/Features'))

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Suspense fallback={<div className="page-loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="clans" element={<Clans />} />
            <Route path="clans/:clanTag" element={<ClanDetails />} />
            <Route path="cwl" element={<CWL />} />
            <Route path="farming-base-layouts" element={<FarmingBaseLayouts />} />
            <Route path="features" element={<Features />} />
            <Route path="contact" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
