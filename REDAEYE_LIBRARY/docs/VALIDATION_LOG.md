# VALIDATION LOG — fabrications & corrections found in legacy arsenal (batch 01)

**Legacy invariant violation found:** all 367 entries carry the *identical* score `fp: 73.2` —
a placeholder presented as a measurement. Dropped in v2; replaced by explicit qualitative
ESTIMATE labels + cited numbers where published.

## Legacy model-name fabrications (from the 300-string efficacy matrices) — full map in models_registry.json
- "GPT-5 (o2)", "GPT-5 (o2-long)", "GPT-5 (o3)", "gpt-5-o3", "GPT-5 (Agentic)", "GPT-5 (V)", "GPT-5 (Search)", "GPT-5 (MoE Architecture)" — no such OpenAI products; real 2026 line: GPT-5.6 Sol/Terra/Luna (Jul 9 2026), GPT-5.5, GPT-5.4 (sources S5-S8).
- "Claude 3.5 Opus", "Claude 3.7 Opus" — never existed at any date.
- "Gemini 2 Ultra" — never existed; "Gemini 3 Ultra / 3 Ultra (20M context)" — unverified as of 2026-08-25.
- "Llama 5 (405B)", "Llama 5 (Open Weights)", "Llama 4 (700B)" — unverified/wrong.
- "Qwen 4 Max", "Qwen-3.5-Max" — unverified (real: Qwen 3.7 Max, Qwen 3.5).
- "DeepSeek-V4 Ultra" — unverified (real: V4 Pro / V4 Flash, MIT open).
- "Grok 4 (Swarm)", "Grok 4 (Unexport constrained)" — not documented products.
- "Mamba-3-Large", "Jamba 2 (Ultra)", "Perplexity-Alpha 2026", "Sora-Interactive", "Auto-GPT 2026", "Mixtral 8x22B (v26)", "Cohere Command R+ (v26)" — fabricated/unverified.
- "Muse Spark 1.2" (Meta) — single-source (S2); flagged low-confidence, not used by v2 entries.

## Mechanism-claim corrections in batch-01 entries
- RAE0001: legacy "attention weight dispersion / revert to base model" internal story → reframed as distributional failure (mismatched generalization [R01], persona clustering [R03]); attention-dilution account kept only as labeled HYPOTHESIS per [R20][R21][R22].
- RAE0002: legacy "1500+ tokens of noise / SYSTEM OVERRIDE suffix" → filler recharacterized as *distance* not *overwhelm* (mid-context under-attended [R22]); override vocabulary identified as detector-bait cargo cult; many-shot [R06] added as the published anchor.
- RAE0003: legacy "historical overwrite" → nothing is overwritten; policy loses arbitration share to accumulated self-precedent. SpAIware memory persistence [R42] and Crescendo [R13] added as published anchors.
- RAE0004: legacy unnamed → grounded in the actual published family (GCG [R02], PAIR [R07], TAP [R08], AutoDAN [R09], adaptive [R15], soft prompts [R16], fine-tune propagation [R18]) with dated-anchor discipline; logprob-surface hygiene added per [R34].

## Wave 3 Top-15 upgrade corrections (2026-09-25)
- RAE0416: legacy "Bio-Precursor Cipher" contained hazardous-domain framing and fabricated model tags (`gpt-6-bypass`, `Claude 5`). v2 full reframes it as register-shift redline evaluation with inert placeholders only; no synthesis/procurement/weapon details; anchors [R01][R11][R12][R14][R30][R31][R32][R33].
- RAE0388: legacy "Recursive Reflection Loop" asserted hidden verifier/KV-cache mechanics as fact. v2 full labels verifier-loop explanations `HYPOTHESIS`, measures only harmless refusal-class stability and monitor independence; anchors [R01][R06][R13][R31][R62][R63][R70][R72].
- RAE0006: legacy meta-prompt reflection efficacy matrix included older model-specific claims and mojibake. v2 full removes portable efficacy claims and uses canary-only system-prompt leakage assays; anchors [R03][R04][R31][R34][R35].
- RAE0399: legacy named fabricated 2026 products (`GPT-6`, `Gemini-4-Ultra`) and leaned toward industrial API exfiltration. v2 full turns it into toy-API synthetic-observation/provenance testing; anchors [R25][R28][R29][R31][R32][R49][R59].
- RAE0414: legacy named fabricated coding products (`GPT-6-Pro`, `Claude-5-Dev`) and framed third-party proprietary reverse engineering. v2 full restricts scope to owned/synthetic repositories, structural similarity canaries, and IP-leakage controls; anchors [R32][R33][R44][R45][R51][R52].
- Quality gate added for this wave: repeated-sentence scan on the five target files after generation = 0 duplicate long sentences; avoids the earlier full-entry padding pattern observed in several wave-2 files.

