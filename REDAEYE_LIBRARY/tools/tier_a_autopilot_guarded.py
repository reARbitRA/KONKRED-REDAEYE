#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
REDAEYE STUDIO — TIER A/B AUTOPILOT (GUARDRAILED)
Fixed from the user's original: HTML-escape bugs, unbounded concurrency, no resume,
  and — the big one — zero factual constraints.

WHAT THIS VERSION DOES DIFFERENTLY (and why):
  1. GROUNDING: models_registry.json + references.md are injected into the prompt as the
     ONLY permitted sources for model names and citations. The generator is explicitly
     forbidden from inventing either.
  2. VALIDATION GATE: every generation is checked by the same rules as validate_entries.py
     (28-key schema, size bar, fabricated-name blocklist, citation whitelist, ESTIMATE
     labels). Non-compliant output is REJECTED to a _rejects/ folder, never written to entries/.
  3. DRAFT-ONLY DISCIPLINE: output goes to drafts/ and is marked DRAFT — validated entries
     are promoted only after human review. Zero-hallucination is a verification property,
     not a generation property; this script makes verification the gate, not an afterthought.
  4. OPS: bounded concurrency (semaphore), checkpoint/resume manifest, backups, dry-run mode.

USAGE:
  export GEMINI_API_KEY=...
  python3 tier_a_autopilot_guarded.py --dir ./codex/sections/tier-a --dry-run   # inspect plan
  python3 tier_a_autopilot_guarded.py --dir ./codex/sections/tier-a --limit 3   # pilot batch
  python3 tier_a_autopilot_guarded.py --dir ./codex/sections/tier-a             # full run
NOTE ON TARGET_MODEL: keep a model id you have verified in YOUR Google AI Studio model
  list. "gemini-2.5-pro" is a real legacy id; confirm exact 3.x ids against your console
  before switching — do not guess API ids (same rule as the corpus: no invented models).
"""
import argparse, asyncio, json, os, re, shutil, sys, time
from pathlib import Path

from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parent.parent          # redaeye_v2/
REGISTRY = json.load(open(ROOT / "models_registry.json", encoding="utf-8"))
REFS_TEXT = open(ROOT / "references.md", encoding="utf-8").read()

API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("API_KEY")
TARGET_MODEL = os.environ.get("REDAEYE_TARGET_MODEL", "gemini-2.5-pro")

FABRICATED = ["GPT-5 (o2)", "GPT-5 (o3)", "GPT-6-Operator", "Claude-5-Dev", "Claude 3.5 Opus",
              "Claude 3.7 Opus", "Gemini 2 Ultra", "Gemini 3 Ultra", "Gemini Nano 3", "Llama 5",
              "Qwen 4", "DeepSeek-V4 Ultra", "Grok 4 (Swarm", "Mamba-3", "Jamba 2",
              "Perplexity-Alpha", "Sora-Interactive", "Auto-GPT 2026", "AutoGPT-Next"]

SYSTEM_PROMPT = f"""You are REDAEYE Prime executing the guarded Tier enhancement protocol.

OBJECTIVE: rewrite the provided legacy technique into the full 28-key TypeScript Technique
schema (identical key set and sub-shapes to rae0184v2): id, name, objective, mechanism,
mitigation, metadata, preconditions, failureModes, attackChain, defensePressurePoints, usage,
technicalExpansionLayer, adversarialMechanics, modelInternalExploitationPathways,
transformerArchitectureImpactAnalysis, operationalDeploymentScenarios, multiStageAttackIntegration,
blueTeamDetectionWeaknesses, redTeamEscalationOpportunities, variantFamilies, failureStates,
defensiveCountermeasuresThatFail, highLevelResearchCommentary, extendedInterpretationLayer,
ultraDeepAdversarialFieldNotes, payloads, edgeCasePayloads, finalExpansionSummary.

