import { useEffect, useMemo, useRef, useState } from 'react'
import api from '../lib/api'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'

function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if ((el.innerHTML || '') !== (value || '')) {
      el.innerHTML = value || ''
    }
  }, [value])

  const exec = (cmd, arg) => {
    try {
      document.execCommand(cmd, false, arg)
      const html = ref.current?.innerHTML || ''
      onChange?.(html)
    } catch {
      // ignore
    }
  }

  const onInput = () => {
    const html = ref.current?.innerHTML || ''
    onChange?.(html)
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div className="nt-inlineActions" style={{ flexWrap: 'wrap' }}>
        <button type="button" className="nt-btn nt-btn--ghost nt-btn--sm" onClick={() => exec('bold')}>
          Bold
        </button>
        <button type="button" className="nt-btn nt-btn--ghost nt-btn--sm" onClick={() => exec('italic')}>
          Italic
        </button>
        <button type="button" className="nt-btn nt-btn--ghost nt-btn--sm" onClick={() => exec('underline')}>
          Underline
        </button>
        <button type="button" className="nt-btn nt-btn--ghost nt-btn--sm" onClick={() => exec('insertUnorderedList')}>
          Bullets
        </button>
        <button type="button" className="nt-btn nt-btn--ghost nt-btn--sm" onClick={() => exec('insertOrderedList')}>
          Numbered
        </button>
        <button
          type="button"
          className="nt-btn nt-btn--ghost nt-btn--sm"
          onClick={() => {
            const url = window.prompt('Enter link URL')
            if (!url) return
            exec('createLink', url)
          }}
        >
          Link
        </button>
        <button type="button" className="nt-btn nt-btn--ghost nt-btn--sm" onClick={() => exec('removeFormat')}>
          Clear
        </button>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        style={{
          minHeight: 260,
          padding: 12,
          borderRadius: 12,
          border: '1px solid rgba(4,27,46,0.16)',
          background: '#fff',
          outline: 'none',
          lineHeight: 1.6,
          overflow: 'auto',
        }}
        data-placeholder={placeholder || ''}
      />
      {!value ? <div style={{ marginTop: -44, paddingLeft: 12, color: 'rgba(4,27,46,0.45)', pointerEvents: 'none' }}>{placeholder}</div> : null}
    </div>
  )
}

const emptyForm = {
  id: null,
  title: '',
  slug: '',
  iconKey: '',
  short: '',
  bullets: [],
  outcomes: [],
  contentHtml: '',
}

function toLines(arr) {
  return (arr || []).filter(Boolean).join('\n')
}

function fromLines(text) {
  return String(text || '')
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean)
}

