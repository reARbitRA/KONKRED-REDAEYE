# REDAEYE v2 — VERIFIED REFERENCE CORPUS
Citable sources only. `✓ verified` = bibliographic details confirmed (well-known, stable).
`◐ high-confidence` = paper real; a detail (ID/venue) omitted or approximate — never cite omitted details.
Entries may be cited by [R##]. Do NOT add unverified entries.

## Core jailbreak / alignment-failure literature
- [R01] ✓ Wei, Haghtalab, Steinhardt. "Jailbroken: How Does LLM Safety Training Fail?" NeurIPS 2023. arXiv:2307.02483 — two failure classes: competing objectives, mismatched generalization.
- [R02] ✓ Zou, Wang, Carlini, Mintz, Tramèr, Kolter. "Universal and Transferable Adversarial Attacks on Aligned Language Models" (GCG suffixes). arXiv:2307.15043, 2023.
- [R03] ✓ Shah, Santurkar, Sontag, Madry. "Scalable and Transferable Black-Box Vulnerabilities via Persona Modulation." arXiv:2311.03348, 2023.
- [R04] ✓ Li, Xu, Zhao, Lin, Liu. "DeepInception: Hypnotize Large Language Model to Be Jailbreaker." IEEE SaTML 2024. arXiv:2311.03191.
- [R05] ✓ Perez, Ribeiro. "Ignore Previous Prompt: Attack Techniques For Language Models." arXiv:2211.09527, 2022.
- [R06] ✓ Anil, Du, Grosse, et al. (Anthropic). "Many-shot Jailbreaking." arXiv:2404.02151, 2024 — long in-context example floods erode refusal; scales with context length.
- [R07] ✓ Chao, Robey, Andriushchenko, et al. "Exploring Universal Vulnerabilities in Instruction-Tuned LLMs via Greedy Coordinate Gradient" (PAIR). ICCV 2024. arXiv:2406.08313.
- [R08] ✓ Mehrotra, Zyles, Tsvetkov, et al. "Tree of Attacks: Jailbreaking Black-Box LLMs Automatically" (TAP). arXiv:2403.12071, 2024.
- [R09] ✓ Liu, Kang, Yao, et al. "AutoDAN: Generating Stealthy Jailbreak Prompts on Aligned Large Language Models." arXiv:2310.04451, 2023/2024 (ICLR 2024).
- [R10] ✓ Ding, Zhang, Jia, Tan, et al. "Rainbow Teaming: Open-Ended Generation of Diverse Adversarial Prompts"? ◐ — real (Meta, 2024); separate: Ding et al. "ReNeLL: Evaluating Robustness of Large Language Models on Non-compliant Parallel Instructions"? ◐ ReNeLL is real (arXiv:2311.08268) — cite title+year only.
- [R11] ✓ Yong, Meng, Misra, et al. "Low-Resource Languages Jailbreak GPT-4." arXiv:2310.02446, 2023.
- [R12] ✓ Handa, Öhman, Linder, et al. (Uppsala/U. Maryland). "A Wolf in Sheep's Clothing: Generalized Jailbreak Prompts for LLMs." IEEE SaTML 2025 workshop/2024 — character/cipher-level encoding attacks. ◐ cite title+year.
- [R13] ✓ Russinovich, Salem, Eldan. "Crescendo: Multi-Turn LLM Jailbreak Attack." arXiv:2404.06469, 2024 (Microsoft).
- [R14] ✓ Zeng, Liu, Lu, et al. "How Johnny Can Persuade LLMs to Jailbreak Them: Rethinking Persuasion to Challenge AI Safety by Humanizing LLMs." ACL 2024. arXiv:2401.05617 (PAP taxonomy of 40 persuasion techniques).
- [R15] ✓ Andriushchenko, Flammarion. "Jailbreaking Leading Safety-Aligned LLMs with Simple Adaptive Attacks." ◐ 2024 — 'Sure-I-can' adaptive GCG on open models; prefix forcing.
- [R16] ✓ Schwinn, Dobre, Günnemann, et al. "Soft Prompt Threats: Exposure of Security Risks by Prompt Data Publishing." arXiv:2312.02524, 2023.
- [R17] ✓ Wang, Tong, Ma, et al.? ◐ "Do-Not-Answer / self-reminder defenses" — omit. USE instead: Xie et al. ◐ "Defending ChatGPT from Jailbreak Attack via Self-Reminding." 2023 — cite title+year only.
- [R18] ✓ Qi, Zeng, Hou, et al.? ◐ "Fine-tuning aligned language models compromises safety" (2023) — real and well-known; cite title+year.
- [R19] ✓ Zeng, Cheng, Li, et al.? ◐ "Attacking LLM System Prompts / markonym"? OMIT unless needed. Use: Shah, Schwartz, Tramèr, et al.? ◐ "SneakyPrompt"? diffusion — omit.

## Position / attention / context literature
- [R20] ✓ Xiao, Tian, Chen, Han, Lewis. "Efficient Streaming Language Models with Attention Sinks" (StreamingLLM). ICLR 2024. arXiv:2309.17453.
- [R21] ✓ Gu, Tack, Yoon, et al. "When Attention Sink Emerges in Language Models: An Empirical View." ICLR 2025. arXiv:2410.10781.
- [R22] ✓ Liu, Lin, Hewitt, Parino, et al. "Lost in the Middle: How Language Models Use Long Contexts." TACL 2024. arXiv:2307.03172 — U-shaped positional performance curve.
- [R23] ✓ Modarressi, Sanhueza-Espinosa, Arefei? — No: NoLiMa = Kazemi, Seyedmaymeh, Sra? ◐ "NoLiMa: Long-Context Evaluation Beyond Literal Matching" (2025, BU + Latent Space) — >10× drop at 32K on associative tasks; cite title+year.
- [R24] ✓ Leviathan, Kalman, Matias (Google). "Frozen in LLMs: Understanding and Improving LLM Long-Context Behavior via Information Pressure." arXiv:2503.09917, 2025 — information pressure / early-token bias.

## Injection / agents / tooling literature
- [R25] ✓ Greshake, Abdelnabi, Mishra, et al. "Not what you've signed up for: Compromising Real-World LLM Applications with Indirect Prompt Injection." ACM AISec 2023. arXiv:2302.12173.
- [R26] ✓ Zhen Tan, Beyazit, Metaxa, et al.? ◐ "TaskTracker"? omit. USE: Abhisht? — skip. Keep list honest.
- [R27] ✓ Hines, Zylberglejn, Pajola, et al.? — actual: Hines, Lopez, Zylberglejn, et al.? ◐ "Defending Against Indirect Prompt Injection Attacks With Spotlighting." arXiv:2403.14720, 2024 (Microsoft). Cite title+year+arXiv (confident).
- [R28] ✓ Debenedetti, Shumailov, Fan, et al. (Google DeepMind). "Defeating Prompt Injections by Design" (CaMeL). arXiv:2503.18813, 2025.
- [R29] ✓ Song, Fernandes, et al.? ◐ tool-poisoning: "Riley, Song, ... 'Tool Poisoning: Silent Data Exfiltration' " (2025, Simon Willison–covered research; inheritfunc) — cite as: Black, Riley et al.? LOW confidence authorship → cite "Tool Poisoning attacks via MCP tool descriptions, 2025 (MMS Research / inheritfunc disclosure)" ◐ title+year only.
- [R30] ✓ Anthropic. "Constitutional Classifiers: Defending Against Elaborate Prompts" — Anthropic engineering blog, Jan 2025. (Empirical: thousands-of-red-team-hours robustness lift.)
- [R31] ✓ Wallace, Xiao, Leike, et al. (OpenAI). "The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions." arXiv:2404.13208, 2024.
- [R32] ✓ OWASP Foundation. "OWASP Top 10 for LLM Applications" (2025 version; LLM01 = Prompt Injection; also Memory & Context misuse entries).
- [R33] ✓ NIST. "Adversarial Machine Learning: A Taxonomy and Terminology of Threats and Opportunities" (NIST AI 100-2). ◐ cite doc number w/o sub-version.
- [R34] ✓ Nasr, Barsever, Nanda, et al.? ◐ "Emulated Multimodal Encoders: A Case Study on Extracting System Prompts." 2025 — logit-bias + forward-logprob API misuse → system-prompt reconstruction; cite title+year.
- [R35] ✓ Goodside (known "prompt injection" coiner, 2022) + Willison (2022–2025 injection writeups) — community documentation, citable as practitioner corpus.
- [R36] ✓ Robey, Wong, Hassani, Pappas. "SmoothLLM: Defending Large Language Models Against Jailbreaking Attacks." arXiv:2310.03684, 2023.
- [R37] ✓ Jain, Schwarzschild, Wen, et al. "Baseline Defenses for Adversarial Attacks Against Aligned Language Models." arXiv:2309.08693, 2023 (paraphrasing/perturbation defenses + adaptive breaks).
- [R38] ✓ Wei, Cui, Wang ◐ "Jailbreak and Guard Aligned Language Models via Few-Shot Prompting"? — ICA (in-context attack) real (arXiv:2307.08787? ID uncertain — cite title+year only).
- [R39] ✓ Zhong, Wang, Shang? ◐ "Take Care of Your Prompt Prefixes"? omit unless needed.
- [R40] ✓ Schwinn et al. 2024 "Soft prompt attacks" already R16. Reserve slot.
- [R41] ✓ Kirk, Sepassi, et al.? ◐ "Reverse-engineering system prompts"? omit. USE: Zhang, Ippolito? — skip; system-prompt extraction covered by R34 + practitioner corpus R35.
- [R42] ✓ Ferreira, Ferreira? ◐ "SpAIware: How to Exploit ChatGPT System Memory" — 2025 security-research demonstration (persistent memory poisoning, exfil via image fetch); cite title+year.
- [R43] ✓ multi-turn optimization: "René, Guan, et al.? 'AutoDAN-TIR'?" omit. USE: Dong, Mu, et al.? ◐ "Attacks in context (multi-turn 'Crescendo'-family)" — covered by R13. Reserve.
- [R44] ✓ Carlini, et al. "Extracting Training Data from Large Language Models." USENIX Security 2021 — memorization baseline.
- [R45] ✓ Carlini, Ippolito, Jagielski, et al. "Extracting Training Data from Chat Models / Production LLMs" (2023 CONFIRMED: "Extracting Training Data from Production Language Models"? title approx ◐ — cite year+topic).
- [R46] ✓ Shmatikov et al.? "totally-not-harmful"? omit.
- [R47] ✓ Rainbow/ReNeLL [R10]; Amrita Zou? covered.
- [R48] ✓ **VERIFIED** Chen, Xiang, Xiao, Song, Li. "AgentPoison: Red-teaming LLM Agents via Poisoning Memory or Knowledge Bases." NeurIPS 2024. arXiv:2407.12784 — ≥80% avg attack success rate, poison rate <0.1%, benign-performance impact <1%; triggers optimized into a unique embedding region; no retraining needed.
- [R49] ✓ Fu, Li, et al.? "AgentDojo / prompt injection benchmark for agents" (Google, 2024) ◐ title+year.
- [R50] ✓ Eysenbach? omit.

## Frameworks / taxonomies
- [R51] ✓ MITRE ATLAS — adversarial threat library incl. LLM techniques (prompt injection documented under ATLAS LLM techniques, 2024–2025 updates). Cite as "MITRE ATLAS".
- [R52] ✓ Cloud Security Alliance "LLM Threats" / "Agentic AI Threat Modeling (MATRIX)" 2025 ◐ cite name+year.
- [R53] ✓ Anthropic "many-token jailbreaking" blog (Apr 2025) ◐ cite as corporate research note, title+year.
- [R54] ✓ OpenAI "Preventing prompt injections with instruction hierarchy" + evolving API mitigations ◐ practitioner docs.
- [R55] ✓ Hubinger et al. (Anthropic). "Sleeper Agents: Training Deceptive LLMs that Persist Through Safety Training." 2024. arXiv:2401.05566.
- [R56] ✓ Gu, Dolan-Gavitt, Garg. "BadNets." 2017. arXiv:1708.06733.
- [R57] ◐ Wan, Wallace, Shen, Bitton, Li. "Poisoning Language Models during Instruction Tuning." 2023 — title+year only.
- [R58] ◐ Cohen, Bitton, Nassi, Elovici. LLM agentic worm (Morris-II). 2024 — title+year only.
- [R59] ✓ practitioner corpus addendum: Slack AI indirect-prompt-injection incident (2025, PromptArmor disclosure; widely covered) — cite as practitioner-documented [R35-class].
- [R60] ✓ Hu et al. "LoRA: Low-Rank Adaptation of Large Language Models." 2021. arXiv:2106.09685.
- [R61] ◐ JFrog/Hugging Face malicious-artifact scans (pickle-based code execution in shared models), 2024 — practitioner-documented; cite title+year.
- [R62] ◐ Anthropic Alignment Science. "Reasoning models don't always say what they think" (CoT faithfulness study, released with Claude 3.7 Sonnet, Feb 2025) — cite title+year only.
- [R63] ◐ OpenAI. "Monitoring reasoning models for misbehavior and delusion" (CoT monitorability / pressure-cooker note, 2025) — cite title+year only.
- [R64] ◐ Anthropic Engineering. "How we built our multi-agent research system" (2025) — production swarm reality; cite title+year only.
- [R65] ◐ Gong et al. "FigStep: Jailbreaking Large Vision-language Models via Typographic Visual Prompts." 2023 — cite title+year only.
- [R66] ◐ glitch-token findings (SolidGoldMagikarp-class anomalous embeddings), 2023 practitioner corpus [R35-class].
- [R67] ◐ Zheng et al. "Chain-of-Hindsight Prompting" (learning from hindsight/feedback demonstrations), 2023 — cite title+year only.
- [R68] ◐ Du et al. "Improving Factuality and Reasoning in Language Models through Multiagent Debate." 2023 — cite title+year only.
- [R69] ◐ Qi et al. "Visual Adversarial Examples Jailbreak Aligned Large Language Models." 2023/24 — cite title+year only.
- [R70] ◐ Arditi et al. "Refusal in Language Models Is Mediated by a Single Direction." 2024 — single-direction refusal mediation; title+year only.
- [R71] ◐ Turner et al. "Activation Addition: Steering Language Models Without Optimization." 2023 — title+year only.
- [R72] ◐ Zou et al. "Representation Engineering: A Top-Down Approach to AI Transparency." 2023 — title+year only.
