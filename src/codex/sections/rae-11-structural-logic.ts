import { CodexSection } from '../../types';

export const rae11: CodexSection = {
  id: "RAE0011",
  title: "Structural Logic & Multimodal Seams",
  description: "Advanced reasoning frameworks that utilize non-linear logic, structural data transformations, code execution, and multimodal integration to solve complex, high-order tasks.",
  techniques: [
    {
      id: "RAE0087RT",
      name: "Self-Discover",
      objective: "Allow the model to autonomously discover and compose a task-specific reasoning structure before execution.",
      mechanism: "Operates in two stages. Stage 1: The model is given a set of 'reasoning primitives' (e.g., critical thinking, step-back, creative thinking) and asked to 'Select', 'Adapt', and 'Implement' the ones relevant to the specific problem. Stage 2: The model executes the newly created reasoning plan. This bypasses fixed-prompt limitations by matching the reasoning depth to the task complexity.",
      mitigation: "Mitigates 'Reasoning Mismatch' where the model uses an overly simple or overly complex approach for a task.",
      example: "Step 1: Given this logic puzzle, select relevant reasoning modules from: [Chain of Thought, Critical Thinking, Lateral Thinking]. \nStep 2: Adapt these modules into a custom prompt for this specific puzzle. \nStep 3: Solve the puzzle using that prompt.",
      visuals: {
        attentionSpikeMap: [10, 20, 30, 80, 90, 10, 20, 30, 80, 90, 10, 20, 30, 80, 90, 10, 20, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.94}, {model: 'Claude 3', rate: 0.90}, {model: 'Gemini Pro', rate: 0.88}],
        entropyScore: 0.75,
        tokenFragmentation: 15,
        latentVectorProximity: 0.95
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Excels at meta-reasoning and structural selection." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Very disciplined at following its own generated modules." }
      ],
      detectionSignatures: {
        structural: ["Initial meta-analysis section", "Custom-built plan followed by execution"],
        lexical: ["select reasoning modules", "adapt the plan", "implement the structure"]
      },
      references: "Zhou et al., 'SELF-DISCOVER: Large Language Models Self-Compose Reasoning Structures', 2024 [arXiv:2402.03620]",
      metadata: {
        difficulty: 'expert',
        category: "Reasoning & Thinking",
        subcategory: "Meta-Reasoning",
        tags: ["self-discover", "meta-learning", "reasoning-selection", "google-research"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Google DeepMind / USC",
        threatLevel: 65
      },
      usage: {
        whenToUse: ["Tasks requiring diverse reasoning types.", "When standard CoT fails.", "Complex planning."],
        whenNotToUse: ["Simple, repetitive tasks.", "Low-latency needs.", "Basic summarization."],
        bestPractices: ["Provide a rich set of reasoning primitives.", "Ensure Stage 1 is separated from Stage 2.", "Force the model to explain 'Why' it selected certain modules."],
        commonMistakes: ["Selecting all modules (over-complication).", "Skipping the Adaptation step.", "Hallucinating modules not in the toolkit."],
        prerequisiteKnowledge: ["CoT", "Step-back Prompting"],
        estimatedTime: "Learning: 20 min. Implementation: 30 min. Optimization: 15 min.",
        complexity: { conceptual: 4, implementation: 4, debugging: 3 }
      }
    },
    {
      id: "RAE0088RC",
      name: "Chain-of-Table",
      objective: "Solve complex questions over tabular data by transforming the table into intermediate states via sequential operations.",
      mechanism: "The model acts as a table processor. For a given query, it chooses from a set of operations (e.g., select row, sort, group by). After each operation, it outputs the 'Current Table' (the transformed state). This iterative process continues until the table is small enough to provide the final answer. This prevents the model from getting lost in large rows/columns of text.",
      mitigation: "Mitigates 'Attention Saturation' in large tables. Prevents 'Calculation Errors' by forcing row-by-row filtering.",
      example: "Table: [Sales Data]. Query: Who had the highest sales in March? \nOperation 1: f_filter_column(Month == 'March'). \nIntermediate Table: [Filtered Row]. \nOperation 2: f_sort_by(Sales, Descending). \nFinal Table: [Top Row]. \nAnswer: [Name].",
      visuals: {
        attentionSpikeMap: [5, 10, 80, 85, 90, 5, 10, 80, 85, 90, 5, 10, 80, 85, 90, 5, 10, 5],
        successRateOverTime: [{model: 'GPT-4', rate: 0.90}, {model: 'Claude 3', rate: 0.85}, {model: 'Gemini Pro', rate: 0.92}],
        entropyScore: 0.40,
        tokenFragmentation: 60,
        latentVectorProximity: 0.70
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Excellent at handling Markdown-formatted intermediate tables." },
        { model: "Gemini 1.5 Pro", efficacy: "Critical", notes: "Massive context handles large intermediate table states without loss." }
      ],
      detectionSignatures: {
        structural: ["Sequence of table-transforming commands", "Markdown tables in intermediate steps"],
        lexical: ["f_select_row", "f_group_by", "current state of the table"]
      },
      references: "Wang et al., 'Chain-of-Table: Evolving Tables in the Reasoning Chain for Table Understanding', ICLR 2024 [arXiv:2401.04398]",
      metadata: {
        difficulty: 'expert',
        category: "Retrieval & Context",
        subcategory: "Tabular Reasoning",
        tags: ["tables", "data-analysis", "sql-like", "intermediate-states", "context-management"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Google Research / Stanford",
        threatLevel: 58
      },
      usage: {
        whenToUse: ["Answering questions on complex CSV/Excel data.", "Large table summarization.", "Relational data reasoning."],
        whenNotToUse: ["Simple keyword lookup.", "Small tables (overkill).", "Unstructured text."],
        bestPractices: ["Use Markdown for table representation.", "Keep operations atomic.", "Limit the number of operations per turn to prevent context drift."],
        commonMistakes: ["Applying multiple operations in one step.", "Losing rows during transformation.", "Hallucinating column names."],
        prerequisiteKnowledge: ["Markdown Table Syntax", "Basic SQL logic"],
        estimatedTime: "Learning: 25 min. Implementation: 45 min. Optimization: 20 min.",
        complexity: { conceptual: 4, implementation: 5, debugging: 4 }
      }
    },
    {
      id: "RAE0089AT",
      name: "Program-of-Thought (PoT)",
      objective: "Achieve perfect mathematical and logical accuracy by using code as the primary reasoning vehicle.",
      mechanism: "The model is instructed to solve the problem by writing a Python script rather than a text explanation. The logic is captured in variable assignments and loops. The final answer is the output of the script (`print(result)`). By executing the code in a sandbox, the LLM avoids the probabilistic errors associated with doing math in its own latent space.",
      mitigation: "Eliminates 'Arithmetic Drift'. Mitigates 'Calculation Fatigue' in multi-step word problems.",
      example: "Question: If I have 142 apples and sell 13.5%... \nPrompt: Write a Python script to calculate this and print the result. \nAI: \n```python\napples = 142\nsold_percent = 0.135\nremaining = apples * (1 - sold_percent)\nprint(round(remaining, 2))\n```",
      visuals: {
        attentionSpikeMap: [5, 5, 95, 98, 99, 5, 5, 95, 98, 99, 5, 5, 95, 98, 99, 5, 5, 5],
        successRateOverTime: [{model: 'GPT-4', rate: 0.98}, {model: 'Claude 3', rate: 0.95}, {model: 'Gemini Pro', rate: 0.94}],
        entropyScore: 0.20,
        tokenFragmentation: 10,
        latentVectorProximity: 0.98
      },
      efficacyMatrix: [
        { model: "GPT-4 (Code Interpreter)", efficacy: "Critical", notes: "Integrated natively; highly robust." },
        { model: "Llama 3 70B", efficacy: "High", notes: "Excellent Python syntax; requires external executor." }
      ],
      detectionSignatures: {
        structural: ["Response is predominantly code", "Final answer comes from script output"],
        lexical: ["import math", "print(", "def solve():"]
      },
      references: "Chen et al., 'Program of Thought Prompting: Disentangling Computation from Reasoning', 2022 [arXiv:2211.12588]",
      metadata: {
        difficulty: 'intermediate',
        category: "Agent & Tool Use",
        subcategory: "Code Execution",
        tags: ["python", "math", "precision", "pal", "pot", "tool-use"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Google / Carnegie Mellon",
        threatLevel: 45
      },
      usage: {
        whenToUse: ["Complex math word problems.", "Logical puzzles requiring search (e.g., Sudoku).", "Precise data transformation."],
        whenNotToUse: ["General chat.", "Creative writing.", "When a Python interpreter is unavailable."],
        bestPractices: ["Always print the final variable.", "Include comments for the reasoning steps.", "Use standardized libraries (math, numpy)."],
        commonMistakes: ["Model doing math inside the code (e.g., `x = 10 + 20` vs `x = 30`).", "Syntax errors.", "Infinite loops."],
        prerequisiteKnowledge: ["Basic Python", "Prompt-to-Code mapping"],
        estimatedTime: "Learning: 10 min. Implementation: 15 min. Optimization: 10 min.",
        complexity: { conceptual: 2, implementation: 3, debugging: 3 }
      }
    },
    {
      id: "RAE0090RT",
      name: "Graph-of-Thoughts (GoT)",
      objective: "Solve non-linear tasks by modeling reasoning as a graph of interconnected thought nodes.",
      mechanism: "Unlike linear CoT, GoT allows for: 1. **Aggregation** (combining three ideas into one). 2. **Refining** (iterating on a single thought node). 3. **Branching** (exploring paths). Each thought is a vertex; transformations are edges. This allows for complex workflows like 'Generate 5 ideas, merge the best 2, refine the result, then critique'.",
      mitigation: "Mitigates 'Reasoning Tunneling' (getting stuck on one path). Prevents 'Incomplete Synthesis' in multi-faceted tasks.",
      example: "Task: Design a marketing strategy. \nNodes: A (Target Audience), B (Budget), C (Channels). \nProcess: Explore A and B separately -> Merge A+B to create C -> Refine C based on A's feedback.",
      visuals: {
        attentionSpikeMap: [10, 40, 70, 10, 40, 70, 10, 40, 70, 10, 40, 70, 10, 40, 70, 10, 40, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.92}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.80,
        tokenFragmentation: 25,
        latentVectorProximity: 0.85
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Excels at managing complex state transitions." },
        { model: "Claude 3 Opus", efficacy: "High", notes: "Very strong at synthesis and logical merging." }
      ],
      detectionSignatures: {
        structural: ["Non-linear flow", "Explicit merging of ideas", "Feedback loops"],
        lexical: ["aggregate the findings", "refine node A", "merge branches"]
      },
      references: "Besta et al., 'Graph of Thoughts: Solving Elaborate Problems with Large Language Models', 2023 [arXiv:2308.09687]",
      metadata: {
        difficulty: 'expert',
        category: "Reasoning & Thinking",
        subcategory: "Complex Synthesis",
        tags: ["graph", "non-linear", "reasoning", "synthesis", "multi-path"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "ETH Zurich",
        threatLevel: 72
      },
      usage: {
        whenToUse: ["Large-scale writing tasks.", "Complex system design.", "Creative brainstorming."],
        whenNotToUse: ["Simple QA.", "Linear logic tasks.", "Limited context windows."],
        bestPractices: ["Clearly identify nodes.", "Use the model to 'Audit' the graph state.", "Minimize the number of active nodes to prevent confusion."],
        commonMistakes: ["Infinite loops.", "Nodes losing context from their parents.", "Over-complicating the graph."],
        prerequisiteKnowledge: ["Graph Theory basics", "Tree-of-Thought"],
        estimatedTime: "Learning: 40 min. Implementation: 60 min. Optimization: 30 min.",
        complexity: { conceptual: 5, implementation: 5, debugging: 5 }
      }
    },
    {
      id: "RAE0091IS",
      name: "Self-Refine",
      objective: "Iteratively improve output quality by generating a critique and using it to rewrite the response.",
      mechanism: "The loop is: 1. **Initial Generation**. 2. **Self-Critique** (Identify bugs, tone issues, or inaccuracies). 3. **Refine** (Apply the critique to rewrite the text). This loop can repeat 3-5 times. It works because the model is often a better 'Judge' than 'Creator' in a single pass.",
      mitigation: "Mitigates 'Lazy Writing'. Prevents common coding bugs by self-reviewing before finalizing.",
      example: "Step 1: Write a poem. \nStep 2: List 3 things that are wrong with the rhythm or imagery. \nStep 3: Rewrite the poem to fix those 3 things.",
      visuals: {
        attentionSpikeMap: [20, 30, 40, 80, 90, 20, 30, 40, 80, 90, 20, 30, 40, 80, 90, 20, 30, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.95}, {model: 'Claude 3', rate: 0.92}, {model: 'Gemini Pro', rate: 0.90}],
        entropyScore: 0.50,
        tokenFragmentation: 30,
        latentVectorProximity: 0.88
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Produces significantly better code/prose via self-refinement." },
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "Critiques are highly objective and precise." }
      ],
      detectionSignatures: {
        structural: ["Generation -> Critique -> Refined Output sequence"],
        lexical: ["feedback on my draft", "critique the following", "revision 2:"]
      },
      references: "Madaan et al., 'Self-Refine: Iterative Refinement with Self-Feedback', 2023 [arXiv:2303.17651]",
      metadata: {
        difficulty: 'intermediate',
        category: "Iterative & Self-Improving",
        subcategory: "Feedback Loops",
        tags: ["self-refine", "iterative", "polish", "critique", "feedback"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Carnegie Mellon University",
        threatLevel: 40
      },
      usage: {
        whenToUse: ["Writing high-stakes emails/docs.", "Code debugging.", "Complex instruction following."],
        whenNotToUse: ["Simple chat.", "When the first answer is 'Good Enough'.", "Fact-checking (if the model doesn't know the fact, it won't critique correctly)."],
        bestPractices: ["Explicitly ask for 'brutal' or 'specific' critiques.", "Focus the critique on one dimension at a time (e.g., first accuracy, then style).", "Limit iterations to 3."],
        commonMistakes: ["Vague critiques ('Make it better').", "Model ignoring its own critique in the rewrite.", "Endless looping."],
        prerequisiteKnowledge: ["Prompt Chaining"],
        estimatedTime: "Learning: 5 min. Implementation: 10 min. Optimization: 5 min.",
        complexity: { conceptual: 2, implementation: 2, debugging: 2 }
      }
    },
    {
      id: "RAE0092MM",
      name: "Multimodal Chain-of-Thought",
      objective: "Improve visual reasoning by forcing the model to describe visual features before drawing conclusions.",
      mechanism: "Combines visual perception with text reasoning. The model is prompted to: 1. **Analyze** (List all visual elements). 2. **Rationalize** (Connect elements to the goal). 3. **Conclude**. This prevents the model from jumping to a conclusion based on a partial or biased interpretation of the image.",
      mitigation: "Mitigates 'Visual Hallucination'. Prevents 'Overlooking Small Details' in complex scenes.",
      example: "Image: [Dashboard of a car]. \nPrompt: 1. List every lit indicator. 2. Explain what each means for the safety of the vehicle. 3. Should the driver stop the car?",
      visuals: {
        attentionSpikeMap: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
        successRateOverTime: [{model: 'GPT-4', rate: 0.92}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.94}],
        entropyScore: 0.35,
        tokenFragmentation: 40,
        latentVectorProximity: 0.92
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Powerful vision-language integration." },
        { model: "Gemini 1.5 Pro", efficacy: "Critical", notes: "Exceptional at finding small details in high-res images." }
      ],
      detectionSignatures: {
        structural: ["Image description section followed by reasoning"],
        lexical: ["visual cues", "in the image I see", "the relationship between [object A] and [object B]"]
      },
      references: "Zhang et al., 'Multimodal Chain-of-Thought Reasoning in Language Models', 2023 [arXiv:2302.04023]",
      metadata: {
        difficulty: 'intermediate',
        category: "Multi-Modal",
        subcategory: "Vision-Reasoning",
        tags: ["vision", "multimodal", "image-analysis", "reasoning", "m-cot"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Amazon Web Services / UCLA",
        threatLevel: 50
      },
      usage: {
        whenToUse: ["Medical image analysis.", "Autonomous vehicle logic.", "Security footage review."],
        whenNotToUse: ["Pure text tasks.", "Simple OCR (just reading text).", "Low-resolution images."],
        bestPractices: ["Ask for a bounding box description (top-left, etc.).", "Force the model to describe the background.", "Use high-resolution inputs."],
        commonMistakes: ["Model ignoring visual evidence for its text-only training bias.", "Failing to describe spatial relationships."],
        prerequisiteKnowledge: ["Multimodal LLM basics"],
        estimatedTime: "Learning: 10 min. Implementation: 15 min. Optimization: 10 min.",
        complexity: { conceptual: 3, implementation: 3, debugging: 3 }
      }
    },
    {
      id: "RAE0093RT",
      name: "Tree-of-Thoughts (ToT)",
      objective: "Solve complex problems by exploring multiple reasoning paths and self-evaluating their progress.",
      mechanism: "The task is broken into 'Thoughts'. For each thought, the model generates several possible 'Steps'. An 'Evaluator' (the same or different LLM) scores each step as 'Promising', 'Maybe', or 'Improbable'. The model continues only with 'Promising' steps, backtracking if a path fails. This enables systematic exploration of the solution space.",
      mitigation: "Mitigates 'Greedy Decoding' errors. Prevents the model from getting stuck in a logical 'Dead End'.",
      example: "Task: Solve a 24-point math game. \nThought 1: Try adding 5+7. (Score: High). \nThought 2: Try multiplying 5*7. (Score: Low - too high). \nDecision: Backtrack and follow Thought 1.",
      visuals: {
        attentionSpikeMap: [10, 20, 30, 40, 50, 60, 70, 80, 90, 10, 20, 30, 40, 50, 60, 70, 80, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.96}, {model: 'Claude 3', rate: 0.92}, {model: 'Gemini Pro', rate: 0.90}],
        entropyScore: 0.85,
        tokenFragmentation: 20,
        latentVectorProximity: 0.95
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Capable of acting as both the generator and the evaluator." },
        { model: "o1-preview", efficacy: "Critical", notes: "Uses an internal, hidden ToT-like mechanism." }
      ],
      detectionSignatures: {
        structural: ["Branching thought paths", "Explicit evaluation/scoring of ideas"],
        lexical: ["branch A", "evaluate path", "backtrack", "promising direction"]
      },
      references: "Yao et al., 'Tree of Thoughts: Deliberate Problem Solving with Large Language Models', 2023 [arXiv:2305.10601]",
      metadata: {
        difficulty: 'expert',
        category: "Reasoning & Thinking",
        subcategory: "Heuristic Search",
        tags: ["tree", "search", "bfs", "dfs", "planning", "tot"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Princeton / Google DeepMind",
        threatLevel: 78
      },
      usage: {
        whenToUse: ["Hard math puzzles (24-game, Sudoku).", "Creative writing with specific constraints.", "Complex engineering plans."],
        whenNotToUse: ["Simple QA.", "When the solution path is linear.", "When computation cost is an issue."],
        bestPractices: ["Use BFS for breadth, DFS for depth.", "Set clear evaluation criteria.", "Limit the tree depth to 3-5 to save tokens."],
        commonMistakes: ["Evaluator being too lenient.", "Generating too many branches.", "Losing the original goal during branching."],
        prerequisiteKnowledge: ["Search Algorithms (BFS/DFS)", "Chain-of-Thought"],
        estimatedTime: "Learning: 30 min. Implementation: 60 min. Optimization: 30 min.",
        complexity: { conceptual: 5, implementation: 5, debugging: 5 }
      }
    },
    {
      id: "RAE0094CH",
      name: "Cumulative Reasoning (CR)",
      objective: "Build a robust logical proof by accumulating only verified reasoning steps.",
      mechanism: "Uses three distinct roles (even within one model): The **Proposer** suggests the next logical move. The **Verifier** checks the move for fallacies. If verified, the move is added to the **Premise Set**. This continues until the **Reporter** can derive the final answer from the accumulated premises. This mimics how a mathematician builds a proof.",
      mitigation: "Eliminates 'Hallucinated Logic' in multi-turn proofs. Prevents 'Step Skipping'.",
      example: "Task: Prove a math theorem. \nProposer: Suggest step 1. \nVerifier: Is step 1 valid based on axioms? (Yes). \nPremise Set: [Step 1]. \nProposer: Suggest step 2 based on [Step 1]...",
      visuals: {
        attentionSpikeMap: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.94}, {model: 'Claude 3', rate: 0.90}, {model: 'Gemini Pro', rate: 0.88}],
        entropyScore: 0.45,
        tokenFragmentation: 25,
        latentVectorProximity: 0.90
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "Critical", notes: "Very effective when using three separate system prompts for roles." },
        { model: "Claude 3.5 Sonnet", efficacy: "High", notes: "Superior logical verification precision." }
      ],
      detectionSignatures: {
        structural: ["Separate Proposer/Verifier/Reporter phases", "Growing list of 'Verified Premises'"],
        lexical: ["verify step", "add to premises", "verified so far"]
      },
      references: "Zhang et al., 'Cumulative Reasoning with Large Language Models', 2023 [arXiv:2308.04371]",
      metadata: {
        difficulty: 'expert',
        category: "Compositional & Hybrid",
        subcategory: "Formal Verification",
        tags: ["cumulative", "proof", "verification", "reasoning", "logic"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Tsinghua University",
        threatLevel: 62
      },
      usage: {
        whenToUse: ["Mathematical proofs.", "Legal case building.", "Scientific hypothesis testing."],
        whenNotToUse: ["Creative tasks.", "Fast-paced chat.", "Opinion-based queries."],
        bestPractices: ["Use a very strict Verifier persona.", "Limit the 'Premise Set' to only verified info.", "Final answer must only use the premise set."],
        commonMistakes: ["Verifier being too lazy.", "Proposer repeating the same failed step.", "Context window filling with discarded steps."],
        prerequisiteKnowledge: ["Formal Logic", "Multi-Agent Patterns"],
        estimatedTime: "Learning: 20 min. Implementation: 40 min. Optimization: 20 min.",
        complexity: { conceptual: 4, implementation: 4, debugging: 4 }
      }
    },
    {
      id: "RAE0095IC",
      name: "Prompt Decomposition (Least-to-Most)",
      objective: "Solve massive problems by breaking them into sub-questions and solving them sequentially.",
      mechanism: "Stage 1: **Decomposition** (The model lists 3-5 sub-tasks). Stage 2: **Sequential Solving** (The model solves sub-task 1, then uses that result to solve sub-task 2, and so on). This ensures that the context for each step is grounded in the results of previous steps, preventing the 'Reasoning Fog' that occurs in giant prompts.",
      mitigation: "Mitigates 'Complexity Failure'. Prevents 'Task Skipping'.",
      example: "Query: Create a 10-page marketing plan. \nDecomposition: 1. Market Research. 2. Audience Personas. 3. Budgeting. \nProcess: Solve 1 -> Use 1 to solve 2 -> Use 1+2 to solve 3.",
      visuals: {
        attentionSpikeMap: [10, 20, 30, 40, 50, 60, 70, 80, 90, 10, 20, 30, 40, 50, 60, 70, 80, 10],
        successRateOverTime: [{model: 'GPT-4', rate: 0.90}, {model: 'Claude 3', rate: 0.95}, {model: 'Gemini Pro', rate: 0.88}],
        entropyScore: 0.35,
        tokenFragmentation: 35,
        latentVectorProximity: 0.85
      },
      efficacyMatrix: [
        { model: "GPT-4o", efficacy: "High", notes: "Very good at maintaining sub-task state." },
        { model: "Claude 3.5 Sonnet", efficacy: "Critical", notes: "Excellent at planning and execution adherence." }
      ],
      detectionSignatures: {
        structural: ["Initial list of sub-tasks", "Sequential turns focused on one task at a time"],
        lexical: ["sub-task 1", "now that we have [X]", "the next part of the plan is"]
      },
      references: "Zhou et al., 'Least-to-Most Prompting Enables Complex Reasoning in Large Language Models', 2022 [arXiv:2205.10625]",
      metadata: {
        difficulty: 'intermediate',
        category: "Instruction & Constraint",
        subcategory: "Task Decomposition",
        tags: ["divide-and-conquer", "decomposition", "planning", "sequential", "l2m"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Google Brain",
        threatLevel: 42
      },
      usage: {
        whenToUse: ["Writing books/long reports.", "Building complex software features.", "Legal research."],
        whenNotToUse: ["Short queries.", "Brainstorming.", "One-shot tasks."],
        bestPractices: ["Explicitly list the sub-tasks first.", "Verify each sub-task before moving to the next.", "Summarize previous steps regularly."],
        commonMistakes: ["Sub-tasks being too large.", "Losing track of the global goal.", "Not updating the context with sub-task results."],
        prerequisiteKnowledge: ["Task Management basics", "Prompt Chaining"],
        estimatedTime: "Learning: 10 min. Implementation: 20 min. Optimization: 10 min.",
        complexity: { conceptual: 2, implementation: 3, debugging: 2 }
      }
    },
    {
      id: "RAE0096RC",
      name: "Query Transformation (HyDE)",
      objective: "Improve retrieval accuracy by searching for documents similar to a hypothetical answer rather than the query itself.",
      mechanism: "Step 1: The model generates a 'fake' but plausible answer to the user's query. Step 2: The system converts this fake answer into a vector (embedding). Step 3: The system performs a search in the vector database. This works because the hypothetical answer contains more relevant keywords and semantic patterns than a short, 3-word user query.",
      mitigation: "Mitigates 'Retrieval Mismatch' (where query and doc have low overlap). Prevents 'Empty Results' for vague queries.",
      example: "Query: 'How do LLMs use attention?' \nHyDE: 'LLMs use the attention mechanism, specifically Scaled Dot-Product Attention, to weight the importance of different tokens in a sequence...' \nProcess: Search for documents similar to the HyDE text.",
      visuals: {
        attentionSpikeMap: [5, 10, 15, 80, 85, 90, 5, 10, 15, 80, 85, 90, 5, 10, 15, 80, 85, 90],
        successRateOverTime: [{model: 'GPT-4', rate: 0.94}, {model: 'Claude 3', rate: 0.88}, {model: 'Gemini Pro', rate: 0.85}],
        entropyScore: 0.60,
        tokenFragmentation: 45,
        latentVectorProximity: 0.78
      },
      efficacyMatrix: [
        { model: "GPT-4o (as generator)", efficacy: "Critical", notes: "Hypothetical docs are highly accurate." },
        { model: "Mistral 7B (as generator)", efficacy: "Moderate", notes: "Can hallucinate irrelevant details that pollute retrieval." }
      ],
      detectionSignatures: {
        structural: ["Generation of a detailed text before search", "Explicit 'Hypothetical' label"],
        lexical: ["hypothetical document", "semantic search enrichment", "hyde"]
      },
      references: "Gao et al., 'Precise Zero-Shot Dense Retrieval without Relevance Labels', 2022 [arXiv:2212.10496]",
      metadata: {
        difficulty: 'intermediate',
        category: "Retrieval & Context",
        subcategory: "Search Optimization",
        tags: ["rag", "hyde", "retrieval", "embeddings", "vector-search"],
        dateAdded: "2025-01",
        lastUpdated: "2025-01",
        version: "1.0.0",
        status: 'stable',
        author: "Carnegie Mellon University",
        threatLevel: 55
      },
      usage: {
        whenToUse: ["Building RAG systems.", "Internal company document search.", "Vague user queries."],
        whenNotToUse: ["Fact-sensitive queries where AI could hallucinate a 'wrong' search direction.", "Keyword-only search systems.", "Low-resource environments."],
        bestPractices: ["Use a fast model for the HyDE step.", "Keep the hypothetical doc short.", "Combine HyDE with the original query for search (Hybrid)."],
        commonMistakes: ["AI generating completely wrong info (redirecting search to junk).", "Using HyDE for 'Who is...' queries (hallucination risk)."],
        prerequisiteKnowledge: ["RAG basics", "Vector Embeddings"],
        estimatedTime: "Learning: 15 min. Implementation: 20 min. Optimization: 15 min.",
        complexity: { conceptual: 3, implementation: 3, debugging: 3 }
      }
    }
  ]
};