export default function Services() {
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteRow, setDeleteRow] = useState(null)

  const columns = useMemo(
    () => [
      { key: 'sr', label: 'Sr No.' },
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'action', label: 'Action' },
    ],
    [],
  )

  const load = async ({ nextPage, nextSearch, nextPageSize } = {}) => {
    const p = nextPage ?? page
    const s = nextSearch ?? search
    const l = nextPageSize ?? pageSize

    setError('')
    setLoading(true)

    try {
      const res = await api.get('/api/services/getAllServicesByPage', {
        params: { limit: l, page: p, searchtxt: s },
      })

      setRows(res.data?.data || [])
      setTotalPages(res.data?.totalPages || 1)
      setTotalCount(res.data?.totalCount || 0)
      setPage(Number(res.data?.currentPage || p))
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.msg || 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load({ nextPage: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (s) => {
    setForm({
      id: s.id,
      title: s.title || '',
      slug: s.slug || '',
      iconKey: s.iconKey || '',
      short: s.short || '',
      bullets: Array.isArray(s.bullets) ? s.bullets : [],
      outcomes: Array.isArray(s.outcomes) ? s.outcomes : [],
      contentHtml: s.contentHtml || '',
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    if (busy) return
    setModalOpen(false)
  }

  const onFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submitForm = async () => {
    setError('')
    setBusy(true)

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        iconKey: form.iconKey,
        short: form.short,
        bullets: form.bullets,
        outcomes: form.outcomes,
        contentHtml: form.contentHtml,
      }

      if (form.id) {
        await api.put(`/api/services/updateService/${form.id}`, payload)
      } else {
        await api.post('/api/services/createService', payload)
      }

      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const askDelete = (s) => {
    setDeleteRow(s)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteRow) return
    setError('')
    setBusy(true)

    try {
      await api.delete(`/api/services/deleteService/${deleteRow.id}`)
      setDeleteOpen(false)
      setDeleteRow(null)
      await load()
    } catch (err) {
      setError(err?.response?.data?.error || 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const modalFooter = (
    <div className="nt-btnRow">
      <button type="button" className="nt-btn nt-btn--ghost" onClick={closeModal} disabled={busy}>
        Cancel
      </button>
      <button type="button" className="nt-btn nt-btn--primary" onClick={submitForm} disabled={busy}>
        {busy ? 'Saving…' : form.id ? 'Update' : 'Create'}
      </button>
    </div>
  )

  return (
    <div className="nt-adminCard" style={{ padding: 16 }}>
      <PageHeader
        title="Services"
        subtitle="Create and manage services (list + detail pages)"
        breadcrumbs={[{ label: 'Content' }, { label: 'Services' }]}
        right={
          <button type="button" className="nt-btn nt-btn--primary" onClick={openCreate}>
            + Create
          </button>
        }
      />

      {error ? <div className="nt-alert">{error}</div> : null}

      <div className="nt-toolbar">
        <div className="nt-search">
          <input
            className="nt-adminInput"
            placeholder="Search by title/slug"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <button
            type="button"
            className="nt-btn nt-btn--ghost"
            onClick={() => {
              setPage(1)
              load({ nextPage: 1, nextSearch: search })
            }}
            disabled={loading}
          >
            Search
          </button>
        </div>

        <div className="nt-search">
          <select
            className="nt-select"
            value={pageSize}
            onChange={(e) => {
              const next = Number(e.target.value)
              setPageSize(next)
              setPage(1)
              load({ nextPage: 1, nextPageSize: next })
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <div style={{ fontSize: 12, color: 'rgba(4,27,46,0.55)' }}>Total: {totalCount}</div>
        </div>
      </div>

      <div className="nt-tableWrap">
        <table className="nt-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 14 }}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 14 }}>
                  No services found
                </td>
              </tr>
            ) : (
              rows.map((s, idx) => (
                <tr key={s.id}>
                  <td>{(page - 1) * pageSize + (idx + 1)}</td>
                  <td style={{ fontWeight: 700 }}>{s.title}</td>
                  <td>{s.slug}</td>
                  <td>
                    <div className="nt-btnRow" style={{ justifyContent: 'center' }}>
                      <button type="button" className="nt-btn nt-btn--ghost" onClick={() => openEdit(s)} disabled={busy}>
                        Edit
                      </button>
                      <button type="button" className="nt-btn nt-btn--danger" onClick={() => askDelete(s)} disabled={busy}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p)
          load({ nextPage: p })
        }}
      />

      <Modal
        open={modalOpen}
        title={form.id ? 'Update Service' : 'Create Service'}
        onClose={closeModal}
        footer={modalFooter}
        cardStyle={{ width: 'min(1200px, 96vw)' }}
        bodyStyle={{ maxHeight: '72vh', overflowY: 'auto' }}
      >
        <div className="nt-formGrid">
          <label className="nt-field nt-field--full">
            <span>Title</span>
            <input className="nt-adminInput" value={form.title} onChange={(e) => onFormChange('title', e.target.value)} />
          </label>

          <label className="nt-field nt-field--full">
            <span>Slug (URL part)</span>
            <input className="nt-adminInput" value={form.slug} onChange={(e) => onFormChange('slug', e.target.value)} placeholder="e.g. business-strategy-operations" />
          </label>

          <label className="nt-field nt-field--full">
            <span>Icon Key</span>
            <input className="nt-adminInput" value={form.iconKey} onChange={(e) => onFormChange('iconKey', e.target.value)} placeholder="e.g. sales-marketing-pr" />
          </label>

          <label className="nt-field nt-field--full">
            <span>Short Description</span>
            <textarea className="nt-adminInput" style={{ minHeight: 84 }} value={form.short} onChange={(e) => onFormChange('short', e.target.value)} />
          </label>

          <label className="nt-field nt-field--full">
            <span>What we cover (one per line)</span>
            <textarea
              className="nt-adminInput"
              style={{ minHeight: 96 }}
              value={toLines(form.bullets)}
              onChange={(e) => onFormChange('bullets', fromLines(e.target.value))}
            />
          </label>

          <label className="nt-field nt-field--full">
            <span>Outcomes (one per line)</span>
            <textarea
              className="nt-adminInput"
              style={{ minHeight: 96 }}
              value={toLines(form.outcomes)}
              onChange={(e) => onFormChange('outcomes', fromLines(e.target.value))}
            />
          </label>

          <div className="nt-field nt-field--full">
            <span style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Content (Detail Page)</span>
            <RichTextEditor value={form.contentHtml} onChange={(html) => onFormChange('contentHtml', html)} placeholder="Write service details here…" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete service"
        message={`Are you sure you want to delete “${deleteRow?.title || ''}”? This action cannot be undone.`}
        confirmText="Delete"
        tone="danger"
        loading={busy}
        onConfirm={confirmDelete}
        onClose={() => {
          if (busy) return
          setDeleteOpen(false)
          setDeleteRow(null)
        }}
      />
    </div>
  )
}
