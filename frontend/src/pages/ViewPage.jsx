import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBatch } from '../api.js'

function fmtFull(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    weekday: 'long',
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  })
}

export default function ViewPage() {
  const { id } = useParams()
  const [batch, setBatch]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    getBatch(id)
      .then(res => setBatch(res.data.batch))
      .catch(() => setError('Batch record not found.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading-text">Loading batch data…</div>

  if (error) return (
    <div className="page">
      <div className="error-bar">⚠ {error}</div>
      <Link to="/" className="back-link" style={{ marginTop: '1rem' }}>← Back to home</Link>
    </div>
  )

  // Re-generate QR on client to show it on the view page too
  const viewUrl = window.location.href

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <Link to="/history" className="back-link">← Back to History</Link>

      <div className="page-title">Batch Record</div>
      <div className="page-sub">Scanned from QR code — full production details below.</div>

      <div className="card">
        <div className="card-title">// production parameters</div>

        <div className="view-hero">
          <div className="view-fields">
            <div className="vf-item">
              <label>Batch No.</label>
              <div className="val accent">{batch.batch_no}</div>
            </div>
            <div className="vf-item">
              <label>Parent ID</label>
              <div className="val">{batch.parent_id}</div>
            </div>
            <div className="vf-item">
              <label>Lot No.</label>
              <div className="val">{batch.lot_no}</div>
            </div>
            <div className="vf-item">
              <label>Balls</label>
              <div className="val">{batch.balls}</div>
            </div>
            <div className="vf-item">
              <label>Roller with Roller Cages</label>
              <div className="val">{batch.roller_with_roller_cages}</div>
            </div>
            <div className="vf-item">
              <label>Balls Cages</label>
              <div className="val">{batch.balls_cages}</div>
            </div>
          </div>

          {/* QR placeholder — shows URL */}
          <div className="view-qr" style={{ textAlign: 'center' }}>
            <div style={{
              width: 130,
              height: 130,
              background: 'var(--surface2)',
              border: '2px dashed var(--border2)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              color: 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              padding: '0.5rem',
              textAlign: 'center',
            }}>
              QR already<br/>scanned ✓
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              ID: {batch._id.slice(-8)}
            </div>
          </div>
        </div>

        <div className="timestamp-strip">
          <div className="ts-dot" />
          <div className="label">Recorded at:</div>
          <div className="value">{fmtFull(batch.created_at)}</div>
        </div>
      </div>
    </div>
  )
}
