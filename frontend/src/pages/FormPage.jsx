import React, { useState, useEffect } from 'react'
import { createBatch } from '../api.js'

const EMPTY = {
  batch_no: '',
  parent_id: '',
  lot_no: '',
  balls: '',
  roller_with_roller_cages: '',
  balls_cages: '',
}

function fmt(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true,
  })
}

// States: scanning → scanner_error → idle (form) → generating → done
export default function FormPage() {
  const [form, setForm]       = useState(EMPTY)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const [stage, setStage]     = useState('scanning') // start with scanner

  // On page load: try scanner for 1.5s then show error
  useEffect(() => {
    const t = setTimeout(() => setStage('scanner_error'), 1500)
    return () => clearTimeout(t)
  }, [])

  const proceedManual = () => {
    setStage('idle')
  }

  const onChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.batch_no.trim() || !form.parent_id.trim() || !form.lot_no.trim()) {
      setError('Batch No., Parent ID and Lot No. are required.')
      return
    }
    setStage('generating')
    setResult(null)

    try {
      const payload = {
        ...form,
        balls:                    Number(form.balls) || 0,
        roller_with_roller_cages: Number(form.roller_with_roller_cages) || 0,
        balls_cages:              Number(form.balls_cages) || 0,
      }
      const res = await createBatch(payload)
      setTimeout(() => {
        setResult(res.data)
        setStage('done')
        setForm(EMPTY)
      }, 1200)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save. Is the backend running?')
      setStage('idle')
    }
  }

  const onReset = () => {
    setForm(EMPTY)
    setResult(null)
    setError('')
    setStage('scanning')
    setTimeout(() => setStage('scanner_error'), 1500)
  }

  const downloadQR = () => {
    const a = document.createElement('a')
    a.href     = result.qr_data_url
    a.download = `QR_${result.batch.batch_no}.png`
    a.click()
  }

  return (
    <div className="page">
      <div className="page-title">New Batch Entry</div>
      <div className="page-sub">Fill in the production parameters — a QR code will be generated on save.</div>

      {/* ── SCANNING ── */}
      {stage === 'scanning' && (
        <div className="anim-card">
          <div className="anim-scanner">
            <div className="scanner-box">
              <div className="scanner-corner tl" />
              <div className="scanner-corner tr" />
              <div className="scanner-corner bl" />
              <div className="scanner-corner br" />
              <div className="scanner-line" />
              <div className="scanner-icon">⬡</div>
            </div>
          </div>
          <div className="anim-label">Connecting to QR Scanner…</div>
          <div className="anim-dots"><span /><span /><span /></div>
        </div>
      )}

      {/* ── SCANNER ERROR ── */}
      {stage === 'scanner_error' && (
        <div className="anim-card anim-error-card">
          <div className="anim-error-icon">⚠</div>
          <div className="anim-label" style={{ color: 'var(--red)' }}>QR Scanner Not Connected</div>
          <div className="anim-sublabel">Could not detect a hardware QR scanner on this device.</div>
          <div className="anim-divider" />
          <div className="anim-sublabel" style={{ marginBottom: '1.25rem' }}>
            Proceed with <strong style={{ color: 'var(--text)' }}>manual QR generation</strong> instead?
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={proceedManual}>
              ⬡ Generate QR Manually
            </button>
          </div>
        </div>
      )}

      {/* ── FORM (manual entry) ── */}
      {stage === 'idle' && (
        <div className="card" style={{ animation: 'fadeUp 0.3s ease' }}>
          <div className="card-title">// batch parameters</div>
          <form onSubmit={onSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Batch No. *</label>
                <input name="batch_no" value={form.batch_no} onChange={onChange} placeholder="e.g. BT-2024-001" autoFocus />
              </div>
              <div className="field">
                <label>Parent ID *</label>
                <input name="parent_id" value={form.parent_id} onChange={onChange} placeholder="e.g. PR-XYZ-100" />
              </div>
              <div className="field">
                <label>Lot No. *</label>
                <input name="lot_no" value={form.lot_no} onChange={onChange} placeholder="e.g. LT-00045" />
              </div>
              <div className="field">
                <label>Balls</label>
                <input type="number" name="balls" value={form.balls} onChange={onChange} placeholder="0" min="0" />
              </div>
              <div className="field">
                <label>Roller with Roller Cages</label>
                <input type="number" name="roller_with_roller_cages" value={form.roller_with_roller_cages} onChange={onChange} placeholder="0" min="0" />
              </div>
              <div className="field">
                <label>Balls Cages</label>
                <input type="number" name="balls_cages" value={form.balls_cages} onChange={onChange} placeholder="0" min="0" />
              </div>
            </div>

            {error && <div className="error-bar">⚠ {error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                ▶ Save & Generate QR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── GENERATING ── */}
      {stage === 'generating' && (
        <div className="anim-card">
          <div className="anim-qr-gen">
            <div className="gen-grid">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="gen-cell" style={{ animationDelay: `${i * 60}ms` }} />
              ))}
            </div>
          </div>
          <div className="anim-label">Generating QR Code…</div>
          <div className="anim-dots"><span /><span /><span /></div>
        </div>
      )}

      {/* ── DONE ── */}
      {stage === 'done' && result && (
        <div className="anim-card anim-done-card">
          <div className="done-checkmark">✓</div>
          <div className="anim-label" style={{ color: 'var(--green)' }}>Scan Complete!</div>
          <div className="anim-sublabel" style={{ marginBottom: '1.5rem' }}>Batch saved and QR generated successfully.</div>

          <div className="qr-panel" style={{ marginTop: 0, animation: 'fadeUp 0.4s ease' }}>
            <div className="qr-img-wrap">
              <span className="qr-success-badge">✓ SAVED</span>
              <img src={result.qr_data_url} alt="QR Code" />
              <div style={{ marginTop: '0.6rem' }}>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={downloadQR}>
                  ↓ Download
                </button>
              </div>
            </div>

            <div className="qr-details">
              <h3>⬡ Batch Details</h3>
              <div className="qr-grid">
                <div className="qr-row"><label>Batch No.</label><span>{result.batch.batch_no}</span></div>
                <div className="qr-row"><label>Parent ID</label><span>{result.batch.parent_id}</span></div>
                <div className="qr-row"><label>Lot No.</label><span>{result.batch.lot_no}</span></div>
                <div className="qr-row"><label>Balls</label><span>{result.batch.balls}</span></div>
                <div className="qr-row"><label>Roller w/ Roller Cages</label><span>{result.batch.roller_with_roller_cages}</span></div>
                <div className="qr-row"><label>Balls Cages</label><span>{result.batch.balls_cages}</span></div>
                <div className="qr-row" style={{ gridColumn: '1/-1' }}>
                  <label>Saved at</label><span>{fmt(result.batch.created_at)}</span>
                </div>
              </div>
              <div className="qr-url-row">🔗 scan → <span>{result.view_url}</span></div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="btn btn-ghost" onClick={onReset}>+ New Batch</button>
          </div>
        </div>
      )}
    </div>
  )
}
