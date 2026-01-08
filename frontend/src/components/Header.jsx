import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteConfigContext'
import './Header.css'

function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M3 6.75C3 6.33579 3.33579 6 3.75 6H20.25C20.6642 6 21 6.33579 21 6.75C21 7.16421 20.6642 7.5 20.25 7.5H3.75C3.33579 7.5 3 7.16421 3 6.75ZM3 12C3 11.5858 3.33579 11.25 3.75 11.25H20.25C20.6642 11.25 21 11.5858 21 12C21 12.4142 20.6642 12.75 20.25 12.75H3.75C3.33579 12.75 3 12.4142 3 12ZM3.75 16.5C3.33579 16.5 3 16.8358 3 17.25C3 17.6642 3.33579 18 3.75 18H20.25C20.6642 18 21 17.6642 21 17.25C21 16.8358 20.6642 16.5 20.25 16.5H3.75Z"
      />
    </svg>
  )
}

function IconCart(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M7.25 20.25C6.42157 20.25 5.75 19.5784 5.75 18.75C5.75 17.9216 6.42157 17.25 7.25 17.25C8.07843 17.25 8.75 17.9216 8.75 18.75C8.75 19.5784 8.07843 20.25 7.25 20.25ZM17.25 20.25C16.4216 20.25 15.75 19.5784 15.75 18.75C15.75 17.9216 16.4216 17.25 17.25 17.25C18.0784 17.25 18.75 17.9216 18.75 18.75C18.75 19.5784 18.0784 20.25 17.25 20.25ZM6.3 6.75L6.66 8.25H19.35C20.11 8.25 20.69 8.94 20.55 9.69L19.62 14.69C19.51 15.29 18.98 15.75 18.37 15.75H8.02C7.37 15.75 6.81 15.25 6.72 14.61L5.28 4.5H3.75C3.33579 4.5 3 4.16421 3 3.75C3 3.33579 3.33579 3 3.75 3H5.93C6.3 3 6.62 3.27 6.67 3.64L6.98 5.85C6.99 5.9 7.01 5.95 7.02 6H19.7C20.11 6 20.45 6.34 20.45 6.75C20.45 7.16 20.11 7.5 19.7 7.5H6.48L6.3 6.75Z"
      />
    </svg>
  )
}

function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M18.3 5.71C18.69 5.32 18.69 4.69 18.3 4.3C17.91 3.91 17.28 3.91 16.89 4.3L12 9.19L7.11 4.3C6.72 3.91 6.09 3.91 5.7 4.3C5.31 4.69 5.31 5.32 5.7 5.71L10.59 10.6L5.7 15.49C5.31 15.88 5.31 16.51 5.7 16.9C6.09 17.29 6.72 17.29 7.11 16.9L12 12.01L16.89 16.9C17.28 17.29 17.91 17.29 18.3 16.9C18.69 16.51 18.69 15.88 18.3 15.49L13.41 10.6L18.3 5.71Z"
      />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { siteConfig } = useSiteConfig()

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className="nt-header">
      <div className="nt-header__inner">
        <Link className="nt-header__brand" to="/" aria-label={siteConfig?.siteName || 'NT Consultancy'}>
          <img className="nt-header__logo" src={siteConfig?.whiteLogo || '/media/logo.png'} alt={siteConfig?.siteName || 'NT Consultancy'} />
        </Link>

        <nav className="nt-header__nav" aria-label="Primary">
          {NAV_LINKS.slice(0, 6).map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              className={({ isActive }) => (isActive ? 'nt-header__link nt-header__link--active' : 'nt-header__link')}
              end={l.href === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nt-header__actions">

          <Link className="nt-cta" to="/book">
            Book a Consultation
          </Link>
        </div>

        <div className="nt-header__mobileActions">
          <button className="nt-iconBtn" type="button" aria-label="Menu" onClick={() => setIsMenuOpen(true)}>
            <span className="nt-menuCircle">
              <IconMenu />
            </span>
          </button>
        </div>
      </div>

      <div className={isMenuOpen ? 'nt-drawer nt-drawer--open' : 'nt-drawer'} aria-hidden={!isMenuOpen}>
        <button className="nt-drawer__backdrop" type="button" aria-label="Close menu" onClick={() => setIsMenuOpen(false)} />
        <aside className="nt-drawer__panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="nt-drawer__top">
            <button className="nt-drawer__close" type="button" aria-label="Close" onClick={() => setIsMenuOpen(false)}>
              <IconClose />
            </button>
          </div>

          <div className="nt-drawer__links">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.href}
                to={l.href}
                className={({ isActive }) =>
                  isActive ? 'nt-drawer__link nt-drawer__link--active' : 'nt-drawer__link'
                }
                onClick={() => setIsMenuOpen(false)}
                end={l.href === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </aside>
      </div>
    </header>
  )
}
