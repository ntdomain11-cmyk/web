const Newsletter = require('../models/newsletterModel');

exports.subscribe = async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim();
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return res.status(400).json({ error: 'Invalid email' });

    await Newsletter.create(email);
    return res.status(201).json({ status: 'success' });
  } catch (err) {
    console.error('Error subscribing to newsletter:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const l = Number(limit) || 20;
    const p = Number(page) || 1;

    const { data, totalCount } = await Newsletter.list(l, p);
    return res.status(200).json({
      status: 'success',
      data,
      totalCount,
      totalPages: Math.ceil(totalCount / l),
      currentPage: p,
    });
  } catch (err) {
    console.error('Error listing newsletter subscriptions:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.exportCsv = async (req, res) => {
  try {
    const rows = await Newsletter.listAll();

    const header = 'id,email,created_at';
    const body = rows
      .map((r) => {
        const safeEmail = String(r.email || '').replace(/"/g, '""');
        const created = r.created_at ? new Date(r.created_at).toISOString() : '';
        return `${r.id},"${safeEmail}",${created}`;
      })
      .join('\n');

    const csv = `${header}\n${body}`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter_subscriptions.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    console.error('Error exporting newsletter CSV:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
