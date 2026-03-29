#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <DNSServer.h>

void setupAP();
void handleWifi();

bool isWifiConnected();
bool connectSavedWiFi(); // 🔥 penting

#endif