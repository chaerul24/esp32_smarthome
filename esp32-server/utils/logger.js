const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../logcat.log");
const errorFile = path.join(__dirname, "../error.log");

// 🔹 pastikan file ada
function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
}

// 🔹 waktu sekarang
function getTime() {
  return new Date().toISOString();
}

// 🔹 format message (support object)
function formatMessage(message) {
  if (typeof message === "object") {
    return JSON.stringify(message, null, 2);
  }
  return message;
}

// ✅ log normal
function log(message) {
  try {
    ensureFile(logFile);

    const text = `[${getTime()}] INFO: ${formatMessage(message)}\n`;

    console.log(text.trim());
    fs.appendFileSync(logFile, text, "utf8");
  } catch (err) {
    console.error("Logger error:", err.message);
  }
}

// ❌ log error
function error(message) {
  try {
    ensureFile(errorFile);

    const text = `[${getTime()}] ERROR: ${formatMessage(message)}\n`;

    console.error(text.trim());
    fs.appendFileSync(errorFile, text, "utf8");
  } catch (err) {
    console.error("Logger crash:", err.message);
  }
}

// 🔥 optional: log request helper
function request(req) {
  log({
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
}

module.exports = {
  log,
  error,
  request,
};