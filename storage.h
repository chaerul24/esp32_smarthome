#ifndef STORAGE_H
#define STORAGE_H

#include <Arduino.h>

void saveWiFi(String ssid, String pass);
bool loadWiFi(String &ssid, String &pass);
void clearWiFi();

#endif