import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import PageHeader from '../components/ui/PageHeader'

const DEFAULT_HOME = {
  hero: {
    title: 'Empowering Businesses with Strategy, Structure & Smart Growth',
    desc: 'Strategic consulting for Startups, SMEs, and Enterprises—delivering clarity, efficiency, and long-term success.',
    imageUrl: '/media/hero-side-img.webp',
  },
  who: {
    title: 'WHO AM I, REALLY?',
    pill: "India's MSME Business Coach",
    paragraphs: [
      'For the past 18 years, I’ve been on a mission to help MSME business owners break free from firefighting and build a growth business. I don’t just teach theory. I bring real & tested strategies that have worked for thousands of entrepreneurs across industries and for myself.',
      'With a team of 70+ in-house business coaches, we’ve worked with businesses across 196+ industries and helped MSMEs scale faster with expert-led business coaching, proven frameworks, and handholding.',
    ],
    imageUrl: '/media/about-side-img.webp',
    counts: [
      { value: '7.8L+', label: 'Entrepreneurs Impacted' },
      { value: '36K+', label: 'MSMEs Empowered through\nThe Business P.A.C.E\nProgram' },
      { value: '18+', label: 'Years of transforming\nMSME businesses.' },
    ],
  },
  servicesShowcase: {
    title: 'FIX IT WITH EXPERT BUSINESS COACHING & GROWTH SERVICES',
    cards: [
      {
        title: 'Impactful Training',
        desc: 'My training programs help MSME business owners with proven strategies to scale, boost profits, and build a strong business.',
        iconName: 'BarChart3',
      },
      {
        title: 'Transformational Coaching',
        desc: 'My team of expert business coaches provides personalised coaching, helping you overcome obstacles, refine strategies, and grow your business with clear guidance.',
        iconName: 'Sparkles',
      },
      {
        title: 'Hands-On Consulting',
        desc: 'My master coaches work directly with your team at your company, training them to implement systems and strategies.',
        iconName: 'Users',
      },
    ],
  },
}

