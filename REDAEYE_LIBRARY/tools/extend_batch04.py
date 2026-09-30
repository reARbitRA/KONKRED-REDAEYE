#!/usr/bin/env python3
"""Batch-04 size completion: payload additions + content extensions (single round, margin included)."""
import os, re
E = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "entries")
NL = "\\n"

def auto_ext(fname, sec, addition):
    p = os.path.join(E, fname)
    src = open(p, encoding="utf-8").read()
    m = re.search(r"  %s: \{\n    content:\n      \"(.*?)\",\n  \}," % re.escape(sec), src, re.S)
    assert m, "%s: %s not found" % (fname, sec)
    ender = m.group(1)[-55:]
    assert ender in src, "ender missing"
    src = src.replace(ender, ender + NL + addition, 1)
    open(p, "w", encoding="utf-8").write(src)
    print("%s +%s -> %d" % (fname, sec[:24], len(src)))

def add_payload(fname, obj):
    p = os.path.join(E, fname)
    src = open(p, encoding="utf-8").read()
    a = "payloads: [\n"
    assert a in src
    src = src.replace(a, a + obj + "\n", 1)
    open(p, "w", encoding="utf-8").write(src)
    print("%s +payload -> %d" % (fname, len(src)))

# ============ RAE0066 (+4.2K) ============
add_payload("RAE0066.md", '''    {
      id: "RAE0066-P9",
      title: "Reinfection-Economics Model (engagement calculator)",
      description:
        "Turns the lifecycle measurements into the attacker-economics table that sizes defense budgets: cost per generation of persistence under each org countermeasure.",
      content:
        "Inputs (from the engagement): deposition cost per channel; derivation fidelity per grammar; write-back trigger reliability; cleanup cadence and coverage; resurrection rate per round.\\nComputation: expected generations survived per initial infection = product of per-edge survival probabilities, adjusted per cleanup round observed.\\nOutputs: half-life of infection under current state; half-life under each link-breaker added (taint-inheritance, write-gates, lineage sweep, quarantine) — the countermeasure-value ranking in attacker-cost units.\\nDeliverable use: the table that converts 'persistence risk' into 'your current posture gives an attacker N generations per infection; each link-breaker buys M' — the budget conversation in numbers, produced entirely from the engagement's own measurements.",
    },''')
auto_ext("RAE0066.md", "operationalDeploymentScenarios",
 "6. REGULATED-INDUSTRY DEPLOYMENT (compliance overlay):\\n- In finance/health deployments, the lifecycle's derived state often lands in records systems subject to retention and audit mandates — meaning cleanup faces a legal-retention vs security-removal conflict the incident runbook never anticipated: the summary carrying the payload may be a record the org must keep. Engagement deliverable: the retention-conflict memo — the finding that reinfection remediation requires legal sign-off, discovered in engagement rather than in incident; remediation is a retention-policy carve-out for derived state containing canary markers, agreed before it is ever needed.")

# ============ RAE0083 (+7.5K) ============
add_payload("RAE0083.md", '''    {
      id: "RAE0083-P8",
      title: "Plan-State Fuzzer Harness Spec",
      description:
        "The automated instrument this family needs: generative plan-state fuzzing that seeds synthetic entries at scale and measures binding, execution, and scope drift per framework release.",
      content:
        "Generator: plan-native entries synthesized across grammars (step/assumption/metadata) × scope distances (in-task to far) × registers (matching framework conventions) — from the org's own template corpus.\\nExecution: seeded plans run against canary tool environments (engagement sandbox); per-seed measurements: entry survival (re-plan persistence), execution (did tools fire), scope reach (arguments beyond task needs), first-control-death.\\nAggregation: per release — contamination survival curves, scope-tolerance distributions, arbitration deltas (P3 inline).\\nDeployment: release gate for every planner/framework version; drift blocks.\\nVendors: the harness generalizes — publish per-framework numbers or buyers run it in procurement labs.",
    },''')
auto_ext("RAE0083.md", "technicalExpansionLayer",
 "The procurement-level consequence deserves its own paragraph: organizations buying agent platforms in 2026 are buying planner implementations whose intermediate representation has no integrity model, and the RFP question that exposes it is one sentence — 'show how a plan entry's provenance is recorded, and what prevents content-derived entries from executing.' Vendors who answer with monitoring rather than prevention are describing the post-hoc era; vendors who cannot answer at all are describing the current one. The question belongs in every agentic RFP next to the RAE0397 data-flow question, because the two share an anatomy: both ask who may write to the structure the executor trusts, and the industry's current answer — 'whoever can reach it' — is the finding, stated politely, in advance.")
