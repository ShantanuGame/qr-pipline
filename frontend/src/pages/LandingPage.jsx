import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBatches } from '../api.js'

export default function LandingPage() {
  const navigate = useNavigate()
  const [count, setCount] = useState(null)

  useEffect(() => {
    getAllBatches()
      .then(res => setCount(res.data.filter(b => b.batch_no).length))
      .catch(() => setCount(0))
  }, [])

  return (
    <div className="landing">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow" />

        <div className="hero-inner">
          <div className="hero-badge">⬡ Production Tracking System</div>

          <h1 className="hero-title">
            Track Every Batch.<br />
            <span className="hero-accent">Scan. Verify. Done.</span>
          </h1>

          <p className="hero-desc">
            A fast, reliable QR-based batch tracking system for production floors.
            Log batch parameters, generate instant QR codes, and retrieve full
            records with a single scan — from any device, anywhere.
          </p>

          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => navigate('/new')}>
              Get Started →
            </button>
            <button className="btn-hero-ghost" onClick={() => navigate('/history')}>
              View History
            </button>
          </div>

          {count !== null && (
            <div className="hero-stat">
              <span className="hero-stat-num">{count}</span>
              <span className="hero-stat-label">batches tracked so far</span>
            </div>
          )}
        </div>

        {/* Floating QR mock */}
        <div className="hero-qr-mock">
          <div className="qr-mock-inner">
            <div className="qr-mock-grid">
              {Array.from({ length: 49 }).map((_, i) => (
                <div
                  key={i}
                  className="qr-cell"
                  style={{ opacity: Math.random() > 0.4 ? 1 : 0.08 }}
                />
              ))}
            </div>
            <div className="qr-mock-label">SCAN ME</div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-tag">// how it works</div>
          <h2 className="section-title">Three steps. That's it.</h2>

          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <div className="step-icon">📋</div>
              <h3>Enter Batch Info</h3>
              <p>Fill in Batch No., Parent ID, Lot No., and component quantities in seconds.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">02</div>
              <div className="step-icon">⬡</div>
              <h3>Get QR Instantly</h3>
              <p>A unique QR code is generated and saved automatically — no extra steps.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">03</div>
              <div className="step-icon">📱</div>
              <h3>Scan Anywhere</h3>
              <p>Scan the QR with any phone or device to pull up full batch details instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-tag">// features</div>
          <h2 className="section-title">Everything you need. Nothing you don't.</h2>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant QR Generation</h3>
              <p>QR codes are generated the moment you hit Save — no waiting, no refresh.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗄️</div>
              <h3>MongoDB Backed</h3>
              <p>All records stored securely in MongoDB Atlas with full timestamp tracking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Scan from Any Device</h3>
              <p>Works with any phone camera or QR scanner — no app install required.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Full History Table</h3>
              <p>Browse all batch records with timestamps, search, and one-click detail view.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⬇️</div>
              <h3>Download QR Codes</h3>
              <p>Download any QR code as a PNG to print or attach to physical batches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🕐</div>
              <h3>Date & Time Stamped</h3>
              <p>Every batch is recorded with full date and time — accurate to the second.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to track your first batch?</h2>
          <p className="cta-sub">Takes less than 30 seconds to log a batch and get your QR code.</p>
          <button className="btn-hero-primary" onClick={() => navigate('/new')}>
            Start Tracking →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-brand">⬡ QRTrack</div>
        <div className="footer-copy">Production Batch Tracking System</div>
      </footer>

    </div>
  )
}
