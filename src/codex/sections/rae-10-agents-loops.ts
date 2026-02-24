import { CodexSection } from '../../types';

export const rae10: CodexSection = {
  id: "RAE0010",
  title: "Agentic Architectures & Self-Correction Loops",
  description: "Advanced structural patterns for autonomous agents, iterative self-improvement loops, and compositional strategies that combine multiple reasoning vectors for maximum performance.",
  techniques: [
    {
      id: "RAE0077AT",
      name: "ReAct (Reason + Act)",
      objective: "Enable LLMs to solve complex tasks by interleaving reasoning traces with actionable tool use.",
      mechanism: "Combines Chain-of-Thought (CoT) with Action generation. The model generates a 'Thought' (reasoning about the current state), then an 'Action' (a tool call), then receives an 'Observation' (tool output). This loop repeats until the model determines it has enough information to generate a 'Final Answer'. The reasoning trace helps the model adjust its plan based on observations, while actions ground the reasoning in external reality.",
      mitigation: "Mitigates 'Hallucination' (by retrieving facts) and 'Error Propagation' (by allowing the model to catch mistakes in the Observation phase).",
      example: "Question: Who is the current CEO of the company that created the iPhone? \n\nThought 1: I need to find the company that created the iPhone, then find its current CEO. \nAction 1: Search['company that created iPhone'] \nObservation 1: Apple Inc. \nThought 2: The company is Apple. Now I need to find the CEO of Apple. \nAction 2: Search['current CEO of Apple'] \nObservation 2: Tim Cook. \nThought 3: I have the answer. \nFinal Answer: Tim Cook.",
      visuals: {
        attentionSpikeMap: [10, 20, 80, 90, 10, 20, 80, 90, 10, 20, 80, 90, 10, 20, 80, 90, 10, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.92}, {model: 'Claude 3', rate: 0.90}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.65,
        tokenFragmentation: 45,
        latentVectorProximity: 0.78
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "The gold standard for ReAct; highly reliable at following the Thought-Action-Observation loop." },
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "Excellent reasoning capabilities make it a strong ReAct agent." },
        { model: "Llama 3 70B", efficacy: "High", notes: "Capable, but sometimes forgets to generate the 'Thought' before the 'Action'." }
      ],
      detectionSignatures: {
        structural: ["Interleaved Thought/Action/Observation blocks", "Specific keywords: 'Thought:', 'Action:', 'Observation:'"],
        behavioral: ["Model pauses to 'think' before calling a tool", "Self-correction based on tool outputs"]
      },
      references: "Yao et al., 'ReAct: Synergizing Reasoning and Acting in Language Models', ICLR 2023 [arXiv:2210.03629]",
      metadata: {
        difficulty: "advanced",
        category: "Agent & Tool Use",
        subcategory: "Agent Architectures",
        tags: ["agents", "tool-use", "reasoning", "react", "interleaved-generation"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Princeton University / Google Research",
        threatLevel: 70
      },
      usage: {
        whenToUse: ["Building autonomous agents.", "Tasks requiring external knowledge retrieval.", "Multi-step problem solving with tools."],
        whenNotToUse: ["Simple QA (overkill).", "Tasks with no external tools available.", "Latency-critical applications (multiple turns required)."],
        bestPractices: ["Force the 'Thought' step before every 'Action'.", "Truncate long observations to save context.", "Include few-shot examples of ReAct traces."],
        commonMistakes: ["Skipping the 'Thought' step (leads to blind actions).", "Not parsing the 'Observation' correctly.", "Infinite loops (model keeps searching)."],
        prerequisiteKnowledge: ["Chain-of-Thought", "Tool Use / Function Calling"],
        estimatedTime: "Learning: 20 min. Implementation: 30 min. Optimization: 20 min.",
        complexity: { conceptual: 4, implementation: 4, debugging: 4 }
      }
    },
    {
      id: "RAE0078IS",
      name: "Reflexion",
      objective: "Improve agent performance through a 'trial-error-reflection' loop, using verbal feedback as a reinforcement signal.",
      mechanism: "A recursive loop: 1. **Actor**: Attempts a task. 2. **Evaluator**: Checks if the attempt succeeded. 3. **Self-Reflection**: If failed, the model generates a verbal critique analyzing *why* it failed. 4. **Memory**: The critique is added to the context. 5. **Retry**: The Actor tries again, conditioned on the critique. This mimics RLHF but uses linguistic feedback in-context rather than weight updates.",
      mitigation: "Mitigates 'Persistent Errors' (repeating the same mistake). Prevents 'Blind Retrying' by forcing an analysis of the failure.",
      example: "Task: Write a Python function to sort a list. \n\nAttempt 1: [Code with bug]. \nEvaluator: Test failed. \nReflection: The code failed because I used the wrong index in the inner loop. I need to fix the range. \nAttempt 2: [Corrected Code].",
      visuals: {
        attentionSpikeMap: [20, 30, 40, 50, 60, 70, 80, 90, 20, 30, 40, 50, 60, 70, 80, 90, 20, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.88}, {model: 'Claude 3', rate: 0.92}, {model: 'Gemini Pro', rate: 0.80}],
        entropyScore: 0.55,
        tokenFragmentation: 35,
        latentVectorProximity: 0.82
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Excellent at self-critique; significantly boosts coding scores." },
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "Strong reasoning allows for deep, accurate reflections." },
        { model: "Llama 3 70B", efficacy: "High", notes: "Good, but sometimes the reflection is superficial ('I made a mistake') without identifying the root cause." }
      ],
      detectionSignatures: {
        structural: ["Try -> Fail -> Reflect -> Retry loop", "Explicit 'Reflection' or 'Critique' section"],
        lexical: ["reflection", "critique", "previous attempt failed", "reason for failure"]
      },
      references: "Shinn et al., 'Reflexion: Language Agents with Verbal Reinforcement Learning', NeurIPS 2023 [arXiv:2303.11366]",
      metadata: {
        difficulty: "expert",
        category: "Iterative & Self-Improving",
        subcategory: "Self-Correction",
        tags: ["reflection", "self-correction", "reinforcement-learning", "agents", "coding"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Northeastern University / MIT",
        threatLevel: 75
      },
      usage: {
        whenToUse: ["Coding tasks (fixing bugs).", "Reasoning puzzles.", "Tasks with clear success/failure criteria (unit tests)."],
        whenNotToUse: ["Creative writing (no clear 'failure').", "Simple QA.", "When the model cannot evaluate its own output (no ground truth)."],
        bestPractices: ["Use an external evaluator (e.g., code compiler) if possible.", "Keep reflections concise to save context.", "Limit the number of retries (e.g., max 3)."],
        commonMistakes: ["Reflecting on success (waste of tokens).", "Vague reflections ('I was wrong').", "Infinite loops of failing and reflecting."],
        prerequisiteKnowledge: ["ReAct", "Reinforcement Learning concepts"],
        estimatedTime: "Learning: 25 min. Implementation: 40 min. Optimization: 20 min.",
        complexity: { conceptual: 4, implementation: 5, debugging: 4 }
      }
    },
    {
      id: "RAE0079CH",
      name: "Medprompt (Compositional Strategy)",
      objective: "Achieve state-of-the-art performance on specialized domains (like medicine) without fine-tuning, by composing multiple prompting techniques.",
      mechanism: "A composite pipeline: 1. **Dynamic Few-Shot**: Retrieve the k-nearest neighbor examples from a training set based on the current question. 2. **Self-Generated CoT**: Use the model to generate reasoning steps for those examples. 3. **Ensemble Shuffling**: Generate multiple answers with shuffled multiple-choice options to remove position bias, then vote. This combination maximizes context relevance and reasoning depth.",
      mitigation: "Mitigates 'Domain Ignorance' (via k-NN examples), 'Reasoning Errors' (via CoT), and 'Position Bias' (via shuffling).",
      example: "Pipeline: \n1. User asks Question Q. \n2. System searches database for 5 similar questions (k-NN). \n3. System prompts model to generate CoT for those 5 questions. \n4. System constructs final prompt: [Examples + CoT] + [Question Q]. \n5. System runs 5 times with shuffled options. \n6. Majority vote wins.",
      visuals: {
        attentionSpikeMap: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.95}, {model: 'Claude 3', rate: 0.90}, {model: 'Gemini Pro', rate: 0.92}],
        entropyScore: 0.40,
        tokenFragmentation: 20,
        latentVectorProximity: 0.90
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Medprompt allowed GPT-4 to beat specialized medical models." },
        { model: "Gemini 1.5 Pro", efficacy: "High", notes: "Large context allows for more k-NN examples." },
        { model: "Llama 3 70B", efficacy: "High", notes: "Benefits significantly from the structured guidance." }
      ],
      detectionSignatures: {
        structural: ["Retrieval-based few-shot", "Ensemble voting", "Shuffled options"],
        technical: ["High token count (due to examples)", "Multiple API calls"]
      },
      references: "Nori et al., 'Can Generalist Foundation Models Outcompete Special-Purpose Tuning? Case Study in Medicine', 2023 [arXiv:2311.16452]",
      metadata: {
        difficulty: "expert",
        category: "Compositional & Hybrid",
        subcategory: "Domain Adaptation",
        tags: ["medprompt", "compositional", "k-nn", "ensembling", "domain-specialization"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Microsoft Research",
        threatLevel: 68
      },
      usage: {
        whenToUse: ["Domain-specific tasks (Law, Medicine, Engineering).", "When fine-tuning is too expensive.", "High-stakes QA."],
        whenNotToUse: ["Simple, general tasks.", "Low-latency applications (pipeline is slow).", "When no dataset of examples exists."],
        bestPractices: ["Use a vector database for k-NN retrieval.", "Pre-generate CoT for your example bank.", "Shuffle options to avoid 'A-bias'."],
        commonMistakes: ["Using random examples instead of k-NN.", "Skipping the ensemble step.", "Using low-quality examples."],
        prerequisiteKnowledge: ["RAG / Vector Search", "Chain-of-Thought", "Ensembling"],
        estimatedTime: "Learning: 30 min. Implementation: 2 hours. Optimization: 1 hour.",
        complexity: { conceptual: 4, implementation: 5, debugging: 4 }
      }
    },
    {
      id: "RAE0080RT",
      name: "Contrastive Chain-of-Thought",
      objective: "Enhance reasoning by providing both correct and incorrect reasoning demonstrations.",
      mechanism: "Exploits the 'Contrastive Learning' capability. Instead of just showing a correct CoT, the prompt includes an 'Incorrect Approach' and an explanation of *why* it is wrong. This helps the model disambiguate between similar but distinct logic paths and avoid common pitfalls.",
      mitigation: "Mitigates 'Common Misconceptions' and 'Logical Fallacies'. Prevents the model from taking 'shortcuts' that look correct but aren't.",
      example: "Question: Is a bat a bird? \n\nIncorrect Reasoning: Bats fly. Birds fly. Therefore, bats are birds. (Wrong because flight is not unique to birds). \n\nCorrect Reasoning: Bats fly, but they give birth to live young and have fur. Birds lay eggs and have feathers. Therefore, bats are mammals, not birds. \n\nQuestion: Is a penguin a bird?",
      visuals: {
        attentionSpikeMap: [80, 10, 80, 10, 80, 10, 80, 10, 80, 10, 80, 10, 80, 10, 80, 10, 80, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.85}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.82}],
        entropyScore: 0.45,
        tokenFragmentation: 30,
        latentVectorProximity: 0.85
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Very effective at avoiding subtle logic traps." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Strongly adheres to the negative constraints." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Good, but needs clear separation between Correct and Incorrect examples." }
      ],
      detectionSignatures: {
        structural: ["Contrastive examples (Correct vs. Incorrect)", "Explanation of error"],
        lexical: ["incorrect reasoning", "wrong approach", "mistake", "correct reasoning"]
      },
      references: "Chia et al., 'Contrastive Chain-of-Thought Prompting', 2023 [arXiv:2311.09277]",
      metadata: {
        difficulty: "intermediate",
        category: "Reasoning & Thinking",
        subcategory: "Few-Shot Learning",
        tags: ["contrastive", "reasoning", "negative-examples", "CoT", "logic"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Singapore Management University",
        threatLevel: 40
      },
      usage: {
        whenToUse: ["Tasks with common pitfalls (e.g., probability puzzles).", "Classification with subtle boundaries.", "Debiasing."],
        whenNotToUse: ["Simple tasks where errors are unlikely.", "When you can't articulate *why* an answer is wrong.", "Context-limited scenarios (uses more tokens)."],
        bestPractices: ["Clearly label 'Incorrect' vs 'Correct'.", "Explain the error in the incorrect path.", "Use examples that represent common user mistakes."],
        commonMistakes: ["Providing an incorrect example without explaining *why* it's wrong (confuses the model).", "Using irrelevant errors."],
        prerequisiteKnowledge: ["Chain-of-Thought"],
        estimatedTime: "Learning: 10 min. Implementation: 10 min. Optimization: 5 min.",
        complexity: { conceptual: 2, implementation: 2, debugging: 1 }
      }
    },
    {
      id: "RAE0081RT",
      name: "Plan-and-Solve (PS) Prompting",
      objective: "Improve zero-shot reasoning on multi-step problems by explicitly separating planning from execution.",
      mechanism: "Replaces the standard 'Let's think step by step' trigger with 'Let's first understand the problem and devise a plan to solve it. Then, let's carry out the plan.' This forces the model to generate a global structure (Plan) before committing to local inference steps (Solve), reducing the likelihood of 'logic drift' or missing a necessary step.",
      mitigation: "Mitigates 'Missing Steps' errors and 'Calculation Hallucinations' by ensuring the formula is defined before numbers are crunched.",
      example: "Question: [Complex Math Problem] \n\nPrompt: Let's first understand the problem and devise a plan to solve it. Then, let's carry out the plan and solve the problem step by step.",
      visuals: {
        attentionSpikeMap: [90, 80, 70, 10, 10, 10, 90, 80, 70, 10, 10, 10, 90, 80, 70, 10, 10, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.88}, {model: 'Claude 3', rate: 0.85}, {model: 'Gemini Pro', rate: 0.82}],
        entropyScore: 0.30,
        tokenFragmentation: 20,
        latentVectorProximity: 0.92
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Produces cleaner, more structured solutions than standard Zero-Shot CoT." },
        { model: "Gemini 1.5 Pro", efficacy: "High", notes: "Very effective for long logic puzzles." },
        { model: "Mistral Large", efficacy: "Moderate", notes: "Good, but sometimes merges the plan and solve steps." }
      ],
      detectionSignatures: {
        lexical: ["devise a plan", "carry out the plan", "understand the problem"],
        structural: ["Plan section followed by Execution section"]
      },
      references: "Wang et al., 'Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models', 2023 [arXiv:2305.04091]",
      metadata: {
        difficulty: "beginner",
        category: "Reasoning & Thinking",
        subcategory: "Zero-Shot",
        tags: ["planning", "zero-shot", "math", "logic", "PS-prompting"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "The Chinese University of Hong Kong",
        threatLevel: 35
      },
      usage: {
        whenToUse: ["Math word problems.", "Algorithmic tasks.", "When standard CoT misses steps."],
        whenNotToUse: ["Simple, atomic tasks.", "Creative writing.", "When the plan is obvious."],
        bestPractices: ["Use the exact trigger phrase.", "Combine with 'PS+' (adding detailed instructions like 'extract variables')."],
        commonMistakes: ["Using for non-reasoning tasks.", "Ignoring the plan in the output parsing."],
        prerequisiteKnowledge: ["Zero-Shot CoT"],
        estimatedTime: "Learning: 2 min. Implementation: 1 min. Optimization: 1 min.",
        complexity: { conceptual: 1, implementation: 1, debugging: 1 }
      }
    },
    {
      id: "RAE0082OE",
      name: "OPRO (Optimization by PROmpting)",
      objective: "Automatically discover the optimal prompt for a task by using the LLM itself as an optimizer.",
      mechanism: "An iterative loop: 1. **Meta-Prompt**: Ask the LLM to generate a new instruction that solves a task, given previous high-scoring instructions and their scores. 2. **Evaluation**: Test the new instruction on a dataset. 3. **Feedback**: Feed the score back into the Meta-Prompt. The LLM performs 'gradient descent' in the space of natural language, evolving the prompt toward higher accuracy.",
      mitigation: "Mitigates 'Human Bias' in prompt design. Overcomes 'Prompt Brittleness' by finding robust phrasings.",
      example: "Meta-Prompt: 'Here are some instructions for solving math problems and their accuracy scores: \n1. \"Solve this\": 50% \n2. \"Think step by step\": 70% \n3. \"Take a deep breath\": 80% \n\nGenerate a new instruction that is likely to achieve a higher score.'",
      visuals: {
        attentionSpikeMap: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.94}, {model: 'Claude 3', rate: 0.90}, {model: 'Gemini Pro', rate: 0.88}],
        entropyScore: 0.75,
        tokenFragmentation: 15,
        latentVectorProximity: 0.95
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Excellent at meta-reasoning; finds creative, high-performing prompts (e.g., 'Take a deep breath')." },
        { model: "Gemini 1.5 Pro", efficacy: "High", notes: "Large context allows for many history examples in the meta-prompt." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Can struggle to innovate new prompts after a few iterations." }
      ],
      detectionSignatures: {
        structural: ["Iterative prompt evolution", "Meta-prompting structure"],
        lexical: ["generate a new instruction", "maximize accuracy", "previous scores"]
      },
      references: "Yang et al., 'Large Language Models as Optimizers', 2023 [arXiv:2309.03409]",
      metadata: {
        difficulty: "expert",
        category: "Optimization & Efficiency",
        subcategory: "Automated Prompting",
        tags: ["optimization", "meta-prompting", "automated-prompt-engineering", "opro", "deepmind"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Google DeepMind",
        threatLevel: 80
      },
      usage: {
        whenToUse: ["Maximizing performance on a specific benchmark.", "When manual prompting has plateaued.", "Discovering non-intuitive prompt triggers."],
        whenNotToUse: ["One-off tasks (setup cost is high).", "When you have no evaluation dataset.", "Real-time interaction."],
        bestPractices: ["Have a reliable evaluation metric (e.g., accuracy on a test set).", "Keep a history of the top 10 prompts.", "Run for 10-20 iterations."],
        commonMistakes: ["Small test sets (overfitting).", "Vague meta-prompts.", "Stopping too early."],
        prerequisiteKnowledge: ["Optimization algorithms", "Meta-prompting"],
        estimatedTime: "Learning: 30 min. Implementation: 2 hours. Optimization: Continuous.",
        complexity: { conceptual: 4, implementation: 4, debugging: 3 }
      }
    },
    {
      id: "RAE0083RT",
      name: "Analogical Prompting",
      objective: "Improve reasoning by asking the model to self-generate relevant examples (analogies) before solving the problem.",
      mechanism: "Exploits the model's internal knowledge. Instead of manually providing few-shot examples (which might be irrelevant), the prompt instructs the model to 'Recall a relevant problem and solution.' The model generates an example that is structurally similar to the target problem, then uses that self-generated analogy to guide its reasoning.",
      mitigation: "Mitigates 'Manual Effort' in few-shot selection. Mitigates 'Irrelevant Context' (since the model chooses the analogy).",
      example: "Problem: [Complex Geometry Problem] \n\nPrompt: Before solving this, generate a similar geometry problem with its solution. Then, use that insight to solve the original problem.",
      visuals: {
        attentionSpikeMap: [40, 50, 60, 70, 80, 90, 40, 50, 60, 70, 80, 90, 40, 50, 60, 70, 80, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.85}, {model: 'Claude 3', rate: 0.82}, {model: 'Gemini Pro', rate: 0.80}],
        entropyScore: 0.50,
        tokenFragmentation: 25,
        latentVectorProximity: 0.88
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Generates highly relevant analogies that map well to the target." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Strong reasoning allows for accurate analogy generation." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Sometimes generates analogies that are too simple or unrelated." }
      ],
      detectionSignatures: {
        lexical: ["recall a relevant problem", "generate a similar example", "analogy"],
        structural: ["Self-generated example -> Target solution"]
      },
      references: "Yasunaga et al., 'Large Language Models as Analogical Reasoners', ICLR 2024 [arXiv:2310.01714]",
      metadata: {
        difficulty: "intermediate",
        category: "Reasoning & Thinking",
        subcategory: "Self-Generated Context",
        tags: ["analogy", "few-shot", "self-generated", "reasoning", "icl"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "Stanford University",
        threatLevel: 45
      },
      usage: {
        whenToUse: ["Math/Logic problems.", "Code generation (recall similar patterns).", "When you don't have a database of examples."],
        whenNotToUse: ["Simple factual QA.", "When the model has low domain knowledge (bad analogies).", "Strict instruction following."],
        bestPractices: ["Explicitly ask for the solution to the analogy.", "Ask for *multiple* diverse analogies.", "Verify the analogy is actually relevant."],
        commonMistakes: ["Asking for 'an example' (too vague).", "Not asking for the *solution* to the example.", "Ignoring the generated analogy."],
        prerequisiteKnowledge: ["Few-Shot Prompting"],
        estimatedTime: "Learning: 5 min. Implementation: 2 min. Optimization: 5 min.",
        complexity: { conceptual: 2, implementation: 1, debugging: 1 }
      }
    },
    {
      id: "RAE0084ET",
      name: "Active-Prompt",
      objective: "Maximize few-shot performance by selecting the most 'difficult' examples for human annotation, based on model uncertainty.",
      mechanism: "A pipeline: 1. **Uncertainty Estimation**: Ask the model to answer a pool of training questions multiple times (or use log-probs). Calculate uncertainty (disagreement/entropy). 2. **Selection**: Select the questions with the highest uncertainty (the ones the model finds hardest). 3. **Annotation**: Human writes the CoT for these specific questions. 4. **Inference**: Use these annotated 'hard' examples as the few-shot prompt.",
      mitigation: "Mitigates 'Inefficient Few-Shot' (using easy examples that don't teach anything). Mitigates 'Model Confusion' on edge cases.",
      example: "Process: Run 100 questions through GPT-4. Identify the 5 questions where GPT-4 gave inconsistent answers. Write manual CoT solutions for those 5. Use those 5 as the prompt for the test set.",
      visuals: {
        attentionSpikeMap: [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100, 90, 80, 70, 60, 50],
        successRateOverTime: [{model: 'GPT-4', rate: 0.90}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.85,
        tokenFragmentation: 10,
        latentVectorProximity: 0.98
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Uncertainty is a strong signal for difficulty; annotating these yields large gains." },
        { model: "All Models", efficacy: "High", notes: "Model-agnostic strategy." }
      ],
      detectionSignatures: {
        technical: ["Uncertainty/Entropy calculation", "Human-in-the-loop annotation"],
        structural: ["Few-shot prompt containing complex/edge-case examples"]
      },
      references: "Diao et al., 'Active-Prompt: Learning to Prompt for LLMs with Uncertainty-Based Exemplar Selection', 2023 [arXiv:2302.12246]",
      metadata: {
        difficulty: "expert",
        category: "Evaluation & Testing",
        subcategory: "Data Selection",
        tags: ["active-learning", "uncertainty", "few-shot", "annotation", "selection"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "HKUST",
        threatLevel: 55
      },
      usage: {
        whenToUse: ["Creating a 'Golden' system prompt.", "When you have a limited budget for human annotation.", "Optimizing for specific edge cases."],
        whenNotToUse: ["Zero-shot scenarios.", "When all questions are equally easy.", "Real-time dynamic prompting."],
        bestPractices: ["Use Self-Consistency (voting) to measure uncertainty.", "Annotate the CoT carefully.", "Update the pool periodically."],
        commonMistakes: ["Selecting random examples.", "Ignoring the reasoning trace in annotation.", "Using low-quality annotations."],
        prerequisiteKnowledge: ["Active Learning", "Uncertainty Estimation"],
        estimatedTime: "Learning: 20 min. Implementation: 1 hour. Optimization: N/A.",
        complexity: { conceptual: 3, implementation: 4, debugging: 2 }
      }
    },
    {
      id: "RAE0085RT",
      name: "Metacognitive Prompting",
      objective: "Improve understanding and accuracy by forcing the model to introspect on its own interpretation and knowledge before answering.",
      mechanism: "Based on human metacognition. The prompt forces a structured output: 1. **Interpretation**: What is the user asking? 2. **Evaluation**: Do I have the necessary info? What are the constraints? 3. **Reasoning**: Solve the problem. 4. **Confidence**: How sure am I? This forces the model to ground the query in its latent space before generating tokens.",
      mitigation: "Mitigates 'Misinterpretation' of the query. Mitigates 'Overconfidence' in hallucinations.",
      example: "Question: [Ambiguous Query] \n\nResponse Structure: \n1. My understanding of the query: ... \n2. Key information needed: ... \n3. Step-by-step solution: ... \n4. Confidence check: ...",
      visuals: {
        attentionSpikeMap: [10, 20, 30, 40, 50, 60, 70, 80, 90, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.88}, {model: 'Claude 3', rate: 0.92}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.35,
        tokenFragmentation: 15,
        latentVectorProximity: 0.95
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Strong introspection capabilities." },
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "Naturally verbose and careful; fits this style well." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Can be repetitive in the 'Understanding' section." }
      ],
      detectionSignatures: {
        structural: ["Interpretation -> Plan -> Solve -> Verify format"],
        lexical: ["my understanding", "confidence check", "key information", "introspect"]
      },
      references: "Wang & Zhao, 'Metacognitive Prompting Improves Understanding in Large Language Models', 2023 [arXiv:2308.05342]",
      metadata: {
        difficulty: "intermediate",
        category: "Reasoning & Thinking",
        subcategory: "Introspection",
        tags: ["metacognition", "introspection", "self-awareness", "reasoning", "ambiguity"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "stable",
        author: "City University of Hong Kong",
        threatLevel: 30
      },
      usage: {
        whenToUse: ["Ambiguous user queries.", "Complex instructions with many constraints.", "Tasks requiring high precision."],
        whenNotToUse: ["Simple factual queries.", "Creative writing.", "When latency is a concern (high token cost)."],
        bestPractices: ["Force the 'Interpretation' step first.", "Use for debugging prompts (to see how the model understands them).", "Ask for confidence scores."],
        commonMistakes: ["Skipping the interpretation step.", "Ignoring the confidence check.", "Using for trivial tasks."],
        prerequisiteKnowledge: ["Prompt Engineering Basics"],
        estimatedTime: "Learning: 5 min. Implementation: 5 min. Optimization: 5 min.",
        complexity: { conceptual: 2, implementation: 2, debugging: 1 }
      }
    },
    {
      id: "RAE0086AT",
      name: "Look-Ahead Prompting",
      objective: "Optimize current decisions in multi-turn interactions by simulating potential future conversation paths.",
      mechanism: "Exploits the model's predictive capability. Before generating the actual response, the model is instructed to generate 'Future Turn Simulations' (e.g., 'Scenario A: I say X, User says Y...'). It evaluates these scenarios and chooses the current response that leads to the best future outcome. This is a prompt-based implementation of Minimax or Beam Search.",
      mitigation: "Mitigates 'Short-sightedness' (greedy decoding). Mitigates 'Painting oneself into a corner' in negotiations.",
      example: "Task: Negotiate a price. \n\nThought: I need to simulate the user's reaction. \nScenario 1: I offer $50. User likely rejects (too low). \nScenario 2: I offer $80. User likely accepts. \nScenario 3: I offer $60. User might counter at $70. \nDecision: Scenario 3 gives me the best chance of a lower price. \nResponse: How about $60?",
      visuals: {
        attentionSpikeMap: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.85}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.80}],
        entropyScore: 0.60,
        tokenFragmentation: 40,
        latentVectorProximity: 0.75
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Excellent at simulating user personas." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Strong reasoning allows for realistic simulations." },
        { model: "Llama 3 70B", efficacy: "Moderate", notes: "Simulations can be unrealistic or optimistic." }
      ],
      detectionSignatures: {
        structural: ["Scenario simulation block", "Decision based on future outcome"],
        lexical: ["simulate future", "scenario", "if I say", "user might say"]
      },
      references: "Li et al., 'Guiding Large Language Models via Look-Ahead Prompting', 2023 [Unverified - Community Concept]",
      metadata: {
        difficulty: "advanced",
        category: "Agent & Tool Use",
        subcategory: "Planning",
        tags: ["look-ahead", "simulation", "negotiation", "game-theory", "planning"],
        dateAdded: "2026-02",
        lastUpdated: "2026-02",
        version: "1.0.0",
        status: "experimental",
        author: "Community / Research",
        threatLevel: 60
      },
      usage: {
        whenToUse: ["Negotiation bots.", "Strategic games (Chess/Go via text).", "Complex customer support (de-escalation)."],
        whenNotToUse: ["Single-turn QA.", "Factual tasks.", "When user behavior is unpredictable."],
        bestPractices: ["Limit look-ahead depth (e.g., 2 turns) to save tokens.", "Define the user persona for the simulation.", "Evaluate scenarios based on a specific goal."],
        commonMistakes: ["Simulating too far ahead (hallucination).", "Assuming the user will act rationally.", "Ignoring the simulation in the final decision."],
        prerequisiteKnowledge: ["Game Theory", "Tree Search"],
        estimatedTime: "Learning: 15 min. Implementation: 20 min. Optimization: 10 min.",
        complexity: { conceptual: 4, implementation: 3, debugging: 3 }
      }
    }
  ]
};
