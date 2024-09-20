const express = require('express');
const bcrypt = require('bcrypt'); // Use bcrypt instead of bcryptjs if desired
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = 'fhudfyuyh487r8owiifru04'; // Define JWT_SECRET or use a default value

router.get('/', (req, res) => {
  console.log('This is Ashish calling');
  res.send('This is bnlkdsfjhiunnnro');
});

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
    console.log(password);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password.trim(), 10); // Ensure password is trimmed before hashing
    const newUser = new User({ username, password:hashedPassword });
    await newUser.save();

    // Respond with success message
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const trimmedPassword = password.trim();
    console.log(`Entered Password (trimmed): ${trimmedPassword}`);
    console.log(`Stored Hashed Password: ${user.password}`);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Is Password Match: ${isMatch}`);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
