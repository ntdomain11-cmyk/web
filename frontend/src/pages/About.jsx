import { useEffect, useState } from 'react'
import AboutJourneySection from '../components/AboutJourneySection'
import AboutPageSections from './AboutPageSections'
import { apiGet } from '../lib/api'

export default function About() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await apiGet('/api/content/about')
        if (!mounted) return
        setContent(res?.data?.content || null)
      } catch {
        if (!mounted) return
        setContent(null)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <AboutJourneySection content={content?.journey} />
      <AboutPageSections content={content} />
    </>
  )
}
