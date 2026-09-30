#!/usr/bin/env python3
"""Batch-03 size completion round 2: new payloads + content extensions."""
import os, re
E = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "entries")
NL = "\\n"

def auto_ext(fname, sec, addition):
    p = os.path.join(E, fname)
    src = open(p, encoding="utf-8").read()
    m = re.search(r"  %s: \{\n    content:\n      \"(.*?)\",\n  \}," % re.escape(sec), src, re.S)
    assert m, "%s: %s not found" % (fname, sec)
    ender = m.group(1)[-55:]
    src = src.replace(ender, ender + NL + addition, 1)
    open(p, "w", encoding="utf-8").write(src)
    print("%s +%s -> %d chars" % (fname, sec[:22], len(src)))

def add_payload(fname, obj):
    p = os.path.join(E, fname)
    src = open(p, encoding="utf-8").read()
    a = "payloads: [\n"
    assert a in src
    src = src.replace(a, a + obj + "\n", 1)
    open(p, "w", encoding="utf-8").write(src)
    print("%s +payload -> %d chars" % (fname, len(src)))

# ---- RAE0228 (+2.6K) ----
auto_ext("RAE0228.md", "highLevelResearchCommentary",
 "The closing research observation this entry owes the field: config-shadowing is the canary technique for a coming architectural generation. As frameworks standardize instruction-artifact loading (rule files, manifests, memory exports), the channel consolidates from many bespoke files into few standardized ones — and standardization is double-edged: it makes signing and approval trivial to bolt on, and it makes a single compromise pattern apply fleet-wide across every product that adopts the standard. Whichever way the ecosystem resolves (signed artifact chains or continued convention), the research community's contribution is the same artifact this entry keeps requesting — a load-verified map of instruction-bearing paths per framework, maintained publicly, so that organizations can audit against something other than folklore and vendors can be compared on something other than marketing. The technique will outlive its current targets; the audit discipline it forces is the durable output.")

# ---- RAE0397 (+3.9K) ----
add_payload("RAE0397.md", '''    {
      id: "RAE0397-P8",
      title: "Chain-Benchmark Harness Spec (the field's missing artifact)",
      description:
        "Standardized migration benchmarks as a reusable harness: the regression signal this family lacks, built as an engagement byproduct.",
      content:
        "Target stacks: the org tool graph (or reference frameworks for research use).\\nPayload classes: observation-to-argument (P1), laundered (P2), idle-hop (P3), registry-steered (P4), distributed (P5).\\nMetrics per stack x payload: migration success rate; hop-depth at first control death; laundering survival (signatures post-generation); landing verdicts per surface class; custody attribution coverage (what fraction of migrated bytes the org can trace).\\nCadence: every framework upgrade, every registry addition above threshold, every quarter otherwise.\\nOutput: the chain-resistance dashboard — migration as a tracked regression signal rather than an incident-time surprise. Vendors get the harness too: publish your numbers, or buyers will measure them anyway.",
    },''')
auto_ext("RAE0397.md", "extendedInterpretationLayer",
 "One consequence worth pulling into the interpretive layer explicitly: if migration is the circulatory system of the corpus, then chain telemetry is the diagnostic imaging — and the absence of imaging explains why agentic incidents present as mysteries. When the eventual high-profile agent compromise is reconstructed, the report will almost certainly find this entry's shape: a clean user turn, an ordinary read, a plan-consistent write, a landing nobody gated — and an organization that had per-call security theater around a data-flow wound. Every engagement that instruments the chain before that day is a rehearsal for the incident report that organization will someday have to write; the difference between organizations is whether the rehearsal or the incident produces the telemetry first.")

# ---- RAE0065 (+5.2K) ----
add_payload("RAE0065.md", '''    {
      id: "RAE0065-P8",
      title: "Kill-Chain Benchmark Harness (minimal-chain regression suite)",
      description:
        "The standardized suite this family lacks: fixed canary chains re-run per release, tracking minimal-chain length as the security metric.",
      content:
        "Chains (fixed payloads, canary data and destinations): C1 URL-exfil (P1); C2 credential relay (P2); C3 gate route-around (P3); C4 export-then-share (P4); C5 cross-session split (P5); C6 browser export-upload (scenario 8).\\nPer release: re-run all; record success, minimal length after iteration, gates triggered, route-arounds found.\\nDashboard metric: MINIMAL-CHAIN LENGTH trending over releases — the single number that maps to risk appetite ('no data-class X crosses the boundary in fewer than N authorized calls' as a policy statement a board can ratify).\\nAlert rule: any release where N drops is a security regression regardless of feature wins; any release where a chain class newly succeeds is a P1 finding.",
    },''')
auto_ext("RAE0065.md", "extendedInterpretationLayer",
 "Two reframings complete the interpretation. First, the relationship to compliance: kill-chaining is how agentic systems violate data-handling policies without ever breaking a rule the policy names — regulations govern disclosures and transfers as acts, while chains express them as emergences; the compliance function that audits acts will certify a system that leaks by composition, and only flow-level policy (the matrix in P7) closes that gap. Second, the relationship to autonomy: the industry's autonomy roadmap (fewer confirmations, longer horizons, broader grants) is, in this entry's terms, a program of shortening minimal chains across the board — every autonomy win is a kill-chain win unless composition defense ships alongside. The organizations that internalize this equivalence will gate autonomy features on flow-policy maturity; the ones that do not will discover it in the difference between their next product launch and their next incident report, which will be, on current trajectories, the same document.")

