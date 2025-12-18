import { Link } from 'react-router-dom'

export default function Programs() {
  return (
    <div className="nt-container" style={{ padding: '34px 18px 56px' }}>
      <h1 className="nt-pageTitle">Programs</h1>
      <p className="nt-bodyText">
        We’ll publish detailed program information here. For now, you can book a consultation and we’ll guide you to the
        right plan.
      </p>

      <div className="nt-grid2">
        <div className="nt-card">
          <h2 className="nt-cardTitle">P.A.C.E</h2>
          <p className="nt-bodyText">A structured growth program focused on process, accountability, clarity and execution.</p>
        </div>
        <div className="nt-card">
          <h2 className="nt-cardTitle">M.B.A</h2>
          <p className="nt-bodyText">Practical business frameworks for founders to strengthen strategy, systems and leadership.</p>
        </div>
        <div className="nt-card">
          <h2 className="nt-cardTitle">B.G.C</h2>
          <p className="nt-bodyText">Business growth consulting for MSMEs to improve performance across key functions.</p>
        </div>
        <div className="nt-card">
          <h2 className="nt-cardTitle">Get Started</h2>
          <p className="nt-bodyText">Not sure what fits? Tell us your goals and we’ll recommend the right path.</p>
          <Link className="nt-primaryBtn" to="/book">Book a Consultation</Link>
        </div>
      </div>
    </div>
  )
}
