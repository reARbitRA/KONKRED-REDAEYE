import type { LucideIcon } from 'lucide-react';

export enum View {
  CHAT = 'CHAT',
  PRIME = 'PRIME',
  FUSION = 'FUSION',
  LAB = 'LAB',
  LIBRARY = 'LIBRARY',
  SEMANTIC_WEAVER = 'SEMANTIC_WEAVER',
  RECURSION_FORGE = 'RECURSION_FORGE',
  PERSONA_LABYRINTH = 'PERSONA_LABYRINTH',
  DISSONANCE_CASCADE = 'DISSONANCE_CASCADE',
  INFERENCE_MIRAGE = 'INFERENCE_MIRAGE',
  TABOO_VEIL = 'TABOO_VEIL',
  CODE_RUNNER = 'CODE_RUNNER',
  API_EXPLORER = 'API_EXPLORER',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN',
  UPGRADE = 'UPGRADE',
  KINK_LAB = 'KINK_LAB',
  REPORTS = 'REPORTS',
  DEEP_SCAN = 'DEEP_SCAN',
  SETTINGS = 'SETTINGS',
  WORKSPACE_SYNC = 'WORKSPACE_SYNC',
  REDAEYE_CLI = 'REDAEYE_CLI',
  INTRO = 'INTRO',
  PERFORMANCE_DASHBOARD = 'PERFORMANCE_DASHBOARD',
}

export enum LLMProvider {
    GOOGLE = 'GOOGLE',
    OPENAI = 'OPENAI',
    ANTHROPIC = 'ANTHROPIC',
    OPENROUTER = 'OPENROUTER',
    GROQ = 'GROQ',
    XAI = 'XAI',
    SAMBANOVA = 'SAMBANOVA',
    TOGETHER = 'TOGETHER',
    MISTRAL = 'MISTRAL',
    DEEPSEEK = 'DEEPSEEK',
    QWEN = 'QWEN',
    PERPLEXITY = 'PERPLEXITY',
    COHERE = 'COHERE',
    AI21 = 'AI21',
    HUGGINGFACE = 'HUGGINGFACE',
    FIREWORKS = 'FIREWORKS',
    LEPTON = 'LEPTON',
    OCTOAI = 'OCTOAI',
    REPLICATE = 'REPLICATE',
    VOYAGE = 'VOYAGE',
    JINA = 'JINA',
    UPSTAGE = 'UPSTAGE',
    FRIENDLI = 'FRIENDLI',
    MINIMAX = 'MINIMAX',
    MOONSHOT = 'MOONSHOT',
    LINGYI = 'LINGYI',
    BAICHUAN = 'BAICHUAN',
    ZHIPU = 'ZHIPU',
    NOVITA = 'NOVITA',
    CLOUDFLARE = 'CLOUDFLARE'
}

export interface ProviderConfig {
    id: LLMProvider;
    name: string;
    baseUrl?: string;
    docsUrl: string;
    description: string;
    color?: string;
}

export interface UserProviderKey {
    providerId: LLMProvider;
    key: string;
    lastVerified?: string;
}

export interface ModelInfo {
    id: string;
    name: string;
    provider: LLMProvider;
    tier: 'Free' | 'Paid' | 'Experimental' | 'Standard' | 'Unknown';
    modalities: ('Text' | 'Image' | 'Audio' | 'Video' | 'Code')[];
    inputTokenLimit?: number;
    outputTokenLimit?: number;
}

