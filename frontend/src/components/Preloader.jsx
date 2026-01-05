import { useEffect } from 'react'
import { useSiteConfig } from '../context/SiteConfigContext'

export default function Preloader({ hidden }) {
  const { siteConfig } = useSiteConfig()

  useEffect(() => {
    if (hidden) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [hidden])

  return (
    <div className={hidden ? 'nt-preloader nt-preloader--hidden' : 'nt-preloader'} aria-hidden={hidden}>
      <div className="nt-preloader__inner">
        {/* <div className="nt-preloader__ring" aria-hidden="true" /> */}
        <img
          className="nt-preloader__logo"
          src={siteConfig?.whiteLogo || siteConfig?.logo || '/media/logo.png'}
          alt={siteConfig?.siteName || 'NT Consultancy'}
        />
        {/* <div className="nt-preloader__subtitle">Loading…</div> */}
      </div>
    </div>
  )
}