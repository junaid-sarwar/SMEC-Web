// routes/userRoutes.js - User API routes

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { getCurrentUser } = require('../controllers/userController')

// POST /users - Register a user
router.post('/register', userController.createUser);

router.get('/me', authenticateToken, getCurrentUser)

// GET /users/:id - Get user details
router.get('/:id', authenticateToken, userController.getUserById);

// POST /user-passes - Register user to pass (this endpoint is actually defined in server.js and points to this controller)
router.post('/user-passes', userController.registerUserPass);

// GET /users/:id/passes - Get all passes registered by a user
router.get('/:id/passes', authenticateToken, userController.getUserPasses);

router.post('/login', userController.loginUser);




module.exports = router;