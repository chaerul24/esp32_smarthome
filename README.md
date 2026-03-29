# 💡 Smart Home Lamp Control

![IoT](https://img.shields.io/badge/IoT-SmartHome-blue)
![Platform](https://img.shields.io/badge/Platform-ESP8266-green)
![Backend](https://img.shields.io/badge/Backend-Node.js-black)
![License](https://img.shields.io/badge/License-MIT-yellow)

> 🚀 Sistem Smart Home berbasis IoT untuk mengontrol lampu dari jarak jauh menggunakan ESP8266 dan REST API Node.js.

---

## ✨ Fitur Utama

* 💡 Kontrol lampu ON/OFF dari server
* 🌐 REST API berbasis Node.js
* 📡 Sinkronisasi status real-time
* 🔄 Auto polling setiap 3 detik
* 🧠 Parsing JSON (ArduinoJson)
* 🔐 Support HTTPS (WiFiClientSecure)

---

## 🧰 Teknologi

* ⚡ Arduino (ESP8266)
* 🌐 Node.js (Backend API)
* 📦 ArduinoJson
* 🔗 REST API (HTTPS)
* 📶 WiFi Communication

---

## 🏗️ Arsitektur Sistem

```text
📱 Client / Web
      │
      ▼
🌐 Node.js API
      │
      ▼
📡 ESP8266 (WiFi)
      │
      ▼
💡 Lampu
```

---

## ⚙️ Cara Kerja

1. 📡 ESP8266 terhubung ke WiFi
2. 🌐 Request ke API:

   ```
   GET /api/lampu?KODE_UNIK=xxxx
   ```
3. 📩 Server kirim status (`on` / `off`)
4. ⚡ ESP:

   * Parse JSON
   * Kontrol GPIO
5. 🔁 Sinkronisasi berulang tiap 3 detik

---

## 🔌 Hardware

* 🔹 ESP8266 (NodeMCU / Wemos)
* 🔹 Relay Module / LED
* 🔹 Lampu / Beban listrik
* 🔹 Kabel jumper

---

## 📁 Struktur Project

```bash
.
├── main.ino
├── rest_handler.h
├── config.h
└── README.md
```

---

## 🔑 Konfigurasi

Edit file `config.h`:

```cpp
#define WIFI_SSID "your_wifi"
#define WIFI_PASSWORD "your_password"
#define KODE_UNIK "device_001"
```

---

## 🌐 API Endpoint

### 🔹 GET Status

```http
GET https://find.chaerul.xyz/api/lampu?KODE_UNIK=xxxx
```

Response:

```json
{
  "data": [
    { "status": "on" }
  ]
}
```

---

### 🔹 POST Status

```http
POST https://find.chaerul.xyz/api/lampu/status
```

Body:

```json
{
  "KODE_UNIK": "device_001",
  "status": "on"
}
```

---

## 🧠 Core Function

* 🔄 `ambilStatusLampu()` → Ambil status dari server
* 📡 `kirimStatus()` → Kirim status ke server
* ⚙️ `setupREST()` → Setup awal
* 🔁 `loopREST()` → Loop utama

---

## ⚠️ Catatan

* ⚠️ SSL menggunakan `setInsecure()`
* 📶 Pastikan WiFi stabil
* 🔌 Gunakan relay untuk beban listrik besar

---

## 📊 Roadmap

* [ ] 🌐 Web Dashboard
* [ ] 📱 Mobile App
* [ ] 🎙️ Voice Control
* [ ] 🔗 MQTT Integration
* [ ] 🔄 OTA Update

---

## 🧪 Use Case

* 🏠 Kontrol lampu rumah dari jarak jauh
* ⏰ Automasi lampu (jadwal)
* 🤖 Integrasi smart home

---

## 🧑‍💻 Author

**Chaerul**

---

## ⭐ License

MIT License

---

## 🚀 Support

Kalau project ini membantu:

⭐ Star repo ini
🍴 Fork project
💡 Kembangkan lebih lanjut

---
****
