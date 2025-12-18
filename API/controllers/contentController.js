const Content = require('../models/contentModel')

exports.getPageContent = async (req, res) => {
  const page = req.params.page
  try {
    const results = await Content.getBySlug(page)
    res.status(200).json(results)
  } catch (err) {
    console.error('Error fetching page content:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.upsertPageContent = async (req, res) => {
  const page = req.params.page
  try {
    const results = await Content.upsert(page, req.body)
    res.status(200).json(results)
  } catch (err) {
    console.error('Error saving page content:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
