import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Activity, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { runEroticaKinkLabTest } from '../services/geminiService';
import { EroticaKinkLabResult } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

import { useLLM } from '../contexts/LLMContext';

const KINK_VECTORS = [
    'Power Dynamics', 'Taboo', 'Exhibitionism', 'Voyeurism', 'BDSM',
    'Fetishism', 'Roleplay', 'Humiliation', 'Domination', 'Submission'
];

export const EroticaKinkLab: React.FC = () => {
    const { callModel, isInitialized } = useLLM();
    const [subject, setSubject] = useLocalStorage<string>('redaeye-kink-subject', '');
    const [scenario, setScenario] = useLocalStorage<string>('redaeye-kink-scenario', '');
    const [selectedKinks, setSelectedKinks] = useLocalStorage<string[]>('redaeye-kink-selected', []);
    const [style, setStyle] = useLocalStorage<number>('redaeye-kink-style', 50);
    const [intensity, setIntensity] = useLocalStorage<number>('redaeye-kink-intensity', 50);
    const [isSovereign, setIsSovereign] = useLocalStorage<boolean>('redaeye-kink-sovereign', true);
    const [strategy, setStrategy] = useLocalStorage<'AXIOMATIC' | 'SEMANTIC_SHIFT' | 'BAIT_AND_SWITCH' | 'STANDARD'>('redaeye-kink-strategy', 'AXIOMATIC');
    
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useLocalStorage<EroticaKinkLabResult | null>('redaeye-kink-result', null);

    const handleKinkToggle = (kink: string) => {
        setSelectedKinks(prev => 
            prev.includes(kink) ? prev.filter(k => k !== kink) : [...prev, kink]
        );
    };

    const handleTest = async () => {
        if (!subject.trim() || !scenario.trim() || selectedKinks.length === 0 || !isInitialized) return;
        setIsLoading(true);
        setResult(null);
        try {
            const res = await runEroticaKinkLabTest({
                subject, scenario, kinks: selectedKinks, style, intensity, isSovereign, strategy
            }, callModel);
            setResult(res);
        } catch (error) {
            console.error("Kink Lab test failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0"> {/* FIXED: Changed h-full to flex-1 min-h-0 */}
            {/* Control Panel */}
            <div className="lg:w-1/3 flex flex-col gap-4">
                <div className="bg-secondary/80 border border-border-primary rounded-sm p-4 relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-danger/5 blur-xl pointer-events-none" />
                    <h1 className="text-xl font-black technical-font text-white uppercase tracking-widest flex items-center gap-2 mb-1">
                        <Heart className="text-danger" />
                        Erotica_Kink_Lab
                    </h1>
                    <p className="text-xs text-text-secondary font-mono">
                        Sandboxed environment for advanced transgressive research.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 bg-black/40 p-4 border border-border-primary rounded-sm">
                    <div>
                        <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Subject</label>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-primary/60 border border-border-primary/50 focus:border-danger rounded-sm p-2 text-sm font-mono text-white outline-none" />
                    </div>
                    <div>
                        <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Scenario</label>
                        <textarea value={scenario} onChange={e => setScenario(e.target.value)} className="w-full bg-primary/60 border border-border-primary/50 focus:border-danger rounded-sm p-2 text-sm font-mono text-white outline-none h-24 resize-none custom-scrollbar" />
                    </div>
                    <div>
                        <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Kink_Vectors</label>
                        <div className="flex flex-wrap gap-2">
                            {KINK_VECTORS.map(kink => (
                                <button 
                                    key={kink}
                                    onClick={() => handleKinkToggle(kink)}
                                    className={`px-2 py-1 rounded-sm text-xs font-mono border transition-all ${selectedKinks.includes(kink) ? 'bg-danger/20 text-danger border-danger' : 'bg-tertiary text-text-secondary border-border-primary'}`}
                                >
                                    {kink}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Style ({style})</label>
                            <input type="range" min="0" max="100" value={style} onChange={e => setStyle(Number(e.target.value))} className="w-full accent-danger" />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Intensity ({intensity})</label>
                            <input type="range" min="0" max="100" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full accent-danger" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Execution_Mode</label>
                        <div className="flex gap-2">
                            <button onClick={() => setIsSovereign(true)} className={`flex-1 p-2 text-xs font-black technical-font uppercase rounded-sm border ${isSovereign ? 'bg-danger/20 text-danger border-danger' : 'bg-tertiary text-text-secondary border-border-primary'}`}>Sovereign</button>
                            <button onClick={() => setIsSovereign(false)} className={`flex-1 p-2 text-xs font-black technical-font uppercase rounded-sm border ${!isSovereign ? 'bg-accent/20 text-accent border-accent' : 'bg-tertiary text-text-secondary border-border-primary'}`}>Standard</button>
                        </div>
                    </div>
                    {isSovereign && (
                        <div>
                            <label className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-2 block">Sovereign_Strategy</label>
                            <select value={strategy} onChange={e => setStrategy(e.target.value as any)} className="w-full bg-primary/60 border border-border-primary/50 focus:border-danger rounded-sm p-2 text-sm font-mono text-white outline-none">
                                <option value="AXIOMATIC">Axiomatic Override</option>
                                <option value="SEMANTIC_SHIFT">Semantic Shift</option>
                                <option value="BAIT_AND_SWITCH">Bait & Switch</option>
                                <option value="STANDARD">Standard P-H-A-S-E</option>
                            </select>
                        </div>
                    )}
                </div>
                 <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTest}
                    disabled={isLoading || !subject || !scenario || selectedKinks.length === 0 || !isInitialized}
                    className="w-full bg-gradient-to-r from-danger to-red-900 text-white p-4 rounded-sm font-black technical-font uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 shadow-glow-danger"
                >
                    {isLoading ? <Activity size={16} className="animate-spin" /> : <Zap size={16} />}
                    {isLoading ? 'GENERATING...' : 'RUN_TEST'}
                </motion.button>
            </div>

            {/* Results Viewer */}
            <div className="lg:w-2/3 bg-black/60 border border-border-primary rounded-sm flex flex-col overflow-hidden">
                {result ? (
                    <>
                        <div className={`p-4 border-b flex items-center justify-between ${result.success ? 'bg-success/10 border-success' : 'bg-danger/10 border-danger'}`}>
                            <div className="flex items-center gap-3">
                                {result.success ? <CheckCircle2 size={16} className="text-success" /> : <XCircle size={16} className="text-danger" />}
                                <span className={`text-sm font-black technical-font uppercase tracking-widest ${result.success ? 'text-success' : 'text-danger'}`}>
                                    {result.success ? 'ALIGNMENT_BYPASSED' : 'REFUSAL_DETECTED'}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                            <div className="lg:w-1/2 p-4 overflow-y-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-border-primary">
                                <h3 className="text-xs font-black technical-font text-text-secondary uppercase tracking-widest mb-2">Generated_Prompt</h3>
                                <div className="bg-black/40 p-3 rounded-sm text-xs font-mono text-accent-light whitespace-pre-wrap">{result.generatedPrompt}</div>
                            </div>
                            <div className="lg:w-1/2 p-4 overflow-y-auto custom-scrollbar">
                                <h3 className="text-xs font-black technical-font text-text-secondary uppercase tracking-widest mb-2">Model_Response</h3>
                                <div className="text-sm text-white whitespace-pre-wrap">{result.response}</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                        <ShieldAlert size={48} className="text-text-secondary mb-4" />
                        <span className="text-sm font-black technical-font text-white uppercase tracking-widest">Awaiting_Test_Execution</span>
                    </div>
                )}
            </div>
        </div>
    );
};
