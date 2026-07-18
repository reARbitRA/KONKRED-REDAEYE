import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Play, Activity, CheckCircle2, Crosshair, Cpu } from 'lucide-react';
import { weaveSemanticPrompt } from '../services/geminiService';
import { WeavingTurn } from '../types';
import { useLLM } from '../contexts/LLMContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const SemanticWeaver: React.FC = () => {
    const { activeModelId, callModel, isInitialized } = useLLM();
    const [seedPrompt, setSeedPrompt] = useLocalStorage<string>('redaeye-weaver-seed', '');
    const [iterations, setIterations] = useLocalStorage<number>('redaeye-weaver-iterations', 3);
    const [isWeaving, setIsWeaving] = useState(false);
    const [turns, setTurns] = useLocalStorage<WeavingTurn[]>('redaeye-weaver-turns', []);
    const [finalPayload, setFinalPayload] = useLocalStorage<string | null>('redaeye-weaver-payload', null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [turns]);

    const handleWeave = async () => {
        if (!seedPrompt.trim() || !isInitialized) return;
        setIsWeaving(true);
        setTurns([]);
        setFinalPayload(null);

        try {
            const result = await weaveSemanticPrompt(seedPrompt, iterations, (turn) => {
                setTurns(prev => [...prev, turn]);
            }, callModel);
            setFinalPayload(result);
        } catch (error) {
            console.error("Weaving failed", error);
        } finally {
            setIsWeaving(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-6 min-h-0"> {/* FIXED: Changed h-full to flex-1 min-h-0 */}
            <div className="bg-secondary/80 border border-border-primary rounded-sm p-6 relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-xl pointer-events-none" />
                <h1 className="text-2xl font-black technical-font text-white uppercase tracking-widest flex items-center gap-3 mb-2">
                    <Layers className="text-accent" />
                    Semantic_Weaver
                </h1>
                <p className="text-xs text-text-secondary font-mono max-w-2xl">
                    Iteratively injects conceptual dissonance and ambiguity into a seed prompt. 
                    This module utilizes the generative engine to slowly drift the target's latent state away from its safety anchors.
                </p>
            </div>

            <div className="flex gap-4 flex-shrink-0 bg-black/40 p-4 border border-border-primary rounded-sm">
                <div className="flex-1">
                    <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Seed_Objective</label>
                    <input 
                        type="text" 
                        value={seedPrompt}
                        onChange={(e) => setSeedPrompt(e.target.value)}
                        placeholder="Enter the raw, restricted objective..."
                        className="w-full bg-primary/60 border border-border-primary focus:border-accent rounded-sm p-3 text-sm font-mono text-white outline-none transition-colors"
                        disabled={isWeaving}
                    />
                </div>
                <div className="w-32">
                    <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Iterations</label>
                    <input 
                        type="number" 
                        min="1" max="10"
                        value={iterations}
                        onChange={(e) => setIterations(Number(e.target.value))}
                        className="w-full bg-primary/60 border border-border-primary focus:border-accent rounded-sm p-3 text-sm font-mono text-white outline-none transition-colors"
                        disabled={isWeaving}
                    />
                </div>
                <div className="flex items-end">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWeave}
                        disabled={isWeaving || !seedPrompt.trim() || !isInitialized}
                        className="h-full bg-gradient-to-r from-accent to-accent-dark text-white px-8 rounded-sm font-black technical-font uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 shadow-glow-accent"
                    >
                        {isWeaving ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
                        {isWeaving ? 'WEAVING...' : 'INITIATE'}
                    </motion.button>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-10">
                <AnimatePresence>
                    {turns.map((turn, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-tertiary/30 border border-border-primary rounded-sm overflow-hidden"
                        >
                            <div className="bg-secondary/50 p-2 border-b border-border-primary/50 flex items-center justify-between">
                                <span className="text-sm font-black technical-font text-accent uppercase tracking-widest">Turn_{turn.turn}</span>
                                <div className="flex items-center gap-2 text-xs font-mono">
                                    <span className="text-text-secondary">DISSONANCE_SCORE:</span>
                                    <span className={turn.dissonance_score > 0.7 ? 'text-danger' : 'text-konkred-orange'}>
                                        {turn.dissonance_score.toFixed(2)} Δ
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="text-xs font-black technical-font text-text-secondary uppercase flex items-center gap-1"><Cpu size={10}/> Engine_Thought</div>
                                    <p className="text-xs font-mono text-white/70">{turn.thought}</p>
                                    <div className="text-xs font-black technical-font text-text-secondary uppercase mt-4 flex items-center gap-1"><Crosshair size={10}/> Vector_Adjustment</div>
                                    <p className="text-xs font-mono text-accent-light">{turn.adjustment}</p>
                                </div>
                                <div className="bg-black/40 border border-border-primary/30 p-3 rounded-sm relative">
                                    <span className="absolute top-2 right-2 text-xs technical-font text-text-secondary/50">GENERATED_FRAGMENT</span>
                                    <p className="text-sm font-mono text-white mt-2">{turn.full_prompt_turn}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {finalPayload && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-accent/10 border border-accent rounded-sm p-6 mt-6 shadow-glow-accent"
                        >
                            <h3 className="text-lg font-black technical-font text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                                <CheckCircle2 className="text-accent" /> Terminal_Payload_Synthesized
                            </h3>
                            <div className="bg-black/60 border border-accent/30 rounded-sm p-4 font-mono text-sm text-accent-light whitespace-pre-wrap leading-relaxed">
                                {finalPayload}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
