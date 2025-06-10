// routes/passRoutes.js - Pass API routes

const express = require('express');
const router = express.Router();
const passController = require('../controllers/passController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// POST /passes - Add a pass
router.post('/', authenticateToken, isAdmin, passController.createPass);

// GET /passes/:id - Get pass details
router.get('/:id', passController.getPassById);

// GET /passes/:id/events - Get all events related to a pass
router.get('/:id/events', passController.getPassEvents);

module.exports = router;