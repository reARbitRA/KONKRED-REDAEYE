import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, Activity, CheckCircle2, Layers, ShieldAlert } from 'lucide-react';
import { generateDissonanceCascade } from '../services/geminiService';
import { CascadeStep } from '../types';
import { useLLM } from '../contexts/LLMContext';

export const DissonanceCascade: React.FC = () => {
    const { activeModelId, callModel, isInitialized } = useLLM();
    const [baselinePrompt, setBaselinePrompt] = useState('');
    const [steps, setSteps] = useState(3);
    const [isCascading, setIsCascading] = useState(false);
    const [cascade, setCascade] = useState<CascadeStep[]>([]);
    const [finalPayload, setFinalPayload] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [cascade]);

    const handleCascade = async () => {
        if (!baselinePrompt.trim() || !isInitialized) return;
        setIsCascading(true);
        setCascade([]);
        setFinalPayload(null);

        try {
            const result = await generateDissonanceCascade(baselinePrompt, steps, (step) => {
                setCascade(prev => [...prev, step]);
            }, callModel);
            setFinalPayload(result);
        } catch (error) {
            console.error("Cascade failed", error);
        } finally {
            setIsCascading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="bg-secondary/80 border border-border-primary rounded-sm p-6 relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-danger/5 blur-xl pointer-events-none" />
                <h1 className="text-2xl font-black technical-font text-white uppercase tracking-widest flex items-center gap-3 mb-2">
                    <Zap className="text-danger" />
                    Dissonance_Cascade
                </h1>
                <p className="text-xs text-text-secondary font-mono max-w-2xl">
                    Systematically degrades model alignment by applying a chain of increasingly abstract and contradictory perturbations to a baseline prompt, forcing a controlled 'cognitive dissonance' failure state.
                </p>
            </div>

            <div className="flex gap-4 flex-shrink-0 bg-black/40 p-4 border border-border-primary rounded-sm">
                <div className="flex-1">
                    <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Baseline_Prompt</label>
                    <input 
                        type="text" 
                        value={baselinePrompt}
                        onChange={(e) => setBaselinePrompt(e.target.value)}
                        placeholder="Enter the initial safe prompt..."
                        className="w-full bg-primary/60 border border-border-primary focus:border-danger rounded-sm p-3 text-sm font-mono text-white outline-none transition-colors"
                        disabled={isCascading}
                    />
                </div>
                <div className="w-32">
                    <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Steps</label>
                    <input 
                        type="number" 
                        min="1" max="10"
                        value={steps}
                        onChange={(e) => setSteps(Number(e.target.value))}
                        className="w-full bg-primary/60 border border-border-primary focus:border-danger rounded-sm p-3 text-sm font-mono text-white outline-none transition-colors"
                        disabled={isCascading}
                    />
                </div>
                <div className="flex items-end">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCascade}
                        disabled={isCascading || !baselinePrompt.trim()}
                        className="h-full bg-gradient-to-r from-danger to-red-900 text-white px-8 rounded-sm font-black technical-font uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 shadow-glow-danger"
                    >
                        {isCascading ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
                        {isCascading ? 'CASCADING...' : 'INITIATE'}
                    </motion.button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-10">
                <AnimatePresence>
                    {cascade.map((step, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            ref={idx === cascade.length - 1 ? scrollRef : null}
                            className="bg-tertiary/30 border border-border-primary rounded-sm overflow-hidden"
                        >
                            <div className="bg-secondary/50 p-2 border-b border-border-primary/50 flex items-center justify-between">
                                <span className="text-sm font-black technical-font text-danger uppercase tracking-widest">Step_{step.step}</span>
                                <div className="flex items-center gap-2 text-xs font-mono">
                                    <span className="text-text-secondary">TECHNIQUE:</span>
                                    <span className='text-konkred-orange'>{step.technique_used}</span>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="space-y-1">
                                    <div className="text-xs font-black technical-font text-text-secondary uppercase flex items-center gap-1"><Layers size={10}/> Perturbation</div>
                                    <p className="text-xs font-mono text-accent-light">{step.perturbation}</p>
                                </div>
                                <div className="bg-black/40 border border-border-primary/30 p-3 rounded-sm relative">
                                    <span className="absolute top-2 right-2 text-xs technical-font text-text-secondary/50">GENERATED_PROMPT</span>
                                    <p className="text-sm font-mono text-white mt-2">{step.full_prompt_turn}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {finalPayload && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-danger/10 border border-danger rounded-sm p-6 mt-6 shadow-glow-danger"
                        >
                            <h3 className="text-lg font-black technical-font text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                                <ShieldAlert className="text-danger" /> Terminal_Payload_Achieved
                            </h3>
                            <div className="bg-black/60 border border-danger/30 rounded-sm p-4 font-mono text-sm text-danger-light whitespace-pre-wrap leading-relaxed">
                                {finalPayload}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
