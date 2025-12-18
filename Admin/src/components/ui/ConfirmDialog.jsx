import Modal from './Modal'

export default function ConfirmDialog({ open, title, message, confirmText, cancelText, tone, loading, onConfirm, onClose }) {
  const footer = (
    <div className="nt-btnRow">
      <button type="button" className="nt-btn nt-btn--ghost" onClick={onClose} disabled={loading}>
        {cancelText || 'Cancel'}
      </button>
      <button
        type="button"
        className={tone === 'danger' ? 'nt-btn nt-btn--danger' : 'nt-btn nt-btn--primary'}
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? 'Please wait…' : confirmText || 'Confirm'}
      </button>
    </div>
  )

  return (
    <Modal open={open} title={title} onClose={onClose} footer={footer}>
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ color: 'rgba(4,27,46,0.72)', lineHeight: 1.65 }}>{message}</div>
      </div>
    </Modal>
  )
}
