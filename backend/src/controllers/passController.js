// Modified controllers/passController.js to work with your poolPromise

const { sql, poolPromise } = require('../../config/db');

// Add a new pass
exports.createPass = async (req, res) => {
  try {
    const { passName, description, price } = req.body;
    
    // Input validation
    if (!passName || price === undefined) {
      return res.status(400).json({ error: 'Pass name and price are required' });
    }
    
    const pool = await poolPromise;
    
    // Insert new pass
    const result = await pool.request()
      .input('passName', sql.NVarChar, passName)
      .input('description', sql.NVarChar, description || null) // Changed to NVarChar since TEXT might cause issues
      .input('price', sql.Decimal(10, 2), price)
      .query(`
        INSERT INTO Passes (passName, description, price)
        OUTPUT INSERTED.id
        VALUES (@passName, @description, @price)
      `);
    
    const passId = result.recordset[0].id;
    
    res.status(201).json({
      message: 'Pass created successfully',
      passId
    });
  } catch (error) {
    console.error('Error creating pass:', error.message);
    res.status(500).json({ error: 'Failed to create pass' });
  }
};

// Get pass details by ID
exports.getPassById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Passes WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching pass:', error.message);
    res.status(500).json({ error: 'Failed to fetch pass details' });
  }
};

// Get all events related to a pass
exports.getPassEvents = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = await poolPromise;
    
    // Check if pass exists
    const passResult = await pool.request()
      .input('passId', sql.Int, id)
      .query('SELECT id FROM Passes WHERE id = @passId');
    
    if (passResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    // Get all events associated with the pass
    const result = await pool.request()
      .input('passId', sql.Int, id)
      .query(`
        SELECT id, title, location, eventDate, startTime, endTime
        FROM Events
        WHERE passId = @passId
      `);
    
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching pass events:', error.message);
    res.status(500).json({ error: 'Failed to fetch pass events' });
  }
};