import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'

const emptyForm = {
  id: null,
  name: '',
  designation: '',
  title: '',
  videoUrl: '',
  thumbnailUrl: '',
  sortOrder: 0,
  isActive: true,
}

export default function VideoTestimonials() {
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

  const columns = useMemo(
    () => [
      { key: 'sr', label: 'Sr No.' },
      { key: 'name', label: 'Name' },
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status' },
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
      const res = await api.get('/api/video-testimonials/getAllVideoTestimonialsByPage', {
        params: { limit: l, page: p, searchtxt: s },
      })

      setRows(res.data?.data || [])
      setTotalPages(res.data?.totalPages || 1)
      setTotalCount(res.data?.totalCount || 0)
      setPage(Number(res.data?.currentPage || p))
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.msg || 'Failed to load video testimonials')
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

  const openEdit = (r) => {
    setForm({
      id: r.id,
      name: r.name || '',
      designation: r.designation || '',
      title: r.title || '',
      videoUrl: r.videoUrl || '',
      thumbnailUrl: r.thumbnailUrl || '',
      sortOrder: typeof r.sortOrder === 'number' ? r.sortOrder : Number(r.sortOrder || 0),
      isActive: !!r.isActive,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    if (busy || uploading) return
    setModalOpen(false)
  }

  const onFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
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
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }

  const submitForm = async () => {
    setError('')
    setBusy(true)

    try {
      const payload = {
        name: form.name,
        designation: form.designation,
        title: form.title,
        videoUrl: form.videoUrl,
        thumbnailUrl: form.thumbnailUrl,
        sortOrder: Number(form.sortOrder || 0),
        isActive: !!form.isActive,
      }

      if (!payload.videoUrl) {
        setError('Video URL is required')
        return
      }

      if (form.id) {
        await api.put(`/api/video-testimonials/updateVideoTestimonial/${form.id}`, payload)
      } else {
        await api.post('/api/video-testimonials/createVideoTestimonial', payload)
      }

      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const askDelete = (r) => {
    setDeleteRow(r)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteRow) return
    setError('')
    setBusy(true)

    try {
      await api.delete(`/api/video-testimonials/deleteVideoTestimonial/${deleteRow.id}`)
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
      <button type="button" className="nt-btn nt-btn--ghost" onClick={closeModal} disabled={busy || uploading}>
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
        title="Video Testimonials"
        subtitle="Upload and manage video testimonials (shown on Testimonials page)"
        breadcrumbs={[{ label: 'Content' }, { label: 'Video Testimonials' }]}
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
            placeholder="Search by name/title"
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
                  No video testimonials found
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.id}>
                  <td>{(page - 1) * pageSize + (idx + 1)}</td>
                  <td style={{ fontWeight: 700 }}>{r.name || '-'}</td>
                  <td>{r.title || '-'}</td>
                  <td>{r.isActive ? 'Active' : 'Hidden'}</td>
                  <td>
                    <div className="nt-btnRow" style={{ justifyContent: 'center' }}>
                      <button type="button" className="nt-btn nt-btn--ghost" onClick={() => openEdit(r)} disabled={busy}>
                        Edit
                      </button>
                      <button type="button" className="nt-btn nt-btn--danger" onClick={() => askDelete(r)} disabled={busy}>
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
        title={form.id ? 'Update Video Testimonial' : 'Create Video Testimonial'}
        onClose={closeModal}
        footer={modalFooter}
        cardStyle={{ width: 'min(980px, 96vw)' }}
        bodyStyle={{ maxHeight: '72vh', overflowY: 'auto' }}
      >
        <div className="nt-formGrid">
          <label className="nt-field nt-field--full">
            <span>Name</span>
            <input className="nt-adminInput" value={form.name} onChange={(e) => onFormChange('name', e.target.value)} />
          </label>

          <label className="nt-field nt-field--full">
            <span>Designation</span>
            <input className="nt-adminInput" value={form.designation} onChange={(e) => onFormChange('designation', e.target.value)} />
          </label>

          <label className="nt-field nt-field--full">
            <span>Title (optional)</span>
            <input className="nt-adminInput" value={form.title} onChange={(e) => onFormChange('title', e.target.value)} />
          </label>

          <div className="nt-field nt-field--full">
            <span style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Video</span>
            <div className="nt-grid2">
              <div>
                <div className="nt-label">Video URL</div>
                <input className="nt-adminInput" value={form.videoUrl} onChange={(e) => onFormChange('videoUrl', e.target.value)} />
              </div>
              <div className="nt-inlineActions" style={{ alignItems: 'end' }}>
                <label className="nt-btn nt-btn--ghost nt-btn--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <span>{uploading ? 'Uploading…' : 'Upload Video'}</span>
                  <input
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    disabled={uploading}
                    onChange={async (e) => {
                      const url = await uploadAsset(e.target.files?.[0], 'video-testimonials')
                      if (!url) return
                      onFormChange('videoUrl', url)
                    }}
                  />
                </label>
                {form.videoUrl ? (
                  <a className="nt-link" href={form.videoUrl} target="_blank" rel="noreferrer">
                    Preview
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="nt-field nt-field--full">
            <span style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Thumbnail (optional)</span>
            <div className="nt-grid2">
              <div>
                <div className="nt-label">Thumbnail URL</div>
                <input className="nt-adminInput" value={form.thumbnailUrl} onChange={(e) => onFormChange('thumbnailUrl', e.target.value)} />
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
                      const url = await uploadAsset(e.target.files?.[0], 'video-testimonials')
                      if (!url) return
                      onFormChange('thumbnailUrl', url)
                    }}
                  />
                </label>
                {form.thumbnailUrl ? (
                  <a className="nt-link" href={form.thumbnailUrl} target="_blank" rel="noreferrer">
                    Preview
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="nt-grid2">
            <label className="nt-field nt-field--full">
              <span>Sort Order (higher shows first)</span>
              <input
                className="nt-adminInput"
                type="number"
                value={form.sortOrder}
                onChange={(e) => onFormChange('sortOrder', Number(e.target.value || 0))}
              />
            </label>

            <label className="nt-field nt-field--full" style={{ alignItems: 'end' }}>
              <span>Active</span>
              <select className="nt-select" value={form.isActive ? '1' : '0'} onChange={(e) => onFormChange('isActive', e.target.value === '1')}>
                <option value="1">Active</option>
                <option value="0">Hidden</option>
              </select>
            </label>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete video testimonial"
        message={`Are you sure you want to delete “${deleteRow?.name || deleteRow?.title || ''}”? This action cannot be undone.`}
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
