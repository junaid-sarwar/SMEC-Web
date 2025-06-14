const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // ✅

connectDB(); // ✅ Connect to MongoDB

const userRoutes = require('./src/routes/userRoutes');
const passRoutes = require('./src/routes/passRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('Event Pass Management System API is Running');
});

app.use('/users', userRoutes);
app.use('/passes', passRoutes);
app.use('/events', eventRoutes);
app.use('/admins', adminRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});

