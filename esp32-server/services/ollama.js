const axios = require("axios");

const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_CHECK_URL = "http://localhost:11434/api/tags";

// 🔥 cek apakah Ollama aktif
async function isOllamaActive() {
  try {
    const res = await axios.get(OLLAMA_CHECK_URL, {
      timeout: 3000, // cepat aja
    });

    return res.status === 200;
  } catch (err) {
    console.error("❌ Ollama tidak aktif:", err.message);
    return false;
  }
}

// 🔹 Generate text
async function generateText(prompt, model = "phi3") {
  try {
    // 🔥 cek dulu sebelum request
    const isActive = await isOllamaActive();
    if (!isActive) {
      console.error("❌ Ollama server tidak berjalan");
      return null;
    }

    const response = await axios.post(
      OLLAMA_URL,
      {
        model,
        prompt,
        stream: false,
      },
      {
        timeout: 10000,
      }
    );

    return response.data.response?.trim() || "";
  } catch (error) {
    console.error("❌ Ollama Error:", error.message);

    if (error.response) {
      console.error("Response:", error.response.data);
    }

    return null;
  }
}

// 🔹 Generate streaming
async function generateStream(prompt, model = "phi3") {
  try {
    const isActive = await isOllamaActive();
    if (!isActive) {
      console.error("❌ Ollama server tidak berjalan");
      return null;
    }

    const response = await axios.post(
      OLLAMA_URL,
      {
        model,
        prompt,
        stream: true,
      },
      {
        responseType: "stream",
        timeout: 20000,
      }
    );

    return new Promise((resolve, reject) => {
      let fullText = "";

      response.data.on("data", (chunk) => {
        const lines = chunk.toString().split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const json = JSON.parse(line);

            if (json.response) {
              fullText += json.response; // 🔥 kumpulin
            }
          } catch {
            // skip parsing error
          }
        }
      });

      response.data.on("end", () => {
        resolve(fullText.trim()); // 🔥 baru selesai
      });

      response.data.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error("❌ Ollama Stream Error:", error.message);
    return null;
  }
}

module.exports = {
  generateText,
  generateStream,
  isOllamaActive,
};