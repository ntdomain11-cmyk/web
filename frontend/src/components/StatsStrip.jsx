import './StatsStrip.css'

const STATS = [
  { value: '7.8L+', label: 'Entrepreneurs Impacted' },
  { value: '36K+', label: 'MSMEs Empowered through\nThe Business P.A.C.E\nProgram' },
  { value: '18+', label: 'Years of transforming\nMSME businesses.' },
  { value: '6,744 CR', label: 'Additional revenue\ngenerated in the last one\nyear.' },
  { value: '7+', label: 'Trained Across Countries' },
]

export default function StatsStrip({ content }) {
  const items = content?.items || STATS
  const noteTop = content?.noteTop || 'But numbers aside, here’s what really matters to me...'
  const noteBottom =
    content?.noteBottom ||
    'These numbers include coaching engagements, training programs, workshops, and consulting assignments.'
  const quote = content?.quote || '“ To help MSMEs build impactful businesses and become industry leaders. ”'

  return (
    <section className="nt-stats">
      <div className="nt-stats__container">
        <div className="nt-stats__panel">
          {items.map((s) => (
            <div key={s.value} className="nt-stats__item">
              <div className="nt-stats__value">{s.value}</div>
              <div className="nt-stats__label">
                {s.label.split('\n').map((line, i) => (
                  <span key={i} className="nt-stats__labelLine">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="nt-stats__note">
          <div className="nt-stats__noteTop">{noteTop}</div>
          <div className="nt-stats__quote">{quote}</div>
          <div className="nt-stats__noteTop" style={{ marginTop: 8 }}>{noteBottom}</div>
        </div>
      </div>
    </section>
  )
}
