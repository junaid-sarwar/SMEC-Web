// Modified index.js (server.js) to match your existing structure

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const passRoutes = require('./src/routes/passRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
// const userPassRoutes = require('./src/routes/userPassRoutes.js');
// const adminLoginRoute = require('./src/routes/adminLoginRoute');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Base route
app.get('/', (req, res) => {
    res.status(200).send('Event Pass Management System API is Running');
});

// API Routes
app.use('/users', userRoutes);
app.use('/passes', passRoutes);
// app.use('/user-passes', userPassRoutes);
app.use('/events', eventRoutes);
app.use('/admins', adminRoutes);
// app.use('/admin-login', adminLoginRoute);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});