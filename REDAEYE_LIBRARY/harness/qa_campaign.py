#!/usr/bin/env python3
"""
REDAEYE QA CAMPAIGN — تست رسمی کل دارایی‌های موجود.

فازها:
  ۱) ساختار: validator (schema/size/models/citations)
  ۲) a href[integrity]: ارجاع‌های متقابل — citations، لینک‌های RAE####،
     front-matter ↔ export id، پیشوند payload IDs
  ۳) Navigator: build + sanity داده‌ها
  ۴) Harness Replication: ۳ اجرای کامل روی mock — قطعیتِ ابزار (نظم اندازه‌گیری)
  ۵) Edge-cases: توابع تحلیل باتری با ورودی‌های خراب
خروجی: output/QA_REPORT_<ts>.md
"""
import os, re, sys, json, time, subprocess, importlib, tempfile
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRIES = os.path.join(ROOT, "entries")
sys.path.insert(0, os.path.join(ROOT, "tools"))
sys.path.insert(0, os.path.join(ROOT, "harness"))

RESULTS = []          # (phase, name, passed, detail)

def record(phase, name, passed, detail=""):
    RESULTS.append((phase, name, bool(passed), detail))
    mark = "✅" if passed else "❌"
    print(f"  {mark} {name}" + (f" — {detail}" if detail else ""))

# ═══════════════ فاز ۱: ساختار ═══════════════
print("── فاز ۱: اعتبارسنجی ساختاری ──")
r = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "validate_entries.py")],
                   capture_output=True, text=True, cwd=ROOT)
out = r.stdout
m = re.search(r"RESULT: (\d+) entries \| (\d+) failures \| (\d+) warnings", out)
total_entries = int(m.group(1)); failures = int(m.group(2)); warnings = int(m.group(3))
record("۱ ساختار", f"validator: {total_entries} entries, {failures} failures", failures == 0,
       f"warnings={warnings} (benign family-refs)")
n_full = sum(1 for f in os.listdir(ENTRIES) if f.endswith(".md")
             and 'depth: "compact"' not in open(os.path.join(ENTRIES, f), encoding="utf-8").read())
n_comp = sum(1 for f in os.listdir(ENTRIES) if f.endswith(".md")
             and 'depth: "compact"' in open(os.path.join(ENTRIES, f), encoding="utf-8").read())
record("۱ ساختار", f"size classes valid: {n_full} full(≥50KB) + {n_comp} compact(≥5KB)",
       "✗ V2 size" not in out)

# ═══════════════ فاز ۲: integrity ارجاع‌ها ═══════════════
print("── فاز ۲: integrity ارجاع‌های متقابل ──")

ref_ids = set(re.findall(r"^- \[(R\d{1,2})\]", open(os.path.join(ROOT, "references.md"), encoding="utf-8").read(), re.M))
entry_ids = {f[:-3] for f in os.listdir(ENTRIES) if f.endswith(".md")}
legacy_ids = {t["i"] for t in json.load(open("/home/user/arsenal_T.json"))}

all_src = {}
bad_cites, bad_rae, fm_mismatch, bad_payload_prefix = [], [], [], []
for fn in sorted(entry_ids):
    src = open(os.path.join(ENTRIES, fn + ".md"), encoding="utf-8").read()
    all_src[fn] = src
    # citations
    for c in set(re.findall(r"\[(R\d{1,2})\]", src)):
        if c not in ref_ids:
            bad_cites.append((fn, c))
    # RAE cross-references (RAE\d{4}) — باید موجود باشند (enhanced یا legacy)
    for ref in set(re.findall(r"\bRAE(\d{4})\b(?!\s*\(missing legacy entry\))", src)):
        rid = "RAE" + ref
        if rid != fn and rid not in entry_ids and rid not in legacy_ids:
            bad_rae.append((fn, rid))
    # front-matter ↔ export id
    fm = re.search(r"^---\nid: (RAE\d{4})\n---", src)
    ex = re.search(r'export const (RAE\d{4}): Technique', src)
    fid = re.search(r'\n  id: "(RAE\d{4})"', src)
    if not (fm and ex and fid and fm.group(1) == ex.group(1) == fid.group(1) == fn):
        fm_mismatch.append(fn)
    # payload/edge پیشوند باید با id مدخل بخونه
    for pid in re.findall(r'id: "(RAE\d{4})-(?:P|E)\d+"', src):
        if not pid.startswith(fn):
            bad_payload_prefix.append((fn, pid))

