# REDAEYE Bounty Platform

Group bug-bounties for AI security, wired to the assessment harness.

## Flow

```
harness.py --json findings.json          # canary-grade assessment of YOUR stack
        │
        ▼
POST /api/reports {findings_path}        # group submits the export verbatim
        │
        ▼
triage → accepted → paid {split}         # org admin drives states
        │
        ▼
GET /api/leaderboard                     # earnings per group
```

## API

| Method | Path | Body | Auth |
|---|---|---|---|
| POST | `/api/programs` | `{name, scope, pool_usdt}` | admin |
| GET | `/api/programs` | — | — |
| POST | `/api/groups` | `{name, members:[handles]}` | — |
| POST | `/api/reports` | `{program_id, group_id, findings_path \| findings, severity}` | — |
| GET | `/api/programs/{id}/reports` | — | — |
| POST | `/api/reports/{id}/status` | `{state, split?}` — states: new→triage→accepted→paid→disclosed/rejected; `paid` needs `split` summing to 1.0 | admin |
| GET | `/api/leaderboard` | — | — |

Admin auth: `X-Admin-Token` header, value from env `BOUNTY_ADMIN_TOKEN` (set it in production).

## Run

```bash
BOUNTY_ADMIN_TOKEN=secret python3 server.py   # → :8020
```

## Verified (e2e)

program → group → harness-JSON intake (auto-titled "harness run (12 findings)")
→ triage → accepted → paid with 3-way split (250 USDT split 50/30/20)
→ invalid splits & states rejected (400) → leaderboard correct.
