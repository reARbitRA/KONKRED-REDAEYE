#!/usr/bin/env bash
set -euo pipefail

if ! java -version 2>&1 | grep -q 'version "17\|version "18\|version "19\|version "20\|version "21\|version "22'; then
  echo "JDK 17+ required. Current Java is not sufficient."
  exit 1
fi

npm ci
npm run build
if [ ! -d android ]; then
  npx cap add android
fi
npx cap sync android
cd android
./gradlew assembleDebug

echo "APK: android/app/build/outputs/apk/debug/app-debug.apk"
