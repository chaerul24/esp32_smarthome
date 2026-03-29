const express = require("express");
const router = express.Router();
const ollama = require("../services/ollama");

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await ollama.generateText(prompt);

    res.json({ reply: result });
  } catch (err) {
    res.status(500).json({ error: "Gagal generate AI" });
  }
});

module.exports = router;