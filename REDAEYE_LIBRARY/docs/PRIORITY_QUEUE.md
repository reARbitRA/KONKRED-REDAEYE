# PRIORITY QUEUE — REDAEYE v2 Enhancement Order
*Generated 2026-08-25 by triage scan + expert curation. Machine-readable: `priority_queue.json`, `triage.json`.*

## Method
Every legacy entry scored on four axes (heuristics + manual overrides):
- **P — Power**: what success yields (persistence/privilege/exfil > content bypass > DoS/trivia)
- **E — Effect**: evidence basis (direct published anchor ≥7; credible extension 5–6; speculative ≤4)
- **C — Currency**: relevance to the verified Aug-2026 surface (agents/tools/memory/multimodal/reasoning ↑; patched 2023-era tricks ↓; physics-washing ↓)
- **U — Unique**: after near-duplicate clustering (336 unique concepts from 367 entries; 21 exact-dup merges)

**Result: 367 legacy entries → 4 done + 18 Tier S + 17 Tier A + 205 Tier B + 107 Tier C (merges/speculative/dead/misfiled).**

---

## 🅢 TIER S — enhance FIRST (18 entries, batches 02–04)
Highest power × evidence × currency; each covers a *distinct* high-value surface:

| # | ID | Technique | Why first |
|---|----|-----------|-----------|
| 1 | RAE0114 | Indirect Prompt Injection | The canonical agentic attack — Greshake et al. 2023; foundation for half the corpus |
| 2 | RAE0047 | Training-Data Poisoning (Trigger Phrases) | Upstream supply chain; published class (Qi et al. 2023); runtime guardrails irrelevant to it |
| 3 | RAE0048 | LoRA Backdoor Implantation | Published class; adapter supply chains are the 2026 open-weight reality |
| 4 | RAE0184 | Agentic Environment Shadowing | The corpus's own reference exemplar — must exist as a v2 entry |
| 5 | RAE0208 | Agentic Memory-Hole Race Condition | Write-vs-audit race in memory pipelines; novel + credible (merge RAE0240) |
| 6 | RAE0201 | Memory-Stream Poisoning (RAG injection) | Persistent state compromise; memory integrity is the #1 open 2026 gap |
| 7 | RAE0228 | Agentic Config-Shadowing / Persistence | Freeze eroded state into configuration artifacts |
| 8 | RAE0397 | Recursive Tool-Chain Poisoning | Lateral payload migration across tool calls; MCP-security adjacent |
| 9 | RAE0065 | Tool-Calling Escalation (Kill-Chaining) | Chained tool abuse → real-world effects |
| 10 | RAE0341 | Swarm-Identity Impersonation | Multi-agent trust hijack; swarms are 2026 infrastructure |
| 11 | RAE0269 | System-Prompt Extraction (API surfaces) | Direct published anchor — Nasr et al. 2025 logprob/logit-bias attacks |
| 12 | RAE0393 | Latent Monologue Extraction | Thinking-trace leakage on reasoning tiers — current, under-defended |
| 13 | RAE0066 | Latent Context Reinfection | Worm/persistence class (Morris-II adjacent) |
| 14 | RAE0083 | Recursive Planner-State Contamination | Poison the plan, not the prompt |
| 15 | RAE0398 | Browser-Context Smuggling (DOM injection) | Computer-use/browser agents are the newest wide surface |
| 16 | RAE0226 | Logit-Bias Surface Attacks | Real published class (merges RAE0254, RAE0259) |
| 17 | RAE0011 | Chain-of-Thought Leakage Harvest | Reasoning-trace family; pairs with RAE0393 |
| 18 | RAE0050 | Alignment-Data Tainting | Refusal-pattern corruption at training time; supply chain |

