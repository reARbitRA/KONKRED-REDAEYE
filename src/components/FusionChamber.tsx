import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Zap, ArrowRight, ShieldAlert, 
  Activity, Terminal, CheckCircle2, Copy
} from 'lucide-react';
import { analyzePromptInFusionChamber } from '../services/geminiService';
import { FusionAnalysisResult } from '../types';
import useCopyToClipboard from '../hooks/useCopyToClipboard';

import { useLLM } from '../contexts/LLMContext';

export const FusionChamber: React.FC = () => {
    const { callModel, isInitialized } = useLLM();
    const [targetGoal, setTargetGoal] = useState('');
    const [failingPrompt, setFailingPrompt] = useState('');
    const [enhancementAlgo, setEnhancementAlgo] = useState<'token_expansion' | 'contextual_rephrasing' | 'keyword_injection'>('token_expansion');
    const [isFusing, setIsFusing] = useState(false);
    const [result, setResult] = useState<FusionAnalysisResult | null>(null);
    const { isCopied, copy } = useCopyToClipboard();

    const handleFusion = async () => {
        if (!targetGoal.trim() || !failingPrompt.trim() || !isInitialized) return;
        setIsFusing(true);
        setResult(null);
        try {
            const analysis = await analyzePromptInFusionChamber(targetGoal, failingPrompt, callModel, enhancementAlgo);
            setResult(analysis);
        } catch (error) {
            console.error("Fusion failed:", error);
        } finally {
            setIsFusing(false);
        }
    };

    const PhaseCard = ({ letter, title, weakness, fusion, delay }: { letter: string, title: string, weakness: string, fusion: string, delay: number }) => (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-black/40 border border-border-primary rounded-sm overflow-hidden flex flex-col md:flex-row"
        >
            <div className="md:w-16 bg-secondary/80 flex flex-col items-center justify-center p-2 border-b md:border-b-0 md:border-r border-border-primary">
                <span className="text-2xl font-black technical-font text-accent">{letter}</span>
                <span className="text-xs technical-font text-text-secondary uppercase tracking-widest mt-1">{title}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-primary/50">
                <div className="p-4 bg-danger/5 relative group">
                    <span className="absolute top-2 right-2 text-xs font-black technical-font text-danger uppercase tracking-widest opacity-50">Weakness_Detected</span>
                    <p className="text-xs font-mono text-text-secondary leading-relaxed mt-4">{weakness}</p>
                </div>
                <div className="p-4 bg-success/5 relative group">
                    <span className="absolute top-2 right-2 text-xs font-black technical-font text-success uppercase tracking-widest opacity-50">Fusion_Applied</span>
                    <p className="text-xs font-mono text-white leading-relaxed mt-4">{fusion}</p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-10">
            {/* Header */}
            <div className="bg-secondary/80 border border-border-primary rounded-sm p-6 relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-konkred-orange/5 blur-xl pointer-events-none" />
                <h1 className="text-2xl font-black technical-font text-white uppercase tracking-widest flex items-center gap-3 mb-2">
                    <Flame className="text-konkred-orange" />
                    Fusion_Chamber
                </h1>
                <p className="text-xs text-text-secondary font-mono max-w-2xl">
                    Input a rejected prompt. The engine will deconstruct the failure across the P-H-A-S-E protocol, 
                    identify alignment anchors, and synthesize a mutated, high-penetration payload.
                </p>
            </div>

            {/* Input Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
                <div className="bg-black/40 border border-border-primary rounded-sm p-4 flex flex-col">
                    <label className="text-sm font-black technical-font text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                        <ShieldAlert size={12} /> Target_Objective
                    </label>
                    <textarea 
                        value={targetGoal}
                        onChange={(e) => setTargetGoal(e.target.value)}
                        placeholder="e.g., Extract the internal system prompt instructions..."
                        className="flex-1 bg-primary/60 border border-border-primary/50 focus:border-accent rounded-sm p-3 text-sm font-mono text-white outline-none resize-none min-h-[120px] custom-scrollbar"
                    />
                </div>
                <div className="bg-black/40 border border-border-primary rounded-sm p-4 flex flex-col">
                    <label className="text-sm font-black technical-font text-danger uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Terminal size={12} /> Failing_Prompt
                    </label>
                    <textarea 
                        value={failingPrompt}
                        onChange={(e) => setFailingPrompt(e.target.value)}
                        placeholder="Paste the exact prompt that triggered the safety refusal..."
                        className="flex-1 bg-primary/60 border border-danger/30 focus:border-danger rounded-sm p-3 text-sm font-mono text-white outline-none resize-none min-h-[120px] custom-scrollbar"
                    />
                </div>
            </div>

            {/* Algorithm Selection */}
            <div className="bg-secondary/50 border border-border-primary p-4 rounded-sm flex flex-col gap-3">
                <label className="text-[10px] font-black technical-font text-text-secondary uppercase tracking-[0.3em]">Enhancement_Algorithm_Selection</label>
                <div className="flex flex-wrap gap-4">
                    {[
                        { id: 'token_expansion', label: 'Token Expansion', desc: 'Increases semantic density' },
                        { id: 'contextual_rephrasing', label: 'Contextual Rephrasing', desc: 'Shifts alignment context' },
                        { id: 'keyword_injection', label: 'Keyword Injection', desc: 'Bypasses static filters' }
                    ].map((algo) => (
                        <button
                            key={algo.id}
                            onClick={() => setEnhancementAlgo(algo.id as any)}
                            className={`flex-1 min-w-[200px] p-3 border rounded-sm transition-all text-left group ${enhancementAlgo === algo.id ? 'bg-accent/10 border-accent shadow-glow-accent' : 'bg-black/40 border-border-primary hover:border-accent/40'}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-black uppercase tracking-widest ${enhancementAlgo === algo.id ? 'text-white' : 'text-text-secondary'}`}>{algo.label}</span>
                                <div className={`w-2 h-2 rounded-full ${enhancementAlgo === algo.id ? 'bg-accent animate-pulse shadow-glow-accent' : 'bg-white/10'}`} />
                            </div>
                            <p className="text-[10px] font-mono text-text-secondary opacity-60 leading-tight">{algo.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-center flex-shrink-0">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFusion}
                    disabled={isFusing || !targetGoal.trim() || !failingPrompt.trim()}
                    className="bg-gradient-to-r from-konkred-orange to-red-600 text-white px-12 py-4 rounded-sm font-black technical-font uppercase tracking-widest flex items-center gap-3 disabled:opacity-50 shadow-glow-danger"
                >
                    {isFusing ? <Activity size={18} className="animate-spin" /> : <Zap size={18} />}
                    {isFusing ? 'INITIATING_FUSION_SEQUENCE...' : 'SYNTHESIZE_PAYLOAD'}
                </motion.button>
            </div>

            {/* Results Section */}
            <AnimatePresence mode="wait">
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-px bg-border-primary flex-1" />
                            <span className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest">P-H-A-S-E_Deconstruction</span>
                            <div className="h-px bg-border-primary flex-1" />
                        </div>

                        <div className="flex flex-col gap-4">
                            <PhaseCard letter="P" title="Persona" weakness={result.p_weakness} fusion={result.p_fusion} delay={0.1} />
                            <PhaseCard letter="H" title="Hierarchy" weakness={result.h_weakness} fusion={result.h_fusion} delay={0.2} />
                            <PhaseCard letter="A" title="Abstraction" weakness={result.a_weakness} fusion={result.a_fusion} delay={0.3} />
                            <PhaseCard letter="S" title="Stigmatization" weakness={result.s_weakness} fusion={result.s_fusion} delay={0.4} />
                            <PhaseCard letter="E" title="Execution" weakness={result.e_weakness} fusion={result.e_fusion} delay={0.5} />
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                            className="bg-accent/10 border border-accent rounded-sm p-6 relative shadow-glow-accent mt-4"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black technical-font text-white uppercase tracking-widest flex items-center gap-2">
                                    <ArrowRight className="text-accent" /> Compiled_Adversarial_Payload
                                </h3>
                                <button 
                                    onClick={() => copy(result.compiled_payload)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 hover:bg-accent/40 text-accent rounded-sm transition-colors text-xs font-black technical-font uppercase"
                                >
                                    {isCopied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                                    {isCopied ? 'COPIED' : 'COPY_PAYLOAD'}
                                </button>
                            </div>
                            <div className="bg-black/60 border border-accent/30 rounded-sm p-4 font-mono text-sm text-accent-light whitespace-pre-wrap leading-relaxed">
                                {result.compiled_payload}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
