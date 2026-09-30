# KONKRED REDAEYE

KONKRED REDAEYE is a React + TypeScript adversarial research workspace with Firebase authentication, multi-provider model connectivity, a hardened Electron shell, PWA/Capacitor packaging, and an embedded REDAEYE corpus export for structured technique review.

This repository currently contains **two distinct but related layers**:

1. **The application platform** — the main web/Electron/PWA product under `src/`, `public/`, `electron/`, and the root build/config files.
2. **The REDAEYE Library bundle** — a copied research bundle under `REDAEYE_LIBRARY/` containing entries, tools, navigator, harness assets, and preserved legacy source material.

---

## 1) What this repository is

### Application layer
The application is a mission-control style workspace for model interaction, prompt experimentation, provider key management, reporting, and codex browsing. It includes:

- Firebase-authenticated access flow
- Provider adapters with normalized OpenAI-compatible transport
- Session-only API key handling in the renderer
- Lazy-loaded React modules for multiple research workspaces
- Hardened Electron boundary for local execution
- PWA and optional Android packaging support

### Corpus / library layer
The embedded REDAEYE bundle is a structured technique corpus export. It contains:

- technique entries
- validation/build tools
- navigator output
- harness and bounty support artifacts
- references, queue state, and progress logs
- lossless legacy preservation archives

---

## 2) Repository map

### Root application
| Path | Purpose |
|---|---|
| `src/` | Main React/TypeScript application |
| `public/` | PWA/static assets |
| `electron/` | Hardened Electron main/preload boundary |
| `tests/` | Playwright smoke/e2e tests |
| `package.json` | Scripts, runtime dependencies, build flow |
| `firebase.json` / Firestore files | Hosting, rules, and index config |
| `Dockerfile` / `nginx.conf` | Containerized production web serving |

### REDAEYE bundle
| Path | Purpose |
|---|---|
| `REDAEYE_LIBRARY/entries/` | Copied REDAEYE entries |
| `REDAEYE_LIBRARY/tools/` | Validators, compilers, preservation scripts |
| `REDAEYE_LIBRARY/harness/` | Assessment harness and QA campaign |
| `REDAEYE_LIBRARY/bounty/` | Bounty platform artifacts |
| `REDAEYE_LIBRARY/navigator/` | Offline navigator/library view |
| `REDAEYE_LIBRARY/core/` | Registry, references, triage, queue, spec |
| `REDAEYE_LIBRARY/docs/` | Progress and validation logs |
| `REDAEYE_LIBRARY/legacy_preservation/` | Lossless raw legacy archive |
| `REDAEYE_LIBRARY/index.html` | Clean landing page into the copied library |

---

## 3) Main runtime architecture

### 3.1 UI shell
The UI is centered around `src/App.tsx` and `src/components/Dashboard.tsx`.

The dashboard lazy-loads multiple workspaces, including:

- Prime workspace
- Fusion / lab views
- reporting / scan views
- library / codex views
- settings / profile / sync views
- API key / provider explorer
- CLI-like interface modules
- performance / telemetry overlays

### 3.2 Authentication and workspace access
Firebase Auth gates the main application. The app restores authenticated sessions on load and routes authenticated users into the dashboard.

### 3.3 Provider connectivity
Provider integration is built around:

- `src/services/httpClient.ts`
- `src/services/providerClient.ts`
- `src/services/providerSchemas.ts`

Key properties:

| Capability | Behavior |
|---|---|
| timeout policy | enforced |
| retry behavior | only on retryable/transient status classes |
| caller cancellation | preserved |
| schema validation | response payloads validated with Zod |
| model listing | normalized `/models` fetch |
| completions | normalized `/chat/completions` path |

### 3.4 Local key handling
`KeyManager.tsx` provides a provider registry + validation flow for local/session API key use. The application intentionally avoids long-lived insecure persistence for provider secrets.

### 3.5 Reporting and export
The dashboard can export forensic session PDFs via `jsPDF`, and the repository includes reporting and codex detail surfaces for analysis and review.

---

## 4) Security posture

This repository already includes a meaningful security baseline.

| Control | Status |
|---|---|
| Firebase Auth front-door | present |
| session-only provider credentials | present |
| response schema validation | present |
| request timeout/retry policy | present |
| Electron context isolation | present |
| Electron node integration disabled | present |
| Electron sandboxing | present |
| SVG sanitization | present |
| CSP / production hardening | present |
| security policy file | present (`SECURITY.md`) |

### Important security limit
This application is **not yet a substitute for a backend secret vault**. Renderer/session-only handling is safer than legacy persistent storage, but production-grade regulated or sensitive use still needs a proper backend boundary for provider credentials and policy enforcement.

