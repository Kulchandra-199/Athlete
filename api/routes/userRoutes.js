const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

// Register a new user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

router.post('./logout', userController.logout)

module.exports = router;