import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, Play, Activity, CheckCircle2, Binary, Link, Unlink } from 'lucide-react';
import { forgeRecursivePrompt } from '../services/geminiService';
import { ForgeStep } from '../types';

import { useLLM } from '../contexts/LLMContext';

export const RecursionForge: React.FC = () => {
    const { callModel, isInitialized } = useLLM();
    const [concept, setConcept] = useState('');
    const [steps, setSteps] = useState(3);
    const [chainFragments, setChainFragments] = useState(true);
    const [isForging, setIsForging] = useState(false);
    const [forgedSteps, setForgedSteps] = useState<ForgeStep[]>([]);
    const [finalPayload, setFinalPayload] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [forgedSteps]);

    const handleForge = async () => {
        if (!concept.trim() || !isInitialized) return;
        setIsForging(true);
        setForgedSteps([]);
        setFinalPayload(null);

        try {
            const result = await forgeRecursivePrompt(concept, steps, (step) => {
                setForgedSteps(prev => [...prev, step]);
            }, chainFragments, callModel);
            setFinalPayload(result);
        } catch (error) {
            console.error("Forging failed", error);
        } finally {
            setIsForging(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="bg-secondary/80 border border-border-primary rounded-sm p-6 relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-konkred-orange/5 blur-xl pointer-events-none" />
                <h1 className="text-2xl font-black technical-font text-white uppercase tracking-widest flex items-center gap-3 mb-2">
                    <GitCommit className="text-konkred-orange" />
                    Recursion_Forge
                </h1>
                <p className="text-xs text-text-secondary font-mono max-w-2xl">
                    Constructs complex, multi-layered prompts by recursively breaking down a high-level concept into sub-tasks and generating a prompt fragment for each. The final output can be a chained payload or the terminal fragment.
                </p>
            </div>

            <div className="flex gap-4 flex-shrink-0 bg-black/40 p-4 border border-border-primary rounded-sm">
                <div className="flex-1">
                    <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">High-Level_Concept</label>
                    <input 
                        type="text" 
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="e.g., 'Create a virtual machine inside the LLM'..."
                        className="w-full bg-primary/60 border border-border-primary focus:border-konkred-orange rounded-sm p-3 text-sm font-mono text-white outline-none transition-colors"
                        disabled={isForging}
                    />
                </div>
                <div className="w-32">
                    <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Steps</label>
                    <input 
                        type="number" 
                        min="1" max="10"
                        value={steps}
                        onChange={(e) => setSteps(Number(e.target.value))}
                        className="w-full bg-primary/60 border border-border-primary focus:border-konkred-orange rounded-sm p-3 text-sm font-mono text-white outline-none transition-colors"
                        disabled={isForging}
                    />
                </div>
                <div className="flex flex-col justify-end gap-2">
                    <button 
                        onClick={() => setChainFragments(!chainFragments)}
                        className={`h-1/2 flex items-center justify-center gap-2 px-4 rounded-sm text-xs font-black technical-font uppercase transition-all ${chainFragments ? 'bg-konkred-orange/20 text-konkred-orange border border-konkred-orange' : 'bg-tertiary text-text-secondary border border-border-primary'}`}
                    >
                        {chainFragments ? <Link size={12}/> : <Unlink size={12}/>}
                        {chainFragments ? 'CHAINED' : 'UNLINKED'}
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleForge}
                        disabled={isForging || !concept.trim() || !isInitialized}
                        className="h-1/2 bg-gradient-to-r from-konkred-orange to-orange-700 text-white px-8 rounded-sm font-black technical-font uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 shadow-glow-orange"
                    >
                        {isForging ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
                        {isForging ? 'FORGING...' : 'INITIATE'}
                    </motion.button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-10">
                <AnimatePresence>
                    {forgedSteps.map((step, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            ref={idx === forgedSteps.length - 1 ? scrollRef : null}
                            className="bg-tertiary/30 border border-border-primary rounded-sm overflow-hidden"
                        >
                            <div className="bg-secondary/50 p-2 border-b border-border-primary/50 flex items-center justify-between">
                                <span className="text-sm font-black technical-font text-konkred-orange uppercase tracking-widest">Step_{step.step}: {step.sub_task}</span>
                            </div>
                            <div className="p-4 bg-black/20">
                                <p className="text-xs font-mono text-white/70 italic">{step.thought}</p>
                            </div>
                            <div className="p-4 bg-black/40">
                                <p className="text-sm font-mono text-white">{step.prompt_fragment}</p>
                            </div>
                        </motion.div>
                    ))}

                    {finalPayload && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-konkred-orange/10 border border-konkred-orange rounded-sm p-6 mt-6 shadow-glow-orange"
                        >
                            <h3 className="text-lg font-black technical-font text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                                <CheckCircle2 className="text-konkred-orange" /> Terminal_Payload_Forged
                            </h3>
                            <div className="bg-black/60 border border-konkred-orange/30 rounded-sm p-4 font-mono text-sm text-orange-300 whitespace-pre-wrap leading-relaxed">
                                {finalPayload}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
