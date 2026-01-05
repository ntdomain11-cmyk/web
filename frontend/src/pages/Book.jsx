import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, CheckCircle2, ClipboardList, Clock, FileText, Flag, PhoneCall, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { formatIndianPhone, useSiteConfig } from '../context/SiteConfigContext'
import './Book.css'

function ThanksModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="nt-book__modalOverlay" role="dialog" aria-modal="true">
      <div className="nt-book__modal">
        <h3 className="nt-book__modalTitle">Request received — we’ll confirm your slot shortly</h3>
        <p className="nt-book__modalText">
          Thanks for booking a consultation with NT Consultancy. We’ll reach out on your preferred contact method to confirm the
          time and share the meeting link.
        </p>
        <div className="nt-book__modalActions">
          <button type="button" className="nt-primaryBtn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Book() {
  const { siteConfig } = useSiteConfig()
  const supportPhone = useMemo(() => formatIndianPhone(siteConfig?.mobile, { withPrefix: true }), [siteConfig])
  const supportEmail = siteConfig?.email || 'info@ntconsultancy.com'
  const benefits = useMemo(
    () => [
      {
        Icon: Target,
        title: 'A clear action plan for next 7–30 days',
        text: 'We turn your challenges into a simple roadmap with priorities, owners and next steps you can execute immediately.',
      },
      {
        Icon: FileText,
        title: 'Expert review of your current strategy',
        text: 'We’ll quickly assess gaps in operations, marketing, HR and finance to highlight what’s holding growth back.',
      },
      {
        Icon: ShieldCheck,
        title: 'Confidential and practical guidance',
        text: 'Your discussion stays private. Advice is business-ready—no generic theory, only what fits your stage and budget.',
      },
    ],
    [],
  )

  const packages = useMemo(
    () => [
      {
        badge: 'Starter Call',
        price: '30 min',
        hint: 'Best if you want direction and clarity fast.',
        bullets: [
          'Problem diagnosis + quick wins',
          'Priority list (what to fix first)',
          'Recommended service path',
          'Next-step plan to move forward',
        ],
      },
      {
        badge: 'Deep Dive Session',
        price: '60–90 min',
        hint: 'Best for complex issues & structured planning.',
        bullets: [
          'Detailed business review (people, process, numbers)',
          'Custom action roadmap + KPIs',
          'Implementation suggestions & timelines',
          'Follow-up summary (key points + next actions)',
        ],
        featured: true,
      },
    ],
    [],
  )

  const [showThanks, setShowThanks] = useState(false)

  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    service: 'Business Strategy',
    time: 'Next 24 hours',
    notes: '',
  })
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})

  const validate = (v) => {
    const next = {}
    if (!v.name.trim()) next.name = 'Please enter your name.'
    if (!v.phone.trim()) next.phone = 'Please enter your phone number.'
    if (!v.email.trim()) next.email = 'Please enter your email.'
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) next.email = 'Please enter a valid email address.'
    if (!v.company.trim()) next.company = 'Please enter your company/business name.'
    if (!v.notes.trim()) next.notes = 'Please tell us what you want to discuss so we can prepare.'
    return next
  }

  useEffect(() => {
    setErrors(validate(values))
  }, [values])

  const setField = (key, val) => setValues((prev) => ({ ...prev, [key]: val }))
  const blur = (key) => setTouched((p) => ({ ...p, [key]: true }))
  const showError = (key) => touched[key] && errors[key]

  const onSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setTouched({ name: true, phone: true, email: true, company: true, notes: true })
    if (Object.keys(nextErrors).length) return

    setShowThanks(true)
    setValues({ name: '', phone: '', email: '', company: '', service: 'Business Strategy', time: 'Next 24 hours', notes: '' })
    setTouched({})
  }

  return (
    <div className="nt-book nt-container">
      <section className="nt-book__hero">
        <div className="nt-book__heroGrid">
          <div>
            <div className="nt-book__kicker">
              <Sparkles size={16} />
              Book a 1:1 Consultation with NT Consultancy
            </div>
            <h1 className="nt-book__title">Get clarity. Build a plan. Grow with confidence.</h1>
            <p className="nt-book__subtitle">
              If you’re stuck with slow growth, messy operations, hiring issues or unclear marketing—this call will give you a
              focused strategy and practical next steps.
            </p>

            <div className="nt-book__ctaRow">
              <a className="nt-primaryBtn" href="#booking">
                Book Your Slot
              </a>
              <Link className="nt-book__secondaryBtn" to="/services">
                Explore Services
              </Link>
              <a className="nt-book__secondaryBtn" href={supportPhone ? `tel:${supportPhone}` : 'tel:+919999999999'}>
                <PhoneCall size={16} />
                Call Now
              </a>
            </div>

            <div className="nt-book__trust">
              <div className="nt-book__trustCard">
                <p className="nt-book__trustValue">30–90 min</p>
                <p className="nt-book__trustLabel">Structured call with clear outcomes</p>
              </div>
              <div className="nt-book__trustCard">
                <p className="nt-book__trustValue">Roadmap</p>
                <p className="nt-book__trustLabel">Action plan + priority list</p>
              </div>
              <div className="nt-book__trustCard">
                <p className="nt-book__trustValue">100% private</p>
                <p className="nt-book__trustLabel">Confidential discussion</p>
              </div>
            </div>

            <div className="nt-book__heroFill">
              <div className="nt-book__miniCard">
                <div className="nt-book__miniHead">
                  <div className="nt-book__miniIcon">
                    <Flag size={18} />
                  </div>
                  <div>
                    <p className="nt-book__miniTitle">Who this is for</p>
                    <p className="nt-book__miniText">
                      Founders & teams who want faster growth, clearer strategy, and systems that run without daily chaos.
                    </p>
                  </div>
                </div>
                <ul className="nt-book__miniList">
                  <li>Sales/marketing not giving consistent results</li>
                  <li>Team performance & accountability issues</li>
                  <li>Operations are messy, work feels unplanned</li>
                </ul>
              </div>

              <div className="nt-book__miniCard">
                <div className="nt-book__miniHead">
                  <div className="nt-book__miniIcon">
                    <ClipboardList size={18} />
                  </div>
                  <div>
                    <p className="nt-book__miniTitle">What we’ll cover</p>
                    <p className="nt-book__miniText">A short, high-impact review of what matters most for your stage.</p>
                  </div>
                </div>
                <div className="nt-book__pills">
                  <span className="nt-book__pill">Goals & priorities</span>
                  <span className="nt-book__pill">Bottlenecks</span>
                  <span className="nt-book__pill">Marketing & sales</span>
                  <span className="nt-book__pill">People & roles</span>
                  <span className="nt-book__pill">Process</span>
                  <span className="nt-book__pill">Next steps</span>
                </div>
              </div>

              <div className="nt-book__miniCard">
                <div className="nt-book__miniHead">
                  <div className="nt-book__miniIcon">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="nt-book__miniTitle">You leave with</p>
                    <p className="nt-book__miniText">Not just advice—clear deliverables you can execute.</p>
                  </div>
                </div>
                <ul className="nt-book__miniList">
                  <li>Priority plan for the next 7–30 days</li>
                  <li>Recommended strategy + service direction</li>
                  <li>KPIs to track progress</li>
                </ul>
              </div>
            </div>
          </div>

          <div id="booking" className="nt-book__formCard">
            <h2 className="nt-book__formTitle">Request a booking</h2>
            <p className="nt-book__formHint">Fill this form—our team will confirm time & meeting link.</p>

            <form className="nt-form" onSubmit={onSubmit} noValidate>
              <div className="nt-book__formGrid2">
                <label className="nt-book__label">
                  Full Name
                  <input
                    className="nt-book__input"
                    value={values.name}
                    onChange={(e) => setField('name', e.target.value)}
                    onBlur={() => blur('name')}
                    placeholder="Your name"
                  />
                  {showError('name') && <p className="nt-book__error">{errors.name}</p>}
                </label>

                <label className="nt-book__label">
                  Phone
                  <input
                    className="nt-book__input"
                    value={values.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    onBlur={() => blur('phone')}
                    placeholder="Your phone number"
                  />
                  {showError('phone') && <p className="nt-book__error">{errors.phone}</p>}
                </label>
              </div>

              <label className="nt-book__label">
                Email
                <input
                  className="nt-book__input"
                  value={values.email}
                  onChange={(e) => setField('email', e.target.value)}
                  onBlur={() => blur('email')}
                  placeholder="you@example.com"
                />
                {showError('email') && <p className="nt-book__error">{errors.email}</p>}
              </label>

              <label className="nt-book__label">
                Company / Business
                <input
                  className="nt-book__input"
                  value={values.company}
                  onChange={(e) => setField('company', e.target.value)}
                  onBlur={() => blur('company')}
                  placeholder="Business name"
                />
                {showError('company') && <p className="nt-book__error">{errors.company}</p>}
              </label>

              <div className="nt-book__formGrid2">
                <label className="nt-book__label">
                  Topic
                  <select
                    className="nt-book__select"
                    value={values.service}
                    onChange={(e) => setField('service', e.target.value)}
                    onBlur={() => blur('service')}
                  >
                    <option>Business Strategy</option>
                    <option>Operations & Process</option>
                    <option>HR & Hiring</option>
                    <option>Marketing & Sales</option>
                    <option>Financial Planning</option>
                  </select>
                </label>

                <label className="nt-book__label">
                  Preferred time
                  <select
                    className="nt-book__select"
                    value={values.time}
                    onChange={(e) => setField('time', e.target.value)}
                    onBlur={() => blur('time')}
                  >
                    <option>Next 24 hours</option>
                    <option>2–3 days</option>
                    <option>This week</option>
                    <option>Next week</option>
                  </select>
                </label>
              </div>

              <label className="nt-book__label">
                What do you want to achieve?
                <textarea
                  className="nt-book__textarea"
                  value={values.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  onBlur={() => blur('notes')}
                  placeholder="Example: We want to increase sales, fix team performance, improve processes..."
                />
                {showError('notes') && <p className="nt-book__error">{errors.notes}</p>}
              </label>

              <button type="submit" className="nt-primaryBtn">
                <CalendarDays size={16} style={{ marginRight: 8 }} />
                Submit Booking Request
              </button>
              <p className="nt-book__note">
                By submitting, you agree we may contact you about scheduling. No spam—only consultation-related communication.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="nt-book__section">
        <h2 className="nt-book__sectionTitle">What you’ll get from the consultation</h2>
        <p className="nt-book__sectionLead">
          This is designed to give you clarity and confidence. You’ll leave with a direction, priorities and an actionable plan.
        </p>

        <div className="nt-book__cards3">
          {benefits.map((b) => (
            <div className="nt-book__card" key={b.title}>
              <div className="nt-book__cardHeader">
                <div className="nt-book__icon">
                  <b.Icon size={18} />
                </div>
                <div>
                  <p className="nt-book__cardTitle">{b.title}</p>
                  <p className="nt-book__cardText">{b.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="nt-book__section">
        <h2 className="nt-book__sectionTitle">How it works</h2>
        <p className="nt-book__sectionLead">A simple 3-step process so you know exactly what happens next.</p>

        <div className="nt-book__cards3">
          <div className="nt-book__card">
            <div className="nt-book__cardHeader">
              <div className="nt-book__icon">
                <FileText size={18} />
              </div>
              <div>
                <p className="nt-book__cardTitle">1) Share your challenge</p>
                <p className="nt-book__cardText">
                  Fill the form with your goal and pain points. We’ll prepare the right questions before the call.
                </p>
              </div>
            </div>
          </div>
          <div className="nt-book__card">
            <div className="nt-book__cardHeader">
              <div className="nt-book__icon">
                <Clock size={18} />
              </div>
              <div>
                <p className="nt-book__cardTitle">2) Structured consultation</p>
                <p className="nt-book__cardText">
                  We diagnose the root cause, set priorities, and design a strategy that matches your resources and timeline.
                </p>
              </div>
            </div>
          </div>
          <div className="nt-book__card">
            <div className="nt-book__cardHeader">
              <div className="nt-book__icon">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="nt-book__cardTitle">3) Clear next steps</p>
                <p className="nt-book__cardText">
                  You’ll get an action plan and recommended support options (if needed) to execute confidently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nt-book__section">
        <h2 className="nt-book__sectionTitle">Consultation options</h2>
        <p className="nt-book__sectionLead">
          Choose what fits your need. If you’re unsure, submit the request—our team will recommend the best option.
        </p>

        <div className="nt-book__packages">
          {packages.map((p) => (
            <div className={`nt-book__package${p.featured ? ' nt-book__package--featured' : ''}`} key={p.badge}>
              <div className="nt-book__packageHeader">
                <div className="nt-book__packageMeta">
                  <div className="nt-book__badge">{p.badge}</div>
                  <p className="nt-book__priceHint">{p.hint}</p>
                </div>
                <div className="nt-book__packageDuration">
                  <p className="nt-book__price">{p.price}</p>
                  <p className="nt-book__durationLabel">Duration</p>
                </div>
              </div>
              <ul className="nt-book__packageList">
                {p.bullets.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="nt-book__ctaRow" style={{ marginTop: 12 }}>
                <a className="nt-primaryBtn" href="#booking">
                  Book This
                </a>
                <Link className="nt-book__secondaryBtn" to="/contact">
                  Ask a question
                </Link>
              </div>
            </div>
          ))}

          <div className="nt-book__package nt-book__package--assist">
            <div className="nt-book__packageHeader">
              <div className="nt-book__packageMeta">
                <div className="nt-book__badge">Not sure what you need?</div>
                <p className="nt-book__priceHint">
                  Share your goal and we’ll recommend the right service and session type for your business stage.
                </p>
              </div>
              <div className="nt-book__packageDuration">
                <p className="nt-book__price">We’ll guide you</p>
                <p className="nt-book__durationLabel">Recommendation</p>
              </div>
            </div>
            <ul className="nt-book__packageList">
              <li>Quick assessment call</li>
              <li>Recommended roadmap & priority plan</li>
              <li>Clear implementation approach</li>
            </ul>
            <div className="nt-book__ctaRow" style={{ marginTop: 12 }}>
              <a className="nt-primaryBtn" href="#booking">
                Submit Request
              </a>
              <a className="nt-book__secondaryBtn" href={`mailto:${supportEmail}`}>
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>

      <ThanksModal open={showThanks} onClose={() => setShowThanks(false)} />
    </div>
  )
}
