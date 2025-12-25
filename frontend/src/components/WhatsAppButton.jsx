import { useMemo } from 'react'
import { MessageCircle } from 'lucide-react'
import { useSiteConfig } from '../context/SiteConfigContext'

function toWhatsAppNumber(value) {
  const digits = String(value || '').replace(/\D/g, '')
  const last10 = digits.length > 10 ? digits.slice(-10) : digits
  if (!last10) return ''
  return `91${last10}`
}

export default function WhatsAppButton() {
  const { siteConfig } = useSiteConfig()

  const whatsappNumber = useMemo(() => {
    return toWhatsAppNumber(siteConfig?.mobile || '7016925803')
  }, [siteConfig])

  const href = useMemo(() => {
    if (!whatsappNumber) return ''
    const text = encodeURIComponent('Hello! I want to book a consultation.')
    return `https://wa.me/${whatsappNumber}?text=${text}`
  }, [whatsappNumber])

  if (!href) return null

  return (
    <a
      className="nt-whatsapp"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <span className="nt-whatsapp__icon" aria-hidden="true">
        <MessageCircle size={22} />
      </span>
    </a>
  )
}
