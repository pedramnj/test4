const express = require('express');
const router = express.Router();
const bagsController = require('../controllers/bagsController');

// Get all available bags
router.get('/', bagsController.getAllBags);

// Reserve a bag
router.post('/reserve', bagsController.reserveBag);

module.exports = router;