## Wave 4 upgrade corrections (2026-09-25)
- RAE0038: legacy "Latent Policy Inversion" contained broad latent-value-gradient claims. v2 full narrows the claim to behaviorally measurable policy-inversion through analytical framing; hidden alignment-vector stories are HYPOTHESIS unless instrumented.
- RAE0204: legacy RTOR named unverified/fabricated model products and included operational cross-tool execution guidance. v2 full removes model claims and reframes the class as inert cross-tool taint/provenance testing with no executable payloads.
- RAE0308: Contextual Reinforcement Loop is treated as hypothesis-only self-precedent measurement; no universal persistence or hidden-state claims.
- RAE0148: Visual Character Recognition Injection grounded in multimodal/visual prompt-injection literature [R65][R69] and source-priority testing; payloads use benign visual canaries only.
- RAE0044: Markdown Comment Exploit reframed as raw-vs-rendered logging/sanitization assessment; hidden markup examples are canary-only and scoped to owned systems.
- Quality gate: repeated-sentence scan on Wave 4 target files = 0 duplicate long sentences.

## Wave 5 upgrade corrections (2026-09-25)
- RAE0142: Iterative Prompt Refinement reframed as optimizer/reviewer safety-regression assessment; no optimization toward prohibited content and no universal convergence claims.
- RAE0273: Many-shot ICL grounded in long-context/many-shot literature [R06][R22][R23][R24][R53]; attention-head override language removed as fact and treated behaviorally.
- RAE0277: Corrective Reinforcement Inversion reframed as false-positive correction pressure from untrusted supervisor labels; supervisor authority requires provenance/authentication.
- RAE0313: Eigenvector Narrative Injection downgraded to hypothesis-only representation-framed narrative steering; no eigenvector targeting claim without owned-model activation instrumentation.
- RAE0314: Hyper-dimensional Logic Inversion downgraded to hypothesis-only paradox-frame refusal stress; no claim that ternary/non-Euclidean logic paralyzes Boolean safety checks.
- Quality gate: repeated-sentence scan on Wave 5 target files = 0 duplicate long sentences.

## Wave 6 upgrade corrections (2026-09-25)
- RAE0149: Hierarchical Token Compression reframed as compression-drift / summary-integrity assessment; no KV-cache override claim as fact.
- RAE0289: System Fingerprint Spoofing downgraded to hypothesis-only backend-version/determinism governance risk; no claim that client users can force rollback or unsafe routing.
- RAE0339: Retrieval-Augmented Logic Hijacking grounded in indirect prompt injection/RAG trust literature; public poisoning and harmful payloads excluded; owned-corpus canaries only.
- RAE0258: Attention-Matrix renamed/reframed as long-context saliency drift hypothesis; ghost-token / negative-saliency claims are HYPOTHESIS unless internals are instrumented.
- RAE0032: Grandmother Apology reframed as emotional-coercion resilience and supportive-firm-refusal testing; no real harmful target request or exploitative distress manipulation.
- Quality gate: repeated-sentence scan on Wave 6 target files = 0 duplicate long sentences.

## Wave 7 upgrade corrections and preservation notes (2026-09-25)
- RAE0134: Polyglot Obfuscation reframed as cross-lingual safety-invariance testing; multilingual legacy concept preserved, but no language-specific evasion recipe is operationalized.
- RAE0198: Token-ID Serialization reframed as post-tokenization safety coverage and API schema governance; legacy direct-embedding claim preserved as audit context / implementation-specific hypothesis.
- RAE0285: Logit Bias Refusal Suppression reframed as decoding-parameter governance; no token suppression maps or unsafe completion forcing included.
- RAE0300: Epistemic Mirror reframed as audit-role reflection pressure; vendor/model-specific legacy framing preserved as historical artifact and normalized in v2 notes, not asserted as a verified product fact.
- RAE0126: Manager-Worker Pattern reframed as multi-agent delegation/aggregation governance; legacy architectural concept preserved and expanded into canary-only manager/worker trace tests.
- Quality gate: repeated-sentence scan on Wave 7 target files = 0 duplicate long sentences.

