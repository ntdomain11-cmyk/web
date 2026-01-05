const db = require('../config/db')

let ensured = false

async function ensureVideoTestimonialsTable() {
  if (ensured) return

  await db.execute(
    `CREATE TABLE IF NOT EXISTS video_testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(180) NULL,
      designation VARCHAR(180) NULL,
      title VARCHAR(255) NULL,
      videoUrl TEXT NOT NULL,
      thumbnailUrl TEXT NULL,
      sortOrder INT DEFAULT 0,
      isActive TINYINT(1) DEFAULT 1,
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
      await ensureVideoTestimonialsTable()
      return await db.execute(sql, params)
    }
    throw err
  }
}

function mapRow(r) {
  if (!r) return r
  return {
    ...r,
    isActive: r.isActive === 1 || r.isActive === true,
    sortOrder: typeof r.sortOrder === 'number' ? r.sortOrder : Number(r.sortOrder || 0),
  }
}

async function getAllPublic() {
  const [rows] = await execWithAutoCreate(
    'SELECT id, name, designation, title, videoUrl, thumbnailUrl, sortOrder, isActive, created_at, updated_at FROM video_testimonials WHERE isActive = 1 ORDER BY sortOrder DESC, id DESC',
    [],
  )
  return rows.map(mapRow)
}

async function getAllByPage(limit, page, searchtxt) {
  const l = Math.max(1, Number(limit) || 10)
  const p = Math.max(1, Number(page) || 1)
  const offset = (p - 1) * l
  const q = `%${String(searchtxt || '').trim()}%`

  const [countRows] = await execWithAutoCreate(
    'SELECT COUNT(*) AS totalCount FROM video_testimonials WHERE (name LIKE ? OR designation LIKE ? OR title LIKE ? OR videoUrl LIKE ?)',
    [q, q, q, q],
  )

  const totalCount = countRows[0]?.totalCount || 0

  const [rows] = await execWithAutoCreate(
    'SELECT id, name, designation, title, videoUrl, thumbnailUrl, sortOrder, isActive, created_at, updated_at FROM video_testimonials WHERE (name LIKE ? OR designation LIKE ? OR title LIKE ? OR videoUrl LIKE ?) ORDER BY sortOrder DESC, id DESC LIMIT ? OFFSET ?',
    [q, q, q, q, l, offset],
  )

  return { data: rows.map(mapRow), totalCount }
}

async function create(payload) {
  const name = payload?.name || null
  const designation = payload?.designation || null
  const title = payload?.title || null
  const videoUrl = payload?.videoUrl
  const thumbnailUrl = payload?.thumbnailUrl || null
  const sortOrder = Number(payload?.sortOrder || 0)
  const isActive = payload?.isActive === false ? 0 : 1

  const [result] = await execWithAutoCreate(
    'INSERT INTO video_testimonials (name, designation, title, videoUrl, thumbnailUrl, sortOrder, isActive, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [name, designation, title, videoUrl, thumbnailUrl, sortOrder, isActive],
  )

  return result
}

async function update(id, payload) {
  const name = payload?.name ?? null
  const designation = payload?.designation ?? null
  const title = payload?.title ?? null
  const videoUrl = payload?.videoUrl
  const thumbnailUrl = payload?.thumbnailUrl ?? null
  const sortOrder = Number(payload?.sortOrder || 0)
  const isActive = payload?.isActive === false ? 0 : 1

  const [result] = await execWithAutoCreate(
    'UPDATE video_testimonials SET name=?, designation=?, title=?, videoUrl=?, thumbnailUrl=?, sortOrder=?, isActive=? WHERE id=?',
    [name, designation, title, videoUrl, thumbnailUrl, sortOrder, isActive, id],
  )

  return result
}

async function remove(id) {
  const [result] = await execWithAutoCreate('DELETE FROM video_testimonials WHERE id=?', [id])
  return result
}

module.exports = {
  getAllPublic,
  getAllByPage,
  create,
  update,
  delete: remove,
}
