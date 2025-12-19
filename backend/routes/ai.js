const express = require('express');
const router = express.Router();

// Accept emails, call LLM (OpenAI/Gemini/Local)
router.post('/email', async (req, res) => {
  const { subject, body, from } = req.body;

  // Replace with actual LLM API call
  const summary = `Summary: ${subject}`;
  const category = 'Important';
  const reply = 'Thank you! I will reply shortly.';

  res.json({ summary, category, reply });
});

module.exports = router;
