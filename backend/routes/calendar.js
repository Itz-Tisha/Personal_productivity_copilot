const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/* ================== CONFIG ================== */

const FP_FILE = path.join(__dirname, '../calendarFingerprints.json');
const FINGERPRINT_TTL_DAYS = 90;

/* ================== HELPERS ================== */

function normalizeText(text = '') {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function getEmailOnly(from = '') {
  const match = from.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : from;
}

function validateDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function generateFingerprint(subject, from, date) {
  const cleanSubject = normalizeText(subject);
  const cleanFrom = normalizeText(getEmailOnly(from));

  return crypto
    .createHash('sha1')
    .update(`${cleanSubject}|${cleanFrom}|${date}`)
    .digest('hex');
}

function nextDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/* ================== FINGERPRINT STORE ================== */

function loadFingerprints() {
  if (!fs.existsSync(FP_FILE)) return {};
  return JSON.parse(fs.readFileSync(FP_FILE, 'utf8'));
}

function saveFingerprints(data) {
  fs.writeFileSync(FP_FILE, JSON.stringify(data, null, 2));
}

function cleanupOldFingerprints(store) {
  const now = Date.now();
  const ttl = FINGERPRINT_TTL_DAYS * 24 * 60 * 60 * 1000;

  for (const fp in store) {
    if (now - store[fp] > ttl) {
      delete store[fp];
    }
  }
}

/* ================== ROUTE ================== */

router.post('/add-events', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No JWT token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.googleRefreshToken) {
      return res.status(401).json({ message: 'Google auth expired' });
    }

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({ refresh_token: decoded.googleRefreshToken });

    const calendar = google.calendar({ version: 'v3', auth });

    const { events } = req.body;
    if (!Array.isArray(events)) {
      return res.status(400).json({ message: 'Invalid events array' });
    }

    /* 🔒 Load + cleanup local fingerprint store */
    const fingerprintStore = loadFingerprints();
    cleanupOldFingerprints(fingerprintStore);

    let added = 0;
    let skipped = 0;

    for (const event of events) {
      if (
        !event.subject ||
        !event.from ||
        !event.dueDate ||
        !validateDate(event.dueDate)
      ) {
        skipped++;
        continue;
      }

      const fingerprint = generateFingerprint(
        event.subject,
        event.from,
        event.dueDate
      );

      /* 🚫 HARD STOP — already added before */
      if (fingerprintStore[fingerprint]) {
        skipped++;
        continue;
      }

      /* ➕ INSERT EVENT */
      await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: event.subject,
          description: event.description || '',
          start: { date: event.dueDate },
          end: { date: nextDay(event.dueDate) },
        },
      });

      /* ✅ SAVE FINGERPRINT LOCALLY */
      fingerprintStore[fingerprint] = Date.now();
      added++;
    }

    saveFingerprints(fingerprintStore);

    return res.json({ added, skipped });
  } catch (err) {
    console.error('Calendar error:', err.message);
    return res.status(500).json({ message: 'Failed to add calendar events' });
  }
});

module.exports = router;
