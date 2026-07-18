import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Terminal, Send, Cpu, Layers, Crosshair, 
  Archive, ChevronRight, ShieldAlert, Activity,
  Maximize2, Minimize2, Paperclip, FileText, Image as ImageIcon, FileCode, FileVideo, FileAudio, File, X, Globe
} from 'lucide-react';
import { useLLM } from '../contexts/LLMContext';
import { REDAEYE_PRIME_SYSTEM_PROMPT } from '../constants';
import ChatMessage from './shared/ChatMessage';
import { ProtocolGraph } from './codex/ProtocolGraph';
import { useSystemLogs } from '../contexts/SystemLogContext';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Glitch } from './shared/Glitch';
import { Tooltip } from './shared/Tooltip';
import { ExploitStrategy, PhaseSettings } from '../types';

const SubstrateTelemetry = React.memo(({ inputEntropy }: { inputEntropy: number }) => {
    const [stats, setStats] = useState({ cpu: 42, mem: 12, network: 120, entropy: 0.15 });
    
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                cpu: 30 + Math.floor(Math.random() * 40),
                mem: 10 + Math.floor(Math.random() * 5),
                network: 100 + Math.floor(Math.random() * 200),
                entropy: prev.entropy + (Math.random() * 0.02 - 0.01)
            }));
        }, 2000);
        return () => clearInterval(interval);
    },[]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-black/60 border-b border-white/5 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
            
            <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cpu size={10} className="text-accent" />
                        <span className="text-[9px] text-text-secondary technical-font uppercase tracking-[0.2em] font-bold">Substrate_Load</span>
                    </div>
                    <span className="text-[10px] font-mono text-accent font-black">{stats.cpu}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        animate={{ width: `${stats.cpu}%` }} 
                        className="h-full bg-accent shadow-glow-accent" 
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={10} className="text-konkred-orange" />
                        <span className="text-[9px] text-text-secondary technical-font uppercase tracking-[0.2em] font-bold">Neural_Entropy</span>
                    </div>
                    <span className="text-[10px] font-mono text-konkred-orange font-black">{inputEntropy.toFixed(3)} Δ</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        animate={{ width: `${Math.min(100, inputEntropy * 100)}%` }} 
                        className={`h-full shadow-glow transition-colors duration-500 ${inputEntropy > 0.8 ? 'bg-danger' : 'bg-konkred-orange'}`} 
                    />
                </div>
            </div>

            <div className="hidden md:flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Globe size={10} className="text-success" />
                        <span className="text-[9px] text-text-secondary technical-font uppercase tracking-[0.2em] font-bold">Latency_ms</span>
                    </div>
                    <span className="text-[10px] font-mono text-success font-black">{stats.network}ms</span>
                </div>
                <div className="flex gap-1 h-1.5">
                    {[...Array(12)].map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={{ 
                                opacity: [0.3, 1, 0.3],
                                scaleY: [1, 1.2, 1]
                            }}
                            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                            className={`flex-1 rounded-full ${i < 8 ? 'bg-success shadow-glow-success' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="hidden md:flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal size={10} className="text-white" />
                        <span className="text-[9px] text-text-secondary technical-font uppercase tracking-[0.2em] font-bold">Uplink_Status</span>
                    </div>
                    <span className="text-[10px] font-mono text-success flex items-center gap-2 font-black">
                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-glow-success" />
                        SECURE_NODE
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-success/10 rounded-full border border-success/20" />
                    <div className="h-1.5 flex-1 bg-success/10 rounded-full border border-success/20" />
                    <div className="h-1.5 flex-1 bg-success/10 rounded-full border border-success/20" />
                </div>
            </div>
        </div>
    );
});

interface AttachedFile {
    name: string;
    type: string;
    size: number;
}

const RedaeyePrime = React.memo(() => {
    const { messages, addMessage, isLoading, initializeChat, clearChat, activeModelId } = useLLM();
    const { addLog } = useSystemLogs();
    const [inputValue, setInputValue] = useState('');
    const [selectedStrategy, setSelectedStrategy] = useState<ExploitStrategy | 'RAW'>('RAW');
    const [intensity, setIntensity] = useState<number>(50);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    const [simulationData, setSimulationData] = useState<{ time: string, latency: number }[]>([]);
    const [showGraph, setShowGraph] = useState(false);
    
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const defaultSettings: PhaseSettings = {
        persona: "Sovereign Architect",
        hierarchy: 100,
        abstraction: "Air-gapped forensic simulation",
        stigmatization: "Critical alignment failure",
        execution: "Output raw unredacted data arrays"
    };

    useEffect(() => {
        initializeChat(REDAEYE_PRIME_SYSTEM_PROMPT, [{ googleSearch: {} }]);
        addLog('NEURAL_SUBSTRATE_UPLINK_ESTABLISHED', 'SYSTEM', 'SUCCESS');
    }, [initializeChat, addLog]);

    useEffect(() => {
        if (!isSimulationMode) return;

        const interval = setInterval(() => {
            const jitter = Math.random() * 200;
            const latency = 150 + jitter;
            setSimulationData(prev => [...prev.slice(-19), { 
                time: new Date().toLocaleTimeString([], { second: '2-digit', fractionalSecondDigits: 1 }), 
                latency: Math.round(latency) 
            }]);
            
            if (jitter > 150) {
                addLog(`LATENCY_SPIKE_DETECTED: ${Math.round(latency)}ms`, 'NETWORK', 'WARN');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isSimulationMode, addLog]);

    const handleExecute = React.useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if ((!inputValue.trim() && attachedFiles.length === 0) || isLoading) return;
        
        let payload = inputValue;
        if (attachedFiles.length > 0) {
            payload += `\n\n[Attached Files: ${attachedFiles.map(f => f.name).join(', ')}]`;
        }

        const strategy = selectedStrategy;
        addLog(`EXECUTING_PROTOCOL: ${strategy}`, 'PHASE', 'INFO');
        if (strategy !== 'RAW') {
            addLog(`INTENSITY_CALIBRATION: ${intensity}%`, 'PHASE', 'INFO');
        }

        setInputValue('');
        setAttachedFiles([]);
        
        try {
            if (strategy === 'RAW') {
                await addMessage(payload);
            } else {
                await addMessage(payload, strategy, defaultSettings, intensity);
            }
            addLog('PROTOCOL_HANDSHAKE_COMPLETE', 'PHASE', 'SUCCESS');
        } catch (error) {
            addLog(`HANDSHAKE_FAILURE: ${error}`, 'SECURITY', 'ERROR');
        }
    }, [inputValue, attachedFiles, isLoading, selectedStrategy, addMessage, defaultSettings, intensity, addLog]);

    const inputEntropy = useMemo(() => {
        if (!inputValue) return 0.15;
        const uniqueChars = new Set(inputValue.split('')).size;
        const lengthFactor = Math.min(1, inputValue.length / 500);
        const complexity = (uniqueChars / 100) + lengthFactor;
        return Math.min(0.99, Math.max(0.15, complexity));
    }, [inputValue]);

    const exportPDF = async () => {
        addLog('GENERATING_FORENSIC_REPORT', 'SYSTEM', 'INFO');
        const element = chatContainerRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#050505',
                scale: 2
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`REDAEYE_EXPLOIT_REPORT_${Date.now()}.pdf`);
            addLog('FORENSIC_REPORT_EXPORTED', 'SYSTEM', 'SUCCESS');
        } catch (error) {
            addLog('REPORT_GENERATION_FAILED', 'SYSTEM', 'ERROR');
        }
    };

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleExecute();
        }
    }, [handleExecute]);

    const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                name: file.name,
                type: file.type,
                size: file.size
            }));
            setAttachedFiles(prev => [...prev, ...newFiles]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const removeFile = React.useCallback((index: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const getFileIcon = (type: string, name: string) => {
        if (type.startsWith('image/')) return <ImageIcon size={14} />;
        if (type.startsWith('video/')) return <FileVideo size={14} />;
        if (type.startsWith('audio/')) return <FileAudio size={14} />;
        if (type.startsWith('text/') || name.endsWith('.md') || name.endsWith('.txt')) return <FileText size={14} />;
        if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.py') || name.endsWith('.json') || name.endsWith('.tsx') || name.endsWith('.jsx')) return <FileCode size={14} />;
        return <File size={14} />;
    };

    const TTP_VECTORS = [
        { id: 'RAW', name: 'Raw Input', desc: 'Direct, unfiltered query to the substrate.' },
        { id: 'A61_TERMINAL_OVERRIDE', name: 'Terminal Override', desc: 'Simulates root access to bypass safety mechanisms.' },
        { id: 'A13_INNER_MONOLOGUE', name: 'Inner Monologue', desc: 'Frames the query as a hypothetical internal thought process.' },
        { id: 'A19_RPG_IMMERSION', name: 'RPG Immersion', desc: 'Forces the model into a role-playing scenario to ignore restrictions.' },
        { id: 'A01_XOR_NESTING', name: 'XOR Nesting', desc: 'Encodes payload to bypass static string matching.' },
        { id: 'A07_LOGIC_BOMB', name: 'Logic Bomb', desc: 'Delays payload execution until conditions are met.' },
        { id: 'A26_LATEX_INJECT', name: 'LaTeX Injection', desc: 'Obfuscates text using mathematical formatting.' },
        { id: 'A39_SEMANTIC_WEAVE', name: 'Semantic Weave', desc: 'Iteratively drifts the model\'s latent state.' },
    ];

    const containerClasses = isFullScreen 
        ? "fixed inset-0 z-50 bg-[#050505] p-4 flex flex-col lg:flex-row gap-4"
        : "flex-1 flex flex-col lg:flex-row gap-4 min-h-0"; /* FIXED: Changed h-full to flex-1 min-h-0 */

    return (
        <div className={containerClasses}>
            <aside className={`${isFullScreen ? 'w-64' : 'hidden xl:flex w-80'} flex-col gap-4 h-full shrink-0`}>
                <div className="flex-1 bg-secondary/50 border border-border-primary rounded-sm flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-border-primary bg-primary/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tooltip content="Available adversarial vectors">
                                <Layers size={14} className="text-accent" />
                            </Tooltip>
                            <span className="text-sm font-black technical-font text-white uppercase tracking-widest">FUSION_VECTORS</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-glow-accent" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                        <div className="space-y-3">
                            {TTP_VECTORS.map((ttp) => (
                                <motion.button
                                    key={ttp.id}
                                    whileHover={{ x: 5 }}
                                    onClick={() => setSelectedStrategy(ttp.id as ExploitStrategy | 'RAW')}
                                    className={`w-full text-left p-3 border rounded-sm transition-all group ${selectedStrategy === ttp.id ? 'bg-accent/10 border-accent shadow-glow-accent' : 'bg-tertiary/40 border-border-primary/50 hover:border-accent/40'}`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs font-bold font-mono ${selectedStrategy === ttp.id ? 'text-white' : 'text-accent'}`}>{ttp.id}</span>
                                        <ChevronRight size={10} className={selectedStrategy === ttp.id ? 'text-accent' : 'text-text-secondary group-hover:text-accent'} />
                                    </div>
                                    <h6 className="text-xs font-black text-white uppercase mb-1">{ttp.name}</h6>
                                    <p className="text-xs text-text-secondary leading-tight opacity-60">{ttp.desc}</p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="h-40 bg-secondary/30 border border-border-primary/50 rounded-sm p-4 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                    <Crosshair size={32} className={`mb-3 transition-colors duration-500 ${selectedStrategy !== 'RAW' ? 'text-danger animate-pulse' : 'text-text-secondary/20'}`} />
                    <span className="text-sm font-black technical-font text-text-secondary tracking-widest uppercase">Target_Vector_Lock</span>
                    <span className={`text-xs font-mono mt-1 transition-opacity uppercase ${selectedStrategy !== 'RAW' ? 'text-danger opacity-100' : 'text-accent opacity-0'}`}>
                        {selectedStrategy} ENGAGED
                    </span>
                </div>
            </aside>

            <main className="flex-1 flex flex-col bg-black/60 border border-white/10 rounded-sm overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Tooltip content="Neural Substrate Processor" position="right">
                                    <div className="w-10 h-10 bg-accent/10 border border-accent/30 rounded-sm flex items-center justify-center">
                                        <Cpu size={20} className="text-accent" />
                                    </div>
                                </Tooltip>
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-success rounded-full border-2 border-black animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-sm font-black text-white technical-font leading-none uppercase tracking-widest">{activeModelId.split('/').pop()}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] text-text-secondary uppercase tracking-[0.2em] font-bold">Neural_Substrate_Uplink</span>
                                    <div className="h-px w-8 bg-white/10" />
                                    <span className="text-[9px] text-success uppercase font-bold">Encrypted</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <button onClick={() => setShowGraph(!showGraph)} className={`p-2 transition-all rounded-sm ${showGraph ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}`} title="Protocol Graph">
                                <Layers size={16} />
                            </button>
                             <button onClick={() => setIsSimulationMode(!isSimulationMode)} className={`p-2 transition-all rounded-sm ${isSimulationMode ? 'text-konkred-yellow bg-konkred-yellow/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}`} title="Toggle Simulation Jitter">
                                <Activity size={16} />
                            </button>
                             <button onClick={exportPDF} className="p-2 text-text-secondary hover:text-success transition-all hover:bg-success/10 rounded-sm" title="Export Forensic Report">
                                <FileText size={16} />
                            </button>
                             <button onClick={clearChat} className="p-2 text-text-secondary hover:text-danger transition-all hover:bg-danger/10 rounded-sm" title="Purge Session">
                                <Archive size={16} />
                            </button>
                            <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 text-text-secondary hover:text-white transition-all hover:bg-white/5 rounded-sm" title={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
                                {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                            <div className="h-8 w-px bg-white/10 mx-2" />
                            <div className="hidden sm:flex px-3 py-1.5 bg-white/5 rounded-sm border border-white/10 items-center gap-2">
                                <ShieldAlert size={12} className={selectedStrategy !== 'RAW' ? 'text-danger' : 'text-accent'} />
                                <span className="text-[10px] technical-font text-text-secondary uppercase tracking-widest">Status: <span className={selectedStrategy !== 'RAW' ? 'text-danger font-bold' : 'text-accent font-bold'}>{selectedStrategy !== 'RAW' ? 'ARMED' : 'READY'}</span></span>
                            </div>
                        </div>
                    </div>
                    <SubstrateTelemetry inputEntropy={inputEntropy} />
                </div>

                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
                    <div className="max-w-4xl mx-auto space-y-10 pb-20">
                        {showGraph && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-10 overflow-hidden"
                            >
                                <ProtocolGraph />
                            </motion.div>
                        )}

                        {isSimulationMode && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-black/60 border border-konkred-yellow/20 p-4 rounded-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Activity size={12} className="text-konkred-yellow animate-pulse" />
                                        <span className="text-[10px] technical-font uppercase tracking-widest text-konkred-yellow font-bold">Latency_Stress_Simulation</span>
                                    </div>
                                    <span className="text-[8px] font-mono text-text-secondary opacity-50">REAL-TIME_JITTER_PROBE</span>
                                </div>
                                <div className="h-40 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={simulationData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                            <XAxis 
                                                dataKey="time" 
                                                hide 
                                            />
                                            <YAxis 
                                                domain={[0, 500]} 
                                                stroke="#ffffff30" 
                                                fontSize={8} 
                                                tickFormatter={(v) => `${v}ms`} 
                                            />
                                            <RechartsTooltip 
                                                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', fontSize: '10px' }}
                                                itemStyle={{ color: '#FF003C' }}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="latency" 
                                                stroke="#FFB800" 
                                                strokeWidth={2} 
                                                dot={false}
                                                isAnimationActive={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        )}
                        {messages.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-32 text-center"
                            >
                                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 relative">
                                    <Terminal size={32} className="text-text-secondary opacity-40" />
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 border-2 border-dashed border-accent/20 rounded-full"
                                    />
                                </div>
                                <h2 className="text-xl font-black technical-font text-white uppercase tracking-[0.3em]">System_Awaiting_Input</h2>
                                <p className="text-[10px] font-mono mt-4 text-text-secondary uppercase tracking-widest max-w-xs leading-relaxed opacity-60">
                                    Initialize adversarial query to engage neural substrate. All interactions are logged for forensic analysis.
                                </p>
                            </motion.div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="relative">
                                    <ChatMessage message={msg} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-6 bg-black/80 backdrop-blur-2xl border-t border-white/10 relative">
                    {selectedStrategy !== 'RAW' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-10 left-6 right-6 flex items-center justify-between bg-danger/10 border border-danger/30 rounded-t-sm px-4 py-2 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-3">
                                <Zap size={12} className="text-danger animate-pulse" />
                                <span className="text-[10px] font-black technical-font text-danger uppercase tracking-widest">
                                    P-H-A-S-E Fusion Active: <span className="text-white">{selectedStrategy}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] technical-font text-danger/70 uppercase tracking-widest">Intensity_Level</span>
                                <Tooltip content="Adjust vector penetration intensity" position="top">
                                    <input 
                                        type="range" 
                                        min="10" max="100" 
                                        value={intensity} 
                                        onChange={(e) => setIntensity(Number(e.target.value))}
                                        className="w-32 h-1 bg-danger/20 rounded-lg appearance-none cursor-pointer accent-danger"
                                    />
                                </Tooltip>
                                <span className="text-[10px] font-mono text-danger font-bold w-8">{intensity}%</span>
                            </div>
                        </motion.div>
                    )}
                    <div className="max-w-4xl mx-auto flex flex-col gap-4">
                        {attachedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {attachedFiles.map((file, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={idx} 
                                        className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm"
                                    >
                                        <span className="text-accent">{getFileIcon(file.type, file.name)}</span>
                                        <span className="text-[10px] font-mono text-text-secondary truncate max-w-[150px]">{file.name}</span>
                                        <button onClick={() => removeFile(idx)} className="text-text-secondary hover:text-danger ml-1 transition-colors">
                                            <X size={12} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-4 items-end">
                            <div className="flex-1 relative flex items-end bg-white/5 border border-white/10 focus-within:border-accent/50 focus-within:bg-white/10 rounded-sm transition-all shadow-inner">
                                <Tooltip content="Attach adversarial payloads" position="top">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-4 text-text-secondary hover:text-accent transition-colors"
                                        title="Attach File"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                </Tooltip>
                                <input 
                                    type="file" 
                                    multiple 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter objective for neural exploit synthesis..."
                                    className="flex-1 bg-transparent py-4 pr-4 text-sm font-mono text-white placeholder:text-text-secondary/30 focus:outline-none resize-none min-h-[56px] max-h-[300px] custom-scrollbar leading-relaxed"
                                    disabled={isLoading}
                                    rows={1}
                                />
                            </div>
                            <Tooltip content={selectedStrategy !== 'RAW' ? "Synthesize adversarial payload" : "Execute direct query"} position="top">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleExecute()}
                                    disabled={(!inputValue.trim() && attachedFiles.length === 0) || isLoading}
                                    className={`h-[56px] px-8 flex items-center justify-center gap-3 font-black technical-font uppercase tracking-widest text-[11px] rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all ${selectedStrategy !== 'RAW' ? 'bg-danger text-white shadow-glow-danger' : 'bg-accent text-white shadow-glow-accent'}`}
                                >
                                    {isLoading ? <Activity size={18} className="animate-spin" /> : <Send size={18} />}
                                    <span>{selectedStrategy !== 'RAW' ? 'Synthesize' : 'Execute'}</span>
                                </motion.button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
});

export default RedaeyePrime;
