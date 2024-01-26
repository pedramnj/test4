const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add a bag to the cart
router.post('/add', cartController.addToCart);

// Remove a bag from the cart
router.post('/remove', cartController.removeFromCart);

// Confirm reservation of the cart items
router.post('/confirm', cartController.confirmReservation);

router.get('/carts/:userId', cartController.fetchCart);
//  

 router.post('/update-item', cartController.updateCartItemQuantity);

 router.get('/reserved/:userId', cartController.fetchReservedBags);
 
 router.post('/cancel-reservation', cartController.cancelReservation);


module.exports = router;
