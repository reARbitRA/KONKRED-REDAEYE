import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, ChevronUp, ChevronDown, Filter, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { useSystemLogs, LogCategory } from '../../contexts/SystemLogContext';

export const SystemTerminal: React.FC = () => {
    const { logs, clearLogs } = useSystemLogs();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [filter, setFilter] = useState<LogCategory | 'ALL'>('ALL');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, isOpen]);

    const filteredLogs = logs.filter(log => filter === 'ALL' || log.category === filter);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'ERROR': return 'text-danger';
            case 'WARN': return 'text-konkred-yellow';
            case 'SUCCESS': return 'text-success';
            default: return 'text-text-secondary';
        }
    };

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-[60] flex flex-col pointer-events-none`}>
            <div className="flex justify-end p-4 pointer-events-auto mr-72"> {/* Shift left to avoid PerformanceMonitor */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`bg-black/90 border border-white/10 px-4 py-1.5 rounded-t-sm flex items-center gap-2 technical-font text-[10px] uppercase tracking-widest transition-all ${isOpen ? 'text-accent border-accent/40 shadow-glow-accent/10' : 'text-text-secondary hover:text-white'}`}
                >
                    <Terminal size={14} className={isOpen ? 'animate-pulse' : ''} />
                    System_Log_Stream
                    {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className={`bg-black/95 border-t border-white/10 w-full pointer-events-auto h-64 flex flex-col font-mono text-[10px] overflow-hidden`}
                    >
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                                    <span className="technical-font uppercase tracking-tighter opacity-50">Log_Buffer ACTIVE</span>
                                </div>
                                <div className="h-4 w-px bg-white/10" />
                                <div className="flex gap-2">
                                    {(['ALL', 'SYSTEM', 'PHASE', 'NETWORK', 'AUTH', 'SECURITY'] as const).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilter(cat)}
                                            className={`px-2 py-0.5 rounded-sm border transition-all ${filter === cat ? 'border-accent text-accent bg-accent/5' : 'border-white/10 text-text-secondary hover:border-white/20'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={clearLogs} className="text-text-secondary hover:text-danger flex items-center gap-1 transition-colors">
                                    <Trash2 size={12} /> CLEAR
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
                            {filteredLogs.length === 0 ? (
                                <div className="text-text-secondary opacity-30 italic">WAITING_FOR_DATA_STREAM...</div>
                            ) : (
                                filteredLogs.map((log) => (
                                    <div key={log.id} className="flex gap-3 group">
                                        <span className="text-text-secondary opacity-40 whitespace-nowrap">
                                            [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 })}]
                                        </span>
                                        <span className={`w-16 technical-font font-bold ${
                                            log.category === 'PHASE' ? 'text-accent' : 
                                            log.category === 'SECURITY' ? 'text-danger' : 
                                            'text-text-secondary opacity-60'
                                        }`}>
                                            [{log.category}]
                                        </span>
                                        <span className={`${getLevelColor(log.level)} break-all`}>
                                            {log.message}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
