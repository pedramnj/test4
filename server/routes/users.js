const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Register a new user
router.post('/register', usersController.registerUser);

// User login
router.post('/login', usersController.loginUser);

module.exports = router;
