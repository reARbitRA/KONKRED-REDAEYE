#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Losslessly preserve legacy raw content inside REDAEYE v2 entries.

What this does:
1) Exports exact normalized legacy records from ../arsenal_T.json to legacy_preservation/.
2) Patches every enhanced entry (*.md) that has a legacy record by appending a
   LEGACY_RAW_PRESERVATION_BLOCK inside extendedInterpretationLayer.content.
3) The raw legacy JSON is embedded as base64 so validator does not misinterpret
   legacy fabricated model names or old unsafe-operational strings as v2 claims.
"""
from __future__ import annotations
from pathlib import Path
import base64, hashlib, json, re, sys

ROOT = Path(__file__).resolve().parents[1]
ENTRIES = ROOT / "entries"
LEGACY_SRC = ROOT.parent / "arsenal_T.json"
OUT = ROOT / "legacy_preservation"
BY_ID = OUT / "by_id"

sys.path.insert(0, str(ROOT / "tools"))
from build_navigator import P  # TS-subset parser used by the project

REQUIRED_KEYS = ["id","name","objective","mechanism","mitigation","metadata","preconditions",
 "failureModes","attackChain","defensePressurePoints","usage","technicalExpansionLayer",
 "adversarialMechanics","modelInternalExploitationPathways","transformerArchitectureImpactAnalysis",
 "operationalDeploymentScenarios","multiStageAttackIntegration","blueTeamDetectionWeaknesses",
 "redTeamEscalationOpportunities","variantFamilies","failureStates",
 "defensiveCountermeasuresThatFail","highLevelResearchCommentary","extendedInterpretationLayer",
 "ultraDeepAdversarialFieldNotes","payloads","edgeCasePayloads","finalExpansionSummary"]

MARKER_START = "\n\nLEGACY_RAW_PRESERVATION_BLOCK_BEGIN\n"
MARKER_END = "\nLEGACY_RAW_PRESERVATION_BLOCK_END"


def canonical(obj):
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def sha256(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def q(s: str) -> str:
    return json.dumps(str(s), ensure_ascii=False)


def emit_value(v, indent=0):
    sp = " " * indent
    if isinstance(v, str):
        return q(v)
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        if not v:
            return "[]"
        return "[\n" + "\n".join(" "*(indent+2) + emit_value(x, indent+2) + "," for x in v) + "\n" + sp + "]"
    if isinstance(v, dict):
        lines = ["{"]
        for k, val in v.items():
            lines.append(" "*(indent+2) + f"{k}: " + emit_value(val, indent+2) + ",")
        lines.append(sp + "}")
        return "\n".join(lines)
    if v is None:
        return '""'
    return q(v)


def parse_entry(path: Path):
    raw = path.read_text(encoding="utf-8")
    m = re.search(r"export const (RAE\d+): Technique = (\{.*\});\s*$", raw, re.S)
    if not m:
        raise ValueError(f"cannot parse export object: {path}")
    eid = m.group(1)
    obj = P(m.group(2)).parse()
    return eid, obj


def emit_entry(eid: str, obj: dict) -> str:
    lines = ["---", f"id: {eid}", "---", 'import { Technique } from "./reference-ram-strings";', "", f"export const {eid}: Technique = {{"]
    for k in REQUIRED_KEYS:
        if k not in obj:
            raise ValueError(f"{eid} missing key {k}")
        lines.append(f"  {k}: " + emit_value(obj[k], 2) + ",")
    lines.append("};")
    return "\n".join(lines) + "\n"


def strip_old_block(s: str) -> str:
    return re.sub(re.escape(MARKER_START) + r".*?" + re.escape(MARKER_END), "", s, flags=re.S)


def main():
    data = json.load(open(LEGACY_SRC, encoding="utf-8"))
    byid = {e["i"]: e for e in data}
    OUT.mkdir(exist_ok=True)
    BY_ID.mkdir(exist_ok=True)

    # Global exact archive from arsenal_T.json normalized by id.
    all_bytes = canonical(byid)
    (OUT / "legacy_raw_all_367_by_id.json").write_bytes(json.dumps(byid, ensure_ascii=False, sort_keys=True, indent=2).encode("utf-8"))
    manifest = {
        "source": str(LEGACY_SRC),
        "record_count": len(byid),
        "canonical_sha256": sha256(all_bytes),
        "note": "Each by_id JSON preserves every field from arsenal_T.json for the corresponding legacy record. Entry-embedded base64 blocks encode the canonical JSON for exact recovery.",
        "records": {},
    }

    for eid, rec in byid.items():
        b = canonical(rec)
        h = sha256(b)
        (BY_ID / f"{eid}.json").write_bytes(json.dumps(rec, ensure_ascii=False, sort_keys=True, indent=2).encode("utf-8"))
        manifest["records"][eid] = {"sha256": h, "bytes": len(b), "path": f"legacy_preservation/by_id/{eid}.json"}

    patched = 0
    skipped = 0
    for path in sorted(ENTRIES.glob("RAE*.md")):
        eid, obj = parse_entry(path)
        if eid not in byid:
            skipped += 1
            continue
        rec = byid[eid]
        b = canonical(rec)
        h = sha256(b)
        b64 = base64.b64encode(b).decode("ascii")
        field_keys = ",".join(rec.keys())
        block = (
            MARKER_START +
            f"entryId: {eid}\n" +
            f"legacySource: arsenal_T.json\n" +
            f"legacyByIdPath: legacy_preservation/by_id/{eid}.json\n" +
            f"legacyFieldKeys: {field_keys}\n" +
            f"legacyCanonicalSha256: {h}\n" +
            f"legacyCanonicalBytes: {len(b)}\n" +
            "legacyRawEncoding: base64(canonical UTF-8 JSON; sort_keys=True; separators=(',', ':'))\n" +
            "legacyStatus: preserved-as-audit-artifact; not automatically verified; unsafe-operational or unsupported claims remain labeled in v2.\n" +
            f"legacyRawBase64: {b64}" +
            MARKER_END
        )
        ext = obj.get("extendedInterpretationLayer")
        if not isinstance(ext, dict):
            ext = {"content": ""}
            obj["extendedInterpretationLayer"] = ext
        content = str(ext.get("content", ""))
        content = strip_old_block(content)
        ext["content"] = content + block
        path.write_text(emit_entry(eid, obj), encoding="utf-8")
        patched += 1

    (OUT / "manifest.json").write_bytes(json.dumps(manifest, ensure_ascii=False, sort_keys=True, indent=2).encode("utf-8"))
    print(json.dumps({"patched_entries": patched, "skipped_entries": skipped, "legacy_records": len(byid), "manifest": str(OUT / "manifest.json"), "all_sha256": manifest["canonical_sha256"]}, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