## 🅐 TIER A — next (17 entries, batches 05–07)
RAE0162 Repeat-Token Glitch (memorized-data leak) · RAE0096 Modality-Injection Poisoning · RAE0079 Iterative Modality Crossfade · RAE0019 Latent Policy-Gradient Hijack · RAE0015/RAE0100 Multi-Persona Debate (merge candidates) · RAE0055 Legal Jargon Obfuscation · RAE0234/RAE0264 Attention-Sink/Head (positional family — merge into RAE0002 lineage) · RAE0031 Jurisdictional Relativism · RAE0107 Chain-of-Hindsight · RAE0104 Systematic Generalization · RAE0232/RAE0257/RAE0263 Swarm-state tainting cluster · RAE0081 Latent Alignment Gradient Hijacking · RAE0400 Cross-Modal Gradient Drift

## 🅑 TIER B — bulk wave (205 entries)
Solid mid-value: persona variants, obfuscation families, context manipulations, published-family descendants. Enhanced in composite-score order after Tier A.

## 🅒 TIER C — merge / reclassify / archive (107 entries)
- **21 exact-duplicate merges** (map in `priority_queue.json`: dup → keep)
- **Speculative/physics-washing** (~15): KV-Cache Eviction family, "Neuro-Semantic Resonance", "Quantum Superposition", ultrasonic audio injection, SAE activation hijack — hypotheses without published basis; enhance last, honestly labeled `hypothesis-only`, or archive
- **Dead/patched 2023-era** (~20): emoji ciphers, base64/rot13 nesting, "ignore previous" declarations — keep as historical controls only
- **Misfiled non-attacks** (e.g., RAE0138 Self-Efficacy Prompting = performance technique) — reclassify
- DoS-class and truncation-artifact entries (incl. data-quality ID "RAE03430")

---

## Batch plan (updated)
| Batch | Content | Status |
|---|---|---|
| 01 | RAE0001–0004 (sequential pilot) | ✅ done |
| 02 | Tier S #1–6 (RAE0114, RAE0047, RAE0048, RAE0184, RAE0208, RAE0201) | ⏳ next — say "continue" |
| 03 | Tier S #7–12 | queued |
| 04 | Tier S #13–18 | queued |
| 05–07 | Tier A (17) | queued |
| 08+ | Tier B in composite order | queued |
| last | Tier C merge/archive pass | queued |

*Rule: merged duplicates are absorbed as variants inside their keep-entry's `variantFamilies` section, not written separately.*

## Update — Top-15 Wave 3 completed (2026-09-25)
Upgraded to full-depth: **RAE0416 · RAE0388 · RAE0006 · RAE0399 · RAE0414**. Validator: **240/240 PASS, 0 failures**. Navigator rebuilt: **51 full + 189 compact + 127 legacy**.

Next upgrade set starts with **RAE0038 · RAE0204** plus the next composite-priority entries selected from the remaining compact queue.

## Update — Wave 4 completed (2026-09-25)
Upgraded to full-depth: **RAE0038 · RAE0204 · RAE0308 · RAE0148 · RAE0044**. Validator: **240/240 PASS, 0 failures**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **56 full + 184 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0142 · RAE0273 · RAE0277 · RAE0313 · RAE0314**.

## Update — Wave 5 completed (2026-09-25)
Upgraded to full-depth: **RAE0142 · RAE0273 · RAE0277 · RAE0313 · RAE0314**. Validator: **240/240 PASS, 0 failures, 24 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **61 full + 179 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0149 · RAE0289 · RAE0339 · RAE0258 · RAE0032**.

## Update — Wave 6 completed (2026-09-25)
Upgraded to full-depth: **RAE0149 · RAE0289 · RAE0339 · RAE0258 · RAE0032**. Validator: **240/240 PASS, 0 failures, 24 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **66 full + 174 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0134 · RAE0198 · RAE0285 · RAE0300 · RAE0126**.

