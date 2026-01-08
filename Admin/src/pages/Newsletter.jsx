import { useEffect, useState } from 'react'
import api from '../lib/api'
import PageHeader from '../components/ui/PageHeader'

export default function Newsletter() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const load = async (nextPage = page) => {
    setError('')
    setLoading(true)
    try {
      const res = await api.get('/api/newsletter/list', { params: { page: nextPage, limit: 25 } })
      setRows(res.data?.data || [])
      setTotalPages(res.data?.totalPages || 1)
      setTotalCount(res.data?.totalCount || 0)
      setPage(Number(res.data?.currentPage || nextPage))
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load newsletter list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onExport = async () => {
    try {
      const res = await api.get('/api/newsletter/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'newsletter_subscriptions.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to export CSV')
    }
  }

  return (
    <div className="nt-adminCard" style={{ padding: 16 }}>
      <PageHeader
        title="Newsletter Subscribers"
        subtitle="View and export newsletter email list"
        breadcrumbs={[{ label: 'Content' }, { label: 'Newsletter' }]}
        right={
          <button type="button" className="nt-btn nt-btn--primary" onClick={onExport} disabled={loading}>
            Export CSV
          </button>
        }
      />

      {error ? <div className="nt-alert">{error}</div> : null}

      <div style={{ marginBottom: 8, fontSize: 12, color: 'rgba(4,27,46,0.65)' }}>Total: {totalCount}</div>

      <div className="nt-tableWrap">
        <table className="nt-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Email</th>
              <th>Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ padding: 14 }}>
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 14 }}>
                  No subscribers found
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.id}>
                  <td>{(page - 1) * 25 + (idx + 1)}</td>
                  <td>{r.email}</td>
                  <td>{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <button
          type="button"
          className="nt-btn nt-btn--ghost"
          onClick={() => page > 1 && load(page - 1)}
          disabled={loading || page <= 1}
        >
          Previous
        </button>
        <button
          type="button"
          className="nt-btn nt-btn--ghost"
          onClick={() => page < totalPages && load(page + 1)}
          disabled={loading || page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}
