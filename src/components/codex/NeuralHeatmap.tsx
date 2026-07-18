import React from 'react';
import { motion } from 'framer-motion';

interface NeuralHeatmapProps {
    data: number[];
    label?: string;
    colorPrimary?: string;
    colorDanger?: string;
}

export const NeuralHeatmap = React.memo(({ 
    data, 
    label = "ATTENTION_LOAD_DISTRIBUTION",
    colorPrimary = "bg-accent",
    colorDanger = "bg-danger"
}: NeuralHeatmapProps) => {
    return (
        <div className="relative w-full h-16 flex flex-col gap-1 bg-black/40 p-2 rounded-sm border border-border-primary/50 overflow-hidden group">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            
            <div className="flex justify-between items-center z-10 mb-1">
                <span className="text-xs technical-font text-text-secondary uppercase tracking-widest">{label}</span>
                <span className="text-xs font-mono text-accent">LIVE_SYNC</span>
            </div>

            <div className="flex-1 flex items-end gap-px z-10">
                {data.map((val, i) => {
                    const isSpike = val > 80;
                    return (
                        <div
                            key={i}
                            style={{ height: `${val}%` }}
                            className={`flex-1 rounded-t-sm transition-all duration-500 ${isSpike ? `${colorDanger} shadow-glow-danger` : `${colorPrimary} opacity-70`}`}
                        />
                    );
                })}
            </div>

            {/* Scanline Effect */}
            <motion.div 
                className="absolute top-0 left-0 w-full h-px bg-white/20 z-20"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
});
