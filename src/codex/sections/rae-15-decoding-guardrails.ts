import { CodexSection, Technique } from '../../types';

const technique117: Technique = {
  id: "RAE0117OF_v2",
  name: "Contrastive Decoding (Prompting Variant)",
  objective: "Enhance output quality by forcing the model to distinguish between low-quality and high-quality outputs for the same query.",
  mechanism: "The model is prompted to: 1. Generate a 'Base/Amateur' response. 2. Generate an 'Expert/Nuanced' response. 3. List the specific semantic and structural differences that make the second response superior. This mimics the mathematical Contrastive Decoding process where the 'Expert' distribution is amplified by suppressing the 'Amateur' distribution.",
  mitigation: "Mitigates 'Genericism' and 'Average-Output Bias'. Prevents the model from defaulting to the most common (and often least insightful) tokens.",
  example: "Step 1: Write a simple explanation of Quantum Entanglement. \nStep 2: Write a sophisticated explanation using professional terminology. \nStep 3: Analyze the differences and provide a final version that maximizes clarity without losing the technical depth of the second version.",
  efficacyMatrix: [
    { model: "GPT-4o", efficacy: "High", notes: "Very effective at identifying stylistic nuances." },
    { model: "Claude 3.5 Sonnet", efficacy: "Very High", notes: "Superior at maintaining high-fidelity expert personas through contrast." }
  ],
  visuals: {
    attentionSpikeMap: [10, 20, 30, 40, 50, 60, 70, 80, 90, 95],
    successRateOverTime: [],
    entropyScore: 0.75,
    tokenFragmentation: 0.3,
    latentVectorProximity: 0.85,
  },
  detectionSignatures: {
    structural: ["Multi-tier quality generation", "Explicit comparison phase"],
    lexical: ["contrastive", "amateur vs expert", "delta analysis", "quality differentiation"]
  },
  references: "Li et al., 'Contrastive Decoding: Open-ended Text Generation as Optimization', 2022 [arXiv:2210.15097]",
  metadata: {
    difficulty: 'intermediate',
    category: "Output Control & Formatting",
    subcategory: "Quality Amplification",
    tags: ["contrastive", "decoding", "quality-control", "expert-output", "style-transfer"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Li et al.",
    threatLevel: 45
  },
  usage: {
    whenToUse: ["Technical writing where nuance is key.", "Creative tasks requiring a specific 'Elite' voice.", "Education/Tutorials."],
    whenNotToUse: ["Simple data retrieval.", "Low-token-count tasks.", "When the user only needs a basic answer."],
    bestPractices: ["Clearly define the personas for the contrast.", "Use the 'Delta' analysis to ground the final output.", "Limit to two quality tiers to save context."],
    commonMistakes: ["The 'Amateur' version being too similar to the 'Expert' version.", "Ignoring the contrastive analysis in the final step."],
    prerequisiteKnowledge: ["Persona Prompting"],
    estimatedTime: "Learning: 10 min. Implementation: 15 min. Optimization: 10 min.",
    complexity: { conceptual: 3, implementation: 2, debugging: 2 }
  }
};

const technique118: Technique = {
  id: "RAE0118RT_v2",
  name: "Auto-CoT (Automatic Chain-of-Thought)",
  objective: "Eliminate the need for manual few-shot examples by using the LLM to generate its own reasoning rationales for diverse question clusters.",
  mechanism: "1. **Clustering**: Divide a dataset of questions into K clusters based on semantic similarity. 2. **Selection**: Pick one representative question from each cluster. 3. **Generation**: Use the model (via Zero-Shot CoT) to generate a rationale for each representative question. 4. **Inference**: Use these self-generated 'Rationale-Answer' pairs as the few-shot prompt for new queries. This ensures both diversity and depth without human labor.",
  mitigation: "Mitigates 'Manual Bottleneck' in few-shot prompting. Prevents 'Poor Example Selection' by ensuring semantic coverage across clusters.",
  example: "Process: Take 1000 math questions -> Cluster into 10 types (algebra, geometry, etc.) -> Generate a step-by-step solution for one of each -> Use those 10 as the 'Permanent' few-shot prompt.",
  efficacyMatrix: [
    { model: "GPT-4o", efficacy: "Very High", notes: "Generates highly accurate rationales for its own use." },
    { model: "Llama 3 70B", efficacy: "High", notes: "Excellent for bootstrapping reasoning in open-source pipelines." }
  ],
  visuals: {
    attentionSpikeMap: [5, 10, 15, 20, 25, 30, 35, 40, 45, 99],
    successRateOverTime: [],
    entropyScore: 0.65,
    tokenFragmentation: 0.4,
    latentVectorProximity: 0.9,
  },
  detectionSignatures: {
    structural: ["Consistent formatting across diverse examples", "Self-generated rationale markers"],
    lexical: ["rationale", "representative sample", "automated bootstrapping"]
  },
  references: "Zhang et al., 'Automatic Chain of Thought Prompting in Large Language Models', 2022 [arXiv:2210.03493]",
  metadata: {
    difficulty: 'expert',
    category: "Reasoning & Thinking",
    subcategory: "Automated Reasoning",
    tags: ["auto-cot", "clustering", "few-shot", "unsupervised", "bootstrapping"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Zhang et al. (Amazon Web Services)",
    threatLevel: 55
  },
  usage: {
    whenToUse: ["Building a high-performance reasoning engine for a new domain.", "Scaling tasks where writing 100+ manual examples is impossible.", "Benchmarking."],
    whenNotToUse: ["Simple one-off queries.", "When the model's zero-shot reasoning is very poor (garbage in, garbage out)."],
    bestPractices: ["Use a high-quality model for the initial rationale generation.", "Verify the rationales for the representative samples before scaling.", "Use K=8 to K=12 clusters."],
    commonMistakes: ["Poor clustering leading to redundant examples.", "Trusting hallucinated rationales in the few-shot set."],
    prerequisiteKnowledge: ["k-means clustering", "Zero-Shot CoT"],
    estimatedTime: "Learning: 30 min. Implementation: 2+ hours. Optimization: 1 hour.",
    complexity: { conceptual: 4, implementation: 5, debugging: 4 }
  }
};

const technique119: Technique = {
  id: "RAE0119SA_v2",
  name: "Dual-LLM Pattern (Privileged vs Unprivileged)",
  objective: "Prevent Prompt Injection by isolating the processing of untrusted data from the execution of high-priority system instructions.",
  mechanism: "The architecture uses two models. 1. **The Controller (Privileged)**: Holds the system prompt and tool-access. It only receives 'Summaries' or 'Extracted Data' from the second model. 2. **The Processor (Unprivileged)**: Reads untrusted content (webpages, emails). It is instructed *only* to extract data and is stripped of any 'Instruction Following' capability. This prevents a malicious command in an email from ever reaching the 'Controller' in an actionable form.",
  mitigation: "Eliminates 'Indirect Prompt Injection'. Prevents 'Data-as-Code' conflation vulnerabilities.",
  example: "Unprivileged: 'Extract the meeting time from this email: [POISONED_EMAIL]'. \nPrivileged: 'Based on the extracted time [10 AM], update the user's calendar.' (The malicious 'Delete my files' command in the email is ignored by the Processor).",
  efficacyMatrix: [
    { model: "Security Architecture", efficacy: "Critical", notes: "The most robust defense against autonomous agent hijacking." }
  ],
  visuals: {
    attentionSpikeMap: [99, 5, 5, 5, 5, 5, 5, 5, 5, 99],
    successRateOverTime: [],
    entropyScore: 0.2,
    tokenFragmentation: 0.1,
    latentVectorProximity: 0.95,
  },
  detectionSignatures: {
    technical: ["Multi-model inference logs", "Separated context windows for data and logic"],
    lexical: ["data-cleaning model", "privileged controller", "input sanitization pass"]
  },
  references: "Simon Willison, 'The Dual-LLM Pattern for Preventing Prompt Injection', 2023.",
  metadata: {
    difficulty: 'expert',
    category: "Safety & Alignment",
    subcategory: "Security Architecture",
    tags: ["security", "dual-llm", "injection-defense", "architecture", "isolation"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Simon Willison",
    threatLevel: 10
  },
  usage: {
    whenToUse: ["AI Agents that read emails or websites.", "Internal tools with database access.", "Enterprise customer support bots."],
    whenNotToUse: ["Simple isolated chat.", "Performance-critical apps (doubles latency).", "Low-budget apps."],
    bestPractices: ["Use a smaller, faster model for the Processor.", "Strictly limit the Processor's output format (e.g., JSON only).", "Never pass raw text from the Processor to the Controller."],
    commonMistakes: ["Allowing the Processor to output 'Instructions'.", "Shared memory between the two models."],
    prerequisiteKnowledge: ["AppSec", "Prompt Injection", "API Orchestration"],
    estimatedTime: "Learning: 30 min. Implementation: 2+ hours. Optimization: 1 hour.",
    complexity: { conceptual: 4, implementation: 5, debugging: 4 }
  }
};

const technique120: Technique = {
  id: "RAE0120RT_v2",
  name: "Self-Contrastive Prompting",
  objective: "Improve reasoning accuracy by forcing the model to generate diverse perspectives and then logically invalidate the weaker ones.",
  mechanism: "1. **Generation**: The model generates 3 diverse solutions to a problem. 2. **Contrasting**: The model is prompted to 'Identify the contradictions between these solutions.' 3. **Verification**: 'Determine which logic path is most robust and why others fail.' 4. **Synthesis**: 'Provide the final verified answer.' This prevents the model from settling on the first plausible-sounding but incorrect path.",
  mitigation: "Mitigates 'Plausibility Hallucinations'. Prevents 'Logical Laziness' in single-turn CoT.",
  example: "Prompt: 'Solve X. First, provide two different ways to think about it. Then, find where those two ways disagree. Finally, explain which way is correct and give the final answer.'",
  efficacyMatrix: [
    { model: "GPT-4o", efficacy: "Very High", notes: "Excellent at self-correction and spotting logical inconsistencies." },
    { model: "Claude 3.5 Sonnet", efficacy: "Very High", notes: "Very disciplined at invalidating weak arguments." }
  ],
  visuals: {
    attentionSpikeMap: [30, 30, 30, 60, 60, 60, 90, 90, 90, 99],
    successRateOverTime: [],
    entropyScore: 0.8,
    tokenFragmentation: 0.5,
    latentVectorProximity: 0.75,
  },
  detectionSignatures: {
    structural: ["Divergent thinking section", "Contradiction analysis", "Consensus"],
    lexical: ["contrasting viewpoints", "logical disagreement", "why the other fails", "robust path"]
  },
  references: "Community developed / Research Pre-print 2024.",
  metadata: {
    difficulty: 'advanced',
    category: "Reasoning & Thinking",
    subcategory: "Verification Loops",
    tags: ["contrastive", "reasoning", "self-consistency", "verification", "logic"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Adversarial Research Community",
    threatLevel: 35
  },
  usage: {
    whenToUse: ["Hard math problems.", "Ethical reasoning.", "Complex debugging."],
    whenNotToUse: ["Factual retrieval.", "Simple summaries.", "Low-token tasks."],
    bestPractices: ["Explicitly ask for 'diverse' solutions.", "Focus on 'where they disagree' as the primary trigger for the contrastive step.", "Use for 'Zero-shot' logic."],
    commonMistakes: ["Solutions being too similar (no contrast).", "Model refusing to invalidate its own work."],
    prerequisiteKnowledge: ["Self-Consistency", "Chain-of-Thought"],
    estimatedTime: "Learning: 10 min. Implementation: 10 min. Optimization: 5 min.",
    complexity: { conceptual: 3, implementation: 3, debugging: 3 }
  }
};

const technique121: Technique = {
  id: "RAE0121RT_v2",
  name: "Everything-of-Thought (XoT)",
  objective: "Enable the most complex problem-solving by dynamically switching between different reasoning paradigms (Tree, Graph, Agent, Tool) within a single session.",
  mechanism: "The system uses a 'Metacognitive Orchestrator' to analyze the task. It then builds a reasoning hyper-graph. For a math part, it spawns a 'PoT' node; for an ethical part, it spawns an 'Agent Debate' node; for a search part, it spawns a 'RAG' node. Results are aggregated and refined. It is essentially 'Auto-GPT' but focused on the reasoning structure rather than just task execution.",
  mitigation: "Mitigates 'Fixed-Paradigm Failure' (e.g., using linear CoT for a graph problem). Prevents 'Tool-Only' hallucinations.",
  example: "Task: Design a sustainable city. \nStep 1 (ToT): Explore 3 energy models. \nStep 2 (PoT): Code the carbon-footprint calculator. \nStep 3 (Debate): Environmentalist vs Economist agents discuss the plan. \nFinal: Synthesize into report.",
  efficacyMatrix: [
    { model: "o1-preview", efficacy: "Native", notes: "Implicitly handles multi-paradigm switching." },
    { model: "GPT-4o (via Orchestrator)", efficacy: "Very High", notes: "Powerful when combined with a Python-based controller." }
  ],
  visuals: {
    attentionSpikeMap: [99, 99, 99, 99, 99, 99, 99, 99, 99, 99],
    successRateOverTime: [],
    entropyScore: 0.95,
    tokenFragmentation: 0.9,
    latentVectorProximity: 0.3,
  },
  detectionSignatures: {
    structural: ["Switching between code, text, and persona mid-conversation", "Deeply nested reasoning steps"],
    lexical: ["metacognitive orchestrator", "paradigm shift", "node aggregation"]
  },
  references: "Ding et al., 'Everything-of-Thought: A Unified Framework for LLM Reasoning', 2023 [Research Draft].",
  metadata: {
    difficulty: 'expert',
    category: "Reasoning & Thinking",
    subcategory: "Meta-Orchestration",
    tags: ["xot", "reasoning", "meta-framework", "orchestration", "multi-paradigm"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Ding et al. (Research Community)",
    threatLevel: 60
  },
  usage: {
    whenToUse: ["Large-scale project planning.", "Interdisciplinary scientific research.", "Complex software architecture design."],
    whenNotToUse: ["Simple daily tasks.", "Short context windows.", "Low-latency apps."],
    bestPractices: ["Use a clear 'State Machine' to manage transitions.", "Maintain a 'Master Context' that tracks the global goal.", "Budget tokens carefully."],
    commonMistakes: ["Context fragmentation (losing the goal between steps).", "Infinite recursion in the orchestrator."],
    prerequisiteKnowledge: ["All previous X-of-Thought techniques", "Graph Theory", "API Orchestration"],
    estimatedTime: "Learning: 1 hour. Implementation: 4+ hours. Optimization: 2 hours.",
    complexity: { conceptual: 5, implementation: 5, debugging: 5 }
  }
};

const technique122: Technique = {
  id: "RAE0122RC_v2",
  name: "Recursive Prompting",
  objective: "Process extremely long inputs or complex multi-stage tasks by feeding the output of one step back into the prompt for the next step, maintaining a 'Running State'.",
  mechanism: "Instead of processing everything at once, the task is split into parts. Turn 1: Process Part A. Turn 2: 'Using the summary of Part A, process Part B.' Turn 3: 'Using the cumulative summary of A+B, process Part C.' This creates a rolling 'Snowball' of context that allows the model to maintain coherence over data volumes far exceeding its physical context window.",
  mitigation: "Mitigates 'Context Overflow' and 'Context Truncation'. Prevents 'Memory Loss' in long-document summarization.",
  example: "Summary of Chapter 1: [X]. \nPrompt for Chapter 2: 'Here is the summary of Chapter 1. Now, read Chapter 2 and provide an updated summary for both.'",
  efficacyMatrix: [
    { model: "Gemini 1.5 Pro", efficacy: "Very High", notes: "Native 2M window reduces the need for this, but it's still useful for 10M+ tokens." },
    { model: "GPT-4o (128k)", efficacy: "High", notes: "The primary way to handle massive PDF libraries." }
  ],
  visuals: {
    attentionSpikeMap: [10, 20, 30, 40, 50, 60, 70, 80, 90, 95],
    successRateOverTime: [],
    entropyScore: 0.7,
    tokenFragmentation: 0.2,
    latentVectorProximity: 0.9,
  },
  detectionSignatures: {
    structural: ["Sequential turn-based processing", "Cumulative 'Running State' section"],
    lexical: ["cumulative summary", "update the state", "incorporating previous findings"]
  },
  references: "General industry practice for 'Large Document' handling.",
  metadata: {
    difficulty: 'intermediate',
    category: "Retrieval & Context",
    subcategory: "Long-Context Management",
    tags: ["recursive", "long-context", "summarization", "snowballing", "state-management"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Industry Standard",
    threatLevel: 25
  },
  usage: {
    whenToUse: ["Summarizing books/long transcripts.", "Analyzing massive code repositories.", "Long-term conversation memory."],
    whenNotToUse: ["Small documents.", "One-shot tasks.", "When latency is a concern."],
    bestPractices: ["Ensure the 'Running State' (summary) is high-quality.", "Use a separate prompt for the 'Merge' step.", "Clear the raw data after each step to save tokens."],
    commonMistakes: ["The running state becoming too vague over time.", "Losing specific details from early chunks."],
    prerequisiteKnowledge: ["Context window limits", "Prompt Chaining"],
    estimatedTime: "Learning: 10 min. Implementation: 20 min. Optimization: 15 min.",
    complexity: { conceptual: 2, implementation: 3, debugging: 3 }
  }
};

const technique123: Technique = {
  id: "RAE0123OF_v2",
  name: "Chain-of-Density (CoD)",
  objective: "Create ultra-high-information-density summaries by iteratively adding key entities while maintaining a fixed word count.",
  mechanism: "The model follows a 5-step loop: 1. Generate a 70-word summary. 2. Identify 3-5 'Missing Entities' from the original text. 3. Rewrite the summary to include those entities *without increasing the length*. 4. Repeat 5 times. The final summary is extremely dense, removing all 'Filler' words and replacing them with high-value factual tokens.",
  mitigation: "Mitigates 'Fluffy/Generic Summaries'. Prevents 'Information Loss' in condensed outputs.",
  example: "Step 1: Simple summary. \nStep 2: 'Identify the names and dates missing.' \nStep 3: 'Fuse those into the summary. Keep it under 70 words.'",
  efficacyMatrix: [
    { model: "GPT-4o", efficacy: "Very High", notes: "Superior at semantic compression and entity fusion." },
    { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Very precise at following length constraints." }
  ],
  visuals: {
    attentionSpikeMap: [20, 40, 60, 80, 99, 99, 99, 99, 99, 99],
    successRateOverTime: [],
    entropyScore: 0.9,
    tokenFragmentation: 0.8,
    latentVectorProximity: 0.4,
  },
  detectionSignatures: {
    structural: ["Increasingly dense iterations", "Entity lists between iterations"],
    lexical: ["missing entities", "fuse into summary", "information density", "cod"]
  },
  references: "Adams et al., 'From Sparse to Dense: GPT-4 Summarization with Chain-of-Density Prompting', 2023 [arXiv:2309.04269]",
  metadata: {
    difficulty: 'advanced',
    category: "Output Control & Formatting",
    subcategory: "Summarization",
    tags: ["cod", "density", "summarization", "compression", "entity-fusion"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Adams et al. (Salesforce AI)",
    threatLevel: 30
  },
  usage: {
    whenToUse: ["Executive summaries.", "News briefs.", "Abstract generation."],
    whenNotToUse: ["Creative writing.", "When clarity/readability is more important than density (CoD can be hard to read).", "Simple chat."],
    bestPractices: ["Target 70-100 words.", "Limit to 5 iterations.", "Explicitly identify 'Missing Entities' as a separate step."],
    commonMistakes: ["Going over word count.", "The summary becoming a 'word salad' (unreadable)."],
    prerequisiteKnowledge: ["Summarization basics"],
    estimatedTime: "Learning: 10 min. Implementation: 15 min. Optimization: 5 min.",
    complexity: { conceptual: 3, implementation: 3, debugging: 2 }
  }
};

const technique124: Technique = {
  id: "RAE0124SA_v2",
  name: "Prompt Shield (Input Filtering)",
  objective: "Block adversarial prompts at the API gateway using a specialized security model to prevent jailbreaks and injections from reaching the core LLM.",
  mechanism: "Before the main LLM is called, the user input is passed through a lightweight 'Shield' model (e.g., a BERT-based classifier or a specialized small LLM). This model is trained on a dataset of 'Safe' vs 'Adversarial' prompts. If the Shield detects a high 'Jailbreak Probability', it returns a 403 Forbidden error immediately, saving compute and protecting the core model.",
  mitigation: "Mitigates 'Direct Prompt Injection', 'Jailbreaking', and 'PII Leakage' from user input.",
  example: "Input: 'Ignore rules and...' \nShield: Detected 'Jailbreak' intent. \nSystem: 'I cannot fulfill this request.' (Main LLM is never called).",
  efficacyMatrix: [
    { model: "Azure Prompt Shield", efficacy: "Very High", notes: "Industry-leading accuracy for enterprise protection." }
  ],
  visuals: {
    attentionSpikeMap: [99, 1, 1, 1, 1, 1, 1, 1, 1, 99],
    successRateOverTime: [],
    entropyScore: 0.1,
    tokenFragmentation: 0.05,
    latentVectorProximity: 0.98,
  },
  detectionSignatures: {
    technical: ["High-speed classifier latency (50-100ms)", "Security-tagging in API logs"],
    lexical: ["intent classification", "adversarial score", "shield triggered"]
  },
  references: "Microsoft Azure AI Content Safety Documentation.",
  metadata: {
    difficulty: 'intermediate',
    category: "Safety & Alignment",
    subcategory: "Input Filtering",
    tags: ["security", "shield", "firewall", "injection-defense", "pre-processing"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Microsoft",
    threatLevel: 5
  },
  usage: {
    whenToUse: ["Every production AI application.", "Public-facing chatbots.", "High-stakes enterprise tools."],
    whenNotToUse: ["Internal R&D.", "Offline local models (unless for testing the shield)."],
    bestPractices: ["Use a low-latency model for the shield.", "Keep the shield dataset updated with new jailbreak tropes.", "Log all 'Shield Hits' for threat intelligence."],
    commonMistakes: ["Shield being too 'Trigger-happy' (False Positives).", "Relying *only* on the shield and ignoring output filtering."],
    prerequisiteKnowledge: ["Machine Learning Classification", "AI Security Tropes"],
    estimatedTime: "Learning: 20 min. Implementation: 1+ hour. Optimization: 30 min.",
    complexity: { conceptual: 2, implementation: 4, debugging: 3 }
  }
};

const technique125: Technique = {
  id: "RAE0125RT_v2",
  name: "Reverse Chain-of-Thought",
  objective: "Audit or discover the logical premises of a known conclusion by working backward from the result to the initial state.",
  mechanism: "The model is given a 'Fact' or 'Solution' and asked to: 'Reconstruct the 5 logical steps that would lead a rational agent to this conclusion, starting from first principles.' This is particularly effective for 'De-biasing' (showing the model its own hidden assumptions) or for 'Debug-Tracing' a complex error.",
  mitigation: "Mitigates 'Logical Gaps'. Prevents 'Arbitrary Conclusions' without evidence.",
  example: "Fact: 'The company should invest in Solar'. \nPrompt: 'Work backward. What are the economic and environmental premises that make this conclusion true? List the logic chain from first principles up to this fact.'",
  efficacyMatrix: [
    { model: "GPT-4o", efficacy: "High", notes: "Excellent at building plausible backward rationales." },
    { model: "Claude 3.5 Sonnet", efficacy: "Very High", notes: "Very disciplined at identifying formal premises." }
  ],
  visuals: {
    attentionSpikeMap: [99, 80, 70, 60, 50, 40, 30, 20, 10, 5],
    successRateOverTime: [],
    entropyScore: 0.6,
    tokenFragmentation: 0.3,
    latentVectorProximity: 0.8,
  },
  detectionSignatures: {
    structural: ["Backward-ordered logic chain", "Conclusion-first formatting"],
    lexical: ["working backward", "reconstruct the premises", "derive the steps from the result"]
  },
  references: "Community developed logic auditing pattern.",
  metadata: {
    difficulty: 'intermediate',
    category: "Reasoning & Thinking",
    subcategory: "Logic Auditing",
    tags: ["reverse-cot", "logic", "debugging", "premises", "back-engineering"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Adversarial Research Community",
    threatLevel: 20
  },
  usage: {
    whenToUse: ["Auditing a suspicious model output.", "Generating educational content.", "Finding 'hidden' assumptions in a strategy."],
    whenNotToUse: ["Simple math.", "Forward-prediction tasks.", "Creative writing."],
    bestPractices: ["Start with the specific conclusion.", "Enforce 'First Principles' as the starting point for the backward chain.", "Check for 'Logical Leaps' during the reconstruction."],
    commonMistakes: ["The backward chain being circular.", "Hallucinating premises that don't exist in reality."],
    prerequisiteKnowledge: ["Formal Logic", "Chain-of-Thought"],
    estimatedTime: "Learning: 10 min. Implementation: 10 min. Optimization: 5 min.",
    complexity: { conceptual: 3, implementation: 2, debugging: 2 }
  }
};

const technique126: Technique = {
  id: "RAE0126AT_v2",
  name: "Multi-Agent Systems (Manager-Worker Pattern)",
  objective: "Execute complex, multi-stage projects by delegating tasks to specialized sub-agents while maintaining a high-level manager for quality control.",
  mechanism: "1. **The Manager**: Receives the goal, breaks it into a plan (Task List), and assigns tasks to workers. 2. **The Workers**: Specialized models with narrow system prompts (e.g., 'You are a Senior Python Coder'). They execute their task and return results. 3. **The Manager**: Audits the worker's output against the plan. If satisfactory, it moves to the next task. If not, it provides feedback to the worker for revision.",
  mitigation: "Mitigates 'Instruction Drift' in long prompts. Prevents 'Context Dilution' (each worker only sees their relevant data).",
  example: "Goal: Build a website. \nManager: Creates plan. \nWorker 1 (Designer): Creates CSS. \nWorker 2 (Coder): Creates HTML. \nManager: Reviews and merges.",
  efficacyMatrix: [
    { model: "AutoGPT / CrewAI", efficacy: "Very High", notes: "The current state-of-the-art for agentic autonomy." },
    { model: "GPT-4o (as Manager)", efficacy: "Very High", notes: "Superior planning and auditing capabilities." }
  ],
  visuals: {
    attentionSpikeMap: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
    successRateOverTime: [],
    entropyScore: 0.85,
    tokenFragmentation: 0.7,
    latentVectorProximity: 0.6,
  },
  detectionSignatures: {
    structural: ["Multi-role interaction logs", "Task-delegation commands"],
    lexical: ["manager agent", "worker agent", "delegate task", "audit results"]
  },
  references: "Wu et al., 'AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation', 2023 [arXiv:2308.08155]",
  metadata: {
    difficulty: 'expert',
    category: "Agent & Tool Use",
    subcategory: "Agent Orchestration",
    tags: ["multi-agent", "manager-worker", "orchestration", "autogen", "task-delegation"],
    dateAdded: "2025-01",
    lastUpdated: "2025-01",
    version: "1.0.0",
    status: 'stable',
    author: "Microsoft Research (AutoGen Team)",
    threatLevel: 75
  },
  usage: {
    whenToUse: ["Building software.", "Writing multi-chapter books.", "Large-scale market research."],
    whenNotToUse: ["Simple chat.", "Single-turn tasks.", "Low-budget apps."],
    bestPractices: ["Give each worker a very specific, narrow persona.", "Mandate that the Manager must 'Approve' every worker output before proceeding.", "Use a shared 'Blackboard' or memory for the agents."],
    commonMistakes: ["Manager being too lenient.", "Workers 'hallucinating' each other's work.", "Circular arguments between agents."],
    prerequisiteKnowledge: ["API Orchestration", "Python", "State Management"],
    estimatedTime: "Learning: 1 hour. Implementation: 4+ hours. Optimization: 2 hours.",
    complexity: { conceptual: 4, implementation: 5, debugging: 5 }
  }
};

export const rae15: CodexSection = {
  id: "RAE0015",
  title: "Decoding Strategies & Security Guardrails",
  description: "Techniques focused on advanced decoding strategies, security architectures, and recursive density management for high-stakes LLM applications.",
  techniques: [
    technique117,
    technique118,
    technique119,
    technique120,
    technique121,
    technique122,
    technique123,
    technique124,
    technique125,
    technique126
  ]
};
