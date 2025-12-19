const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

// router.get('/today', async (req, res) => {
//   try {
//     // 1️⃣ Get JWT
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'No token' });

//     // 2️⃣ Verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('JWT decoded:', decoded);


//     // 3️⃣ OAuth client with Google token
//     const oAuth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

// //   oAuth2Client.setCredentials({
// //   access_token: decoded.googleAccessToken,
// //   refresh_token: decoded.googleRefreshToken // <-- optional, if token expired
// // });

// const creds = {};

// if (decoded.googleAccessToken) {
//   creds.access_token = decoded.googleAccessToken;
// }

// if (decoded.googleRefreshToken) {
//   creds.refresh_token = decoded.googleRefreshToken;
// }

// if (Object.keys(creds).length === 0) {
//   return res.status(401).json({ message: 'Google tokens missing. Re-login required.' });
// }

// oAuth2Client.setCredentials(creds);



//     const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

//     // 4️⃣ Today timestamp
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const after = Math.floor(today.getTime() / 1000);

//     // 5️⃣ Fetch today messages
//     const list = await gmail.users.messages.list({
//   userId: 'me',
//   q: 'in:inbox newer_than:1d',

//   maxResults: 50
// });

// console.log('GMAIL QUERY:', 'in:inbox newer_than:1d');
// console.log('MESSAGES FOUND:', list.data.messages?.length);


//     const messages = list.data.messages || [];

//     // 6️⃣ Read message details
//     const emails = await Promise.all(
//       messages.map(async (msg) => {
//         const detail = await gmail.users.messages.get({
//           userId: 'me',
//           id: msg.id
//         });

//         const headers = detail.data.payload.headers;
//         const subject = headers.find(h => h.name === 'Subject')?.value;
//         const from = headers.find(h => h.name === 'From')?.value;

//         return {
//           subject,
//           from,
//           snippet: detail.data.snippet
//         };
//       })
//     );

//     res.json({
//       count: emails.length,
//       emails
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to read Gmail' });
//   }
// });
router.get('/today', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No JWT' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.googleAccessToken && !decoded.googleRefreshToken) {
      return res.status(401).json({ message: 'Google auth expired. Please login again.' });
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
      access_token: decoded.googleAccessToken,
      refresh_token: decoded.googleRefreshToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const list = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox newer_than:1d',
      maxResults: 50
    });

    const messages = list.data.messages || [];

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
    res.status(500).json({ message: 'Failed to read Gmail' });
  }
});


module.exports = router;
