import Breadcrumbs from './Breadcrumbs'

export default function PageHeader({ title, subtitle, breadcrumbs, right }) {
  return (
    <div className="nt-pageHeader">
      <div className="nt-pageHeader__left">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className="nt-pageHeader__titleRow">
          <div>
            <div className="nt-pageHeader__title">{title}</div>
            {subtitle ? <div className="nt-pageHeader__subtitle">{subtitle}</div> : null}
          </div>
        </div>
      </div>
      {right ? <div className="nt-pageHeader__right">{right}</div> : null}
    </div>
  )
}
