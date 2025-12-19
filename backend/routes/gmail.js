const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

<<<<<<< HEAD
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
=======

>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a
router.get('/today', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No JWT' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

<<<<<<< HEAD
    if (!decoded.googleAccessToken && !decoded.googleRefreshToken) {
      return res.status(401).json({ message: 'Google auth expired. Please login again.' });
=======
    if (!decoded.googleAccessToken || !decoded.googleRefreshToken) {
      return res.status(401).json({ message: 'Google auth expired. Re-login required.' });
>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
      access_token: decoded.googleAccessToken,
      refresh_token: decoded.googleRefreshToken
    });

<<<<<<< HEAD
=======
    // Refresh access token if expired
    try {
      const newTokens = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(newTokens.credentials);
    } catch (refreshErr) {
      console.error('Failed to refresh token:', refreshErr);
      return res.status(401).json({ message: 'Google token expired. Re-login required.' });
    }

>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const list = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox newer_than:1d',
      maxResults: 50
    });

    const messages = list.data.messages || [];
<<<<<<< HEAD
=======
    if (!messages.length) return res.json({ count: 0, emails: [] });
>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        });
<<<<<<< HEAD

=======
>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a
        const headers = detail.data.payload.headers;
        return {
          subject: headers.find(h => h.name === 'Subject')?.value,
          from: headers.find(h => h.name === 'From')?.value,
          snippet: detail.data.snippet
        };
      })
    );

    res.json({ count: emails.length, emails });
<<<<<<< HEAD
  } catch (err) {
    console.error('Gmail error:', err);
    res.status(500).json({ message: 'Failed to read Gmail' });
=======

  } catch (err) {
    console.error('Gmail error:', err);
    res.status(401).json({ message: 'Failed to read Gmail. Re-login required.' });
>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a
  }
});


<<<<<<< HEAD
=======


>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a
module.exports = router;
