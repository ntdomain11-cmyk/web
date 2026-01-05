import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import PageHeader from '../components/ui/PageHeader'

const DEFAULT_ABOUT = {
  journey: {
    hi: "HI, I'M NIRAJ TRIVEDI",
    tag: "India's MSME Business Coach",
    imageUrl: '/media/about-side-img.webp',
    paragraphsHtml: [
      "That's what people I work with and my team call me. But if you ask me, I was initially a reluctant entrepreneur. But once I realised my calling, which is to help and support MSME business owners, I started enjoying my journey of entrepreneurship.",
      '<strong>My inspiration? My dad!</strong>',
      "I would give all the credit and dedicate the journey to my dad. I can't picture what would've happened if he hadn't torn my job offer letter back in 2006.",
      '<strong>Yes, he did that!</strong>',
    ],
  },
  intro: {
    kicker: 'About NT Consultancy',
    title: 'Clarity. Systems. Execution.',
    text:
      'NT Consultancy is a business growth and consulting practice focused on helping MSMEs build clarity, improve systems, and execute consistently. We work with owners and leadership teams to strengthen strategy, marketing, sales, operations, and people performance.',
    pills: ['Structured Approach', 'Practical Execution', 'Measurable Outcomes'],
    stats: [
      { num: '01', label: 'Diagnose bottlenecks' },
      { num: '02', label: 'Build systems & processes' },
      { num: '03', label: 'Drive execution & reviews' },
      { num: '04', label: 'Scale sustainably' },
    ],
  },
  missionVision: {
    missionTitle: 'Our Mission',
    missionText: 'To empower businesses with clarity, strategy, and structured support—so they operate efficiently and achieve consistent success.',
    visionTitle: 'Our Vision',
    visionText:
      'To become a trusted partner for entrepreneurs by delivering sustainable growth solutions and elevating performance across industries.',
  },
  values: {
    kicker: 'What you can expect',
    title: 'Our Values',
    items: [
      { title: 'Structured Thinking', text: 'We simplify complexity into clear priorities and action plans.' },
      { title: 'People & Process', text: 'We build systems that your team can follow and scale.' },
      { title: 'Accountability', text: 'Regular reviews to ensure implementation and momentum.' },
      { title: 'Outcome Focus', text: 'We track progress using measurable business outcomes.' },
    ],
  },
  process: {
    kicker: 'How we work',
    title: 'A Simple, Repeatable Process',
    steps: [
      { num: '1', title: 'Discovery', text: 'Understand your goals, constraints, and current performance.' },
      { num: '2', title: 'Diagnosis', text: 'Identify bottlenecks in marketing, sales, ops, and people.' },
      { num: '3', title: 'Plan & Systems', text: 'Create a roadmap and build SOPs/processes to support scale.' },
      { num: '4', title: 'Execution & Reviews', text: 'Weekly/bi-weekly reviews to keep teams aligned and accountable.' },
    ],
  },
  cta: {
    title: 'Ready to build structured growth?',
    text: 'Book a consultation and we’ll map out the next steps for your business.',
    buttonLabel: 'Book a Consultation',
    buttonHref: '/book',
  },
}

