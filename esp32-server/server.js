const http = require("http");
const WebSocket = require("ws");
const LampuModel = require("./db/models/LampuModel");

// ======================
// 🌐 SERVER HTTP
// ======================
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// ======================
// 🧠 SIMPAN CLIENT ESP
// ======================
const clients = {};

// ======================
// 🔌 REGISTER CLIENT
// ======================
function registerClient(ws, kode_unik) {
  clients[kode_unik] = ws;
  ws.kode_unik = kode_unik;

  console.log("✅ Device connect:", kode_unik);
}

// ======================
// ❌ REMOVE CLIENT
// ======================
function removeClient(ws) {
  if (ws.kode_unik && clients[ws.kode_unik]) {
    delete clients[ws.kode_unik];
    console.log("❌ Device disconnect:", ws.kode_unik);
  }
}

// ======================
// 📡 KIRIM COMMAND KE ESP
// ======================
function kirimCommand(kode_unik, action) {
  const client = clients[kode_unik];

  if (!client || client.readyState !== WebSocket.OPEN) {
    console.log("⚠️ Device offline:", kode_unik);
    return false;
  }

  const payload = JSON.stringify({
    type: "command_latest",
    action
  });

  client.send(payload);

  console.log(`📡 SEND ${kode_unik}: ${action}`);

  return true;
}

// ======================
// 🔥 HANDLE CONNECTION
// ======================
wss.on("connection", (ws) => {
  console.log("🔗 Client connected");

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg);

      console.log("📩 RECEIVE:", data);

      // ======================
      // 🔐 LOGIN ESP
      // ======================
      if (data.type === "login") {
        registerClient(ws, data.kode_unik);

        ws.send(JSON.stringify({
          type: "login_success"
        }));

        // 🔥 AUTO SYNC DB → ESP
        const res = await LampuModel.lampuStatus(data.kode_unik);

        if (res.success) {
          const anyOn = Object.values(res.devices).includes(true);

          ws.send(JSON.stringify({
            type: "command_latest",
            action: anyOn ? "lampu_on" : "lampu_off"
          }));

          console.log("🔄 Sync awal ke ESP:", data.kode_unik);
        }
      }

      // ======================
      // 💡 STATUS DARI ESP
      // ======================
      else if (data.type === "lampu_status") {
        console.log("💡 Status dari ESP:", data);

        await LampuModel.update(
          data.kode_unik,
          data.status
        );

        // 🔥 broadcast ke frontend (kalau ada web client)
        const payload = JSON.stringify({
          type: "update_lampu",
          kode_unik: data.kode_unik,
          status: data.status
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
      }

      // ======================
      // 🌡️ SUHU (optional)
      // ======================
      else if (data.type === "suhu") {
        console.log(`🌡️ ${data.kode_unik}: ${data.value}`);
      }

    } catch (err) {
      console.log("❌ ERROR:", err.message);
    }
  });

  // ======================
  // ❌ DISCONNECT
  // ======================
  ws.on("close", () => {
    removeClient(ws);
  });

  // ======================
  // ⚠️ ERROR
  // ======================
  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

// ======================
// 🚀 START SERVER
// ======================
server.listen(6666, "0.0.0.0", () => {
  console.log("🚀 Server jalan di 0.0.0.0:6666");
});

// ======================
// 📤 EXPORT UNTUK API
// ======================
module.exports = {
  kirimCommand
};