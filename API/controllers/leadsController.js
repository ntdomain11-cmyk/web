const ContactLeads = require('../models/contactLeadsModel')
const BookLeads = require('../models/bookLeadsModel')

function pickIp(req) {
  return req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.ip || null
}

exports.submitContactLead = async (req, res) => {
  try {
    const { name, email, message } = req.body || {}

    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name is required' })
    if (!email || !String(email).trim()) return res.status(400).json({ error: 'Email is required' })
    if (!message || !String(message).trim()) return res.status(400).json({ error: 'Message is required' })

    const out = await ContactLeads.create({
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      ip: pickIp(req),
      userAgent: req.headers['user-agent'] || null,
    })

    return res.json({ status: 'success', data: out.data })
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Failed to submit lead' })
  }
}

exports.submitBookLead = async (req, res) => {
  try {
    const { name, phone, email, company, service, time, notes } = req.body || {}

    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name is required' })
    if (!phone || !String(phone).trim()) return res.status(400).json({ error: 'Phone is required' })
    if (!email || !String(email).trim()) return res.status(400).json({ error: 'Email is required' })
    if (!company || !String(company).trim()) return res.status(400).json({ error: 'Company is required' })
    if (!notes || !String(notes).trim()) return res.status(400).json({ error: 'Notes are required' })

    const out = await BookLeads.create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      company: String(company).trim(),
      service: String(service || '').trim() || 'General',
      preferredTime: String(time || '').trim() || 'Not specified',
      notes: String(notes).trim(),
      ip: pickIp(req),
      userAgent: req.headers['user-agent'] || null,
    })

    return res.json({ status: 'success', data: out.data })
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Failed to submit booking' })
  }
}

exports.getContactLeadsByPage = async (req, res) => {
  try {
    const { limit = 10, page = 1, searchtxt = '' } = req.query || {}
    const out = await ContactLeads.getAllByPage(limit, page, searchtxt)
    return res.json(out)
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Failed to load leads' })
  }
}

exports.getBookLeadsByPage = async (req, res) => {
  try {
    const { limit = 10, page = 1, searchtxt = '' } = req.query || {}
    const out = await BookLeads.getAllByPage(limit, page, searchtxt)
    return res.json(out)
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Failed to load leads' })
  }
}