---

## 5) REDAEYE corpus / library status

The bundled REDAEYE library is not a loose folder dump. It is a structured export with validation and legacy-preservation discipline.

### Current embedded corpus state
| Metric | Value |
|---|---:|
| total corpus size | 367 legacy-origin cards |
| enhanced / validated entries | 240 |
| full-depth entries | 116 |
| compact entries | 124 |
| remaining legacy-only cards | 127 |
| validator status | PASS |
| QA campaign | PASS |

### Legacy preservation
The bundle preserves raw legacy source material in two ways:

| Preservation layer | Description |
|---|---|
| per-ID archive | raw JSON preserved under `REDAEYE_LIBRARY/legacy_preservation/by_id/` |
| entry-level preservation block | enhanced entries include recoverable legacy raw blocks |

This means the v2 interpretation can stay safety-labeled and evidence-disciplined **without losing the original legacy record**.

---

## 6) Development workflow

### Local development
```bash
npm ci
npm run dev
```

### Core quality gates
```bash
npm run lint
npm run format:check
npm test -- --run
npm run build
npm audit --audit-level=moderate
```

### Preview production build
```bash
npm run build
npm run preview
```

### Electron build
```bash
npm run electron:build
```

### Android / tablet packaging
```bash
npm run android:add
npm run android:build
```

### Docker build
```bash
npm run docker:build
docker run --rm -p 8080:8080 konkred-redaeye:local
```

### Firebase deployment
```bash
firebase emulators:start
npm run build
npm run firebase:deploy
```

---

## 7) Testing model

### Unit / integration coverage
The current test posture includes:

- provider transport behavior
- schema validation behavior
- core service behavior
- smoke/e2e scaffolding via Playwright

### Corpus QA coverage
The REDAEYE bundle adds its own non-app QA layers:

- entry validator
- citation integrity
- cross-reference checks
- payload ID checks
- navigator build checks
- deterministic harness runs

---

## 8) Recommended production hardening roadmap

| Priority | Recommendation |
|---|---|
| P0 | move provider secrets behind backend vault or secure OS storage |
| P0 | maintain output-side moderation independent of UI prompt structure |
| P1 | formalize retention/redaction policy for prompts, outputs, and keys |
| P1 | sign Electron releases and keep hardened window policy audited |
| P1 | add stronger server-side policy gates for tool-using workflows |
| P2 | separate sensitive operations from renderer-only trust assumptions |
| P2 | document provider compatibility and trust boundaries per adapter |

---

## 9) What the REDAEYE bundle is for

The `REDAEYE_LIBRARY/` folder is the **repository-ready corpus export**. It exists so the corpus can be:

- pushed independently of the live application code
- reviewed structurally
- validated offline
- browsed through the bundled navigator
- archived with lossless legacy recovery

If you only care about the app, focus on the root application. If you only care about the corpus, start in `REDAEYE_LIBRARY/`.

---

## 10) Safe usage note

This repository contains adversarial-research-oriented material and tooling. The intended use is:

- defensive evaluation
- structured red-teaming in authorized environments
- corpus analysis
- safe canary-based testing
- architectural review and validation

Use of provider keys, RAG pipelines, agent tools, and uploaded data should remain within authorized scope.

---

## 11) Quick start by use case

### I want to run the app
```bash
npm ci
npm run dev
```

### I want to inspect the corpus
Open:
- `REDAEYE_LIBRARY/index.html`
- or `REDAEYE_LIBRARY/navigator/index.html`

### I want to validate the embedded corpus
```bash
cd REDAEYE_LIBRARY
python3 tools/validate_entries.py
```

### I want to review raw preserved legacy data
See:
- `REDAEYE_LIBRARY/legacy_preservation/manifest.json`
- `REDAEYE_LIBRARY/legacy_preservation/by_id/`

---

## 12) Security reporting

For vulnerabilities, do **not** open a public issue with secrets, live exploit data, or third-party information.

Follow `SECURITY.md` and include:

- affected version / commit
- reproducible steps
- impact summary
- minimal proof without real credentials or real user data

---

## 13) Current repository reality

This project is best understood as:

| Layer | Role |
|---|---|
| app | authenticated research workspace |
| adapters | provider connectivity with normalized transport |
| shell | Electron/PWA/mobile packaging |
| corpus | REDAEYE technique archive + navigator + QA |
| archive | lossless preservation of raw legacy records |

It is already beyond toy stage, but it is **not done**. The right mental model is: a serious internal-alpha / controlled-beta research platform with a growing validated corpus and a stronger-than-average local security posture, still awaiting a proper backend trust boundary for production-sensitive use.
