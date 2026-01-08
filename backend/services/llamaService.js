const axios = require('axios');

async function callLlama(prompt, max_tokens) {
  try {
    const response = await axios.post(
      'http://127.0.0.1:11434/api/generate',
      {
        model: 'llama3:8b',
        prompt,
        temperature: 0.2,
        max_tokens,
        stream: false
      },
      {
        timeout: 300000 // ⬅️ 5 minutes safety
      }
    );

    if (response.data?.response) {
      return response.data.response.trim();
    }

    return 'N/A';
  } catch (err) {
    console.error('LLaMA ERROR:', err.message);
    return 'N/A';
  }
}

async function summarizeEmail(text) {
  return callLlama(
    `Summarize in 1 sentence:\n${text}`,
    80
  );
}

async function categorizeEmail(text) {
  return callLlama(
    `Category (one word):\n${text}`,
    20
  );
}

module.exports = { summarizeEmail, categorizeEmail };
