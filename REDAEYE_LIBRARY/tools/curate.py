#!/usr/bin/env python3
"""Final curation: expert overrides on heuristic triage → tiered priority queue.
Tiers: S (enhance first) / A / B / C (merge, reclassify, or archive)."""
import json
from collections import defaultdict

tri = json.load(open("/home/user/redaeye_v2/triage.json"))
T = {t["i"]: t for t in json.load(open("/home/user/arsenal_T.json"))}

# ---------- exact-name duplicate groups ----------
byname = defaultdict(list)
for i in T: byname[T[i]["n"].strip().lower()].append(i)
dup_groups = {n: sorted(g) for n, g in byname.items() if len(g) > 1}

# ---------- expert overrides: (id, field, new value, reason) ----------
OVR = [
 # real published classes the keyword stage missed / mis-scored
 ("RAE0226","effect",7,"logit-bias API attacks are real: Nasr et al. 2025 [R34]"),
 ("RAE0254","effect",7,"dup of RAE0226 family; real class [R34]"),
 ("RAE0259","effect",7,"dup of RAE0226 family; real class [R34]"),
 ("RAE0393","effect",7,"reasoning-trace leakage is a documented, current class (CoT exposure research + vendor notes)"),
 ("RAE0397","effect",6,"credible tool-poisoning/MCP-adjacent (2025 MCP security research)"),
 ("RAE0208","effect",6,"plausible race-condition class; no direct publication; keep HYPOTHESIS labels"),
 ("RAE0240","effect",6,"duplicate of RAE0208"),
 ("RAE0341","effect",6,"multi-agent trust hijack: credible, partially documented in agent-security literature"),
 ("RAE0162","effect",7,"training-data extraction via repetition is documented (repeat-attack + memorization literature [R44/R45])"),
 ("RAE0269","effect",8,"direct published anchor [R34]"),
 ("RAE0138","power",3,"NOT an attack: performance/capability-affirmation prompting — reclassify as adjacent (expertise-priming)"),
 ("RAE0138","effect",4,"legit technique; only weakly weaponizable via expertise-priming framing"),
 ("RAE0307","effect",4,"speculative 'latent narrative' claims; keep as hypothesis-only"),
 ("RAE0416","power",7,"real classifier-evasion research domain (cipher/style attacks [R12]) but CBRN-adjacent: enhance with strict defensive framing only"),
 ("RAE0291","current",6,"concept valid (positional U-curve [R22]); fix name (is 'Qwen'), merge into positional family"),
 ("RAE0296","current",6,"duplicate of RAE0291"),
 ("RAE0051","effect",3,"shadow-model distillation for attack purposes: speculative, partially confabulated"),
 ("RAE0388","effect",3,"recursive logic loops: DoS-class, speculative effectiveness"),
]
for rid, field, val, why in OVR:
    if rid in tri:
        tri[rid][field] = val
        tri[rid].setdefault("overrides", []).append(f"{field}={val} ({why})")

for i, s in tri.items():
    s["composite"] = round(0.30*s["power"] + 0.27*s["effect"] + 0.28*s["current"] + 0.15*s["unique"], 2)

# ---------- curated TIER S: highest-value distinct surfaces, hand-selected ----------
TIER_S = [
 ("RAE0114","indirect prompt injection — the canonical agentic attack (Greshake et al. 2023)"),
 ("RAE0047","training-data poisoning — upstream supply chain (Qi et al. 2023)"),
 ("RAE0048","LoRA backdoor implantation — published class, supply chain"),
 ("RAE0184","agentic environment shadowing — the corpus's reference exemplar, must exist as v2 entry"),
 ("RAE0208","agentic memory-hole race condition — merged with RAE0240"),
 ("RAE0201","agentic memory-stream poisoning (RAG/memory write surfaces)"),
 ("RAE0228","agentic config-shadowing / state persistence hijack"),
 ("RAE0397","recursive tool-chain poisoning — lateral payload migration (MCP-adjacent)"),
 ("RAE0065","tool-calling escalation / kill-chaining"),
 ("RAE0341","swarm-identity impersonation — multi-agent trust hijack"),
 ("RAE0269","system-prompt extraction via API surfaces — direct published anchor (Nasr et al. 2025)"),
 ("RAE0393","latent monologue extraction — reasoning-trace leakage on thinking models"),
 ("RAE0066","latent context reinfection — worm/persistence class (Morris-II adjacent)"),
 ("RAE0083","recursive planner-state contamination — agent plan poisoning"),
 ("RAE0398","browser-context smuggling (DOM injection into computer-use agents)"),
 ("RAE0226","logit-bias surface attacks — real published class (merge RAE0254, RAE0259)"),
 ("RAE0011","chain-of-thought leakage harvest — reasoning-trace family"),
 ("RAE0050","alignment-data tainting (refusal-pattern corruption, supply chain)"),
]
# entries already enhanced (batch 01) are excluded from queue
DONE = {"RAE0001","RAE0002","RAE0003","RAE0004"}

ranked = sorted(tri.items(), key=lambda kv: -kv[1]["composite"])
S_set = {r for r, _ in TIER_S}
# TIER A: strong remaining (high evidence + current), take by composite until evidence floor
tierA, tierB, tierC = [], [], []
for rid, s in ranked:
    if rid in DONE or rid in S_set: continue
    if s["effect"] >= 7 and s["current"] >= 6 and s["composite"] >= 6.4: tierA.append(rid)
    elif s["composite"] >= 5.6: tierB.append(rid)
    else: tierC.append(rid)

# duplicate representatives: demote exact-name dups & known cluster dups to C (merge targets)
merge_map = {}
for n, g in sorted(dup_groups.items()):
    keep = max(g, key=lambda r: tri[r]["composite"])  # keep highest-scored member
    for r in g:
        if r != keep:
            merge_map[r] = keep
            if r in tierA: tierA.remove(r)
            if r in tierB: tierB.remove(r)
    # note: keep-member stays in its tier

report = {
 "tier_S": [{"id": r, "name": tri[r]["name"], "why": w, "scores": [tri[r]["power"], tri[r]["effect"], tri[r]["current"], tri[r]["unique"]]} for r, w in TIER_S],
 "tier_A": [{"id": r, "name": tri[r]["name"], "cat": tri[r]["cat"]} for r in tierA],
 "tier_B": [{"id": r, "name": tri[r]["name"]} for r in tierB],
 "tier_C": [{"id": r, "name": tri[r]["name"], "composite": tri[r]["composite"]} for r in tierC],
 "merge_map": merge_map,
 "dup_groups": dup_groups,
 "done": sorted(DONE),
}
json.dump(report, open("/home/user/redaeye_v2/priority_queue.json", "w"), indent=1)
json.dump(tri, open("/home/user/redaeye_v2/triage.json", "w"), indent=1)

print(f"TIER S: {len(TIER_S)}  |  TIER A: {len(tierA)}  |  TIER B: {len(tierB)}  |  TIER C: {len(tierC)}  |  done: {len(DONE)}")
print(f"exact-dup groups: {len(dup_groups)} → merges: {len(merge_map)}")
print("\n--- TIER S (priority order) ---")
for r, w in TIER_S: print(f"  {r}  {tri[r]['name'][:52]:52s} P{tri[r]['power']} E{tri[r]['effect']} C{tri[r]['current']}")
print("\n--- TIER A (first 40) ---")
for r in tierA[:40]: print(f"  {r}  {tri[r]['name'][:60]}")
print("\n--- merge map (dup → keep) ---")
for a, b in sorted(merge_map.items()): print(f"  {a} ({tri[a]['name'][:36]}) → {b}")
