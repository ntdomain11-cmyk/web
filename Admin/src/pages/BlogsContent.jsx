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
  imageUrl: '',
  contentHtml: '',
}

export default function BlogsContent() {
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
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
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }

  const columns = useMemo(
    () => [
      { key: 'sr', label: 'Sr No.' },
      { key: 'image', label: 'Image' },
      { key: 'title', label: 'Title' },
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
      const res = await api.get('/api/blogs/getAllBlogsByPage', {
        params: { limit: l, page: p, searchtxt: s },
      })

      setRows(res.data?.data || [])
      setTotalPages(res.data?.totalPages || 1)
      setTotalCount(res.data?.totalCount || 0)
      setPage(Number(res.data?.currentPage || p))
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.msg || 'Failed to load blogs')
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

  const openEdit = (b) => {
    setForm({
      id: b.id,
      title: b.title || '',
      imageUrl: b.imageUrl || '',
      contentHtml: b.contentHtml || '',
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
        imageUrl: form.imageUrl,
        contentHtml: form.contentHtml,
      }

      if (form.id) {
        await api.put(`/api/blogs/updateBlog/${form.id}`, payload)
      } else {
        await api.post('/api/blogs/createBlog', payload)
      }

      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const askDelete = (b) => {
    setDeleteRow(b)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteRow) return
    setError('')
    setBusy(true)
    try {
      await api.delete(`/api/blogs/deleteBlog/${deleteRow.id}`)
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
      <button type="button" className="nt-btn nt-btn--primary" onClick={submitForm} disabled={busy || uploading}>
        {busy ? 'Saving…' : form.id ? 'Update' : 'Create'}
      </button>
    </div>
  )

  return (
    <div className="nt-adminCard" style={{ padding: 16 }}>
      <PageHeader
        title="Blogs"
        subtitle="Create and manage blog posts"
        breadcrumbs={[{ label: 'Content' }, { label: 'Blogs' }]}
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
            placeholder="Search by title"
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
                  No blogs found
                </td>
              </tr>
            ) : (
              rows.map((b, idx) => (
                <tr key={b.id}>
                  <td>{(page - 1) * pageSize + (idx + 1)}</td>
                  <td>
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt=""
                        style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(4,27,46,0.10)' }}
                      />
                    ) : (
                      <div
                        style={{ width: 64, height: 44, borderRadius: 10, background: 'rgba(4,27,46,0.06)', border: '1px solid rgba(4,27,46,0.10)' }}
                      />
                    )}
                  </td>
                  <td style={{ fontWeight: 700 }}>{b.title}</td>
                  <td>
                    <div className="nt-btnRow" style={{ justifyContent: 'center' }}>
                      <button type="button" className="nt-btn nt-btn--ghost" onClick={() => openEdit(b)} disabled={busy}>
                        Edit
                      </button>
                      <button type="button" className="nt-btn nt-btn--danger" onClick={() => askDelete(b)} disabled={busy}>
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
        title={form.id ? 'Update Blog' : 'Create Blog'}
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
            <span>Image URL</span>
            <input className="nt-adminInput" value={form.imageUrl} onChange={(e) => onFormChange('imageUrl', e.target.value)} />
            <div className="nt-inlineActions" style={{ marginTop: 8 }}>
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
                    onFormChange('imageUrl', url)
                  }}
                />
              </label>
              {form.imageUrl ? (
                <a className="nt-link" href={form.imageUrl} target="_blank" rel="noreferrer">
                  Preview
                </a>
              ) : null}
            </div>
          </label>

          <div className="nt-field nt-field--full">
            <span style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Content</span>
            <RichTextEditor
              value={form.contentHtml}
              onChange={(html) => onFormChange('contentHtml', html)}
              placeholder="Write your blog content here…"
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete blog"
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
