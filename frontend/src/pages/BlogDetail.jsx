import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiGet } from '../lib/api'
import '../components/BlogsSection.css'

function formatDate(input) {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export default function BlogDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      try {
        const res = await apiGet(`/api/blogs/getBlog/${id}`)
        if (!mounted) return
        setBlog(res?.data || null)
      } catch {
        if (!mounted) return
        setBlog(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [id])

  const created = useMemo(() => formatDate(blog?.created_at), [blog?.created_at])

  return (
    <section className="nt-blogs" style={{ padding: '46px 0 54px' }}>
      <div className="nt-blogs__inner" style={{ gridTemplateColumns: '1fr', maxWidth: 1100 }}>
        <aside className="nt-blogs__left" style={{ paddingTop: 0 }}>
          <div className="nt-blogs__kicker">Proven Business Insights &amp; Strategies for MSMEs</div>
          <div className="nt-blogs__title">Blogs</div>

          <Link className="nt-blogs__all" to="/blogs">
            Back to Blogs <span aria-hidden="true">→</span>
          </Link>
        </aside>

        <div style={{ marginTop: 14 }}>
          {!loading && !blog ? (
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Blog not found</div>
              <div style={{ opacity: 0.85, marginBottom: 14 }}>This blog may have been removed or the link is incorrect.</div>
              <Link className="nt-blogs__all" to="/blogs">
                Go back <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : blog ? (
            <article className="nt-blogCard" style={{ width: '100%' }}>
              <div className="nt-blogCard__media" style={{ maxHeight: 420 }}>
                {blog.imageUrl ? <img className="nt-blogCard__img" src={blog.imageUrl} alt={blog.title || 'Blog'} /> : null}
                {created ? <div className="nt-blogCard__tag">{created}</div> : null}
              </div>

              <div className="nt-blogCard__title" style={{ fontSize: 28, lineHeight: 1.2 }}>{blog.title || 'Blog'}</div>

              <div className="nt-blogCard__line" aria-hidden="true" />

              <div
                className="nt-blogCard__excerpt"
                style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, lineHeight: 1.9 }}
                dangerouslySetInnerHTML={{ __html: blog.contentHtml || '' }}
              />

              <div className="nt-blogCard__line" aria-hidden="true" style={{ marginTop: 18 }} />

              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link className="nt-blogs__all" to="/blogs">
                  View all blogs <span aria-hidden="true">→</span>
                </Link>
                <Link className="nt-blogs__all" to="/contact">
                  Contact us <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  )
}
