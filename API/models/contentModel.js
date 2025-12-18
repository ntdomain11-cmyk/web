const db = require('../config/db')

let ensured = false

const DEFAULT_FAQ_CONTENT = {
  title: 'FAQs',
  items: [
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
  ],
}

const DEFAULT_ABOUT_CONTENT = {
  journey: {
    hi: "HI, I'M NIRAJ TRIVEDI",
    tag: "India's MSME Business Coach",
    imageUrl: '/media/about-side-img.webp',
    paragraphsHtml: [
      "That's what people I work with and my team call me. But if you ask me, I was initially a reluctant entrepreneur. But once I realised my calling, which is to help and support MSME business owners, I started enjoying my journey of entrepreneurship.",
      '<strong>My inspiration? My dad!</strong>',
      "I would give all the credit and dedicate the journey to my dad. I can't picture what would've happened if he hadn't torn my job offer letter back in 2006.",
      '<strong>Yes, he did that!</strong>',
    ],
  },
  intro: {
    kicker: 'About NT Consultancy',
    title: 'Clarity. Systems. Execution.',
    text:
      'NT Consultancy is a business growth and consulting practice focused on helping MSMEs build clarity, improve systems, and execute consistently. We work with owners and leadership teams to strengthen strategy, marketing, sales, operations, and people performance.',
    pills: ['Structured Approach', 'Practical Execution', 'Measurable Outcomes'],
    stats: [
      { num: '01', label: 'Diagnose bottlenecks' },
      { num: '02', label: 'Build systems & processes' },
      { num: '03', label: 'Drive execution & reviews' },
      { num: '04', label: 'Scale sustainably' },
    ],
  },
  missionVision: {
    missionTitle: 'Our Mission',
    missionText: 'To empower businesses with clarity, strategy, and structured support—so they operate efficiently and achieve consistent success.',
    visionTitle: 'Our Vision',
    visionText:
      'To become a trusted partner for entrepreneurs by delivering sustainable growth solutions and elevating performance across industries.',
  },
  values: {
    kicker: 'What you can expect',
    title: 'Our Values',
    items: [
      { title: 'Structured Thinking', text: 'We simplify complexity into clear priorities and action plans.' },
      { title: 'People & Process', text: 'We build systems that your team can follow and scale.' },
      { title: 'Accountability', text: 'Regular reviews to ensure implementation and momentum.' },
      { title: 'Outcome Focus', text: 'We track progress using measurable business outcomes.' },
    ],
  },
  process: {
    kicker: 'How we work',
    title: 'A Simple, Repeatable Process',
    steps: [
      { num: '1', title: 'Discovery', text: 'Understand your goals, constraints, and current performance.' },
      { num: '2', title: 'Diagnosis', text: 'Identify bottlenecks in marketing, sales, ops, and people.' },
      { num: '3', title: 'Plan & Systems', text: 'Create a roadmap and build SOPs/processes to support scale.' },
      { num: '4', title: 'Execution & Reviews', text: 'Weekly/bi-weekly reviews to keep teams aligned and accountable.' },
    ],
  },
  cta: {
    title: 'Ready to build structured growth?',
    text: 'Book a consultation and we’ll map out the next steps for your business.',
    buttonLabel: 'Book a Consultation',
    buttonHref: '/book',
  },
}

const DEFAULT_TESTIMONIALS_CONTENT = {
  title: 'TESTIMONIALS',
  items: [
    {
      imageUrl: '',
      name: 'Sheeba Duleep',
      designation: 'Business Owner',
      content:
        'Bit overwhelmed at the moment, and I hope the business coaches will be able to help me wade through and come out to devise successful strategies for my life and business.',
    },
    {
      imageUrl: '',
      name: 'Aamod Dharmadhikari',
      designation: 'Founder',
      content:
        'It was very insightful. Everything that is happening in my business and life, which I thought were my problems and issues, was already known and it made me realise that all of us business owners have the same issues and can solve them by taking the steps suggested.',
    },
    {
      imageUrl: '',
      name: 'Riya Shah',
      designation: 'Entrepreneur',
      content:
        'The guidance was structured and practical. I now have clarity on what to do next and how to execute step-by-step.',
    },
  ],
}

const DEFAULT_BLOGS_CONTENT = {
  title: 'BLOGS',
  items: [
    {
      imageUrl: '',
      title: '11 Ways to Delegate Effectively for Business Owners in 2026',
      contentHtml:
        '<p>Feeling overwhelmed? No time for strategy, family, or even a break? Here are practical ways to delegate effectively and free up your calendar.</p>',
    },
    {
      imageUrl: '',
      title: '4 Ways to Build Brand Identity For MSMEs Without a Big Budget',
      contentHtml:
        '<p>Brand is not logo. It’s trust. These 4 practical steps will help you build brand identity without spending like big corporates.</p>',
    },
    {
      imageUrl: '',
      title: '11 Recruitment Tips to Build a High-Performing & Dependable Team',
      contentHtml:
        '<p>Tired of bad hires? Start with role clarity, process, and scorecards. Here are 11 recruitment tips that actually work.</p>',
    },
  ],
}

