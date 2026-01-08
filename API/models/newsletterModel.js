const db = require('../config/db');

let ensured = false;

async function ensureNewsletterTable() {
  if (ensured) return;

  await db.execute(
    `CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  );

  ensured = true;
}

async function execWithAutoCreate(sql, params) {
  try {
    return await db.execute(sql, params);
  } catch (err) {
    if (err && (err.code === 'ER_NO_SUCH_TABLE' || err.errno === 1146)) {
      await ensureNewsletterTable();
      return await db.execute(sql, params);
    }
    throw err;
  }
}

const Newsletter = {
  create: async (email) => {
    await ensureNewsletterTable();
    const [result] = await execWithAutoCreate(
      'INSERT INTO newsletter_subscriptions (email, created_at) VALUES (?, NOW())',
      [email],
    );
    return result;
  },

  list: async (limit, page) => {
    await ensureNewsletterTable();
    const offset = (page - 1) * limit;
    const [rows] = await execWithAutoCreate(
      'SELECT * FROM newsletter_subscriptions ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset],
    );
    const [countRows] = await execWithAutoCreate(
      'SELECT COUNT(*) AS totalCount FROM newsletter_subscriptions',
      [],
    );
    const totalCount = countRows[0]?.totalCount || 0;
    return { data: rows, totalCount };
  },

  listAll: async () => {
    await ensureNewsletterTable();
    const [rows] = await execWithAutoCreate(
      'SELECT * FROM newsletter_subscriptions ORDER BY created_at DESC',
      [],
    );
    return rows;
  },
};

module.exports = Newsletter;
