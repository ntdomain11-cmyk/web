import './Preloader.css'

export default function Preloader({ label = 'Loading…', size = 34, inline = false }) {
  const style = { '--nt-loader-size': `${size}px` }

  if (inline) {
    return (
      <span className="nt-preloader nt-preloader--inline" style={style} aria-label={label}>
        <span className="nt-preloader__spinner" aria-hidden="true" />
      </span>
    )
  }

  return (
    <div className="nt-preloader" style={style} aria-label={label}>
      <div className="nt-preloader__spinner" aria-hidden="true" />
      <div className="nt-preloader__label">{label}</div>
    </div>
  )
}
