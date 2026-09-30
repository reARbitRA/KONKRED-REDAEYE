# KONKRED REDAEYE — Android Tablet Deployment Kit

This folder is the Android/tablet deployment pack for the current repository state.

## Truth-first status
- This repository already contains Capacitor configuration.
- An Android project directory is **not yet committed**.
- A ready-to-install APK is **not included here yet**.
- This kit standardizes the path to a proper Android build and gives a fast fallback via PWA.

## What works now
1. **PWA / web install path** for tablet use over HTTPS.
2. **Capacitor build path** once Android SDK + Gradle are available.
3. **Repository-local deployment guidance** with tablet-oriented notes.

## Files in this folder
- `README_EXPERIENCE.html` — visual deployment guide
- `BUILD_ANDROID_APK.sh` — build sequence for a machine with Android SDK
- `PWA_INSTALL.md` — fast path for tablet testing
- `DEVICE_NOTES_SAMSUNG_S6.md` — device-specific notes
- `STATUS_MATRIX.md` — current readiness matrix

## Fastest usable route
If you need the app on a Samsung tablet immediately and you do not have an Android build workstation available, use the **PWA route** first.

## Proper native route
When Android SDK + Gradle are available:
```bash
npm ci
npm run android:add
npm run android:build
```

Expected debug APK path:
```bash
android/app/build/outputs/apk/debug/app-debug.apk
```
