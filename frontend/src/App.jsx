import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import FormPage from './pages/FormPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import ViewPage from './pages/ViewPage.jsx'

export default function App() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <>
      <nav className="nav">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
          <div className="icon">⬡</div>
          <span className="label">QRTrack</span>
          <span className="sub">/ production</span>
        </div>
        <div className="nav-links">
          <NavLink to="/new" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            + New Batch
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            ≡ History
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/new"      element={<FormPage />} />
        <Route path="/history"  element={<HistoryPage />} />
        <Route path="/view/:id" element={<ViewPage />} />
      </Routes>
    </>
  )
}
