const VideoTestimonials = require('../models/videoTestimonialsModel')

exports.getAllVideoTestimonials = async (req, res) => {
  try {
    const rows = await VideoTestimonials.getAllPublic()
    res.status(200).json({ status: 'success', data: rows })
  } catch (err) {
    console.error('Error fetching video testimonials:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.getAllVideoTestimonialsByPage = async (req, res) => {
  try {
    const { limit = 10, page = 1, searchtxt = '' } = req.query
    const results = await VideoTestimonials.getAllByPage(Number(limit), Number(page), searchtxt)

    res.status(200).json({
      status: 'success',
      data: results.data,
      totalCount: results.totalCount,
      totalPages: Math.ceil(results.totalCount / limit),
      currentPage: page,
    })
  } catch (err) {
    console.error('Error fetching video testimonials by page:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.createVideoTestimonial = async (req, res) => {
  try {
    const payload = { ...req.body }
    if (!payload.videoUrl) return res.status(400).json({ error: 'videoUrl is required' })

    const result = await VideoTestimonials.create(payload)
    res.status(201).json({ message: 'Video testimonial created', id: result.insertId })
  } catch (err) {
    console.error('Error creating video testimonial:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.updateVideoTestimonial = async (req, res) => {
  try {
    const id = req.params.id
    const payload = { ...req.body }
    if (!payload.videoUrl) return res.status(400).json({ error: 'videoUrl is required' })

    await VideoTestimonials.update(id, payload)
    res.status(200).json({ message: 'Video testimonial updated' })
  } catch (err) {
    console.error('Error updating video testimonial:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.deleteVideoTestimonial = async (req, res) => {
  try {
    const id = req.params.id
    await VideoTestimonials.delete(id)
    res.status(200).json({ message: 'Video testimonial deleted' })
  } catch (err) {
    console.error('Error deleting video testimonial:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
