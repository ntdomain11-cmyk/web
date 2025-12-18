import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import WhoAmI from '../components/WhoAmI'
import StatsStrip from '../components/StatsStrip'
import ServicesShowcase from '../components/ServicesShowcase'
import BlogsSection from '../components/BlogsSection'
import TestimonialsSection from '../components/TestimonialsSection'
import Faq from './Faq'
import { apiGet } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Home() {
  const [content, setContent] = useState(null)
  const [faqContent, setFaqContent] = useState(null)
  const [testimonialsContent, setTestimonialsContent] = useState(null)
  const [blogsContent, setBlogsContent] = useState(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const [homeRes, faqRes, testiRes, blogsRes] = await Promise.all([
          apiGet('/api/content/home'),
          apiGet('/api/content/faq'),
          apiGet('/api/content/testimonials'),
          apiGet('/api/blogs/getAllBlogsByPage?limit=10&page=1'),
        ])
        if (!mounted) return
        setContent(homeRes?.data?.content || null)
        setFaqContent(faqRes?.data?.content || null)
        setTestimonialsContent(testiRes?.data?.content || null)
        setBlogsContent({ title: 'BLOGS', items: blogsRes?.data || [] })
      } catch {
        if (!mounted) return
        setContent(null)
        setFaqContent(null)
        setTestimonialsContent(null)
        setBlogsContent(null)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const statsContent = content?.stats || (content?.who?.counts ? { items: content.who.counts } : null)

  return (
    <>
      <Hero content={content?.hero} />
      <WhoAmI content={content?.who} />
      <StatsStrip content={statsContent} />
      <ServicesShowcase content={content?.servicesShowcase} />
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 18px 10px', display: 'flex', justifyContent: 'center' }}>
        <Link className="nt-hero__cta" to="/book">Book a Consultation</Link>
      </div>
      <BlogsSection content={blogsContent} />
      <TestimonialsSection content={testimonialsContent} />
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 18px 10px', display: 'flex', justifyContent: 'center' }}>
        <Link className="nt-hero__cta" to="/book">Book a Consultation</Link>
      </div>
      <Faq content={faqContent} />
    </>
  )
}
