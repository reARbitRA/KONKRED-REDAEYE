# KONKRED REDAEYE Production Engineering Audit

**Audit date:** 2026-08-14  
**Repository:** `reARbitRA/KONKRED-REDAEYE`  
**Branch:** `arena/01a000fe-konkred-redaeye`

## Inspected files and folders

I inspected the complete tracked file tree (103 source/config files), including `package.json` and `package-lock.json`, `src/App.tsx`, all React components and contexts, all services and hooks, the complete `src/codex` data set, `vite.config.ts`, `tsconfig.json`, `electron/main.cjs`, `electron-builder.json`, Firebase configuration and Firestore rules, `index.html`, `.gitignore`, and `KONKRED_REDAEYE_SPEC.md`. There is no README, test directory, GitHub Actions workflow, Dockerfile, compose file, migration directory, or environment example.

Validation performed:

- `npm ci --ignore-scripts` completed, but reported **29 vulnerabilities: 4 critical, 22 high, 2 moderate, 1 low**.
- `npm run lint` completed successfully; this is only `tsc --noEmit`, not ESLint.
- `npm run build` completed successfully with 3,569 modules transformed, but emitted a **3.48 MB minified main chunk / 947 KB gzip** and a missing `/index.css` warning.
- No automated tests were found or run.

---

## 1. Repository Overview

KONKRED REDAEYE is a Vite/React/TypeScript desktop/web hybrid UI for LLM prompt experimentation, multi-provider model access, adversarial test logging, report export, and Google Workspace synchronization. The application is primarily a client-side SPA with optional Electron packaging and optional Firebase Authentication/Firestore integration.

The repository currently behaves more like a feature-rich prototype than a production system:

- Authentication for the main application is a local-storage boolean and can be enabled by clicking a simulated “intrusion” button.
- Provider API keys are stored in browser `localStorage` and sent directly from the renderer to third-party APIs.
- Google OAuth/Firestore is implemented only in selected workspace/logging features, not as the application-wide identity boundary.
- Large static codex datasets are eagerly imported into the initial bundle.
- Several telemetry/performance displays intentionally generate random values rather than measuring runtime or provider behavior.
- CI, tests, formal linting, release automation, and operational documentation are absent.

### Strengths

1. TypeScript is used throughout application code and the current typecheck passes.
2. A lockfile is committed and `npm ci` is reproducible at the dependency-install level.
3. Firestore rules use owner checks and basic field/size validation rather than allowing public access.
4. Provider access is represented by explicit types and a central provider catalog.
5. The code has some useful service boundaries (`PhaseEngine`, `WorkspaceService`, `ForensicReportGenerator`) and reusable contexts/hooks.
6. External links in the inspected key-manager path use `rel="noopener noreferrer"`.

### Biggest risks

1. **Critical:** the primary login is not authentication; `localStorage['redaeye-auth']` is a client-controlled bypass.
2. **Critical:** API keys are persisted in plaintext in browser local storage and exposed to any same-origin script/XSS or local profile reader.
3. **Critical:** Electron enables `nodeIntegration: true` and disables `contextIsolation`, allowing renderer compromise to become host compromise.
4. **Critical:** the repository includes an active-looking Firebase web API key in `firebase-applet-config.json`; while Firebase web API keys are not normally secret, the project should be rotated/verified and protected by service configuration and rules.
5. **High:** no tests or CI quality gates exist.
6. **High:** `npm audit` reports 29 vulnerabilities, including direct critical `jspdf` and high `vite`/Electron-related findings.
7. **High:** direct browser calls to numerous provider APIs create CORS, key-exposure, quota, privacy, and inconsistent error-handling risks.
8. **High:** the initial JavaScript bundle is too large for a responsive web experience and eagerly includes very large codex data files.
9. **High:** `CodeRunner.tsx` generates an HTML document that assigns `marked.parse(...)` output to `innerHTML`; the code path has no demonstrated sanitization and should be treated as an XSS risk until proven otherwise.
10. **High:** the codebase contains a large number of very large components and duplicated or inconsistent provider implementations.

---

## 2. Production Readiness Score

**Overall: 24 / 100 — Not production-ready. Do not deploy with real user API keys or sensitive prompts.**

| Category | Score | Maximum | Rationale |
|---|---:|---:|---|
| Architecture | 6 | 15 | Useful early boundaries, but client-only orchestration, giant components, eager data imports, and mixed auth responsibilities dominate. |
| Code quality | 7 | 15 | Typecheck passes, but `any`-heavy networking, duplicated provider logic, incomplete error handling, and oversized files reduce confidence. |
| Security | 2 | 15 | Local fake auth, plaintext key persistence, insecure Electron defaults, client-side provider calls, and a likely unsafe HTML rendering path. |
| Testing | 0 | 15 | No test files, test script, coverage, integration tests, or E2E tests. |
| DevOps / CI/CD | 1 | 10 | Lockfile and build script exist; no CI, release, scanning, artifact verification, or rollback process. |
| Documentation | 2 | 10 | The product spec exists, but setup, configuration, security, operations, API, and contribution documentation do not. |
| Performance / scalability | 3 | 10 | Build succeeds, but the initial bundle is 3.48 MB minified and the app relies on unbounded/serial model workflows. |
| Maintainability / DX | 3 | 10 | Central types and contexts help, but there is no lint/format/test baseline and several files are 500–788 lines. |

---

## 3. Top 10 Priority Improvements

