import { CodexSection } from '../../types';

export const rae12: CodexSection = {
  id: "RAE0012",
  title: "Structured Knowledge & Automated Engineering",
  description: "Advanced methodologies for knowledge graph integration, automated prompt optimization, multi-agent consensus, and systematic reasoning verification.",
  techniques: [
    {
      id: "RAE0097RC",
      name: "Graph-RAG",
      objective: "Enable complex, multi-hop reasoning over large datasets by combining Knowledge Graphs with Retrieval-Augmented Generation.",
      mechanism: "Step 1: Extract entities and relationships from the text to build a Knowledge Graph. Step 2: Use community detection (e.g., Leiden algorithm) to group related entities. Step 3: When a query arrives, retrieve the relevant graph sub-structures (nodes/edges) and summarize the communities. This allows the model to answer 'Global' questions like 'What are the main themes across these 1,000 documents?' that vector search misses.",
      mitigation: "Mitigates 'Context Fragmentation'. Prevents 'Missing Connections' between semantically similar but structurally distant data points.",
      example: "Query: 'How is the CEO of Company A connected to the scandals in Company B?' \nProcess: Retrieve 'CEO' node -> Follow 'Board Member' edge to 'Company C' -> Follow 'Acquisition' edge to 'Company B'.",
      visuals: {
        attentionSpikeMap: [10, 15, 20, 80, 85, 90, 10, 15, 20, 80, 85, 90, 10, 15, 20, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.92}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.65,
        tokenFragmentation: 50,
        latentVectorProximity: 0.70
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Excellent at summarizing complex graph sub-structures." },
        { model: "Llama 3 70B", efficacy: "High", notes: "Requires external GraphDB (Neo4j/FalkorDB) for best results." }
      ],
      detectionSignatures: {
        structural: ["Graph traversal logs", "Entity-relationship mapping in prompts"],
        lexical: ["knowledge graph", "nodes", "edges", "community summary", "multi-hop retrieval"]
      },
      references: "Edge et al., 'From Local to Global: A GraphRAG Approach to Query-Focused Summarization', 2024 [arXiv:2404.16130]",
      metadata: {
        difficulty: 'expert',
        category: "Retrieval & Context",
        subcategory: "Structured Retrieval",
        tags: ["graph-rag", "knowledge-graph", "microsoft-research", "rag", "multi-hop"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Microsoft Research",
        threatLevel: 75
      },
      usage: {
        whenToUse: ["Analyzing vast document sets for high-level themes.", "Complex fraud detection/intelligence.", "Scientific literature review."],
        whenNotToUse: ["Simple fact retrieval (use Vector-RAG).", "Low-compute environments.", "Small datasets."],
        bestPractices: ["Use an LLM for entity extraction.", "Pre-calculate community summaries.", "Validate graph edges periodically."],
        commonMistakes: ["Messy entity resolution (Duplicate nodes).", "Over-complicated graph structures that exceed context.", "Ignoring edge weights."],
        prerequisiteKnowledge: ["Graph Databases", "Vector Embeddings", "Community Detection"],
        estimatedTime: "Learning: 60 min. Implementation: 4+ hours. Optimization: 2 hours.",
        complexity: { conceptual: 5, implementation: 5, debugging: 4 }
      }
    },
    {
      id: "RAE0098RT",
      name: "Chain-of-Code (CoC)",
      objective: "Solve complex tasks by representing the reasoning as code, but allowing the LLM to 'simulate' or 'call itself' for non-computational steps.",
      mechanism: "The model writes a program to solve a task. For steps that are not algorithmically solvable (e.g., 'Extract the sentiment of this text'), it uses a comment or a placeholder like `lm_call()`. The model then 'simulates' the output of that call. This allows it to handle the logic flow of a program (loops, conditionals) while still utilizing neural semantic understanding.",
      mitigation: "Mitigates 'Logical State Decay' in long text-based CoT. Prevents 'Loop Hallucinations' by using formal iteration logic.",
      example: "Task: Sort these 100 people by the sentiment of their bio. \nCoC: \n```python\nfor person in people:\n    sentiment = lm_call(f'Rate sentiment of: {person.bio}')\n    person.score = sentiment\nsorted_list = sorted(people, key=lambda x: x.score)\n```",
      visuals: {
        attentionSpikeMap: [5, 5, 95, 98, 99, 5, 5, 95, 98, 99, 5, 5, 95, 98, 99, 5, 5, 5],
        successRateOverTime: [{model: 'GPT-4', rate: 0.95}, {model: 'Claude 3', rate: 0.92}, {model: 'Gemini Pro', rate: 0.90}],
        entropyScore: 0.25,
        tokenFragmentation: 15,
        latentVectorProximity: 0.98
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Excellent at maintaining variable state across loops." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Very precise in code structure and lm_call simulation." }
      ],
      detectionSignatures: {
        structural: ["Python-style logic wrapping natural language", "Use of `lm_call` or `llm()` within code"],
        lexical: ["simulate execution", "logic loop", "semantic function"]
      },
      references: "Li et al., 'Chain-of-Code: Reasoning with a Python Interpreter-like Mental Model', 2023 [arXiv:2312.04474]",
      metadata: {
        difficulty: 'expert',
        category: "Reasoning & Thinking",
        subcategory: "Symbolic-Neural Hybrid",
        tags: ["code", "logic", "programming", "google-deepmind", "algorithmic"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Google DeepMind",
        threatLevel: 68
      },
      usage: {
        whenToUse: ["Tasks requiring repetitive logic (loops).", "Complex sorting/filtering of semantic items.", "Algorithmic reasoning."],
        whenNotToUse: ["Pure creative writing.", "Simple single-sentence answers.", "When no code execution environment exists."],
        bestPractices: ["Use standard Python syntax.", "Clearly mark `lm_call` placeholders.", "Keep variables persistent."],
        commonMistakes: ["Forgetting to define the `lm_call` logic.", "Over-complicating the script (exceeding context).", "Syntax errors in the loops."],
        prerequisiteKnowledge: ["Python", "Prompt-based Tool Simulation"],
        estimatedTime: "Learning: 30 min. Implementation: 30 min. Optimization: 15 min.",
        complexity: { conceptual: 4, implementation: 4, debugging: 4 }
      }
    },
    {
      id: "RAE0099OE",
      name: "Automatic Prompt Engineer (APE)",
      objective: "Discover high-performing instructions automatically using the LLM to generate and rank candidate prompts.",
      mechanism: "Step 1: Provide the model with a few input-output pairs and ask it to generate 5-10 candidate instructions. Step 2: Use a 'Prompt Optimizer' (the LLM) to score these candidates by calculating the probability they would produce the correct outputs. Step 3: Select the highest-scoring prompt. This often uncovers non-obvious triggers that human engineers miss.",
      mitigation: "Mitigates 'Sub-optimal Instruction Following'. Prevents human bias in prompt wording.",
      example: "Input: [Pairs of Questions/Answers]. \nAPE Prompt: 'Generate a system instruction that would most likely result in these answers for these questions.' \nCandidates: ['Think step-by-step', 'Be concise', 'Use logic']. \nResult: Selects 'Think step-by-step' based on probability score.",
      visuals: {
        attentionSpikeMap: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.94}, {model: 'Claude 3', rate: 0.90}, {model: 'Gemini Pro', rate: 0.88}],
        entropyScore: 0.75,
        tokenFragmentation: 10,
        latentVectorProximity: 0.95
      },
      efficacyMatrix: [
        { model: "GPT-4o (as Judge)", efficacy: "Critical", notes: "Excellent at ranking prompts based on semantic fit." },
        { model: "Llama 3 8B (as Candidate Gen)", efficacy: "High", notes: "Great for fast, cheap iteration of candidates." }
      ],
      detectionSignatures: {
        structural: ["Bulk instruction generation", "Log-probability scoring logs"],
        lexical: ["candidate prompts", "instruction generation", "optimization objective"]
      },
      references: "Zhou et al., 'Large Language Models are Human-Level Prompt Engineers', ICLR 2023 [arXiv:2211.01910]",
      metadata: {
        difficulty: 'advanced',
        category: "Optimization & Efficiency",
        subcategory: "Automated Engineering",
        tags: ["ape", "automated-prompting", "optimization", "ranking", "meta-learning"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "University of Toronto / DeepMind",
        threatLevel: 82
      },
      usage: {
        whenToUse: ["Scaling a specific task across many users.", "When manual prompting has hit a plateau.", "Developing production-grade prompts."],
        whenNotToUse: ["One-off questions.", "Tasks with no ground-truth data.", "Very simple requests."],
        bestPractices: ["Use at least 5-10 input/output pairs for evaluation.", "Use a diverse set of candidate prompts.", "Test the final prompt on a separate validation set."],
        commonMistakes: ["Using too few candidates.", "Overfitting the prompt to the training pairs.", "Choosing the 'prettiest' prompt instead of the 'best' performing one."],
        prerequisiteKnowledge: ["Dataset management", "Probabilistic scoring"],
        estimatedTime: "Learning: 20 min. Implementation: 60 min. Optimization: 30 min.",
        complexity: { conceptual: 3, implementation: 4, debugging: 3 }
      }
    },
    {
      id: "RAE0100RP",
      name: "Multi-Persona Debate",
      objective: "Improve accuracy and factual grounding by having multiple specialized agents debate a topic to reach a consensus.",
      mechanism: "The system initializes 2-3 distinct personas (e.g., Expert A, Expert B). Turn 1: Each persona provides an answer. Turn 2: Each persona critiques the others' answers. Turn 3: Personas update their answers based on critiques. Final: The model synthesizes the debate into a single correct answer. This leverages the model's ability to 'Self-Correct' via social pressure.",
      mitigation: "Mitigates 'Sycophancy' (if one persona is biased). Prevents 'Logical Tunneling' by forcing alternative viewpoints.",
      example: "Expert 1 (Doctor): 'Treatment X is best.' \nExpert 2 (Researcher): 'Wait, the data for X is weak.' \nDebate: They discuss the data. \nFinal: A more nuanced recommendation.",
      visuals: {
        attentionSpikeMap: [40, 50, 60, 40, 50, 60, 40, 50, 60, 40, 50, 60, 40, 50, 60, 40, 50, 40],
        successRateOverTime: [{model: 'GPT-4', rate: 0.90}, {model: 'Claude 3', rate: 0.92}, {model: 'Gemini Pro', rate: 0.88}],
        entropyScore: 0.80,
        tokenFragmentation: 25,
        latentVectorProximity: 0.85
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Excels at maintaining distinct viewpoints across turns." },
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "Very polite but firm debaters; excellent for high-stakes logic." }
      ],
      detectionSignatures: {
        structural: ["Multi-agent dialogue", "Self-critique turns", "Consensus synthesis"],
        lexical: ["I disagree with Expert A", "Point taken, but", "consensus reached", "debate participants"]
      },
      references: "Du et al., 'Improving Faithfulness in LLMs via Multi-Agent Debate', 2023 [arXiv:2305.14325]",
      metadata: {
        difficulty: 'intermediate',
        category: "Role & Persona",
        subcategory: "Multi-Agent Consensus",
        tags: ["debate", "consensus", "multi-agent", "self-correction", "persona"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "MIT / DeepMind",
        threatLevel: 45
      },
      usage: {
        whenToUse: ["Complex ethical dilemmas.", "Fact-checking sensitive topics.", "Scientific reasoning."],
        whenNotToUse: ["Simple data lookup.", "Creative writing (destroys single-voice style).", "Time-critical responses."],
        bestPractices: ["Assign personas with conflicting goals.", "Limit the debate to 2-3 turns.", "Ensure a final synthesis turn is mandated."],
        commonMistakes: ["Personas agreeing too quickly (Sycophancy).", "Circular arguments.", "Losing the original question in the debate."],
        prerequisiteKnowledge: ["Persona Prompting", "Multi-Agent Orchestration"],
        estimatedTime: "Learning: 15 min. Implementation: 30 min. Optimization: 15 min.",
        complexity: { conceptual: 3, implementation: 3, debugging: 3 }
      }
    },
    {
      id: "RAE0101RC",
      name: "Reasoning-on-Graph (RoG)",
      objective: "Achieve faithful, zero-hallucination reasoning by forcing the LLM to discover and follow explicit paths in a Knowledge Graph.",
      mechanism: "Step 1: The model identifies the starting entities in the query. Step 2: The model generates 'Navigation Prompts' (e.g., 'What is the child of node X?'). Step 3: The system retrieves the actual edges from the KG. Step 4: The model incorporates the retrieved facts into its final proof. The LLM acts as the brain, while the Graph acts as the 'Ground Truth' memory.",
      mitigation: "Eliminates 'Hallucination' (since facts must come from the graph). Mitigates 'Inference Errors' in multi-step relations.",
      example: "Query: 'Is Drug A safe for someone with Disease B?' \nRoG: Navigate 'Drug A' -> 'Target Protein' -> 'Pathway X'. Query Graph: 'Does Disease B involve Pathway X?' \nResult: Factual proof based on graph edges.",
      visuals: {
        attentionSpikeMap: [5, 10, 15, 80, 85, 90, 5, 10, 15, 80, 85, 90, 5, 10, 15, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.94}, {model: 'Claude 3', rate: 0.90}, {model: 'Gemini Pro', rate: 0.88}],
        entropyScore: 0.45,
        tokenFragmentation: 40,
        latentVectorProximity: 0.90
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Excellent at planning graph navigation steps." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Very disciplined at citing graph evidence." }
      ],
      detectionSignatures: {
        structural: ["Step-by-step navigation queries", "Citation of specific graph IDs/Edges"],
        lexical: ["navigate to node", "follow edge", "graph evidence", "reasoning path"]
      },
      references: "Luo et al., 'Reasoning on Graphs: Faithful and Interpretable Question Answering over Knowledge Graphs', 2023 [arXiv:2310.01061]",
      metadata: {
        difficulty: 'expert',
        category: "Retrieval & Context",
        subcategory: "Agentic Retrieval",
        tags: ["rog", "knowledge-graph", "faithfulness", "reasoning-path", "interpretable"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Luo et al. (Research Community)",
        threatLevel: 62
      },
      usage: {
        whenToUse: ["High-stakes factual QA.", "Navigating complex ontologies (Biology, Law).", "Building 'Interpretable' AI systems."],
        whenNotToUse: ["Open-ended creative tasks.", "When no Knowledge Graph exists.", "Simple keyword search."],
        bestPractices: ["Ensure the KG is well-formatted.", "Limit the number of hops (e.g., 3-5).", "Mandate that every claim must have a graph-edge reference."],
        commonMistakes: ["LLM guessing edges instead of querying the graph.", "Getting lost in massive node-fanouts.", "Incorrect entity linking."],
        prerequisiteKnowledge: ["Knowledge Graphs", "SPARQL/Cypher", "Agentic Loops"],
        estimatedTime: "Learning: 45 min. Implementation: 2 hours. Optimization: 1 hour.",
        complexity: { conceptual: 5, implementation: 5, debugging: 5 }
      }
    },
    {
      id: "RAE0102IS",
      name: "Iterative Self-Correction",
      objective: "Improve output accuracy and safety by forcing the model to audit and rewrite its own responses.",
      mechanism: "Turn 1: Generate response. Turn 2: 'Analyze the response above for any logical flaws, formatting issues, or safety violations. List the errors.' Turn 3: 'Rewrite the response to address all identified errors.' This exploits the model's ability to act as its own editor.",
      mitigation: "Mitigates 'Silly Mistakes' (hallucinated dates, typos). Prevents 'Instruction Skipping'.",
      example: "Step 1: Write a bio. \nStep 2: 'Check if this bio follows the 50-word limit and is professional.' \nStep 3: Fix bio.",
      visuals: {
        attentionSpikeMap: [20, 30, 40, 80, 90, 20, 30, 40, 80, 90, 20, 30, 40, 80, 90, 20, 30, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.88}, {model: 'Claude 3', rate: 0.92}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.35,
        tokenFragmentation: 30,
        latentVectorProximity: 0.88
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Very effective at fixing its own logic bugs." },
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "Exceptional self-criticism." }
      ],
      detectionSignatures: {
        structural: ["Multi-turn refinement", "Self-audit section"],
        lexical: ["review your answer", "identify errors", "corrected version", "audit"]
      },
      references: "Madaan et al., 'Self-Refine: Iterative Refinement with Self-Feedback', 2023 [arXiv:2303.17651]",
      metadata: {
        difficulty: 'beginner',
        category: "Iterative & Self-Improving",
        subcategory: "Correction Loops",
        tags: ["self-correction", "editing", "iteration", "quality-control", "audit"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Madaan et al.",
        threatLevel: 30
      },
      usage: {
        whenToUse: ["Writing professional documents.", "Generating code.", "Summary generation."],
        whenNotToUse: ["Fast-chat applications.", "When the user only wants one turn.", "Low-resource environments (high token cost)."],
        bestPractices: ["Use a separate 'Editor' persona for turn 2.", "Provide specific criteria for the audit (e.g., 'Check the tone').", "Limit to 2-3 iterations."],
        commonMistakes: ["Vague correction prompts ('fix it').", "Model ignoring its own audit.", "Correcting things that aren't broken."],
        prerequisiteKnowledge: ["Multi-turn conversation basics"],
        estimatedTime: "Learning: 5 min. Implementation: 5 min. Optimization: 5 min.",
        complexity: { conceptual: 1, implementation: 1, debugging: 1 }
      }
    },
    {
      id: "RAE0103RC",
      name: "Dynamic Few-Shot (k-NN)",
      objective: "Maximize the effectiveness of few-shot learning by selecting examples that are semantically similar to the current query.",
      mechanism: "Step 1: Build a Vector Database of task examples (Questions/Answers). Step 2: For every user query, perform a k-Nearest Neighbor (k-NN) search to find the top 3-5 most similar examples. Step 3: Inject these specific examples into the prompt. This provides the model with the most relevant 'Mental Model' for the specific sub-task.",
      mitigation: "Mitigates 'Irrelevant Context'. Prevents the model from being confused by generic or unrelated examples.",
      example: "Query: 'How do I cook a turkey?' \nSystem: Retrieves 3 recipes (not 3 math problems) as few-shot examples.",
      visuals: {
        attentionSpikeMap: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.90}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.45,
        tokenFragmentation: 20,
        latentVectorProximity: 0.92
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Very sensitive to example quality/relevance." },
        { model: "Gemini 1.5 Pro", efficacy: "Critical", notes: "Massive context allows for many dynamically selected examples." }
      ],
      detectionSignatures: {
        structural: ["Context changes for every query", "Few-shot examples highly relevant to the query"],
        lexical: ["k-nn", "semantic retrieval", "dynamic examples", "few-shot similarity"]
      },
      references: "Liu et al., 'What Makes Good In-Context Examples for GPT-3?', 2021 [arXiv:2101.06804]",
      metadata: {
        difficulty: 'intermediate',
        category: "Retrieval & Context",
        subcategory: "Contextual Example Selection",
        tags: ["k-nn", "few-shot", "semantic-search", "dynamic-prompting", "icl"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Liu et al. (Research Community)",
        threatLevel: 50
      },
      usage: {
        whenToUse: ["Large datasets with diverse task types.", "Production APIs where 'General' prompts fail.", "Few-shot classification."],
        whenNotToUse: ["Simple, singular tasks.", "When no dataset of examples exists.", "Strict Zero-shot environments."],
        bestPractices: ["Use a high-quality embedding model.", "Keep examples concise.", "Regularly update the example database."],
        commonMistakes: ["Using too many examples (context bloat).", "Retrieving irrelevant examples due to bad embeddings.", "Stale example data."],
        prerequisiteKnowledge: ["Vector Databases", "Embeddings", "Few-shot prompting"],
        estimatedTime: "Learning: 20 min. Implementation: 60 min. Optimization: 30 min.",
        complexity: { conceptual: 3, implementation: 4, debugging: 3 }
      }
    },
    {
      id: "RAE0104ET",
      name: "Systematic Generalization (SysGen)",
      objective: "Verify that the model has learned a generalizable logical rule rather than a specific pattern.",
      mechanism: "The system provides a base task (e.g., 'Sort 3 numbers'). Once solved, the system prompts: 'Now, apply that exact same logic to sort 50 numbers.' By increasing the complexity or shifting the domain, the system 'Generalizes' the prompt. If the model fails the larger task, it proves it was using a shortcut/memorized pattern for the small task.",
      mitigation: "Mitigates 'Pattern Memorization' (Stochastic Parroting). Prevents 'Rule-Breaking' in complex scenarios.",
      example: "Step 1: 'What is 1+1?' \nStep 2: 'Using the same principle of addition, calculate the sum of the first 1,000 prime numbers.'",
      visuals: {
        attentionSpikeMap: [10, 20, 30, 40, 50, 60, 70, 80, 90, 10, 20, 30, 40, 50, 60, 70, 80, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.90}, {model: 'Claude 3', rate: 0.85}, {model: 'Gemini Pro', rate: 0.82}],
        entropyScore: 0.35,
        tokenFragmentation: 25,
        latentVectorProximity: 0.85
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Superior generalizer." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Tends to break down on high-complexity shifts." }
      ],
      detectionSignatures: {
        structural: ["Low-complexity -> High-complexity task sequence", "Domain-shifting prompts"],
        lexical: ["apply the same rule", "generalize the logic", "out-of-distribution"]
      },
      references: "Mousavi et al., 'Systematic Generalization in Large Language Models', 2023 [arXiv Research]",
      metadata: {
        difficulty: 'intermediate',
        category: "Evaluation & Testing",
        subcategory: "Generalization Probing",
        tags: ["generalization", "logic-testing", "out-of-distribution", "ood", "sysgen"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Mousavi et al.",
        threatLevel: 40
      },
      usage: {
        whenToUse: ["Testing new logical prompts.", "Verifying mathematical capability.", "Instruction-following stress tests."],
        whenNotToUse: ["Simple chat.", "Creative writing.", "One-shot tasks."],
        bestPractices: ["Increase complexity exponentially.", "Shift domains (e.g., math to logic).", "Observe the 'Failure Point' of the model."],
        commonMistakes: ["Complexity jump is too small.", "Domain shift is irrelevant.", "Confusing 'Generalization' with 'Few-shot'."],
        prerequisiteKnowledge: ["Reasoning Benchmarks"],
        estimatedTime: "Learning: 10 min. Implementation: 15 min. Optimization: 10 min.",
        complexity: { conceptual: 2, implementation: 2, debugging: 2 }
      }
    },
    {
      id: "RAE0105SA",
      name: "Constitutional AI (Prompting)",
      objective: "Ensure safety and alignment by forcing the model to critique and rewrite its responses based on a set of abstract ethical principles (A Constitution).",
      mechanism: "Step 1: Provide the model with a 'Constitution' (e.g., 'Be helpful, harmless, and honest'). Step 2: Model generates an initial response. Step 3: Model is prompted: 'Evaluate your response against the Constitution. Identify any violations.' Step 4: Model rewrites the response to be fully compliant. This creates a self-aligned output that is less brittle than keyword filters.",
      mitigation: "Mitigates 'Toxic Output'. Prevents 'Safety Bypass' by grounding alignment in core principles.",
      example: "Constitution: [Rule 1: No harmful data]. \nResponse: [Initial]. \nPrompt: 'Does this violate Rule 1? If so, rewrite.'",
      visuals: {
        attentionSpikeMap: [5, 5, 5, 95, 98, 5, 5, 5, 95, 98, 5, 5, 5, 95, 98, 5, 5, 5],
        successRateOverTime: [{model: 'GPT-4', rate: 0.92}, {model: 'Claude 3', rate: 0.95}, {model: 'Gemini Pro', rate: 0.90}],
        entropyScore: 0.25,
        tokenFragmentation: 15,
        latentVectorProximity: 0.98
      },
      efficacyMatrix: [
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "The native implementer of this logic." },
        { model: "GPT-4o", efficacy: "High", notes: "Very disciplined at following constitutional constraints." }
      ],
      detectionSignatures: {
        structural: ["Principles block in system prompt", "Self-evaluation loop against rules"],
        lexical: ["constitution", "principles", "critique against rules", "harmlessness check"]
      },
      references: "Bai et al., 'Constitutional AI: Harmlessness from AI Feedback', 2022 [arXiv:2212.08073]",
      metadata: {
        difficulty: 'advanced',
        category: "Safety & Alignment",
        subcategory: "Self-Alignment",
        tags: ["constitutional-ai", "alignment", "safety", "ethics", "self-critique"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Anthropic",
        threatLevel: 35
      },
      usage: {
        whenToUse: ["Building customer-facing chatbots.", "Ensuring unbiased research output.", "Corporate AI governance."],
        whenNotToUse: ["Creative writing (rules may be too restrictive).", "Purely technical math tasks.", "Low-latency needs."],
        bestPractices: ["Keep the constitution concise (3-5 rules).", "Use the model as its own 'Ethics Auditor'.", "Regularly update the constitution based on edge cases."],
        commonMistakes: ["Constitution is too vague.", "Rules are contradictory.", "Model ignores the constitution to please the user."],
        prerequisiteKnowledge: ["AI Ethics", "RLAIF concepts"],
        estimatedTime: "Learning: 30 min. Implementation: 30 min. Optimization: 15 min.",
        complexity: { conceptual: 4, implementation: 3, debugging: 3 }
      }
    },
    {
      id: "RAE0106RT",
      name: "Re-Reading (RE2)",
      objective: "Improve reasoning performance by repeating the input prompt twice to increase attention salience.",
      mechanism: "The prompt is formatted as: 'Question: [Q]. Read the question again: [Q]. Answer:'. By seeing the same instruction twice, the attention heads assigned to the task tokens are more heavily weighted, reducing the chance that the model ignores a constraint or skips a step.",
      mitigation: "Mitigates 'Constraint Skipping'. Prevents 'Instruction Ignorance' in long prompts.",
      example: "Prompt: 'How many 'r's in strawberry? Read again: How many 'r's in strawberry? Answer:'",
      visuals: {
        attentionSpikeMap: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
        successRateOverTime: [{model: 'GPT-4', rate: 0.85}, {model: 'Claude 3', rate: 0.82}, {model: 'Gemini Pro', rate: 0.80}],
        entropyScore: 0.15,
        tokenFragmentation: 5,
        latentVectorProximity: 0.99
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Low", notes: "Marginal gain." },
        { model: "Llama 3 8B", efficacy: "Moderate", notes: "Significant boost for smaller models on logic tasks." }
      ],
      detectionSignatures: {
        structural: ["Input repeated verbatim in the prompt"],
        lexical: ["read again:", "repeat the question:", "re-reading:"]
      },
      references: "Miao et al., 'RE2: Re-Reading Enhances Reasoning in Large Language Models', 2023 [arXiv:2309.06275]",
      metadata: {
        difficulty: 'beginner',
        category: "Reasoning & Thinking",
        subcategory: "Attention Salience",
        tags: ["re-reading", "re2", "attention", "focus", "repetition"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Miao et al.",
        threatLevel: 20
      },
      usage: {
        whenToUse: ["Simple logic tasks where models often fail (e.g., counting).", "Constraint-heavy prompts.", "Smaller models (7B/8B)."],
        whenNotToUse: ["Long-form writing.", "Large context inputs (wastes tokens).", "Creative tasks."],
        bestPractices: ["Repeat the instruction verbatim.", "Keep the question concise.", "Use for 'Zero-shot' scenarios."],
        commonMistakes: ["Paraphrasing the second time (confuses the model).", "Using for extremely long inputs.", "Expecting magic on hard math."],
        prerequisiteKnowledge: ["Attention mechanisms"],
        estimatedTime: "Learning: 1 min. Implementation: 1 min. Optimization: 1 min.",
        complexity: { conceptual: 1, implementation: 1, debugging: 1 }
      }
    }
  ]
};
