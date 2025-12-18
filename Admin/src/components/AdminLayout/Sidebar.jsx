import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FileText, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react'
import { clearAuth } from '../../lib/auth'
import api from '../../lib/api'
import './sidebar.css'

export default function Sidebar() {
  const navigate = useNavigate()
  const [siteConfig, setSiteConfig] = useState(null)

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

  const onLogout = () => {
    clearAuth()
    navigate('/admin/login')
  }

  return (
    <aside className="nt-adminSidebar">
      <div className="nt-adminSidebar__brand">
        {siteConfig?.whiteLogo ? (
          <img className="nt-adminSidebar__logoImg" src={siteConfig.whiteLogo} alt={siteConfig.siteName || 'Logo'} />
        ) : (
          <div className="nt-adminSidebar__logo" aria-hidden="true"></div>
        )}
      </div>

      <nav className="nt-adminSidebar__nav">
        <NavLink className="nt-adminSidebar__link" to="/admin" end>
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/users">
          <Users size={16} />
          <span>Users</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/services">
          <FileText size={16} />
          <span>Services</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/leads/contact">
          <FileText size={16} />
          <span>Contact Leads</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/leads/book">
          <FileText size={16} />
          <span>Book Leads</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/site-config">
          <Settings size={16} />
          <span>Site Config</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/content/home">
          <FileText size={16} />
          <span>Home Content</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/content/about">
          <FileText size={16} />
          <span>About Content</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/content/faq">
          <FileText size={16} />
          <span>FAQ Content</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/content/testimonials">
          <FileText size={16} />
          <span>Testimonials</span>
        </NavLink>
        <NavLink className="nt-adminSidebar__link" to="/admin/content/blogs">
          <FileText size={16} />
          <span>Blogs</span>
        </NavLink>
      </nav>

      <div className="nt-adminSidebar__footer">
        <button type="button" className="nt-adminSidebar__logout" onClick={onLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
