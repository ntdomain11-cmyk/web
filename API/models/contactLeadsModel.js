const db = require('../config/db')

async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_leads (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(180) NOT NULL,
      message TEXT NOT NULL,
      ip VARCHAR(64) NULL,
      user_agent VARCHAR(512) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_contact_leads_created_at (created_at),
      INDEX idx_contact_leads_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

const ContactLeads = {
  create: async (data) => {
    await ensureTable()

    const sql = `
      INSERT INTO contact_leads (name, email, message, ip, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `

    const [result] = await db.execute(sql, [data.name, data.email, data.message, data.ip || null, data.userAgent || null])
    return { status: 'success', data: result }
  },

  getAllByPage: async (limit, pageNo, searchtxt) => {
    await ensureTable()

    const l = Math.max(1, Number(limit) || 10)
    const p = Math.max(1, Number(pageNo) || 1)
    const offset = (p - 1) * l

    let where = ''
    let params = []

    if (searchtxt) {
      const q = String(searchtxt)
      where = 'WHERE name LIKE ? OR email LIKE ? OR message LIKE ?'
      params = [`%${q}%`, `%${q}%`, `%${q}%`]
    }

    const [rows] = await db.execute(
      `SELECT * FROM contact_leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, l, offset],
    )

    const [countRows] = await db.execute(`SELECT COUNT(*) AS totalCount FROM contact_leads ${where}`, params)
    const totalCount = Number(countRows?.[0]?.totalCount || 0)
    const totalPages = Math.max(1, Math.ceil(totalCount / l))

    return {
      status: 'success',
      data: rows,
      totalCount,
      totalPages,
      currentPage: p,
    }
  },
}

module.exports = ContactLeads