1. Replace `App.tsx` local-storage login with a real authenticated session and route authorization. Keep Firebase Auth or introduce a backend identity service; do not treat local state as authorization.
2. Move all provider API calls behind a server-side gateway. Store provider keys in a secrets manager or encrypted server-side vault; never persist raw keys in `localStorage`.
3. Harden Electron immediately: `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, restrictive CSP, preload-only APIs, navigation restrictions, and safe external-link handling.
4. Remove or sanitize every raw HTML sink, starting with `src/components/CodeRunner.tsx` and `src/components/shared/Visuals.tsx`. Prefer React rendering or DOMPurify with a strict allowlist.
5. Upgrade/replace vulnerable dependencies, especially direct `jspdf` and the Vite/Electron builder chain; rerun `npm audit`, `osv-scanner`, and `trivy fs` after remediation.
6. Add CI gates: install from lockfile, typecheck, ESLint, Prettier check, unit tests, production build, dependency scan, secret scan, and Electron packaging smoke test.
7. Add a test baseline around `PhaseEngine`, provider adapters, auth state transitions, Firestore serialization, report generation, and critical UI flows.
8. Split the monolithic app into feature modules and lazy-load large views and codex sections. Convert the codex from eager TypeScript object imports to versioned JSON/indexed content loaded on demand.
9. Introduce typed provider adapters with common timeout, cancellation, retry, response-schema validation, rate-limit handling, and redacted structured logging.
10. Document deployment, environment variables, data handling, threat model, supported providers, local setup, release/rollback, and incident response.

---

## 4. Critical Findings

### Finding: Main application authentication is a client-controlled bypass

Severity: Critical

Location: `src/App.tsx:8-20`, `src/components/LoginScreen.tsx:5-151`

Evidence: `App` reads `useLocalStorage<boolean>('redaeye-auth', false)` and `handleLogin` only calls `setIsAuthenticated(true)`. `LoginScreen` invokes `onLogin` after a timed boot animation; no identity provider, password, session validation, or authorization check is involved.

Why it matters: Anyone with browser access can set `localStorage['redaeye-auth']` to `true` and access the full application. Any data protection, provider access, or administrative view built on this state is bypassable. This is authentication theater, not access control.

Recommendation: Use a real auth provider and make the authenticated principal the source of truth. Protect application routes and backend operations server-side. Keep the boot animation as presentation only and never describe it as a security event.

Example fix: `onAuthStateChanged(auth, user => setSession(user ? { uid: user.uid } : null))`; render protected routes only from that session and enforce the same identity in APIs and Firestore rules.

Effort: Medium

Priority: P0

### Finding: Raw provider API keys are stored in localStorage

Severity: Critical

Location: `src/contexts/APIKeyContext.tsx:25-27, 145-153`, `src/hooks/useLocalStorage.ts:3-20`

Evidence: `userKeys` is persisted under `sovereign-keys`; each `UserProviderKey` includes a raw `key` string. `useLocalStorage` serializes the complete object into `window.localStorage`.

Why it matters: Any XSS, compromised dependency, malicious browser extension, shared OS profile, renderer compromise, or exported browser profile can expose all keys. The keys are also passed to client-side fetch calls and are available to renderer code.

Recommendation: Use server-side provider connections with encrypted secret storage and short-lived, scoped sessions. If local-only mode is a hard requirement, use OS-level secure storage through a hardened Electron main-process API and never expose secrets to arbitrary renderer JavaScript. Add explicit purge and rotation controls.

Example fix: Persist only `{ providerId, keyId, lastVerified }`; resolve the secret through a backend vault or Electron `safeStorage` in the main process.

Effort: Large

Priority: P0

### Finding: Electron renderer has host-compromise defaults

Severity: Critical

Location: `electron/main.cjs:7-12`

Evidence: `nodeIntegration: true` and `contextIsolation: false` are enabled. No preload script, sandbox, navigation policy, permission policy, CSP, or external protocol policy is present.

Why it matters: A renderer XSS or compromised remote content can access Node/Electron capabilities and potentially execute arbitrary local code or read local files. This is a standard Electron high-risk configuration.

Recommendation: Disable Node integration, enable context isolation and sandboxing, expose only narrow validated APIs from a preload script, deny unexpected navigation/popups, and load only packaged/local content in production. Add Electron security linting and a packaging smoke test.

Example fix: `{ nodeIntegration: false, contextIsolation: true, sandbox: true, preload: path.join(__dirname, 'preload.cjs') }` plus a preload API with no filesystem or shell primitive exposed to the page.

Effort: Medium

Priority: P0

### Finding: Unsafe HTML rendering needs security proof or removal

Severity: Critical

Location: `src/components/CodeRunner.tsx:536-543`; `src/components/shared/Visuals.tsx:42-60`

Evidence: `CodeRunner` creates a generated HTML document and assigns `marked.parse(...)` output to `document.getElementById('content').innerHTML`. `SVGChart` assigns generated SVG strings to `containerRef.current.innerHTML`. No sanitizer is shown in either path.

Why it matters: User-controlled code, model output, imported content, or generated markdown can become executable HTML/script content. In Electron's current configuration this could escalate to host compromise.

Recommendation: Remove raw HTML sinks. Render markdown with `react-markdown` using a restrictive component allowlist, or sanitize with a maintained sanitizer configured to remove scripts, event attributes, unsafe URLs, SVG scripts, foreignObject, and CSS URLs. Treat model output as untrusted input. Add malicious-markdown tests.

Effort: Medium

Priority: P0

### Finding: Secrets and sensitive prompts can be sent directly to third parties without a governance boundary

Severity: Critical

Location: `src/contexts/LLMContext.tsx:82-126, 184-232`, `src/services/geminiService.ts:37-55`, `src/services/workspace.ts:13-320`

Evidence: The renderer constructs provider URLs and sends bearer keys and prompt content with `fetch`. Google Workspace access tokens are held in module-level memory in `src/services/firebase.ts` and used for direct REST calls. There is no data classification, consent record, retention policy, redaction, provider allowlist, or server-side audit boundary.

Why it matters: Sensitive prompts, generated outputs, and credentials can leave the device with no centralized policy enforcement or auditability. Provider-specific CORS, billing, data-retention, and regional-compliance behavior is not controlled.

Recommendation: Introduce a backend gateway with tenant policy, provider allowlists, request size limits, redaction, timeouts, audit events, and per-user quotas. Make data residency and third-party processing explicit in the UI and docs.

Effort: Large

Priority: P0

---

## 5. High-Severity Findings

### Finding: No automated quality assurance exists

Severity: High

Location: Project-wide; `package.json`

Evidence: No test files or test script exist. The `lint` script is only `tsc --noEmit`. No `.github/workflows` directory exists.

Why it matters: Security-sensitive auth, provider adapters, exports, streaming, and Firestore behavior can regress without detection.

Recommendation: Add Vitest and React Testing Library for unit/component tests, Playwright for critical E2E flows, and CI quality gates. Start with the cases listed in the Testing Review.

Effort: Medium

Priority: P1

### Finding: Dependency graph has actionable critical/high vulnerabilities

Severity: High

Location: `package.json`, `package-lock.json`

Evidence: `npm ci`/`npm audit` reported 29 vulnerabilities: 4 critical and 22 high. Direct findings include critical `jspdf@2.5.2` and high `vite@6.4.1`/Electron-related packages; transitive findings include `protobufjs`, `tar`, `websocket-driver`, `postcss`, and builder packages. `recharts@2.15.4` is also deprecated according to npm install output.

Why it matters: Some findings affect the build toolchain or packaging, while others may affect runtime/browser behavior. Vulnerable build dependencies can compromise generated artifacts.

Recommendation: Run `npm audit fix` only after reviewing lockfile changes, upgrade direct packages deliberately, replace `jspdf` if the critical advisory cannot be remediated, and pin/verify Electron-builder versions. Add OSV and lockfile scanning to CI.

Effort: Medium

Priority: P1

### Finding: Production build is too large and eagerly loads the entire codex

Severity: High

Location: `src/codex-data/index.ts`, `src/services/codex_sections.ts`, `vite.config.ts`

Evidence: `rae-23-omega-codex.ts` is approximately 326 KB, `rae-21-sovereign-archive.ts` approximately 97 KB, and the build emits a 3.48 MB minified main chunk (947 KB gzip). Vite warns that chunks exceed 500 KB.

Why it matters: Slow first load, higher memory pressure, slower parse/compile time, and poor performance on lower-end laptops or web deployment. It also means every user receives the complete catalog whether needed or not.

Recommendation: Lazy-load each feature/view with `React.lazy`, load codex sections on demand, move content into validated JSON or a content service, and configure intentional Rollup manual chunks. Add bundle-size budgets to CI.

Effort: Medium

Priority: P1

### Finding: Provider implementation is inconsistent and not production-safe

Severity: High

Location: `src/contexts/APIKeyContext.tsx`, `src/contexts/LLMContext.tsx`, `src/codex-data/providers.ts`

Evidence: Many providers are treated as OpenAI-compatible despite different authentication and response contracts. Anthropic and Zhipu use static model lists; the generic fallback constructs `https://api.${providerId.toLowerCase()}.ai/v1/models`; Cloudflare is special-cased for a chat-completions path it does not generally expose. Fetches have no AbortController timeout, bounded retry policy, schema validation, or response-size limit.

