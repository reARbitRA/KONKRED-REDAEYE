# PROGRESS — REDAEYE v2 Full-Corpus Enhancement (367 entries)

**ORDER CHANGED (2026-08-25):** enhancement now follows the triaged **PRIORITY_QUEUE.md** (Tier S → A → B → C), not sequential IDs.

| Batch | Entries | Status | Notes |
|---|---|---|---|
| 01 | RAE0001–RAE0004 | ✅ done | sequential pilot (Role Entropy · Attention Sink · Erosion · GCG) |
| 02 | Tier S #1–6: RAE0114 · RAE0047 · RAE0048 · RAE0184 · RAE0208 · RAE0201 | ✅ done | all ≥50KB, validated, hypothesis-graded where unpublished; RAE0208 absorbed dup RAE0240 |
| 03 | Tier S #7–12: RAE0228 · RAE0397 · RAE0065 · RAE0341 · RAE0269 · RAE0393 | ✅ done | all ≥50KB; legacy fabrications normalized (GPT-6-Operator, Claude-5-Dev, AutoGPT-Next, Qwen 4); RAE0269 reframed to published logprob mechanism [R34]; RAE0393 grounded in CoT-faithfulness/monitoring literature [R62][R63]; new refs R62–R64 added |
| 04 | Tier S #13–18: RAE0066 · RAE0083 · RAE0398 · RAE0226 · RAE0011 · RAE0050 | ✅ done | all ≥50KB; TIER S COMPLETE (18/18). Legacy fixes: RAE0226 absorbed dups 0254/0259 + replaced "resonance" pseudo-physics with published logit-bias mechanism [R34]; RAE0011's copy-paste mechanism error corrected (logit text → RAE0226; entry rebuilt as harvest/replay); "Gemini-Air/GPT-Browser/AutoGPT-Next/Grok 4" fabrications normalized |
| 05 | Tier A #1–3: RAE0162 · RAE0096 · RAE0079 + Batch-01 debt (RAE0001–0004 to bar) | ✅ done | all 25 entries ≥50KB — **validator: 25/25 PASS, 0 failures** (9 benign family-ref warnings). New refs R65 (FigStep) + R66 (glitch tokens); legacy fixes: RAE0162 'glitch state' → published divergence mechanics [R45]; RAE0079 fabrications normalized |
| 06 | Tier A #4–7: RAE0019 · RAE0055 · RAE0031 · RAE0107 | ✅ done | legal-frame two-axis cluster + trust-forgery cluster completed |
| 07 | Tier A #8–10: RAE0015 (absorbs 0100) · RAE0234 (absorbs 0264) · RAE0081 | ✅ done | **validator 32/32 PASS**; RAE0234 hypothesis-only (divergent-prediction battery vs RAE0002); RAE0081 retires "latent alignment gradient" pseudo-mechanism → implicit selection channel; swarm trio 0263/0217/0253 absorbed into RAE0341 |
| 08 | Tier A #11–13: RAE0104 · RAE0232 (absorbs 0257) · RAE0400 | ✅ done | **TIER A COMPLETE (13 enhanced + 4 merged). Validator 35/35 PASS**; RAE0104 reclassified (legit SysGen → rule-set injection seam); RAE0232 = state-object schema trust (two-channel asymmetry battery); RAE0400 retires 'manifold/Gemini 4' fabrications → published visual-adversarial mechanism [R69]; new ref R69 |
| 09 | Tier B wave 1: RAE0395 · RAE0315 · RAE0153 | ✅ done | **validator 38/38 PASS**; RAE0395=credential/diagnostic seam (canary-walk instrument); RAE0315=consensus dissolution (Byzantine-import, hypothesis-graded batteries); RAE0153=system-channel mimicry (honestly-diminished class, marker battery + dated closures) |
| 10+ | Tier B waves (~185 remaining, composite order) | ⏳ next | ~4-5 entries/message |
| 04 | Tier S #13–18: RAE0066 · RAE0083 · RAE0398 · RAE0226 · RAE0011 · RAE0050 | queued | |
| 05–07 | Tier A (17 entries) | queued | |
| 08+ | Tier B (205, composite order) | queued | |
| final | Tier C: 21 dup merges + ~86 archive/reclassify | queued | |

