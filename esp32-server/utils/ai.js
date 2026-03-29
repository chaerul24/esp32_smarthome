const ollama = require("../services/ollama");
const logger = require("./logger");

// 🔥 generate message
async function generateMessage(prompt) {
  try {
    logger.log(`AI Request: ${prompt}`);

    const aiPrompt = `
Kamu adalah AI smart home.
Balas singkat, ramah, max 15 kata.

Perintah: ${prompt}
`;

    const result = await Promise.race([
      ollama.generateStream(aiPrompt, 'phi3'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 10000)
      ),
    ]);

    if (!result) {
      throw new Error("AI kosong");
    }

    logger.log(`AI Response: ${result}`);

    return result;
  } catch (err) {
    logger.error(`AI generateMessage error: ${err.message}`);
    return "Maaf, terjadi gangguan AI"; // 🔥 fallback penting
  }
}
// 🔥 parse JSON aman
function safeJsonParse(text) {
  try {
    logger.log(`Parsing JSON: ${text}`);

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      logger.error("JSON tidak ditemukan di response AI");
      return null;
    }

    const parsed = JSON.parse(match[0]);

    logger.log({
      parsedJSON: parsed,
    });

    return parsed;
  } catch (err) {
    logger.error(`JSON parse error: ${err.message}`);
    return null;
  }
}

module.exports = {
  generateMessage,
  safeJsonParse,
};