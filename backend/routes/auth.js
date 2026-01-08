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

// 🔹 Redirect to Google
router.get('/login', (req, res) => {
  const mode = req.query.mode; // login | signup

  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/gmail.readonly'
    ],
    state: mode
  });

  res.redirect(url);
});

// 🔹 Google callback
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();

    let user = await User.findOne({ googleId: data.id });

    // LOGIN
    if (state === 'login' && !user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=NO_ACCOUNT`
      );
    }

    // SIGNUP
    if (state === 'signup') {
      if (user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=ALREADY_EXISTS`
        );
      }

      user = await User.create({
        googleId: data.id,
        name: data.name,
        email: data.email,
        googleRefreshToken: tokens.refresh_token
      });
    }

    // Update refresh token if missing
    if (!user.googleRefreshToken && tokens.refresh_token) {
      user.googleRefreshToken = tokens.refresh_token;
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id,
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || user.googleRefreshToken
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/home?token=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('OAuth failed');
  }
});

module.exports = router;
