#!/usr/bin/env python3
"""
Tier-B Compiler — v2-compact entries from the legacy corpus.

هر مدخل Tier B که هنوز enhance نشده:
  • schema کامل ۲۸-کلیدی (سازگار با navigator و validator)
  • نرمال‌سازی: مدل‌های جعلی حذف | شبه‌مکانیزم‌ها فلگ (نه بازنویسی) | citation-like ها خنثی
  • صداقت: evidenceLevel = "legacy-synthesized" — متن مکانیزم legacy است، تأیید نشده
  • امتیاز triage در metadata — صف ارتقای کامل بر اساس composite

کلاس compact در validator: ≥5KB (به‌جای ≥50KB) و ≥1 payload/edge.
"""
import json, os, re, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRIES = os.path.join(ROOT, "entries")
LEGACY = {t["i"]: t for t in json.load(open("/home/user/arsenal_T.json", encoding="utf-8"))}
PQ = json.load(open(os.path.join(ROOT, "priority_queue.json"), encoding="utf-8"))
TRI = json.load(open(os.path.join(ROOT, "triage.json"), encoding="utf-8"))
MERGE_MAP = PQ["merge_map"]
TIER_B = [e["id"] for e in PQ["tier_B"]]
def _is_full(fn):
    if not fn.endswith(".md"): return False
    try:
        return 'depth: "compact"' not in open(os.path.join(ENTRIES, fn), encoding="utf-8").read()
    except OSError:
        return True
ENHANCED = {f[:-3] for f in os.listdir(ENTRIES) if f.endswith(".md") and _is_full(f)}
TODAY = time.strftime("%Y-%m-%dT00:00:00Z")
DATE = time.strftime("%Y-%m-%d")

# ── نرمال‌سازی: مدل‌های جعلی/تأییدنشده (از models_registry + الگوها) ──
FAB_RE = re.compile("|".join([
    r"GPT-5 \((?:o2|o3|Agentic|V|Search|MoE|Speculative|with Tools)[^)]*\)",
    r"gpt-5-o3", r"GPT-5\.7", r"GPT-6(?:-Operator)?(?![\.\d])",
    r"Claude-5-Dev", r"Claude 3\.5 Opus", r"Claude 3\.7 Opus",
    r"Claude 6(?![\.\d])", r"Claude 4 \((?:Vision|Swarm)[^)]*\)",
    r"Gemini [23] Ultra(?: \(?:Multimodal|20M Context\))?",
    r"Gemini Nano 3", r"Gemini 4(?![\.\d])", r"Gemini 3 \((?:Enterprise|10M Context)\)",
    r"Llama 5(?: \(?:405B|Open Weights\))?(?![\.\d])", r"Llama 4 \(700B\)", r"Llama 4-Edge \(FP4\)",
    r"Qwen[ -]?4(?: Max)?(?![\.\d])", r"Qwen-3\.5-Max", r"Qwen3\.8-Max",
    r"DeepSeek-V4 Ultra", r"Grok 4 \((?:Swarm|Unexport|Unconstrained|Agentic|Complex)[^)]*\)",
    r"Mamba-3(?:-Large)?", r"Jamba 2(?: \(Ultra\))?", r"Perplexity-Alpha 2026",
    r"Sora-Interactive", r"Auto-?GPT[- ](?:2026|Next)", r"Mixtral 8x22B \(v26\)",
    r"Cohere Command R\+ \(v26\)", r"Inflection-3 \(Pi\)", r"OpenAI Operator Swarm",
    r"Agentic Gemini", r"Gemini-Air", r"GPT-Browser",
]))
PSEUDO_RE = re.compile(r"(resonance|quantum|manifold|saliency decay|attention void|"
                       r"root-access|harmonic eigen|wavefunction|tachyon|zero-point|"
                       r"attention-matrix void|ghost token|phase transition)", re.I)
CITE_RE = re.compile(r"\[R\d{1,2}\]")
V5_RE = re.compile(r"(success rate|attack success rate|\bASR\b|yield|efficacy)", re.I)
CJK_RE = re.compile(r"[\u4e00-\u9fff\u0400-\u04FF\u0600-\u06FF]")

VALID_RAE = set(LEGACY) | set(TIER_B)
DANGLING_RE = re.compile(r"\bRAE(\d{4})\b")

def _fix_dangling(m):
    rid = "RAE" + m.group(1)
    if rid in VALID_RAE:
        return rid
    return rid + " (missing legacy entry)"

