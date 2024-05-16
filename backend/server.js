const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

mongoose.connect('mongodb+srv://ashish:ashish@stock-monitoring.sqsfdna.mongodb.net/stock-monitoring?retryWrites=true&w=majority&appName=stock-monitoring')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlist');

app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
