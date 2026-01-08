export default function StatusPill({ active }) {
  return (
    <span className={active ? 'nt-pill nt-pill--active' : 'nt-pill nt-pill--inactive'}>
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}
