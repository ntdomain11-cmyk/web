import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import StatusPill from '../components/ui/StatusPill'

const emptyForm = {
  id: null,
  name: '',
  email: '',
  mobile: '',
  password: '',
  isActive: true,
}

export default function Users() {
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
      { key: 'name', label: 'Username' },
      { key: 'email', label: 'Email' },
      { key: 'mobile', label: 'Mobile' },
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
      const res = await api.get('/api/users/getAllUsersByPage', {
        params: { limit: l, page: p, searchtxt: s },
      })

      setRows(res.data?.data || [])
      setTotalPages(res.data?.totalPages || 1)
      setTotalCount(res.data?.totalCount || 0)
      setPage(Number(res.data?.currentPage || p))
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.msg || 'Failed to load users')
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

  const openEdit = (u) => {
    setForm({
      id: u.id,
      name: u.name || '',
      email: u.email || '',
      mobile: u.mobile || '',
      password: u.password || '',
      isActive: Boolean(u.isActive),
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
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        isActive: form.isActive ? 1 : 0,
      }

      if (form.id) {
        await api.put(`/api/users/updateUser/${form.id}`, payload)
      } else {
        await api.post('/api/users/createUser', payload)
      }

      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const toggleStatus = async (u) => {
    setError('')
    setBusy(true)
    try {
      await api.put(`/api/users/updateUserStatus/${u.id}`, { isActive: u.isActive ? 0 : 1 })
      await load()
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update status')
    } finally {
      setBusy(false)
    }
  }

  const askDelete = (u) => {
    setDeleteRow(u)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteRow) return
    setError('')
    setBusy(true)
    try {
      await api.delete(`/api/users/deleteUser/${deleteRow.id}`)
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
        title="Users"
        subtitle="Create and manage administrator accounts"
        breadcrumbs={[{ label: 'Administrator' }, { label: 'Users' }]}
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
            placeholder="Search"
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
                  No users found
                </td>
              </tr>
            ) : (
              rows.map((u, idx) => (
                <tr key={u.id}>
                  <td>{(page - 1) * pageSize + (idx + 1)}</td>
                  <td style={{ fontWeight: 700 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.mobile}</td>
                  <td>
                    <StatusPill active={Boolean(u.isActive)} />
                  </td>
                  <td>
                    <div className="nt-btnRow" style={{ justifyContent: 'center' }}>
                      <button type="button" className="nt-btn nt-btn--ghost" onClick={() => toggleStatus(u)} disabled={busy}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button type="button" className="nt-btn nt-btn--ghost" onClick={() => openEdit(u)} disabled={busy}>
                        Edit
                      </button>
                      <button type="button" className="nt-btn nt-btn--danger" onClick={() => askDelete(u)} disabled={busy}>
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
        title={form.id ? 'Update User' : 'Create User'}
        onClose={closeModal}
        footer={modalFooter}
      >
        <div className="nt-formGrid">
          <label className="nt-field">
            <span>Name</span>
            <input className="nt-adminInput" value={form.name} onChange={(e) => onFormChange('name', e.target.value)} />
          </label>

          <label className="nt-field">
            <span>Mobile</span>
            <input className="nt-adminInput" value={form.mobile} onChange={(e) => onFormChange('mobile', e.target.value)} />
          </label>

          <label className="nt-field nt-field--full">
            <span>Email</span>
            <input
              className="nt-adminInput"
              type="email"
              value={form.email}
              onChange={(e) => onFormChange('email', e.target.value)}
            />
          </label>

          <label className="nt-field nt-field--full">
            <span>Password</span>
            <input
              className="nt-adminInput"
              type="text"
              value={form.password}
              onChange={(e) => onFormChange('password', e.target.value)}
            />
          </label>

          <label className="nt-field nt-field--full">
            <span>Status</span>
            <select
              className="nt-select"
              value={form.isActive ? '1' : '0'}
              onChange={(e) => onFormChange('isActive', e.target.value === '1')}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete user"
        message={`Are you sure you want to delete “${deleteRow?.name || ''}”? This action cannot be undone.`}
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
