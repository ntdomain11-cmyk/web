const express = require('express')
const router = express.Router()
const leadsController = require('../controllers/leadsController')
const { auth } = require('../middlewares/auth.js')

// Public
router.post('/contact', leadsController.submitContactLead)
router.post('/book', leadsController.submitBookLead)

// Admin
router.get('/contact/getAllByPage', auth, leadsController.getContactLeadsByPage)
router.get('/book/getAllByPage', auth, leadsController.getBookLeadsByPage)

module.exports = router
