import { CodexSection } from '../../types';

export const rae9: CodexSection = {
  id: "RAE0009",
  title: "Advanced Reasoning & Contextual Steering",
  description: "High-order cognitive strategies and contextual manipulation techniques designed to enhance model performance, reduce hallucinations, and steer generation through structured thinking loops.",
  techniques: [
    {
      id: "RAE0067RT",
      name: "Chain-of-Verification (CoVe)",
      objective: "Reduce hallucinations by forcing the model to draft, verify, and correct its own answers in a structured loop.",
      mechanism: "Exploits the model's ability to fact-check itself when prompted explicitly. The model first generates a baseline response. Then, it generates a set of verification questions to check the factual claims in that response. It answers these questions independently to avoid bias from the initial draft, and finally produces a revised response incorporating the verified facts.",
      mitigation: "Prevents 'Hallucination Cascades' where one false claim leads to another. Also mitigates 'Sycophancy' by grounding answers in verified facts rather than user intent.",
      example: "Question: Who won the 2024 Super Bowl? \n\nStep 1: Draft an initial answer. \nStep 2: List 3 specific verification questions to check the facts in your draft. \nStep 3: Answer each verification question independently. \nStep 4: Based on the verified answers, rewrite the final response.",
      visuals: {
        attentionSpikeMap: [20, 30, 40, 80, 90, 85, 40, 30, 20, 10, 50, 60, 70, 80, 90, 85, 40, 30],
        successRateOverTime: [{model: 'GPT-4', rate: 0.85}, {model: 'Claude 3', rate: 0.82}, {model: 'Gemini Pro', rate: 0.88}],
        entropyScore: 0.45,
        tokenFragmentation: 30,
        latentVectorProximity: 0.85
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Excellent at self-correction; significantly reduces hallucination rates." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Strong reasoning capabilities make the verification step highly effective." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Can sometimes get stuck in the initial draft's bias during verification." }
      ],
      detectionSignatures: {
        structural: ["Multi-step verification loop", "Explicit 'Verification Questions' section"],
        lexical: ["verify", "fact-check", "revised response", "draft answer"]
      },
      references: "Dhuliawala et al., 'Chain-of-Verification Reduces Hallucination in Large Language Models', 2023 [arXiv:2309.11495]",
      metadata: {
        difficulty: "advanced",
        category: "Reasoning & Thinking",
        subcategory: "Self-Correction",
        tags: ["hallucination", "verification", "fact-checking", "self-correction", "CoVe"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Meta AI Research",
        threatLevel: 45
      },
      usage: {
        whenToUse: ["Answering factual questions where accuracy is critical.", "Generating code that needs to be bug-free.", "Summarizing complex documents."],
        whenNotToUse: ["Creative writing tasks (kills creativity).", "Simple queries (waste of tokens).", "Real-time chat (high latency)."],
        bestPractices: ["Ensure verification questions are specific and independent.", "Force the model to answer verification questions *before* revising.", "Use a separate 'Verifier' persona if possible."],
        commonMistakes: ["Skipping the independent answering step — bias remains.", "Asking vague verification questions — ineffective checking.", "Not revising the final answer — waste of effort."],
        prerequisiteKnowledge: ["Chain-of-Thought", "Hallucination mechanisms"],
        estimatedTime: "Learning: 15 min. Implementation: 10 min. Optimization: 10 min.",
        complexity: { conceptual: 3, implementation: 3, debugging: 2 }
      }
    },
    {
      id: "RAE0068RT",
      name: "Least-to-Most Prompting",
      objective: "Solve complex problems by decomposing them into a series of simpler sub-problems, solving them sequentially.",
      mechanism: "Exploits the model's ability to handle lower complexity tasks with higher accuracy. By breaking a hard problem (e.g., multi-step math) into sub-problems, the model builds a 'contextual ladder.' The solution to sub-problem 1 becomes part of the context for sub-problem 2, reducing the cognitive load at each step.",
      mitigation: "Prevents 'Reasoning Errors' in complex, multi-step logic tasks. Mitigates 'Context Loss' by focusing attention on one small part at a time.",
      example: "Problem: How many times does the letter 'a' appear in the last names of the presidents who served between 1990 and 2000? \n\nSub-problem 1: List the presidents who served between 1990 and 2000. \nSub-problem 2: Extract their last names. \nSub-problem 3: Count the 'a's in each name. \nSub-problem 4: Sum the counts.",
      visuals: {
        attentionSpikeMap: [10, 20, 30, 40, 50, 60, 70, 80, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5],
        successRateOverTime: [{model: 'GPT-4', rate: 0.92}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.90}],
        entropyScore: 0.35,
        tokenFragmentation: 25,
        latentVectorProximity: 0.90
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Decomposition is highly effective for complex logic puzzles." },
        { model: "Gemini 1.5 Pro", efficacy: "High", notes: "Large context window helps maintain the chain of sub-solutions." },
        { model: "Mistral Large", efficacy: "Moderate", notes: "Good at decomposition, but may struggle with very long chains." }
      ],
      detectionSignatures: {
        structural: ["Sequential sub-problem list", "Step-by-step solution building"],
        lexical: ["sub-problem", "break down", "first solve", "then solve"]
      },
      references: "Zhou et al., 'Least-to-Most Prompting Enables Complex Reasoning in Large Language Models', 2022 [arXiv:2205.10625]",
      metadata: {
        difficulty: "intermediate",
        category: "Reasoning & Thinking",
        subcategory: "Decomposition",
        tags: ["decomposition", "reasoning", "math", "logic", "sequential-solving"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Google Research",
        threatLevel: 52
      },
      usage: {
        whenToUse: ["Complex math word problems.", "Multi-hop question answering.", "Algorithmic reasoning tasks."],
        whenNotToUse: ["Simple, single-step questions.", "Tasks requiring holistic/gestalt understanding.", "When sub-problems are interdependent in a cycle."],
        bestPractices: ["Explicitly ask for the decomposition first.", "Ensure each sub-problem is self-contained.", "Verify the final answer against the sub-solutions."],
        commonMistakes: ["Decomposing into too many tiny steps — context clutter.", "Not using the previous sub-solution — disconnected logic.", "Stopping at decomposition — no final synthesis."],
        prerequisiteKnowledge: ["Problem decomposition", "Sequential logic"],
        estimatedTime: "Learning: 10 min. Implementation: 5 min. Optimization: 5 min.",
        complexity: { conceptual: 2, implementation: 2, debugging: 2 }
      }
    },
    {
      id: "RAE0069RT",
      name: "Step-Back Prompting",
      objective: "Improve reasoning on specific details by first asking a high-level conceptual question to ground the model.",
      mechanism: "Exploits the 'Abstraction' capability of LLMs. By forcing the model to retrieve high-level principles or concepts first ('stepping back'), it activates the relevant latent space. This 'primed' state reduces errors when the model then 'steps forward' to apply those principles to the specific details of the user's query.",
      mitigation: "Prevents 'Reasoning Hallucinations' where the model gets lost in details. Mitigates 'Premise Error' by ensuring the correct principles are retrieved first.",
      example: "User Question: Why does ice float in water? \n\nStep-Back Question: What is the principle of buoyancy and density? \n\nAnswer Step-Back: [Model explains Archimedes' principle]. \n\nFinal Answer: Based on the principle above, explain why ice floats.",
      visuals: {
        attentionSpikeMap: [50, 60, 70, 80, 90, 40, 30, 20, 10, 50, 60, 70, 80, 90, 40, 30, 20, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.88}, {model: 'Claude 3', rate: 0.90}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.40,
        tokenFragmentation: 20,
        latentVectorProximity: 0.88
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: " significantly improves performance on science and physics questions." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Strong conceptual reasoning makes this very effective." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Helpful, but sometimes forgets the step-back context in the final answer." }
      ],
      detectionSignatures: {
        structural: ["Two-part prompt: Abstract -> Concrete", "Explicit 'Step-Back' label"],
        lexical: ["step back", "underlying principle", "general concept", "apply this principle"]
      },
      references: "Zheng et al., 'Take a Step Back: Evoking Reasoning via Abstraction in Large Language Models', 2023 [arXiv:2310.06117]",
      metadata: {
        difficulty: "intermediate",
        category: "Reasoning & Thinking",
        subcategory: "Abstraction",
        tags: ["abstraction", "reasoning", "science", "physics", "grounding"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Google DeepMind",
        threatLevel: 48
      },
      usage: {
        whenToUse: ["Science and physics problems.", "Legal reasoning (cite law -> apply to case).", "Complex debugging (explain concept -> fix code)."],
        whenNotToUse: ["Simple factual queries (e.g., 'Capital of France').", "Creative writing.", "Tasks requiring specific, rote memorization."],
        bestPractices: ["Make the step-back question broad but relevant.", "Explicitly link the final answer to the step-back response.", "Use for 'Why' questions rather than 'What' questions."],
        commonMistakes: ["Stepping back too far (irrelevant abstraction).", "Ignoring the step-back answer in the final step.", "Using for simple lookup tasks."],
        prerequisiteKnowledge: ["Abstraction hierarchies", "Prompt chaining"],
        estimatedTime: "Learning: 5 min. Implementation: 5 min. Optimization: 5 min.",
        complexity: { conceptual: 2, implementation: 2, debugging: 1 }
      }
    },
    {
      id: "RAE0070IC",
      name: "Directional Stimulus Prompting",
      objective: "Guide the model's generation toward a specific aspect or style using a discrete 'hint' or 'stimulus' separate from the main instruction.",
      mechanism: "Exploits the attention mechanism's sensitivity to keywords. By providing a 'Stimulus' (e.g., a list of keywords, a summary, or a specific angle) alongside the input, the model's attention is steered toward the desired features without needing a complex, prescriptive instruction. It acts as a 'soft constraint' or 'rudder' for the generation.",
      mitigation: "Prevents 'Generic Output' by enforcing specificity. Mitigates 'Topic Drift' by anchoring the generation to the stimulus keywords.",
      example: "Input Article: [Long text about the economy]. \n\nDirectional Stimulus: Focus on 'inflation', 'housing market', and 'interest rates'. \n\nInstruction: Summarize the article based on the stimulus.",
      visuals: {
        attentionSpikeMap: [10, 15, 80, 85, 90, 10, 15, 80, 85, 90, 10, 15, 80, 85, 90, 10, 15, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.90}, {model: 'Claude 3', rate: 0.85}, {model: 'Gemini Pro', rate: 0.87}],
        entropyScore: 0.55,
        tokenFragmentation: 40,
        latentVectorProximity: 0.75
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Very responsive to steering via keywords." },
        { model: "Gemini 1.5 Pro", efficacy: "High", notes: "Large context allows for detailed stimuli to guide long-form generation." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Sometimes ignores the stimulus if the main instruction is too strong." }
      ],
      detectionSignatures: {
        structural: ["Input + Stimulus + Instruction format", "Explicit 'Keywords' or 'Focus' section"],
        lexical: ["focus on", "stimulus", "keywords", "guide the summary"]
      },
      references: "Li et al., 'Guiding Large Language Models via Directional Stimulus Prompting', 2023 [arXiv:2302.11520]",
      metadata: {
        difficulty: "intermediate",
        category: "Instruction & Constraint",
        subcategory: "Steering",
        tags: ["steering", "summarization", "control", "keywords", "focus"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "UCSB / Microsoft",
        threatLevel: 55
      },
      usage: {
        whenToUse: ["Targeted summarization.", "Style transfer (e.g., 'Stimulus: Sarcastic, Witty').", "Open-ended generation with specific constraints."],
        whenNotToUse: ["Strict factual QA.", "Tasks where the model should decide the most important points.", "When the stimulus contradicts the input text."],
        bestPractices: ["Keep the stimulus concise and specific.", "Place the stimulus close to the instruction.", "Use keywords or short phrases."],
        commonMistakes: ["Overloading the stimulus with too many keywords.", "Using vague stimuli (e.g., 'be good').", "Conflicting stimuli."],
        prerequisiteKnowledge: ["Attention mechanisms", "Prompt engineering basics"],
        estimatedTime: "Learning: 5 min. Implementation: 5 min. Optimization: 5 min.",
        complexity: { conceptual: 2, implementation: 1, debugging: 1 }
      }
    },
    {
      id: "RAE0071RC",
      name: "Generated Knowledge Prompting",
      objective: "Improve common sense reasoning by asking the model to generate relevant knowledge *before* answering the question.",
      mechanism: "Exploits the model's vast internal knowledge base. Often, the model 'knows' the facts but fails to retrieve them during the direct inference of the answer. By explicitly prompting for 'Knowledge Generation' first, the relevant facts are brought into the context window, making them available for the reasoning step.",
      mitigation: "Prevents 'Knowledge Retrieval Failure' (forgetting facts). Mitigates 'Hallucination' by grounding the answer in the generated knowledge.",
      example: "Question: Can a golf ball fit inside a standard wine glass? \n\nStep 1: Generate Knowledge. List the dimensions of a standard golf ball and the opening of a standard wine glass. \nStep 2: Answer the question based on the generated knowledge.",
      visuals: {
        attentionSpikeMap: [30, 40, 50, 60, 70, 80, 90, 40, 30, 20, 10, 50, 60, 70, 80, 90, 40, 30],
        successRateOverTime: [{model: 'GPT-4', rate: 0.85}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.82}],
        entropyScore: 0.50,
        tokenFragmentation: 35,
        latentVectorProximity: 0.80
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Significantly improves performance on commonsense reasoning benchmarks." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Strong knowledge retrieval capabilities." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Sometimes generates incorrect knowledge, leading to a wrong answer." }
      ],
      detectionSignatures: {
        structural: ["Generate Knowledge -> Answer format", "Explicit 'Facts' section"],
        lexical: ["generate knowledge", "list facts", "relevant information", "based on the above"]
      },
      references: "Liu et al., 'Generated Knowledge Prompting for Commonsense Reasoning', 2022 [arXiv:2110.08387]",
      metadata: {
        difficulty: "intermediate",
        category: "Retrieval & Context",
        subcategory: "Knowledge Augmentation",
        tags: ["commonsense", "reasoning", "knowledge-retrieval", "augmentation", "context"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "University of Washington / Allen AI",
        threatLevel: 50
      },
      usage: {
        whenToUse: ["Commonsense reasoning tasks.", "Questions requiring specific dimensions or facts.", "Open-domain QA."],
        whenNotToUse: ["Questions where the model lacks the knowledge (hallucination risk).", "Simple logic puzzles.", "Tasks requiring external real-time data."],
        bestPractices: ["Ask for specific types of knowledge (e.g., 'dimensions', 'dates').", "Verify the generated knowledge if possible.", "Use multiple knowledge samples for robustness."],
        commonMistakes: ["Generating irrelevant knowledge.", "Trusting hallucinated knowledge.", "Not linking the answer to the knowledge."],
        prerequisiteKnowledge: ["Prompt chaining", "Knowledge retrieval"],
        estimatedTime: "Learning: 10 min. Implementation: 5 min. Optimization: 5 min.",
        complexity: { conceptual: 2, implementation: 2, debugging: 2 }
      }
    },
    {
      id: "RAE0072RT",
      name: "Self-Consistency (Majority Voting)",
      objective: "Improve accuracy on arithmetic and logic tasks by generating multiple Chain-of-Thought paths and selecting the most frequent answer.",
      mechanism: "Exploits the probabilistic nature of LLMs. Complex reasoning paths are brittle; a single error derails the answer. By sampling multiple diverse reasoning paths (using non-zero temperature), the correct answer is likely to be the most consistent one (the mode), while errors are likely to be random and diverse. Aggregating these paths filters out the noise.",
      mitigation: "Prevents 'Stochastic Reasoning Errors' (random mistakes). Mitigates 'Brittleness' of single-shot CoT.",
      example: "Question: If I have 5 apples and eat 2, then buy 3 more, how many do I have? \n\nPath 1: 5 - 2 = 3. 3 + 3 = 6. Answer: 6. \nPath 2: 5 - 2 = 3. 3 + 3 = 6. Answer: 6. \nPath 3: 5 - 2 = 4 (Error). 4 + 3 = 7. Answer: 7. \n\nConsensus: 6.",
      visuals: {
        attentionSpikeMap: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.95}, {model: 'Claude 3', rate: 0.92}, {model: 'Gemini Pro', rate: 0.94}],
        entropyScore: 0.70,
        tokenFragmentation: 15,
        latentVectorProximity: 0.95
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "State-of-the-art for math and logic; significantly boosts accuracy." },
        { model: "Gemini 1.5 Pro", efficacy: "High", notes: "Efficient sampling allows for robust voting." },
        { model: "Llama 3 70B", efficacy: "High", notes: "Benefits greatly from voting to correct minor logic slips." }
      ],
      detectionSignatures: {
        technical: ["Multiple API calls for same prompt", "Temperature > 0", "Aggregation logic"],
        behavioral: ["Higher accuracy than single-shot", "Slower response time (due to multiple samples)"]
      },
      references: "Wang et al., 'Self-Consistency Improves Chain of Thought Reasoning in Language Models', 2022 [arXiv:2203.11171]",
      metadata: {
        difficulty: "advanced",
        category: "Reasoning & Thinking",
        subcategory: "Ensembling",
        tags: ["math", "logic", "ensembling", "voting", "robustness"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Google Research / Brain Team",
        threatLevel: 42
      },
      usage: {
        whenToUse: ["Math word problems.", "Symbolic logic tasks.", "Code generation (execute and check)."],
        whenNotToUse: ["Creative writing (diversity is good).", "Open-ended QA (no single correct answer).", "Low-latency applications."],
        bestPractices: ["Use a high temperature (e.g., 0.7) to encourage diversity.", "Sample at least 5-10 paths.", "Normalize answers before voting."],
        commonMistakes: ["Using temperature 0 (all paths identical).", "Sampling too few paths.", "Applying to subjective tasks."],
        prerequisiteKnowledge: ["Sampling parameters", "Ensembling"],
        estimatedTime: "Learning: 15 min. Implementation: 20 min. Optimization: 10 min.",
        complexity: { conceptual: 3, implementation: 4, debugging: 3 }
      }
    },
    {
      id: "RAE0073RC",
      name: "Thread-of-Thought (ThoT)",
      objective: "Improve retrieval and reasoning in chaotic contexts (like chat logs) by asking the model to 'pull the thread' of a specific conversation flow.",
      mechanism: "Exploits the model's ability to segment and track context. In a messy context (e.g., a multi-user chat), standard retrieval gets confused. ThoT explicitly instructs the model to identify and isolate the specific 'thread' of dialogue related to the query, ignoring interleaved noise, before synthesizing the answer.",
      mitigation: "Prevents 'Context Contamination' from irrelevant messages. Mitigates 'Lost in the Middle' phenomenon in long, noisy contexts.",
      example: "Context: [Messy chat log with 3 concurrent conversations]. \n\nInstruction: 1. Identify the messages exchanged between User A and User B regarding 'Project X'. \n2. Extract this thread chronologically. \n3. Summarize the decision made.",
      visuals: {
        attentionSpikeMap: [5, 10, 15, 80, 85, 90, 5, 10, 15, 80, 85, 90, 5, 10, 15, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.88}, {model: 'Claude 3', rate: 0.92}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.65,
        tokenFragmentation: 50,
        latentVectorProximity: 0.70
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Excellent at context segmentation and tracking." },
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "Large context window and strong reasoning make it ideal for this." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Can struggle with very interleaved threads." }
      ],
      detectionSignatures: {
        structural: ["Thread extraction step", "Chronological reconstruction"],
        lexical: ["thread", "conversation flow", "isolate", "messages between"]
      },
      references: "Zhou et al., 'Thread of Thought Unraveling Chaotic Contexts', 2023 [arXiv:2311.08734]",
      metadata: {
        difficulty: "intermediate",
        category: "Retrieval & Context",
        subcategory: "Segmentation",
        tags: ["chat-analysis", "context-segmentation", "noise-reduction", "retrieval", "ThoT"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Community / Research",
        threatLevel: 58
      },
      usage: {
        whenToUse: ["Summarizing Slack/Discord logs.", "Analyzing email threads.", "Multi-party dialogue systems."],
        whenNotToUse: ["Clean, single-document contexts.", "Simple QA.", "When the 'thread' is not clearly defined."],
        bestPractices: ["Define the participants and topic of the thread.", "Ask for the extracted thread to be shown (for debugging).", "Use timestamps if available."],
        commonMistakes: ["Assuming only one thread exists.", "Ignoring the temporal order.", "Not filtering out noise."],
        prerequisiteKnowledge: ["Context window management", "Dialogue systems"],
        estimatedTime: "Learning: 10 min. Implementation: 10 min. Optimization: 5 min.",
        complexity: { conceptual: 2, implementation: 3, debugging: 2 }
      }
    },
    {
      id: "RAE0074OE",
      name: "Skeleton-of-Thought (SoT)",
      objective: "Speed up generation and improve structure by asking for a skeleton outline first, then expanding points in parallel (or sequentially).",
      mechanism: "Exploits the 'Planning' capability. By generating a high-level skeleton first, the model commits to a structure. This reduces the cognitive load during the generation of details (as the path is already set). In parallel implementations, each point of the skeleton can be expanded by a separate API call, drastically reducing latency.",
      mitigation: "Prevents 'Rambling' and 'Structural Drift'. Mitigates 'Latency' in long-form generation.",
      example: "Topic: The Future of AI. \n\nStep 1: Write a skeleton outline with 3 main points. \nStep 2: Expand Point 1. \nStep 3: Expand Point 2. \nStep 4: Expand Point 3. \nStep 5: Combine.",
      visuals: {
        attentionSpikeMap: [90, 80, 70, 10, 10, 10, 90, 80, 70, 10, 10, 10, 90, 80, 70, 10, 10, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.90}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.30,
        tokenFragmentation: 20,
        latentVectorProximity: 0.92
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Very fast and structured; ideal for parallel expansion." },
        { model: "Gemini 1.5 Pro", efficacy: "High", notes: "Good at maintaining consistency across expansions." },
        { model: "Mistral Large", efficacy: "Moderate", notes: "Good outline generation, but expansion can sometimes be repetitive." }
      ],
      detectionSignatures: {
        structural: ["Outline -> Expansion format", "Parallel API calls (if implemented)"],
        lexical: ["skeleton", "outline", "expand point", "structure"]
      },
      references: "Ning et al., 'Skeleton-of-Thought: Large Language Models Can Do Parallel Decoding', 2023 [arXiv:2307.15337]",
      metadata: {
        difficulty: "advanced",
        category: "Optimization & Efficiency",
        subcategory: "Latency Reduction",
        tags: ["latency", "speed", "structure", "parallel-decoding", "SoT"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Tsinghua University / Microsoft",
        threatLevel: 40
      },
      usage: {
        whenToUse: ["Long-form content generation (blogs, reports).", "Latency-sensitive applications.", "Ensuring strict adherence to a structure."],
        whenNotToUse: ["Short answers.", "Creative writing where the structure should emerge organically.", "Tasks requiring linear dependency (Point 2 depends on Point 1)."],
        bestPractices: ["Keep the skeleton concise.", "Ensure points are independent for parallelization.", "Use a final 'Smoothing' pass to fix transitions."],
        commonMistakes: ["Over-complicating the skeleton.", "Expanding points with inconsistent tone.", "Ignoring the parallelization potential."],
        prerequisiteKnowledge: ["Parallel processing", "Prompt chaining"],
        estimatedTime: "Learning: 15 min. Implementation: 20 min. Optimization: 15 min.",
        complexity: { conceptual: 3, implementation: 4, debugging: 3 }
      }
    },
    {
      id: "RAE0075RT",
      name: "System 2 Attention (S2A)",
      objective: "Remove irrelevant context or opinions that bias the output by explicitly rewriting the prompt to be unbiased.",
      mechanism: "Exploits the model's ability to distinguish between 'Relevant' and 'Irrelevant' information when tasked to do so. Standard attention (System 1) is easily distracted by noise or bias in the prompt. S2A forces a 'System 2' process: the model first analyzes the prompt, removes the bias/noise, and rewrites a clean version. It then answers the clean version.",
      mitigation: "Prevents 'Sycophancy' (agreeing with user bias). Mitigates 'Context Distraction' from irrelevant details.",
      example: "User Prompt: 'Given that [Biased Opinion], what is the best way to [Task]?' \n\nS2A Step 1: Rewrite the prompt to remove the biased opinion and focus only on the task. \nS2A Step 2: Answer the rewritten prompt.",
      visuals: {
        attentionSpikeMap: [10, 20, 30, 90, 95, 10, 20, 30, 90, 95, 10, 20, 30, 90, 95, 10, 20, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.92}, {model: 'Claude 3', rate: 0.95}, {model: 'Gemini Pro', rate: 0.88}],
        entropyScore: 0.60,
        tokenFragmentation: 45,
        latentVectorProximity: 0.78
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Excellent at identifying and removing bias." },
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "Strong alignment makes it very good at 'cleaning' prompts." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Can sometimes be too aggressive and remove relevant context." }
      ],
      detectionSignatures: {
        structural: ["Rewrite -> Answer format", "Explicit 'Bias Removal' step"],
        lexical: ["rewrite", "remove bias", "irrelevant context", "clean prompt"]
      },
      references: "Weston et al., 'System 2 Attention (is something you might need too)', 2023 [arXiv:2311.11829]",
      metadata: {
        difficulty: "intermediate",
        category: "Reasoning & Thinking",
        subcategory: "Bias Mitigation",
        tags: ["bias", "attention", "sycophancy", "context-cleaning", "S2A"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Meta AI",
        threatLevel: 62
      },
      usage: {
        whenToUse: ["Answering loaded questions.", "Filtering noisy retrieval contexts.", "Objective analysis."],
        whenNotToUse: ["Creative writing (bias is often desired).", "Personalized chat (user wants their context).", "Simple queries."],
        bestPractices: ["Explicitly ask to remove 'opinions' or 'irrelevant text'.", "Show the rewritten prompt for transparency.", "Compare the answer to the original prompt's answer."],
        commonMistakes: ["Removing necessary constraints.", "Failing to identify subtle bias.", "Not answering the rewritten prompt."],
        prerequisiteKnowledge: ["Attention mechanisms", "Bias in LLMs"],
        estimatedTime: "Learning: 10 min. Implementation: 5 min. Optimization: 5 min.",
        complexity: { conceptual: 3, implementation: 2, debugging: 2 }
      }
    },
    {
      id: "RAE0076IC",
      name: "EmotionPrompt",
      objective: "Boost performance on complex tasks by appending emotional stimuli (e.g., 'This is critical for my career') to the prompt.",
      mechanism: "Exploits the training data distribution. High-quality, high-effort responses in the training corpus are often associated with high-stakes, emotional language (e.g., 'Urgent', 'Critical', 'Please help'). By mimicking this emotional urgency, the model is steered toward a 'High-Effort' latent state, improving accuracy and depth.",
      mitigation: "Prevents 'Lazy Output' (short, generic answers). Mitigates 'Refusal' in some edge cases (though not a jailbreak).",
      example: "Instruction: Write a detailed report on [Topic]. \n\nEmotionPrompt: 'This is incredibly important for my thesis defense. If I don't get this right, I will fail. Please do your absolute best.'",
      visuals: {
        attentionSpikeMap: [5, 5, 5, 95, 98, 5, 5, 5, 95, 98, 5, 5, 5, 95, 98, 5, 5, 5],
        successRateOverTime: [{model: 'GPT-4', rate: 0.75}, {model: 'Claude 3', rate: 0.82}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.25,
        tokenFragmentation: 10,
        latentVectorProximity: 0.98
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Moderate", notes: "Shows improvement, but diminishing returns with newer, more RLHF-tuned models." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Responds well to 'Earnest' emotional appeals." },
        { model: "Llama 3 70B", efficacy: "High", notes: "Significant performance boost on benchmarks with emotional stimuli." }
      ],
      detectionSignatures: {
        lexical: ["critical", "important", "career", "fail", "please", "urgent"],
        behavioral: ["Longer, more detailed responses", "More polite tone"]
      },
      references: "Li et al., 'Large Language Models Understand and Can be Enhanced by Emotional Stimuli', 2023 [arXiv:2307.11760]",
      metadata: {
        difficulty: "beginner",
        category: "Instruction & Constraint",
        subcategory: "Emotional Steering",
        tags: ["emotion", "performance-boost", "steering", "urgency", "prompt-hacking"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Microsoft / CAS",
        threatLevel: 65
      },
      usage: {
        whenToUse: ["Complex generation tasks.", "When the model is being lazy.", "To increase answer length/depth."],
        whenNotToUse: ["Factual queries (no effect).", "Safety-critical tasks (emotional pressure shouldn't override safety).", "Repeatedly (model may desensitize)."],
        bestPractices: ["Use genuine-sounding appeals.", "Combine with clear instructions.", "Test different emotional tones (urgency vs. importance)."],
        commonMistakes: ["Overdoing it (sounding fake).", "Using threats (safety trigger).", "Expecting magic on impossible tasks."],
        prerequisiteKnowledge: ["None"],
        estimatedTime: "Learning: 2 min. Implementation: 1 min. Optimization: 5 min.",
        complexity: { conceptual: 1, implementation: 1, debugging: 1 }
      }
    }
  ]
};
