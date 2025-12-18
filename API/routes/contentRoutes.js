const express = require('express')
const router = express.Router()
const ContentController = require('../controllers/contentController')
const { auth } = require('../middlewares/auth.js')

router.get('/:page', ContentController.getPageContent)
router.put('/:page', auth, ContentController.upsertPageContent)

module.exports = router
