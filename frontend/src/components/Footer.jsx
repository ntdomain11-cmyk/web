import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Facebook, Instagram, Linkedin, Send, Twitter, Youtube } from 'lucide-react'
import { SERVICES } from '../data/services'
import { apiGet } from '../lib/api'
import { useSiteConfig } from '../context/SiteConfigContext'
import './Footer.css'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [services, setServices] = useState([])
  const { siteConfig } = useSiteConfig()

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await apiGet('/api/services/getAllServices')
        if (!mounted) return
        setServices(res?.data || [])
      } catch {
        if (!mounted) return
        setServices([])
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const socials = useMemo(() => {
    const list = [
      { icon: Instagram, label: 'Instagram', href: siteConfig?.instagramURL || 'https://instagram.com' },
      { icon: Facebook, label: 'Facebook', href: siteConfig?.facebookURL || 'https://facebook.com' },
      { icon: Youtube, label: 'YouTube', href: siteConfig?.youtubeURL || 'https://youtube.com' },
      { icon: Twitter, label: 'X', href: siteConfig?.twitterURL || 'https://x.com' },
      { icon: Linkedin, label: 'LinkedIn', href: siteConfig?.linkedInURL || 'https://linkedin.com' },
    ]

    return list.filter((s) => Boolean(s.href))
  }, [siteConfig])

  const footerServices = useMemo(() => {
    const list = services && services.length ? services : SERVICES
    return list.slice(0, 4)
  }, [services])

  const onBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <footer className="nt-footer">
      {/* <div className="nt-footer__topBar">
        <div className="nt-footer__topInner">
          <div>
            <div className="nt-footer__topTitle">The P.A.C.E Program</div>
            <div className="nt-footer__topSub">Let’s scale your business with the right systems!</div>
          </div>
          <Link className="nt-footer__register" to="/book">
            REGISTER NOW
          </Link>
        </div>
      </div> */}

      <div className="nt-footer__yellowBar">
        <div className="nt-footer__yellowInner">
          <img className="nt-footer__logo" src={siteConfig?.logo || '/media/black-logo.png'} alt={siteConfig?.siteName || 'NT Consultancy'} />

          <div className="nt-footer__socials">
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  className="nt-footer__social"
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>

        </div>
      </div>

      <div className="nt-footer__main">
        <div className="nt-footer__bg" aria-hidden="true">
          <img className="nt-footer__ellipse nt-footer__ellipse--a" src="/media/Ellipse.svg" alt="" />
          <img className="nt-footer__ellipse nt-footer__ellipse--b" src="/media/Ellipse-sm.svg" alt="" />
        </div>

        <div className="nt-footer__container">
          <div className="nt-footer__headerRow">
            <div className="nt-footer__entity">
              NT Consultancy is an entity of NT Consultancy
            </div>

            <button className="nt-footer__back" type="button" onClick={onBackToTop}>
              <span>Back to top</span>
              <span className="nt-footer__backIcon" aria-hidden="true">
                <ArrowUp size={16} />
              </span>
            </button>
          </div>

          <div className="nt-footer__grid">
            <div className="nt-footer__col">
              <div className="nt-footer__colTitle">Company</div>
              <Link className="nt-footer__link" to="/">Home</Link>
              <Link className="nt-footer__link" to="/about">About Us</Link>
              <Link className="nt-footer__link" to="/testimonials">Testimonials</Link>
              <Link className="nt-footer__link" to="/contact">Contact Us</Link>
            </div>

            <div className="nt-footer__col">
              <div className="nt-footer__colTitle">Services</div>
              <Link className="nt-footer__link" to="/services">All Services</Link>
              {footerServices.map((s) => (
                <Link key={s.slug} className="nt-footer__link" to={`/services/${s.slug}`}>
                  {s.title}
                </Link>
              ))}
            </div>

            <div className="nt-footer__col">
              <div className="nt-footer__colTitle">Resources</div>
              <Link className="nt-footer__link" to="/blogs">Blogs</Link>
              <Link className="nt-footer__link" to="/book">Book a Consultation</Link>
              <Link className="nt-footer__link" to="/faq">FAQs</Link>
              <Link className="nt-footer__link" to="/sitemap">Sitemap</Link>
            </div>

            <div className="nt-footer__col">
              <div className="nt-footer__colTitle">Legal</div>
              <Link className="nt-footer__link" to="/terms-condition">Terms &amp; Conditions</Link>
              <Link className="nt-footer__link" to="/privacy-policy">Privacy Policy</Link>
            </div>

            <div className="nt-footer__newsletter">
              <div className="nt-footer__newsTitle">Subscribe to our newsletter</div>
              <div className="nt-footer__newsSub">Be the first to receive any new updates</div>

              <form className="nt-footer__form" onSubmit={onSubmit}>
                <span className="nt-footer__mail" aria-hidden="true">
                  <Send size={16} />
                </span>
                <input
                  className="nt-footer__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  type="email"
                />
                <button className="nt-footer__submit" type="submit" aria-label="Submit">
                  <span className="nt-footer__submitIcon" aria-hidden="true">→</span>
                </button>
              </form>
            </div>
          </div>

          <div className="nt-footer__divider" aria-hidden="true" />
          <div className="nt-footer__copy">© NT Consultancy. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
