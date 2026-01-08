const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// 🔹 CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// 🔹 Middlewares
app.use(express.json()); // for parsing application/json
app.use(cookieParser());

// 🔹 MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 🔹 Routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/gmail', require('./routes/gmail'));       // Gmail fetch route

// 🔹 AI Routes for Summarize & Categorize
app.use('/gmail', require('./routes/aiActions'));    // Summarize & Categorize route

// 🔹 Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
