// Modified controllers/adminController.js to work with your poolPromise

const { sql, poolPromise } = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    
    const pool = await poolPromise;
    
    // Check if admin already exists
    const checkResult = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM Admins WHERE email = @email');
    
    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ error: 'Admin with this email already exists' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insert new admin
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .input('role', sql.NVarChar, role || 'admin')
      .query(`
        INSERT INTO Admins (username, email, passwordHash, role)
        OUTPUT INSERTED.id
        VALUES (@username, @email, @passwordHash, @role)
      `);
    
    const adminId = result.recordset[0].id;
    
    res.status(201).json({
      message: 'Admin created successfully',
      adminId
    });
  } catch (error) {
    console.error('Error creating admin:', error.message);
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const pool = await poolPromise;
    
    // Find admin by email
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id, username, email, passwordHash, role FROM Admins WHERE email = @email');
    
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const admin = result.recordset[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error.message);
    res.status(500).json({ error: 'Failed to login' });
  }
};