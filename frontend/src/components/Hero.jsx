import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero({ content }) {
  const titleLines =
    content?.titleLines ||
    (content?.title ? [content.title, content?.title2 || ''] : ['Empowering Businesses with Strategy,', 'Structure & Smart Growth'])

  const subtitle =
    content?.subtitle ||
    content?.desc ||
    'Strategic consulting for Startups, SMEs, and Enterprises—delivering clarity, efficiency, and long-term success.'
  const ctaText = content?.ctaText || 'Book a Consultation'
  const ctaHref = content?.ctaHref || '/book'
  const imageUrl = content?.imageUrl || '/media/hero-side-img.webp'

  return (
    <section className="nt-hero">
      <div className="nt-hero__bg" aria-hidden="true" />

      <div className="nt-hero__container">
        <div className="nt-hero__content">
          <h1 className="nt-hero__title">
            {titleLines[0]}
            <br />
            {titleLines[1]}
          </h1>

          <p className="nt-hero__subtitle">{subtitle}</p>

          <div className="nt-hero__ctaRow">
            <Link className="nt-hero__cta" to={ctaHref}>
              {ctaText}
            </Link>
            <Link className="nt-hero__ctaIcon" to={ctaHref} aria-label={ctaText}>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="nt-hero__visual">
          <div className="nt-hero__circle" aria-hidden="true" />
          <img className="nt-hero__image" src={imageUrl} alt="Business consultant" />
        </div>
      </div>
    </section>
  )
}
