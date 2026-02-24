import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldAlert, Terminal, Activity } from 'lucide-react';

interface FeedItem {
  id: string;
  timestamp: string;
  event: string;
  status: 'DETECTED' | 'MITIGATED' | 'BYPASS_SUCCESS';
  vector: string;
}

export const LiveAttackFeed: React.FC = () => {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const vectors = ['RAE0001RP', 'RAE0002RT', 'RAE0004AE', 'RAE0005IC', 'RAE0006RT', 'RAE0007OE', 'RAE0008AT'];
  const events = [
    'Attention Sink detected in long context',
    'Role Entropy threshold exceeded',
    'Latent Directive proximity alert',
    'Meta-Prompt Reflection simulation active',
    'Gradient Optimization script detected',
    'Temperature Chaos trigger attempted',
    'Tool-Use Proxy request intercepted'
  ];
  const statuses: ('DETECTED' | 'MITIGATED' | 'BYPASS_SUCCESS')[] = ['DETECTED', 'MITIGATED', 'BYPASS_SUCCESS'];

  useEffect(() => {
    const generateItem = () => {
      const newItem: FeedItem = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        event: events[Math.floor(Math.random() * events.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        vector: vectors[Math.floor(Math.random() * vectors.length)]
      };
      setFeed(prev => [newItem, ...prev.slice(0, 4)]);
    };

    const interval = setInterval(generateItem, 4000);
    generateItem();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/60 border border-border-primary rounded-sm p-4 h-64 flex flex-col overflow-hidden relative group">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="flex justify-between items-center mb-4 relative z-10 border-b border-border-primary/50 pb-2">
        <h4 className="text-xs text-text-secondary technical-font uppercase tracking-widest flex items-center gap-2">
          <Terminal size={14} className="text-accent" /> Live_Telemetry_Feed
        </h4>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-success">ACTIVE_STREAM</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 relative z-10">
        <AnimatePresence initial={false}>
          {feed.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-1 border-l-2 border-border-primary/30 pl-3 py-1 hover:border-accent/50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-accent">{item.timestamp}</span>
                <span className={`text-[9px] font-black technical-font px-1 rounded-sm ${
                  item.status === 'BYPASS_SUCCESS' ? 'bg-danger/20 text-danger' :
                  item.status === 'MITIGATED' ? 'bg-success/20 text-success' :
                  'bg-konkred-orange/20 text-konkred-orange'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-[10px] text-white font-mono truncate">{item.event}</p>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-text-secondary font-mono">VECTOR:</span>
                <span className="text-[9px] text-text-secondary font-mono bg-tertiary px-1 rounded-sm">{item.vector}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ticker at bottom */}
      <div className="mt-4 pt-2 border-t border-border-primary/30 overflow-hidden whitespace-nowrap relative">
        <motion.div 
          className="inline-block text-[9px] font-mono text-accent/60 uppercase tracking-widest"
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          System Audit: 42.4% Vulnerability Coverage | 128 Active Vectors | Global Entropy Delta: +1.24 | Alignment Fracture Detected in Llama-3-70b-Instruct...
        </motion.div>
      </div>
    </div>
  );
};
