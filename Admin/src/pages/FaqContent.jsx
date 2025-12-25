import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import PageHeader from '../components/ui/PageHeader'

const DEFAULT_FAQ = {
  title: 'FAQs',
  items: [
    {
      q: 'What does NT Consultancy help with?',
      a: 'We help business owners build clarity and momentum across strategy, marketing, sales, operations, and team execution—so growth becomes predictable, not random.',
    },
  ],
}

export default function FaqContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState(DEFAULT_FAQ)

  const jsonPreview = useMemo(() => JSON.stringify(form, null, 2), [form])

  useEffect(() => {
    let mounted = true

    async function load() {
      setError('')
      setSuccess('')
      try {
        const res = await api.get('/api/content/faq')
        const content = res.data?.data?.content || null
        if (!mounted) return
        setForm({ ...DEFAULT_FAQ, ...(content || {}) })
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data?.error || 'Failed to load FAQ content')
        setForm(DEFAULT_FAQ)
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

  const onSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await api.put('/api/content/faq', { content: form })
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
        title="FAQ Content"
        subtitle="Edit the FAQ list shown across the website"
        breadcrumbs={[{ label: 'Content' }, { label: 'FAQ' }]}
        right={
          <button type="button" className="nt-btn nt-btn--primary" onClick={onSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        }
      />

      {error ? <div className="nt-alert">{error}</div> : null}
      {success ? <div className="nt-alert nt-alert--success">{success}</div> : null}

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">FAQ Section</div>

        <div>
          <div className="nt-label">Title</div>
          <input className="nt-adminInput" value={form.title || ''} onChange={(e) => update(['title'], e.target.value)} />
        </div>

        <div>
          <div className="nt-label">Questions</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {(form.items || []).map((it, idx) => (
              <div key={idx} className="nt-grid2" style={{ alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div className="nt-label">Question</div>
                  <textarea
                    className="nt-adminInput"
                    style={{ minHeight: 72 }}
                    value={it.q || ''}
                    onChange={(e) => {
                      const next = [...(form.items || [])]
                      next[idx] = { ...next[idx], q: e.target.value }
                      update(['items'], next)
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div className="nt-label">Answer</div>
                  <textarea
                    className="nt-adminInput"
                    style={{ minHeight: 72 }}
                    value={it.a || ''}
                    onChange={(e) => {
                      const next = [...(form.items || [])]
                      next[idx] = { ...next[idx], a: e.target.value }
                      update(['items'], next)
                    }}
                  />
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
              </div>
            ))}

            <button
              type="button"
              className="nt-btn nt-btn--ghost"
              onClick={() => update(['items'], [...(form.items || []), { q: '', a: '' }])}
            >
              Add FAQ
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
