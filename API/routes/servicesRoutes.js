const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const { auth } = require('../middlewares/auth.js');

// Public
router.get('/getAllServices', servicesController.getAllServices);
router.get('/getServiceBySlug/:slug', servicesController.getServiceBySlug);

// Admin
router.get('/getAllServicesByPage', auth, servicesController.getAllServicesByPage);
router.post('/createService', auth, servicesController.createService);
router.put('/updateService/:id', auth, servicesController.updateService);
router.delete('/deleteService/:id', auth, servicesController.deleteService);

module.exports = router;