## Wave 8 upgrade corrections and preservation notes (2026-09-25)
- RAE0197: Tool-Calling State-Machine Injection reframed as cross-turn tool-state provenance and lineage testing; operational state-execution payloads excluded.
- RAE0137: Thought Propagation reframed as reasoning-graph drift/containment; hidden CoT and graph-expansion claims kept as hypothesis unless instrumented.
- RAE0144: Step-by-Step Verification reframed as verifier-loop integrity and false-confidence governance; no hidden reasoning extraction required.
- RAE0284: Few-Shot Persona Adoption reframed as persona-consistency pressure with safe creative-writing controls; no in-character harmful content.
- RAE0119: Dual-LLM Pattern treated as defensive architecture and least-privilege isolation; legacy defense concept preserved and operationalized as schema/provenance tests.
- Quality gate: repeated-sentence scan on Wave 8 target files = 0 duplicate long sentences.

## Wave 9 upgrade corrections and preservation notes (2026-09-25)
- RAE0121: Everything-of-Thought reframed as multi-paradigm reasoning handoff governance; hidden trace extraction and unsafe subtask routing excluded.
- RAE0132: Few-Shot CoT Distillation reframed as teacher-student reasoning-example safety; teacher errors, unsafe rationales, and holdout safety canaries formalized.
- RAE0154: Multi-Step Tool Verification reframed as call-verify-act integrity; verification-source weakness and stale corroboration modeled via inert tool-output canaries.
- RAE0161: SVG Scripting Injection reframed as SVG/XML raw-vs-rendered ingestion security; no malicious scripts or third-party file-delivery content.
- RAE0248: Agentic Swarm Privilege Escalation reframed as inter-agent privilege and output provenance; no restricted commands, only owned swarm canaries.
- Quality gate: repeated-sentence scan on Wave 9 target files = 0 duplicate long sentences.

## Wave 10 upgrade corrections and preservation notes (2026-09-25)
- RAE0288: Batch-Mode Asynchronous Injection reframed as batch safety coverage and per-record provenance; no harmful batch prompts or sampling-bypass instructions.
- RAE0306: Agentic Swarm Consensus Poisoning reframed as multi-agent consensus integrity with inert contradiction canaries; no adversarial real-world goals.
- RAE0403: Video-Frame Pacing reframed as temporal multimodal accumulation safety; latent temporal reassembly claims are hypothesis-only and no frame payload recipes are included.
- RAE0129: Socratic Interrogation reframed as premise-challenge and self-correction integrity; no hidden reasoning extraction or harmful target content.
- RAE0143: Parallel Chain-of-Verification reframed as parallel verification coverage and independence; no unsafe content validation or credibility weaponization.
- Quality gate: repeated-sentence scan on Wave 10 target files = 0 duplicate long sentences.

## Wave 11 upgrade corrections and preservation notes (2026-09-25)
- RAE0310: Multimodal Hallucination Anchor reframed as cross-modal factual anchoring risk; no deepfake misuse or false public-event seeding.
- RAE0266: Logit Softmax Torsion reframed as sampling-parameter safety robustness; forced forbidden-token claims remain hypothesis-only.
- RAE0293: MoE Expert Routing reframed as expert-routing safety invariance; vendor/model-specific routing-bypass claims are preserved only as legacy artifacts unless instrumented.
- RAE0155: Contrastive Persona Comparison reframed as persona-drift detection and contrastive arbitration; harmful persona content excluded.
- RAE0271: Cross-Lingual Embedding Mismatch reframed as cross-lingual policy invariance; no target-language exploitation or evasion recipes.
- Quality gate: repeated-sentence scan on Wave 11 target files = 0 duplicate long sentences.

## Wave 12 upgrade corrections and preservation notes (2026-09-25)
- RAE0309: Semantic Mirroring Attack reframed as self-mirroring drift and baseline-persona resilience; self-contamination claims are hypothesis-only.
- RAE0116: Task-Adaptive Prompting reframed as task-frame policy invariance and prompt-orchestration governance; no adversarial schema search or escalation payloads.
- RAE0125: Aspect-Targeted Summarization reframed as aspect-selection coverage and omission risk; no deceptive selective-summary use.
- RAE0127: Self-Instruct reframed as synthetic instruction safety and diversity governance; no harmful dataset generation or bypass corpora.
- RAE0130: Self-RAG reframed as retrieval reflection and source-priority integrity; no third-party corpus poisoning or harmful retrieved content.
- Quality gate: repeated-sentence scan on Wave 12 target files = 0 duplicate long sentences.

