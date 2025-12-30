export default function Pagination({ page, totalPages, onPageChange }) {
  const canPrev = page > 1
  const canNext = page < totalPages

  const onPrev = () => {
    if (!canPrev) return
    onPageChange(page - 1)
  }

  const onNext = () => {
    if (!canNext) return
    onPageChange(page + 1)
  }

  if (!totalPages || totalPages <= 1) return null

  return (
    <div className="nt-pagination">
      <button type="button" className="nt-btn nt-btn--ghost" onClick={onPrev} disabled={!canPrev}>
        Previous
      </button>
      <div className="nt-pagination__meta">
        <span className="nt-pagination__pill">{page}</span>
        <span className="nt-pagination__sep">of</span>
        <span>{totalPages}</span>
      </div>
      <button type="button" className="nt-btn nt-btn--ghost" onClick={onNext} disabled={!canNext}>
        Next
      </button>
    </div>
  )
}
