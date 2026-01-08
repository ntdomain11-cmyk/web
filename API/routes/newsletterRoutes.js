const express = require('express');
const router = express.Router();
const NewsletterController = require('../controllers/newsletterController');
const { auth } = require('../middlewares/auth');

router.post('/subscribe', NewsletterController.subscribe);
router.get('/list', auth, NewsletterController.list);
router.get('/export', auth, NewsletterController.exportCsv);

module.exports = router;
