const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BACKEND_URL}/auth/callback`
);

// 1️⃣ Redirect user to Google login
router.get('/login', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email']
  });
  res.redirect(url);
});

// // 2️⃣ Google OAuth callback
// router.get('/callback', async (req, res) => {
//   const code = req.query.code;
//   const { tokens } = await oAuth2Client.getToken(code);
//   oAuth2Client.setCredentials(tokens);

//   const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
//   const { data } = await oauth2.userinfo.get();

//   let user = await User.findOne({ googleId: data.id });
//   if (!user) {
//     user = await User.create({
//       googleId: data.id,
//       email: data.email,
//       name: data.name
//     });
//   }

//   // Create JWT
//   const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

//   // Redirect frontend with JWT
//   res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
// });



router.get('/callback', async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();

    let user = await User.findOne({ googleId: data.id });
    if (!user) {
      user = await User.create({
        googleId: data.id,
        email: data.email,
        name: data.name
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  } catch (err) {
    console.error('Callback error:', err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
