import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const RedaeyeLogo: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
        }, 5000);
        return () => clearInterval(blinkInterval);
    }, []);

    return (
        <div className="flex items-center gap-4 select-none group cursor-pointer">
            {/* The Icon - Hardware Style */}
            <div className="relative w-12 h-12 flex-shrink-0">
                <div className="absolute inset-0 bg-accent/5 rounded-sm border border-white/5" />
                <div className="absolute inset-0 border border-accent/20 rounded-sm animate-pulse" />
                <div className="absolute -inset-1 border border-white/5 rounded-sm opacity-20" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <span className="text-2xl font-black text-white technical-font tracking-tighter drop-shadow-glow">R</span>
                        <motion.div 
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full"
                        />
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50" />
            </div>

            {/* The Text Logo - Editorial/Technical Mix */}
            {!collapsed && (
                <div className="flex flex-col">
                    <div className="flex items-center technical-font font-black tracking-tighter text-2xl leading-none">
                        <span className="text-white">RE</span>
                        <span className="text-accent">D</span>
                        <span className="text-white mx-0.5">A</span>
                        <div className="relative flex items-center">
                            <span className="text-white">E</span>
                            <div className="relative w-4 h-6 flex items-center justify-center">
                                <span className="text-accent">Y</span>
                                <motion.div 
                                    animate={{ height: isBlinking ? "100%" : "0%" }}
                                    className="absolute top-0 left-0 right-0 bg-background z-10"
                                />
                            </div>
                            <span className="text-white inline-block transform scale-x-[-1]">E</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-px w-4 bg-accent/30" />
                        <span className="text-[8px] technical-font text-text-secondary uppercase tracking-[0.4em] font-bold opacity-40">Sovereign_OS</span>
                    </div>
                </div>
            )}
        </div>
    );
};
