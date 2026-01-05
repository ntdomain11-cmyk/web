import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api'
import '../components/BlogsSection.css'

export default function Blogs() {
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await apiGet(`/api/blogs/getAllBlogsByPage?limit=${pageSize}&page=${page}`)
        if (!mounted) return
        setRows(res?.data || [])
        setTotalPages(res?.totalPages || 1)
      } catch {
        if (!mounted) return
        setRows([])
        setTotalPages(1)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [page, pageSize])

  const title = 'Blogs'
  const items = useMemo(() => rows || [], [rows])

  const toText = (html) => {
    if (!html) return ''
    return String(html)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  return (
    <section className="nt-blogs" style={{ padding: '46px 0 54px' }}>
      <div className="nt-blogs__inner" style={{ gridTemplateColumns: '1fr', maxWidth: 1100 }}>
        <aside className="nt-blogs__left" style={{ paddingTop: 0 }}>
          <div className="nt-blogs__kicker">Proven Business Insights &amp; Strategies for MSMEs</div>
          <div className="nt-blogs__title">{title}</div>

          <Link className="nt-blogs__all" to="/">
            Back to Home <span aria-hidden="true">→</span>
          </Link>
        </aside>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginTop: 10, color: '#fff' }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Page {page} of {totalPages}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              style={{ height: 36, borderRadius: 10, padding: '0 10px', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.10)', color: '#fff' }}
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{ height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.10)', color: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{ height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.10)', color: '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 18, marginTop: 14 }}>
          {items.map((b, idx) => (
            <article key={`${b.id || b.title || 'blog'}-${idx}`} className="nt-blogCard" style={{ width: '100%' }}>
              <div className="nt-blogCard__media">
                {b.imageUrl ? (
                  <Link to={b.id ? `/blogs/${b.id}` : '/blogs'}>
                    <img className="nt-blogCard__img" src={b.imageUrl} alt={b.title || 'Blog'} />
                  </Link>
                ) : null}
                {b.tag ? <div className="nt-blogCard__tag">{String(b.tag).split('\n').join(' ')}</div> : null}
                {b.date ? (
                  <div className="nt-blogCard__date">
                    {String(b.date)
                      .split('\n')
                      .map((line, i) => (
                        <span key={i}>{line}</span>
                      ))}
                  </div>
                ) : null}
              </div>

              <Link to={b.id ? `/blogs/${b.id}` : '/blogs'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="nt-blogCard__title" style={{ fontSize: 18 }}>{b.title || 'Blog'}</div>
              </Link>

              <div className="nt-blogCard__excerpt" style={{ color: 'rgba(255,255,255,0.80)' }}>
                {b.excerpt || toText(b.contentHtml)}
              </div>

              <div style={{ marginTop: 12 }}>
                <Link className="nt-blogs__all" to={b.id ? `/blogs/${b.id}` : '/blogs'}>
                  Read more <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="nt-blogCard__line" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