export default function AboutContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState(DEFAULT_ABOUT)

  const jsonPreview = useMemo(() => JSON.stringify(form, null, 2), [form])

  useEffect(() => {
    let mounted = true

    async function load() {
      setError('')
      setSuccess('')
      try {
        const res = await api.get('/api/content/about')
        const content = res.data?.data?.content || null
        if (!mounted) return
        setForm({ ...DEFAULT_ABOUT, ...(content || {}) })
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data?.error || 'Failed to load about content')
        setForm(DEFAULT_ABOUT)
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
      await api.put('/api/content/about', { content: form })
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
        title="About Content"
        subtitle="Edit content shown on the About page"
        breadcrumbs={[{ label: 'Content' }, { label: 'About' }]}
        right={
          <button type="button" className="nt-btn nt-btn--primary" onClick={onSave} disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        }
      />

      {error ? <div className="nt-alert">{error}</div> : null}
      {success ? <div className="nt-alert nt-alert--success">{success}</div> : null}

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">Journey (Top Section)</div>

        <div className="nt-grid2" style={{ alignItems: 'end' }}>
          <div>
            <div className="nt-label">Heading</div>
            <input className="nt-adminInput" value={form.journey?.hi || ''} onChange={(e) => update(['journey', 'hi'], e.target.value)} />
          </div>
          <div>
            <div className="nt-label">Tag</div>
            <input className="nt-adminInput" value={form.journey?.tag || ''} onChange={(e) => update(['journey', 'tag'], e.target.value)} />
          </div>
        </div>

        <div className="nt-grid2" style={{ alignItems: 'end' }}>
          <div>
            <div className="nt-label">Image URL</div>
            <input className="nt-adminInput" value={form.journey?.imageUrl || ''} onChange={(e) => update(['journey', 'imageUrl'], e.target.value)} />
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
                  if (url) update(['journey', 'imageUrl'], url)
                }}
              />
            </label>
            {form.journey?.imageUrl ? (
              <a className="nt-link" href={form.journey.imageUrl} target="_blank" rel="noreferrer">
                Preview
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <div className="nt-label">Paragraphs (HTML allowed, e.g. &lt;strong&gt;...&lt;/strong&gt;)</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {(form.journey?.paragraphsHtml || []).map((p, idx) => (
              <div key={idx} className="nt-grid2" style={{ alignItems: 'start' }}>
                <textarea
                  className="nt-adminInput"
                  style={{ minHeight: 72 }}
                  value={p || ''}
                  onChange={(e) => {
                    const next = [...(form.journey?.paragraphsHtml || [])]
                    next[idx] = e.target.value
                    update(['journey', 'paragraphsHtml'], next)
                  }}
                />
                <button
                  type="button"
                  className="nt-btn nt-btn--danger"
                  onClick={() => {
                    const next = [...(form.journey?.paragraphsHtml || [])]
                    next.splice(idx, 1)
                    update(['journey', 'paragraphsHtml'], next)
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="nt-btn nt-btn--ghost"
              onClick={() => update(['journey', 'paragraphsHtml'], [...(form.journey?.paragraphsHtml || []), ''])}
            >
              Add Paragraph
            </button>
          </div>
        </div>
      </div>

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">Intro</div>

        <div className="nt-grid2">
          <div>
            <div className="nt-label">Kicker</div>
            <input className="nt-adminInput" value={form.intro?.kicker || ''} onChange={(e) => update(['intro', 'kicker'], e.target.value)} />
          </div>
          <div>
            <div className="nt-label">Title</div>
            <input className="nt-adminInput" value={form.intro?.title || ''} onChange={(e) => update(['intro', 'title'], e.target.value)} />
          </div>
        </div>

        <div>
          <div className="nt-label">Text</div>
          <textarea className="nt-adminInput" style={{ minHeight: 96 }} value={form.intro?.text || ''} onChange={(e) => update(['intro', 'text'], e.target.value)} />
        </div>

        <div>
          <div className="nt-label">Pills</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {(form.intro?.pills || []).map((x, idx) => (
              <div key={idx} className="nt-grid2" style={{ alignItems: 'end' }}>
                <input
                  className="nt-adminInput"
                  value={x || ''}
                  onChange={(e) => {
                    const next = [...(form.intro?.pills || [])]
                    next[idx] = e.target.value
                    update(['intro', 'pills'], next)
                  }}
                />
                <button
                  type="button"
                  className="nt-btn nt-btn--danger"
                  onClick={() => {
                    const next = [...(form.intro?.pills || [])]
                    next.splice(idx, 1)
                    update(['intro', 'pills'], next)
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="nt-btn nt-btn--ghost" onClick={() => update(['intro', 'pills'], [...(form.intro?.pills || []), ''])}>
              Add Pill
            </button>
          </div>
        </div>

        <div>
          <div className="nt-label">Stats</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {(form.intro?.stats || []).map((s, idx) => (
              <div key={idx} className="nt-grid2" style={{ alignItems: 'end' }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div className="nt-label">Number</div>
                  <input
                    className="nt-adminInput"
                    value={s.num || ''}
                    onChange={(e) => {
                      const next = [...(form.intro?.stats || [])]
                      next[idx] = { ...next[idx], num: e.target.value }
                      update(['intro', 'stats'], next)
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div className="nt-label">Label</div>
                  <input
                    className="nt-adminInput"
                    value={s.label || ''}
                    onChange={(e) => {
                      const next = [...(form.intro?.stats || [])]
                      next[idx] = { ...next[idx], label: e.target.value }
                      update(['intro', 'stats'], next)
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="nt-btn nt-btn--danger"
                  onClick={() => {
                    const next = [...(form.intro?.stats || [])]
                    next.splice(idx, 1)
                    update(['intro', 'stats'], next)
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="nt-btn nt-btn--ghost"
              onClick={() => update(['intro', 'stats'], [...(form.intro?.stats || []), { num: '', label: '' }])}
            >
              Add Stat
            </button>
          </div>
        </div>
      </div>

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">Mission & Vision</div>

        <div className="nt-grid2">
          <div>
            <div className="nt-label">Mission Title</div>
            <input className="nt-adminInput" value={form.missionVision?.missionTitle || ''} onChange={(e) => update(['missionVision', 'missionTitle'], e.target.value)} />
          </div>
          <div>
            <div className="nt-label">Vision Title</div>
            <input className="nt-adminInput" value={form.missionVision?.visionTitle || ''} onChange={(e) => update(['missionVision', 'visionTitle'], e.target.value)} />
          </div>
        </div>

        <div className="nt-grid2">
          <div>
            <div className="nt-label">Mission Text</div>
            <textarea className="nt-adminInput" style={{ minHeight: 84 }} value={form.missionVision?.missionText || ''} onChange={(e) => update(['missionVision', 'missionText'], e.target.value)} />
          </div>
          <div>
            <div className="nt-label">Vision Text</div>
            <textarea className="nt-adminInput" style={{ minHeight: 84 }} value={form.missionVision?.visionText || ''} onChange={(e) => update(['missionVision', 'visionText'], e.target.value)} />
          </div>
        </div>
      </div>

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">Values</div>

        <div className="nt-grid2">
          <div>
            <div className="nt-label">Kicker</div>
            <input className="nt-adminInput" value={form.values?.kicker || ''} onChange={(e) => update(['values', 'kicker'], e.target.value)} />
          </div>
          <div>
            <div className="nt-label">Title</div>
            <input className="nt-adminInput" value={form.values?.title || ''} onChange={(e) => update(['values', 'title'], e.target.value)} />
          </div>
        </div>

        <div>
          <div className="nt-label">Items</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {(form.values?.items || []).map((it, idx) => (
              <div key={idx} className="nt-grid2" style={{ alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div className="nt-label">Title</div>
                  <input
                    className="nt-adminInput"
                    value={it.title || ''}
                    onChange={(e) => {
                      const next = [...(form.values?.items || [])]
                      next[idx] = { ...next[idx], title: e.target.value }
                      update(['values', 'items'], next)
                    }}
                  />
                  <div className="nt-label">Text</div>
                  <textarea
                    className="nt-adminInput"
                    style={{ minHeight: 72 }}
                    value={it.text || ''}
                    onChange={(e) => {
                      const next = [...(form.values?.items || [])]
                      next[idx] = { ...next[idx], text: e.target.value }
                      update(['values', 'items'], next)
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="nt-btn nt-btn--danger"
                  onClick={() => {
                    const next = [...(form.values?.items || [])]
                    next.splice(idx, 1)
                    update(['values', 'items'], next)
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="nt-btn nt-btn--ghost"
              onClick={() => update(['values', 'items'], [...(form.values?.items || []), { title: '', text: '' }])}
            >
              Add Value
            </button>
          </div>
        </div>
      </div>

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">Process</div>

        <div className="nt-grid2">
          <div>
            <div className="nt-label">Kicker</div>
            <input className="nt-adminInput" value={form.process?.kicker || ''} onChange={(e) => update(['process', 'kicker'], e.target.value)} />
          </div>
          <div>
            <div className="nt-label">Title</div>
            <input className="nt-adminInput" value={form.process?.title || ''} onChange={(e) => update(['process', 'title'], e.target.value)} />
          </div>
        </div>

        <div>
          <div className="nt-label">Steps</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {(form.process?.steps || []).map((st, idx) => (
              <div key={idx} className="nt-grid2" style={{ alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div className="nt-label">Number</div>
                  <input
                    className="nt-adminInput"
                    value={st.num || ''}
                    onChange={(e) => {
                      const next = [...(form.process?.steps || [])]
                      next[idx] = { ...next[idx], num: e.target.value }
                      update(['process', 'steps'], next)
                    }}
                  />
                  <div className="nt-label">Title</div>
                  <input
                    className="nt-adminInput"
                    value={st.title || ''}
                    onChange={(e) => {
                      const next = [...(form.process?.steps || [])]
                      next[idx] = { ...next[idx], title: e.target.value }
                      update(['process', 'steps'], next)
                    }}
                  />
                  <div className="nt-label">Text</div>
                  <textarea
                    className="nt-adminInput"
                    style={{ minHeight: 72 }}
                    value={st.text || ''}
                    onChange={(e) => {
                      const next = [...(form.process?.steps || [])]
                      next[idx] = { ...next[idx], text: e.target.value }
                      update(['process', 'steps'], next)
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="nt-btn nt-btn--danger"
                  onClick={() => {
                    const next = [...(form.process?.steps || [])]
                    next.splice(idx, 1)
                    update(['process', 'steps'], next)
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="nt-btn nt-btn--ghost"
              onClick={() => update(['process', 'steps'], [...(form.process?.steps || []), { num: '', title: '', text: '' }])}
            >
              Add Step
            </button>
          </div>
        </div>
      </div>

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">CTA</div>

        <div className="nt-grid2">
          <div>
            <div className="nt-label">Title</div>
            <input className="nt-adminInput" value={form.cta?.title || ''} onChange={(e) => update(['cta', 'title'], e.target.value)} />
          </div>
          <div>
            <div className="nt-label">Button Label</div>
            <input className="nt-adminInput" value={form.cta?.buttonLabel || ''} onChange={(e) => update(['cta', 'buttonLabel'], e.target.value)} />
          </div>
        </div>

        <div>
          <div className="nt-label">Text</div>
          <textarea className="nt-adminInput" style={{ minHeight: 84 }} value={form.cta?.text || ''} onChange={(e) => update(['cta', 'text'], e.target.value)} />
        </div>

        <div>
          <div className="nt-label">Button Href</div>
          <input className="nt-adminInput" value={form.cta?.buttonHref || ''} onChange={(e) => update(['cta', 'buttonHref'], e.target.value)} />
        </div>
      </div>

      <details className="nt-adminCard" style={{ padding: 14, border: '1px solid rgba(4, 27, 46, 0.10)' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 800 }}>Advanced: JSON Preview (read-only)</summary>
        <pre style={{ marginTop: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12 }}>{jsonPreview}</pre>
      </details>
    </div>
  )
}
