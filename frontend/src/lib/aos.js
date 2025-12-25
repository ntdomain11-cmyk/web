import AOS from 'aos'

const SECTION_ANIMS = [
  'fade-up',
  'fade-right',
  'fade-left',
  'zoom-in',
  'fade-up',
  'fade-down',
]

function pick(arr, idx) {
  return arr[idx % arr.length]
}

function setIfMissing(el, name, value) {
  if (!el.hasAttribute(name)) el.setAttribute(name, value)
}

export function initAosOnce() {
  AOS.init({
    duration: 850,
    easing: 'ease-out-cubic',
    once: true,
    offset: 120,
    delay: 0,
    anchorPlacement: 'top-bottom',
  })
}

export function applyAosAttributes() {
  if (typeof document === 'undefined') return

  const sections = Array.from(document.querySelectorAll('section'))
  sections.forEach((sec, idx) => {
    setIfMissing(sec, 'data-aos', pick(SECTION_ANIMS, idx))
    setIfMissing(sec, 'data-aos-duration', '850')
    setIfMissing(sec, 'data-aos-easing', 'ease-out-cubic')

    const cards = Array.from(sec.querySelectorAll('.nt-card, .nt-stats__item, .nt-serviceCard, .nt-blogCard'))
    cards.slice(0, 12).forEach((c, i) => {
      setIfMissing(c, 'data-aos', 'fade-up')
      setIfMissing(c, 'data-aos-delay', String(Math.min(i * 70, 560)))
      setIfMissing(c, 'data-aos-duration', '750')
    })
  })
}

export function refreshAos() {
  applyAosAttributes()
  AOS.refreshHard()
}
