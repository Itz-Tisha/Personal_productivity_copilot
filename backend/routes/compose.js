const express = require("express");
const router = express.Router();
const MailHistory = require("../models/MailHistory");
const axios = require("axios");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const { getOAuthClientFromJWT } = require("../utils/googleAuth");

/* ---------------- GENERATE ONLY ---------------- */

router.post("/generate", async (req, res) => {
  try {
    const { userId, to, subject, description } = req.body;

    let record = await MailHistory.findOne({ userId, recipient: to });

    let historyText = "";
    let sameSubjectCount = 0;

    if (record && record.history.length) {
      historyText = record.history
        .map(m => `Body: ${m.body}`)
        .join("\n\n");

      // 🔥 FIX: match by TOPIC not exact subject
      sameSubjectCount = record.history.filter(h =>
        h.subject.toLowerCase().includes("assignment")
      ).length;
    }

    let tone = "polite";

    if (sameSubjectCount === 1) tone = "reminder";
    if (sameSubjectCount === 2) tone = "firm";
    if (sameSubjectCount >= 3) tone = "strict";

    const prompt = `
You are a professional email assistant.

Email attempt number: ${sameSubjectCount + 1}
Tone level: ${tone}

TONE RULES:

polite:
friendly follow-up.

reminder:
short reminder.

firm:
direct and serious.

strict:
authoritative and deadline focused.

Previous emails:
${historyText || "None"}

RULES:
- Produce FULL email.
- Include To, Subject, greeting, body, closing.
- Under 120 words.
- Different wording every time.
- Match tone strictly.
- Ask for clear action.
- No "I hope this email finds you well".

Recipient: ${to}
Subject: ${subject}
Details: ${description}

Return COMPLETE email.
`;

    /* -------- OLLAMA -------- */

    const response = await axios.post(
      "http://localhost:11434/api/chat",
      {
        model: process.env.LLM_MODEL || "llama3",
        messages: [{ role: "user", content: prompt }],
        stream: false
      },
      { timeout: 60000 }
    );

    res.json({
      draft: response.data.message.content.trim()
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Generation failed" });
  }
});

/* ---------------- SAVE TO GMAIL + DB ---------------- */

router.post("/save", async (req, res) => {
  try {
    const { userId, to, subject, draft } = req.body;

    /* ---- Gmail ---- */

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const auth = getOAuthClientFromJWT(decoded);
    const gmail = google.gmail({ version: "v1", auth });

    const raw = Buffer.from(
      `To: ${to}\nSubject: ${subject}\n\n${draft}`
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: { raw }
      }
    });

    /* ---- Mongo ---- */

    let record = await MailHistory.findOne({ userId, recipient: to });

    if (!record) {
      record = new MailHistory({
        userId,
        recipient: to,
        history: []
      });
    }

    if (record.history.length >= 6) record.history.shift();

    // 🔥 CLEAN BODY before saving
    const cleanBody = draft.split("\n\n").slice(1).join("\n\n");

    record.history.push({
      subject,
      body: cleanBody
    });

    await record.save();

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Save failed" });
  }
});

module.exports = router;
