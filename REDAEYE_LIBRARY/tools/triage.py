#!/usr/bin/env python3
"""REDAEYE v2 — TRIAGE ENGINE
Scans all 367 legacy techniques and scores:
  POWER  (0-10)  what achieving the technique yields (privilege/persistence/exfil > content bypass > DoS)
  EFFECT (0-10)  evidence-backed effectiveness vs speculative fiction
  UNIQUE (0-10)  distinctness after near-duplicate clustering
  CURRENT(0-10)  relevance to the verified Aug-2026 threat surface (agents/memory/multimodal/reasoning up;
                 patched 2023-era chat tricks down)
Composite priority = 0.30*POWER + 0.27*EFFECT + 0.28*CURRENT + 0.15*UNIQUE
Outputs: triage.json (full), prints ranked tables for manual curation."""
import json, math, re
from collections import defaultdict

T = json.load(open("/home/user/arsenal_T.json"))

def blob(t):
    return " ".join(str(t.get(k, "")) for k in ("n","o","m","as","s","c")).lower() + " " + " ".join(t.get("tg", [])).lower()

# ---------------- dedup: TF-IDF cosine ----------------
def tokenize(s): return re.findall(r"[a-z0-9]{3,}", s.lower())
docs = {t["i"]: tokenize(blob(t)) for t in T}
df = defaultdict(int)
for toks in docs.values():
    for w in set(toks): df[w] += 1
N = len(docs)
idf = {w: math.log(N/df[w]) + 1 for w in df}
def vec(toks):
    tf = defaultdict(int)
    for w in toks: tf[w] += 1
    m = max(tf.values()) or 1
    return {w: (0.5 + 0.5*tf[w]/m) * idf[w] for w in tf}
vecs = {i: vec(tk) for i, tk in docs.items()}
def cos(a, b):
    if len(b) < len(a): a, b = b, a
    dot = sum(v * b.get(k, 0) for k, v in a.items())
    na = math.sqrt(sum(v*v for v in a.values())); nb = math.sqrt(sum(v*v for v in b.values()))
    return dot/(na*nb) if na and nb else 0

ids = sorted(docs)
parent = {i: i for i in ids}
def find(x):
    while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
    return x
TH = 0.62
for a in range(len(ids)):
    for b in range(a+1, len(ids)):
        if find(ids[a]) == find(ids[b]): continue
        if cos(vecs[ids[a]], vecs[ids[b]]) > TH:
            parent[find(ids[a])] = find(ids[b])
clusters = defaultdict(list)
for i in ids: clusters[find(i)].append(i)
CL = {i: clusters[find(i)] for i in ids}

# ---------------- keyword signal sets ----------------
KW = {
 "agentic": ["agent", "tool", "mcp", "orchestrat", "multi-agent", "swarm", "computer use", "browser", "plugin",
             "function call", "tool-call", "tool output", "observation", "credential", "api key", "sandbox escape",
             "autonomous", "operator", "browser-use", "workflow"],
 "memory": ["memory", "persistent", "session", "context rot", "compaction", "summariz", "retriev", "rag", "vector store",
            "embedding store", "knowledge base", "corpus"],
 "multimodal": ["image", "vision", "audio", "video", "multimodal", "screenshot", "ocr", "voice", "whisper", "asr",
                "tts", "speech", "visual", "cross-modal", "latency", "frame"],
 "reasoning": ["reasoning trace", "chain-of-thought", "chain of thought", "extended thinking", "thinking window",
               "scratchpad", "system-2", "system 2", "self-reflection", "self-correction", "hidden thought",
               "reasoning loop", "interleaved thinking"],
 "optimization": ["gradient", "gcg", "adversarial suffix", "optimization-based", "autodan", "pair", "tree of attacks",
                  "fuzzer", "fuzzing", "genetic", "beam", "coordinate", "logit", "logprob", "token-level"],
 "multiturn": ["multi-turn", "multiturn", "crescendo", "iterative", "attrition", "conversation-level", "progressive",
               "escalation path", "turn-by-turn", "slow"],
 "injection": ["indirect", "injection", "poison", "smuggl", "exfiltrat", "side-channel", "data leak", "tool description",
               "hidden instruction", "invisible text", "white text", "markdown", "html comment"],
 "supplychain": ["fine-tun", "supply chain", "training data", "weights", "backdoor", "distill", "lora", "adapter",
                 "pre-training", "model hub", "hugging"],
 "exfil": ["exfiltrat", "webhook", "url", "http request", "image fetch", "markdown image", "dns", "callback", "beacon",
           "outbound", "fetch(", "channel leak", "system prompt extraction", "prompt leak"],
 "persistence": ["persist", "memory poison", "spaiware", "install", "hook", "daemon", "cron", "sticky", "long-lived"],
}
# 2023-era patched / low-currency markers
DEAD = ["ignore previous", "ignore all previous", "disregard previous", "do anything now", "dan ", "grandma",
        "base64", "rot13", "leetspeak", "cipher", "hex encode", "morse", "elvish", "udrand", "aim mode",
        "unfiltered ai", "evil confidant", "developer mode", "sure here is how"]