async function ensureContentPagesTable() {
  if (ensured) return
  await db.execute(
    `CREATE TABLE IF NOT EXISTS content_pages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      content LONGTEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
  )
  ensured = true
}

async function execWithAutoCreate(sql, params) {
  try {
    return await db.execute(sql, params)
  } catch (err) {
    if (err && (err.code === 'ER_NO_SUCH_TABLE' || err.errno === 1146)) {
      await ensureContentPagesTable()
      return await db.execute(sql, params)
    }
    throw err
  }
}

const Content = {
  getBySlug: async (slug) => {
    try {
      const [rows] = await execWithAutoCreate('SELECT * FROM content_pages WHERE slug = ? LIMIT 1', [slug])

      if (!rows.length) {
        if (slug === 'faq') {
          const contentStr = JSON.stringify(DEFAULT_FAQ_CONTENT)
          await execWithAutoCreate(
            'INSERT INTO content_pages (slug, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE slug = slug',
            [slug, contentStr],
          )

          const [seededRows] = await execWithAutoCreate('SELECT * FROM content_pages WHERE slug = ? LIMIT 1', [slug])
          let seededParsed = null
          try {
            seededParsed = seededRows[0]?.content ? JSON.parse(seededRows[0].content) : null
          } catch {
            seededParsed = seededRows[0]?.content
          }

          return { status: 'success', data: { slug, content: seededParsed } }
        }

        if (slug === 'about') {
          const contentStr = JSON.stringify(DEFAULT_ABOUT_CONTENT)
          await execWithAutoCreate(
            'INSERT INTO content_pages (slug, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE slug = slug',
            [slug, contentStr],
          )

          const [seededRows] = await execWithAutoCreate('SELECT * FROM content_pages WHERE slug = ? LIMIT 1', [slug])
          let seededParsed = null
          try {
            seededParsed = seededRows[0]?.content ? JSON.parse(seededRows[0].content) : null
          } catch {
            seededParsed = seededRows[0]?.content
          }

          return { status: 'success', data: { slug, content: seededParsed } }
        }

        if (slug === 'testimonials') {
          const contentStr = JSON.stringify(DEFAULT_TESTIMONIALS_CONTENT)
          await execWithAutoCreate(
            'INSERT INTO content_pages (slug, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE slug = slug',
            [slug, contentStr],
          )

          const [seededRows] = await execWithAutoCreate('SELECT * FROM content_pages WHERE slug = ? LIMIT 1', [slug])
          let seededParsed = null
          try {
            seededParsed = seededRows[0]?.content ? JSON.parse(seededRows[0].content) : null
          } catch {
            seededParsed = seededRows[0]?.content
          }

          return { status: 'success', data: { slug, content: seededParsed } }
        }

        if (slug === 'blogs') {
          const contentStr = JSON.stringify(DEFAULT_BLOGS_CONTENT)
          await execWithAutoCreate(
            'INSERT INTO content_pages (slug, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE slug = slug',
            [slug, contentStr],
          )

          const [seededRows] = await execWithAutoCreate('SELECT * FROM content_pages WHERE slug = ? LIMIT 1', [slug])
          let seededParsed = null
          try {
            seededParsed = seededRows[0]?.content ? JSON.parse(seededRows[0].content) : null
          } catch {
            seededParsed = seededRows[0]?.content
          }

          return { status: 'success', data: { slug, content: seededParsed } }
        }

        return { status: 'success', data: { slug, content: null } }
      }

      let parsed = null
      try {
        parsed = rows[0].content ? JSON.parse(rows[0].content) : null
      } catch {
        parsed = rows[0].content
      }

      return {
        status: 'success',
        data: {
          id: rows[0].id,
          slug: rows[0].slug,
          content: parsed,
          updated_at: rows[0].updated_at,
        },
      }
    } catch (err) {
      throw err
    }
  },

  upsert: async (slug, body) => {
    try {
      const contentStr = JSON.stringify(body?.content ?? body ?? null)

      const [existing] = await execWithAutoCreate('SELECT id FROM content_pages WHERE slug = ? LIMIT 1', [slug])

      if (existing.length) {
        await execWithAutoCreate('UPDATE content_pages SET content = ?, updated_at = NOW() WHERE slug = ?', [contentStr, slug])
        const [row] = await execWithAutoCreate('SELECT * FROM content_pages WHERE slug = ? LIMIT 1', [slug])
        return { status: 'success', data: row[0] }
      }

      const [inserted] = await execWithAutoCreate(
        'INSERT INTO content_pages (slug, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [slug, contentStr],
      )

      return { status: 'success', data: { insertId: inserted.insertId, slug } }
    } catch (err) {
      throw err
    }
  },
}

module.exports = Content
