// controllers/userController.js - MongoDB version with Mongoose

const User = require('../models/User'); // You'll need to create this model
const UserDetails = require('../models/UserDetails'); // You'll need to create this model
const Pass = require('../models/Pass'); // You'll need to create this model
const UserPass = require('../models/UserPass'); // You'll need to create this model
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword
    });

    const savedUser = await user.save();

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: savedUser._id 
    });
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

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password exists
    if (!user.password) {
      return res.status(403).json({ error: 'No password found. Please register again.' });
    }

    // Compare hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
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

    // Create new user details document
    const userDetails = new UserDetails({
      userId,
      universityName,
      studentID,
      CNIC,
      phone
    });

    await userDetails.save();

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

    const user = await User.findById(id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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

    // Input validation - Fixed the validation fields
    if (!userId || !passId) {
      return res.status(400).json({ error: 'UserId and passId are required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if pass exists
    const pass = await Pass.findById(passId);
    if (!pass) {
      return res.status(404).json({ error: 'Pass not found' });
    }

    // Create user pass registration
    const userPass = new UserPass({
      userId,
      passId,
      quantity: quantity || 1
    });

    const savedUserPass = await userPass.save();

    res.status(201).json({
      message: 'User registered to pass successfully',
      userPassId: savedUserPass._id
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

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all passes registered by the user with pass details using populate
    const userPasses = await UserPass.find({ userId: id })
      .populate('passId', 'passName description price')
      .select('quantity');

    // Transform the data to match the expected format
    const result = userPasses.map(userPass => ({
      id: userPass.passId._id,
      passName: userPass.passId.passName,
      description: userPass.passId.description,
      price: userPass.passId.price,
      quantity: userPass.quantity
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user passes:', error.message);
    res.status(500).json({ error: 'Failed to fetch user passes' });
  }
};

// GET /users/me - Return current authenticated user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('fullName email');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ 
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};