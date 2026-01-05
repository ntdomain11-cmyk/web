import { Star, User2 } from 'lucide-react'
import './GoogleReviewsSection.css'

function Stars({ rating }) {
  const v = Math.max(0, Math.min(5, Number(rating || 0)))
  const full = Math.round(v)
  return (
    <div className="nt-grev__stars" aria-label={`${v} star rating`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'nt-grev__star nt-grev__star--on' : 'nt-grev__star'}>
          <Star size={14} />
        </span>
      ))}
    </div>
  )
}

export default function GoogleReviewsSection({ data }) {
  const enabled = !!data?.enabled
  const title = data?.title || 'Google Reviews'
  const place = data?.place || null
  const reviews = Array.isArray(data?.reviews) ? data.reviews : []

  if (!enabled || reviews.length === 0) return null

  return (
    <section className="nt-grev">
      <div className="nt-grev__container">
        <div className="nt-grev__head">
          <div>
            <div className="nt-grev__kicker">Google My Business</div>
            <h2 className="nt-grev__title">{title}</h2>
          </div>

          {place?.url ? (
            <a className="nt-grev__link" href={place.url} target="_blank" rel="noreferrer">
              View on Google
            </a>
          ) : null}
        </div>

        {place ? (
          <div className="nt-grev__summary">
            <div className="nt-grev__summaryLeft">
              <div className="nt-grev__placeName">{place.name || 'Business'}</div>
              <div className="nt-grev__summaryRow">
                <Stars rating={place.rating} />
                <div className="nt-grev__summaryText">
                  <span style={{ fontWeight: 900 }}>{place.rating || 0}</span>
                  <span className="nt-grev__dot" aria-hidden="true">
                    •
                  </span>
                  <span>{place.userRatingsTotal || 0} reviews</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="nt-grev__grid">
          {reviews.map((r, idx) => (
            <article key={`${r.authorName || 'r'}-${r.time || idx}`} className="nt-grev__card">
              <div className="nt-grev__cardTop">
                <div className="nt-grev__avatar" aria-hidden="true">
                  {r.profilePhotoUrl ? <img className="nt-grev__avatarImg" src={r.profilePhotoUrl} alt="" /> : <User2 size={20} />}
                </div>
                <div className="nt-grev__meta">
                  <div className="nt-grev__name">{r.authorName || 'Customer'}</div>
                  <div className="nt-grev__sub">
                    <Stars rating={r.rating} />
                    {r.relativeTime ? <span className="nt-grev__time">{r.relativeTime}</span> : null}
                  </div>
                </div>
              </div>

              {r.text ? <div className="nt-grev__text">{r.text}</div> : null}

              {r.authorUrl ? (
                <a className="nt-grev__authorLink" href={r.authorUrl} target="_blank" rel="noreferrer">
                  View profile
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
