const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const User = require('./models/User');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes'); // Task management routes
const authRoutes = require('./routes/auth'); // Authentication routes
const eisenhowerRoutes = require('./routes/Eisenhower'); // Eisenhower matrix routes
const milestoneRoutes = require('./routes/milestones');
const priorityTaskRoutes = require('./routes/priorityTasks'); // Add priority task routes
dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/tasks', taskRoutes); // Task management routes
app.use('/api/eisenhower', eisenhowerRoutes); // Eisenhower matrix routes
app.use('/api/milestones', milestoneRoutes);
app.use('/api/priority-tasks', priorityTaskRoutes); // Priority Task routes

// Profile Update Route
app.put('/api/user/profile', async (req, res) => {
  const { userId, name, email, password } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If password is being updated, hash it
    let updatedPassword = password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }

    // Update the user's data
    user.name = name || user.name;
    user.email = email || user.email;
    if (updatedPassword) {
      user.password = updatedPassword; // Save the hashed password
    }

    // Save the updated user to the database
    const updatedUser = await user.save();

    res.json(updatedUser); // Return the updated user object
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Set up server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