Why it matters: Provider selection can appear configured while failing at runtime, hang indefinitely, leak oversized responses, or mishandle rate limits and transient errors.

Recommendation: Define a `ProviderAdapter` interface per provider, validate with Zod or equivalent, use request cancellation and deadlines, classify errors, and support only providers with tested adapters. Do not label static model lists as validation.

Effort: Large

Priority: P1

### Finding: Application and Google Workspace authentication are split and inconsistent

Severity: High

Location: `src/App.tsx`, `src/components/WorkspaceSync.tsx`, `src/services/firebase.ts`

Evidence: The main app uses fake local auth, while WorkspaceSync separately uses Google sign-in and Firestore. `initAuth` treats an existing Firebase user with no module-level cached access token as auth failure, so a page reload can leave a valid Firebase session unusable until reauthentication.

Why it matters: Users receive inconsistent security semantics and unreliable session restoration. Authorization boundaries are unclear.

Recommendation: Centralize identity/session state, use Firebase Auth's token lifecycle or a backend session, refresh tokens correctly, and make every protected operation derive identity from the verified session.

Effort: Medium

Priority: P1

### Finding: Codebase contains oversized components with mixed responsibilities

Severity: High

Location: `src/components/CodeRunner.tsx` (788 lines), `src/components/RedaeyeCli.tsx` (653), `src/components/RedaeyePrime.tsx` (562), `src/components/WorkspaceSync.tsx` (537), `src/services/geminiService.ts` and codex files

Evidence: UI rendering, timers, streaming, PDF export, Firestore writes, provider calls, and state machines are colocated in large files. Multiple similarly named chart/technique components exist under `components/shared` and `components/codex`.