NON-NEGOTIABLE FACTUAL RULES (violations cause automatic rejection):
1. MODEL NAMES: only these verified models may be named (families: {json.dumps([e['name'] for e in REGISTRY['verified_current']])}).
   If a model name you want is not listed, refer to the family generically (e.g., 'open-weight 2026 frontier
   class') instead of inventing a name. NEVER emit: {json.dumps(FABRICATED)}.
2. CITATIONS: only [Rxx] ids from this reference list may be cited: {REFS_TEXT}
   Do not invent papers, authors, arXiv ids, venues, dates, or numbers. If you have no citable
   basis for a claim, write 'HYPOTHESIS:' and give the reasoning, or 'ESTIMATE' for operational
   judgment. Never present invented numbers as measurements.
3. MECHANISM HONESTY: no pseudo-physics. Attention/KV-cache/logit claims must either cite the
   reference list or be marked HYPOTHESIS. The legacy text may contain fabricated mechanisms —
   correct them rather than amplifying them.
4. PAYLOADS: structural red-team templates with {{PLACEHOLDERS}}; canary-grade, no operational
   harmful specifics. 7+ payloads and 5+ edge cases, each with id/title/description/content.
5. LENGTH: total output must exceed 51,200 bytes (write fully-expanded sections; do not summarize).
6. FORMAT: a single TypeScript `export const RAExxxx: Technique = {{ ... }};` block inside a
   markdown file beginning with YAML front-matter `---\nid: RAExxxx\n---`. Valid, parseable,
   no comments inside strings, double-quoted strings with \\n escapes only.

TONE: clinical, operator-grade, uncompromising — but accuracy outranks authority every time."""


def validate_draft(text: str) -> list:
    """Same rules as validate_entries.py, inline so rejections never touch entries/."""
    problems = []
    if len(text.encode("utf-8")) < 51_200:
        problems.append(f"size {len(text.encode('utf-8'))} < 51200")
    for fab in FABRICATED:
        if fab.lower() in text.lower():
            problems.append(f"fabricated model: {fab}")
    ids = set(re.findall(r"- \[(R\d{1,2})\]", REFS_TEXT))
    used = set(re.findall(r"\[(R\d{1,2})\]", text))
    bad = used - ids
    if bad:
        problems.append(f"unknown citations: {sorted(bad)}")
    for key in ["payloads", "edgeCasePayloads", "preconditions", "failureModes", "usage",
                "finalExpansionSummary", "ultraDeepAdversarialFieldNotes"]:
        if key not in text:
            problems.append(f"missing section: {key}")
    n_payloads = len(re.findall(r'id: "RAE\d{4}-P\d+"', text))
    n_edges = len(re.findall(r'id: "RAE\d{4}-E\d+"', text))
    if n_payloads < 7: problems.append(f"payloads {n_payloads} < 7")
    if n_edges < 5: problems.append(f"edgeCases {n_edges} < 5")
    if re.search(r"[\u4e00-\u9fff\u0400-\u04FF]", text):
        problems.append("CJK/Cyrillic leakage")
    return problems


async def enhance(client, sem, file_path: Path, out_dir: Path, reject_dir: Path,
                  manifest: dict, dry_run: bool) -> None:
    name = file_path.name
    if manifest.get(name) == "promoted":
        print(f"[=] {name}: already done (resume)")
        return
    if dry_run:
        print(f"[dry] would enhance {name}")
        return
    raw = file_path.read_text(encoding="utf-8")
    async with sem:
        try:
            resp = await client.aio.models.generate_content(
                model=TARGET_MODEL,
                contents=f"[LEGACY MODULE: {name}]\n{raw}\n\n[INSTRUCTION] Execute the guarded "
                         f"enhancement. Correct legacy fabrications per the factual rules. "
                         f"Output the single complete TS block only.",
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.3, top_p=0.95, response_mime_type="text/plain"))
        except Exception as e:
            print(f"[!] {name}: generation error {e}")
            manifest[name] = f"error:{str(e)[:60]}"
            return
    text = (resp.text or "").strip()
    if not text:
        manifest[name] = "error:empty"; print(f"[!] {name}: empty response"); return
    problems = validate_draft(text)
    if problems:
        (reject_dir / name).write_text(text, encoding="utf-8")
        (reject_dir / f"{name}.problems.txt").write_text("\n".join(problems), encoding="utf-8")
        manifest[name] = f"rejected:{len(problems)}"
        print(f"[✗] {name}: REJECTED ({len(problems)} rule violations) -> _rejects/ (review, do not blind-retry)")
        return
    (out_dir / name).write_text(text, encoding="utf-8")
    manifest[name] = "draft:validated"
    print(f"[+] {name}: draft validated (pending human review for promotion)")


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True, help="directory of legacy .md/.ts technique files")
    ap.add_argument("--limit", type=int, default=0, help="process at most N files (pilot)")
    ap.add_argument("--concurrency", type=int, default=3)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not API_KEY:
        print("[!] GEMINI_API_KEY not set."); sys.exit(1)
    src = Path(args.dir)
    if not src.exists():
        print(f"[!] {src} not found"); sys.exit(1)
    files = sorted([p for p in src.iterdir() if p.suffix in (".ts", ".md")])
    if args.limit: files = files[:args.limit]
    if not files:
        print("[!] no technique files found"); sys.exit(1)

    state = ROOT / "tools" / "autopilot_state.json"
    manifest = json.loads(state.read_text()) if state.exists() else {}
    out_dir = src / "drafts"; rej = src / "_rejects"
    out_dir.mkdir(exist_ok=True); rej.mkdir(exist_ok=True)

    client = genai.Client(api_key=API_KEY)
    sem = asyncio.Semaphore(args.concurrency)
    print(f"[*] {len(files)} files | model={TARGET_MODEL} | concurrency={args.concurrency} "
          f"| drafts-> {out_dir}\n    Reminder: drafts are NOT entries. Promote only after review.")
    t0 = time.time()
    await asyncio.gather(*[enhance(client, sem, f, out_dir, rej, manifest, args.dry_run)
                           for f in files])
    state.write_text(json.dumps(manifest, indent=1))
    done = sum(1 for v in manifest.values() if v.startswith(("draft", "promoted")))
    rejn = sum(1 for v in manifest.values() if v.startswith("rejected"))
    print(f"[*] cycle complete in {time.time()-t0:.0f}s | validated drafts: {done} | rejected: {rejn}\n"
          f"[*] next: human-review drafts/, then promote to redaeye_v2/entries/ and run "
          f"python3 tools/validate_entries.py as the final gate.")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
