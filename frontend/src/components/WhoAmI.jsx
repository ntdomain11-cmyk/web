import './WhoAmI.css'

export default function WhoAmI({ content }) {
  const title = content?.title || 'WHO AM I, REALLY?'
  const pill = content?.pill || "India's MSME Business Coach"
  const paragraphs =
    content?.paragraphs ||
    [
      'For the past 18 years, I’ve been on a mission to help MSME business owners break free from firefighting and build a growth business. I don’t just teach theory. I bring real & tested strategies that have worked for thousands of entrepreneurs across industries and for myself.',
      'With a team of 70+ in-house business coaches, we’ve worked with businesses across 196+ industries and helped MSMEs scale faster with expert-led business coaching, proven frameworks, and handholding.',
    ]
  const imageUrl = content?.imageUrl || '/media/about-side-img.webp'

  return (
    <section className="nt-who">
      <div className="nt-who__top">
        <div className="nt-who__topInner">
          <h2 className="nt-who__topTitle">{title}</h2>
          <div className="nt-who__pill">{pill}</div>
        </div>
      </div>

      <div className="nt-who__body">
        <div className="nt-who__container">
          <div className="nt-who__left">
            {paragraphs.map((p) => (
              <p key={p} className="nt-who__p">
                {p}
              </p>
            ))}
          </div>

          <div className="nt-who__right">
            <img className="nt-who__ellipse nt-who__ellipse--lg" src="/media/Ellipse.svg" alt="" aria-hidden="true" />
            <img className="nt-who__ellipse nt-who__ellipse--sm" src="/media/Ellipse-sm.svg" alt="" aria-hidden="true" />

            <div className="nt-who__photoWrap">
              <img className="nt-who__photo" src={imageUrl} alt="Consultant" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
