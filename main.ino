#include "wifi_manager.h"
#include "rest_handler.h"

void setup() {
  Serial.begin(115200);

  if (!connectSavedWiFi()) {
    setupAP(); // masuk mode config
  } else {
    setupREST();
  }
}

void loop() {

  if (!isWifiConnected()) {
    handleWifi(); // mode AP
  } else {
    loopREST(); // jalan normal
  }
}