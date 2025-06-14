const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { getCurrentUser } = require('../controllers/userController');

// Register route
router.post('/register', userController.createUser);

// Login route
router.post('/login', userController.loginUser);

// ✅ ADD THIS LINE for saving user details
router.post('/details', userController.saveUserDetails);

// Authenticated routes
router.get('/me', authenticateToken, getCurrentUser);
router.get('/:id', authenticateToken, userController.getUserById);
router.get('/:id/passes', authenticateToken, userController.getUserPasses);
router.post('/user-passes', userController.registerUserPass);

module.exports = router;
