const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mock API call to fetch stock data
router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;
  
  // Replace with actual API call to a stock data provider
  try {
    const response = await axios.get(`https://api.example.com/stocks/${symbol}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data' });
  }
});

module.exports = router;
