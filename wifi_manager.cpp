#include "wifi_manager.h"
#include "storage.h"

ESP8266WebServer server(80);
DNSServer dns;

String selectedSSID;
String selectedPASS;

bool wifiConnected = false;

// 🔥 forward declaration
void handleNotFound();

// 🔍 Scan WiFi
String getWifiList() {
  int n = WiFi.scanNetworks();
  String html = "";

  for (int i = 0; i < n; i++) {
    html += "<option value='" + WiFi.SSID(i) + "'>";
    html += WiFi.SSID(i);
    html += " (" + String(WiFi.RSSI(i)) + " dBm)";
    html += "</option>";
  }

  return html;
}

// 🌐 Halaman utama
void handleRoot() {
  String page = "<html><body>";
  page += "<h2>Setup WiFi</h2>";
  page += "<form action='/save' method='POST'>";
  page += "<select name='ssid'>";
  page += getWifiList();
  page += "</select><br><br>";
  page += "Password:<br>";
  page += "<input type='password' name='pass'><br><br>";
  page += "<input type='submit' value='Connect'>";
  page += "</form>";
  page += "</body></html>";

  server.send(200, "text/html", page);
}

// 💾 Simpan & restart
void handleSave() {
  selectedSSID = server.arg("ssid");
  selectedPASS = server.arg("pass");

  saveWiFi(selectedSSID, selectedPASS);

  server.send(200, "text/html",
    "<h2>Connecting...</h2><p>Device akan restart...</p>");

  delay(1500);
  ESP.restart();
}

// 🔥 redirect semua request
void handleNotFound() {
  server.sendHeader("Location", "/", true);
  server.send(302, "text/plain", "");
}

// 🔥 CONNECT WIFI TERSIMPAN
bool connectSavedWiFi() {
  String ssid, pass;

  if (!loadWiFi(ssid, pass)) {
    Serial.println("⚠️ No saved WiFi");
    return false;
  }

  Serial.println("🔄 Connecting to saved WiFi...");
  WiFi.begin(ssid.c_str(), pass.c_str());

  int timeout = 20;
  while (WiFi.status() != WL_CONNECTED && timeout--) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;

    Serial.println("\n✅ Connected!");
    Serial.println(WiFi.localIP());
    return true;
  }

  Serial.println("\n❌ Failed connect");
  return false;
}

// 🚀 Start AP (portal)
void setupAP() {
  WiFi.softAP("ESP_Setup");

  IPAddress ip = WiFi.softAPIP();
  dns.start(53, "*", ip);

  server.on("/", handleRoot);
  server.on("/save", HTTP_POST, handleSave);

  // 🔥 captive portal support
  server.onNotFound(handleNotFound);
  server.on("/generate_204", handleRoot);
  server.on("/hotspot-detect.html", handleRoot);
  server.on("/fwlink", handleRoot);

  server.begin();

  Serial.println("🌐 AP Mode Started");
  Serial.println(ip);
}

// 🔄 Loop handler
void handleWifi() {
  dns.processNextRequest();
  server.handleClient();
}

// ✅ status
bool isWifiConnected() {
  return wifiConnected;
}