# 💡 Smart Home Lamp Control (ESP8266 + Node.js)

![IoT](https://img.shields.io/badge/IoT-SmartHome-blue)
![Device](https://img.shields.io/badge/Device-ESP8266-green)
![Backend](https://img.shields.io/badge/API-Node.js-black)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

> 🚀 Sistem Smart Home berbasis IoT dengan fitur **auto WiFi setup (captive portal)** dan kontrol lampu via REST API.

---

## ✨ Fitur Unggulan

* 📡 Auto connect ke WiFi tersimpan
* 🌐 Captive Portal (setup WiFi via browser)
* 💡 Kontrol lampu ON/OFF dari server
* 🔄 Sinkronisasi status setiap 3 detik
* 💾 Penyimpanan WiFi (EEPROM / storage)
* 🔐 HTTPS request (WiFiClientSecure)
* 🧠 Parsing JSON (ArduinoJson)

---

## 📸 Dashboard Preview

[Smart Home Dashboard](https://find.chaerul.xyz/image/Screenshot%202026-03-29%20145153.png)

[find.chaerul.xyz](https://find.chaerul.xyz/smarthome)

## 🧠 Cara Kerja Sistem

```text
🔌 Power ON
   │
   ├── 🔍 Cek WiFi tersimpan
   │       │
   │       ├── ✅ Ada → Connect WiFi → Jalankan REST API
   │       │
   │       └── ❌ Tidak ada → Masuk AP Mode
   │                         │
   │                         ▼
   │                🌐 Captive Portal (ESP_Setup)
   │                         │
   │                         ▼
   │                User input WiFi
   │                         │
   │                         ▼
   │                💾 Simpan & Restart
   │
   ▼
💡 Kontrol Lampu dari Server
```

---

## 🌐 WiFi Manager (Captive Portal)

Saat device belum terkoneksi WiFi:

* ESP membuat hotspot:

  ```
  SSID: ESP_Setup
  ```
* User connect via HP / Laptop
* Browser otomatis redirect ke halaman setup

### ⚙️ Fitur Portal:

* Scan WiFi sekitar 📶
* Pilih SSID
* Input password
* Auto save & restart

---

## 🔌 Kontrol Lampu

ESP akan request ke server:

```http
GET /api/lampu?KODE_UNIK=xxxx
```

### Response:

```json
{
  "data": [
    { "status": "on" }
  ]
}
```

### Aksi:

* `on` → GPIO HIGH 💡
* `off` → GPIO LOW ❌

---

## 🧰 Teknologi

* ⚡ ESP8266 (Arduino)
* 🌐 Node.js (REST API)
* 📦 ArduinoJson
* 🔗 HTTPS (WiFiClientSecure)
* 📶 WiFi Networking
* 🌐 ESP8266WebServer (Captive Portal)
* 🌍 DNSServer (redirect semua request)

---

## 📁 Struktur Project

```bash
.
├── main.ino
├── wifi_manager.cpp
├── wifi_manager.h
├── rest_handler.h
├── storage.h
└── config.h
```

---

## 🔑 Konfigurasi

```cpp
#define KODE_UNIK "device_001"
```

---

## ⚙️ Mode Operasi

### 🟢 Mode 1 — Normal Mode

* WiFi tersimpan tersedia
* Device connect ke internet
* Jalankan REST API

### 🟡 Mode 2 — Setup Mode

* WiFi tidak tersedia
* Aktifkan Access Point
* Jalankan captive portal

---

## 🧠 Core Module

### 📡 WiFi Manager

* `connectSavedWiFi()` → connect WiFi
* `setupAP()` → start hotspot
* `handleWifi()` → handle request
* `getWifiList()` → scan jaringan

### 🌐 REST Handler

* `ambilStatusLampu()` → ambil status dari server
* `kirimStatus()` → kirim status (optional)

---

## ⚠️ Catatan

* SSL menggunakan `setInsecure()` ⚠️
* Delay polling: 3 detik
* Pastikan relay sesuai beban listrik

---

## 📊 Roadmap

* [ ] 📱 Mobile App control
* [ ] 🌐 Web dashboard
* [ ] 🔔 Notifikasi status
* [ ] 🔗 MQTT (realtime)
* [ ] 🎙️ Voice control
* [ ] 🔄 OTA Update

---

## 🧪 Use Case

* 🏠 Smart home lamp control
* 🏢 Kontrol lampu kantor
* 🌍 Remote device monitoring

---

## 🧑‍💻 Author

**Chaerul**

---

## ⭐ Support

Kalau project ini membantu:

⭐ Star repo
🍴 Fork project
🚀 Gunakan di project kamu

---
