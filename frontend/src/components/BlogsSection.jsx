import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import './BlogsSection.css'

const BLOGS = [
  {
    id: 'b1',
    img: '/media/blog1.webp',
    tag: '11 Ways to Delegate Effectively for\nBusiness Owners in 2026',
    date: '14\nSUN',
    title: '11 Ways to Delegate Effectively for Business Owners in 2026',
    excerpt: 'Feeling overwhelmed? No time for strategy, family, or even a…',
  },
  {
    id: 'b2',
    img: '/media/blog2.webp',
    tag: '4 Ways to Build\nBrand Identity',
    date: '13\nSAT',
    title: '4 Ways to Build Brand Identity For MSMEs Without a Big Budget',
    excerpt: 'Want a brand like Nike? Don’t copy them. It’s a…',
  },
  {
    id: 'b3',
    img: '/media/blog1.webp',
    tag: '11 Recruitment Tips\nTo Hire the Right People',
    date: '12\nFRI',
    title: '11 Recruitment Tips to Build a High-Performing & Dependable Team',
    excerpt: 'Tired of bad hires? Check out these 11 recruitment tips',
  },
  {
    id: 'b4',
    img: '/media/blog2.webp',
    tag: 'Marketing Systems\nThat Scale',
    date: '10\nWED',
    title: 'Marketing Systems That Scale: A Practical Playbook',
    excerpt: 'Build repeatable systems so growth doesn’t depend on luck.',
  },
  {
    id: 'b5',
    img: '/media/blog1.webp',
    tag: 'Operations\nOptimization',
    date: '09\nTUE',
    title: 'Operations Optimization: Simple Changes That Improve Profit',
    excerpt: 'Reduce waste, tighten processes, and improve margins.',
  },
]

export default function BlogsSection({ content }) {
  const kicker = content?.kicker || 'Proven Business Insights & Strategies for MSMEs'
  const title = content?.title || 'BLOGS'
  const allText = content?.allText || 'ALL BLOGS'
  const allHref = content?.allHref || '/blogs'
  const items = content?.items || BLOGS

  const toExcerpt = (html) => {
    if (!html) return ''
    const text = String(html)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (text.length <= 60) return text
    return `${text.slice(0, 60)}…`
  }

  const normalize = (b, idx) => {
    if (b && typeof b === 'object' && 'contentHtml' in b) {
      return {
        mode: 'cms',
        id: b.id || `cms-${idx}`,
        img: b.imageUrl || b.img || '',
        title: b.title || 'Blog',
        excerpt: b.excerpt || toExcerpt(b.contentHtml),
        tag: b.tag || '',
        date: b.date || '',
      }
    }

    return {
      mode: 'legacy',
      id: b.id || `legacy-${idx}`,
      img: b.img,
      title: b.title,
      excerpt: b.excerpt,
      tag: b.tag,
      date: b.date,
    }
  }

  const [index, setIndex] = useState(0)
  const trackRef = useRef(null)
  const firstCardRef = useRef(null)
  const viewportRef = useRef(null)
  const [stepPx, setStepPx] = useState(0)
  const [maxIndex, setMaxIndex] = useState(Math.max(0, items.length - 1))

  useEffect(() => {
    const update = () => {
      const card = firstCardRef.current
      if (!card) return
      const styles = window.getComputedStyle(trackRef.current)
      const gap = parseFloat(styles.columnGap || styles.gap || '0')

      const cardW = card.getBoundingClientRect().width
      const step = cardW + gap
      setStepPx(step)

      const viewportW = viewportRef.current?.getBoundingClientRect().width ?? 0
      const visibleCount = viewportW > 0 ? Math.max(1, Math.round((viewportW + gap) / (cardW + gap))) : 1
      const nextMaxIndex = Math.max(0, items.length - visibleCount)
      setMaxIndex(nextMaxIndex)
      setIndex((i) => Math.min(i, nextMaxIndex))
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1))

  return (
    <section className="nt-blogs">
      <div className="nt-blogs__inner">
        <aside className="nt-blogs__left">
          <div className="nt-blogs__kicker">{kicker}</div>
          <div className="nt-blogs__title">{title}</div>

          <Link className="nt-blogs__all" to={allHref}>
            {allText} <span aria-hidden="true">→</span>
          </Link>

          <div className="nt-blogs__nav">
            <button className="nt-blogs__navBtn" type="button" aria-label="Previous" onClick={prev} disabled={index === 0}>
              <ArrowLeft size={18} />
            </button>
            <button
              className="nt-blogs__navBtn"
              type="button"
              aria-label="Next"
              onClick={next}
              disabled={index === maxIndex}
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <img className="nt-blogs__arrow" src="/media/blogs-arrow.png" alt="" aria-hidden="true" />
        </aside>

        <div className="nt-blogs__right">
          <div ref={viewportRef} className="nt-blogs__viewport">
            <div
              ref={trackRef}
              className="nt-blogs__track"
              style={{ transform: `translate3d(${-index * stepPx}px, 0, 0)` }}
            >
              {items.map((b, i) => {
                const x = normalize(b, i)

                return (
                  <article key={x.id} ref={i === 0 ? firstCardRef : undefined} className="nt-blogCard">
                  <div className="nt-blogCard__media">
                    {x.img ? (
                      <Link to={x.mode === 'cms' ? `/blogs/${x.id}` : allHref}>
                        <img className="nt-blogCard__img" src={x.img} alt={x.title} />
                      </Link>
                    ) : null}
                    {x.tag ? <div className="nt-blogCard__tag">{String(x.tag).split('\n').map((t) => t).join(' ')}</div> : null}
                    {x.date ? (
                      <div className="nt-blogCard__date">
                        {String(x.date)
                          .split('\n')
                          .map((line, idx) => (
                            <span key={idx}>{line}</span>
                          ))}
                      </div>
                    ) : null}
                  </div>

                  <Link to={x.mode === 'cms' ? `/blogs/${x.id}` : allHref} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="nt-blogCard__title">{x.title}</div>
                  </Link>
                  <div className="nt-blogCard__excerpt">{x.excerpt}</div>
                  <div className="nt-blogCard__line" aria-hidden="true" />
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
