const db = require('../config/db');

let ensured = false;

async function ensureBlogsTable() {
  if (ensured) return;
  await db.execute(
    `CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      imageUrl TEXT NULL,
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
      await ensureBlogsTable();
      return await db.execute(sql, params);
    }
    throw err;
  }
}

const Blogs = {
  create: async (data) => {
    const sql = 'INSERT INTO blogs (title, imageUrl, contentHtml, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
    const [results] = await execWithAutoCreate(sql, [data.title || '', data.imageUrl || '', data.contentHtml || '']);
    return results;
  },

  getById: async (id) => {
    const [rows] = await execWithAutoCreate('SELECT * FROM blogs WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  getAllByPage: async (limit, pageNo, searchtxt) => {
    const offset = (pageNo - 1) * limit;

    let query = 'SELECT * FROM blogs';
    const params = [];

    if (searchtxt) {
      query += ' WHERE title LIKE ?';
      params.push(`%${searchtxt}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [results] = await execWithAutoCreate(query, params);

    let countQuery = 'SELECT COUNT(*) AS totalCount FROM blogs';
    const countParams = [];
    if (searchtxt) {
      countQuery += ' WHERE title LIKE ?';
      countParams.push(`%${searchtxt}%`);
    }

    const [totalCountResults] = await execWithAutoCreate(countQuery, countParams);
    const totalCount = totalCountResults[0]?.totalCount || 0;

    return {
      status: 'success',
      data: results,
      totalCount,
    };
  },

  update: async (id, data) => {
    const sqlUpdate = 'UPDATE blogs SET title = ?, imageUrl = ?, contentHtml = ?, updated_at = NOW() WHERE id = ?';
    await execWithAutoCreate(sqlUpdate, [data.title || '', data.imageUrl || '', data.contentHtml || '', id]);

    const [row] = await execWithAutoCreate('SELECT * FROM blogs WHERE id = ? LIMIT 1', [id]);
    return {
      status: 'success',
      data: row[0] || null,
    };
  },

  delete: async (id) => {
    const [results] = await execWithAutoCreate('DELETE FROM blogs WHERE id = ?', [id]);
    return results;
  },
};

module.exports = Blogs;
