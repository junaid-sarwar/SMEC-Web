// Modified controllers/userController.js to work with your poolPromise

const { sql, poolPromise } = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// POST /users/register - Register a new user
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await poolPromise;

    // Check if user already exists
    const checkResult = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM AuthUsers WHERE email = @email');

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Insert into Users table
    const result = await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
        INSERT INTO AuthUsers (fullName, email, password)
        OUTPUT INSERTED.id
        VALUES (@fullName, @email, @password)
      `);

    res.status(201).json({ message: 'User registered successfully', userId: result.recordset[0].id });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};


// POST /users/login - User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const pool = await poolPromise;

    // ✅ Correct SQL: fetch user by email only
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM AuthUsers WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.recordset[0];

    // Check if password exists
    if (!user.password) {
      return res.status(403).json({ error: 'No password found. Please register again.' });
    }

    // ✅ Compare hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Respond with token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
};

// POST /users/details - Save user profile details
exports.saveUserDetails = async (req, res) => {
  try {
    const { userId, universityName, studentID, CNIC, phone } = req.body;

    const pool = await poolPromise;

    // Insert additional details
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('universityName', sql.NVarChar, universityName)
      .input('studentID', sql.NVarChar, studentID)
      .input('CNIC', sql.NVarChar, CNIC)
      .input('phone', sql.NVarChar, phone)
      .query(`
        INSERT INTO UserDetails (userId, universityName, studentID, CNIC, phone)
        VALUES (@userId, @universityName, @studentID, @CNIC, @phone)
      `);

    res.status(200).json({ message: 'Details saved successfully' });
  } catch (error) {
    console.error('Error saving user details:', error.message);
    res.status(500).json({ error: 'Failed to save details' });
  }
};



// Get user details by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM AuthUsers WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive information if needed
    const user = result.recordset[0];

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// Register user to pass
exports.registerUserPass = async (req, res) => {
  try {
    const { userId, passId, quantity } = req.body;

    // Input validation
    if (!userId || !universityName || !studentID || !CNIC || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const pool = await poolPromise;

    // Check if user exists
    const userResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT id FROM AuthUsers WHERE id = @userId');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if pass exists
    const passResult = await pool.request()
      .input('passId', sql.Int, passId)
      .query('SELECT id FROM Passes WHERE id = @passId');

    if (passResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Pass not found' });
    }

    // Insert user pass registration
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('passId', sql.Int, passId)
      .input('quantity', sql.Int, quantity || 1)
      .query(`
        INSERT INTO UserPasses (userId, passId, quantity)
        OUTPUT INSERTED.id
        VALUES (@userId, @passId, @quantity)
      `);

    const userPassId = result.recordset[0].id;

    res.status(201).json({
      message: 'User registered to pass successfully',
      userPassId
    });
  } catch (error) {
    console.error('Error registering user to pass:', error.message);
    res.status(500).json({ error: 'Failed to register user to pass' });
  }
};

// Get all passes registered by a user
exports.getUserPasses = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    // Check if user exists
    const userResult = await pool.request()
      .input('userId', sql.Int, id)
      .query('SELECT id FROM AuthUsers WHERE id = @userId');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all passes registered by the user with pass details
    const result = await pool.request()
      .input('userId', sql.Int, id)
      .query(`
        SELECT p.id, p.passName, p.description, p.price, up.quantity
        FROM UserPasses up
        JOIN Passes p ON up.passId = p.id
        WHERE up.userId = @userId
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching user passes:', error.message);
    res.status(500).json({ error: 'Failed to fetch user passes' });
  }
};

// GET /users/me - Return current authenticated user
exports.getCurrentUser = async (req, res) => {
  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query('SELECT id, fullName, email FROM AuthUsers WHERE id = @userId')

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.json({ user: result.recordset[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
