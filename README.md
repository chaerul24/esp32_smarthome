# 💡 Smart Home Lamp Control

![IoT](https://img.shields.io/badge/IoT-SmartHome-blue)
![Platform](https://img.shields.io/badge/Platform-ESP8266-green)
![Backend](https://img.shields.io/badge/Backend-Node.js-black)
![License](https://img.shields.io/badge/License-MIT-yellow)

> 🚀 Sistem Smart Home berbasis IoT untuk mengontrol lampu dari jarak jauh menggunakan ESP8266 dan REST API Node.js.

---

## 📸 Preview Sistem

### 🔌 Hardware (ESP8266 + Relay)

![Hardware](https://via.placeholder.com/800x400?text=ESP8266+Relay+Lamp)

### 📱 UI Mockup Dashboard

![UI](https://via.placeholder.com/800x400?text=Smart+Home+Dashboard+UI)

---

## 🚀 Fitur Utama

* 💡 Kontrol lampu ON/OFF dari server
* 🌐 REST API berbasis Node.js
* 📡 Sinkronisasi status real-time
* 🔄 Auto polling setiap 3 detik
* 🧠 Parsing JSON (ArduinoJson)
* 🔐 Support HTTPS (WiFiClientSecure)

---

## 🧰 Teknologi yang Digunakan

* ⚡ Arduino (ESP8266)
* 🌐 Node.js (REST API)
* 📦 ArduinoJson
* 🔗 HTTPS Communication
* 📶 WiFi Networking

---

## 🏗️ Arsitektur Sistem

```text
        📱 Client / Web App
                 │
                 ▼
        🌐 Node.js REST API
                 │
                 ▼
        📡 ESP8266 (WiFi)
                 │
                 ▼
             💡 Lampu
```

---

## ⚙️ Cara Kerja

1. ESP8266 terhubung ke WiFi
2. Device request ke server:

   ```
   GET /api/lampu?KODE_UNIK=xxxx
   ```
3. Server mengirim status (`on` / `off`)
4. ESP:

   * Parse JSON
   * Mengontrol GPIO (relay/lampu)
5. (Optional) Kirim status balik ke server

---

## 🔌 Hardware Requirement

* ESP8266 (NodeMCU / Wemos D1 Mini)
* Relay Module / LED
* Lampu / Beban listrik
* Kabel jumper

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

* `ambilStatusLampu()` → Ambil status dari server
* `kirimStatus()` → Kirim status ke server
* `setupREST()` → Setup awal
* `loopREST()` → Loop utama

---

## ⚠️ Catatan Penting

* SSL menggunakan `setInsecure()` (tidak validasi sertifikat)
* Pastikan koneksi WiFi stabil
* Gunakan relay untuk perangkat listrik besar

---

## 📊 Roadmap

* [ ] Web Dashboard (React / Vue)
* [ ] Mobile App (Flutter)
* [ ] Voice Control (AI)
* [ ] MQTT Integration
* [ ] OTA Firmware Update

---

## 🧪 Demo Use Case

* Kontrol lampu rumah dari HP
* Automasi lampu (jadwal)
* Integrasi smart home

---

## 🧑‍💻 Author

**Chaerul**

---

## ⭐ License

MIT License

---

## 🔥 Show Your Support

Kalau project ini membantu:

⭐ Star repo ini
🍴 Fork untuk pengembangan
🚀 Gunakan di project kamu

---