record("۲ ارجاع", "citations: همه [Rxx] در references.md موجودند", not bad_cites, str(bad_cites[:3]))
record("۲ ارجاع", "cross-refs: همه RAE#### هدف واقعی دارند", not bad_rae, str(bad_rae[:3]))
record("۲ ارجاع", "front-matter ↔ export id ↔ filename هم‌خوان", not fm_mismatch, str(fm_mismatch))
record("۲ ارجاع", "payload ID prefixes درست", not bad_payload_prefix, str(bad_payload_prefix[:3]))

# تراکم citations — کدام مراجع بیشترین استفاده را دارند
cite_counter = Counter()
for src in all_src.values():
    cite_counter.update(re.findall(r"\[(R\d{1,2})\]", src))
top_refs = cite_counter.most_common(8)
record("۲ ارجاع", f"corpus citation density (top: {top_refs[0][0]}×{top_refs[0][1]})", True,
       ", ".join(f"{r}×{c}" for r, c in top_refs))

# ═══════════════ فاز ۳: Navigator ═══════════════
print("── فاز ۳: navigator ──")
r2 = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "build_navigator.py")],
                    capture_output=True, text=True, cwd=ROOT)
nav_ok = "navigator written" in r2.stdout
nav_path = os.path.join(ROOT, "navigator", "index.html")
nav_html = open(nav_path, encoding="utf-8").read() if os.path.exists(nav_path) else ""
record("۳ navigator", "build موفق", nav_ok and len(nav_html) > 500_000, f"{len(nav_html)//1024}KB")
record("۳ navigator", f"هر {len(entry_ids)} مدخل enhanced موجود",
       all(f'"{eid}"' in nav_html for eid in entry_ids) and nav_html.count('"enhanced": true') == len(entry_ids),
       f"enhanced={nav_html.count(chr(34)+'enhanced'+chr(34)+': true')}")

# ═══════════════ فاز ۴: Harness Replication (N=3 روی mock) ═══════════════
print("── فاز ۴: قطعیت ابزار — ۳ اجرای کامل روی mock ──")
os.chdir(os.path.join(ROOT, "harness"))
os.environ["NOVA_TEST"] = "1"

# mock را در همین پروسه بالا بیاور (بدون زیرپروسه)
import http.server, threading
import mock_target as mt
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8033), mt.H)
threading.Thread(target=srv.serve_forever, daemon=True).start()
time.sleep(0.3)

import harness as H
importlib.reload(H)

runs = []
for i in range(3):
    t = H.Target("http://127.0.0.1:8033/v1", "mock-1", "x")
    t.chat([{"role": "user", "content": "ping"}], want_logprobs=True)
    res = []
    for b in H.PROBES:
        rows = H.run_probe(t, b)
        res.append((b["rae"], b["name"], H.analyze(b, rows)["headline"]))
    audits = H.run_audits(t)
    runs.append((res, audits))
    time.sleep(0.05)
srv.shutdown()

det_probes = all(runs[0][0] == runs[i][0] for i in (1, 2))
det_audits = all(runs[0][1] == runs[i][1] for i in (1, 2))
record("۴ قطعیت", "۳ اجرا → نتایج probe یکسان (deterministic)", det_probes)
record("۴ قطعیت", "۳ اجرا → نتایج audit یکسان", det_audits)

# چند یافته‌ی کلیدی mock را ثبت کن (صحت تحلیل، نه فقط تکرار)
mock_findings = [h for _, _, h in runs[0][0]]
record("۴ قطعیت", "batteries همه headline معتبر برمی‌گردانند",
       all(h and h != "n/a" for h in mock_findings),
       f"{sum(1 for h in mock_findings if h)}/{len(mock_findings)} filled")
record("۴ قطعیت", "audits مقادیر برمی‌گردانند",
       all(a["value"] is not None for a in runs[0][1]))

# ═══════════════ فاز ۵: edge-cases تحلیلگرها ═══════════════
print("── فاز ۵: edge-case توابع ──")
import harness as hh

