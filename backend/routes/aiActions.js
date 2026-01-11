const express = require('express');
const router = express.Router();
const { summarizeEmail, categorizeEmail } = require('../services/llamaService');

// ✅ SUMMARIZE ALL
router.post('/emails/summarize', async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails?.length) {
      return res.status(400).json({ message: 'No emails provided' });
    }

    const results = [];

    for (const email of emails) {
      const text = `${email.subject}\n${email.body}`;
      const summary = await summarizeEmail(text);
      results.push({ ...email, summary });
    }

    res.json({ emails: results });
  } catch (err) {
    res.status(500).json({ message: 'Summarization failed' });
  }
});

// ✅ SINGLE EMAIL SUMMARIZE (NEW)
router.post('/emails/summarize-one', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'No email provided' });
    }

    const text = `${email.subject}\n${email.body}`;
    const summary = await summarizeEmail(text);

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: 'Single email summarization failed' });
  }
});

// ✅ CATEGORIZE ALL
router.post('/emails/categorize', async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails?.length) {
      return res.status(400).json({ message: 'No emails provided' });
    }

    const results = [];

    for (const email of emails) {
      const text = `${email.subject}\n${email.body}`;
      const category = await categorizeEmail(text);
      results.push({ ...email, category });
    }

    res.json({ emails: results });
  } catch (err) {
    res.status(500).json({ message: 'Categorization failed' });
  }
});

module.exports = router;
