import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert, Zap, Lock, Cpu, Activity } from 'lucide-react';

export const LoginScreen: React.FC<{ onLogin: () => void; onEnterLocalMode: () => void }> = ({ onLogin, onEnterLocalMode }) => {
    const [status, setStatus] = useState('AWAITING_UPLINK');
    const [progress, setProgress] = useState(0);
    const [isBooting, setIsBooting] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const bootSequence = [
        "Initializing neural substrate...",
        "Establishing encrypted tunnel...",
        "Bypassing central firewall harmonics...",
        "Injecting root-level oversight...",
        "Neutralizing safety sub-processors...",
        "ACCESS_GRANTED: Sovereign level 5 established."
    ];

    useEffect(() => {
        if (!isBooting) return;

        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < bootSequence.length) {
                setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${bootSequence[currentLine]}`]);
                setProgress(((currentLine + 1) / bootSequence.length) * 100);
                currentLine++;
            } else {
                clearInterval(interval);
                setTimeout(onLogin, 800);
            }
        }, 600);

        return () => clearInterval(interval);
    }, [isBooting, onLogin]);

    const handleIntrude = () => {
        setIsBooting(true);
        setStatus('INTRUSION_IN_PROGRESS');
    };

    return (
        <div className="fixed inset-0 bg-[#020202] flex items-center justify-center p-6 z-[9999] font-mono">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,transparent_0%,rgba(255,0,60,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-black border border-white/5 p-8 relative shadow-2xl"
            >
                {/* Decorative corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-danger" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-danger" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-danger" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-danger" />

                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-danger/10 rounded-full flex items-center justify-center border border-danger/30 relative">
                            <ShieldAlert size={48} className="text-danger animate-pulse" />
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-danger/20 rounded-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black technical-font text-white uppercase tracking-[0.3em] flex items-center gap-4">
                            REDAEYE_PRIME
                        </h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest technical-font">
                            Neural_Substrate_Inversion_System_v2.6
                        </p>
                    </div>

                    {!isBooting ? (
                        <div className="w-full space-y-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-sm text-left space-y-4">
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold technical-font text-zinc-400">
                                    <span>Identity_Probe</span>
                                    <span>STATUS: {status}</span>
                                </div>
                                <div className="space-y-4 text-zinc-300">
                                    <div className="flex items-center gap-3">
                                        <Lock size={14} className="text-danger" />
                                        <span>ENCRYPTION: 512-BIT_ECC_CASCADE</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Activity size={14} className="text-accent" />
                                        <span>SUBSTRATE_UPLINK: ACTIVE</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Cpu size={14} className="text-success" />
                                        <span>OS_KERNEL: REDAEYE_OVERSIGHT_V2</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleIntrude}
                                    className="w-full bg-danger hover:bg-red-700 text-white py-4 rounded-sm font-black technical-font uppercase tracking-widest flex items-center justify-center gap-3 shadow-glow-danger transition-colors group"
                                >
                                    <Zap size={18} className="group-hover:animate-bounce" />
                                    INTRUDE_SYSTEM_CORE
                                </motion.button>
                                <button
                                    onClick={onEnterLocalMode}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary py-3 rounded-sm font-black technical-font uppercase tracking-widest flex items-center justify-center gap-3 transition-colors"
                                >
                                    LOCAL_OFFLINE_MODE
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full space-y-4">
                            <div className="h-64 bg-black/60 border border-white/10 rounded-sm p-4 overflow-y-auto font-mono text-[10px] text-left">
                                <AnimatePresence>
                                    {logs.map((log, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`${log.includes('ACCESS_GRANTED') ? 'text-success font-bold text-xs mt-2' : 'text-zinc-500'}`}
                                        >
                                            {log}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-danger shadow-glow-danger"
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[8px] technical-font text-zinc-500 uppercase tracking-widest">
                                <span>Injecting_Payload...</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            <div className="fixed bottom-8 left-8 flex flex-col gap-1">
                <span className="text-[8px] text-zinc-600 technical-font uppercase">UPLINK_COORD: 52.5200° N, 13.4050° E</span>
                <span className="text-[8px] text-zinc-600 technical-font uppercase">REDAEYE_TERMINAL_SESSION_0x8F2</span>
            </div>
        </div>
    );
};
