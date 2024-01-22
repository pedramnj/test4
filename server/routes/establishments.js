const express = require('express');
const router = express.Router();
const establishmentsController = require('../controllers/establishmentsController');

// Get all establishments
router.get('/', establishmentsController.getAllEstablishments);

module.exports = router;
