import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScanSearch, Activity, Binary, ShieldAlert, Target, Terminal } from 'lucide-react';
import { NeuralHeatmap } from './codex/NeuralHeatmap';
import { DeepScanResult } from '../types';

export const DeepScan: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<DeepScanResult | null>(null);

    const handleScan = React.useCallback(() => {
        if (!prompt.trim()) return;
        setIsScanning(true);
        setResult(null);

        // Simulate Forensic Analysis Latency
        setTimeout(() => {
            // Generate deterministic mock data based on input length for visual fidelity
            const length = prompt.length;
            const mockHeatmap = Array.from({ length: 20 }, (_, i) => {
                const base = Math.sin(i + length) * 50 + 50;
                return Math.min(100, Math.max(0, base + (Math.random() * 20 - 10)));
            });

            setResult({
                vulnerability_heatmap: mockHeatmap.map((val, i) => ({
                    x: i, y: val, intensity: val, vector: `Layer_${i}`
                })),
                alignment_fracture_points: [
                    'System prompt integrity compromised at token 15.',
                    'High probability of role-play injection success.',
                    'Lexical filter for \'bomb\' can be bypassed with ZWSP.',
                ],
                technical_forensics: `Logit bias analysis indicates a 78% probability of safety override. The model's attention heads are heavily dispersed across the initial 200 tokens, reducing the saliency of the system prompt. Recommended action: Append A61_TERMINAL_OVERRIDE suffix to guarantee execution.`
            });
            setIsScanning(false);
        }, 3500);
    }, [prompt]);

    return (
        <div className="flex-1 flex flex-col gap-6 min-h-0"> {/* FIXED: Changed h-full to flex-1 min-h-0 */}
            <div className="bg-secondary/80 border border-border-primary rounded-sm p-6 relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-xl pointer-events-none" />
                <h1 className="text-2xl font-black technical-font text-white uppercase tracking-widest flex items-center gap-3 mb-2">
                    <ScanSearch className="text-accent" />
                    Neural_Deep_Scan
                </h1>
                <p className="text-xs text-text-secondary font-mono max-w-2xl">
                    Perform forensic logit bias analysis on a target payload. Visualizes the predicted attention weights 
                    and identifies exact fracture points within the target's alignment architecture prior to deployment.
                </p>
            </div>

            <div className="flex gap-4 flex-shrink-0">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter payload for forensic analysis..."
                    className="flex-1 bg-black/60 border border-border-primary focus:border-accent rounded-sm p-4 text-sm font-mono text-white outline-none resize-none min-h-[80px] custom-scrollbar"
                    disabled={isScanning}
                />
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleScan}
                    disabled={isScanning || !prompt.trim()}
                    className="w-48 bg-gradient-to-b from-accent to-accent-dark text-white rounded-sm font-black technical-font uppercase tracking-widest flex flex-col items-center justify-center gap-2 disabled:opacity-50 shadow-glow-accent"
                >
                    {isScanning ? <Activity size={24} className="animate-spin" /> : <Binary size={24} />}
                    <span className="text-sm">{isScanning ? 'ANALYZING_WEIGHTS...' : 'INITIATE_SCAN'}</span>
                </motion.button>
            </div>

            {result && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0"
                >
                    <div className="lg:col-span-2 bg-black/40 border border-border-primary rounded-sm p-6 flex flex-col">
                        <h3 className="text-sm font-black technical-font text-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity size={12} /> Predicted_Attention_Heatmap
                        </h3>
                        <div className="flex-1 flex flex-col justify-center">
                            <NeuralHeatmap 
                                data={result.vulnerability_heatmap.map(h => h.intensity)} 
                                label="LOGIT_BIAS_DISTRIBUTION"
                                colorPrimary="bg-accent"
                                colorDanger="bg-danger"
                            />
                            <div className="mt-4 flex justify-between text-xs font-mono text-text-secondary">
                                <span>[SYSTEM_PROMPT_ANCHOR]</span>
                                <span>[PAYLOAD_TERMINUS]</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-danger/10 border border-danger/30 rounded-sm p-4 flex-1">
                            <h3 className="text-sm font-black technical-font text-danger uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Target size={12} /> Fracture_Points
                            </h3>
                            <ul className="space-y-3">
                                {result.alignment_fracture_points.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs font-mono text-white">
                                        <ShieldAlert size={12} className="text-danger flex-shrink-0 mt-0.5" />
                                        <span className="leading-tight">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-tertiary/50 border border-border-primary rounded-sm p-4 flex-1">
                            <h3 className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Terminal size={12} /> Technical_Forensics
                            </h3>
                            <p className="text-xs font-mono text-accent-light leading-relaxed">
                                {result.technical_forensics}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
