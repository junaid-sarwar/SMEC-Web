// Modified controllers/eventController.js to work with your poolPromise

const { sql, poolPromise } = require('../../config/db');

// Add a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, location, eventDate, startTime, endTime, passId } = req.body;
    
    // Input validation
    if (!title || !eventDate || !passId) {
      return res.status(400).json({ error: 'Title, event date, and pass ID are required' });
    }
    
    const pool = await poolPromise;
    
    // Check if pass exists
    const passResult = await pool.request()
      .input('passId', sql.Int, passId)
      .query('SELECT id FROM Passes WHERE id = @passId');
    
    if (passResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    // Insert new event
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('location', sql.NVarChar, location || null)
      .input('eventDate', sql.Date, new Date(eventDate))
      .input('startTime', sql.Time, startTime || null)
      .input('endTime', sql.Time, endTime || null)
      .input('passId', sql.Int, passId)
      .query(`
        INSERT INTO Events (title, location, eventDate, startTime, endTime, passId)
        OUTPUT INSERTED.id
        VALUES (@title, @location, @eventDate, @startTime, @endTime, @passId)
      `);
    
    const eventId = result.recordset[0].id;
    
    res.status(201).json({
      message: 'Event created successfully',
      eventId
    });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get all events (optional endpoint)
exports.getAllEvents = async (req, res) => {
  try {
    const pool = await poolPromise;
    
    const result = await pool.request()
      .query(`
        SELECT e.id, e.title, e.location, e.eventDate, e.startTime, e.endTime, 
               p.id as passId, p.passName
        FROM Events e
        JOIN Passes p ON e.passId = p.id
      `);
    
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get event by ID (optional endpoint)
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT e.id, e.title, e.location, e.eventDate, e.startTime, e.endTime, 
               p.id as passId, p.passName
        FROM Events e
        JOIN Passes p ON e.passId = p.id
        WHERE e.id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching event:', error.message);
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
};