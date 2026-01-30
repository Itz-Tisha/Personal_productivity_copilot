const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'TOKEN_EXPIRED' });
  }
  return res.status(401).json({ message: 'INVALID_TOKEN' });
  }
});

module.exports = router;