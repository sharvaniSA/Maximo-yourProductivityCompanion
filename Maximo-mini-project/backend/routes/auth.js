const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = 'sa2901';

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// Profile update route (PUT)
router.put('/profile', async (req, res) => {
  const { name, email, password } = req.body;
  const { userId } = req.user;  // The userId is added to the request by the JWT middleware

  try {
    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update name and email
    if (name) user.name = name;
    if (email) user.email = email;

    // If password is provided, hash and update it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err });
  }
});

// Middleware to verify JWT and extract user information
router.use('/profile', async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authorization token required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Save user info (userId) to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
