import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import PageHeader from '../components/ui/PageHeader'

const DEFAULT_TESTIMONIALS = {
  title: 'TESTIMONIALS',
  items: [
    {
      imageUrl: '',
      name: 'Sheeba Duleep',
      designation: 'Business Owner',
      content:
        'Bit overwhelmed at the moment, and I hope the business coaches will be able to help me wade through and come out to devise successful strategies for my life and business.',
    },
  ],
}

export default function TestimonialsContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState(DEFAULT_TESTIMONIALS)

  const jsonPreview = useMemo(() => JSON.stringify(form, null, 2), [form])

  useEffect(() => {
    let mounted = true

    async function load() {
      setError('')
      setSuccess('')
      try {
        const res = await api.get('/api/content/testimonials')
        const content = res.data?.data?.content || null
        if (!mounted) return
        setForm({ ...DEFAULT_TESTIMONIALS, ...(content || {}) })
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data?.error || 'Failed to load testimonials')
        setForm(DEFAULT_TESTIMONIALS)
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

  const update = (path, value) => {
    setForm((prev) => {
      const next = { ...prev }
      let ref = next
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i]
        ref[key] = Array.isArray(ref[key]) ? [...ref[key]] : { ...(ref[key] || {}) }
        ref = ref[key]
      }
      ref[path[path.length - 1]] = value
      return next
    })
  }

  const uploadAsset = async (file, dirName) => {
    if (!file) return null

    setError('')
    setSuccess('')
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
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }

  const onSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await api.put('/api/content/testimonials', { content: form })
      setSuccess('Saved successfully.')
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed.')
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

  return (
    <div className="nt-adminCard nt-editorPage">
      <PageHeader
        title="Testimonials"
        subtitle="Manage testimonials shown across the website"
        breadcrumbs={[{ label: 'Content' }, { label: 'Testimonials' }]}
        right={
          <button type="button" className="nt-btn nt-btn--primary" onClick={onSave} disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        }
      />

      {error ? <div className="nt-alert">{error}</div> : null}
      {success ? <div className="nt-alert nt-alert--success">{success}</div> : null}

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">Testimonials Section</div>

        <div>
          <div className="nt-label">Title</div>
          <input className="nt-adminInput" value={form.title || ''} onChange={(e) => update(['title'], e.target.value)} />
        </div>

        <div>
          <div className="nt-label">Testimonials</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {(form.items || []).map((t, idx) => (
              <div
                key={idx}
                style={{ display: 'grid', gap: 10, padding: 12, border: '1px solid rgba(4,27,46,0.10)', borderRadius: 12 }}
              >
                <div className="nt-grid2">
                  <div>
                    <div className="nt-label">Name</div>
                    <input
                      className="nt-adminInput"
                      value={t.name || ''}
                      onChange={(e) => {
                        const next = [...(form.items || [])]
                        next[idx] = { ...next[idx], name: e.target.value }
                        update(['items'], next)
                      }}
                    />
                  </div>
                  <div>
                    <div className="nt-label">Designation</div>
                    <input
                      className="nt-adminInput"
                      value={t.designation || ''}
                      onChange={(e) => {
                        const next = [...(form.items || [])]
                        next[idx] = { ...next[idx], designation: e.target.value }
                        update(['items'], next)
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="nt-label">Content</div>
                  <textarea
                    className="nt-adminInput"
                    style={{ minHeight: 96 }}
                    value={t.content || ''}
                    onChange={(e) => {
                      const next = [...(form.items || [])]
                      next[idx] = { ...next[idx], content: e.target.value }
                      update(['items'], next)
                    }}
                  />
                </div>

                <div className="nt-grid2">
                  <div>
                    <div className="nt-label">Image URL</div>
                    <input
                      className="nt-adminInput"
                      value={t.imageUrl || ''}
                      onChange={(e) => {
                        const next = [...(form.items || [])]
                        next[idx] = { ...next[idx], imageUrl: e.target.value }
                        update(['items'], next)
                      }}
                    />
                  </div>
                  <div className="nt-inlineActions" style={{ alignItems: 'end' }}>
                    <label className="nt-btn nt-btn--ghost nt-btn--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span>{uploading ? 'Uploading…' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={uploading}
                        onChange={async (e) => {
                          const url = await uploadAsset(e.target.files?.[0], 'content')
                          if (!url) return
                          const next = [...(form.items || [])]
                          next[idx] = { ...next[idx], imageUrl: url }
                          update(['items'], next)
                        }}
                      />
                    </label>
                    {t.imageUrl ? (
                      <a className="nt-link" href={t.imageUrl} target="_blank" rel="noreferrer">
                        Preview
                      </a>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  className="nt-btn nt-btn--danger"
                  onClick={() => {
                    const next = [...(form.items || [])]
                    next.splice(idx, 1)
                    update(['items'], next)
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="nt-btn nt-btn--ghost"
              onClick={() => update(['items'], [...(form.items || []), { imageUrl: '', name: '', designation: '', content: '' }])}
            >
              Add Testimonial
            </button>
          </div>
        </div>
      </div>

      <details className="nt-adminCard" style={{ padding: 14, border: '1px solid rgba(4, 27, 46, 0.10)' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 800 }}>Advanced: JSON Preview (read-only)</summary>
        <pre style={{ marginTop: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12 }}>{jsonPreview}</pre>
      </details>
    </div>
  )
}
