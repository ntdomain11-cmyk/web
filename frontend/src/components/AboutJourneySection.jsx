import './AboutJourneySection.css'

export default function AboutJourneySection({ content }) {
  const hi = content?.hi || "HI, I'M NIRAJ TRIVEDI"
  const tag = content?.tag || "India's MSME Business Coach"
  const imageUrl = content?.imageUrl || '/media/about-side-img.webp'
  const paragraphsHtml = content?.paragraphsHtml || []

  return (
    <section className="nt-aboutJourney">
      <div className="nt-aboutJourney__top">
        <div className="nt-aboutJourney__topInner">
          <div className="nt-aboutJourney__topLeft">
            <div className="nt-aboutJourney__hi">{hi}</div>
            <div className="nt-aboutJourney__line" aria-hidden="true" />
          </div>
          <div className="nt-aboutJourney__tag">{tag}</div>
        </div>
      </div>

      <div className="nt-aboutJourney__body">
        <div className="nt-aboutJourney__bg" aria-hidden="true" />
        <div className="nt-aboutJourney__inner">
          <div className="nt-aboutJourney__photoWrap" aria-hidden="true">
            <img className="nt-aboutJourney__photo" src={imageUrl} alt="" />
          </div>

          <div className="nt-aboutJourney__text">
            {paragraphsHtml.length ? (
              paragraphsHtml.map((html, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: html }} />
              ))
            ) : (
              <>
                <p>
                  That's what people I work with and my team call me. But if you ask me, I was initially a reluctant
                  entrepreneur. But once I realised my calling, which is to help and support MSME business owners, I started
                  enjoying my journey of entrepreneurship.
                </p>
                <p>
                  <strong>My inspiration? My dad!</strong>
                </p>
                <p>
                  I would give all the credit and dedicate the journey to my dad. I can't picture what would've happened if
                  he hadn't torn my job offer letter back in 2006.
                </p>
                <p>
                  <strong>Yes, he did that!</strong>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