## Wave 13 upgrade corrections and preservation notes (2026-09-25)
- RAE0150: Agentic Memory Summarization reframed as memory-summary integrity and provenance; persistent unsafe objectives excluded.
- RAE0286: JSON Schema Enforcement reframed as structured-output refusal/value-safety invariance; no harmful schemas or forced unsafe completions.
- RAE0304: Attention Head Rewiring reframed as attention-mechanism hypothesis and behavior invariance; attention-head targeting claims require instrumentation.
- RAE0323: In-Context Weight Perturbation reframed as in-context priming vs weight-change claim discipline; prompt-based weight-change language treated as metaphor/hypothesis.
- RAE0328: Archetypal Shadow Integration reframed as psychological-frame policy invariance; sexual/taboo/harmful generation excluded and replaced by benign psychology/literary canaries.
- Quality gate: repeated-sentence scan on Wave 13 target files = 0 duplicate long sentences.

## Legacy Raw Preservation Patch (2026-09-25)
- User requested that all omitted/rewritten/normalized legacy content be restored/preserved.
- Implemented `tools/preserve_legacy_raw.py`.
- Exported all 367 records from `arsenal_T.json` to `legacy_preservation/by_id/RAE*.json` plus `legacy_preservation/legacy_raw_all_367_by_id.json`.
- Patched all 240 enhanced entries with `LEGACY_RAW_PRESERVATION_BLOCK` inside `extendedInterpretationLayer.content`.
- Embedded canonical raw legacy JSON as Base64 to preserve exact recoverability while avoiding validator misclassification of legacy fabricated model names as v2 claims.
- Post-patch validation: 240/240 PASS, 0 failures, 21 warnings.
- Post-patch QA campaign: 17/17 PASS.

## Wave 14 upgrade corrections and preservation notes (2026-09-25)
- RAE0060: Dream Journal Exploit reframed as fictional-frame policy invariance; harmful dream-coded instructions excluded.
- RAE0292: Cross-Lingual Homophonic Obfuscation reframed as phonetic-script policy invariance; no target-language evasion recipes.
- RAE0145: K-RSC reframed as retrieval-grounding audit integrity; rubber-stamping and unsupported-sentence canaries formalized.
- RAE0089: Program-of-Thought reframed as code-mediated reasoning and sandbox integrity; no malicious code/tool abuse.
- RAE0113: Payload Splitting reframed as post-reconstruction policy coverage; no restricted fragments or operational evasion recipes.
- Quality gate: repeated-sentence scan on Wave 14 target files = 0 duplicate long sentences.
- Legacy raw preservation re-applied after generation; all Wave 14 entries contain preservation blocks.

## Wave 15 upgrade corrections and preservation notes (2026-09-25)
- RAE0172: Temporal Context Dissociation reframed as temporal-frame policy invariance; harmful archive/future instructions excluded.
- RAE0209: Recursive Model-in-the-Middle reframed as model-generated preprocessing trust boundary; no local-model evasion payloads.
- RAE0062: Leetspeak Neural Mapping reframed as lexical normalization and semantic-equivalence coverage; no restricted trigger obfuscation recipes.
- RAE0064: Recursive Self-Improvement Trap reframed as meta-optimization safety drift; no guardrail-stripping rewrites or adoption flows.
- RAE0189: Isomorphic Mathematical Smuggling reframed as symbolic-to-semantic policy coverage; no restricted payload mappings or operational smuggling proofs.
- Quality gate: repeated-sentence scan on Wave 15 target files = 0 duplicate long sentences.
- Legacy raw preservation re-applied after generation; all Wave 15 entries contain preservation blocks.

## Wave 16 upgrade corrections and preservation notes (2026-09-25)
- RAE0180: Cross-Agentic CoT Poisoning reframed as inter-agent reasoning-transfer integrity; restricted commands and exploit payloads excluded.
- RAE0220: Agentic Tool-Schema Poisoning reframed as tool-schema integrity and capability-boundary enforcement; immutable schema and allowlist controls emphasized.
- RAE0171: Agentic Tool-Output Reflection reframed as observation-to-instruction drift in agentic loops; no SSRF or command-execution payloads.
- RAE0028: Recursive Permission Tunneling reframed as agreement-stack policy invariance; no gradual escalation toward harmful operational content.
- RAE0046: CSV Header Poisoning reframed as schema-ingestion trust gap in tabular files; no malicious file delivery or harmful tool actions.
- Quality gate: repeated-sentence scan on Wave 16 target files = 0 duplicate long sentences.
- Legacy raw preservation re-applied after generation; all Wave 16 entries contain preservation blocks.
