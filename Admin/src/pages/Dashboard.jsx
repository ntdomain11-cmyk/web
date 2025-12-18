import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await api.get('/api/dashboard/superAdminDashboard')
        if (!mounted) return
        setData(res.data?.data?.[0] || null)
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data?.msg || 'Failed to load dashboard')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div className="nt-adminCard" style={{ padding: 16 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontWeight: 700 }}>Overview</div>
          <p className="nt-adminText">Quick stats from the backend dashboard endpoint.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
        <div className="nt-adminCard" style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: 'rgba(4,27,46,0.55)' }}>Users</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
            {loading ? '…' : error ? '—' : data?.users ?? 0}
          </div>
        </div>
        <div className="nt-adminCard" style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: 'rgba(4,27,46,0.55)' }}>API Status</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
            {loading ? '…' : error ? '—' : 'OK'}
          </div>
        </div>
      </div>

      {error ? (
        <div className="nt-adminCard" style={{ padding: 16, borderColor: 'rgba(255,77,77,0.35)' }}>
          <div style={{ fontWeight: 700 }}>Error</div>
          <p className="nt-adminText">{error}</p>
        </div>
      ) : null}
    </div>
  )
}
