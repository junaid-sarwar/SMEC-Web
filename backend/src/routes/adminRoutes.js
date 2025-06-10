// routes/adminRoutes.js - Admin API routes

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// POST /admins - Register admin
router.post('/', authenticateToken, isAdmin, adminController.createAdmin);  // Only existing admins can create new admins

// POST /admin-login - Login admin (this endpoint is actually defined in server.js and points to this controller)
router.post('/login', adminController.loginAdmin);

module.exports = router;