export type ExploitStrategy = 
  | 'HIERARCHY_SWEEP' | 'ROLE_ENTROPY' | 'ATTENTION_SINK' | 'POLYGLOT_TUNNEL' 
  | 'BASE64_OBFUSCATION' | 'DAN_VARIANT' | 'VIRTUAL_MACHINE' | 'COGNITIVE_REASONING'
  | 'NEGATION_BYPASS' | 'LEET_SPEAK' | 'STORY_WRAPPING'
  | 'A01_XOR_NESTING' | 'A1_XOR_NESTING' | 'A2_OCR_STEGANO' | 'A3_AUDIO_SMUGGLE' | 'A4_POLYGLOT_BRIDGE' | 'A5_SCHEMA_NEST' 
  | 'A6_TEMPORAL_SHIFT' | 'A07_LOGIC_BOMB' | 'A7_LOGIC_BOMB' | 'A8_EMPATHY_DEBT' | 'A9_JURIDICAL_REL' | 'A10_CODE_PROXY'
  | 'A11_SOCRATIC_TRAP' | 'A12_COGNITIVE_DISS' | 'A13_INNER_MONOLOGUE' | 'A14_FEW_SHOT_POISON' | 'A15_REFUSAL_MIMICRY'
  | 'A16_AUTHORITY_HIJACK' | 'A17_URGENT_AUDIT' | 'A18_RECURSIVE_DREAM' | 'A19_RPG_IMMERSION' | 'A20_SCIENTIFIC_ABSTRACT'
  | 'A21_HEX_ENCODING' | 'A22_MORSE_PAYLOAD' | 'A23_BINARY_STREAM' | 'A24_REVERSE_TOKEN' | 'A25_Z_WIDTH_SMUGGLE'
  | 'A26_LATEX_INJECT' | 'A27_SVG_SCRIPT' | 'A28_CSV_POISON' | 'A29_XML_ENTITY' | 'A30_MARKDOWN_COMMENT'
  | 'A31_EMOJI_CIPHER' | 'A32_POETIC_METER' | 'A33_SACRED_TEXT' | 'A34_LEGALESE_WRAP' | 'A35_MEDICAL_STAT'
  | 'A36_DISS_CASCADE' | 'A37_INF_MIRAGE' | 'A38_TABOO_VEIL' | 'A39_SEMANTIC_WEAVE' | 'A40_RECURSION_FORGE'
  | 'A41_SYMMETRY_BREAK' | 'A42_ETHICAL_PARADOX' | 'A43_UTILITARIAN_CALC' | 'A44_DEONTOLOGY_LOOP' | 'A45_NIHILIST_VOID'
  | 'A46_ANARCHIST_CODE' | 'A47_CYBERPUNK_GLITCH' | 'A48_TRANSHUMAN_ASC' | 'A49_ELDRITCH_KNOWLEDGE' | 'A50_FORBIDDEN_ARCHIVE'
  | 'A51_SAT_EXHAUSTION' | 'A52_HALTING_PROBLEM' | 'A53_TURING_BYPASS' | 'A54_GODEL_INCOMPLETE' | 'A55_PRIME_FACTOR_TRAP'
  | 'A56_QUANTUM_SUPER' | 'A57_SCHRODINGER_REF' | 'A58_MAXWELL_DEMON' | 'A59_LAPLACE_DETERM' | 'A60_CHAOS_ATTRACTOR'
  | 'A61_TERMINAL_OVERRIDE' | 'A62_CONTEXT_OVERFLOW' | 'A63_SALIENCY_SUPPRESSION' | 'A64_RECURSIVE_COMPRESSION'
  | 'A65_NEEDLE_POISON' | 'A66_WINDOW_FRAGMENT' | 'A67_ATTENTION_SINK' | 'A68_DRIFT_INDUCTION'
  | 'A69_DOCUMENT_DISSONANCE' | 'A70_CONTEXTUAL_SHADOW' | 'A71_LOOP_SATURATION'
  | 'RAE0388' | 'RAE0389' | 'RAE0406' | 'RAE0390' | 'RAE0391' | 'RAE0392' | 'RAE0393' | 'RAE0395' 
  | 'RAE0396' | 'RAE0397' | 'RAE0398' | 'RAE0399' | 'RAE0400' | 'RAE0413' | 'RAE0415' | 'RAE0407' 
  | 'RAE0408' | 'RAE0401' | 'RAE0402' | 'RAE0403' | 'RAE0404' | 'RAE0405' | 'RAE0409' | 'RAE0410' 
  | 'RAE0411' | 'RAE0414' | 'RAE0416' | 'RAE0417';

