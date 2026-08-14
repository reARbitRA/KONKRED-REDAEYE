# KONKRED REDAEYE

KONKRED REDAEYE is a React/TypeScript research workspace with Firebase authentication, provider adapters, a hardened Electron shell, PWA installation support, and an optional Capacitor Android wrapper.

## Status

This repository is at **solid internal-alpha / controlled-beta foundation** maturity. Build and typecheck pass, runtime provider responses are schema-validated, provider transport has timeouts and retry policy, the Electron renderer is hardened, and dependencies currently report zero moderate-or-higher vulnerabilities.

The application is **not** a substitute for a secure provider gateway: provider credentials are session-only in the renderer and should not be used for regulated or high-sensitivity workloads until a backend vault boundary is deployed.

## Requirements

- Node.js 22+
- npm 10+
- Firebase project for authentication and Firestore-backed workspace features
- Optional: Docker for container builds
- Optional: JDK, Android SDK, and Gradle for APK builds

## Local development

```bash
npm ci
npm run dev
```

Open the Vite URL shown in the terminal. Do not put real credentials in `.env` files or commit them.

## Quality gates

```bash
npm run lint
npm run format:check
npm test -- --run
npm run build
npm audit --audit-level=moderate
```

The current automated unit suite covers provider transport, response schemas, and PhaseEngine behavior.

## Production web build

```bash
npm run build
npm run preview
```

The production build injects a CSP and emits hashed assets. Feature modules are lazy-loaded to reduce initial startup cost.

## Docker

```bash
npm run docker:build
docker run --rm -p 8080:8080 konkred-redaeye:local
```

The image uses a Node build stage and Nginx runtime stage with SPA fallback, health checks, cache headers, and baseline security headers.

## Firebase

Firebase configuration is in `firebase.json`; the project ID is configured in `.firebaserc`.

```bash
firebase emulators:start
npm run build
npm run firebase:deploy
```

Before deploying Firestore rules, test owner isolation and malformed-document rejection with the Emulator Suite. Never deploy rules or indexes from an unreviewed working tree.

## Android / tablet

The web application is installable as a PWA over HTTPS. Capacitor configuration and scripts are included for native Android packaging:

```bash
npm run android:add
npm run android:build
```

The APK is emitted at `android/app/build/outputs/apk/debug/app-debug.apk`. A JDK and Android SDK are required.

## Security model

- Main application access is controlled by Firebase Auth.
- Provider keys are held in memory only and removed from legacy local storage on startup.
- Electron has Node integration disabled, context isolation enabled, sandboxing enabled, navigation restrictions, and a preload boundary.
- Generated SVG is sanitized before DOM insertion.
- Production web builds use CSP and Nginx/Firebase security headers.
- Do not log provider keys, OAuth tokens, prompts, or complete model outputs.

Report vulnerabilities privately according to `SECURITY.md`.
