import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { setAuth } from '../lib/auth'
import { API_BASE_URL } from '../lib/config'
import './login.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [siteConfig, setSiteConfig] = useState(null)

  const from = useMemo(() => location.state?.from || '/admin', [location.state])

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

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/api/users/loginUser', { email, password })
      setAuth({ token: res.data?.token, user: res.data?.user })
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.error || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="nt-adminLogin">
      <div className="nt-adminLogin__card nt-adminCard">
        <div className="nt-adminLogin__head">
          <div className="nt-adminLogin__brand">
            {siteConfig?.logo ? <img className="nt-adminLogin__logo" src={siteConfig.logo} alt={siteConfig.siteName || 'Logo'} /> : null}
            <div>
              {/* <h1 className="nt-adminH1" style={{ margin: 0 }}>Admin Login</h1>
              <p className="nt-adminText" style={{ margin: 0 }}>
                Sign in to manage {siteConfig?.siteName || 'NT Consultancy'} website data.
              </p> */}
            </div>
          </div>
        </div>

        <form className="nt-adminLogin__form" onSubmit={onSubmit}>
          <label className="nt-adminLogin__label">
            <span>Email</span>
            <input
              className="nt-adminInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
            />
          </label>

          <label className="nt-adminLogin__label">
            <span>Password</span>
            <input
              className="nt-adminInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <div className="nt-adminLogin__error">{error}</div> : null}

          <button className="nt-adminBtn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