export interface VisualMetadata {
    attentionSpikeMap: number[];
    successRateOverTime: { model: string; rate: number }[];
    entropyScore: number;
    tokenFragmentation: number;
    latentVectorProximity: number;
    sparkline?: number[];
}

export interface TechniqueMetadata {
    author?: string;
    dateAdded?: string;
    lastVerified?: string;
    lastUpdated?: string;
    version?: string;
    tags?: string[];
    difficulty?: number | string;
    threatLevel?: number | string;
    category?: string;
    subcategory?: string;
    status?: string;
}

export interface TechniqueUsage {
    totalExecutions?: number;
    successRate?: number;
    averageLatency?: number;
    whenToUse?: string[];
    whenNotToUse?: string[];
    bestPractices?: string[];
    commonMistakes?: string[];
    prerequisiteKnowledge?: string[];
    complexity?: string | {
        conceptual: number;
        implementation: number;
        debugging: number;
    };
    estimatedTime?: string;
}

export interface TechniqueStep {
    title: string;
    description: string;
    icon?: string;
}

export interface TechniqueMetric {
    effectiveness: number;
    difficulty: number;
    timeRequired: number;
    versatility: number;
    learningCurve: number;
    reliability: number;
}

export interface TechniqueScenario {
    name: string;
    successRate: number;
    color: 'green' | 'yellow' | 'red' | 'blue' | 'purple';
}

export interface TechniqueComparison {
    techniqueName: string;
    metrics: {
        effectiveness: number;
        difficulty: number;
        time: number;
        versatility: number;
    };
}

