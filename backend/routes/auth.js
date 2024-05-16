const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fhudfyuyh487r8owiifru04'; // Define JWT_SECRET or use a default value

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate username and password
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt.hash instead of bcryptjs.hashSync
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Respond with success message
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    // Handle any errors
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate username and password
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Use bcrypt.compare instead of bcryptjs.compareSync
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