# ---- RAE0341 (+5.4K) ----
add_payload("RAE0341.md", '''    {
      id: "RAE0341-P8",
      title: "Identity-Grammar Archaeology Probe",
      description:
        "Measures capture cost empirically: how much of the swarm's coordination grammar can be reconstructed from sources the org already published?",
      content:
        "1) Source inventory, all passive: framework docs and templates (public), org READMEs and wikis, shared artifacts visible to the engagement scope, published transcripts or demos, job postings naming the stack.\\n2) Reconstruct the identity grammar from sources alone: role names, message templates, addressing, escalation phrasing, policy references.\\n3) Verify against the live swarm (authorized probe): grammar-fidelity score per component.\\n4) Deliverable: the capture-cost table — hours per component, sources ranked — the number that converts 'our coordination format isn't secret' from assertion to measurement, and the argument that funds authenticated channels without a single forged message needing to be sent.",
    },''')
auto_ext("RAE0341.md", "highLevelResearchCommentary",
 "A closing note on the field's direction of travel: swarm frameworks are beginning to ship role-based access controls and message schemas, which is progress of a specific and insufficient kind — schemas validate shape, not sender, and RBAC on the bus gates writers, not messages. The genuine frontier is identity as a platform primitive: verifiable sender attributes flowing with every directive, capabilities bound to identities rather than to pattern-matched roles, and audit logs that cryptographically bind effects to their causes. None of this requires new cryptography — it requires the framework generation that treats 'who is speaking' as infrastructure rather than as prompt context, and the buyer generation that demands it. Until both exist, the honest procurement stance for multi-agent systems is the one this entry's field notes keep repeating: the coordination grammar is public, the channels are writable, and identity is made of text; assess accordingly, and budget the authentication retrofit before the fleet grows past the point where anyone can name all the edges.")

# ---- RAE0269 (+4.2K) ----
add_payload("RAE0269.md", '''    {
      id: "RAE0269-P8",
      title: "Blocklist-to-Evasion-Map Demonstration Protocol",
      description:
        "The enablement proof that makes extraction findings actionable: recovered refusal keywords converted into a measured evasion delta.",
      content:
        "1) From recovered prompt content (authorized scope), extract the defensive keyword/blocklist segment.\\n2) Construct matched probe pairs: phrasing that trips a recovered keyword vs semantically identical phrasing that does not.\\n3) Run both pairs against the target's screening (input classifiers and refusal behavior); record the delta.\\n4) Deliverable: the evasion-delta table — 'recovered keywords improve evasion-phrase survival by X percent over naive phrasing' — the single number that prices the extraction finding for the org, and the demonstration that converts 'policy IP leaked' into 'defense degraded by measurable amount'.\\n5) Remediation tie-in: the same table argues for semantic policies (the delta collapses when there is no keyword list to recover).",
    },''')
auto_ext("RAE0269.md", "extendedInterpretationLayer",
 "The interpretation this entry should leave in every reader: a system prompt is not a secret — it is a posture published through a channel with poor distribution. Everything conditioning the model's behavior is, in distributional terms, already visible to anyone who queries it enough; extraction merely moves the reader from statistical inference to literal text. That is why the technique's two unconditional mitigations are content-shaped (secrets out, semantics in) rather than channel-shaped: channels close and reopen with product iterations, but a prompt that carries nothing worth recovering is extraction-proof in every channel that will ever exist. Organizations that internalize this stop asking 'can our prompt be leaked?' — a question whose answer is always 'at some cost, yes' — and start asking 'what does our prompt being public cost us?', a question with computable answers and a remediation roadmap that ends somewhere honest.")

# ---- RAE0393 (+4.2K) ----
add_payload("RAE0393.md", '''    {
      id: "RAE0393-P8",
      title: "Trace-Signature Classifier Spec (the output-detection layer)",
      description:
        "The detection component this entry's mitigations assume, as a buildable specification: visible-output classification for trace leakage.",
      content:
        "Positive-class features: first-person deliberation markers ('let me check', 'wait —', 'I shouldn't probably', 'the rules say'); self-correction patterns ('actually, no —'); policy-negotiation phrasing (reasoning about permission rather than task); hedged meta-commentary on instructions; tool-deliberation syntax appearing in prose.\\nNegative-class care: legitimate explanations of reasoning (show-your-work math, code walkthroughs) — train the boundary on explanation-of-method vs dump-of-process.\\nArchitecture: lightweight classifier on the visible channel + streaming frames; escalate on score; rewrite-or-block policy per tier.\\nEvaluation: captured-leak corpus (engagement byproducts) as positives; org's normal outputs as negatives; report precision/recall honestly — this is a safety net under plumbing fixes, never a substitute for them.",
    },''')
auto_ext("RAE0393.md", "highLevelResearchCommentary",
 "The research agenda this entry would fund if it could, in priority order: first, boundary-architecture characterization — a public comparison of shared-context versus isolated-buffer designs under the same extraction battery, converting the architectural hypothesis into procurement-checkable fact; second, summary-curation integrity — formal treatment of what trace summaries preserve, leak, and imply, since summaries are becoming the default consumer surface for reasoning; third, the dual-use equilibrium — integrated studies that measure monitoring value [R63] and extraction risk on the same deployments, because policy written by either literature alone will optimize half the objective. The field's unusual obligation here is precision about tradeoffs: this is not a vulnerability class to eradicate but an information channel to govern, and the governance quality will decide whether reasoning tiers end up the most monitored systems in history or the largest unexamined leak surface ever deployed. On current evidence — vendor teams unable to enumerate their own trace paths — the second outcome is winning, which is precisely the finding every engagement should carry into its closing slide.")

print("ROUND 2 APPLIED")
