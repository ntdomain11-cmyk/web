import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiGet } from '../lib/api'

const SiteConfigContext = createContext({
  siteConfig: null,
  loading: true,
})

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

export function formatIndianPhone(value, { withPrefix = true } = {}) {
  const digits = onlyDigits(value)
  const last10 = digits.length > 10 ? digits.slice(-10) : digits
  if (!last10) return ''
  return withPrefix ? `+91${last10}` : last10
}

export function SiteConfigProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await apiGet('/api/siteconfig/getSiteconfig')
        if (!mounted) return
        setSiteConfig(res?.data?.[0] || null)
      } catch {
        if (!mounted) return
        setSiteConfig(null)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const value = useMemo(() => ({ siteConfig, loading }), [siteConfig, loading])

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}