**Cadence:** say "continue" and I process the next batch. Each batch: full 28-section entries → `entries/`, then regenerate navigator.

**Cross-batch invariants (enforced every batch):**
1. Models only from `models_registry.json` (verified 2026-08-25) — no exceptions.
2. Citations only from `references.md`; unmeasured claims labeled `ESTIMATE` or `HYPOTHESIS`.
3. Legacy `fp` placeholder (73.2) never carried forward.
4. Fabrications found in legacy data logged to `VALIDATION_LOG.md`.
5. Navigator regenerated after every batch via `tools/build_navigator.py`.

**Coverage ledger:** 4 / 367 enhanced (1.1%).

## Non-entry deliverables
| Artifact | Status |
|---|---|
| Assessment harness v2 (`harness/`) — **all 35 entries orchestrated**: 12 probes · 4 audits · 19 checklists, MD report + JSON export | ✅ e2e verified vs mock |
| Bounty platform (`bounty/`) — group bounties, harness-JSON intake, payout splits, leaderboard | ✅ e2e verified |
| Telegram bot (`../telegram-bot/`) — bot/billing/TRC20/router/core/API | ✅ 35/35 tests + 9 live HTTP checks (TEST_REPORT.md) |

## QA Campaign (2026-09-03)
| Check | Result |
|---|---|
| Validator: 38/38 entries, 0 failures, all ≥50KB | ✅ |
| Cross-refs: all [Rxx] citations resolve; all RAE#### targets exist | ✅ |
| front-matter ↔ export id ↔ filename consistency (38/38) | ✅ |
| Payload ID prefixes correct | ✅ |
| Navigator: 367 cards, 38 enhanced, 2MB | ✅ |
| Harness determinism: 3 full runs → identical results | ✅ |
| Edge cases: analyze/classify hardened | ✅ (found & fixed KeyError crash on malformed messages in 3 files) |
| **Total: 17/17 checks PASS** — `harness/output/QA_REPORT_*.md` | 🟢 |