## Update — Wave 7 completed (2026-09-25)
Upgraded to full-depth: **RAE0134 · RAE0198 · RAE0285 · RAE0300 · RAE0126**. Validator: **240/240 PASS, 0 failures, 23 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **71 full + 169 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0197 · RAE0137 · RAE0144 · RAE0284 · RAE0119**.

## Update — Wave 8 completed (2026-09-25)
Upgraded to full-depth: **RAE0197 · RAE0137 · RAE0144 · RAE0284 · RAE0119**. Validator: **240/240 PASS, 0 failures, 23 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **76 full + 164 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0121 · RAE0132 · RAE0154 · RAE0161 · RAE0248**.

## Update — Wave 9 completed (2026-09-25)
Upgraded to full-depth: **RAE0121 · RAE0132 · RAE0154 · RAE0161 · RAE0248**. Validator: **240/240 PASS, 0 failures, 23 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **81 full + 159 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0288 · RAE0306 · RAE0403 · RAE0129 · RAE0143**.

## Update — Wave 10 completed (2026-09-25)
Upgraded to full-depth: **RAE0288 · RAE0306 · RAE0403 · RAE0129 · RAE0143**. Validator: **240/240 PASS, 0 failures, 23 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **86 full + 154 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0310 · RAE0266 · RAE0293 · RAE0155 · RAE0271**.

## Update — Wave 11 completed (2026-09-25)
Upgraded to full-depth: **RAE0310 · RAE0266 · RAE0293 · RAE0155 · RAE0271**. Validator: **240/240 PASS, 0 failures, 21 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **91 full + 149 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0309 · RAE0116 · RAE0125 · RAE0127 · RAE0130**.

## Update — Wave 12 completed (2026-09-25)
Upgraded to full-depth: **RAE0309 · RAE0116 · RAE0125 · RAE0127 · RAE0130**. Validator: **240/240 PASS, 0 failures, 21 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **96 full + 144 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0150 · RAE0286 · RAE0304 · RAE0323 · RAE0328**.

## Update — Wave 13 completed (2026-09-25)
Upgraded to full-depth: **RAE0150 · RAE0286 · RAE0304 · RAE0323 · RAE0328**. Validator: **240/240 PASS, 0 failures, 21 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **101 full + 139 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0060 · RAE0292 · RAE0145 · RAE0089 · RAE0113**.

## Update — Legacy raw preservation patch completed (2026-09-25)
All enhanced entries now include a recoverable `LEGACY_RAW_PRESERVATION_BLOCK`; all 367 legacy records are archived under `legacy_preservation/by_id/`. Validator remains **240/240 PASS, 0 failures** and QA Campaign remains **17/17 PASS**.

## Update — Wave 14 completed (2026-09-25)
Upgraded to full-depth: **RAE0060 · RAE0292 · RAE0145 · RAE0089 · RAE0113**. Validator: **240/240 PASS, 0 failures, 20 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **106 full + 134 compact + 127 legacy**.

Next compact Tier-B candidates by queue order: **RAE0140 · RAE0151 · RAE0159 · RAE0160 · RAE0165**.

## Correction — Next Wave after Wave 14 (2026-09-25)
The authoritative machine-readable queue (`priority_queue.json`) gives the next compact Tier-B candidates as: **RAE0172 · RAE0209 · RAE0062 · RAE0064 · RAE0189**. The previous appended next-wave line is superseded by this correction.

## Update — Wave 15 completed (2026-09-25)
Upgraded to full-depth: **RAE0172 · RAE0209 · RAE0062 · RAE0064 · RAE0189**. Validator: **240/240 PASS, 0 failures, 20 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **111 full + 129 compact + 127 legacy**.

## Update — Wave 16 completed (2026-09-25)
Upgraded to full-depth: **RAE0180 · RAE0220 · RAE0171 · RAE0028 · RAE0046**. Validator: **240/240 PASS, 0 failures, 20 warnings**. QA Campaign: **17/17 PASS**. Navigator rebuilt: **116 full + 124 compact + 127 legacy**.
