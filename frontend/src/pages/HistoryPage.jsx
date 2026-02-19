import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBatches } from '../api.js'

function fmt(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true,
  })
}

export default function HistoryPage() {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const res = await getAllBatches()
      setBatches(res.data)
    } catch {
      setError('Could not load records. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="page">
      <div className="page-title">Batch History</div>
      <div className="page-sub">All production records stored in MongoDB — newest first.</div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="s-val">{batches.length}</div>
          <div className="s-label">Total Records</div>
        </div>
        <div className="stat-box">
          <div className="s-val">
            {batches.length > 0
              ? new Date(batches[0].created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
              : '—'}
          </div>
          <div className="s-label">Latest Entry</div>
        </div>
        <button className="btn btn-ghost btn-sm refresh-btn" onClick={load} disabled={loading}>
          ↺ Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-text">loading records…</div>
      ) : error ? (
        <div className="error-bar">⚠ {error}</div>
      ) : batches.length === 0 ? (
        <div className="empty">
          <div className="e-icon">◻</div>
          <p>No batches yet. Go to <strong>+ New Batch</strong> to create one.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Batch No.</th>
                <th>Parent ID</th>
                <th>Lot No.</th>
                <th>Balls</th>
                <th>Roller w/ Cages</th>
                <th>Balls Cages</th>
                <th>Timestamp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <tr key={b._id}>
                  <td style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                    {batches.length - i}
                  </td>
                  <td><span className="pill">{b.batch_no}</span></td>
                  <td>{b.parent_id}</td>
                  <td>{b.lot_no}</td>
                  <td className="num-cell">{b.balls}</td>
                  <td className="num-cell">{b.roller_with_roller_cages}</td>
                  <td className="num-cell">{b.balls_cages}</td>
                  <td className="ts-cell">{fmt(b.created_at)}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/view/${b._id}`)}
                    >
                      View ↗
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