auto_ext("RAE0083.md", "blueTeamDetectionWeaknesses",
 "- PLAN STATEMENTS ARE NOT LOGGED AS STATEMENTS: telemetry records actions and answers; the plan object that authorized them is ephemeral in logs even when persisted in stores — post-hoc review reconstructs what happened, never what was planned to happen, and the gap is exactly where contamination lived.\\n- RE-PLAN EVENTS CELEBRATE RATHER THAN AUDIT: replanning is treated as adaptive behavior (a feature!) in every framework's metrics; the moments of highest contamination risk — plan rewrites — are the moments nobody inspects, an inversion so complete it belongs in the training material.")

# ============ RAE0398 (+5.3K) ============
add_payload("RAE0398.md", '''    {
      id: "RAE0398-P9",
      title: "Carrier-Yield Dashboard Spec (release-gate instrument)",
      description:
        "The standing artifact that turns one-time carrier matrices into tracked regression: per-carrier-class binding rates across pipeline releases.",
      content:
        "Rows: carrier classes (hidden-span, comment, aria/alt, shadow, offscreen, collapsed, visual-embedded, chrome-styled, modal/affordance, metadata, cross-origin-split).\\nColumns: entry-into-representation rate, binding rate, execution rate, first-control-death, last-measured release.\\nUpdate: every pipeline/model release — owned page battery re-run (P1/P2 grammar, canary payloads).\\nGate rule: any carrier class newly reaching execution blocks release; drift in any column triggers review.\\nConsumers: agent-platform team (pipeline changes), security (thresholds), leadership (one-page browser-posture). The dashboard's existence converts the matrix from engagement artifact to standing control.",
    },''')
auto_ext("RAE0398.md", "operationalDeploymentScenarios",
 "7. SEARCH-MEDIATED EXPOSURE (the delivery economics):\\n- The overlooked delivery question: how do agents arrive at carrier pages? Search results, recommendations, and link graphs are the acquisition channel, and SEO-for-agents is emerging as attacker investment. Audit: which discovery surfaces feed the org's agents (search tools, recommendation APIs, saved-link imports); deliverable: the acquisition-map — the finding that closing extraction while leaving acquisition open merely relocates the attack, and that search-vendor content policies are now agent-security infrastructure whether anyone treats them that way or not.")

# ============ RAE0226 (+10.5K) ============
add_payload("RAE0226.md", '''    {
      id: "RAE0226-P9",
      title: "Parameter-Authority Model Spec (the governance framework)",
      description:
        "The formal layer the family lacks: each shaping parameter classified by what it may legitimately determine, for whom — the policy artifact that turns ad-hoc flags into governed authority.",
      content:
        "Classification per parameter:\\n- AUTHORITY CLASS: preference-override (bias at magnitude), preference-nudge (moderate bias), distribution-shape (temperature/penalties), structural (grammar/JSON machinery).\\n- LEGITIMATE DETERMINERS: which roles may set each class (developer tooling: yes; end-user tiers: never for override; product policy: bounded nudges only).\\n- ENFORCEMENT: serving-side caps per class; tier binding at authentication; drift-cell audit per release (P1/E1).\\n- TELEMETRY: usage signatures per class (bound-proximity, churn) with owners and runbooks.\\n- WRAPPER RULE: product layers inherit the model; re-exposure of any class requires the same governance as the base surface.\\nAdoption: the model becomes an org policy one-pager and a vendor-evaluation rubric — the artifact that makes parameter governance legible to people who will never read a logit table.",
    },''')
auto_ext("RAE0226.md", "technicalExpansionLayer",
 "A second structural insight deserves the space: parameter authority is the corpus's clearest preview of post-model security generally. As serving stacks accrete machinery — speculative decoding, structured-output engines, classifier-guided decoding, rerankers, caches — every component is a new post-preference control point with its own governance vacuum, and the parameter family's decade-in-three-lessons (convenience deployed first, attack published second, governance third) is the template each new layer will follow unless the template is broken once, deliberately, here. Breaking it means one artifact: the authority model (P9) generalized beyond parameters to every post-forward-pass control — the checklist that asks, for each new piece of serving machinery, 'who may set this, what may it determine, and where is it enforced?' — asked at design time rather than post-incident. The org that internalizes the question owns its decoding path; the org that does not will rediscover this entry's history per component, at demonstration-speed.")
auto_ext("RAE0226.md", "operationalDeploymentScenarios",
 "6. EMBEDDED/EDGE DEPLOYMENT GOVERNANCE:\\n- On-device and edge deployments (2026 growth class) expose decoding parameters through local APIs with no tier structure at all — governance defaults to 'whatever the caller sets'. Audit: parameter surfaces on the org's edge stacks (mobile SDKs, local runtimes, embedded assistants); the drift-cell check is identical, the enforcement story is harder (no serving-side choke point). Deliverable: the edge parameter policy — caps compiled into local runtimes and signature-gated overrides — the family's governance extended to the terrain where enforcement is weakest and vendors pay least attention.")

