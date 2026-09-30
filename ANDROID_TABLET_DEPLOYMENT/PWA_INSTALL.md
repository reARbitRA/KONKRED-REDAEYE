# PWA Install Path

## Best immediate path
Use the web build as an installable PWA on the tablet.

## Requirements
- HTTPS hosting
- Firebase config valid for the deployment origin
- modern Chromium-based browser on Android

## Steps
1. Build the web app.
2. Host `dist/` over HTTPS.
3. Open the app URL on the tablet.
4. Use browser install / add-to-home-screen.
5. Test login, navigation, provider screens, and long-scroll views.

## Limits
- This is not a native APK.
- Electron-only behavior does not apply here.
- Some browser popup/auth behavior must be verified on the final device.
