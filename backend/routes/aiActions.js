const express = require('express');
const router = express.Router();
const { summarizeEmail, categorizeEmail } = require('../services/llamaService');

// ✅ SUMMARIZE
router.post('/emails/summarize', async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails?.length) {
      return res.status(400).json({ message: 'No emails provided' });
    }

    const results = [];

    for (const email of emails) {
      const text = `${email.subject}\n${email.snippet}`;
      const summary = await summarizeEmail(text); // ⬅️ ONE BY ONE
      results.push({ ...email, summary });
    }

    res.json({ emails: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Summarization failed' });
  }
});

// ✅ CATEGORIZE
router.post('/emails/categorize', async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails?.length) {
      return res.status(400).json({ message: 'No emails provided' });
    }

    const results = [];

    for (const email of emails) {
      const text = `${email.subject}\n${email.snippet}`;
      const category = await categorizeEmail(text);
      results.push({ ...email, category });
    }

    res.json({ emails: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Categorization failed' });
  }
});

module.exports = router;
