# Security Policy

## Supported versions

Security fixes are applied to the default branch and the active release branch.

## Reporting a vulnerability

Do not open a public issue for a security vulnerability. Contact the repository maintainers privately with:

- Affected version/commit
- Reproduction steps
- Impact assessment
- Minimal proof of concept without real credentials or third-party data

Never include provider API keys, OAuth tokens, Firebase credentials, private prompts, or user data in a report.

## Production security requirements

- Provider credentials must be held by a backend vault or OS secure storage, never persistent browser storage.
- Firebase rules must be tested with the Emulator Suite before deployment.
- Production builds must pass typecheck, lint, tests, dependency audit, and artifact review.
- Electron releases must be signed and built with the hardened BrowserWindow settings in `electron/main.cjs`.
- Sensitive prompt/output data must be redacted from logs and have an explicit retention policy.
