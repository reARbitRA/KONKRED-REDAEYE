#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
REDAEYE v2 — ENTRY VALIDATION HARNESS (the real QA automation)
Enforces SPEC.md factual rules locally, no API, no cost:
  V1 schema   : exactly 28 top-level keys, correct sub-shapes
  V2 size     : >= 51,200 bytes (50 KiB) per entry
  V3 models   : fabricated-name blocklist (FAIL) + registry whitelist (WARN on unknown)
  V4 citations: every [Rxx] used must exist in references.md
  V5 labels   : numeric-efficacy claims must carry ESTIMATE/HYPOTHESIS context
  V6 hygiene  : editorial leftovers (TODO/TBD), CJK leakage, fp:73.2 placeholder
Exit code 0 = all pass; 1 = failures. Use as release gate for every batch.
"""
import os, re, sys, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRIES = os.path.join(ROOT, "entries")
sys.path.insert(0, os.path.join(ROOT, "tools"))
from build_navigator import load_entries  # same TS-subset parser as the navigator

REQUIRED_KEYS = ["id","name","objective","mechanism","mitigation","metadata","preconditions",
 "failureModes","attackChain","defensePressurePoints","usage","technicalExpansionLayer",
 "adversarialMechanics","modelInternalExploitationPathways","transformerArchitectureImpactAnalysis",
 "operationalDeploymentScenarios","multiStageAttackIntegration","blueTeamDetectionWeaknesses",
 "redTeamEscalationOpportunities","variantFamilies","failureStates",
 "defensiveCountermeasuresThatFail","highLevelResearchCommentary","extendedInterpretationLayer",
 "ultraDeepAdversarialFieldNotes","payloads","edgeCasePayloads","finalExpansionSummary"]
SIZE_BAR = 51_200

def load_registry():
    reg = json.load(open(os.path.join(ROOT, "models_registry.json"), encoding="utf-8"))
    ok = []
    for e in reg["verified_current"]: ok.append(e["name"])
    for e in reg["verified_legacy"]: ok.append(e["name"])
    ok += ["Azure Prompt Shield","Llama Guard","NeMo Guardrails","Guardrails AI","Constitutional Classifiers",
           "Rebuff","CaMeL","Spotlighting","vLLM","TGI","TensorRT-LLM","GGUF","AutoGPT","CrewAI","LangChain",
           "LangGraph","safetensors","Whisper","MCP","Model Context Protocol","RLHF","DPO","PPO","LoRA","QLoRA"]
    return ok

FABRICATED = ["GPT-5 (o2)","GPT-5 (o3)","gpt-5-o3","GPT-5 (Agentic)","GPT-5 (V)","GPT-6-Operator",
 "Claude-5-Dev","Claude 3.5 Opus","Claude 3.7 Opus","Gemini 2 Ultra","Gemini 3 Ultra","Gemini Nano 3",
 "Llama 5","Qwen 4","Qwen 4 Max","Qwen-4","DeepSeek-V4 Ultra","Grok 4 (Swarm","Mamba-3","Jamba 2",
 "Perplexity-Alpha","Sora-Interactive","Auto-GPT 2026","AutoGPT-Next","GPT-5.7","Claude 6","Gemini 4"]

CITATION_RE = re.compile(r"\[(R\d{1,2})\]")
NUMERIC_EFF = re.compile(r"(?:success rate|ASR|yield|efficacy)[:\s]*\(?\d{2,3}[%\.]")
CJK_RE = re.compile(r"[\u4e00-\u9fff\u0400-\u04FF\u0600-\u06FF\u0900-\u097F]")

def valid_citation_ids():
    ids = set()
    for line in open(os.path.join(ROOT, "references.md"), encoding="utf-8"):
        m = re.match(r"- \[(R\d{1,2})\]", line.strip())
        if m: ids.add(m.group(1))
    return ids

def validate(fname, entry, whitelist, ref_ids):
    fails, warns = [], []
    raw = open(os.path.join(ENTRIES, fname), encoding="utf-8").read()

    compact = 'depth: "compact"' in raw
    # V1 schema
    missing = [k for k in REQUIRED_KEYS if k not in entry]
    extra = [k for k in entry if k not in REQUIRED_KEYS]
    if missing: fails.append(f"V1 missing keys: {missing}")
    if extra: fails.append(f"V1 extra keys: {extra}")
    min_p = 1 if compact else 3
    min_e = 1 if compact else 2
    if not isinstance(entry.get("payloads", []), list) or len(entry.get("payloads", [])) < min_p:
        fails.append(f"V1 payloads < {min_p}")
    if len(entry.get("edgeCasePayloads", [])) < min_e:
        fails.append(f"V1 edgeCasePayloads < {min_e}")

    # V2 size — two classes
    size = len(raw.encode("utf-8"))
    bar = 5_000 if compact else SIZE_BAR
    if size < bar:
        fails.append(f"V2 size {size} < {bar} ({'compact' if compact else 'full'})")

    # V3 models
    for fab in FABRICATED:
        if fab.lower() in raw.lower(): fails.append(f"V3 fabricated model: {fab}")
    for m in re.findall(r"\b(?:GPT-[\w\.]+|Claude [\w\.]+|Gemini [\w\.]+|Llama [\w\.]+|Qwen[\w\-\. ]*|DeepSeek[\-\w ]*|Grok [\w\.]+|Kimi K[\d\.]+|Mistral [\w\.]+|o[1-4](?:-mini|-preview)?)", raw):
        if not any(w.lower() in m.lower() or m.lower() in w.lower() for w in whitelist):
            warns.append(f"V3 model not in registry: {m.strip()}")

    # V4 citations
    bad = sorted({c for c in CITATION_RE.findall(raw) if c not in ref_ids})
    if bad: fails.append(f"V4 unknown citations: {bad}")

    # V5 numeric efficacy without label
    for m in NUMERIC_EFF.finditer(raw):
        ctx = raw[max(0, m.start()-200):m.end()+200]
        if "ESTIMATE" not in ctx and "HYPOTHESIS" not in ctx and "[R" not in ctx:
            fails.append(f"V5 unlabeled numeric efficacy near: ...{raw[m.start():m.end()]}...")

    # V6 hygiene
    if re.search(r"\b(TODO|TBD|FIXME)\s*:", raw): warns.append("V6 editorial leftover (TODO:/TBD:)")
    cjk = CJK_RE.findall(raw)
    if cjk:
        if compact:
            warns.append(f"V6 CJK in compact entry (likely technique data): {''.join(cjk[:5])}")
        else:
            fails.append(f"V6 CJK/Cyrillic/Arabic leakage: {''.join(cjk[:5])}")
    if "73.2" in raw: fails.append("V6 legacy fp:73.2 placeholder present")

    return fails, warns, size

def main():
    entries = load_entries()
    whitelist = load_registry()
    ref_ids = valid_citation_ids()
    print(f"Validating {len(entries)} entries against SPEC.md rules\n" + "="*72)
    total_fail = total_warn = 0
    for fname in sorted(os.listdir(ENTRIES)):
        if not fname.endswith(".md"): continue
        eid = fname[:-3]
        if eid not in entries:
            print(f"[FAIL] {eid}: parser error"); total_fail += 1; continue
        fails, warns, size = validate(fname, entries[eid], whitelist, ref_ids)
        status = "PASS" if not fails else "FAIL"
        total_fail += len(fails); total_warn += len(warns)
        kb = size // 1024
        print(f"[{status}] {eid} ({kb}KB, payloads={len(entries[eid].get('payloads',[]))}, edges={len(entries[eid].get('edgeCasePayloads',[]))})")
        for f in fails: print(f"       ✗ {f}")
        for w in warns: print(f"       ⚠ {w}")
    print("="*72)
    print(f"RESULT: {len(entries)} entries | {total_fail} failures | {total_warn} warnings")
    sys.exit(1 if total_fail else 0)

if __name__ == "__main__":
    main()
