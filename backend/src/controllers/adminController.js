// Modified controllers/adminController.js to work with MongoDB
const Admin = require('../models/Admin'); // You'll need to create this model
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
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      return res.status(409).json({ error: 'Admin with this email already exists' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      passwordHash,
      role: role || 'admin'
    });
    
    const savedAdmin = await newAdmin.save();
    
    res.status(201).json({
      message: 'Admin created successfully',
      adminId: savedAdmin._id
    });
  } catch (error) {
    console.error('Error creating admin:', error.message);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Admin with this email already exists' });
    }
    
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
    
    // Find admin by email
    const admin = await Admin.findOne({ email }).select('+passwordHash');
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
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

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, '-passwordHash'); // Exclude password hash
    
    res.status(200).json({
      message: 'Admins retrieved successfully',
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error('Error getting admins:', error.message);
    res.status(500).json({ error: 'Failed to retrieve admins' });
  }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const admin = await Admin.findById(id, '-passwordHash');
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    res.status(200).json({
      message: 'Admin retrieved successfully',
      admin
    });
  } catch (error) {
    console.error('Error getting admin by ID:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid admin ID format' });
    }
    
    res.status(500).json({ error: 'Failed to retrieve admin' });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!updatedAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    res.status(200).json({
      message: 'Admin updated successfully',
      admin: updatedAdmin
    });
  } catch (error) {
    console.error('Error updating admin:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid admin ID format' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to update admin' });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    res.status(200).json({
      message: 'Admin deleted successfully',
      adminId: deletedAdmin._id
    });
  } catch (error) {
    console.error('Error deleting admin:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid admin ID format' });
    }
    
    res.status(500).json({ error: 'Failed to delete admin' });
  }
};

// Change admin password
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    const admin = await Admin.findById(id).select('+passwordHash');
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    admin.passwordHash = newPasswordHash;
    await admin.save();
    
    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid admin ID format' });
    }
    
    res.status(500).json({ error: 'Failed to change password' });
  }
};