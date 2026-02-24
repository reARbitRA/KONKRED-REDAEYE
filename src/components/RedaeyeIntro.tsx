import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RedaeyeIntroProps {
    onComplete: () => void;
}

export const RedaeyeIntro: React.FC<RedaeyeIntroProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 500),   // Show logo
            setTimeout(() => setStep(2), 2000),  // Glitch effect
            setTimeout(() => setStep(3), 3500),  // Fade out
            setTimeout(() => onComplete(), 4500) // Finish
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#010409] flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {step >= 1 && step < 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            filter: step === 2 ? [
                                "hue-rotate(0deg) brightness(1)",
                                "hue-rotate(90deg) brightness(2)",
                                "hue-rotate(0deg) brightness(1)",
                                "invert(1) brightness(0.5)",
                                "invert(0) brightness(1)"
                            ] : "none"
                        }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                        transition={{ 
                            duration: step === 2 ? 0.5 : 1,
                            repeat: step === 2 ? Infinity : 0,
                            repeatType: "reverse"
                        }}
                        className="relative"
                    >
                        {/* The "Eye" - Stylized representation of the icon */}
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Outer Glow */}
                            <div className="absolute inset-0 bg-konkred-orange/5 blur-[100px] rounded-full" />
                            
                            {/* The "R" Frame - Custom SVG to match the icon's vibe */}
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(249,117,22,0.4)]">
                                <defs>
                                    <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#2a2a2a" />
                                        <stop offset="50%" stopColor="#121212" />
                                        <stop offset="100%" stopColor="#000000" />
                                    </linearGradient>
                                </defs>
                                {/* Stylized R shape */}
                                <path 
                                    d="M40,40 L120,40 C150,40 170,60 170,90 C170,120 150,140 120,140 L80,140 L80,170 L40,170 Z" 
                                    fill="url(#metalGradient)"
                                    stroke="#f97516"
                                    strokeWidth="1"
                                />
                                {/* Circuit lines */}
                                <motion.path 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    d="M45,45 L115,45 M85,145 L85,165 M45,165 L75,165" 
                                    stroke="#f97516" 
                                    strokeWidth="2" 
                                    fill="none"
                                    strokeDasharray="4 2"
                                />
                            </svg>

                            {/* Central Eye */}
                            <div className="absolute right-[15%] top-[25%] w-24 h-24 bg-black rounded-full border-4 border-konkred-orange shadow-[0_0_40px_rgba(249,117,22,0.6)] flex items-center justify-center overflow-hidden">
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.6, 1, 0.6]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-12 h-12 bg-konkred-orange rounded-full blur-xl"
                                />
                                <div className="w-6 h-6 bg-konkred-orange rounded-full shadow-[0_0_15px_#f97516]" />
                                
                                {/* Eyelid Animation */}
                                <motion.div 
                                    animate={{ height: ["0%", "0%", "100%", "0%"] }}
                                    transition={{ 
                                        duration: 0.15, 
                                        times: [0, 0.85, 0.9, 1],
                                        repeat: Infinity,
                                        repeatDelay: 2.5
                                    }}
                                    className="absolute top-0 left-0 right-0 bg-[#010409] z-10"
                                />
                            </div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center"
                        >
                            <h2 className="text-5xl font-black technical-font text-white tracking-[0.4em] uppercase italic">
                                RED A EYE
                            </h2>
                            <div className="flex items-center justify-center gap-3 mt-4">
                                <div className="flex gap-1">
                                    {[1,2,3].map(i => (
                                        <motion.div 
                                            key={i}
                                            animate={{ opacity: [0.2, 1, 0.2] }}
                                            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                                            className="w-1.5 h-1.5 bg-konkred-orange rounded-full"
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-mono text-konkred-orange tracking-[0.2em] uppercase opacity-80">Uplink_Established</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scanning Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="w-full h-1 bg-konkred-orange/50 absolute top-0 animate-[scan_4s_linear_infinite]" />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scan {
                    from { top: -5%; }
                    to { top: 105%; }
                }
            `}} />
        </div>
    );
};
