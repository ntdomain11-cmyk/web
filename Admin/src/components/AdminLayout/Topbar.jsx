import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../lib/api'
import { getUser } from '../../lib/auth'
import './topbar.css'

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/users': 'Users',
  '/admin/site-config': 'Site Config',
  '/admin/content/home': 'Home Content',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const user = useMemo(() => getUser(), [])
  const [siteConfig, setSiteConfig] = useState(null)

  const title = TITLES[pathname] || 'Admin'

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await api.get('/api/siteconfig/getSiteconfig')
        if (!mounted) return
        setSiteConfig(res.data?.data?.[0] || null)
      } catch {
        if (!mounted) return
        setSiteConfig(null)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <header className="nt-adminTopbar">
      <div className="nt-adminTopbar__brand">
        <div>
          <div className="nt-adminTopbar__title">{title}</div>
          <div className="nt-adminTopbar__sub">Manage your website from one place</div>
        </div>
      </div>

      <div className="nt-adminTopbar__user">
        <div className="nt-adminTopbar__avatar" aria-hidden="true">
          {(user?.name || 'A').slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="nt-adminTopbar__name">{user?.name || 'Administrator'}</div>
          <div className="nt-adminTopbar__email">{user?.email || 'admin@ntconsultancy.com'}</div>
        </div>
      </div>
    </header>
  )
}