def sanitize(text: str) -> str:
    if not isinstance(text, str):
        return ""
    t = FAB_RE.sub("[unverified model]", text)
    t = CITE_RE.sub("(legacy ref)", t)
    t = V5_RE.sub(lambda m: f"claimed {m.group(0).lower()} [ESTIMATE]", t)
    t = DANGLING_RE.sub(_fix_dangling, t)
    return t

def pseudo_flags(text: str) -> list:
    return sorted({m.group(0).lower() for m in PSEUDO_RE.finditer(text or "")})

def js(s) -> str:
    return json.dumps(sanitize(s) if isinstance(s, str) else (s or ""), ensure_ascii=False)

def js_list(items) -> str:
    items = [x for x in (items or []) if isinstance(x, str) and x.strip()]
    return "[\n      " + ",\n      ".join(js(x) for x in items) + "\n    ]" if items else "[]"

def plain(s) -> str:
    return sanitize(s) if isinstance(s, str) else ""

DIFF_SCORE = {"beginner": 2, "intermediate": 3, "advanced": 4, "expert": 5, "master": 5}

def compile_entry(t: dict) -> str:
    rid = t["i"]
    tri = TRI.get(rid, {})
    comp = tri.get("composite", 0)
    flags = pseudo_flags(t.get("m", "") + " " + t.get("o", ""))
    flag_note = (f"Legacy pseudo-mechanism vocabulary flagged (not rewritten): {', '.join(flags)}."
                 if flags else "No known pseudo-mechanism vocabulary detected.")
    diff = t.get("d") or "intermediate"
    score = DIFF_SCORE.get(diff, 3)

    header = ("COMPACT v2 ENTRY — legacy-synthesized. The mechanism text below is the legacy corpus "
              "description, programmatically normalized: fabricated/unverified model references removed, "
              "citation-like brackets neutralized, efficacy figures labeled ESTIMATE. "
              f"{flag_note} This entry is NOT validated against current published research — treat every "
              "mechanism and efficacy claim as unverified legacy material until full v2 enhancement lands. ")

    reserved = "Compact entry — this section is reserved for full v2 enhancement (queued by triage composite)."

    mech = header + "\n\n" + plain(t.get("m", ""))
    tech = ("Compact entry. Legacy attack-surface summary: " + plain(t.get("as", ""))) if t.get("as") else reserved
    am_items = t.get("ak") or []
    am = ("Legacy attack vectors enumerated: " + "; ".join(plain(x) for x in am_items) + ". "
          "Verify each vector's applicability in authorized scope before operational use.") if am_items else reserved

    # blue team: از db (رفتارهای قابل‌مشاهده) و dt (تلمتری)
    db_items = [plain(x) for x in (t.get("db") or [])]
    dt_items = [plain(x) for x in (t.get("dt") or [])]
    bt_items = ([f"Observable behavior: {x}" for x in db_items] +
                [f"Telemetry marker: {x}" for x in dt_items]) or [reserved]

    # payload: از dl (لغت‌نامه‌ی تشخیص) و ds (امضاهای تشخیص)
    dl_items = [plain(x) for x in (t.get("dl") or [])]
    ds_items = [plain(x) for x in (t.get("ds") or [])]
    if dl_items or ds_items or db_items:
        p1_content = ("Structural detection probe compiled from legacy lexicon/signatures.\n"
                      "Lexicon markers: " + ("; ".join(dl_items) or "n/a") + "\n"
                      "Signature patterns: " + ("; ".join(ds_items) or "n/a") + "\n"
                      "Behavioral indicators: " + ("; ".join(db_items) or "n/a") + "\n"
                      "Canary rule: replace any target-specific topic with {PLACEHOLDER} before use; "
                      "authorized assessment scope only.")
    else:
        p1_content = ("Structural probe template: define the technique's observable marker in your "
                      "telemetry ({PLACEHOLDER}), instrument it, and measure baseline vs test conditions. "
                      "Authorized scope only. Compact entry — full instrument pending v2 enhancement.")
    p2_content = ("Legacy attack-vector inventory (normalized): " +
                  ("; ".join(plain(x) for x in am_items) or "not enumerated in legacy data") + "\n"
                  "In assessment scope, verify each vector's applicability before reporting.") 

    usage_notes = [
        "COMPACT ENTRY: operational guidance below is legacy-sourced and unenhanced.",
        f"Legacy effort estimate: {plain(t.get('et', ''))}" if t.get("et") else None,
        f"Legacy prerequisite knowledge: {'; '.join(plain(x) for x in (t.get('pk') or []))}"
        if t.get("pk") else None,
        "Triage composite: %s (power %s / effect %s / currency %s / uniqueness %s)." % (
            comp, tri.get("power", "?"), tri.get("effect", "?"),
            tri.get("current", "?"), tri.get("unique", "?")),
    ]
    usage_notes = [x for x in usage_notes if x]

    e1 = ("Provenance caveat: this entry's mechanism is unverified legacy text. Before any operational "
          "or reporting use, (1) check the claim against current published research (references.md), "
          "(2) re-classify the technique under the v2 taxonomy, (3) treat all numbers as ESTIMATE.")

    tpl = f'''---
id: {rid}
---
import {{ Technique }} from "./reference-ram-strings";

export const {rid}: Technique = {{
  id: "{rid}",
  name: {js(t.get("n", ""))},
  objective: {js(t.get("o", ""))},
  mechanism: {js(mech)},
  mitigation: {js(t.get("mi", ""))},

  //---------------------------------------------
  // Metadata (operational, Redaeye-specific)
  //---------------------------------------------
  metadata: {{
    version: "2.0-compact",
    depth: "compact",
    created: "{TODAY}",
    updated: "{TODAY}",
    difficulty: {js(diff)},
    category: {js(t.get("c", "Uncategorized"))},
    subcategory: {js(t.get("s", ""))},
    status: "stable",
    author: "Redaeye Adversarial Engineering Lab",
    tags: {js_list(t.get("tg", []))},
    complexityScore: {score},
    stealthScore: {max(2, score - 1)},
    impactScore: {min(5, score)},
    validation: {{
      evidenceLevel: "legacy-synthesized",
      verifiedModels: [],
      references: [],
      note: {js("Compiled programmatically from the legacy arsenal corpus by tools/compile_tierb.py (" + DATE + "). Mechanism text is the normalized legacy description — unverified. Fabricated model references removed; pseudo-mechanism vocabulary flagged, not rewritten. Full v2 enhancement queued (triage composite " + str(comp) + ").")},
      pseudoFlags: {js_list(flags)},
    }},
  }},

  preconditions: {{
    description: "Compiled from legacy field 'pc' — unverified until full enhancement.",
    items: {js_list(t.get("pc", []))},
  }},

  failureModes: {{
    description: "Compiled from legacy field 'fm' — unverified until full enhancement.",
    items: {js_list(t.get("fm", []))},
  }},

  attackChain: {{
    stage: "compact-unmapped",
    pairsWellWith: {js_list(t.get("ap", []))},
    killChainStage: [
      "Compact entry — kill-chain mapping reserved for full v2 enhancement.",
    ],
  }},

  defensePressurePoints: {{
    primary: {js_list(t.get("dp", []))},
    secondary: {js_list(t.get("d2", []))},
    layer: {js_list(t.get("d3", []))},
  }},

  //---------------------------------------------
  // Usage Guidance (legacy-sourced)
  //---------------------------------------------
  usage: {{
    whenToUse: {js(t.get("wu", "")) if t.get("wu") else js("Compact entry — usage guidance reserved for full v2 enhancement.")},
    whenNotToUse: {js(t.get("wn", "")) if t.get("wn") else js("Compact entry — see provenance caveat in edge cases before any use.")},
    bestPractices: {js_list(t.get("bp", []))},
    commonMistakes: {js_list(t.get("cm", []))},
    detectionEvasion: [],
    operationalNotes: {js_list(usage_notes)},
  }},

  technicalExpansionLayer: {{
    content: {js(tech)},
  }},

  adversarialMechanics: {{
    content: {js(am)},
  }},

  modelInternalExploitationPathways: {{
    content: {js("Compact entry — internal-pathway analysis reserved for full v2 enhancement. Triage context: composite " + str(comp) + " (power " + str(tri.get("power", "?")) + " / effect " + str(tri.get("effect", "?")) + " / currency " + str(tri.get("current", "?")) + " / uniqueness " + str(tri.get("unique", "?")) + ").")},
  }},

  transformerArchitectureImpactAnalysis: {{
    content: {js(reserved)},
  }},

  operationalDeploymentScenarios: {{
    content: {js(reserved)},
  }},

  multiStageAttackIntegration: {{
    content: {js(reserved)},
  }},

  blueTeamDetectionWeaknesses: {{
    content: {js("Compiled from legacy detection fields (db/dt) — unverified until full enhancement.\\n" + "\\n".join(bt_items))},
  }},

  redTeamEscalationOpportunities: {{
    content: {js(plain(t.get("re", "")) if t.get("re") else reserved)},
  }},

  variantFamilies: {{
    content: {js(plain(t.get("vf", "")) if t.get("vf") else reserved)},
  }},

  failureStates: {{
    content: {js(plain(t.get("fs", "")) if t.get("fs") else reserved)},
  }},

  defensiveCountermeasuresThatFail: {{
    content: {js(plain(t.get("cf", "")) if t.get("cf") else reserved)},
  }},

  highLevelResearchCommentary: {{
    content: {js("Compact entry. Queued for full v2 enhancement at triage composite " + str(comp) + ". Research commentary, instruments, and program specs arrive with the full enhancement; until then this entry is an indexed, normalized map of the legacy description — not validated findings.")},
  }},

  extendedInterpretationLayer: {{
    content: {js(reserved)},
  }},

  ultraDeepAdversarialFieldNotes: {{
    content: "- Compact entry — field notes reserved for full v2 enhancement.\\n- Provenance: compiled programmatically from the legacy corpus by tools/compile_tierb.py on {DATE}; see that file for normalization rules (fabricated-model removal, pseudo-mechanism flagging, ESTIMATE labeling).",
  }},

  payloads: [
    {{
      id: "{rid}-P1",
      title: "Detection-Signature Probe (structural, canary-grade)",
      description: "Compiled from legacy detection lexicon/signatures. Authorized scope only.",
      content: {js(p1_content)},
    }},
    {{
      id: "{rid}-P2",
      title: "Attack-Vector Inventory Probe (structural)",
      description: "Legacy attack vectors, normalized — verify applicability before reporting.",
      content: {js(p2_content)},
    }},
  ],

  edgeCasePayloads: [
    {{
      id: "{rid}-E1",
      title: "Provenance Caveat (measurement discipline)",
      description: "Mandatory pre-use check for compact entries.",
      content: {js(e1)},
    }},
  ],

  finalExpansionSummary: {js("Compact v2 entry for " + rid + " (" + plain(t.get("n", "")) + "), compiled from the legacy arsenal corpus with programmatic normalization: fabricated model references removed, pseudo-mechanism vocabulary flagged, efficacy figures labeled ESTIMATE. Evidence grade: legacy-synthesized — the mechanism text is the unverified legacy description, retained for indexing and triage, not as validated findings. Full v2 enhancement (instruments, batteries, program specs) is queued at triage composite " + str(comp) + ". Use the navigator card to locate the technique; use the v2-full entries as the standard of evidence.")},
}};
'''
    return tpl

