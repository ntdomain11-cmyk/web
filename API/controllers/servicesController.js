const Services = require('../models/servicesModel');

function toSlug(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.getAllServices = async (req, res) => {
  try {
    const rows = await Services.getAll();
    res.status(200).json({ status: 'success', data: rows });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllServicesByPage = async (req, res) => {
  try {
    const { limit = 10, page = 1, searchtxt = '' } = req.query;
    const results = await Services.getAllByPage(Number(limit), Number(page), searchtxt);

    res.status(200).json({
      status: 'success',
      data: results.data,
      totalCount: results.totalCount,
      totalPages: Math.ceil(results.totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Error fetching services by page:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const row = await Services.getBySlug(slug);
    if (!row) return res.status(404).json({ error: 'Service not found' });
    return res.status(200).json({ status: 'success', data: row });
  } catch (err) {
    console.error('Error fetching service by slug:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createService = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug && payload.title) payload.slug = toSlug(payload.title);

    const result = await Services.create(payload);
    res.status(201).json({ message: 'Service created', id: result.insertId });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = { ...req.body };
    if (!payload.slug && payload.title) payload.slug = toSlug(payload.title);

    const result = await Services.update(id, payload);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    await Services.delete(id);
    res.status(200).json({ message: 'Service deleted' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
