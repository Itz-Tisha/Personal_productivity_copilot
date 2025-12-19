const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

// router.get('/today', async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'No JWT' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded.googleAccessToken || !decoded.googleRefreshToken) {
//       return res.status(401).json({ message: 'Google auth expired. Please login again.' });
//     }

//     const oAuth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

//     // Set credentials
//     oAuth2Client.setCredentials({
//       access_token: decoded.googleAccessToken,
//       refresh_token: decoded.googleRefreshToken
//     });

//     // Properly refresh access token if expired
//     const tokens = await oAuth2Client.refreshAccessToken();
//     oAuth2Client.setCredentials(tokens.credentials);

//     const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

//     const list = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'in:inbox newer_than:1d',
//       maxResults: 50
//     });

//     const messages = list.data.messages || [];

//     const emails = await Promise.all(
//       messages.map(async (msg) => {
//         const detail = await gmail.users.messages.get({
//           userId: 'me',
//           id: msg.id
//         });

//         const headers = detail.data.payload.headers;
//         return {
//           subject: headers.find(h => h.name === 'Subject')?.value,
//           from: headers.find(h => h.name === 'From')?.value,
//           snippet: detail.data.snippet
//         };
//       })
//     );

//     res.json({ count: emails.length, emails });

//   } catch (err) {
//     console.error('Gmail error:', err);
//     res.status(500).json({ message: 'Failed to read Gmail' });
//   }
// });


// router.get('/today', async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'No JWT' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded.googleAccessToken || !decoded.googleRefreshToken) {
//       return res.status(401).json({ message: 'Google auth expired. Please login again.' });
//     }

//     const oAuth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

//     oAuth2Client.setCredentials({
//       access_token: decoded.googleAccessToken,
//       refresh_token: decoded.googleRefreshToken
//     });

//     // Refresh token properly if access_token expired
//     const newToken = await oAuth2Client.getAccessToken();
//     if (newToken.token) {
//       oAuth2Client.setCredentials({ access_token: newToken.token });
//     }

//     const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

//     const list = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'in:inbox newer_than:1d',
//       maxResults: 50
//     });

//     const messages = list.data.messages || [];

//     const emails = await Promise.all(
//       messages.map(async (msg) => {
//         const detail = await gmail.users.messages.get({
//           userId: 'me',
//           id: msg.id
//         });
//         const headers = detail.data.payload.headers;
//         return {
//           subject: headers.find(h => h.name === 'Subject')?.value,
//           from: headers.find(h => h.name === 'From')?.value,
//           snippet: detail.data.snippet
//         };
//       })
//     );

//     res.json({ count: emails.length, emails });

//   } catch (err) {
//     console.error('Gmail error:', err);
//     res.status(401).json({ message: 'Failed to read Gmail. Re-login required.' });
//   }
// });

router.get('/today', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No JWT' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.googleAccessToken || !decoded.googleRefreshToken) {
      return res.status(401).json({ message: 'Google auth expired. Re-login required.' });
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
      access_token: decoded.googleAccessToken,
      refresh_token: decoded.googleRefreshToken
    });

    // Refresh access token if expired
    try {
      const newTokens = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(newTokens.credentials);
    } catch (refreshErr) {
      console.error('Failed to refresh token:', refreshErr);
      return res.status(401).json({ message: 'Google token expired. Re-login required.' });
    }

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const list = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox newer_than:1d',
      maxResults: 50
    });

    const messages = list.data.messages || [];
    if (!messages.length) return res.json({ count: 0, emails: [] });

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        });
        const headers = detail.data.payload.headers;
        return {
          subject: headers.find(h => h.name === 'Subject')?.value,
          from: headers.find(h => h.name === 'From')?.value,
          snippet: detail.data.snippet
        };
      })
    );

    res.json({ count: emails.length, emails });

  } catch (err) {
    console.error('Gmail error:', err);
    res.status(401).json({ message: 'Failed to read Gmail. Re-login required.' });
  }
});




module.exports = router;
