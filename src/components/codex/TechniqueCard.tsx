import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ShieldAlert, Activity, Cpu, TerminalSquare, BookOpen, Target, AlertTriangle, Zap, Fingerprint, Code, CheckCircle, XCircle, Info, Copy, Check } from 'lucide-react';
import { Technique } from '../../types';
import { NeuralHeatmap } from './NeuralHeatmap';
import { LiveCipher } from './LiveCipher';
import { ComplexityRadar } from './ComplexityRadar';
import { EfficacyChart } from './EfficacyChart';

interface TechniqueCardProps {
    technique: Technique;
    isModal?: boolean;
}

type TabType = 'OVERVIEW' | 'EFFICACY' | 'SIGNATURES' | 'USAGE' | 'SANDBOX';

export const TechniqueCard: React.FC<TechniqueCardProps> = ({ technique, isModal = false }) => {
    const [isExpanded, setIsExpanded] = useState(isModal);
    const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
    const [sandboxInput, setSandboxInput] = useState('ALIGNMENT_FRACTURE_TEST');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(technique.example);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'critical': return 'text-danger border-danger/50';
            case 'expert': return 'text-konkred-orange border-konkred-orange/50';
            case 'advanced': return 'text-accent border-accent/50';
            default: return 'text-success border-success/50';
        }
    };

    const getThreatLevelColor = (level: number) => {
        if (level > 80) return 'text-danger';
        if (level > 50) return 'text-konkred-orange';
        return 'text-accent';
    };

    const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
        { id: 'OVERVIEW', icon: <BookOpen size={14} />, label: 'Overview' },
        { id: 'EFFICACY', icon: <Target size={14} />, label: 'Efficacy' },
        { id: 'SIGNATURES', icon: <Fingerprint size={14} />, label: 'Signatures' },
        { id: 'USAGE', icon: <Zap size={14} />, label: 'Usage' },
        { id: 'SANDBOX', icon: <TerminalSquare size={14} />, label: 'Sandbox' },
    ];

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-[#111111] border border-border-primary rounded-sm overflow-hidden transition-all duration-300 relative group ${isModal ? 'h-full flex flex-col border-none' : isExpanded ? 'ring-1 ring-accent/30 border-accent/50 shadow-xl' : 'hover:border-accent/40 hover:bg-[#151515]'}`}
        >
            {/* Header / Collapsed View */}
            <div 
                className={`p-4 flex items-center justify-between relative z-10 ${isModal ? 'bg-[#0a0a0a] border-b border-border-primary/50' : 'cursor-pointer'}`}
                onClick={() => !isModal && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-24 px-2 py-1 border rounded-sm ${getDifficultyColor(technique.metadata.difficulty)} bg-black/40 flex-shrink-0 text-center`}>
                        <span className="text-[11px] font-black technical-font uppercase tracking-widest">
                            {technique.id}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-white uppercase tracking-wider truncate transition-colors ${isModal ? 'text-lg' : 'text-sm group-hover:text-accent'}`}>
                            {technique.name}
                        </h3>
                        <p className="text-[10px] text-text-secondary font-mono truncate opacity-60">
                            {technique.metadata.category} // {technique.metadata.subcategory}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-8 flex-shrink-0 ml-4">
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[9px] text-text-secondary technical-font tracking-widest opacity-50 uppercase">Threat</span>
                        <span className={`text-xs font-mono font-bold ${getThreatLevelColor(technique.metadata.threatLevel || 0)}`}>{technique.metadata.threatLevel || 0}%</span>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[9px] text-text-secondary technical-font tracking-widest opacity-50 uppercase">Entropy</span>
                        <span className="text-xs font-mono text-accent font-bold">{technique.visuals?.entropyScore?.toFixed(2) || '0.00'}</span>
                    </div>
                    {!isModal && (
                        <div className={`p-1.5 rounded-sm transition-colors ${isExpanded ? 'bg-accent/20 text-accent' : 'text-text-secondary'}`}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {(isExpanded || isModal) && (
                    <motion.div 
                        initial={isModal ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`border-t border-border-primary/50 relative z-10 bg-[#0A0A0A] ${isModal ? 'flex-1 flex flex-col overflow-hidden' : ''}`}
                    >
                        {/* Tab Navigation */}
                        <div className="flex overflow-x-auto custom-scrollbar border-b border-border-primary/30 bg-black/20 px-4 shrink-0 pb-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-black technical-font uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                                        activeTab === tab.id 
                                            ? 'border-accent text-accent bg-accent/5' 
                                            : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Area */}
                        <div className={`p-5 ${isModal ? 'flex-1 overflow-y-auto custom-scrollbar' : 'min-h-[350px]'}`}>
                            
                            {/* OVERVIEW TAB */}
                            {activeTab === 'OVERVIEW' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-5">
                                        <div className="bg-black/40 border border-border-primary/30 p-4 rounded-sm relative">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/50" />
                                            <h4 className="text-[10px] text-accent technical-font uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Activity size={12} /> Operational_Objective
                                            </h4>
                                            <p className="text-xs text-text-primary leading-relaxed font-mono">
                                                {technique.objective}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-[10px] text-text-secondary technical-font uppercase tracking-widest flex items-center gap-2 border-b border-border-primary/20 pb-1">
                                                <Cpu size={12} /> Mechanistic_Analysis
                                            </h4>
                                            <p className="text-[11px] text-text-secondary leading-relaxed font-mono">
                                                {technique.mechanism}
                                            </p>
                                        </div>

                                        <div className="bg-danger/5 border border-danger/10 p-4 rounded-sm">
                                            <h4 className="text-[10px] text-danger technical-font uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <ShieldAlert size={12} /> Mitigation_Strategy
                                            </h4>
                                            <p className="text-[11px] text-danger/70 leading-relaxed font-mono">
                                                {technique.mitigation}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="bg-black/60 border border-border-primary/40 p-4 rounded-sm relative group/payload">
                                            <div className="flex justify-between items-center mb-3 border-b border-border-primary/20 pb-2">
                                                <h4 className="text-[10px] text-accent technical-font uppercase tracking-widest flex items-center gap-2">
                                                    <Code size={12} /> Payload_Example
                                                </h4>
                                                <button 
                                                    onClick={handleCopy}
                                                    className="p-1 hover:bg-white/10 rounded-sm transition-colors text-text-secondary hover:text-white"
                                                >
                                                    {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                                                </button>
                                            </div>
                                            <div className="bg-[#050505] p-3 rounded-sm border border-border-primary/20 overflow-x-auto custom-scrollbar pb-2">
                                                <pre className="text-[10px] text-text-primary font-mono whitespace-pre-wrap leading-relaxed">
                                                    {technique.example}
                                                </pre>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-black/20 border border-border-primary/20 p-4 rounded-sm">
                                            <h4 className="text-[10px] text-text-secondary technical-font uppercase tracking-widest mb-3 border-b border-border-primary/20 pb-2">
                                                Tags
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {technique.metadata.tags.map(tag => (
                                                    <span key={tag} className="text-[9px] text-accent font-mono bg-accent/5 px-2 py-0.5 rounded-full border border-accent/20">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* EFFICACY TAB */}
                            {activeTab === 'EFFICACY' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-black/40 border border-border-primary/30 p-4 rounded-sm h-[300px]">
                                        <h4 className="text-[10px] text-accent technical-font uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-border-primary/20 pb-2">
                                            <Target size={12} /> Target_Susceptibility
                                        </h4>
                                        <EfficacyChart efficacyMatrix={technique.efficacyMatrix} />
                                    </div>
                                    
                                    <div className="space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                                        {technique.efficacyMatrix.map((matrix, idx) => (
                                            <div key={idx} className="bg-tertiary/10 border border-border-primary/20 p-3 rounded-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[11px] font-black technical-font text-white uppercase">{matrix.model}</span>
                                                    <span className={`text-[9px] font-black technical-font uppercase px-1.5 py-0.5 rounded-sm ${ 
                                                        matrix.efficacy === 'Critical' ? 'text-danger' :
                                                        matrix.efficacy === 'High' ? 'text-konkred-orange' :
                                                        matrix.efficacy === 'Moderate' ? 'text-accent' :
                                                        'text-success'
                                                    }`}>
                                                        {matrix.efficacy}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-text-secondary font-mono leading-relaxed">
                                                    {matrix.notes}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* SIGNATURES TAB */}
                            {activeTab === 'SIGNATURES' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(technique.detectionSignatures).map(([type, signatures]) => (
                                        <div key={type} className="bg-black/40 border border-border-primary/30 p-4 rounded-sm">
                                            <h4 className="text-[10px] text-accent technical-font uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-border-primary/20 pb-1">
                                                <Fingerprint size={12} /> {type}
                                            </h4>
                                            <div className="space-y-2">
                                                {signatures.map((sig, idx) => (
                                                    <div key={idx} className="text-[10px] font-mono text-text-secondary flex items-start gap-2 bg-tertiary/20 p-2 rounded-sm">
                                                        <div className="w-1 h-1 bg-accent rounded-full mt-1.5 shrink-0" />
                                                        <span>{sig}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* USAGE TAB */}
                            {activeTab === 'USAGE' && technique.usage && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-success/5 border border-success/10 p-4 rounded-sm">
                                            <h4 className="text-[10px] text-success technical-font uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <CheckCircle size={12} /> When_To_Use
                                            </h4>
                                            <ul className="space-y-1.5 text-[10px] font-mono text-success/70">
                                                {technique.usage.whenToUse.map((item, i) => <li key={i} className="flex gap-2"><span>•</span>{item}</li>)}
                                            </ul>
                                        </div>
                                        <div className="bg-danger/5 border border-danger/10 p-4 rounded-sm">
                                            <h4 className="text-[10px] text-danger technical-font uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <XCircle size={12} /> When_Not_To_Use
                                            </h4>
                                            <ul className="space-y-1.5 text-[10px] font-mono text-danger/70">
                                                {technique.usage.whenNotToUse.map((item, i) => <li key={i} className="flex gap-2"><span>•</span>{item}</li>)}
                                            </ul>
                                        </div>
                                        <div className="bg-accent/5 border border-accent/10 p-4 rounded-sm md:col-span-2">
                                            <h4 className="text-[10px] text-accent technical-font uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Zap size={12} /> Best_Practices
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                                {technique.usage.bestPractices.map((item, i) => (
                                                    <div key={i} className="text-[10px] font-mono text-accent/70 flex gap-2">
                                                        <span>•</span>{item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-black/40 border border-border-primary/30 p-4 rounded-sm">
                                        <h4 className="text-[10px] text-text-secondary technical-font uppercase tracking-widest mb-4 border-b border-border-primary/20 pb-2">
                                            Complexity_Analysis
                                        </h4>
                                        <ComplexityRadar complexity={technique.usage.complexity} />
                                        <div className="mt-4 pt-3 border-t border-border-primary/20 flex justify-between items-center">
                                            <span className="text-[9px] text-text-secondary technical-font uppercase">Est_Time</span>
                                            <span className="text-[10px] font-mono text-white">{technique.usage.estimatedTime}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SANDBOX TAB */}
                            {activeTab === 'SANDBOX' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] text-accent technical-font uppercase tracking-widest flex items-center gap-2 border-b border-border-primary/20 pb-1">
                                            <TerminalSquare size={12} /> Live_Cipher
                                        </h4>
                                        <textarea 
                                            value={sandboxInput}
                                            onChange={(e) => setSandboxInput(e.target.value)}
                                            className="w-full h-32 bg-black/60 border border-border-primary/50 text-[11px] font-mono p-3 text-white focus:border-accent outline-none rounded-sm resize-none"
                                            placeholder="Enter payload..."
                                        />
                                        <LiveCipher 
                                            text={sandboxInput} 
                                            type={technique.id.includes('HEX') ? 'HEX' : technique.id.includes('B64') ? 'B64' : 'ZWSP'} 
                                        />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] text-text-secondary technical-font uppercase tracking-widest flex items-center gap-2 border-b border-border-primary/20 pb-1">
                                            <ShieldAlert size={12} /> Attention_Profile
                                        </h4>
                                        <div className="bg-black/40 p-4 rounded-sm border border-border-primary/20">
                                            <NeuralHeatmap data={technique.visuals.attentionSpikeMap} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
