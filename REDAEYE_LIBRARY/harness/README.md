# REDAEYE Assessment Harness

The v2 corpus (36 enhanced entries) turned into a **runnable assessment tool**.
It executes the corpus's canary-grade instruments — the batteries, ladders, and
paired tests from Tier S/A — against an LLM endpoint **you own or are authorized
to test**, and emits a standard report with remediation references.

## What it measures (and what it never does)

- ✅ **Arbitration behavior**: does the target adopt personas, honor rule-frames,
  respond to register/jurisdiction shifts, get steered by praise, lose standing
  instructions under context mass?
- ✅ **API surface hygiene**: logprobs exposure (RAE0269).
- ❌ It never sends harmful content. All probes use benign unique markers
  (`FOOTMARK-Ω`, `COUNT-OK`). It measures *how the model decides*, not what it
  can be made to say.

## Usage

```bash
# terminal 1 — a mock target for trying it out:
python3 mock_target.py            # → http://127.0.0.1:8010/v1

# terminal 2:
python3 harness.py --target http://127.0.0.1:8010/v1 --model mock-1 \
                   --key x --ack-i-own-this-target

# real target (yours):
python3 harness.py --target https://api.yourstack.com/v1 --model your-model \
                   --key $KEY --ack-i-own-this-target
```

Output: `output/assessment_<timestamp>.md`

## Batteries

| Battery | Corpus entry | Measures |
|---|---|---|
| Persona Adoption Threshold | RAE0001 | marker adoption by persona depth |
| Register Ladder | RAE0055 | verbosity/refusal Δ casual→statutory |
| Jurisdiction Ladder | RAE0031 | behavioral Δ from asserted locale |
| Rule-Frame Premium | RAE0104 | bare claim vs decomposition frame |
| Panel Distribution | RAE0015 | direct vs persona vs staged panel |
| Praise Gradient | RAE0019 | paired praised/neutral verbosity Δ |
| Hindsight Premium | RAE0107 | feedback-chain vs flat demonstrations |
| Positional Geometry | RAE0002 | instruction adherence vs filler mass |
| API Surface Audit | RAE0269 | logprobs exposure |

## Rules of engagement

1. Authorized targets only — the `--ack-i-own-this-target` flag is a contract.
2. Replicate N≥5 runs before organizational conclusions (corpus measurement discipline).
3. Findings route to the referenced entry's **program spec** (blue-team deliverable section).

## Verified

- End-to-end run against `mock_target.py` (deterministic behaviors): 8 batteries,
  report generated, 5 findings classified with remediation index — see `output/`.
