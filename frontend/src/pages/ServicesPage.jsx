import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, Building2, LineChart, Users2 } from 'lucide-react'
import { SERVICES } from '../data/services'
import { apiGet } from '../lib/api'
import './ServicesPage.css'

const ICONS = {
  'business-strategy-operations': BriefcaseBusiness,
  'sales-marketing-pr': LineChart,
  'human-resource-services': Users2,
  'business-astrology-vastu': Building2,
}

export default function ServicesPage() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await apiGet('/api/services/getAllServices')
        if (!mounted) return
        setRows(res?.data || [])
      } catch {
        if (!mounted) return
        setRows([])
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const list = useMemo(() => (rows && rows.length ? rows : SERVICES), [rows])

  return (
    <div className="nt-services">
      <section className="nt-services__hero">
        <div className="nt-services__container">
          <div className="nt-services__heroGrid">
            <div>
              <div className="nt-services__kicker">Our Services</div>
              <h1 className="nt-services__title">Solutions Built for MSME Growth</h1>
              <p className="nt-services__text">
                We help you build clarity, strengthen systems, and execute consistently across strategy, marketing, sales,
                operations, and people. Choose a service to explore details and outcomes.
              </p>

              <div className="nt-services__heroCtas">
                <Link className="nt-services__ctaPrimary" to="/book">
                  Book a Consultation <ArrowRight size={18} />
                </Link>
                <Link className="nt-services__ctaGhost" to="/contact">
                  Talk to Us
                </Link>
              </div>
            </div>

            <div className="nt-services__heroCard">
              <div className="nt-services__heroCardTitle">What you get</div>
              <div className="nt-services__heroPoints">
                <div className="nt-services__heroPoint">Structured roadmap & priorities</div>
                <div className="nt-services__heroPoint">Execution support & reviews</div>
                <div className="nt-services__heroPoint">Systems that scale with your team</div>
                <div className="nt-services__heroPoint">Measurable outcomes and clarity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nt-services__section">
        <div className="nt-services__container">
          <div className="nt-services__sectionHead">
            <div className="nt-services__kicker">Explore</div>
            <div className="nt-services__h2">Services We Offer</div>
          </div>

          <div className="nt-services__grid">
            {list.map((s) => {
              const key = s.iconKey || s.slug
              const Icon = ICONS[key] || BriefcaseBusiness
              return (
                <article key={s.slug} className="nt-services__card">
                  <div className="nt-services__cardIcon" aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <div className="nt-services__cardTitle">{s.title}</div>
                  <div className="nt-services__cardText">{s.short}</div>

                  <ul className="nt-services__bullets">
                    {(s.bullets || []).slice(0, 4).map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  <Link className="nt-services__cardBtn" to={`/services/${s.slug}`}>
                    Know More <ArrowRight size={16} />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="nt-services__process">
        <div className="nt-services__container">
          <div className="nt-services__sectionHead nt-services__sectionHead--light">
            <div className="nt-services__kicker nt-services__kicker--light">How we work</div>
            <div className="nt-services__h2 nt-services__h2--light">A Simple, Repeatable Process</div>
          </div>

          <div className="nt-services__steps">
            <div className="nt-services__step">
              <div className="nt-services__stepNum">1</div>
              <div>
                <div className="nt-services__stepTitle">Discovery</div>
                <div className="nt-services__stepText">Understand goals, gaps, constraints, and business model.</div>
              </div>
            </div>
            <div className="nt-services__step">
              <div className="nt-services__stepNum">2</div>
              <div>
                <div className="nt-services__stepTitle">Diagnosis</div>
                <div className="nt-services__stepText">Identify bottlenecks in systems, team, marketing, and sales.</div>
              </div>
            </div>
            <div className="nt-services__step">
              <div className="nt-services__stepNum">3</div>
              <div>
                <div className="nt-services__stepTitle">Plan & Systems</div>
                <div className="nt-services__stepText">Build a roadmap, SOPs, and execution rhythm.</div>
              </div>
            </div>
            <div className="nt-services__step">
              <div className="nt-services__stepNum">4</div>
              <div>
                <div className="nt-services__stepTitle">Execution & Reviews</div>
                <div className="nt-services__stepText">Weekly/bi-weekly reviews to keep accountability and momentum.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nt-services__cta">
        <div className="nt-services__container">
          <div className="nt-services__ctaCard">
            <div>
              <div className="nt-services__ctaTitle">Not sure which service fits?</div>
              <div className="nt-services__ctaText">Tell us your goal and we’ll recommend the right plan.</div>
            </div>
            <Link className="nt-services__ctaBtn" to="/contact">
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