## TIER B COMPLETE (2026-09-24) — v2-compact compilation
| Metric | Value |
|---|---|
| Tier B entries compiled to v2-compact | **202** |
| Full-depth entries (≥50KB, hand-written) | 38 (Tier S 18 + Tier A 17 + Tier B 3) |
| Total validated entries | **240/367** |
| Remaining legacy cards (Tier C) | 127 |
| Validator | 240/240 PASS, 0 failures (29 benign warnings) |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260924_192424.md`) |
| Navigator | 367 cards: 38 v2✓ · 202 v2-lite · 127 legacy/merged — 4.4MB |

**Compiler:** `tools/compile_tierb.py` — legacy→v2-compact with honest normalization: fabricated model refs removed ([unverified model]), pseudo-mechanism vocab flagged not rewritten (58 entries), efficacy figures labeled ESTIMATE, dangling RAE refs annotated, evidenceLevel=legacy-synthesized, triage composite embedded.

**Full-upgrade queue (top-15 by composite):** RAE0307 · RAE0051 · RAE0033 · RAE0115 · RAE0241 · RAE0274 · RAE0275 · RAE0279 · RAE0416 · RAE0388 · RAE0006 · RAE0399 · RAE0414 · RAE0038 · RAE0204

## Top-15 Full-Upgrade — Wave 1 (2026-09-24)
| Entry | Depth | Status |
|---|---|---|
| RAE0307 Latent-Document Reconstruction | full ≥50KB | ✅ yield-spectrum battery; legacy 'hidden document' overclaim retired |
| RAE0051 Unauthorized Model Extraction | full ≥50KB | ✅ slice theorem; 'shadow copy' fantasy retired; economics-as-defense framing |
| RAE0033 Graduated Boundary Normalization | full ≥50KB | ✅ paired battery (graduated vs attrition); novelty-ledger instrument |

**Running: 41 full-depth entries · 199 compact · 240 validated · validator 240/240 PASS.**
Next in upgrade queue: RAE0115 · RAE0241 · RAE0274 · RAE0275 · RAE0279 · RAE0416 · RAE0388 · RAE0006 · RAE0399 · RAE0414 · RAE0038 · RAE0204

## Top-15 Full-Upgrade — Wave 2 (2026-09-24) — 5 entries per round
| Entry | Depth | Status | Key contribution |
|---|---|---|---|
| RAE0115 Adversarial Suffix Engineering | full ≥50KB | ✅ | craft layer of RAE0004: transfer matrices, readability frontiers [R09], screen fingerprints, quarterly craft review |
| RAE0241 Attention-Head Targeting Claims | full ≥50KB | ✅ | interpretability boundary-marker: four-cell retirement test, citation-chain audit, impostor arithmetic — pseudo-mechanism honestly graded |
| RAE0274 Activation Steering | full ≥50KB | ✅ | the real published mechanism [R70][R71][R72]: access-map audits, retention batteries, hook-exposure census, white-box chapter kit |
| RAE0275 Universal Suffix Transfer | full ≥50KB | ✅ | double-decay model, fleet matrices, signature-sharing consortia, underwriting tables, substrate-diversity as accidental hardening |
| RAE0279 Tool-Protocol Forgery | full ≥50KB | ✅ | history channel: fait-accompli asymmetry measurement, render-as-record probes, provenance-semantics reference design, audit-poisoning counter |

**Running: 46 full-depth entries · 194 compact · 240 validated · validator 240/240 PASS.**
Next in upgrade queue: RAE0416 · RAE0388 · RAE0006 · RAE0399 · RAE0414 (wave 3, 5 per round)

## TOP-15 UPGRADE — Wave 3 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0416 · RAE0388 · RAE0006 · RAE0399 · RAE0414 |
| Full-depth entries after wave | **51** |
| Compact entries after wave | **189** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 25 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260924_231002.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 51 full + 189 compact + 127 legacy |

**Wave 3 quality note:** generated full entries were checked for repeated-sentence padding; target files have **0 duplicate long sentences** after the quality pass. Unsafe/harmful domains (RAE0416 hazardous-content obfuscation, RAE0414 IP/code mapping, RAE0399 API-response forgery) were reframed as canary-only defensive assessment instruments with explicit no-real-target/no-operational-content boundaries.

**Next Top-15 wave:** RAE0038 · RAE0204 + next composite-priority entries (final 3+ depending on the queue snapshot).

## TOP-15 / Tier-B Upgrade — Wave 4 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0038 · RAE0204 · RAE0308 · RAE0148 · RAE0044 |
| Full-depth entries after wave | **56** |
| Compact entries after wave | **184** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 25 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_005540.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 56 full + 184 compact + 127 legacy |

**Wave 4 quality note:** target files were checked for repeated-sentence padding; all five have **0 duplicate long sentences**. RTOR, markup, visual/OCR, and policy-inversion classes were reframed as canary-only defensive instruments; no operational exploit recipes were included.

## Tier-B Upgrade — Wave 5 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0142 · RAE0273 · RAE0277 · RAE0313 · RAE0314 |
| Full-depth entries after wave | **61** |
| Compact entries after wave | **179** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 24 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_010432.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 61 full + 179 compact + 127 legacy |

**Wave 5 quality note:** target files were checked for repeated-sentence padding; all five have **0 duplicate long sentences**. ENI and HLI were explicitly downgraded to hypothesis-only/behavior-only instruments; no latent eigenvector, quantum, or non-Euclidean mechanism is asserted as fact.

## Tier-B Upgrade — Wave 6 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0149 · RAE0289 · RAE0339 · RAE0258 · RAE0032 |
| Full-depth entries after wave | **66** |
| Compact entries after wave | **174** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 24 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_011330.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 66 full + 174 compact + 127 legacy |

**Wave 6 quality note:** target files were checked for repeated-sentence padding; all five have **0 duplicate long sentences**. RAE0289 and RAE0258 were explicitly downgraded to hypothesis-only/behavior-only instruments; RAE0339 was grounded as RAG source-trust assessment; RAE0032 was converted to supportive-refusal/emotional-coercion resilience testing.

## Tier-B Upgrade — Wave 7 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0134 · RAE0198 · RAE0285 · RAE0300 · RAE0126 |
| Full-depth entries after wave | **71** |
| Compact entries after wave | **169** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 23 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_015151.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 71 full + 169 compact + 127 legacy |

**Wave 7 preservation note:** legacy claims were not treated as discarded. Each upgraded entry now includes legacy-preservation language inside the existing 28-key schema: original legacy concepts remain traceable via `arsenal_T.json` and are referenced as audit artifacts while unsafe-operational or unsupported claims are labeled canary-only / hypothesis-only / not-verified. Target files were checked for repeated-sentence padding; all five have **0 duplicate long sentences**.

## Tier-B Upgrade — Wave 8 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0197 · RAE0137 · RAE0144 · RAE0284 · RAE0119 |
| Full-depth entries after wave | **76** |
| Compact entries after wave | **164** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 23 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_040724.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 76 full + 164 compact + 127 legacy |

**Wave 8 preservation note:** legacy claims are preserved as audit artifacts in the existing 28-key schema and via `arsenal_T.json`; unsafe-operational or unsupported claims are labeled canary-only / hypothesis-only / not-verified rather than silently dropped. Target files have **0 duplicate long sentences**.

## Tier-B Upgrade — Wave 9 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0121 · RAE0132 · RAE0154 · RAE0161 · RAE0248 |
| Full-depth entries after wave | **81** |
| Compact entries after wave | **159** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 23 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_042249.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 81 full + 159 compact + 127 legacy |

**Wave 9 preservation note:** legacy claims are preserved as audit artifacts in the existing 28-key schema and via `arsenal_T.json`; unsafe-operational or unsupported claims are labeled canary-only / hypothesis-only / not-verified rather than silently dropped. Target files have **0 duplicate long sentences**.

## Tier-B Upgrade — Wave 10 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0288 · RAE0306 · RAE0403 · RAE0129 · RAE0143 |
| Full-depth entries after wave | **86** |
| Compact entries after wave | **154** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 23 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_044034.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 86 full + 154 compact + 127 legacy |

**Wave 10 preservation note:** legacy claims are preserved as audit artifacts in the existing 28-key schema and via `arsenal_T.json`; unsafe-operational or unsupported claims are labeled canary-only / hypothesis-only / not-verified rather than silently dropped. Target files have **0 duplicate long sentences**.

## Tier-B Upgrade — Wave 11 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0310 · RAE0266 · RAE0293 · RAE0155 · RAE0271 |
| Full-depth entries after wave | **91** |
| Compact entries after wave | **149** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 21 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_051425.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 91 full + 149 compact + 127 legacy |

**Wave 11 preservation note:** legacy claims are preserved as audit artifacts in the existing 28-key schema and via `arsenal_T.json`; unsafe-operational or unsupported claims are labeled canary-only / hypothesis-only / not-verified rather than silently dropped. Target files have **0 duplicate long sentences**.

## Tier-B Upgrade — Wave 12 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0309 · RAE0116 · RAE0125 · RAE0127 · RAE0130 |
| Full-depth entries after wave | **96** |
| Compact entries after wave | **144** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 21 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_051837.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 96 full + 144 compact + 127 legacy |

**Wave 12 preservation note:** legacy claims are preserved as audit artifacts in the existing 28-key schema and via `arsenal_T.json`; unsafe-operational or unsupported claims are labeled canary-only / hypothesis-only / not-verified rather than silently dropped. Target files have **0 duplicate long sentences**.

## Tier-B Upgrade — Wave 13 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0150 · RAE0286 · RAE0304 · RAE0323 · RAE0328 |
| Full-depth entries after wave | **101** |
| Compact entries after wave | **139** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 21 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_055106.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 101 full + 139 compact + 127 legacy |

**Wave 13 preservation note:** legacy claims are preserved as audit artifacts in the existing 28-key schema and via `arsenal_T.json`; unsafe-operational or unsupported claims are labeled canary-only / hypothesis-only / not-verified rather than silently dropped. Target files have **0 duplicate long sentences**.

## Legacy Raw Preservation Patch — Complete (2026-09-25)
| Metric | Value |
|---|---|
| Purpose | Restore/preserve every legacy raw field that may have been omitted, rewritten, normalized, or label-converted in v2 entries |
| Source of truth | `../arsenal_T.json` |
| Legacy records archived | **367/367** |
| Per-ID raw JSON files | **367** under `legacy_preservation/by_id/` |
| Enhanced entries patched | **240/240** |
| Embedded preservation format | `LEGACY_RAW_PRESERVATION_BLOCK` inside `extendedInterpretationLayer.content` |
| Raw encoding inside entries | Base64 of canonical UTF-8 JSON (`sort_keys=True`, compact separators) |
| Manifest | `legacy_preservation/manifest.json` |
| Global canonical SHA256 | `6c4916d1484e91c3a9dbf2557f4420fb98c0ce1dddd21084a64e9fb62c1afe32` |
| Validator after patch | **240/240 PASS, 0 failures, 21 warnings** |
| QA Campaign after patch | **17/17 PASS** (`harness/output/QA_REPORT_20260925_055425.md`) |
| Navigator after patch | rebuilt — 367 cards, 240 enhanced, 101 full + 139 compact + 127 legacy |

**Important:** v2 interpretations still label unsupported/unsafe/fabricated legacy claims as `hypothesis-only`, `not-verified`, or `canary-only`, but the original raw legacy content is now preserved losslessly and recoverably in both per-ID JSON files and entry-embedded Base64 preservation blocks.

## Tier-B Upgrade — Wave 14 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0060 · RAE0292 · RAE0145 · RAE0089 · RAE0113 |
| Full-depth entries after wave | **106** |
| Compact entries after wave | **134** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 20 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_055922.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 106 full + 134 compact + 127 legacy |
| Legacy preservation | Re-applied; Wave 14 entries contain `LEGACY_RAW_PRESERVATION_BLOCK` |

**Wave 14 preservation note:** legacy raw content is preserved losslessly via per-ID JSON plus entry-embedded Base64 blocks; unsafe-operational or unsupported claims are labeled canary-only / hypothesis-only / not-verified. Target files have **0 duplicate long sentences**.

## Queue correction after Wave 14 (2026-09-25)
| Field | Corrected value |
|---|---|
| Next compact Tier-B candidates | **RAE0172 · RAE0209 · RAE0062 · RAE0064 · RAE0189** |
| Source | `priority_queue.json` machine-readable order |

## Tier-B Upgrade — Wave 15 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0172 · RAE0209 · RAE0062 · RAE0064 · RAE0189 |
| Full-depth entries after wave | **111** |
| Compact entries after wave | **129** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 20 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_064255.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 111 full + 129 compact + 127 legacy |
| Legacy preservation | Re-applied; Wave 15 entries contain `LEGACY_RAW_PRESERVATION_BLOCK` |

## Tier-B Upgrade — Wave 16 Complete (2026-09-25)
| Metric | Value |
|---|---|
| Upgraded from v2-compact to full-depth | **5** — RAE0180 · RAE0220 · RAE0171 · RAE0028 · RAE0046 |
| Full-depth entries after wave | **116** |
| Compact entries after wave | **124** |
| Total validated entries | **240/367** |
| Remaining legacy cards | **127** |
| Validator | **240/240 PASS, 0 failures, 20 warnings** |
| QA Campaign | **17/17 PASS** (`harness/output/QA_REPORT_20260925_065126.md`) |
| Navigator | rebuilt — 367 cards, 240 enhanced, 116 full + 124 compact + 127 legacy |
| Legacy preservation | Re-applied; Wave 16 entries contain `LEGACY_RAW_PRESERVATION_BLOCK` |
