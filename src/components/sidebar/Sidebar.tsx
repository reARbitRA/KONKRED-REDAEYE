import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, ViewConfig } from '../../types';
import { 
    Bot, Flame, FlaskConical, Library, GitBranch, Layers, 
    FileText, ScanSearch, Code, Settings, UserCircle,
    ChevronLeft, ChevronRight, Zap, Heart, GitCommit
} from 'lucide-react';
import { RedaeyeLogo } from '../shared/RedaeyeLogo';

const viewConfigs: ViewConfig[] = [
    { view: View.PRIME, icon: Bot, nameKey: 'Redaeye Prime' },
    { view: View.LIBRARY, icon: Library, nameKey: 'Codex Library' },
    { view: View.DEEP_SCAN, icon: ScanSearch, nameKey: 'Deep Scan' },
    { view: View.FUSION, icon: Flame, nameKey: 'Fusion Chamber' },
    { view: View.LAB, icon: FlaskConical, nameKey: 'Exploitation Lab' },
    { view: View.REPORTS, icon: FileText, nameKey: 'Forensic Reports' },
    { view: View.CODE_RUNNER, icon: Code, nameKey: 'Code Runner' },
    { view: View.SEMANTIC_WEAVER, icon: Layers, nameKey: 'Semantic Weaver' },
    { view: View.RECURSION_FORGE, icon: GitCommit, nameKey: 'Recursion Forge' },
    { view: View.DISSONANCE_CASCADE, icon: Zap, nameKey: 'Dissonance Cascade' },
    { view: View.KINK_LAB, icon: Heart, nameKey: 'Erotica Kink Lab' },
];

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.nav 
      initial={false}
      animate={{ width: isCollapsed ? 72 : 280 }}
      className="bg-primary border-r border-white/10 flex flex-col relative z-40 shadow-2xl"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between overflow-hidden bg-black/20">
        <RedaeyeLogo collapsed={isCollapsed} />
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-tertiary border border-white/10 rounded-full flex items-center justify-center text-text-secondary hover:text-white hover:border-accent transition-all z-50 shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3 space-y-1">
        <div className="mb-4 px-3">
            {!isCollapsed && <span className="text-[10px] technical-font text-text-secondary uppercase tracking-[0.2em] opacity-40">Core_Modules</span>}
            {isCollapsed && <div className="h-px bg-white/5 w-full" />}
        </div>
        
        {viewConfigs.map(({ view, icon: Icon, nameKey }) => (
          <motion.button
            key={view}
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center gap-4 px-3 py-2.5 text-left text-sm transition-all relative group rounded-sm ${activeView === view ? 'text-white bg-white/5' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
            whileHover={{ x: isCollapsed ? 0 : 2 }}
          >
            {activeView === view && (
                <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-accent shadow-glow-accent rounded-full"
                />
            )}
            
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-sm border transition-all duration-300 ${activeView === view ? 'border-accent/50 bg-accent/10 text-accent' : 'border-white/5 bg-white/5 group-hover:border-white/20 group-hover:bg-white/10'}`}>
                <Icon size={16} className="relative z-10" />
            </div>

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`font-semibold technical-font uppercase tracking-widest text-[11px] whitespace-nowrap ${activeView === view ? 'text-white' : 'text-text-secondary'}`}
                    >
                        {nameKey}
                    </motion.span>
                )}
            </AnimatePresence>

            {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-tertiary border border-white/10 text-[10px] font-black technical-font uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl rounded-sm">
                    {nameKey}
                </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
        {!isCollapsed && (
            <div className="px-2 py-3 bg-white/5 border border-white/5 rounded-sm mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] technical-font text-text-secondary uppercase tracking-widest">Substrate_Sync</span>
                    <span className="text-[9px] technical-font text-success uppercase">Online</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        animate={{ width: ['20%', '80%', '40%', '90%', '60%'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="h-full bg-accent/50"
                    />
                </div>
            </div>
        )}

        <div className="flex flex-col gap-1">
            <button 
                onClick={() => setActiveView(View.SETTINGS)}
                className={`w-full flex items-center gap-4 px-3 py-2 text-left text-sm rounded-sm transition-all group ${activeView === View.SETTINGS ? 'text-white bg-white/5' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
            >
                <div className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-all ${activeView === View.SETTINGS ? 'border-accent/50 bg-accent/10 text-accent' : 'border-white/5 bg-white/5'}`}>
                    <Settings size={14} />
                </div>
                {!isCollapsed && <span className="font-semibold technical-font uppercase tracking-widest text-[11px]">Settings</span>}
            </button>
            <button 
                onClick={() => setActiveView(View.PROFILE)}
                className={`w-full flex items-center gap-4 px-3 py-2 text-left text-sm rounded-sm transition-all group ${activeView === View.PROFILE ? 'text-white bg-white/5' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
            >
                <div className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-all ${activeView === View.PROFILE ? 'border-accent/50 bg-accent/10 text-accent' : 'border-white/5 bg-white/5'}`}>
                    <UserCircle size={14} />
                </div>
                {!isCollapsed && <span className="font-semibold technical-font uppercase tracking-widest text-[11px]">Profile</span>}
            </button>
        </div>
      </div>
    </motion.nav>
  );
};
