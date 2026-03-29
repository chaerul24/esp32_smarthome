#include "websocket_handler.h"
#include <WebSocketsClient.h>
#include <ESP8266WiFi.h>
#include "config.h"
WebSocketsClient webSocket;

// 🔥 SERVER CONFIG
const char* ws_host = "home.chaerul.xyz";
const uint16_t ws_port = 6666;
const char* ws_path = "/";

// ======================
// 📡 KIRIM CONNECT
// ======================
void kirimConnect() {
  if (!webSocket.isConnected()) return;

  String payload = "{";
  payload += "\"type\":\"connect\",";
  payload += "\"KODE_UNIK\":\"" + String(KODE_UNIK) + "\"";
  payload += "}";

  webSocket.sendTXT(payload);
}

// ======================
// 📡 KIRIM DISCONNECT
// ======================
void kirimDisconnect() {
  if (!webSocket.isConnected()) return;

  String payload = "{";
  payload += "\"type\":\"disconnect\",";
  payload += "\"KODE_UNIK\":\"" + String(KODE_UNIK) + "\"";
  payload += "}";

  webSocket.sendTXT(payload);
}

// ======================
// 🔥 EVENT WS
// ======================
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {

    case WStype_CONNECTED:
      Serial.println("✅ WS Connected");
      kirimConnect(); // 🔥 kirim connect
      break;

    case WStype_DISCONNECTED:
      Serial.println("❌ WS Disconnected");
      break;

    case WStype_TEXT:
      // tidak dipakai
      break;
  }
}

// ======================
// 🚀 INIT WS
// ======================
void initWebSocket() {
  Serial.println("🔌 Connecting WS...");

  webSocket.begin(ws_host, ws_port, ws_path);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

// ======================
// 🔁 LOOP + MONITOR WIFI
// ======================
void handleWebSocket() {
  webSocket.loop();

  static bool lastWifi = true;

  if (WiFi.status() != WL_CONNECTED && lastWifi == true) {
    Serial.println("📴 WiFi Lost");
    kirimDisconnect(); // 🔥 kirim disconnect
    lastWifi = false;
  }

  if (WiFi.status() == WL_CONNECTED && lastWifi == false) {
    Serial.println("📶 WiFi Reconnected");
    kirimConnect(); // 🔥 kirim connect
    lastWifi = true;
  }
}