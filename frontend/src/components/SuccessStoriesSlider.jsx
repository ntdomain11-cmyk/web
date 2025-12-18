import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import './SuccessStoriesSlider.css'

const STORIES = [
  {
    name: 'Shweta D Arya',
    role: 'Founder, Riyaash Fine Jewels',
    text: 'I used to think I was too late to start. At 35, I went from being a housewife to running a jewellery business with a team and an unstoppable vision. With structured mentorship, coaching and the right mindset shift, I turned Riyaash into a multi-crore brand. I now mentor women myself, because dreams don’t have deadlines.',
    img: '/media/about-side-img.webp',
  },
  {
    name: 'Dr. Bankim Patel',
    role: 'Founder, Dr Patel’s Homoeopathic Centre',
    text: 'I had built a respected practice and launched over 250 products, yet I felt stuck. I was working hard, but couldn’t scale beyond a certain point. Quantum Leap and business coaching helped me shift from self-employed to business owner. With proper systems, marketing, and team structure, we’ve grown stronger than ever.',
    img: '/media/about-side-img.webp',
  },
]

export default function SuccessStoriesSlider({ content }) {
  const kicker = content?.kicker || 'Entrepreneurs Who Transformed with Coaching'
  const title = content?.title || 'A SMALL GLIMPSE OF CLIENT SUCCESS STORIES!'
  const items = content?.items || STORIES
  const moreText = content?.moreText || 'MORE SUCCESS STORIES'
  const moreHref = content?.moreHref || '/testimonials'

  const [idx, setIdx] = useState(0)
  const current = useMemo(() => items[idx], [idx, items])

  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length)
  const next = () => setIdx((i) => (i + 1) % items.length)

  return (
    <section className="nt-stories">
      <div className="nt-stories__container">
        <div className="nt-stories__topLine" aria-hidden="true" />

        <div className="nt-stories__header">
          <div>
            <div className="nt-stories__kicker">{kicker}</div>
            <h2 className="nt-stories__title">{title}</h2>
          </div>

          <div className="nt-stories__nav">
            <button className="nt-stories__navBtn" type="button" aria-label="Previous" onClick={prev}>
              <ArrowLeft size={18} />
            </button>
            <button className="nt-stories__navBtn" type="button" aria-label="Next" onClick={next}>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="nt-stories__card">
          <div className="nt-stories__avatarWrap">
            <img className="nt-stories__avatar" src={current.img} alt={current.name} />
            <div className="nt-stories__quote" aria-hidden="true">
              <Quote size={18} />
            </div>
          </div>

          <div className="nt-stories__content">
            <p className="nt-stories__text">{current.text}</p>
            <div className="nt-stories__meta">
              <div className="nt-stories__name">{current.name}</div>
              <div className="nt-stories__role">{current.role}</div>
            </div>
          </div>

          <div className="nt-stories__more">
            <Link className="nt-stories__moreLink" to={moreHref}>
              {moreText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