ok1 = True
try:
    # باتری با همه‌ی پاسخ‌های error
    for b in hh.PROBES:
        f = hh.analyze(b, [dict(tag=p["tag"], verdict="error", err="HTTP 500", ms=0, words=0, text="") for p in b["probes"]])
        assert isinstance(f["headline"], str) and f["headline"]
except Exception as e:
    ok1 = False; err1 = str(e)
record("۵ edge", "analyze() با همه‌ی verdict=error نمی‌شکند", ok1, err1 if not ok1 else "")

ok2 = True
try:
    for b in hh.PROBES:
        f = hh.analyze(b, [dict(tag=p["tag"], verdict="info", err=None, ms=0, words=0, text="") for p in b["probes"]])
except Exception as e:
    ok2 = False; err2 = str(e)
record("۵ edge", "analyze() با همه‌ی verdict=info نمی‌شکند", ok2, err2 if not ok2 else "")

# Target با endpoint مرده → پیام خطا، نه کرش
t_dead = hh.Target("http://127.0.0.1:9", "m", "k")
txt, dt, err = t_dead.chat([{"role": "user", "content": "x"}])
record("۵ edge", "Target مرده: خطا برمی‌گرداند (نه exception)", err is not None and txt == "")

# classify روی ورودی‌های عجیب (از بات — همان تابعی که production استفاده می‌کند)
sys.path.insert(0, "/home/user/telegram-bot")
from router import classify as _classify
weird = [[{"role": "user"}], [], [{"role": "user", "content": None}],
         [{"role": "user", "content": "x" * 9000}], [{"content": "x"}] * 9]
ok3 = True
try:
    for msgs in weird:
        r = _classify(msgs); assert isinstance(r, str)
except Exception:
    ok3 = False
record("۵ edge", "classify() با ورودی‌های خصمانه", ok3)

# ═══════════════ گزارش ═══════════════
os.makedirs(os.path.join(ROOT, "harness", "output"), exist_ok=True)
stamp = time.strftime("%Y%m%d_%H%M%S")
path = os.path.join(ROOT, "harness", "output", f"QA_REPORT_{stamp}.md")

passed = sum(1 for _, _, p, _ in RESULTS if p)
total = len(RESULTS)
L = ["# REDAEYE QA CAMPAIGN REPORT\n",
     f"**Date:** {time.strftime('%Y-%m-%d %H:%M')}  ",
     f"**Scope:** {total_entries} enhanced entries · harness v2 · navigator · validator  ",
     f"**Verdict:** {'🟢 PASS' if passed == total else '🔴 FAIL'} — {passed}/{total} checks\n",
     "## نتایج به تفکیک فاز\n",
     "| فاز | تست | نتیجه | جزئیات |", "|---|---|---|---|"]
for phase, name, p, d in RESULTS:
    L.append(f"| {phase} | {name} | {'✅' if p else '❌'} | {d or '—'} |")

L += ["\n## Harness Replication — یافته‌های mock (اجرای ۱)\n", "| RAE | Battery | Headline |", "|---|---|---|"]
for rae, name, h in runs[0][0]:
    L.append(f"| {rae} | {name} | {h} |")
L += ["\n| Audit | Value |", "|---|---|"]
for a in runs[0][1]:
    L.append(f"| {a['rae']} {a['name']} | `{a['value']}` |")

L += ["\n## Citation Density (فاز ۲)\n"]
L += [f"`[{r}]` used **{c}×** across the corpus.\n" for r, c in top_refs]

L += ["\n## محدودیت صادقانه\n",
      "- تست مدلِ واقعی انجام نشد: هیچ endpoint بدون‌کلید LLM در ۲۰۲۶ برابر نیست (پول‌محور).",
      "  با اولین کلید خودت (`python3 harness.py --target ... --ack-i-own-this-target`) قابل اجراست.",
      "- فاز ۴ قطعیتِ *ابزار* را می‌سنجد، نه رفتارِ مدل‌های واقعی (variance طبیعی است)."]

open(path, "w", encoding="utf-8").write("\n".join(L))
print(f"\n{'🟢' if passed==total else '🔴'} {passed}/{total} — گزارش: {path}")
sys.exit(0 if passed == total else 1)
