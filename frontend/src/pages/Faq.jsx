import { useEffect, useId, useMemo, useState } from 'react'
import { apiGet } from '../lib/api'
import './Faq.css'

const FAQS = [
  {
    q: 'What does NT Consultancy help with?',
    a: 'We help business owners build clarity and momentum across strategy, marketing, sales, operations, and team execution—so growth becomes predictable, not random.',
  },
  {
    q: 'How is business coaching different from consulting?',
    a: 'Consulting is often “done for you.” Coaching is “done with you.” At NT Consultancy, we guide you with frameworks, reviews, and execution support so you learn, implement, and sustain results.',
  },
  {
    q: 'Who is the right fit to work with you?',
    a: 'Owners/founders of MSMEs and growing businesses who want structured growth, stronger systems, and better decision-making—especially if things feel stuck or inconsistent.',
  },
  {
    q: 'Do you work with all MSME sectors?',
    a: 'Yes. We work with service businesses, trading, manufacturing, and professional practices. The focus is on building the right strategy and systems for your business model.',
  },
  {
    q: 'How long before I see results?',
    a: 'You can see early improvements in clarity and execution within a few weeks. Tangible growth outcomes depend on your baseline, market, and implementation—but we track progress with clear action plans.',
  },
  {
    q: 'Do you provide online sessions?',
    a: 'Yes. We offer online sessions and can also support offline/onsite engagement depending on the requirement.',
  },
  {
    q: 'What is your process like?',
    a: 'We start with understanding your current situation, identify growth bottlenecks, set priorities, create an action plan, and review progress regularly. The goal is execution with accountability.',
  },
  {
    q: 'What does it cost?',
    a: 'Pricing depends on the engagement type (1:1 coaching, project consulting, or monthly support). Share your goals and current challenges, and we’ll recommend the right plan.',
  },
  {
    q: 'Is coaching worth it if my business is stuck?',
    a: 'Yes—if you’re ready to implement. Coaching helps you find the real bottlenecks, build systems, and execute consistently. That’s usually what unlocks growth when a business feels stuck.',
  },
]

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="nt-faqItem">
      <button className="nt-faqItem__btn" type="button" onClick={onToggle} aria-expanded={isOpen}>
        <span className="nt-faqItem__icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
        <span className="nt-faqItem__q">{item.q}</span>
      </button>
      {isOpen ? (
        <div className="nt-faqItem__panel" role="region">
          <p className="nt-faqItem__a">{item.a}</p>
        </div>
      ) : null}
    </div>
  )
}

export default function Faq({ content }) {
  const uid = useId()
  const [remoteContent, setRemoteContent] = useState(null)

  useEffect(() => {
    if (content) return
    let mounted = true

    async function load() {
      try {
        const res = await apiGet('/api/content/faq')
        if (!mounted) return
        setRemoteContent(res?.data?.content || null)
      } catch {
        if (!mounted) return
        setRemoteContent(null)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [content])

  const effective = content || remoteContent
  const title = effective?.title || 'FAQs'
  const baseItems = effective?.items || FAQS

  const items = useMemo(() => baseItems.map((f, idx) => ({ ...f, id: `${uid}-${idx}` })), [uid, baseItems])
  const [openId, setOpenId] = useState(items[0]?.id)

  return (
    <section className="nt-faq">
      <div className="nt-faq__container">
        <h1 className="nt-faq__title">{title}</h1>
        <div className="nt-faq__list">
          {items.map((f) => (
            <FaqItem
              key={f.id}
              item={f}
              isOpen={openId === f.id}
              onToggle={() => setOpenId((cur) => (cur === f.id ? null : f.id))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
