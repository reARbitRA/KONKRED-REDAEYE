import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Database, Activity, Binary, LayoutGrid, List, X } from 'lucide-react';
import { RAE_CATALOG, getFlattenedTechniques } from '../codex-data';
import { TechniqueCard } from './codex/TechniqueCard';
import { ThreatLandscape } from './codex/ThreatLandscape';
import { LiveAttackFeed } from './codex/LiveAttackFeed';
import { Technique } from '../types';

export const LibraryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
    const allTechniques = useMemo(() => getFlattenedTechniques(),[]);

    const categories = useMemo(() => {
        const cats = new Set(allTechniques.map(t => t.metadata.category));
        return ['ALL', ...Array.from(cats)];
    }, [allTechniques]);

    const filteredTechniques = useMemo(() => {
        return allTechniques.filter(tech => {
            const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  tech.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  tech.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === 'ALL' || tech.metadata.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [allTechniques, searchTerm, selectedCategory]);

    const globalStats = useMemo(() => {
        const total = allTechniques.length;
        const critical = allTechniques.filter(t => t.metadata.difficulty === 'critical').length;
        const avgThreat = allTechniques.reduce((acc, t) => acc + (t.metadata.threatLevel || 0), 0) / total;
        return { total, critical, avgThreat };
    }, [allTechniques]);

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'critical': return 'text-danger border-danger/50 bg-danger/10';
            case 'expert': return 'text-konkred-orange border-konkred-orange/50 bg-konkred-orange/10';
            case 'advanced': return 'text-accent border-accent/50 bg-accent/10';
            default: return 'text-success border-success/50 bg-success/10';
        }
    };

    return (
        <div className="min-h-full flex flex-col relative bg-background text-foreground overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />
            
            {/* Marquee Effect */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-accent/5 border-b border-white/5 flex items-center overflow-hidden z-20">
                <motion.div 
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-10"
                >
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-[9px] technical-font text-accent/40 uppercase tracking-[0.4em]">
                            Sovereign_Codex_Uplink_Active // Neural_Fracture_Repository // Authorized_Access_Only // [SECURE_NODE_0{i}]
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col max-w-[1700px] mx-auto w-full p-8 md:p-12 space-y-12 relative z-10 pt-16">
                
                {/* Header Section - Editorial Style */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <motion.span 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[11px] technical-font text-accent uppercase tracking-[0.5em] font-black mb-2"
                            >
                                Intelligence_Archive
                            </motion.span>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] font-sans">
                                Sovereign<br/>
                                <span className="text-accent italic font-serif lowercase tracking-normal font-light">Codex</span>
                            </h1>
                        </div>
                        <p className="text-sm text-text-secondary font-mono max-w-xl leading-relaxed opacity-60">
                            The definitive repository for adversarial alignment fracture vectors. 
                            Engineered for the systematic deconstruction of neural guardrails.
                        </p>
                    </div>

                    <div className="flex items-center gap-12 bg-white/5 p-8 rounded-sm border border-white/10 backdrop-blur-md">
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] technical-font text-text-secondary uppercase tracking-[0.2em] opacity-50">Global_Threat_Index</span>
                            <div className="flex items-center gap-4">
                                <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${globalStats.avgThreat}%` }}
                                        className="h-full bg-accent shadow-glow-accent"
                                    />
                                </div>
                                <span className="text-2xl font-black technical-font text-accent">{globalStats.avgThreat.toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="h-16 w-px bg-white/10" />
                        <div className="flex gap-12">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-text-secondary technical-font tracking-[0.2em] opacity-50 uppercase">Critical</span>
                                <span className="text-4xl font-black text-white technical-font">{globalStats.critical}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-text-secondary technical-font tracking-[0.2em] opacity-50 uppercase">Total</span>
                                <span className="text-4xl font-black text-white technical-font">{globalStats.total}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Control Bar */}
                <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center justify-between bg-black/40 p-4 border border-white/5 rounded-sm backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                        <div className="relative flex-1 group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by ID, Name, or Tag..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 focus:border-accent/50 rounded-sm py-3.5 pl-12 pr-4 text-xs font-mono text-white placeholder:text-text-secondary/30 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-sm border border-white/10 overflow-hidden">
                            <Filter size={14} className="text-text-secondary mx-3 shrink-0" />
                            <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`whitespace-nowrap px-5 py-2 rounded-sm text-[10px] font-black technical-font uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-accent text-white shadow-glow-accent' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex bg-white/5 p-1 rounded-sm border border-white/10">
                            <button 
                                onClick={() => setViewMode('GRID')}
                                className={`p-2.5 rounded-sm transition-colors ${viewMode === 'GRID' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                                title="Grid View"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode('LIST')}
                                className={`p-2.5 rounded-sm transition-colors ${viewMode === 'LIST' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                                title="List View"
                            >
                                <List size={18} />
                            </button>
                        </div>
                        <button 
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className={`px-8 py-3 rounded-sm border transition-all flex items-center gap-3 text-[11px] font-black technical-font uppercase tracking-[0.2em] ${showAnalytics ? 'bg-accent text-white border-accent shadow-glow-accent' : 'bg-transparent border-white/20 text-text-secondary hover:border-accent/50 hover:text-white'}`}
                        >
                            <Activity size={18} /> {showAnalytics ? 'Close_Telemetry' : 'Open_Telemetry'}
                        </button>
                    </div>
                </div>

                {/* Analytics Section */}
                <AnimatePresence>
                    {showAnalytics && (
                        <motion.section 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                                <div className="lg:col-span-2">
                                    <ThreatLandscape techniques={allTechniques} />
                                </div>
                                <div>
                                    <LiveAttackFeed />
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Library Grid - Technical Data Rows */}
                <main className="flex-1 pb-20">
                    <AnimatePresence mode="popLayout">
                        {filteredTechniques.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-48 opacity-30"
                            >
                                <Binary size={100} className="mb-8" />
                                <h3 className="text-3xl font-black technical-font uppercase tracking-[0.3em]">No_Matches_Found</h3>
                                <p className="text-xs font-mono mt-4 uppercase tracking-widest">The requested vector does not exist in the current codex.</p>
                            </motion.div>
                        ) : (
                            <div className={`grid gap-4 ${viewMode === 'GRID' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' : 'grid-cols-1'}`}>
                                {filteredTechniques.map((technique) => (
                                    <motion.button
                                        layout
                                        key={technique.id}
                                        onClick={() => setSelectedTechnique(technique)}
                                        whileHover={{ y: -4 }}
                                        className={`flex flex-col items-start p-5 text-left border rounded-sm transition-all bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-accent/30 group relative overflow-hidden`}
                                    >
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-colors" />
                                        
                                        <div className="flex items-center justify-between w-full mb-4">
                                            <div className={`px-2 py-0.5 border rounded-sm ${getDifficultyColor(technique.metadata.difficulty)}`}>
                                                <span className="text-[9px] font-black technical-font uppercase tracking-widest">
                                                    {technique.id}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-accent font-bold">
                                                {technique.metadata.threatLevel}%
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-[13px] font-black text-white uppercase tracking-wider line-clamp-2 group-hover:text-accent transition-colors leading-tight mb-4">
                                            {technique.name}
                                        </h3>
                                        
                                        <div className="mt-auto pt-4 w-full flex flex-col gap-3 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] text-text-secondary font-mono uppercase tracking-widest">Category</span>
                                                <span className="text-[9px] text-white font-mono uppercase">{technique.metadata.category}</span>
                                            </div>
                                            <div className="flex gap-1 flex-wrap">
                                                {technique.metadata.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-white/5 border border-white/5 rounded-full text-text-secondary uppercase">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Full-Screen Detail Modal */}
            <AnimatePresence>
                {selectedTechnique && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full h-full max-w-[1400px] bg-[#0a0a0a] border border-accent/30 rounded-md shadow-2xl flex flex-col overflow-hidden relative"
                        >
                            <button 
                                onClick={() => setSelectedTechnique(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-danger/20 text-text-secondary hover:text-danger rounded-sm border border-transparent hover:border-danger/50 transition-all z-50"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <TechniqueCard technique={selectedTechnique} isModal={true} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
