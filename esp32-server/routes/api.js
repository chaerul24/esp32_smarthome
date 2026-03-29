const express = require("express");
const router = express.Router();

const ollama = require("../services/ollama");
const { generateMessage, safeJsonParse } = require("../utils/ai");

const db = require("../db/connect");

// =====================
// 🔥 HELPER
// =====================
function generateKode() {
  return Math.random().toString(36).substring(2, 10);
}

// =====================
// 🔐 AUTH - REGISTER
// =====================
router.post("/auth/register", async (req, res) => {
  try {
    let kode = generateKode();

    // pastikan unik
    let exists = await db.query(
      "SELECT id FROM users WHERE kode_unik = ?",
      [kode]
    );

    while (exists.length > 0) {
      kode = generateKode();
      exists = await db.query(
        "SELECT id FROM users WHERE kode_unik = ?",
        [kode]
      );
    }

    await db.query(
      "INSERT INTO users (kode_unik, online) VALUES (?, 'off')",
      [kode]
    );

    res.json({
      success: true,
      message: "Register berhasil",
      kode_unik: kode,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================
// 🔐 AUTH - LOGIN
// =====================
router.post("/auth/login", async (req, res) => {
  try {
    const { kode_unik } = req.body;

    if (!kode_unik) {
      return res.status(400).json({
        success: false,
        message: "Kode unik wajib diisi",
      });
    }

    const rows = await db.query(
      "SELECT * FROM users WHERE kode_unik = ?",
      [kode_unik]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kode tidak valid",
      });
    }

    await db.query(
      "UPDATE users SET online = 'on' WHERE kode_unik = ?",
      [kode_unik]
    );

    res.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: rows[0].id,
        kode_unik: rows[0].kode_unik,
        online: "on",
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================
// 🔐 AUTH - LOGOUT
// =====================
router.post("/auth/logout", async (req, res) => {
  try {
    const { kode_unik } = req.body;

    if (!kode_unik) {
      return res.status(400).json({
        success: false,
        message: "Kode unik wajib diisi",
      });
    }

    await db.query(
      "UPDATE users SET online = 'off' WHERE kode_unik = ?",
      [kode_unik]
    );

    res.json({
      success: true,
      message: "Logout berhasil",
    });

  } catch (err) {
    console.error("LOGOUT ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================
// 🔹 ESP kirim data
// =====================
router.post("/data", async (req, res) => {
  const { state, io } = req;

  if (!req.body) {
    return res.status(400).json({ error: "No data" });
  }

  state.sensorData = {
    ...state.sensorData,
    ...req.body,
  };

  const message = await generateMessage(
    `Suhu sekarang ${state.sensorData.suhu} derajat`
  );

  const payload = {
    ...state.sensorData,
    message: message || "Data diterima",
  };

  io.emit("update", payload);
  res.json(payload);
});

// =====================
// 🔹 GET data
// =====================
router.get("/data", (req, res) => {
  const { state } = req;

  res.json({
    ...state.sensorData,
    message: "Data terbaru berhasil diambil",
  });
});

// =====================
// 🔹 kontrol lampu
// =====================
router.post("/lampu", async (req, res) => {
  const { state, io } = req;
  const { status } = req.body;

  if (typeof status !== "boolean") {
    return res.status(400).json({ error: "Status harus boolean" });
  }

  state.sensorData.lampu = status;

  const message = await generateMessage(
    status ? "Lampu dinyalakan" : "Lampu dimatikan"
  );

  const payload = {
    ...state.sensorData,
    message: message || "Lampu diperbarui",
  };

  io.emit("update", payload);
  res.json(payload);
});

// =====================
// 🔹 AI command
// =====================
router.post("/ai", async (req, res) => {
  const { state, io } = req;

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt kosong" });
    }

    const aiPrompt = `
Kamu adalah AI smart home.

Balas HANYA JSON:
{"device":"lampu","action":"on/off","message":"teks"}

Perintah: ${prompt}
`;

    const result = await ollama.generateText(aiPrompt);
    const parsed = safeJsonParse(result);

    if (!parsed) {
      return res.status(400).json({
        error: "AI tidak valid",
        raw: result,
      });
    }

    if (parsed.device === "lampu") {
      state.sensorData.lampu = parsed.action === "on";
    }

    const payload = {
      ...state.sensorData,
      message: parsed.message || "Perintah dijalankan",
    };

    io.emit("update", payload);

    res.json({
      success: true,
      ai: parsed,
      data: payload,
    });

  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ error: "AI error" });
  }
});

module.exports = router;