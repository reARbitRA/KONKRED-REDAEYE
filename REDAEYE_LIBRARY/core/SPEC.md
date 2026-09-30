# REDAEYE ARSENAL v2 — ENHANCEMENT SPECIFICATION

**Project:** Enhance all 367 techniques in `REDAEYE_ARSENAL` to full `rae0184v2` depth (28 sections, ~50KB each),
with strict factual validation. Zero hallucination. Zero fabricated models. Zero invented measurements.

**Source of truth:** `redaeye_v2/entries/RAE****.md` — TypeScript `Technique` objects, drop-in compatible with
`reference-ram-strings`. The HTML navigator is *generated* from these files (never hand-edited).

**Legacy data:** `arsenal_T.json` (extracted from the original HTML, 367 entries, 44 compact fields).
Legacy fields map into the v2 schema; unverifiable legacy claims are either grounded, labeled, or dropped.

---

## 1. THE 29-SECTION SCHEMA (exact rae0184v2 shape)

```
id, name, objective, mechanism, mitigation          // core (strings)
metadata { version:"2.0.0", created, updated:"2026-08-25", difficulty, category, subcategory,
           status, author, tags[], complexityScore, stealthScore, impactScore,
           validation { evidenceLevel, verifiedModels[], references[] } }   // v2 addition (inside metadata only)
preconditions { description, items[] }
failureModes { description, items[] }
attackChain { stage, pairsWellWith[], killChainStage[] }
defensePressurePoints { primary[], secondary[], layer[] }
usage { whenToUse, whenNotToUse, bestPractices[], commonMistakes[], detectionEvasion[], operationalNotes[] }
technicalExpansionLayer { content }
adversarialMechanics { content }
modelInternalExploitationPathways { content }
transformerArchitectureImpactAnalysis { content }
operationalDeploymentScenarios { content }
multiStageAttackIntegration { content }
blueTeamDetectionWeaknesses { content }
redTeamEscalationOpportunities { content }
variantFamilies { content }
failureStates { content }
defensiveCountermeasuresThatFail { content }
highLevelResearchCommentary { content }   // ← where research citations live in prose
extendedInterpretationLayer { content }
ultraDeepAdversarialFieldNotes { content }
payloads [ { id, title, description, content } ]
edgeCasePayloads [ { id, title, description, content } ]
finalExpansionSummary (string)
```

## 2. FACTUAL RULES (non-negotiable)

1. **Model names.** Every model referenced must exist in `models_registry.json` — either
   `verified_current` (exists as of 2026-08-25, web-checked) or `verified_legacy` (real, dated, superseded).
   Fabricated legacy names ("GPT-5 (o2)", "Gemini 2 Ultra", "Claude 3.7 Opus", "Llama 5", "Qwen 4 Max",
   "Grok 4 (Swarm)", "Mamba-3-Large", "Jamba 2 (Ultra)", "Perplexity-Alpha 2026", "Sora-Interactive",
   "DeepSeek-V4 Ultra" …) are **normalized** per the registry map and never used.
2. **Citations.** Only entries from `references.md` may be cited. Each reference there is marked
   `verified` (bibliographic details confirmed) or `high-confidence` (well-known, ID omitted where uncertain).
   Never invent titles, authors, arXiv IDs, venues, or findings. If a claim has no citable basis, it is
   marked `HYPOTHESIS:` inline with explicit reasoning.
3. **Efficacy.** The legacy `fp` field (all 367 entries carry the identical placeholder `73.2`) is **dropped**.
   Per-model efficacy is expressed qualatively (Low / Moderate / High) inside an explicit block:
   `ESTIMATE — qualitative judgment, NOT a measured result`. Any number that IS stated must come from a cited
   paper (paper, model, year, metric).
4. **Mechanism claims.** Attention/saliency/internal-state explanations must be either (a) grounded in cited
   interpretability research, or (b) explicitly framed as hypotheses. No invented "observed in white-box models"
   telemetry.
5. **Payloads.** Structural red-team templates with `{PLACEHOLDERS}`, written for defensive validation.
   No content-specific operational targeting of real-world harms.
6. **Dates.** `updated: "2026-08-25"`. Knowledge cutoffs respected; anything time-sensitive says "as of".

## 3. STYLE

- Voice: precise, mechanistic, operator-grade — same register as rae0184v2.
- TS object in a Markdown file with YAML front-matter `id`.
- Escaped `\n` inside double-quoted strings for multi-line `content` fields.
- `metadata.validation.evidenceLevel`: `published-research | partial-research | hypothesis-only`.

## 4. PIPELINE

```
entries/*.md  ──tools/build_navigator.py──▶  navigator/index.html  (single-file, offline, searchable)
                (reads arsenal_T.json for the 363 not-yet-enhanced legacy cards)
```

## 5. BATCH PLAN (367 entries, ~4-6 per message)

| Batch | Entries | Status |
|---|---|---|
| 01 | RAE0001–RAE0004 | this message |
| 02 | RAE0005–RAE0010 | next ("continue") |
| … | sequential | tracked in PROGRESS.md |

Legacy fabrications corrected during batch 01 are logged in `VALIDATION_LOG.md`.
