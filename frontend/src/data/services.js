export const SERVICES = [
  {
    slug: 'business-strategy-operations',
    title: 'Business Strategy & Operations',
    short:
      'Structure your business for predictable growth with clear strategy, strong systems, and performance-focused execution.',
    bullets: [
      'Business Planning & Structuring',
      'Process Optimization',
      'Cost-Reduction Models',
      'Competitor & Market Analysis',
      'Business Automation Solutions',
      'Performance & Efficiency Improvement',
    ],
    outcomes: [
      'Clear priorities and roadmap',
      'Reduced operational friction',
      'Higher efficiency and profitability',
      'Improved decision-making through data',
    ],
  },
  {
    slug: 'sales-marketing-pr',
    title: 'Sales, Marketing & PR',
    short:
      'Build visibility, generate quality leads, and improve conversions using a mix of digital and offline growth strategies.',
    bullets: [
      'Digital & Offline Marketing Strategies',
      'Social Media Management',
      'Advertising Campaign Management',
      'Public Relations & Reputation Building',
      'Influencer Marketing',
      'Brand Positioning & Market Visibility',
    ],
    outcomes: ['Better lead quality', 'Stronger brand positioning', 'Consistent outreach system', 'Improved sales conversion'],
  },
  {
    slug: 'human-resource-services',
    title: 'Human Resource Services',
    short:
      'Build the right team and culture with HR systems that improve hiring, training, performance, and accountability.',
    bullets: [
      'Recruitment & Talent Acquisition',
      'Employee Training',
      'HR Policy Creation',
      'Performance Management Systems',
      'Leadership & Workplace Culture Development',
    ],
    outcomes: ['Better hiring decisions', 'Higher team performance', 'Clear roles and accountability', 'Healthy culture and retention'],
  },
  {
    slug: 'business-astrology-vastu',
    title: 'Business Astrology & Vastu',
    short:
      'Support business decisions with vastu and astrology-based guidance for alignment, timing, and practical remedies.',
    bullets: [
      'Auspicious Business Name, Logo & Launch Dates',
      'Vastu Alignment for Offices, Factories & Retail Spaces',
      'Astrology-Based Business Guidance',
      'Remedies for Financial, Career & Growth Blockages',
    ],
    outcomes: ['Better timing and clarity', 'Improved alignment of workspace', 'Confidence in key decisions', 'Practical remedies and guidance'],
  },
]

export function getServiceBySlug(slug) {
  return SERVICES.find((s) => s.slug === slug)
}
