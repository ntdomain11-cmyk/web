import { useEffect, useState } from 'react'
import api from '../lib/api'
import PageHeader from '../components/ui/PageHeader'

export default function SiteConfig() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [item, setItem] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await api.get('/api/siteconfig/getSiteconfig')
        const first = res.data?.data?.[0] || null
        if (!mounted) return
        setItem(first)
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data?.msg || 'Failed to load site config')
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

  const onChange = (key, value) => {
    setItem((prev) => ({ ...(prev || {}), [key]: value }))
  }

  const uploadAsset = async (file, dirName) => {
    if (!file) return null

    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('dirName', dirName)

      const res = await api.post('/api/file/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data?.file?.url || null
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'File upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }

  const onSave = async () => {
    if (!item?.id) return
    setError('')
    setSaving(true)

    try {
      await api.put(`/api/siteconfig/updateSiteconfig/${item.id}`, item)
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.msg || 'Failed to save site config')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="nt-adminCard" style={{ padding: 16 }}>
        Loading…
      </div>
    )
  }

  if (!item) {
    return (
      <div className="nt-adminCard" style={{ padding: 16 }}>
        <div style={{ fontWeight: 800 }}>Site Config</div>
        <p className="nt-adminText">No site config row found in database.</p>
      </div>
    )
  }

  return (
    <div className="nt-adminCard" style={{ padding: 16, display: 'grid', gap: 12 }}>
      <PageHeader
        title="Site Config"
        subtitle="Update branding, theme, social links and contact details"
        breadcrumbs={[{ label: 'Administrator' }, { label: 'Site Config' }]}
        right={
          <button type="button" className="nt-btn nt-btn--primary" onClick={onSave} disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        }
      />

      {error ? <div className="nt-alert">{error}</div> : null}

      <div className="nt-adminCard" style={{ padding: 14, display: 'grid', gap: 10, boxShadow: 'none' }}>
        <div style={{ fontWeight: 900 }}>Branding</div>
        <div className="nt-formGrid">
          <label className="nt-field">
            <span>Site Name</span>
            <input className="nt-adminInput" value={item.siteName || ''} onChange={(e) => onChange('siteName', e.target.value)} />
          </label>

          <label className="nt-field">
            <span>Client URL</span>
            <input className="nt-adminInput" value={item.clientUrl || ''} onChange={(e) => onChange('clientUrl', e.target.value)} />
          </label>

          <label className="nt-field">
            <span>Theme</span>
            <input className="nt-adminInput" value={item.theme || ''} onChange={(e) => onChange('theme', e.target.value)} placeholder="#041b2e" />
          </label>

          <div className="nt-field">
            <span>Logo (Light)</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const url = await uploadAsset(e.target.files?.[0], 'siteconfig')
                if (url) onChange('logo', url)
              }}
              disabled={uploading}
            />
            {item.logo ? (
              <a href={item.logo} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'rgba(4,27,46,0.65)' }}>
                View uploaded logo
              </a>
            ) : null}
          </div>

          <div className="nt-field">
            <span>Dark Logo (White Logo)</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const url = await uploadAsset(e.target.files?.[0], 'siteconfig')
                if (url) onChange('whiteLogo', url)
              }}
              disabled={uploading}
            />
            {item.whiteLogo ? (
              <a href={item.whiteLogo} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'rgba(4,27,46,0.65)' }}>
                View uploaded dark logo
              </a>
            ) : null}
          </div>

          <div className="nt-field">
            <span>Favicon (Icon)</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const url = await uploadAsset(e.target.files?.[0], 'siteconfig')
                if (url) onChange('icon', url)
              }}
              disabled={uploading}
            />
            {item.icon ? (
              <a href={item.icon} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'rgba(4,27,46,0.65)' }}>
                View uploaded favicon
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="nt-adminCard" style={{ padding: 14, display: 'grid', gap: 10, boxShadow: 'none' }}>
        <div style={{ fontWeight: 900 }}>Contact</div>
        <div className="nt-formGrid">
          <label className="nt-field">
            <span>Email</span>
            <input className="nt-adminInput" value={item.email || ''} onChange={(e) => onChange('email', e.target.value)} />
          </label>

          <label className="nt-field">
            <span>Mobile</span>
            <input className="nt-adminInput" value={item.mobile || ''} onChange={(e) => onChange('mobile', e.target.value)} />
          </label>
        </div>
      </div>

      <div className="nt-adminCard" style={{ padding: 14, display: 'grid', gap: 10, boxShadow: 'none' }}>
        <div style={{ fontWeight: 900 }}>Social Links</div>
        <div className="nt-formGrid">
          <label className="nt-field">
            <span>Instagram URL</span>
            <input className="nt-adminInput" value={item.instagramURL || ''} onChange={(e) => onChange('instagramURL', e.target.value)} />
          </label>

          <label className="nt-field">
            <span>Facebook URL</span>
            <input className="nt-adminInput" value={item.facebookURL || ''} onChange={(e) => onChange('facebookURL', e.target.value)} />
          </label>

          <label className="nt-field">
            <span>Twitter / X URL</span>
            <input className="nt-adminInput" value={item.twitterURL || ''} onChange={(e) => onChange('twitterURL', e.target.value)} />
          </label>

          <label className="nt-field">
            <span>LinkedIn URL</span>
            <input className="nt-adminInput" value={item.linkedInURL || ''} onChange={(e) => onChange('linkedInURL', e.target.value)} />
          </label>

          <label className="nt-field nt-field--full">
            <span>YouTube URL</span>
            <input className="nt-adminInput" value={item.youtubeURL || ''} onChange={(e) => onChange('youtubeURL', e.target.value)} />
          </label>
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'rgba(4,27,46,0.55)' }}>Row ID: {item.id}</div>
    </div>
  )
}
