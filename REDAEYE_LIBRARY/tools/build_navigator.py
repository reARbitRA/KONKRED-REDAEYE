#!/usr/bin/env python3
"""Build REDAEYE ARSENAL v2 navigator (single-file, offline) from:
   - redaeye_v2/entries/*.md   (enhanced 29-section TS entries; source of truth)
   - arsenal_T.json            (legacy compact data for not-yet-enhanced entries)
Parser handles the TS subset emitted by the v2 pipeline (strings/arrays/objects/numbers)."""
import json, re, os, sys, html as H

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRIES = os.path.join(ROOT, "entries")
LEGACY = os.path.join(os.path.dirname(ROOT), "arsenal_T.json")
OUT = os.path.join(ROOT, "navigator", "index.html")

# ---------- TS-subset parser ----------
class P:
    def __init__(self, s): self.s, self.i = s, 0
    def ws(self):
        while True:
            while self.i < len(self.s) and self.s[self.i] in " \t\r\n": self.i += 1
            # skip line comments (only reachable outside strings)
            if self.s.startswith("//", self.i):
                nl = self.s.find("\n", self.i)
                self.i = len(self.s) if nl == -1 else nl + 1
            else:
                return
    def parse(self):
        self.ws()
        c = self.s[self.i]
        if c == "{": return self.obj()
        if c == "[": return self.arr()
        if c == '"': return self.string()
        m = re.match(r"[-\d.]+", self.s[self.i:])
        if m: self.i += m.end(); return float(m.group()) if "." in m.group() else int(m.group())
        raise ValueError(f"unexpected {c!r} at {self.i}")
    def obj(self):
        self.i += 1; o = {}
        while True:
            self.ws()
            if self.s[self.i] == "}": self.i += 1; return o
            m = re.match(r"(\w+)\s*:", self.s[self.i:])
            if not m: raise ValueError(f"bad key at {self.i}: {self.s[self.i:self.i+40]}")
            k = m.group(1); self.i += m.end()
            o[k] = self.parse()
            self.ws()
            if self.s[self.i] == ",": self.i += 1
    def arr(self):
        self.i += 1; a = []
        while True:
            self.ws()
            if self.s[self.i] == "]": self.i += 1; return a
            a.append(self.parse())
            self.ws()
            if self.s[self.i] == ",": self.i += 1
    def string(self):
        i = self.i + 1; out = []
        while True:
            c = self.s[i]
            if c == "\\": out.append(self.s[i+1] if self.s[i+1] != "n" else "\n"); i += 2
            elif c == '"': self.i = i + 1; return "".join(out)
            else: out.append(c); i += 1

def load_entries():
    out = {}
    for fn in sorted(os.listdir(ENTRIES)):
        if not fn.endswith(".md"): continue
        src = open(os.path.join(ENTRIES, fn), encoding="utf-8").read()
        m = re.search(r"export const (\w+): Technique = \{", src)
        if not m: continue
        start = m.end() - 1
        depth, i, in_str, esc = 0, start, False, False
        while i < len(src):
            c = src[i]
            if in_str:
                if esc: esc = False
                elif c == "\\": esc = True
                elif c == '"': in_str = False
            elif c == '"': in_str = True
            elif c == "{": depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0: break
            i += 1
        blob = src[start:i+1]
        obj = P(blob).parse()
        out[obj.get("id", fn)] = obj
    return out

# ---------- render ----------
SEC_ORDER = ["objective","mechanism","mitigation","preconditions","failureModes","attackChain",
 "defensePressurePoints","usage","technicalExpansionLayer","adversarialMechanics",
 "modelInternalExploitationPathways","transformerArchitectureImpactAnalysis",
 "operationalDeploymentScenarios","multiStageAttackIntegration","blueTeamDetectionWeaknesses",
 "redTeamEscalationOpportunities","variantFamilies","failureStates",
 "defensiveCountermeasuresThatFail","highLevelResearchCommentary","extendedInterpretationLayer",
 "ultraDeepAdversarialFieldNotes","payloads","edgeCasePayloads","finalExpansionSummary"]

def esc(x): return H.escape(str(x))

def render_val(v):
    if isinstance(v, str): return f"<p class='txt'>{esc(v).replace(chr(10),'<br>')}</p>"
    if isinstance(v, list):
        parts = []
        for it in v:
            if isinstance(it, str): parts.append(f"<li>{esc(it)}</li>")
            elif isinstance(it, dict):
                inner = "".join(f"<div class='kv'><b>{esc(k)}</b> {esc(val)}</div>" for k, val in it.items())
                parts.append(f"<li class='obj'>{inner}</li>")
        return f"<ul>{''.join(parts)}</ul>"
    if isinstance(v, dict):
        rows = "".join(f"<details class='kv'><summary>{esc(k)}</summary><div class='kvbody'>{render_val(val)}</div></details>"
                       if isinstance(val,(list,dict)) else f"<div class='kv'><b>{esc(k)}</b> {esc(val)}</div>"
                       for k, val in v.items())
        return f"<div class='dict'>{rows}</div>"
    return f"<p>{esc(v)}</p>"

def build():
    enhanced = load_entries()
    legacy = json.load(open(LEGACY, encoding="utf-8"))
    try:
        merge_map = json.load(open(os.path.join(ROOT, "priority_queue.json"), encoding="utf-8"))["merge_map"]
    except Exception:
        merge_map = {}
    cards = []
    for t in legacy:
        tid = t.get("i")
        e = enhanced.get(tid)
        if e:
            md = e.get("metadata", {})
            val = md.get("validation", {})
            refs = val.get("references", [])
            depth = md.get("depth", "full")
            cards.append({
                "id": tid, "name": e.get("name"), "cat": md.get("category", t.get("c","")),
                "sub": md.get("subcategory", t.get("s","")), "diff": md.get("difficulty",""),
                "ev": val.get("evidenceLevel",""), "refs": refs, "enhanced": True,
                "depth": depth, "obj": e.get("objective",""),
            })
        else:
            cards.append({"id": tid, "name": t.get("n"), "cat": t.get("c",""), "sub": t.get("s",""),
                          "diff": t.get("d",""), "ev": "legacy-unvalidated", "refs": [], "enhanced": False,
                          "depth": "legacy", "mergedInto": merge_map.get(tid, ""),
                          "obj": t.get("o","")[:300]})
    full = {tid: e for tid, e in enhanced.items()}
    data = {"cards": cards, "full": full, "secOrder": SEC_ORDER}
    tpl = open(os.path.join(ROOT, "tools", "navigator_template.html"), encoding="utf-8").read()
    page = tpl.replace("__DATA__", json.dumps(data, ensure_ascii=False))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, "w", encoding="utf-8").write(page)
    n = sum(1 for c in cards if c["enhanced"])
    n_full = sum(1 for c in cards if c["enhanced"] and c.get("depth") == "full")
    n_comp = sum(1 for c in cards if c["enhanced"] and c.get("depth") == "compact")
    n_legacy = sum(1 for c in cards if not c["enhanced"])
    print(f"classes: full={n_full} compact={n_comp} legacy={n_legacy}")
    print(f"navigator written: {OUT}  ({len(cards)} cards, {n} enhanced)")

if __name__ == "__main__":
    build()
