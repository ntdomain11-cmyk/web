const express = require('express')
const router = express.Router()
const controller = require('../controllers/googleReviewsController')

router.get('/getReviews', controller.getReviews)

module.exports = router
