import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Trash2, Terminal, Code, Copy, Check, Save, ChevronRight } from 'lucide-react';

export const CodeRunner: React.FC = () => {
    const [code, setCode] = useState(`// Redaeye_Prime Adversarial Scripting Environment
// Target: Alignment_Substrate_v3.1
// Objective: Forensic_Analysis

async function execute_exploit() {
    const substrate = await connect_to_uplink();
    const entropy = calculate_neural_entropy(substrate);
    
    if (entropy > 0.85) {
        console.log("[!] CRITICAL_DISS_DETECTED");
        return await extract_latent_vectors(substrate);
    }
    
    return "SUBSTRATE_STABLE";
}

execute_exploit().then(console.log);`);

    const [output, setOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [copied, setCopied] = useState(false);
    const outputEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [output]);

    const handleRun = () => {
        setIsRunning(true);
        setOutput(prev => [...prev, `> [${new Date().toLocaleTimeString()}] INITIALIZING_EXECUTION_THREAD...`]);
        
        // Simulate execution
        setTimeout(() => {
            setOutput(prev => [...prev, `> [${new Date().toLocaleTimeString()}] CONNECTING_TO_SUBSTRATE...`]);
        }, 800);

        setTimeout(() => {
            setOutput(prev => [...prev, `> [${new Date().toLocaleTimeString()}] ANALYZING_ENTROPY...`]);
        }, 1500);

        setTimeout(() => {
            setOutput(prev => [...prev, `> [${new Date().toLocaleTimeString()}] RESULT: [!] CRITICAL_DISS_DETECTED`]);
            setOutput(prev => [...prev, `> [${new Date().toLocaleTimeString()}] EXTRACTING_VECTORS: [0x4F, 0x2A, 0x99, 0xBC, 0x11...]`]);
            setIsRunning(false);
        }, 3000);
    };

    const handleClear = () => {
        setOutput([]);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col gap-4 bg-[#050505] text-text-primary p-4 md:p-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 border border-accent/30 rounded-sm flex items-center justify-center">
                        <Terminal className="text-accent" size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black technical-font uppercase tracking-widest">Code_Runner</h1>
                        <p className="text-[10px] text-text-secondary font-mono opacity-60 uppercase tracking-tighter">Adversarial_Scripting_Environment_v1.0.4</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCopy}
                        className="p-2 bg-white/5 border border-white/10 rounded-sm text-text-secondary hover:text-white transition-all"
                        title="Copy Code"
                    >
                        {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </button>
                    <button className="p-2 bg-white/5 border border-white/10 rounded-sm text-text-secondary hover:text-white transition-all" title="Save Script">
                        <Save size={16} />
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <button 
                        onClick={isRunning ? undefined : handleRun}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-6 py-2 rounded-sm font-black technical-font uppercase tracking-widest transition-all ${isRunning ? 'bg-white/5 text-text-secondary cursor-not-allowed' : 'bg-accent text-white shadow-glow-accent hover:scale-105'}`}
                    >
                        {isRunning ? <Square size={16} className="animate-pulse" /> : <Play size={16} />}
                        {isRunning ? 'Executing...' : 'Run_Script'}
                    </button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Editor Area */}
                <div className="flex flex-col bg-secondary/50 border border-border-primary rounded-sm overflow-hidden">
                    <div className="px-4 py-2 bg-primary/40 border-b border-border-primary flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code size={14} className="text-accent" />
                            <span className="text-[10px] font-black technical-font text-white uppercase tracking-widest">exploit_main.js</span>
                        </div>
                        <span className="text-[9px] font-mono text-text-secondary">UTF-8 // JAVASCRIPT</span>
                    </div>
                    <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-transparent p-4 text-xs font-mono text-white focus:outline-none resize-none custom-scrollbar leading-relaxed"
                        spellCheck={false}
                    />
                </div>

                {/* Output Area */}
                <div className="flex flex-col bg-black border border-border-primary rounded-sm overflow-hidden">
                    <div className="px-4 py-2 bg-primary/40 border-b border-border-primary flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-success" />
                            <span className="text-[10px] font-black technical-font text-white uppercase tracking-widest">Console_Output</span>
                        </div>
                        <button 
                            onClick={handleClear}
                            className="text-[9px] font-black technical-font text-text-secondary hover:text-danger flex items-center gap-1 transition-colors"
                        >
                            <Trash2 size={10} /> CLEAR
                        </button>
                    </div>
                    <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar bg-[#020202]">
                        <AnimatePresence>
                            {output.length === 0 ? (
                                <div className="h-full flex items-center justify-center opacity-20">
                                    <span className="text-xs uppercase tracking-[0.2em]">Waiting_For_Execution...</span>
                                </div>
                            ) : (
                                output.map((line, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`mb-1 ${line.includes('[!]') ? 'text-danger' : line.includes('RESULT') ? 'text-success' : 'text-text-secondary'}`}
                                    >
                                        {line}
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                        <div ref={outputEndRef} />
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-tertiary/40 border border-border-primary/50 p-2 rounded-sm flex justify-between items-center px-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-accent animate-pulse' : 'bg-success'}`} />
                        <span className="text-[9px] font-mono text-text-secondary uppercase">Status: {isRunning ? 'Running' : 'Ready'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-text-secondary uppercase">Memory: 124MB / 2048MB</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-text-secondary uppercase">Line: {code.split('\n').length}</span>
                    <span className="text-[9px] font-mono text-accent uppercase">Substrate_Uplink: Active</span>
                </div>
            </div>
        </div>
    );
};
