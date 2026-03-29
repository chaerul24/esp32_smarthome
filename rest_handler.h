#ifndef REST_HANDLER_H
#define REST_HANDLER_H

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "config.h"
// =====================
// ⚙️ CONFIG
// =====================
const char* base_url = "https://find.chaerul.xyz/api/lampu";

const int lampuPin = 2;

bool lampuStatus = false;

WiFiClientSecure client;

// =====================
// 🌐 GET STATUS DARI API
// =====================
void ambilStatusLampu() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient https;

  String url = String(base_url) + "?KODE_UNIK=" + KODE_UNIK;

  client.setInsecure(); // skip SSL (biar gampang)

  // Serial.println("🌐 GET: " + url);

  if (https.begin(client, url)) {

    int httpCode = https.GET();

    if (httpCode > 0) {

      String payload = https.getString();

      // Serial.println("📩 RESPONSE:");
      // Serial.println(payload);

      DynamicJsonDocument doc(1024);
      DeserializationError error = deserializeJson(doc, payload);

      if (error) {
        Serial.println("❌ JSON ERROR");
        https.end();
        return;
      }

      // ambil status dari JSON
      String status = doc["data"][0]["status"] | "off";

      bool newStatus = (status == "on");

      // update hanya kalau berubah
      if (newStatus != lampuStatus) {
        lampuStatus = newStatus;

        digitalWrite(lampuPin, lampuStatus ? HIGH : LOW);

        Serial.println("💡 Lampu: " + String(lampuStatus ? "ON" : "OFF"));
      }

    } else {
      Serial.println("❌ HTTP ERROR: " + String(httpCode));
    }

    https.end();

  } else {
    Serial.println("❌ HTTPS CONNECT FAIL");
  }
}

// =====================
// 📡 KIRIM STATUS KE SERVER (OPTIONAL)
// =====================
void kirimStatus(String status) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient https;

  String url = "https://find.chaerul.xyz/api/lampu/status";

  client.setInsecure();

  if (https.begin(client, url)) {

    https.addHeader("Content-Type", "application/json");

    DynamicJsonDocument doc(256);
    doc["KODE_UNIK"] = KODE_UNIK;
    doc["status"] = status;

    String body;
    serializeJson(doc, body);

    int httpCode = https.POST(body);

    Serial.println("📡 POST STATUS: " + String(httpCode));

    https.end();
  }
}

// =====================
// 🚀 SETUP
// =====================
void setupREST() {
  pinMode(lampuPin, OUTPUT);
  digitalWrite(lampuPin, LOW);

  Serial.println("🚀 REST handler siap");
}

// =====================
// 🔄 LOOP
// =====================
void loopREST() {
  ambilStatusLampu();
  delay(3000); // polling 3 detik
}

#endif