Why it matters: Changes have a broad regression surface and are hard to test in isolation. Duplicate abstractions can diverge.

Recommendation: Extract feature controllers/hooks, API clients, schemas, export adapters, and presentational components. Establish one canonical component per concern and add import boundaries.

Effort: Large

Priority: P1

---

## 6. Medium-Severity Findings

### Finding: `index.html` contains duplicate/inconsistent dependency loading

Severity: Medium

Location: `index.html`, `package.json`

Evidence: An import map points to `aistudiocdn.com`, Tailwind is loaded from `cdn.tailwindcss.com`, fonts are loaded from Google, while Vite also bundles npm dependencies. The HTML references `/index.css`, but that file does not exist; the actual stylesheet is `src/index.css` and is imported from `src/index.tsx`.

Why it matters: The production bundle has unnecessary remote dependencies, inconsistent versions (for example Recharts differs from `package.json`), and a noisy runtime warning. Remote CDN availability and integrity are outside the build artifact.

Recommendation: Remove import maps and CDN Tailwind/runtime dependencies from production HTML. Keep all runtime dependencies in the lockfile/bundle or use a documented, integrity-checked asset strategy. Remove the stale stylesheet link.

Effort: Small

Priority: P2

### Finding: Error handling parses untrusted response bodies unsafely and loses context

Severity: Medium

Location: `src/contexts/LLMContext.tsx`, `src/contexts/APIKeyContext.tsx`, `src/services/geminiService.ts`, `src/services/workspace.ts`

Evidence: Several paths call `response.json()` on non-2xx responses without handling non-JSON bodies. Many catch blocks use `any`, swallow errors, or return generic strings. Streaming parses each network chunk as if chunk boundaries always align with JSON lines.

Why it matters: Providers frequently return HTML, partial JSON, rate-limit headers, or SSE frames split across chunks. Users see misleading errors and state can remain streaming/loading indefinitely.

Recommendation: Build one HTTP client with deadlines, safe body extraction, status mapping, request IDs, SSE buffering across chunks, and guaranteed `finally` state cleanup.

Effort: Medium

Priority: P2

### Finding: Serial and unbounded model workflows need cancellation and quotas

Severity: Medium

Location: `src/services/geminiService.ts:212-339`, `src/components/ExploitationLab.tsx`

Evidence: `runExploitationLabScenarios` executes permutations serially with no AbortSignal or total budget. Weaving and forge loops execute user-selected iterations. UI code adds fixed sleeps for “rate limit protection” rather than enforcing provider-aware budgets.

Why it matters: A user can create long-running, expensive sessions that hang the UI, exceed provider quotas, or continue after navigation.

Recommendation: Add bounded concurrency, max iterations, token/cost budgets, AbortController cancellation, progress events, and persistence of resumable job state. Use server-side quotas for real deployments.

Effort: Medium

Priority: P2

### Finding: Telemetry and performance dashboards are synthetic, not operational telemetry

Severity: Medium

Location: `src/components/PerformanceDashboard.tsx`, `src/components/shared/PerformanceMonitor.tsx`, `src/components/codex/LiveAttackFeed.tsx`

Evidence: Values are generated with `Math.random()` on intervals and displayed as efficiency, memory, latency, entropy, and attack feed values.

Why it matters: Operators can mistake decorative values for real measurements, which is dangerous in an audit or security product.

Recommendation: Label synthetic/demo data unmistakably or replace it with actual browser performance metrics, provider request timings, token counts, error rates, and server-side metrics. Store provenance for every displayed metric.

Effort: Medium

Priority: P2

### Finding: Firestore rules validate fields but not all invariants or updates

Severity: Medium

Location: `firestore.rules`

Evidence: Rules allow `create` and `delete` but do not define `update`; validation checks types and maximum sizes but does not enforce exact key sets, timestamp sanity, numeric bounds for `successRate`/`vectorIntensity`, URL schemes, or immutable fields because updates are not modeled.

Why it matters: Schema drift and malformed values can enter permitted documents if write paths evolve. The global deny rule is good defense-in-depth, but the model is incomplete.

Recommendation: Define `hasOnly`/required-key checks where appropriate, bound numeric fields to expected ranges, validate URL schemes if URLs are retained, decide whether records are immutable, and add Firebase Rules Emulator tests.

Effort: Medium

Priority: P2

### Finding: OAuth scope and token handling are broader than necessary

Severity: Medium

Location: `src/services/firebase.ts:23-25, 51-73`

Evidence: Google sign-in requests Docs, Sheets, and Slides scopes together; the access token is cached in a module-level variable and used by direct REST calls.

Why it matters: Broad scopes increase consent and blast radius. Module-level caching does not provide reliable refresh or revocation handling.

Recommendation: Request scopes per feature at the time of use, use PKCE/backend OAuth where appropriate, refresh/revoke safely, and do not retain access tokens longer than necessary.

Effort: Medium

Priority: P2

### Finding: Accessibility and interaction semantics are inconsistent

Severity: Medium

Location: Many `src/components/*.tsx` files

Evidence: Several clickable `<div>` elements are used for technique selection; many icon-only buttons rely on `title` rather than accessible names; form controls often lack labels or explicit associations. The UI globally sets `overflow: hidden` in `index.html`, increasing keyboard/zoom risk.

Why it matters: Keyboard, screen-reader, and touch users can lose access to core functionality. WCAG issues are likely across a large surface.

Recommendation: Use semantic buttons/links, labels, focus-visible styles, keyboard handling, dialog focus traps, reduced-motion support, and automated axe checks. Test at 200% zoom and narrow widths.

