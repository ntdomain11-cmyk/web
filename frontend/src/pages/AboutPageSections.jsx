import { ArrowRight, CheckCircle2, ClipboardList, Target, TrendingUp, Users2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import './AboutPageSections.css'

export default function AboutPageSections({ content }) {
  const intro = content?.intro || null
  const missionVision = content?.missionVision || null
  const values = content?.values || null
  const process = content?.process || null
  const cta = content?.cta || null

  const introPills = intro?.pills || ['Structured Approach', 'Practical Execution', 'Measurable Outcomes']
  const introStats = intro?.stats || [
    { num: '01', label: 'Diagnose bottlenecks' },
    { num: '02', label: 'Build systems & processes' },
    { num: '03', label: 'Drive execution & reviews' },
    { num: '04', label: 'Scale sustainably' },
  ]

  const valuesItems = values?.items || [
    { title: 'Structured Thinking', text: 'We simplify complexity into clear priorities and action plans.' },
    { title: 'People & Process', text: 'We build systems that your team can follow and scale.' },
    { title: 'Accountability', text: 'Regular reviews to ensure implementation and momentum.' },
    { title: 'Outcome Focus', text: 'We track progress using measurable business outcomes.' },
  ]

  const processSteps = process?.steps || [
    { num: '1', title: 'Discovery', text: 'Understand your goals, constraints, and current performance.' },
    { num: '2', title: 'Diagnosis', text: 'Identify bottlenecks in marketing, sales, ops, and people.' },
    { num: '3', title: 'Plan & Systems', text: 'Create a roadmap and build SOPs/processes to support scale.' },
    { num: '4', title: 'Execution & Reviews', text: 'Weekly/bi-weekly reviews to keep teams aligned and accountable.' },
  ]

  const valueIcons = [ClipboardList, Users2, Target, TrendingUp]

  return (
    <div className="nt-aboutPage">
      <section className="nt-aboutPage__section nt-aboutPage__intro">
        <div className="nt-aboutPage__container">
          <div className="nt-aboutPage__introGrid">
            <div>
              <div className="nt-aboutPage__kicker">{intro?.kicker || 'About NT Consultancy'}</div>
              <h1 className="nt-aboutPage__title">{intro?.title || 'Clarity. Systems. Execution.'}</h1>
              <p className="nt-aboutPage__text">{intro?.text ||
                'NT Consultancy is a business growth and consulting practice focused on helping MSMEs build clarity, improve systems, and execute consistently. We work with owners and leadership teams to strengthen strategy, marketing, sales, operations, and people performance.'}
              </p>

              <div className="nt-aboutPage__pillRow">
                {introPills.map((p, idx) => (
                  <div key={idx} className="nt-aboutPage__pill">
                    <CheckCircle2 size={16} /> {p}
                  </div>
                ))}
              </div>
            </div>

            <div className="nt-aboutPage__introCard">
              {introStats.map((s, idx) => (
                <div key={idx} className="nt-aboutPage__stat">
                  <div className="nt-aboutPage__statNum">{s.num}</div>
                  <div className="nt-aboutPage__statLabel">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="nt-aboutPage__section nt-aboutPage__mv">
        <div className="nt-aboutPage__container">
          <div className="nt-aboutPage__two">
            <div className="nt-aboutPage__mvCard">
              <div className="nt-aboutPage__mvIcon" aria-hidden="true">
                <Target size={18} />
              </div>
              <div className="nt-aboutPage__mvTitle">{missionVision?.missionTitle || 'Our Mission'}</div>
              <p className="nt-aboutPage__mvText">{missionVision?.missionText ||
                'To empower businesses with clarity, strategy, and structured support—so they operate efficiently and achieve consistent success.'}
              </p>
            </div>

            <div className="nt-aboutPage__mvCard">
              <div className="nt-aboutPage__mvIcon" aria-hidden="true">
                <TrendingUp size={18} />
              </div>
              <div className="nt-aboutPage__mvTitle">{missionVision?.visionTitle || 'Our Vision'}</div>
              <p className="nt-aboutPage__mvText">{missionVision?.visionText ||
                'To become a trusted partner for entrepreneurs by delivering sustainable growth solutions and elevating performance across industries.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="nt-aboutPage__section nt-aboutPage__values">
        <div className="nt-aboutPage__container">
          <div className="nt-aboutPage__sectionHead">
            <div className="nt-aboutPage__kicker">{values?.kicker || 'What you can expect'}</div>
            <div className="nt-aboutPage__h2">{values?.title || 'Our Values'}</div>
          </div>

          <div className="nt-aboutPage__cards">
            {valuesItems.map((it, idx) => {
              const Icon = valueIcons[idx] || ClipboardList
              return (
                <div key={idx} className="nt-aboutPage__valueCard">
                  <div className="nt-aboutPage__valueIcon" aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <div className="nt-aboutPage__valueTitle">{it.title}</div>
                  <div className="nt-aboutPage__valueText">{it.text}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="nt-aboutPage__section nt-aboutPage__process">
        <div className="nt-aboutPage__container">
          <div className="nt-aboutPage__sectionHead">
            <div className="nt-aboutPage__kicker">{process?.kicker || 'How we work'}</div>
            <div className="nt-aboutPage__h2">{process?.title || 'A Simple, Repeatable Process'}</div>
          </div>

          <div className="nt-aboutPage__steps">
            {processSteps.map((st, idx) => (
              <div key={idx} className="nt-aboutPage__step">
                <div className="nt-aboutPage__stepNum">{st.num}</div>
                <div>
                  <div className="nt-aboutPage__stepTitle">{st.title}</div>
                  <div className="nt-aboutPage__stepText">{st.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nt-aboutPage__section nt-aboutPage__cta">
        <div className="nt-aboutPage__container">
          <div className="nt-aboutPage__ctaCard">
            <div className="nt-aboutPage__ctaLeft">
              <div className="nt-aboutPage__ctaTitle">{cta?.title || 'Ready to build structured growth?'}</div>
              <div className="nt-aboutPage__ctaText">{cta?.text || 'Book a consultation and we’ll map out the next steps for your business.'}</div>
            </div>
            <Link className="nt-aboutPage__ctaBtn" to={cta?.buttonHref || '/book'}>
              {cta?.buttonLabel || 'Book a Consultation'} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
