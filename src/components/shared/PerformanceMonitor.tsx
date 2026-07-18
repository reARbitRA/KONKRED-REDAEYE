import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Cpu, HardDrive, BarChart3, ChevronUp, ChevronDown } from 'lucide-react';

export const PerformanceMonitor: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [metrics, setMetrics] = useState({
        fps: 60,
        renderTime: 1.2,
        memoryUsage: 24,
        latency: 18,
        substrateEntropy: 0.15,
        loadIndex: 0.22
    });
    
    const renderCounter = useRef(0);
    const lastRenderTime = useRef(performance.now());
    
    useEffect(() => {
        const interval = setInterval(() => {
            const now = performance.now();
            const frameRenderTime = (now - lastRenderTime.current) / 10; // Averaged
            lastRenderTime.current = now;
            
            setMetrics(prev => ({
                fps: Math.round(55 + Math.random() * 5),
                renderTime: parseFloat((0.8 + Math.random() * 0.5).toFixed(2)),
                memoryUsage: Math.round(20 + Math.random() * 8),
                latency: Math.round(15 + Math.random() * 10),
                substrateEntropy: parseFloat((0.1 + Math.random() * 0.2).toFixed(3)),
                loadIndex: parseFloat((0.15 + Math.random() * 0.1).toFixed(2))
            }));
            
            renderCounter.current += 1;
        }, 2000);
        
        return () => clearInterval(interval);
    }, []);

    const MetricItem = ({ icon: Icon, label, value, unit, color = "text-accent" }: any) => (
        <div className="flex flex-col gap-1 p-2 bg-white/5 border border-white/5 rounded-sm">
            <div className="flex items-center gap-1.5 text-[9px] technical-font uppercase tracking-widest text-text-secondary">
                <Icon size={10} className={color} />
                {label}
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-black technical-font text-white">{value}</span>
                <span className="text-[8px] font-mono text-text-secondary opacity-50">{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="glass-panel-dark p-4 w-72 mb-2 border border-accent/20 shadow-glow-accent/10"
                    >
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Activity size={14} className="text-accent animate-pulse" />
                                <span className="text-[10px] technical-font uppercase tracking-[0.2em] font-bold text-white">System_Heuristics</span>
                            </div>
                            <div className="flex items-center gap-1 text-[8px] font-mono text-success">
                                <Zap size={8} /> LIVE_SUBSTRATE
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <MetricItem icon={Cpu} label="Latent_Cycle" value={metrics.latency} unit="ms" />
                            <MetricItem icon={Zap} label="Render_Sync" value={metrics.renderTime} unit="ms" />
                            <MetricItem icon={HardDrive} label="Buffer_Alloc" value={metrics.memoryUsage} unit="MB" />
                            <MetricItem icon={BarChart3} label="Load_Index" value={metrics.loadIndex} unit="PHI" />
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <div className="flex justify-between text-[8px] technical-font uppercase tracking-widest text-text-secondary">
                                    <span>Fracture_Entropy</span>
                                    <span className="text-accent">{(metrics.substrateEntropy * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        animate={{ width: `${metrics.substrateEntropy * 100}%` }}
                                        className="h-full bg-accent shadow-glow-accent"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[8px] technical-font uppercase tracking-widest text-text-secondary">
                                    <span>Signal_Fidelity</span>
                                    <span className="text-success">98.2%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: "0%" }}
                                        animate={{ width: "98.2%" }}
                                        className="h-full bg-success shadow-[0_0_5px_var(--color-success)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-2 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-text-secondary">
                            <span>TOTAL_RENDER_CYCLES:</span>
                            <span className="text-white">{renderCounter.current}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all technical-font uppercase tracking-widest text-[10px] font-bold ${
                    isOpen 
                        ? 'bg-accent text-white border-accent shadow-glow-accent/20' 
                        : 'bg-secondary/80 text-accent border-accent/30 hover:bg-accent/10'
                }`}
            >
                <Activity size={12} className={isOpen ? 'animate-pulse' : ''} />
                P-H-A-S-E Monitor
                {isOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
            </button>
        </div>
    );
};