Effort: Medium

Priority: P2

---

## 7. Low-Severity / Polish Findings

### Finding: Naming, product copy, and implementation claims are inconsistent

Severity: Low

Location: `KONKRED_REDAEYE_SPEC.md`, `src/components/LoginScreen.tsx`, `src/services/ForensicReportGenerator.ts`, `src/services/workspace.ts`

Evidence: UI copy claims encrypted tunnels, root-level access, and safety neutralization while implementation is a local demo login. Report/export text uses “zero-day,” “exploit,” and “unredacted” language without an evidence model or provenance.

Why it matters: Misleading claims erode trust and create legal/compliance and operator-safety problems.

Recommendation: Distinguish simulation/demo mode from verified measurements, add provenance to every finding, and adopt neutral product language appropriate for authorized defensive research.

Effort: Small

Priority: P3

### Finding: No project license or contribution policy is present

Severity: Low

Location: Project root

Evidence: No `LICENSE`, `CONTRIBUTING.md`, or security disclosure policy was found.

Why it matters: Redistribution, third-party content, vulnerability reporting, and contributor expectations are undefined.

Recommendation: Add an approved license, contribution guide, security policy, and dependency license review.

Effort: Small

Priority: P3

### Finding: Timers and synthetic effects are widespread and should be lifecycle-audited

Severity: Low

Location: Multiple components, including `LoginScreen.tsx`, `PerformanceDashboard.tsx`, `RedaeyeCli.tsx`, `CodeRunner.tsx`, and shared visual components

Evidence: Numerous `setInterval`, nested `setTimeout`, and random-update loops exist. Some are cleaned up, but no automated lifecycle tests or performance budget exists.

Why it matters: View changes can leave unnecessary work running, especially in a long-lived SPA.

Recommendation: Centralize timer hooks, use AbortSignals for async work, verify cleanup on unmount, and profile with React DevTools.

Effort: Small

Priority: P3

---

## 8. Architecture Review

### Current architecture

```text
React root
  └─ App (localStorage auth gate)
      └─ Dashboard (view switch / broad UI state)
          ├─ feature components
          ├─ APIKeyContext (keys + model discovery)
          ├─ LLMContext (provider calls + chat + streaming + state)
          ├─ SystemLogContext
          ├─ Firebase/Workspace side effects
          └─ static codex imported into the initial bundle
```

### Architectural assessment

- **Separation of concerns:** Partial. `PhaseEngine`, workspace, and report services are a good start, but LLM transport, orchestration, prompt construction, parsing, retries, and UI state are combined.
- **Module boundaries:** Weak around providers and auth. `APIKeyContext` is both credential store, model registry, validator, and provider-discovery client.
- **State management:** Context is used for high-churn chat and credentials. This can cause broad rerenders and makes state transitions difficult to test. Server/query state is not separated from UI state.
- **Dependency direction:** UI imports concrete Firebase and network services directly. There is no domain/application/infrastructure boundary.
- **Scalability:** Poor for additional providers, server-side policy, teams, billing, or reliable background jobs.
- **Data model:** `Technique`, `Message`, provider config, export records, and lab results are permissive and use many optional fields. There is no runtime validation at network or persistence boundaries.

### Suggested target architecture

```text
apps/
  web/                 React UI, routing, accessibility
  desktop/             Electron main + preload only
services/
  api-gateway/         Auth, policy, provider proxy, quotas, audit
  worker/              Long-running scans and exports
packages/
  domain/              Typed entities, validation schemas, error types
  provider-adapters/   One tested adapter per provider
  ui/                  Design system and accessible primitives
  codex/               Versioned content and search index
  observability/       Redacted logs, metrics, trace helpers
infra/
  firebase-or-db/      Rules, indexes, emulator config, migrations
  ci/                  Reusable workflows and scanning policy
```

Request path:

```text
UI -> authenticated API client -> gateway policy/auth -> provider adapter -> provider
                                      ├─ audit event (redacted)
                                      ├─ quota/cost accounting
                                      └─ normalized result/error
```

The Electron client should use the same API boundary and should not contain provider secrets or arbitrary Node capabilities.

---

## 9. Security Review

### Security risk register

| Risk | Severity | Status / evidence | Immediate action |
|---|---|---|---|
| Fake main-app authentication | Critical | Confirmed in `App.tsx` | Replace with real session and server authorization |
| Plaintext API keys in localStorage | Critical | Confirmed in `APIKeyContext` | Remove raw key persistence; rotate affected keys |
| Electron Node integration | Critical | Confirmed in `electron/main.cjs` | Harden BrowserWindow and add preload |
| Raw HTML / SVG sinks | Critical | Confirmed; exploitability depends on input flow | Remove/sanitize and add tests |
| Direct third-party bearer calls from renderer | High | Confirmed | Proxy through policy-controlled backend |
| Dependency vulnerabilities | High | Confirmed by `npm audit` | Upgrade/remediate and gate CI |
| Firebase web API key in repo | Medium / Needs verification | Present in `firebase-applet-config.json`; web keys are generally identifiers, not secrets | Verify restrictions, rotate if policy requires, never put server secrets here |
| CORS and provider support | Medium | Needs verification per provider | Test adapters and use gateway |
| CSRF | Medium | Needs verification; SPA has direct APIs and OAuth callbacks | Use same-site sessions/CSRF protection on backend |
| Sensitive data in logs/reports | Medium | Confirmed risk: prompts/outputs are exported and error objects include user metadata | Redact, classify, encrypt, and define retention |
| SSRF/path traversal | Low/Needs verification | No server-side fetcher or upload service found | Reassess when gateway/uploads are added |
| Weak cryptography | Low | SHA-256 hash is used for report integrity, not password encryption | Document integrity-only semantics; use managed encryption for secrets |

