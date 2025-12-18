import { useEffect, useMemo, useState } from 'react'
import { Star, User2 } from 'lucide-react'
import { apiGet } from '../lib/api'
import '../components/TestimonialsSection.css'

function Stars({ count }) {
  return (
    <div className="nt-testi__stars" aria-label={`${count} star rating`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'nt-testi__star nt-testi__star--on' : 'nt-testi__star'}>
          <Star size={14} />
        </span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await apiGet('/api/content/testimonials')
        if (!mounted) return
        setContent(res?.data?.content || null)
      } catch {
        if (!mounted) return
        setContent(null)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const title = content?.title || 'Testimonials'
  const items = useMemo(() => content?.items || [], [content])

  return (
    <section className="nt-testi">
      <div className="nt-testi__bg" aria-hidden="true">
        <img className="nt-testi__ellipse nt-testi__ellipse--a" src="/media/Ellipse.svg" alt="" />
        <img className="nt-testi__ellipse nt-testi__ellipse--b" src="/media/Ellipse-sm.svg" alt="" />
      </div>

      <div className="nt-testi__container">
        <div className="nt-testi__header">
          <div className="nt-testi__titleWrap">
            <div className="nt-testi__kicker">What they say about me</div>
            <h1 className="nt-testi__title">{title}</h1>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {items.map((t, idx) => (
            <article key={`${t.name || 't'}-${idx}`} className="nt-testi__card" style={{ width: '100%' }}>
              <div className="nt-testi__cardTop" style={{ gridTemplateColumns: '44px 1fr' }}>
                <div className="nt-testi__avatar" aria-hidden="true">
                  {t.imageUrl ? <img className="nt-testi__avatarImg" src={t.imageUrl} alt="" /> : <User2 size={20} />}
                </div>
                <div className="nt-testi__meta">
                  <div className="nt-testi__name">{t.name || 'Customer'}</div>
                  {t.designation ? (
                    <div className="nt-testi__sub">
                      <span>{t.designation}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="nt-testi__divider" aria-hidden="true" />

              <Stars count={typeof t.rating === 'number' ? t.rating : 5} />

              <div className="nt-testi__text">{t.content || ''}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
