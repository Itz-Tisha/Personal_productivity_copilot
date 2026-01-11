const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const User = require('../models/User');

function cleanDisclaimer(text) {
  if (!text) return '';

  const patterns = [
    /DISCLAIMER:([\s\S]*)$/gi,
    /This message.*?confidential([\s\S]*)$/gi,
    /You received this message because([\s\S]*)$/gi,
    /To unsubscribe([\s\S]*)$/gi,
    /Google Groups([\s\S]*)$/gi,
    /This email and any attachments([\s\S]*)$/gi,
    /This e-mail and any attachments([\s\S]*)$/gi,
    /Virus([\s\S]*)$/gi,
    /Please consider the environment([\s\S]*)$/gi,
    /The information contained in this email([\s\S]*)$/gi,
    /Dharmisinh Desai University([\s\S]*)$/gi
  ];

  let cleaned = text;

  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned.trim();
}

function cleanGarbage(text) {
  if (!text) return '';

  return text
    .replace(/<[^>]*>/g, '')              // remove HTML
    .replace(/http[s]?:\/\/\S+/g, '')     // remove links
    .replace(/\[image.*?\]/gi, '')
    .replace(/cid:.*?/gi, '')
    .replace(/--[\s\S]*$/g, '')           // remove signatures
    .replace(/On .* wrote:[\s\S]*/gi, '') // remove replies
    .replace(/From:.*$/gmi, '')
    .replace(/Sent:.*$/gmi, '')
    .replace(/To:.*$/gmi, '')
    .replace(/Subject:.*$/gmi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractText(payload) {
  let text = '';

  if (!payload) return '';

  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    text += Buffer.from(payload.body.data, 'base64').toString('utf8');
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      text += extractText(part);
    }
  }

  return text;
}

function getFullBody(payload) {
  const plainText = extractText(payload);
  const cleaned = cleanDisclaimer(plainText);
  const finalText = cleanGarbage(cleaned);

  // ❌ If it's basically only images / banners → discard
  if (finalText.length < 30) return '';

  return finalText;
}

router.get('/emails', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
      access_token: decoded.googleAccessToken,
      refresh_token: user.googleRefreshToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    let query = 'newer_than:1d';
    if (req.query.date) {
      const start = new Date(req.query.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query = `after:${start.getTime() / 1000} before:${end.getTime() / 1000}`;
    }

    const list = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 50
    });

    const emails = await Promise.all(
      (list.data.messages || []).map(async msg => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full'
        });

        const headers = detail.data.payload.headers;
        const rawBody = getFullBody(detail.data.payload);

        return {
          id: msg.id,
          subject: headers.find(h => h.name === 'Subject')?.value || '',
          from: headers.find(h => h.name === 'From')?.value || '',
          body: rawBody.substring(0, 3000)   // size-safe
        };
      })
    );

    res.json({ emails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch emails' });
  }
});

module.exports = router;