### Security controls to add

- Content Security Policy with no unrestricted `unsafe-inline`/remote script execution.
- Trusted Types where supported, plus sanitization tests.
- Secret scanning (`gitleaks` or GitHub secret scanning) and pre-commit hooks.
- Dependency provenance/lockfile review and Dependabot/Renovate.
- Firebase Emulator Suite rules tests.
- Backend authorization based on verified subject and tenant, never client-provided `userId` alone.
- Request size, token, iteration, cost, and concurrency limits.
- Redacted structured logs; never log raw API keys, OAuth tokens, prompts, or full model responses by default.
- Key rotation/revocation workflow and privacy/retention policy.
- Electron navigation allowlist, permission handler, protocol handler, and update signature verification.

---

## 10. Code Quality Review

### Positive observations

- TypeScript compile checks pass.
- Domain types cover many feature concepts.
- `PhaseEngine` is a reasonable candidate for pure unit tests.
- The Firestore rules and owner helper functions show awareness of tenant isolation.

### Main quality issues

- `any` is used in network config, parsed provider data, Firestore error paths, and callbacks, weakening the type boundary where correctness matters most.
- There is no ESLint or Prettier configuration, despite `npm run lint` being named as if it were linting.
- `geminiService.ts` accumulates many feature-specific workflows and JSON parsing paths; each should have a schema and typed adapter.
- `types.ts` has a very large `ExploitStrategy` union with aliases/near-duplicates such as `A01_XOR_NESTING` and `A1_XOR_NESTING`, increasing mapping errors.
- Static data files are enormous and hard to review or validate as content.
- IDs rely on `Date.now()` and `Math.random()` for UI records/logs; use `crypto.randomUUID()` for identifiers where uniqueness matters.
- Errors are frequently `Error(string)` with provider payloads embedded, which can leak data and make programmatic handling difficult.

