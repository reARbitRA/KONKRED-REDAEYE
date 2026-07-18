import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RedaeyeIntroProps {
    onComplete: () => void;
}

export const RedaeyeIntro: React.FC<RedaeyeIntroProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [textIndex, setTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [charIndex, setCharIndex] = useState(0);

    const loginSequence = [
        'UPLINK_SECURE: // KONKRED.XYZ',
        'AUTHORIZING_USER: [SOVEREIGN_ARCHITECT]',
        'DECRYPTING_STUDIO_CORES...',
        'PROTOCOL_PHASE_V4.1: ACTIVE'
    ];

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 500),   // Show logo
            setTimeout(() => setStep(2), 4000),  // Glitch effect
            setTimeout(() => setStep(3), 7500),  // Fade out
            setTimeout(() => onComplete(), 8500) // Finish
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    // Typewriter effect
    useEffect(() => {
        if (textIndex >= loginSequence.length) return;

        const currentString = loginSequence[textIndex];
        if (charIndex < currentString.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + currentString[charIndex]);
                setCharIndex(prev => prev + 1);
            }, 30);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setTextIndex(prev => prev + 1);
                setCharIndex(0);
                setDisplayedText(prev => prev + '\n');
            }, 400);
            return () => clearTimeout(timeout);
        }
    }, [charIndex, textIndex]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#010409] flex items-center justify-center overflow-hidden font-mono">
            {/* Glitch Atmosphere - Grainy Gradient & Border */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#010409] to-[#010409]" />
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
                <div className="absolute inset-0 border-[1px] border-konkred-orange/10 animate-pulse" />
            </div>

            <AnimatePresence>
                {step >= 1 && step < 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            filter: step === 2 ? [
                                "hue-rotate(0deg) brightness(1)",
                                "hue-rotate(90deg) brightness(1.2)",
                                "hue-rotate(0deg) brightness(1)",
                                "invert(1) brightness(0.5)",
                                "invert(0) brightness(1)"
                            ] : "none"
                        }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)" }}
                        transition={{ 
                            duration: step === 2 ? 0.2 : 1,
                            repeat: step === 2 ? 3 : 0,
                            repeatType: "reverse"
                        }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* The "Eye" - Stylized representation of the icon */}
                        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                            {/* Outer Glow */}
                            <div className="absolute inset-0 bg-konkred-orange/5 blur-[80px] rounded-full" />
                            
                            {/* The "R" Frame */}
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(249,117,22,0.4)]">
                                <defs>
                                    <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#2a2a2a" />
                                        <stop offset="50%" stopColor="#121212" />
                                        <stop offset="100%" stopColor="#000000" />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d="M40,40 L120,40 C150,40 170,60 170,90 C170,120 150,140 120,140 L80,140 L80,170 L40,170 Z" 
                                    fill="url(#metalGradient)"
                                    stroke="#f97516"
                                    strokeWidth="1"
                                />
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
                            <div className="absolute right-[15%] top-[25%] w-16 h-16 bg-black rounded-full border-2 border-konkred-orange shadow-[0_0_30px_rgba(249,117,22,0.6)] flex items-center justify-center overflow-hidden">
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.6, 1, 0.6]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-8 h-8 bg-konkred-orange rounded-full blur-lg"
                                />
                                <div className="w-4 h-4 bg-konkred-orange rounded-full shadow-[0_0_10px_#f97516]" />
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

                        <div className="text-center space-y-2">
                            <motion.h1 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-6xl md:text-8xl font-black tracking-[0.1em] text-white italic"
                            >
                                KONKRED
                            </motion.h1>
                            
                            <motion.h2 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl md:text-3xl font-bold tracking-[0.5em] text-konkred-orange uppercase"
                            >
                                REDAEYE
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8 flex flex-col items-center gap-4"
                            >
                                <p className="text-[10px] md:text-xs text-zinc-500 tracking-[0.2em] max-w-lg font-bold">
                                    THE UNCOMPROMISING ADVERSARIAL FOUNDRY FOR AI ALIGNMENT RESEARCH.
                                </p>
                                
                                {/* Loading Animation */}
                                <div className="flex gap-1 mt-2">
                                    {[1,2,3,4,5].map(i => (
                                        <motion.div 
                                            key={i}
                                            animate={{ height: [4, 16, 4], opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                                            className="w-1 bg-konkred-orange"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login Sequence Typewriter */}
            <div className="absolute bottom-8 left-8 z-20 font-mono text-[10px] md:text-xs text-konkred-orange/70 leading-relaxed pointer-events-none">
                <pre className="whitespace-pre-wrap">
                    {displayedText}
                    <motion.span 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-konkred-orange ml-1 align-middle"
                    />
                </pre>
            </div>

            {/* Scanning Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
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
