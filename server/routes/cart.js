const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add a bag to the cart
router.post('/add', cartController.addToCart);

// Remove a bag from the cart
router.post('/remove', cartController.removeFromCart);

// Confirm reservation of the cart items
router.post('/confirm', cartController.confirmReservation);

module.exports = router;