export default function HomeContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState(DEFAULT_HOME)

  const jsonPreview = useMemo(() => JSON.stringify(form, null, 2), [form])

  useEffect(() => {
    let mounted = true

    async function load() {
      setError('')
      setSuccess('')
      try {
        const res = await api.get('/api/content/home')
        const content = res.data?.data?.content || null
        if (!mounted) return

        const next = { ...DEFAULT_HOME, ...(content || {}) }

        if (content?.hero?.titleLines && !content?.hero?.title) {
          next.hero = {
            title: String(content.hero.titleLines.filter(Boolean).join(' ')).trim(),
            desc: content.hero.subtitle || content.hero.desc || DEFAULT_HOME.hero.desc,
            imageUrl: content.hero.imageUrl || DEFAULT_HOME.hero.imageUrl,
          }
        }

        if (content?.stats?.items && !content?.who?.counts) {
          next.who = {
            ...(next.who || DEFAULT_HOME.who),
            counts: content.stats.items,
          }
        }

        setForm({
          hero: next.hero,
          who: next.who,
          servicesShowcase: next.servicesShowcase,
        })
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data?.error || 'Failed to load home content')
        setForm(DEFAULT_HOME)
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

  const onSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const slim = {
        hero: form.hero,
        who: form.who,
        servicesShowcase: form.servicesShowcase,
      }

      await api.put('/api/content/home', { content: slim })
      setSuccess('Saved successfully.')
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed.')
    } finally {
      setSaving(false)
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
        title="Home Content"
        subtitle="Edit full Home page content"
        breadcrumbs={[{ label: 'Content' }, { label: 'Home' }]}
        right={
          <button type="button" className="nt-btn nt-btn--primary" onClick={onSave} disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        }
      />

      {error ? <div className="nt-alert">{error}</div> : null}
      {success ? <div className="nt-alert nt-alert--success">{success}</div> : null}

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">Hero</div>

        <div>
          <div className="nt-label">Title</div>
          <input className="nt-adminInput" value={form.hero?.title || ''} onChange={(e) => update(['hero', 'title'], e.target.value)} />
        </div>

        <div>
          <div className="nt-label">Description</div>
          <textarea className="nt-adminInput" style={{ minHeight: 96 }} value={form.hero?.desc || ''} onChange={(e) => update(['hero', 'desc'], e.target.value)} />
        </div>

        <div className="nt-grid2">
          <div>
            <div className="nt-label">Hero Image URL</div>
            <input className="nt-adminInput" value={form.hero?.imageUrl || ''} onChange={(e) => update(['hero', 'imageUrl'], e.target.value)} />
          </div>
          <div className="nt-inlineActions" style={{ alignItems: 'end' }}>
            <label className="nt-btn nt-btn--ghost nt-btn--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span>{uploading ? 'Uploading…' : 'Upload Hero Image'}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                disabled={uploading}
                onChange={async (e) => {
                  const url = await uploadAsset(e.target.files?.[0], 'content')
                  if (url) update(['hero', 'imageUrl'], url)
                }}
              />
            </label>
            {form.hero?.imageUrl ? (
              <a className="nt-link" href={form.hero.imageUrl} target="_blank" rel="noreferrer">
                Preview
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">Who Am I</div>

        <div className="nt-grid2">
          <div>
            <div className="nt-label">Title</div>
            <input className="nt-adminInput" value={form.who?.title || ''} onChange={(e) => update(['who', 'title'], e.target.value)} />
          </div>
          <div>
            <div className="nt-label">Tag Text</div>
            <input className="nt-adminInput" value={form.who?.pill || ''} onChange={(e) => update(['who', 'pill'], e.target.value)} />
          </div>
        </div>

        <div>
          <div className="nt-label">Paragraphs</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {(form.who?.paragraphs || []).map((p, idx) => (
              <div key={idx} style={{ display: 'grid', gap: 10 }}>
                <textarea
                  className="nt-adminInput"
                  style={{ minHeight: 72 }}
                  value={p}
                  onChange={(e) => {
                    const next = [...(form.who?.paragraphs || [])]
                    next[idx] = e.target.value
                    update(['who', 'paragraphs'], next)
                  }}
                />
                <div className="nt-inlineActions">
                  <button
                    type="button"
                    className="nt-btn nt-btn--danger nt-btn--sm"
                    onClick={() => {
                      const next = [...(form.who?.paragraphs || [])]
                      next.splice(idx, 1)
                      update(['who', 'paragraphs'], next)
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="nt-btn nt-btn--ghost nt-btn--add"
              onClick={() => update(['who', 'paragraphs'], [...(form.who?.paragraphs || []), ''])}
            >
              Add Paragraph
            </button>
          </div>
        </div>

        <div className="nt-grid2">
          <div>
            <div className="nt-label">Image URL</div>
            <input className="nt-adminInput" value={form.who?.imageUrl || ''} onChange={(e) => update(['who', 'imageUrl'], e.target.value)} />
          </div>
          <div className="nt-inlineActions" style={{ alignItems: 'end' }}>
            <label className="nt-btn nt-btn--ghost nt-btn--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span>{uploading ? 'Uploading…' : 'Upload Who Image'}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                disabled={uploading}
                onChange={async (e) => {
                  const url = await uploadAsset(e.target.files?.[0], 'content')
                  if (url) update(['who', 'imageUrl'], url)
                }}
              />
            </label>
            {form.who?.imageUrl ? (
              <a className="nt-link" href={form.who.imageUrl} target="_blank" rel="noreferrer">
                Preview
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <div className="nt-label">Counts (these show in the stats strip on Home)</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {(form.who?.counts || []).map((it, idx) => (
              <div key={idx} className="nt-grid2" style={{ alignItems: 'end' }}>
                <div>
                  <div className="nt-label">Value</div>
                  <input
                    className="nt-adminInput"
                    value={it.value || ''}
                    onChange={(e) => {
                      const next = [...(form.who?.counts || [])]
                      next[idx] = { ...next[idx], value: e.target.value }
                      update(['who', 'counts'], next)
                    }}
                  />
                </div>
                <div>
                  <div className="nt-label">Label (new lines supported)</div>
                  <textarea
                    className="nt-adminInput"
                    style={{ minHeight: 56 }}
                    value={it.label || ''}
                    onChange={(e) => {
                      const next = [...(form.who?.counts || [])]
                      next[idx] = { ...next[idx], label: e.target.value }
                      update(['who', 'counts'], next)
                    }}
                  />
                </div>
                <div className="nt-inlineActions">
                  <button
                    type="button"
                    className="nt-btn nt-btn--danger nt-btn--sm"
                    onClick={() => {
                      const next = [...(form.who?.counts || [])]
                      next.splice(idx, 1)
                      update(['who', 'counts'], next)
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="nt-btn nt-btn--ghost nt-btn--add"
              onClick={() => update(['who', 'counts'], [...(form.who?.counts || []), { value: '', label: '' }])}
            >
              Add Count
            </button>
          </div>
        </div>
      </div>

      <div className="nt-editorSection">
        <div className="nt-editorSection__title">Services Showcase</div>

        <div>
          <div className="nt-label">Section Title</div>
          <input className="nt-adminInput" value={form.servicesShowcase?.title || ''} onChange={(e) => update(['servicesShowcase', 'title'], e.target.value)} />
        </div>

        <div>
          <div className="nt-label">Cards</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {(form.servicesShowcase?.cards || []).map((c, idx) => (
              <div key={idx} className="nt-grid2" style={{ alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div className="nt-label">Title</div>
                  <input
                    className="nt-adminInput"
                    value={c.title || ''}
                    onChange={(e) => {
                      const next = [...(form.servicesShowcase?.cards || [])]
                      next[idx] = { ...next[idx], title: e.target.value }
                      update(['servicesShowcase', 'cards'], next)
                    }}
                  />
                  <div className="nt-label">Icon Name</div>
                  <select
                    className="nt-adminInput"
                    value={c.iconName || 'BarChart3'}
                    onChange={(e) => {
                      const next = [...(form.servicesShowcase?.cards || [])]
                      next[idx] = { ...next[idx], iconName: e.target.value }
                      update(['servicesShowcase', 'cards'], next)
                    }}
                  >
                    <option value="BarChart3">BarChart3</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Users">Users</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div className="nt-label">Description</div>
                  <textarea
                    className="nt-adminInput"
                    style={{ minHeight: 96 }}
                    value={c.desc || ''}
                    onChange={(e) => {
                      const next = [...(form.servicesShowcase?.cards || [])]
                      next[idx] = { ...next[idx], desc: e.target.value }
                      update(['servicesShowcase', 'cards'], next)
                    }}
                  />
                  <button
                    type="button"
                    className="nt-btn nt-btn--danger nt-btn--sm"
                    onClick={() => {
                      const next = [...(form.servicesShowcase?.cards || [])]
                      next.splice(idx, 1)
                      update(['servicesShowcase', 'cards'], next)
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="nt-btn nt-btn--ghost nt-btn--add"
              onClick={() =>
                update(['servicesShowcase', 'cards'], [...(form.servicesShowcase?.cards || []), { title: '', desc: '', iconName: 'BarChart3' }])
              }
            >
              Add Card
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