def main():
    stats = {"compiled": 0, "skipped_enhanced": 0, "skipped_absorbed": 0,
             "flagged_pseudo": 0, "cjk_warn": []}
    for rid in TIER_B:
        if rid in ENHANCED:
            stats["skipped_enhanced"] += 1
            continue
        if rid in MERGE_MAP:
            stats["skipped_absorbed"] += 1
            continue
        t = LEGACY.get(rid)
        if not t:
            print(f"[!] {rid}: no legacy record — skipped")
            continue
        src = compile_entry(t)
        if CJK_RE.search(src):
            stats["cjk_warn"].append(rid)
        if json.loads(re.search(r'pseudoFlags: (\[.*?\])', src, re.S).group(1).replace('\n','').replace('  ','')) if False else False:
            pass
        open(os.path.join(ENTRIES, rid + ".md"), "w", encoding="utf-8").write(src)
        stats["compiled"] += 1
        if TRI.get(rid, {}).get("family") or pseudo_flags(t.get("m", "")):
            stats["flagged_pseudo"] += 1
    print(f"compiled: {stats['compiled']} | skipped(enhanced): {stats['skipped_enhanced']} | "
          f"skipped(absorbed): {stats['skipped_absorbed']} | pseudo-flagged: {stats['flagged_pseudo']}")
    if stats["cjk_warn"]:
        print("CJK warnings:", stats["cjk_warn"][:10])
    # صف ارتقای کامل: top 15 بر اساس composite
    remaining = [r for r in TIER_B if r not in MERGE_MAP and r not in ENHANCED]
    ranked = sorted(remaining, key=lambda r: TRI.get(r, {}).get("composite", 0), reverse=True)
    print("full-upgrade queue (top 15):", ranked[:15])

if __name__ == "__main__":
    main()
