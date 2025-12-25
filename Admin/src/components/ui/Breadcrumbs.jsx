export default function Breadcrumbs({ items }) {
  return (
    <div className="nt-breadcrumbs" aria-label="Breadcrumb">
      {items.map((it, idx) => (
        <div className="nt-breadcrumbs__item" key={`${it.label}-${idx}`}>
          <span className="nt-breadcrumbs__label">{it.label}</span>
          {idx < items.length - 1 ? <span className="nt-breadcrumbs__sep">/</span> : null}
        </div>
      ))}
    </div>
  )
}
