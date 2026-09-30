#!/usr/bin/env python3
"""
REDAEYE Bounty Platform — coordinated group bounties on AI-security findings.

Workflow:
  1. Org creates a Program (scope + reward pool, USDT)
  2. Researchers form Groups
  3. Groups submit Findings — direct intake from harness `--json` export
  4. Triage: new → triage → accepted → paid → disclosed
  5. Payout splits per group decision; leaderboard by earnings

Run:  python3 server.py   →  http://0.0.0.0:8020
Auth: env BOUNTY_ADMIN_TOKEN (required for program/status mutations)
"""
import os, json, sqlite3, threading, time, hmac, hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bounty.db")
ADMIN_TOKEN = os.getenv("BOUNTY_ADMIN_TOKEN", "")
PORT = int(os.getenv("BOUNTY_PORT", "8020"))
STATES = {"new", "triage", "accepted", "paid", "disclosed", "rejected"}

_c = sqlite3.connect(DB, check_same_thread=False)
_c.row_factory = sqlite3.Row
_c.executescript("""
CREATE TABLE IF NOT EXISTS programs(
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, scope TEXT,
  pool_usdt REAL, created_at REAL);
CREATE TABLE IF NOT EXISTS groups(
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE,
  members TEXT, created_at REAL);          -- members: JSON array of handles
CREATE TABLE IF NOT EXISTS reports(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_id INTEGER, group_id INTEGER, title TEXT, severity TEXT,
  findings TEXT,                            -- harness JSON export (stored verbatim)
  state TEXT DEFAULT 'new', created_at REAL);
CREATE TABLE IF NOT EXISTS payouts(
  id INTEGER PRIMARY KEY AUTOINCREMENT, report_id INTEGER,
  member TEXT, amount_usdt REAL, created_at REAL);
""")
_c.commit()
_lock = threading.Lock()

def q(sql, args=()):
    with _lock:
        return _c.execute(sql, args).fetchall()

def x(sql, args=()):
    with _lock:
        cur = _c.execute(sql, args); _c.commit()
        return cur.lastrowid

def submit_report(program_id, group_id, title, severity, findings_json):
    try:                       # validate harness export shape if dict
        d = json.loads(findings_json) if isinstance(findings_json, str) else findings_json
        if isinstance(d, dict) and "findings" in d:
            n = len(d["findings"])
            title = title or f"harness run ({n} findings)"
    except Exception:
        d = None
    rid = x("""INSERT INTO reports(program_id, group_id, title, severity, findings, created_at)
               VALUES(?,?,?,?,?,?)""",
           (program_id, group_id, title, severity or "info",
            findings_json if isinstance(findings_json, str) else json.dumps(d or {}), time.time()))
    return rid

def set_state(rid, state, split=None):
    if state not in STATES:
        raise ValueError(f"state must be one of {sorted(STATES)}")
    x("UPDATE reports SET state=? WHERE id=?", (state, rid))
    if state == "paid":
        if not split or abs(sum(split.values()) - 1.0) > 1e-6:
            raise ValueError("paid requires split summing to 1.0 {member: fraction}")
        row = q("SELECT r.program_id, p.pool_usdt FROM reports r JOIN programs p ON p.id=r.program_id WHERE r.id=?", (rid,))[0]
        # سهم گزارش از باقی‌ماند‌ه استخر ساده: نصف استخر باقی‌مانده در این نسخه
        remaining = row["pool_usdt"]
        paid_already = q("SELECT COALESCE(SUM(amount_usdt),0) s FROM payouts")[0]["s"]
        budget = max(0.0, remaining - paid_already) * 0.5
        for member, frac in split.items():
            x("INSERT INTO payouts(report_id, member, amount_usdt, created_at) VALUES(?,?,?,?)",
              (rid, member, round(budget * frac, 2), time.time()))

def leaderboard():
    rows = q("""SELECT g.name grp, COALESCE(SUM(po.amount_usdt),0) earned,
                       COUNT(DISTINCT r.id) reports
                FROM groups g
                LEFT JOIN reports r ON r.group_id=g.id
                LEFT JOIN payouts po ON po.report_id=r.id
                GROUP BY g.id ORDER BY earned DESC""")
    return [dict(r) for r in rows]

class H(BaseHTTPRequestHandler):
    def _json(self, code, obj):
        b = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers(); self.wfile.write(b)

    def _admin(self):
        return (not ADMIN_TOKEN) or self.headers.get("X-Admin-Token", "") == ADMIN_TOKEN

    def _body(self):
        n = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(n) or b"{}")

    def do_GET(self):
        if self.path == "/api/programs":
            return self._json(200, [dict(r) for r in q("SELECT * FROM programs ORDER BY id")])
        if self.path.startswith("/api/programs/") and self.path.endswith("/reports"):
            pid = int(self.path.split("/")[3])
            return self._json(200, [dict(r) for r in
                q("SELECT id,group_id,title,severity,state,created_at FROM reports WHERE program_id=?", (pid,))])
        if self.path == "/api/leaderboard":
            return self._json(200, leaderboard())
        self._json(404, {"error": "not found"})

    def do_POST(self):
        try:
            d = self._body()
            if self.path == "/api/programs":
                if not self._admin(): return self._json(403, {"error": "admin token"})
                pid = x("INSERT INTO programs(name, scope, pool_usdt, created_at) VALUES(?,?,?,?)",
                        (d["name"], d.get("scope", ""), float(d.get("pool_usdt", 0)), time.time()))
                return self._json(200, {"id": pid})
            if self.path == "/api/groups":
                gid = x("INSERT INTO groups(name, members, created_at) VALUES(?,?,?)",
                        (d["name"], json.dumps(d.get("members", [])), time.time()))
                return self._json(200, {"id": gid})
            if self.path == "/api/reports":
                if "findings_path" in d:                      # فایل خروجی harness
                    d["findings"] = open(d["findings_path"], encoding="utf-8").read()
                rid = submit_report(d["program_id"], d["group_id"],
                                    d.get("title"), d.get("severity"), d.get("findings", "{}"))
                return self._json(200, {"id": rid})
            if self.path.startswith("/api/reports/") and self.path.endswith("/status"):
                if not self._admin(): return self._json(403, {"error": "admin token"})
                rid = int(self.path.split("/")[3])
                set_state(rid, d["state"], d.get("split"))
                return self._json(200, {"id": rid, "state": d["state"]})
        except (KeyError, ValueError) as e:
            return self._json(400, {"error": str(e)})
        except Exception as e:
            return self._json(500, {"error": f"{type(e).__name__}: {e}"})
        self._json(404, {"error": "not found"})

    def log_message(self, *a): pass

if __name__ == "__main__":
    print(f"🏴 Bounty platform → http://0.0.0.0:{PORT}  (admin-auth: {'ON' if ADMIN_TOKEN else 'OFF'})")
    ThreadingHTTPServer(("0.0.0.0", PORT), H).serve_forever()
