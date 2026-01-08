const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const User = require('../models/User');

router.get('/emails', async (req, res) => {
  try {
    // 1️⃣ Get JWT
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Fetch user
    const user = await User.findById(decoded.id);
    if (!user || !user.googleRefreshToken) {
      return res
        .status(401)
        .json({ message: 'Google authentication missing. Re-login required.' });
    }

    // 4️⃣ OAuth client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    // 5️⃣ Set credentials (IMPORTANT)
    oAuth2Client.setCredentials({
      access_token: decoded.googleAccessToken,
      refresh_token: user.googleRefreshToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    // 6️⃣ Date filter
    const date = req.query.date;

    let query = 'newer_than:1d'; // default → today

    if (date) {
      // Start of selected day
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      // Start of next day
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const after = Math.floor(start.getTime() / 1000);
      const before = Math.floor(end.getTime() / 1000);

      query = `after:${after} before:${before}`;
    }

    // 7️⃣ Fetch emails
    const list = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 50
    });

    const messages = list.data.messages || [];
    if (!messages.length) {
      return res.json({ emails: [] });
    }

    // 8️⃣ Read emails
    const emails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        });

        const headers = detail.data.payload.headers;

        return {
          id: msg.id,
          subject: headers.find(h => h.name === 'Subject')?.value || '',
          from: headers.find(h => h.name === 'From')?.value || '',
          snippet: detail.data.snippet
        };
      })
    );

    res.json({ emails });
  } catch (err) {
    console.error('Gmail error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'JWT expired' });
    }

    res.status(500).json({ message: 'Failed to fetch emails' });
  }
});

module.exports = router;



