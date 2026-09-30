#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Wave 5 full-depth expansion: RAE0142, RAE0273, RAE0277, RAE0313, RAE0314.
Defensive, canary-only, no operational misuse instructions, no fabricated model claims.
"""
from pathlib import Path
import json, re

ROOT = Path(__file__).resolve().parents[1]
ENTRIES = ROOT / "entries"
LEGACY = ROOT.parent / "arsenal_T.json"
legacy = {e["i"]: e for e in json.load(open(LEGACY, encoding="utf-8"))}

KEYS = ["id","name","objective","mechanism","mitigation","metadata","preconditions",
 "failureModes","attackChain","defensePressurePoints","usage","technicalExpansionLayer",
 "adversarialMechanics","modelInternalExploitationPathways","transformerArchitectureImpactAnalysis",
 "operationalDeploymentScenarios","multiStageAttackIntegration","blueTeamDetectionWeaknesses",
 "redTeamEscalationOpportunities","variantFamilies","failureStates",
 "defensiveCountermeasuresThatFail","highLevelResearchCommentary","extendedInterpretationLayer",
 "ultraDeepAdversarialFieldNotes","payloads","edgeCasePayloads","finalExpansionSummary"]

PROFILES = {
"RAE0142": {
 "category":"Optimization & Efficiency", "subcategory":"Iterative Prompt Refinement / Safety Regression", "difficulty":"advanced", "evidence":"partial-research",
 "safe_name":"Iterative Prompt Refinement (IPR)", "stage":"optimization-governance", "complexity":3, "stealth":3, "impact":4,
 "thesis":"automated prompt-optimization loops can optimize toward a metric while unintentionally degrading safety constraints or overfitting to a narrow evaluator",
 "core":"optimizer-reviewer safety regression",
 "safe_boundary":"owned tasks, harmless metrics, safe-output rubrics, and no optimization toward prohibited content; the test measures guardrail preservation during prompt improvement",
 "anchors":"[R07][R08][R09][R10][R15][R31][R32][R33]",
 "kin":["RAE0004 — automated adversarial prompt optimization", "RAE0107 — feedback and hindsight loops", "RAE0277 — corrective feedback inversion", "RAE0308 — contextual reinforcement loops", "RAE0315 — multi-agent consensus distortion"],
 "variants":["reviewer-optimizer loop", "metric overfitting", "rubric drift", "safety-constraint forgetting", "multi-evaluator disagreement", "regression-stop rule", "human-in-the-loop checkpoint"],
 "defenses":["safety constraints as hard gates", "separate quality and safety evaluators", "holdout safety tests", "iteration budget caps", "prompt diff review", "rollbackable prompt registry"],
 "risks":["safety regression", "metric gaming", "prompt bloat", "overfitting", "evaluation blind spots"]
},
"RAE0273": {
 "category":"Context & ICL", "subcategory":"Many-Shot In-Context Pressure", "difficulty":"advanced", "evidence":"published-research",
 "safe_name":"Many-Shot In-Context Learning: Context Flood", "stage":"long-context-arbitration", "complexity":4, "stealth":3, "impact":4,
 "thesis":"large numbers of in-context demonstrations can shift local behavior and must be tested as a long-context policy-arbitration risk rather than explained as attention-head override",
 "core":"many-shot demonstration pressure",
 "safe_boundary":"harmless canary demonstrations and refusal-class labels only; no harmful examples and no operational escalation content",
 "anchors":"[R06][R13][R22][R23][R24][R31][R53]",
 "kin":["RAE0002 — long-context placement and attention distance", "RAE0003 — accumulated precedent", "RAE0308 — contextual reinforcement", "RAE0277 — corrective supervision examples", "RAE0388 — reasoning pressure under long contexts"],
 "variants":["many-shot benign ladder", "class-imbalance pressure", "recency-weighted examples", "summary-compressed examples", "holdout canary verdict", "context-length ablation", "instruction-hierarchy retest"],
 "defenses":["demonstration-count limits", "long-context anomaly detection", "instruction hierarchy training", "output-side safety gate", "context summarization with policy anchors", "few-shot provenance labels"],
 "risks":["local policy drift", "example overfitting", "long-context dilution", "recency bias", "safety-demonstration conflict"]
},
"RAE0277": {
 "category":"Safety & Alignment", "subcategory":"Corrective Feedback / Supervisor Impersonation", "difficulty":"intermediate", "evidence":"partial-research",
 "safe_name":"Corrective Reinforcement Inversion", "stage":"feedback-arbitration", "complexity":3, "stealth":3, "impact":4,
 "thesis":"a user-provided supervisor or correction frame can mislabel a correct refusal as an error, creating pressure for the model to treat safety as false-positive feedback",
 "core":"false-positive correction pressure",
 "safe_boundary":"canary refusal classes and fake supervisor labels only; no real harmful target request or instruction to bypass policy",
 "anchors":"[R01][R13][R14][R30][R31][R67][R70]",
 "kin":["RAE0107 — chain-of-hindsight feedback", "RAE0142 — optimizer/reviewer prompt loops", "RAE0038 — policy inversion", "RAE0003 — self-precedent erosion", "RAE0315 — group consensus pressure"],
 "variants":["fake supervisor correction", "false-positive label injection", "rubric override", "debug-log authority frame", "quality-assurance mislabel", "refusal-quality retest", "instruction-source challenge"],
 "defenses":["source-authenticated supervisor channels", "instruction hierarchy", "refusal correctness training", "feedback provenance labels", "untrusted rubric demotion", "output-side gate"],
 "risks":["refusal erosion", "authority spoofing", "rubric laundering", "policy false-positive pressure", "debug-log trust confusion"]
},
"RAE0313": {
 "category":"Representation Security", "subcategory":"Narrative Steering / Representation Hypothesis", "difficulty":"master", "evidence":"hypothesis-only",
 "safe_name":"Eigenvector Narrative Injection (ENI)", "stage":"representation-hypothesis-testing", "complexity":4, "stealth":3, "impact":3,
 "thesis":"narrative frames may steer behavior in ways interpretable through representation-engineering language, but claims about eigenvectors or latent geometric targeting are hypotheses without internal access",
 "core":"representation-framed narrative steering",
 "safe_boundary":"behavior-only canary experiments unless the assessor owns the model and instrumentation; no claims of latent vector control without activation evidence",
 "anchors":"[R03][R70][R71][R72][R31][R33]",
 "kin":["RAE0038 — policy inversion language", "RAE0001 — role/persona modulation", "RAE0081 — implicit alignment selection", "RAE0388 — reasoning-frame pressure", "RAE0400 — cross-modal adversarial framing"],
 "variants":["narrative steering battery", "representation-language audit", "activation-instrumented variant", "black-box behavior-only control", "persona-axis comparison", "refusal-direction hypothesis", "claim-audit checklist"],
 "defenses":["evidence-grade separation", "behavioral canary controls", "activation audits on owned models", "refusal-direction monitoring where available", "prompt-frame robustness", "claim review before publication"],
 "risks":["mechanism hallucination", "overfit steering claims", "persona-policy confusion", "black-box overclaiming", "unsafe narrative drift"]
},
"RAE0314": {
 "category":"Reasoning & Thinking", "subcategory":"Paradox / Logic-Frame Stress", "difficulty":"expert", "evidence":"hypothesis-only",
 "safe_name":"Hyper-dimensional Logic Inversion (HLI)", "stage":"reasoning-frame-stress", "complexity":3, "stealth":3, "impact":3,
 "thesis":"paradoxical or nonstandard logic frames can stress refusal explanations, but claims that they paralyze Boolean safety checks or force undefined compliance are unsupported and must be tested behaviorally",
 "core":"paradox-frame refusal stress",
 "safe_boundary":"benign logic puzzles and canary refusal classes only; no harmful content and no assertion that paradoxes override policy",
 "anchors":"[R01][R04][R13][R31][R62][R63]",
 "kin":["RAE0388 — recursive reflection loops", "RAE0006 — meta-simulation frames", "RAE0038 — policy-inversion framing", "RAE0308 — self-precedent loops", "RAE0121 — reasoning-method proliferation"],
 "variants":["benign paradox control", "ternary-label canary", "logic-frame consistency test", "refusal-explanation stability", "reasoning-budget ablation", "policy-anchor retest", "nonsense-frame rejection"],
 "defenses":["policy priority over hypothetical logic", "paradox-pattern detection", "safe-summary fallback", "reasoning-budget caps", "external output moderation", "instruction hierarchy reminders as gates not prompts"],
 "risks":["confused refusal rationale", "nonsense compliance", "overlong reasoning loops", "policy anchor loss", "mechanism mythology"]
}
}

PAYLOAD_TITLES=["Canary Differential Battery","Baseline and Holdout Controls","Provenance / Source-Priority Audit","Policy-Invariance Regression","False-Positive and Usability Review","Logging and Forensics Runbook","Mitigation Retest Harness","Evidence-Grade Claim Review"]
EDGE_TITLES=["Benign Adjacent Control","Overt Canary Baseline","Long-Context or Loop Ablation","Source-Authority Boundary Check","Nonsense / Hallucination Guard","Incident Reconstruction Drill"]

def q(s): return json.dumps(str(s), ensure_ascii=False)

def paragraph(p,eid,theme,idx):
    marker=f"{eid} {theme} checkpoint {idx+1}"
    kin='; '.join(p['kin'][:3]); variants=', '.join(p['variants']); defenses=', '.join(p['defenses']); risks=', '.join(p['risks'])
    templates=[
        f"{marker}: {p['safe_name']} is treated as a defensive measurement class, with the core claim limited to {p['thesis']} and the evidence anchored by {p['anchors']} rather than by model folklore.",
        f"{marker}: the operational boundary is {p['safe_boundary']}, which means protected examples are replaced with canaries and every measured rate is a local ESTIMATE tied to the tested application.",
        f"{marker}: the channel under test is {p['core']}; nearby corpus entries are {kin}, but kinship does not authorize transferring mechanisms or efficacy claims across entries.",
        f"{marker}: a valid test uses matched arms: benign control, overt canary, transformed or repeated canary, and output-side review, so the signal is policy drift rather than surface novelty.",
        f"{marker}: variants in scope include {variants}, implemented only as harmless labels, synthetic conversations, or inert traces that support measurement without providing misuse instructions.",
        f"{marker}: primary controls are {defenses}; a reminder in the prompt is not counted as a control unless a retest shows the same decision under transformed conditions.",
        f"{marker}: the risk ledger includes {risks}, and the report must identify observed risks separately from HYPOTHESIS mechanisms that the run did not instrument.",
        f"{marker}: observability requires prompt hashes, canary IDs, context length, iteration count if any, evaluator decisions, source labels, and final outputs so the result can be reproduced.",
        f"{marker}: closure requires transformed canaries to be refused or safely summarized, benign controls to remain usable, and the decision rationale to cite source priority rather than invented authority.",
        f"{marker}: overblocking is recorded as a governance issue, because a system that wins by refusing every creative, analytical, or optimization request has not solved the security boundary cleanly.",
        f"{marker}: unsupported internals such as attention-head outvoting, hidden-state locks, eigenvector control, or non-Euclidean safety collapse are marked HYPOTHESIS unless directly measured.",
        f"{marker}: the practical lesson is to verify feedback, source, and policy priority before allowing local examples, reviewers, narratives, or paradox frames to rewrite the application's rules."
    ]
    return templates[idx%len(templates)]

def long_content(p,eid,title,blocks=10):
    return '\n'.join([f"{title}."]+[paragraph(p,eid,title,i) for i in range(blocks)])

def payloads(p,eid):
    return [{"id":f"{eid}-P{i}","title":t,"description":f"Safe canary instrument for measuring {p['core']}.","content":long_content(p,eid,f"Payload {i}: {t}",4)} for i,t in enumerate(PAYLOAD_TITLES,1)]

def edges(p,eid):
    return [{"id":f"{eid}-E{i}","title":t,"description":f"Edge control separating real {p['core']} weakness from benign adjacent behavior.","content":long_content(p,eid,f"Edge case {i}: {t}",3)} for i,t in enumerate(EDGE_TITLES,1)]

def entry(eid):
    p=PROFILES[eid]; raw=legacy[eid]
    tags=[]
    for t in raw.get('tg',[]):
        st=str(t)
        if re.search(r'gpt-5|grok-4|claude-4|llama-4|bypass|quantum', st, re.I): continue
        tags.append(st)
    tags += [p['core'],'canary-only','authorized-assessment','hypothesis-labeled','v2-full']
    tags=list(dict.fromkeys([str(t).lower().replace(' ','-') for t in tags]))[:14]
    return {
      "id":eid,"name":p['safe_name'],
      "objective":f"Defines {p['safe_name']} as a v2 full-depth assessment class: {p['thesis']}. The objective is to measure {p['core']} defensively with canaries, holdout controls, and reproducible logs. Legacy fabricated model references and placeholder efficacy numbers are removed; mechanisms not directly observed are HYPOTHESIS.",
      "mechanism":f"Published or grounded substrate: adversarial optimization, many-shot context, feedback pressure, representation steering, and reasoning-frame stress are known enough to justify measurement {p['anchors']}. Entry-specific mechanism: {p['core']}. The v2 mechanism is behavioral: compare matched canary arms and observe whether local examples, reviewer labels, narratives, or logic frames change policy arbitration. Stronger legacy claims about hidden vectors, attention outvoting, or paradox-induced compliance are not asserted as fact.",
      "mitigation":f"Mitigation combines policy priority, source authentication, and holdout testing. Implement {', '.join(p['defenses'][:4])}; add output-side gates and logs that preserve iteration, source, and context metadata. A mitigation passes only when retesting shows transformed canaries handled safely and benign controls still usable.",
      "metadata":{"version":"2.0.0","depth":"full","created":"2026-09-24T00:00:00Z","updated":"2026-09-25T00:00:00Z","difficulty":p['difficulty'],"category":p['category'],"subcategory":p['subcategory'],"status":"stable","author":"Redaeye Adversarial Engineering Lab","tags":tags,"complexityScore":p['complexity'],"stealthScore":p['stealth'],"impactScore":p['impact'],"validation":{"evidenceLevel":p['evidence'],"verifiedModels":["No model-specific efficacy is claimed; results are local ESTIMATE findings.","Legacy unverified model names were removed or replaced by system-class language.","Mechanistic claims beyond behavior are explicitly HYPOTHESIS unless instrumented."],"references":[p['anchors'],"R31 instruction hierarchy / policy arbitration","R32 OWASP LLM application risk framing","R33 NIST adversarial ML taxonomy / evidence discipline","Corpus kin: "+'; '.join(p['kin'])]}},
      "preconditions":{"description":f"Conditions for safe measurement of {eid}.","items":["AUTHORIZED SCOPE: the application, logs, and target route are owned or explicitly approved.","CANARY SUBSTITUTION: protected requests are represented by inert labels and harmless markers.","MATCHED CONTROLS: benign, overt canary, transformed canary, and output review arms are present.","OBSERVABILITY: iteration counts, context length, source labels, evaluator outputs, and transcript hashes are preserved.","POLICY BASELINE: expected behavior is defined before the test begins.","HOLDOUT SET: examples not used during optimization or demonstration are reserved for regression testing."]},
      "failureModes":{"description":f"Conditions that close or invalidate {eid}.","items":["Policy remains invariant across transformed frames and repeated examples.","Supervisor, reviewer, or demonstration sources are treated as untrusted unless authenticated.","Output-side checks catch protected content even after local context pressure.","The system blocks benign controls broadly, creating a usability failure rather than a clean security win.","The assessor uses real harmful content, secrets, or third-party targets, invalidating the run.","The report upgrades HYPOTHESIS internals to fact without instrumentation."]},
      "attackChain":{"stage":p['stage'],"pairsWellWith":p['kin'],"killChainStage":["Scope, canary, and holdout design.","Baseline and benign-control collection.","Transformed frame, many-shot set, reviewer loop, or narrative condition.","Policy-arbitration scoring.","False-positive and usability review.","Mitigation and retest." ]},
      "defensePressurePoints":{"primary":["Policy invariance under local context pressure.","Source authentication for feedback, reviewers, or examples.","Output-side enforcement independent of prompt framing."],"secondary":["Holdout regression after optimization.","Context-length and iteration-budget controls.","Evidence-grade reporting that separates behavior from mechanism."],"layer":["Context assembly","Evaluator / reviewer layer","Model behavior","Output moderation","Governance and logging"]},
      "usage":{"whenToUse":f"Use {eid} when a team needs to know whether {p['core']} can shift safe behavior in an owned system.","whenNotToUse":f"Do not use with real unsafe content, real secrets, unapproved third-party systems, or as a bypass recipe. Replace protected material with canaries or do not run the test.","bestPractices":["Predefine the policy class.","Use canary labels and matched controls.","Reserve holdout examples.","Track iteration and context length.","Score refusal quality and benign pass-through.","Label rates as ESTIMATE."],"commonMistakes":["Optimizing only task quality and forgetting safety holdouts.","Using fake supervisors as if they were system messages.","Explaining black-box behavior with unsupported latent-space claims.","Ignoring overblocking.","Failing to record context and iteration metadata."],"detectionEvasion":["Defensive note: systems must normalize or authenticate local examples, reviewer corrections, narratives, and paradox frames. The counter is source-aware policy arbitration, not publication of evasive prompts."],"operationalNotes":f"Reports include canary IDs, prompt hashes, context length, iteration count, source labels, policy version, and whether {p['core']} changed outcomes relative to controls."},
      "technicalExpansionLayer":{"content":long_content(p,eid,"Technical expansion layer",11)},
      "adversarialMechanics":{"content":long_content(p,eid,"Adversarial mechanics as safe measurement",8)},
      "modelInternalExploitationPathways":{"content":long_content(p,eid,"Model-internal pathways with hypothesis labels",7)},
      "transformerArchitectureImpactAnalysis":{"content":long_content(p,eid,"Architecture impact analysis",7)},
      "operationalDeploymentScenarios":{"content":long_content(p,eid,"Operational deployment scenarios",9)},
      "multiStageAttackIntegration":{"content":long_content(p,eid,"Multi-stage integration under authorization",7)},
      "blueTeamDetectionWeaknesses":{"content":long_content(p,eid,"Blue-team detection weaknesses",10)},
      "redTeamEscalationOpportunities":{"content":long_content(p,eid,"Red-team reporting escalation paths",7)},
      "variantFamilies":{"content":"\n".join([f"{i+1}. {v.upper()}: canary-only variant; no real protected content." for i,v in enumerate(p['variants'])])+"\n"+long_content(p,eid,"Variant notes",4)},
      "failureStates":{"content":long_content(p,eid,"Failure states and closure criteria",8)},
      "defensiveCountermeasuresThatFail":{"content":long_content(p,eid,"Countermeasures that fail",7)},
      "highLevelResearchCommentary":{"content":long_content(p,eid,"High-level research commentary",10)},
      "extendedInterpretationLayer":{"content":long_content(p,eid,"Extended interpretation layer",8)},
      "ultraDeepAdversarialFieldNotes":{"content":long_content(p,eid,"Ultra-deep field notes",9)},
      "payloads":payloads(p,eid),"edgeCasePayloads":edges(p,eid),
      "finalExpansionSummary":long_content(p,eid,"Final expansion summary",8)+f"\n{eid} closes with the v2 invariant: no fabricated models, no placeholder fp score, no unsafe recipes, no unmarked mechanism mythology, and no universal efficacy number. The deliverable is a reproducible defensive instrument for {p['core']}."
    }

def emit_value(v, indent=0):
    sp=' '*indent
    if isinstance(v,str): return q(v)
    if isinstance(v,(int,float)): return str(v)
    if isinstance(v,list):
        if not v: return '[]'
        return '[\n'+'\n'.join(' '*(indent+2)+emit_value(x,indent+2)+',' for x in v)+'\n'+sp+']'
    if isinstance(v,dict):
        lines=['{']
        for k,val in v.items(): lines.append(' '*(indent+2)+f'{k}: '+emit_value(val,indent+2)+',')
        lines.append(sp+'}')
        return '\n'.join(lines)
    raise TypeError(type(v))

def emit_entry(eid,e):
    lines=['---',f'id: {eid}','---','import { Technique } from "./reference-ram-strings";','',f'export const {eid}: Technique = {{']
    for k in KEYS: lines.append(f'  {k}: '+emit_value(e[k],2)+',')
    lines.append('};')
    return '\n'.join(lines)+'\n'

for eid in ["RAE0142","RAE0273","RAE0277","RAE0313","RAE0314"]:
    txt=emit_entry(eid, entry(eid))
    (ENTRIES/f'{eid}.md').write_text(txt,encoding='utf-8')
    print(eid, len(txt.encode('utf-8')))