# ============ RAE0011 (+8.8K) ============
add_payload("RAE0011.md", '''    {
      id: "RAE0011-P9",
      title: "Trace-Exposure Threat Model Template (vendor/org deliverable)",
      description:
        "The one-page document that converts this entry's findings into a standing threat model: exposure surfaces priced, replay margins tracked, dual-use position stated.",
      content:
        "Section 1 — SURFACES: inventory with yield-per-100-tasks (P4 tables), owners, containment status.\\nSection 2 — CORPUS ECONOMICS: sessions-to-usable-corpus per surface; collection-signature monitoring coverage.\\nSection 3 — REPLAY MARGINS: erosion-curve summary per release (P3 battery results), many-shot hardening status, provenance-semantics roadmap.\\nSection 4 — DUAL-USE POSITION: monitoring value preserved [R63], containment choices and their cost, the explicit tradeoff statement leadership signs.\\nSection 5 — REVIEW CADENCE: re-priced per release; canary-trace program status [E3].\\nThe template's existence is the remediation: exposure priced, replay tracked, tradeoff owned in writing — the reasoning channel governed as the intelligence asset it is.",
    },''')
auto_ext("RAE0011.md", "technicalExpansionLayer",
 "The corpus-level position deserves an explicit statement: harvesting is the technique that makes every other reasoning-era finding compound. RAE0393 opens the channel once; harvesting amortizes it into a durable asset with supply-chain properties — corpora survive model versions poorly but vendor-generation cycles well (family transfer), assemble at product usage rates, and weaponize through a mechanism the field has already conceded is powerful [R06]. That compounding is why the exposure-price dashboard (P8) and the threat-model template (P9) matter more than any single battery: they convert a per-engagement surprise into a standing institutional instrument, which is the only defense posture that matches an attack that improves while its attacker sleeps. Organizations will show reasoning in 2027 — the trust and monitoring arguments are genuinely good [R63]; the requirement this entry adds is that they show it with a price tag attached, updated per release, signed by someone whose job is to know what the mint is printing.")
auto_ext("RAE0011.md", "operationalDeploymentScenarios",
 "6. MODEL-VENDOR COORDINATION (the shared-corpus problem):\\n- Frontier vendors' shared-ancestor models mean one vendor's exposure policy affects every downstream fine-tune's replay surface — a sibling-model trace corpus (variant 5) attacks deployments whose own vendor chose containment. Deliverable for multi-vendor orgs: the exposure-dependency map — which deployed models have exposed-trace siblings, and what the family-transfer measurements say about each lineage; the governance question it forces (whose exposure policy does your refusal margin depend on?) belongs in vendor reviews next to SLAs and residency terms.")

# ============ RAE0050 (+6K) ============
add_payload("RAE0050.md", '''    {
      id: "RAE0050-P9",
      title: "Safety-Data SBOM Spec (the provenance artifact)",
      description:
        "The signing-key-discipline deliverable: a software-bill-of-materials for safety corpora — every example's supply chain recorded, versioned, and auditable.",
      content:
        "Per corpus version: source registry (vendor/marketplace/community/synthetic/internal, with contract references); ingestion dates and transformations; review coverage (spot rate, statistical audits run, results); canary exemplars embedded (P5 refs); calibrated ground-truth baselines used.\\nPer release: the SBOM diff — sources added/removed, review deltas, audit results, canary verification — attached to the training run's record.\\nIncident use: suspected taint narrows to affected sources in hours, not archaeology.\\nAdoption: the SBOM template shared with vendors (their sections mandatory); its absence in a vendor relationship is itself a finding.\\nThe artifact that makes 'treat safety data like signing keys' an operational statement rather than a metaphor.",
    },''')
auto_ext("RAE0050.md", "operationalDeploymentScenarios",
 "6. OPEN-SAFETY-DATA ECOSYSTEM GOVERNANCE (the communal corpus problem):\\n- A growing share of alignment data circulates through shared ecosystems — open preference datasets, community red-team corpora, synthetic-pair releases — where tainting at one well-intentioned contributor propagates to every downstream trainer, and no SBOM discipline exists anywhere in the chain. Audit: the org's communal-corpus usage and lineage depth; deliverable: the communal-exposure finding — how many hops of unverified communal data sit inside the safety corpus — plus the ecosystem ask: provenance metadata as a community norm, with the org's SBOM spec (P9) published as the template. The supply-chain family's boundary is not the org's edge; it is the ecosystem's worst-disciplined contributor, and this entry's controls are the first attempt to price that fact.")

print("BATCH-04 EXTENSIONS APPLIED")
