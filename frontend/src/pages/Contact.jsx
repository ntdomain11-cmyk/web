import { useEffect, useMemo, useState } from 'react'
import { Facebook, Instagram, Linkedin, Mail, Send, User, Youtube } from 'lucide-react'
import { useSiteConfig } from '../context/SiteConfigContext'
import { apiPost } from '../lib/api'
import './Contact.css'

const MAP_EMBED_URL =
  'https://www.google.com/maps?q=Amreli%2C%20Gujarat%2C%20India&output=embed'

function validate(values) {
  const next = {}

  if (!values.name.trim()) next.name = 'Name is required'
  else if (values.name.trim().length < 2) next.name = 'Please enter a valid name'

  if (!values.email.trim()) next.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Please enter a valid email'

  if (!values.message.trim()) next.message = 'Message is required'
  else if (values.message.trim().length < 10) next.message = 'Message should be at least 10 characters'

  return next
}

function ThankYouModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="nt-modal" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="nt-modal__card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="nt-modal__title">Thank you!</div>
        <p className="nt-modal__text">Your message has been submitted. We’ll get back to you soon.</p>
        <button className="nt-modal__btn" type="button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  )
}

export default function Contact() {
  const { siteConfig } = useSiteConfig()

  const contactEmail = siteConfig?.email || 'neerajtrivedibusiness@gmail.com'

  const socials = useMemo(
    () => [
      { Icon: Instagram, label: 'Instagram', href: siteConfig?.instagramURL || 'https://instagram.com' },
      { Icon: Facebook, label: 'Facebook', href: siteConfig?.facebookURL || 'https://facebook.com' },
      { Icon: Youtube, label: 'YouTube', href: siteConfig?.youtubeURL || 'https://youtube.com' },
      { Icon: Linkedin, label: 'LinkedIn', href: siteConfig?.linkedInURL || 'https://linkedin.com' },
    ],
    [siteConfig],
  )

  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState({ name: false, email: false, message: false })
  const [errors, setErrors] = useState({})
  const [showThanks, setShowThanks] = useState(false)
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    setErrors(validate(values))
  }, [values])

  const onChange = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))
  const onBlur = (key) => () => setTouched((t) => ({ ...t, [key]: true }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (busy) return
    const nextTouched = { name: true, email: true, message: true }
    setTouched(nextTouched)

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitError('')
    setBusy(true)
    try {
      await apiPost('/api/leads/contact', {
        name: values.name,
        email: values.email,
        message: values.message,
      })

      setShowThanks(true)
      setValues({ name: '', email: '', message: '' })
      setTouched({ name: false, email: false, message: false })
    } catch (err) {
      setSubmitError(err?.message || 'Failed to submit message')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="nt-contact">
        <div className="nt-contact__container">
          <div className="nt-contact__grid">
            <div className="nt-contact__left">
              <div className="nt-contact__bg" aria-hidden="true">
                <img className="nt-contact__ellipse nt-contact__ellipse--a" src="/media/Ellipse.svg" alt="" />
                <img className="nt-contact__ellipse nt-contact__ellipse--b" src="/media/Ellipse-sm.svg" alt="" />
              </div>

              <h1 className="nt-contact__title">WE’RE JUST A MESSAGE AWAY.</h1>
              <p className="nt-contact__subtitle">Have a question? We’re here to help.</p>
              <p className="nt-contact__text">
                Our support team is available Monday to Friday, 10:00 AM to 4:00 PM IST.
                <br />
                Just send us a message — we’ll get back to you soon!
              </p>

              <div className="nt-contact__line" aria-hidden="true" />

              <div className="nt-contact__mailRow">
                <div className="nt-contact__mailIcon" aria-hidden="true">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="nt-contact__mailLabel">Write email</div>
                  <a className="nt-contact__mail" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="nt-contact__socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    className="nt-contact__social"
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <s.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="nt-contact__formCard">
              <form onSubmit={onSubmit} noValidate>
                {submitError ? <div className="nt-contact__error" style={{ marginBottom: 10 }}>{submitError}</div> : null}
                <div className="nt-contact__field">
                  <label className="nt-contact__label" htmlFor="ntContactName">Name</label>
                  <div className="nt-contact__control">
                    <span className="nt-contact__icon" aria-hidden="true">
                      <User size={16} />
                    </span>
                    <input
                      id="ntContactName"
                      className="nt-contact__input"
                      placeholder="Name"
                      value={values.name}
                      onChange={onChange('name')}
                      onBlur={onBlur('name')}
                    />
                  </div>
                  {touched.name && errors.name ? <div className="nt-contact__error">{errors.name}</div> : null}
                </div>

                <div className="nt-contact__field">
                  <label className="nt-contact__label" htmlFor="ntContactEmail">Email</label>
                  <div className="nt-contact__control">
                    <span className="nt-contact__icon" aria-hidden="true">
                      <Mail size={16} />
                    </span>
                    <input
                      id="ntContactEmail"
                      className="nt-contact__input"
                      placeholder="Email"
                      value={values.email}
                      onChange={onChange('email')}
                      onBlur={onBlur('email')}
                    />
                  </div>
                  {touched.email && errors.email ? <div className="nt-contact__error">{errors.email}</div> : null}
                </div>

                <div className="nt-contact__field">
                  <label className="nt-contact__label" htmlFor="ntContactMessage">Message</label>
                  <div className="nt-contact__control">
                    <span className="nt-contact__icon" aria-hidden="true">
                      <Send size={16} />
                    </span>
                    <textarea
                      id="ntContactMessage"
                      className="nt-contact__textarea"
                      placeholder="Message"
                      value={values.message}
                      onChange={onChange('message')}
                      onBlur={onBlur('message')}
                    />
                  </div>
                  {touched.message && errors.message ? <div className="nt-contact__error">{errors.message}</div> : null}
                </div>

                <button className="nt-contact__submit" type="submit" disabled={busy} style={busy ? { opacity: 0.8, cursor: 'not-allowed' } : null}>
                  {busy ? 'SENDING…' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="nt-locate">
        <div className="nt-contact__container">
          <div className="nt-locate__bar">
            <span className="nt-locate__mark" aria-hidden="true" />
            <h2 className="nt-locate__title">LOCATE US</h2>
          </div>

          <div className="nt-locate__mapWrap">
            <iframe
              className="nt-locate__iframe"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="NT Consultancy Location"
            />
          </div>
        </div>
      </section>

      {showThanks ? <ThankYouModal onClose={() => setShowThanks(false)} /> : null}
    </>
  )
}
