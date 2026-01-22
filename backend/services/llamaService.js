const axios = require('axios');

const OLLAMA_URL = 'http://localhost:11434/api/generate';

async function summarizeAndCategorize(emailText) {
  const prompt = `
You are an intelligent email assistant.

Given the email below:
1. Summarize it in 2–3 bullet points.
2. Categorize it into ONE category from:
   [Work, Finance, Education, Promotions, Social, Spam, Other]

Email:
"""
${emailText}
"""

Return JSON exactly like this:
{
  "summary": "...",
  "category": "..."
}
`;

  const response = await axios.post(OLLAMA_URL, {
    model: 'llama3:8b',
    prompt,
    stream: false
  });

  return JSON.parse(response.data.response);
}

module.exports = { summarizeAndCategorize };
