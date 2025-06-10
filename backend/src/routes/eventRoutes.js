// routes/eventRoutes.js - Event API routes

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// POST /events - Add an event
router.post('/', authenticateToken, isAdmin, eventController.createEvent);

// GET /events - Get all events (optional endpoint)
router.get('/', eventController.getAllEvents);

// GET /events/:id - Get event by ID (optional endpoint)
router.get('/:id', eventController.getEventById);

module.exports = router;