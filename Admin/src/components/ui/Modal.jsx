export default function Modal({ open, title, children, footer, onClose, cardStyle, bodyStyle }) {
  if (!open) return null

  const onOverlay = (e) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  return (
    <div className="nt-modal" role="dialog" aria-modal="true" onMouseDown={onOverlay}>
      <div className="nt-modal__card" style={cardStyle}>
        <div className="nt-modal__head">
          <div className="nt-modal__title">{title}</div>
          <button type="button" className="nt-btn nt-btn--ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="nt-modal__body" style={bodyStyle}>
          {children}
        </div>
        {footer ? <div className="nt-modal__footer">{footer}</div> : null}
      </div>
    </div>
  )
}