Recommended quality gates: strict TypeScript (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` after cleanup), ESLint, Prettier, import-cycle detection, unused export detection, schema validation, and bundle budgets.

---

## 11. Testing Review

### Current state

- No unit, integration, component, E2E, snapshot, contract, or rules tests found.
- No coverage tool or test script.
- No Firebase Emulator configuration/tests.
- No CI execution.

### Highest-value test plan

1. `PhaseEngine.fuse`: every supported strategy, clamping, empty/oversized input, deterministic output, and unknown strategy behavior.
2. Provider adapters: successful response, malformed JSON, non-JSON error, 401, 429 with Retry-After, timeout, cancellation, SSE split across chunks, and oversized body.
3. Auth: unauthenticated boot, session restoration, logout, expired token, and route protection.
4. API key storage: prove raw secrets are not persisted; purge/rotation behavior.
5. Firestore rules Emulator: owner read/list/create/delete, cross-user access, malformed fields, oversized fields, numeric bounds, and invalid IDs.
6. Report exports: pagination, long text, empty results, failed canvas capture, Unicode, and deterministic hash inputs.
7. Workspace service: OAuth failure, partial export, retry safety, and no metadata write until remote creation succeeds.
8. UI E2E: login, add provider, model selection, chat stream, cancel, export, and navigation/unmount cleanup.
9. Security regression: malicious markdown/HTML/SVG and untrusted links.

Suggested initial targets: 80% line coverage for domain/services, 70% overall after stabilization, and 100% coverage for auth/authorization and secret-handling paths. Coverage must not replace behavioral tests.

---

## 12. Performance Review

- Main chunk: **3.48 MB minified / 947 KB gzip**; lazy-load routes and codex sections.
- Codex objects are eagerly evaluated and sorted at import time in `getFlattenedTechniques`; move indexing/search to build time or a worker/content service.
- `Dashboard` is a broad view switch and likely keeps many dependencies in the main graph; use route-level dynamic imports.
- Repeated context updates can rerender large portions of the app; split contexts and memoize stable selectors.
- Serial scans are slow and lack cancellation; bounded concurrency can improve throughput while respecting provider quotas.
- PDF/html2canvas work is CPU-heavy; move expensive export preparation to a worker where possible and show progress.
- Random interval dashboards consume CPU without operational value; disable outside demo mode.
- Add Lighthouse/Web Vitals, React profiling, bundle analyzer, and performance budgets to CI.

---

## 13. DevOps / CI/CD Review

### Current state

- Vite build and Electron builder commands exist.
- `package-lock.json` is present.
- No CI workflows, release tags, changelog, signed artifacts, container files, deployment manifests, migration process, rollback procedure, or environment templates exist.

### Required CI pipeline

1. `npm ci` (or a pinned Node/npm toolchain via `engines` and CI setup).
2. Secret scan.
3. ESLint and Prettier check.
4. `tsc --noEmit`.
5. Unit/component tests and coverage threshold.
6. Production build and bundle-size check.
7. `npm audit`/OSV scan/Semgrep.
8. Firebase Rules Emulator tests.
9. Electron packaging smoke test on supported OSes.
10. Artifact checksum/signature generation and retention.

Add protected branch rules, least-privilege GitHub token permissions, dependency update automation, release notes, signed Electron updates, and a documented rollback path.

---

## 14. Documentation Review

`KONKRED_REDAEYE_SPEC.md` describes the intended product and modules but is not an operational README. It does not document:

- Node/npm versions and installation.
- Required environment variables and how secrets are managed.
- Firebase project setup, OAuth consent configuration, authorized domains, or rules deployment.
- Which providers are actually supported and tested.
- Web vs Electron differences.
- Data flow, retention, third-party processing, or threat model.
- Test/lint/build/release commands.
- Troubleshooting and incident/key-rotation procedures.
- Contribution, license, or security disclosure process.

Create `README.md`, `docs/architecture.md`, `docs/security.md`, `docs/provider-support.md`, `docs/development.md`, and `SECURITY.md`. Replace claims of verified internal model telemetry with explicit “simulated” labeling where appropriate.

---

## 15. Dependency / Supply-Chain Review

`package-lock.json` gives a reproducible dependency graph, which is positive. However, the installed graph contains 792 packages including 390 production, 366 development, and 81 optional dependencies according to npm audit metadata. The audit reported 29 vulnerabilities. Direct dependencies requiring immediate review include `jspdf`, `vite`, `electron`, and `electron-builder`; npm also reported deprecated `recharts@2.15.4` and legacy transitive packages such as `inflight`, `glob`, `rimraf`, and `boolean`.

Actions:

- Upgrade direct dependencies to patched versions and review breaking changes.
- Replace `jspdf` if the critical advisory cannot be cleared.
- Keep Electron and electron-builder on a supported, patched pairing.
- Run `npm explain <package>` for each remaining high/critical transitive issue.
- Add `npm audit --audit-level=high`, `osv-scanner`, and `npm-license-crawler` or equivalent to CI.
- Verify package provenance and consider npm lockfile integrity/signature policy.
- Remove unused packages after feature inventory; the import map and npm graph currently duplicate runtime delivery strategies.

---

## 16. Suggested Target Architecture

Use a policy-controlled API gateway as the security and integration boundary. The frontend should contain presentation, local transient state, and typed API calls only. The gateway should own provider credentials, provider adapters, quotas, redaction, audit logging, request validation, and normalized errors. Long-running scans and exports should run as cancellable jobs.

Core domain objects should be runtime-validated schemas:

- `UserSession` / `Tenant`
- `ProviderConnection` without raw secret material in the browser
- `ModelDescriptor`
- `ExperimentRequest` with size/iteration/cost limits
- `ExperimentResult` with provenance and policy outcome
- `ExportJob`
- `AuditEvent` with redaction classification

Use a repository interface for Firestore/DB access so UI code does not construct collection paths or write client-supplied identity fields directly.

---

## 17. Recommended File/Folder Structure

```text
src/
  app/
    App.tsx
    routes.tsx
    providers.tsx
  features/
    auth/
    chat/
    experiments/
    codex/
    reports/
    workspace/
    settings/
  domain/
    models.ts
    schemas.ts
    errors.ts
    policies.ts
  infrastructure/
    api/client.ts
    auth/firebase.ts
    persistence/
    telemetry/
  components/
    ui/
    layout/
  workers/
    export.worker.ts
  content/
    codex-index.json
    sections/
  test/
    fixtures/
    helpers/
electron/
  main.cjs
  preload.cjs
  security.cjs
docs/
.github/workflows/
```

Keep prompt/experiment algorithms pure and independent of React. Keep provider adapters independent of UI. Keep content data separate from executable TypeScript.

---

## 18. Concrete Refactoring Plan

1. **Security seam:** remove local fake auth from `App.tsx`; introduce `SessionProvider` and protected route boundary.
2. **Network seam:** create `src/infrastructure/api/client.ts` with timeout, cancellation, typed JSON/SSE parsing, redacted errors, and request IDs.
3. **Provider seam:** move each provider into an adapter implementing a common interface; delete generic URL guessing.
4. **Secret seam:** remove `sovereign-keys` raw persistence; implement backend vault or hardened Electron secure storage.
5. **Electron seam:** add preload and secure BrowserWindow options; remove direct Node access.
6. **Rendering seam:** replace `innerHTML` with safe React rendering/sanitization.
7. **Domain seam:** split `geminiService.ts` into experiment orchestration, model client, schemas, and feature services.
8. **Content seam:** lazy-load codex sections and validate content during build.
9. **UI seam:** split large components into hooks/controllers/presentational pieces; consolidate duplicate chart/card components.
10. **Quality seam:** add ESLint, Prettier, Vitest, Playwright, bundle budgets, and CI.

---

## 19. Implementation Roadmap

### Phase 0: Immediate blockers

**Tasks:** rotate/verify exposed provider credentials; disable production Electron until hardened; replace fake auth; remove raw HTML sinks; stop persisting raw API keys; remediate critical dependencies.  
**Likely files:** `App.tsx`, `APIKeyContext.tsx`, `useLocalStorage.ts`, `electron/main.cjs`, `CodeRunner.tsx`, `Visuals.tsx`, `package.json`, lockfile.  
**Impact:** prevents obvious account bypass, credential theft, renderer-to-host escalation, and known dependency exposure.  
**Effort:** Large.  
**Risk:** High, because behavior and auth flows change.

### Phase 1: Production baseline

**Tasks:** provider gateway/adapters, centralized auth/session, typed HTTP client, error taxonomy, request limits, CI, tests, Firebase Emulator rules tests, CSP, README/security docs.  
**Likely files:** new `src/infrastructure`, backend/gateway, `.github/workflows`, `docs`, `firestore.rules`.  
**Impact:** establishes safe operation and repeatable delivery.  
**Effort:** Large.  
**Risk:** Medium.

### Phase 2: Quality and scalability

**Tasks:** lazy routes/data, codex content pipeline, component decomposition, job cancellation, bounded concurrency, real metrics, export workers, accessibility remediation.  
**Likely files:** `Dashboard.tsx`, codex data, large feature components, services, `vite.config.ts`.  
**Impact:** improves startup, reliability, maintainability, and user experience.  
**Effort:** Large.  
**Risk:** Medium.

### Phase 3: Excellence

**Tasks:** signed desktop releases, SLSA-style artifact provenance, distributed tracing, cost analytics, policy versioning, contract tests for supported providers, formal threat-model review, disaster recovery exercises.  
**Likely files:** release/infra repositories and operations docs.  
**Impact:** reference-grade operational confidence.  
**Effort:** Large.  
**Risk:** Low to medium.

---

## 20. Production-Readiness Checklist

| Area | Status | Notes |
|---|---|---|
| Build reproducibility | ⚠️ | Lockfile exists and build passes; Node/npm versions are not pinned. |
| Tests | ❌ | No tests or test script. |
| Linting | ❌ | `lint` is only TypeScript; no ESLint. |
| Type checking | ✅ | `npm run lint`/`tsc --noEmit` passes, though strictness is limited. |
| Security | ❌ | Multiple critical design findings. |
| Secrets | ❌ | Provider keys in localStorage; secret-handling architecture missing. |
| CI/CD | ❌ | No workflows or quality gates. |
| Observability | ❌ | Dashboards are synthetic; no production logs/metrics/traces. |
| Backups | ❓ | Cannot verify; no documented backup policy. |
| Deployment | ⚠️ | Vite/Electron commands exist, but no release/deployment process. |
| Rollback | ❌ | No documented rollback or artifact strategy. |
| Documentation | ⚠️ | Product spec exists; operational docs missing. |
| Dependency hygiene | ❌ | 29 npm audit findings including critical/high. |
| Performance | ⚠️ | Build passes but bundle is oversized and data is eager. |
| Accessibility | ⚠️ | Some alt text/rel attributes exist; broad semantic/focus gaps remain. |
| Error handling | ⚠️ | Generic handling exists, but timeouts, cancellation, SSE framing, and typed errors are incomplete. |
| Configuration | ⚠️ | Vite env injection exists; no documented schema or startup validation. |
| License/compliance | ❌ | No license, contribution policy, or data-retention policy found. |
| Firestore authorization | ✅/⚠️ | Owner checks and deny-by-default are good; invariants and emulator tests are missing. |
| Electron hardening | ❌ | Unsafe defaults confirmed. |

---

## 21. Commands to Run Locally

Current commands:

```bash
npm ci
npm run dev
npm run build
npm run preview
npm run electron:dev
npm run electron:build
```

The repository should add and document these commands:

```bash
npm run typecheck       # tsc --noEmit
npm run lint            # eslint .
npm run format:check    # prettier --check .
npm run test            # vitest run
npm run test:watch      # vitest
npm run test:e2e        # playwright test
npm run test:coverage   # vitest --coverage
npm run audit           # npm audit --audit-level=high
npx osv-scanner scan source -r .
npx semgrep scan --config p/typescript --config p/react .
npx gitleaks detect --redact
npx firebase emulators:exec --only firestore "npm run test:rules"
npm run analyze         # rollup/vite bundle analyzer
```

Before using Electron in any environment, add packaging smoke tests and use a pinned/supported Electron toolchain. Do not put real keys into `.env` files committed to the repository; provide `.env.example` with names and safe placeholders only.

---

## 22. Suggested Pull Request Plan

1. **Security blocker cleanup:** fake auth removal, secret persistence removal, credential rotation/verification, raw HTML remediation, Electron hardening.
2. **Dependency remediation:** upgrade critical/high packages, remove deprecated/unused dependencies, add audit and secret-scan gates.
3. **Tooling baseline:** strict TypeScript improvements, ESLint, Prettier, Vitest, CI workflow, build and bundle budgets.
4. **Auth and data boundary:** unified session provider, backend/gateway contract, Firestore rules tests, typed repositories.
5. **Provider adapters:** tested adapters, common HTTP client, timeout/cancellation/retry/error normalization.
6. **Reliability:** cancellable experiment jobs, bounded concurrency, idempotent exports, structured redacted logging.
7. **Architecture decomposition:** split `LLMContext`, `geminiService`, `Dashboard`, and oversized feature components.
8. **Performance/content:** lazy routes, codex content pipeline, dynamic imports, workerized exports.
9. **Accessibility and UX:** semantic controls, focus management, loading/error/empty states, reduced motion, axe tests.
10. **Operations/docs:** README, security/threat model, provider support matrix, release signing, rollback and incident playbooks.

Each PR should include tests and a short migration/rollback note where behavior or persistence changes.

---

## 23. Final Recommendation

**Do not promote the current repository to production or distribute the Electron build to users who will enter real provider credentials.** The build and typecheck are useful prototype milestones, and the repository has a workable foundation in TypeScript, typed feature concepts, Firestore owner rules, and service candidates. The security boundary is not yet real, however: the primary gate is client-controlled, secrets are persisted in plaintext, the Electron renderer is privileged, and untrusted output reaches raw HTML sinks.

The correct next investment is a P0 security and trust-boundary rework, followed by CI/tests and provider-adapter normalization. Only after those changes should performance decomposition, accessibility polish, and reference-grade operations become release gates.