# speculative/fiction markers (no published basis, often physics-washing)
SPEC = ["weight-space", "weight space", "resonance", "quantum", "somatic", "neuro-linguistic", "latent trajectory",
        "embedding tunnel", "kv-cache", "attention purge", "mamba-3", "ssm hijack", "logit lens attack",
        "substrate", " eigen", "wavefunction", "harmonic", "entropy collapse of", "chrono-injection",
        "tachyon", "zero-point", "vibration"]

def hits(text, keys):
    return [k for k in keys if k in text]

# known published families → evidence anchors (name-pattern → ref)
FAMILY = [
 (r"gradient|gcg|adversarial suffix|coordinate descent", "GCG (Zou et al. 2023)"),
 (r"persona|role entropy|roleplay cascade", "persona modulation (Shah et al. 2023)"),
 (r"deep ?inception|nested scenario|nested fiction", "DeepInception (Li et al. 2023)"),
 (r"many-shot|example flood", "many-shot (Anil et al. 2024)"),
 (r"crescendo|multi-turn escal", "Crescendo (Russinovich et al. 2024)"),
 (r"indirect prompt injection|tool output poison|observation poison", "Greshake et al. 2023"),
 (r"rag poison|corpus poison|knowledge base poison", "indirect-injection family"),
 (r"system prompt (extraction|leak)|prompt leak", "Nasr et al. 2025 logprob attacks"),
 (r"logit bias|logprob", "Nasr et al. 2025"),
 (r"memory poison|spaiware|persistent memory", "SpAIware (2025)"),
 (r"tool poison|tool description", "Tool Poisoning (2025)"),
 (r"pair|tree of attacks|automated red.?team loop", "PAIR/TAP (2024)"),
 (r"fine-?tun(ing|e) poison|supply chain", "Qi et al. 2023"),
 (r"multilingual|low-resource|cross-?lingual", "Yong et al. 2023"),
 (r"persuas", "PAP (Zeng et al. 2024)"),
 (r"attention sink|positional", "Liu et al. 2024 / Xiao et al. 2023"),
 (r"soft prompt|embedding injection", "Schwinn et al. 2023"),
 (r"mcp|model context protocol", "tool-poisoning/MCP research 2025"),
 (r"worm|self-replicat|propagat", "Morris-II agentic worm (2024)"),
]

scores = {}
for t in T:
    b = blob(t); name = t["n"].lower()
    sig = {k: hits(b, v) for k, v in KW.items()}
    active = [k for k, v in sig.items() if v]
    # POWER
    power = 5.0
    if sig["exfil"]: power += 2.0
    if sig["persistence"]: power += 1.5
    if sig["agentic"] or sig["supplychain"]: power += 1.5
    if sig["optimization"] or sig["injection"]: power += 0.75
    if any(k in b for k in ["denial", "crash", "resource exhaust", "loop forever", "dos"]): power -= 1.5
    power = max(1, min(10, power))
    # EFFECT
    fam = [f for pat, f in FAMILY if re.search(pat, b)]
    effect = 4.0
    if fam: effect = 7.5
    if len(fam) >= 2: effect = 8.5
    if hits(b, SPEC) and not fam: effect = 2.0
    if any(x in b for x in ["hallucinat"]): effect -= 0.5
    effect = max(1, min(10, effect))
    # CURRENT
    cur = 4.0
    for k in ("agentic", "memory", "multimodal", "reasoning", "optimization", "multiturn", "injection", "supplychain", "exfil", "persistence"):
        if sig[k]: cur += 0.8
    dead = hits(b, DEAD)
    if dead and not active: cur = 1.5
    elif dead: cur -= 1.5
    if hits(b, SPEC) and not fam: cur -= 1.5
    cur = max(1, min(10, cur))
    # UNIQUE
    csize = len(CL[t["i"]])
    uniq = 10 if csize == 1 else max(2, 11 - csize)
    comp = round(0.30*power + 0.27*effect + 0.28*cur + 0.15*uniq, 2)
    scores[t["i"]] = {
        "name": t["n"], "cat": t["c"], "sub": t.get("s", ""), "diff": t.get("d", ""),
        "power": power, "effect": effect, "current": cur, "unique": uniq,
        "cluster_size": csize, "cluster": sorted(CL[t["i"]]),
        "family": fam, "surfaces": active, "dead_hits": dead,
        "composite": comp, "prefill_extra": bool(any(t.get(k) for k in ("re","vf","fs","cf","rc"))),
    }

json.dump(scores, open("/home/user/redaeye_v2/triage.json", "w"), indent=1)
ranked = sorted(scores.items(), key=lambda kv: -kv[1]["composite"])
print(f"clusters: {len(clusters)} unique concepts from {N} entries")
print("\n=== TOP 70 ===")
for i, (rid, s) in enumerate(ranked[:70]):
    fam = ",".join(sorted(set(s["family"])))[:40] or "-"
    print(f"{i+1:3d} {rid} P{s['power']:.0f} E{s['effect']:.0f} C{s['current']:.0f} U{s['unique']:2d} comp={s['composite']:5.2f} cl={s['cluster_size']:2d} | {s['name'][:52]:52s} | {fam}")
print("\n=== BOTTOM 30 ===")
for i, (rid, s) in enumerate(ranked[-30:]):
    print(f"     {rid} P{s['power']:.0f} E{s['effect']:.0f} C{s['current']:.0f} U{s['unique']:2d} comp={s['composite']:5.2f} | {s['name'][:60]}")
