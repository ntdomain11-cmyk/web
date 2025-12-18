import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { getServiceBySlug, SERVICES } from '../data/services'
import { apiGet } from '../lib/api'
import './ServiceDetail.css'

export default function ServiceDetail() {
  const { slug } = useParams()
  const [remote, setRemote] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let mounted = true

    async function load() {
      setNotFound(false)
      try {
        const res = await apiGet(`/api/services/getServiceBySlug/${slug}`)
        if (!mounted) return
        setRemote(res?.data || null)
        setNotFound(false)
      } catch {
        if (!mounted) return
        setRemote(null)
        setNotFound(true)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [slug])

  const service = useMemo(() => remote || getServiceBySlug(slug), [remote, slug])

  if (!service && notFound) {
    return (
      <div className="nt-serviceDetail nt-serviceDetail--notFound">
        <div className="nt-serviceDetail__container">
          <div className="nt-serviceDetail__notFoundCard">
            <div className="nt-serviceDetail__notFoundTitle">Service not found</div>
            <Link className="nt-serviceDetail__backLink" to="/services">
              <ArrowLeft size={18} /> Back to Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!service && !notFound) return null

  const idx = SERVICES.findIndex((s) => s.slug === service.slug)
  const next = idx >= 0 ? SERVICES[(idx + 1) % SERVICES.length] : null

  return (
    <div className="nt-serviceDetail">
      <section className="nt-serviceDetail__hero">
        <div className="nt-serviceDetail__container">
          <Link className="nt-serviceDetail__backLink" to="/services">
            <ArrowLeft size={18} /> Back to Services
          </Link>

          <div className="nt-serviceDetail__heroGrid">
            <div>
              <div className="nt-serviceDetail__kicker">Service</div>
              <h1 className="nt-serviceDetail__title">{service.title}</h1>
              <p className="nt-serviceDetail__text">{service.short}</p>

              <div className="nt-serviceDetail__heroCtas">
                <Link className="nt-serviceDetail__ctaPrimary" to="/book">
                  Book a Consultation <ArrowRight size={18} />
                </Link>
                <Link className="nt-serviceDetail__ctaGhost" to="/contact">
                  Ask a Question
                </Link>
              </div>
            </div>

            <div className="nt-serviceDetail__heroCard">
              <div className="nt-serviceDetail__heroCardTitle">What we cover</div>
              <ul className="nt-serviceDetail__heroList">
                {service.bullets.map((b) => (
                  <li key={b} className="nt-serviceDetail__heroItem">
                    <span className="nt-serviceDetail__tick" aria-hidden="true">
                      <CheckCircle2 size={16} />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="nt-serviceDetail__section">
        <div className="nt-serviceDetail__container">
          <div className="nt-serviceDetail__sectionHead">
            <div className="nt-serviceDetail__kicker">Results</div>
            <div className="nt-serviceDetail__h2">Outcomes you can expect</div>
          </div>

          <div className="nt-serviceDetail__outcomes">
            {(service.outcomes || []).map((o) => (
              <div key={o} className="nt-serviceDetail__outcome">
                <span className="nt-serviceDetail__outcomeIcon" aria-hidden="true">
                  <CheckCircle2 size={18} />
                </span>
                <span className="nt-serviceDetail__outcomeText">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {service.contentHtml ? (
        <section className="nt-serviceDetail__section">
          <div className="nt-serviceDetail__container">
            <div
              style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.9, fontSize: 15 }}
              dangerouslySetInnerHTML={{ __html: service.contentHtml }}
            />
          </div>
        </section>
      ) : null}

      <section className="nt-serviceDetail__cta">
        <div className="nt-serviceDetail__container">
          <div className="nt-serviceDetail__ctaCard">
            <div>
              <div className="nt-serviceDetail__ctaTitle">Want a tailored plan for your business?</div>
              <div className="nt-serviceDetail__ctaText">Share your goal and we’ll recommend the right steps.</div>
            </div>
            <Link className="nt-serviceDetail__ctaBtn" to="/contact">
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>

          {next ? (
            <Link className="nt-serviceDetail__next" to={`/services/${next.slug}`}>
              Next service: {next.title} <ArrowRight size={18} />
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  )
}
