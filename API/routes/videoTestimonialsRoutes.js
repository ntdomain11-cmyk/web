const express = require('express')
const router = express.Router()
const controller = require('../controllers/videoTestimonialsController')
const { auth } = require('../middlewares/auth.js')

// Public
router.get('/getAllVideoTestimonials', controller.getAllVideoTestimonials)

// Admin
router.get('/getAllVideoTestimonialsByPage', auth, controller.getAllVideoTestimonialsByPage)
router.post('/createVideoTestimonial', auth, controller.createVideoTestimonial)
router.put('/updateVideoTestimonial/:id', auth, controller.updateVideoTestimonial)
router.delete('/deleteVideoTestimonial/:id', auth, controller.deleteVideoTestimonial)

module.exports = router
