import { BarChart3, Sparkles, Users } from 'lucide-react'
import './ServicesShowcase.css'

const CARDS = [
  {
    title: 'Impactful Training',
    desc: 'My training programs help MSME business owners with proven strategies to scale, boost profits, and build a strong business.',
    Icon: BarChart3,
  },
  {
    title: 'Transformational Coaching',
    desc: 'My team of expert business coaches provides personalised coaching, helping you overcome obstacles, refine strategies, and grow your business with clear guidance.',
    Icon: Sparkles,
  },
  {
    title: 'Hands-On Consulting',
    desc: 'My master coaches work directly with your team at your company, training them to implement systems and strategies.',
    Icon: Users,
  },
]

const ICONS = {
  BarChart3,
  Sparkles,
  Users,
}

export default function ServicesShowcase({ content }) {
  const kicker = content?.kicker || 'Struggling with growth?'
  const title = content?.title || 'FIX IT WITH EXPERT BUSINESS COACHING & GROWTH SERVICES'

  const cards =
    content?.cards?.map((c) => ({
      title: c.title,
      desc: c.desc,
      Icon: ICONS[c.iconName] || BarChart3,
    })) || CARDS

  return (
    <section className="nt-servicesShow">
      <div className="nt-servicesShow__container">
        <div className="nt-servicesShow__topLine" aria-hidden="true" />

        <div className="nt-servicesShow__heading">
          <div className="nt-servicesShow__kicker">{kicker}</div>
          <h2 className="nt-servicesShow__title">{title}</h2>
        </div>

        <div className="nt-servicesShow__cards">
          {cards.map(({ title, desc, Icon }) => (
            <div key={title} className="nt-servicesShow__card">
              <div className="nt-servicesShow__iconWrap" aria-hidden="true">
                <Icon size={26} strokeWidth={2.2} />
              </div>
              <div className="nt-servicesShow__cardTitle">{title}</div>
              <div className="nt-servicesShow__cardDesc">{desc}</div>
            </div>
          ))}
        </div>

        <div className="nt-servicesShow__bottomLine" aria-hidden="true" />
      </div>
    </section>
  )
}
