const db = require('../config/db');

let ensured = false;

const DEFAULT_SERVICES = [
  {
    slug: 'business-strategy-operations',
    title: 'Business Strategy & Operations',
    short:
      'Structure your business for predictable growth with clear strategy, strong systems, and performance-focused execution.',
    iconKey: 'business-strategy-operations',
    bullets: [
      'Business Planning & Structuring',
      'Process Optimization',
      'Cost-Reduction Models',
      'Competitor & Market Analysis',
      'Business Automation Solutions',
      'Performance & Efficiency Improvement',
    ],
    outcomes: ['Clear priorities and roadmap', 'Reduced operational friction', 'Higher efficiency and profitability', 'Improved decision-making through data'],
    contentHtml: '',
  },
  {
    slug: 'sales-marketing-pr',
    title: 'Sales, Marketing & PR',
    short:
      'Build visibility, generate quality leads, and improve conversions using a mix of digital and offline growth strategies.',
    iconKey: 'sales-marketing-pr',
    bullets: [
      'Digital & Offline Marketing Strategies',
      'Social Media Management',
      'Advertising Campaign Management',
      'Public Relations & Reputation Building',
      'Influencer Marketing',
      'Brand Positioning & Market Visibility',
    ],
    outcomes: ['Better lead quality', 'Stronger brand positioning', 'Consistent outreach system', 'Improved sales conversion'],
    contentHtml: '',
  },
  {
    slug: 'human-resource-services',
    title: 'Human Resource Services',
    short:
      'Build the right team and culture with HR systems that improve hiring, training, performance, and accountability.',
    iconKey: 'human-resource-services',
    bullets: [
      'Recruitment & Talent Acquisition',
      'Employee Training',
      'HR Policy Creation',
      'Performance Management Systems',
      'Leadership & Workplace Culture Development',
    ],
    outcomes: ['Better hiring decisions', 'Higher team performance', 'Clear roles and accountability', 'Healthy culture and retention'],
    contentHtml: '',
  },
  {
    slug: 'business-astrology-vastu',
    title: 'Business Astrology & Vastu',
    short:
      'Support business decisions with vastu and astrology-based guidance for alignment, timing, and practical remedies.',
    iconKey: 'business-astrology-vastu',
    bullets: [
      'Auspicious Business Name, Logo & Launch Dates',
      'Vastu Alignment for Offices, Factories & Retail Spaces',
      'Astrology-Based Business Guidance',
      'Remedies for Financial, Career & Growth Blockages',
    ],
    outcomes: ['Better timing and clarity', 'Improved alignment of workspace', 'Confidence in key decisions', 'Practical remedies and guidance'],
    contentHtml: '',
  },
];

async function ensureServicesTable() {
  if (ensured) return;

  await db.execute(
    `CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(180) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      shortText TEXT NULL,
      iconKey VARCHAR(180) NULL,
      bulletsJson LONGTEXT NULL,
      outcomesJson LONGTEXT NULL,
      contentHtml LONGTEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
  );

  ensured = true;
}

async function execWithAutoCreate(sql, params) {
  try {
    return await db.execute(sql, params);
  } catch (err) {
    if (err && (err.code === 'ER_NO_SUCH_TABLE' || err.errno === 1146)) {
      await ensureServicesTable();
      return await db.execute(sql, params);
    }
    throw err;
  }
}

async function seedIfEmpty() {
  const [rows] = await execWithAutoCreate('SELECT COUNT(*) AS totalCount FROM services', []);
  const total = rows[0]?.totalCount || 0;
  if (total > 0) return;

  for (const s of DEFAULT_SERVICES) {
    await execWithAutoCreate(
      'INSERT INTO services (slug, title, shortText, iconKey, bulletsJson, outcomesJson, contentHtml, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        s.slug,
        s.title,
        s.short || '',
        s.iconKey || '',
        JSON.stringify(s.bullets || []),
        JSON.stringify(s.outcomes || []),
        s.contentHtml || '',
      ],
    );
  }
}

function normalizeRow(row) {
  if (!row) return null;

  let bullets = [];
  let outcomes = [];
  try {
    bullets = row.bulletsJson ? JSON.parse(row.bulletsJson) : [];
  } catch {
    bullets = [];
  }
  try {
    outcomes = row.outcomesJson ? JSON.parse(row.outcomesJson) : [];
  } catch {
    outcomes = [];
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    short: row.shortText || '',
    iconKey: row.iconKey || '',
    bullets,
    outcomes,
    contentHtml: row.contentHtml || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

const Services = {
  getAll: async () => {
    await seedIfEmpty();
    const [rows] = await execWithAutoCreate('SELECT * FROM services ORDER BY id ASC', []);
    return rows.map(normalizeRow);
  },

  getAllByPage: async (limit, pageNo, searchtxt) => {
    await seedIfEmpty();

    const offset = (pageNo - 1) * limit;
    let query = 'SELECT * FROM services';
    const params = [];

    if (searchtxt) {
      query += ' WHERE title LIKE ? OR slug LIKE ?';
      params.push(`%${searchtxt}%`, `%${searchtxt}%`);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [results] = await execWithAutoCreate(query, params);

    let countQuery = 'SELECT COUNT(*) AS totalCount FROM services';
    const countParams = [];
    if (searchtxt) {
      countQuery += ' WHERE title LIKE ? OR slug LIKE ?';
      countParams.push(`%${searchtxt}%`, `%${searchtxt}%`);
    }

    const [totalCountResults] = await execWithAutoCreate(countQuery, countParams);
    const totalCount = totalCountResults[0]?.totalCount || 0;

    return {
      status: 'success',
      data: results.map(normalizeRow),
      totalCount,
    };
  },

  getBySlug: async (slug) => {
    await seedIfEmpty();
    const [rows] = await execWithAutoCreate('SELECT * FROM services WHERE slug = ? LIMIT 1', [slug]);
    return normalizeRow(rows[0] || null);
  },

  create: async (data) => {
    const sql =
      'INSERT INTO services (slug, title, shortText, iconKey, bulletsJson, outcomesJson, contentHtml, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
    const [results] = await execWithAutoCreate(sql, [
      data.slug || '',
      data.title || '',
      data.short || '',
      data.iconKey || '',
      JSON.stringify(data.bullets || []),
      JSON.stringify(data.outcomes || []),
      data.contentHtml || '',
    ]);
    return results;
  },

  update: async (id, data) => {
    const sqlUpdate =
      'UPDATE services SET slug = ?, title = ?, shortText = ?, iconKey = ?, bulletsJson = ?, outcomesJson = ?, contentHtml = ?, updated_at = NOW() WHERE id = ?';

    await execWithAutoCreate(sqlUpdate, [
      data.slug || '',
      data.title || '',
      data.short || '',
      data.iconKey || '',
      JSON.stringify(data.bullets || []),
      JSON.stringify(data.outcomes || []),
      data.contentHtml || '',
      id,
    ]);

    const [rows] = await execWithAutoCreate('SELECT * FROM services WHERE id = ? LIMIT 1', [id]);
    return {
      status: 'success',
      data: normalizeRow(rows[0] || null),
    };
  },

  delete: async (id) => {
    const [results] = await execWithAutoCreate('DELETE FROM services WHERE id = ?', [id]);
    return results;
  },
};

module.exports = Services;
