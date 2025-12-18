import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'

export default function BookLeads() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const columns = useMemo(
    () => [
      { key: 'sr', label: 'Sr No.' },
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'company', label: 'Company' },
      { key: 'service', label: 'Topic' },
      { key: 'preferred_time', label: 'Preferred time' },
      { key: 'notes', label: 'Notes' },
      { key: 'created_at', label: 'Date' },
    ],
    [],
  )

  const load = async ({ nextPage, nextSearch, nextPageSize } = {}) => {
    const p = nextPage ?? page
    const s = nextSearch ?? search
    const l = nextPageSize ?? pageSize

    setError('')
    setLoading(true)

    try {
      const res = await api.get('/api/leads/book/getAllByPage', {
        params: { limit: l, page: p, searchtxt: s },
      })

      setRows(res.data?.data || [])
      setTotalPages(res.data?.totalPages || 1)
      setTotalCount(res.data?.totalCount || 0)
      setPage(Number(res.data?.currentPage || p))
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.msg || 'Failed to load booking leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load({ nextPage: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="nt-adminCard" style={{ padding: 16 }}>
      <PageHeader
        title="Book Leads"
        subtitle="Consultation requests submitted from the Book page"
        breadcrumbs={[{ label: 'Leads' }, { label: 'Book' }]}
      />

      {error ? <div className="nt-alert">{error}</div> : null}

      <div className="nt-toolbar">
        <div className="nt-search">
          <input
            className="nt-adminInput"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <button
            type="button"
            className="nt-btn nt-btn--ghost"
            onClick={() => {
              setPage(1)
              load({ nextPage: 1, nextSearch: search })
            }}
            disabled={loading}
          >
            Search
          </button>
        </div>

        <div className="nt-search">
          <select
            className="nt-select"
            value={pageSize}
            onChange={(e) => {
              const next = Number(e.target.value)
              setPageSize(next)
              setPage(1)
              load({ nextPage: 1, nextPageSize: next })
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <div style={{ fontSize: 12, color: 'rgba(4,27,46,0.55)' }}>Total: {totalCount}</div>
        </div>
      </div>

      <div className="nt-tableWrap">
        <table className="nt-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 14 }}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 14 }}>
                  No booking leads found
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.id}>
                  <td>{(page - 1) * pageSize + (idx + 1)}</td>
                  <td style={{ fontWeight: 700 }}>{r.name}</td>
                  <td>{r.phone}</td>
                  <td>{r.email}</td>
                  <td>{r.company}</td>
                  <td>{r.service}</td>
                  <td>{r.preferred_time}</td>
                  <td style={{ maxWidth: 520, whiteSpace: 'pre-wrap' }}>{r.notes}</td>
                  <td>{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p)
          load({ nextPage: p })
        }}
      />
    </div>
  )
}
