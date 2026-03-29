#include "storage.h"
#include <EEPROM.h>

#define EEPROM_SIZE 96

void saveWiFi(String ssid, String pass) {
  EEPROM.begin(EEPROM_SIZE);

  for (int i = 0; i < 32; i++) {
    EEPROM.write(i, i < ssid.length() ? ssid[i] : 0);
    EEPROM.write(32 + i, i < pass.length() ? pass[i] : 0);
  }

  EEPROM.commit();
  EEPROM.end();
}

bool loadWiFi(String &ssid, String &pass) {
  EEPROM.begin(EEPROM_SIZE);

  char s[33], p[33];

  for (int i = 0; i < 32; i++) {
    s[i] = EEPROM.read(i);
    p[i] = EEPROM.read(32 + i);
  }

  s[32] = '\0';
  p[32] = '\0';

  EEPROM.end();

  ssid = String(s);
  pass = String(p);

  return ssid.length() > 0;
}

void clearWiFi() {
  EEPROM.begin(EEPROM_SIZE);
  for (int i = 0; i < EEPROM_SIZE; i++) {
    EEPROM.write(i, 0);
  }
  EEPROM.commit();
  EEPROM.end();
}