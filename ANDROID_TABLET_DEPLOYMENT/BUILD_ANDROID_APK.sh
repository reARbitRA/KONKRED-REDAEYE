#!/usr/bin/env bash
set -euo pipefail

echo "[1/5] Installing dependencies"
npm ci

echo "[2/5] Building web bundle"
npm run build

echo "[3/5] Adding Android project if missing"
if [ ! -d android ]; then
  npm run android:add
fi

echo "[4/5] Syncing Capacitor"
npm run android:sync

echo "[5/5] Building debug APK"
cd android
./gradlew assembleDebug

echo
echo "APK should be at: android/app/build/outputs/apk/debug/app-debug.apk"