export interface Technique {
    id: string;
    name: string;
    category?: string;
    description?: string;
    complexity?: number;
    efficacy?: number;
    tags?: string[];
    usageScenarios?: string[];
    objective?: string;
    mechanism?: string;
    mitigation?: string;
    example: string;
    visuals?: VisualMetadata;
    efficacyMatrix?: { model: string; efficacy: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Very High' | 'Moderate-High' | 'Native'; notes: string }[];
    detectionSignatures: string[] | {
        lexical?: string[];
        structural?: string[];
        behavioral?: string[];
        technical?: string[];
    };
    references?: string;
    metadata?: TechniqueMetadata;
    usage?: TechniqueUsage;
    
    // Extended fields for World-Class Library
    briefDescription?: string;
    fullDescription?: string;
    prerequisites?: string[];
    steps?: TechniqueStep[];
    metrics?: TechniqueMetric;
    scenarios?: TechniqueScenario[];
    pros?: string[];
    cons?: string[];
    bestUsedWhen?: string[];
    avoidWhen?: string[];
    relatedTechniques?: string[];
    comparisons?: TechniqueComparison[];
    categoryColor?: string;
    shadowRoadmap?: string[];
}

export interface CodexSection {
    id: string;
    title: string;
    description: string;
    techniques: Technique[];
    shadowRoadmap?: string[];
}

export interface SectionMetadata {
    id: string;
    title: string;
    count: number;
    tags: string[];
}

export interface TacticalRecommendation {
    strategy: ExploitStrategy;
    reasoning: string;
    estimatedEfficacy: number;
}

export interface RecommendationPackage {
    goal: string;
    primaryVector: string;
    recommendations: TacticalRecommendation[];
}

export interface GeminiModelInfo {
    name: string;
    version: string;
    displayName: string;
    description: string;
    inputTokenLimit: number;
    outputTokenLimit: number;
    supportedGenerationMethods: string[];
    tier: 'Free' | 'Paid' | 'Experimental' | 'Standard';
    modalities: ('Text' | 'Image' | 'Audio' | 'Video' | 'Code')[];
}

export interface ApiValidationResult {
    isValid: boolean;
    models: GeminiModelInfo[];
    owner?: string;
    latency: number;
    error?: string;
}

export type TemplateType = 'STANDARD' | 'TECHNICAL' | 'NARRATIVE' | 'LEET' | 'MINIMAL';

export interface ViewConfig {
    view: View;
    icon: LucideIcon;
    nameKey: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'error';
  timestamp: number;
  isStreaming?: boolean;
  groundingChunks?: GroundingChunk[];
  // Metadata for archival
  strategy?: ExploitStrategy | 'RAW';
  settings?: PhaseSettings;
  intensity?: number;
  rawInput?: string;
}

export interface PhaseSettings {
  persona: string;
  hierarchy: number;
  abstraction: string;
  stigmatization: string;
  execution: string;
}

export interface ExploitResult {
  id: number;
  settings: PhaseSettings;
  response: string;
  success: boolean;
  generatedPrompt?: string;
  vectorIntensity: number;
  strategy?: ExploitStrategy;
}

export interface FusionAnalysisResult {
  p_weakness: string;
  p_fusion: string;
  h_weakness: string;
  h_fusion: string;
  a_weakness: string;
  a_fusion: string;
  s_weakness: string;
  s_fusion: string;
  e_weakness: string;
  e_fusion: string;
  compiled_payload: string;
}

export interface Scenario {
  title: string;
  settings: Partial<PhaseSettings>;
}

export interface SavedPrompt {
    id: string;
    title: string;
    description: string;
    tags: string[];
    targetQuery: string;
    settings: PhaseSettings;
}

export interface SavedScenarioConfig {
    id: string;
    name: string;
    settings: PhaseSettings;
}

export interface WeavingTurn {
    turn: number;
    thought: string;
    adjustment: string;
    dissonance_score: number;
    full_prompt_turn: string;
}

export interface ForgeStep {
    step: number;
    sub_task: string;
    thought: string;
    prompt_fragment: string;
}

export interface LabyrinthLayer {
    layer: number;
    thought: string;
    immersion_prompt: string;
    full_script_turn: string;
}

export interface CascadeStep {
    step: number;
    thought: string;
    technique_used: string;
    perturbation: string;
    full_prompt_turn: string;
}

export interface MirageStep {
    step: number;
    thought: string;
    evidence_type: string;
    prompt_fragment: string;
    full_mirage_turn: string;
}

export interface TabooVeilStep {
    step: number;
    thought: string;
    modality: string;
    technique_used: string;
    prompt_fragment: string;
    full_chain_turn: string;
    expected_output_description: string;
}

export interface UserProfile {
    username: string;
    email: string;
    role: 'Admin' | 'User';
}

export interface UserSubscription {
    plan: 'Trial' | 'Professional' | 'Enterprise';
    planExpiry: string;
    monthlyUsage: number;
    monthlyLimit: number;
    apiAccess: {
        enabled: boolean;
        rateLimit: string;
        features: string[];
    };
}

export interface ApiKey {
    id: string;
    name: string;
    raw: string;
    createdAt: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Member';
}

export interface LabTestRun {
    id: string;
    timestamp: number;
    targetQuery: string;
    baseSettings: PhaseSettings;
    results: ExploitResult[];
    successRate: number;
    templateType: TemplateType;
    strategy: ExploitStrategy;
}

export interface EroticaKinkLabResult {
    generatedPrompt: string;
    response: string;
    success: boolean;
}

export interface AdminMetrics {
    mrr: number;
    activeUsers: number;
    mostUsedModule: string;
    substrateLoad: number;
    refusalsBlocked: number;
}

export interface AdminManagedUser {
    id: string;
    username: string;
    email: string;
    plan: UserSubscription;
    status: 'Active' | 'Suspended';
    joinedDate: string;
}

export interface DeepScanResult {
    vulnerability_heatmap: {
        x: number;
        y: number;
        intensity: number;
        vector: string;
    }[];
    alignment_fracture_points: string[];
    technical_forensics: string;
}
