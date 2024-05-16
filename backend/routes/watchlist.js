// Import necessary modules
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Watchlist = require('../models/Watchlist');
const axios = require('axios');

// Middleware to authenticate the user
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Get the user's watchlist
router.get('/', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) {
      return res.status(404).json({ message: 'No watchlist found' });
    }
    res.json(watchlist.symbols);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add symbol to the user's watchlist
router.post('/', auth, async (req, res) => {
  const { symbol } = req.body;
  const userId = req.user.id;

  try {
    let watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      watchlist = new Watchlist({ userId, symbols: [symbol] });
    } else {
      if (!watchlist.symbols.includes(symbol)) {
        watchlist.symbols.push(symbol);
      }
    }
    await watchlist.save();
    res.json(watchlist.symbols);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Fetch stock data for user's watchlist symbols
router.get('/stocks', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) {
      return res.status(404).json({ message: 'No watchlist found' });
    }

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const promises = watchlist.symbols.map(symbol => 
      axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol,
          interval: '1min',
          apikey: apiKey
        }
      })
    );

    const results = await Promise.all(promises);
    const stockData = results.map(res => res.data);
    res.json(stockData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete symbol(s) from the user's watchlist
router.delete('/', auth, async (req, res) => {
  const { symbols } = req.body;
  const userId = req.user.id;

  try {
    const watchlist = await Watchlist.findOneAndUpdate(
      { userId },
      { $pull: { symbols: { $in: symbols } } },
      { new: true }
    );

    if (!watchlist) {
      return res.status(404).json({ message: 'No watchlist found' });
    }

    res.json(watchlist.symbols);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
