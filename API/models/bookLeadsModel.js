const db = require('../config/db')

async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS book_leads (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      phone VARCHAR(40) NOT NULL,
      email VARCHAR(180) NOT NULL,
      company VARCHAR(180) NOT NULL,
      service VARCHAR(120) NOT NULL,
      preferred_time VARCHAR(80) NOT NULL,
      notes TEXT NOT NULL,
      ip VARCHAR(64) NULL,
      user_agent VARCHAR(512) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_book_leads_created_at (created_at),
      INDEX idx_book_leads_email (email),
      INDEX idx_book_leads_phone (phone)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

const BookLeads = {
  create: async (data) => {
    await ensureTable()

    const sql = `
      INSERT INTO book_leads (name, phone, email, company, service, preferred_time, notes, ip, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [result] = await db.execute(sql, [
      data.name,
      data.phone,
      data.email,
      data.company,
      data.service,
      data.preferredTime,
      data.notes,
      data.ip || null,
      data.userAgent || null,
    ])

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
      where = 'WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR notes LIKE ?'
      params = [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    }

    const [rows] = await db.execute(
      `SELECT * FROM book_leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, l, offset],
    )

    const [countRows] = await db.execute(`SELECT COUNT(*) AS totalCount FROM book_leads ${where}`, params)
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

module.exports = BookLeads
