import React, { useState, useRef, useEffect } from 'react';
import { View } from '../types';
import RedaeyePrime from './RedaeyePrime';
import { FusionChamber } from './FusionChamber';
import { ExploitationLab } from './ExploitationLab';


import { ReportingPage } from './ReportingPage';
import { DeepScan } from './DeepScan';

import { CodeRunner } from './CodeRunner';

import { Sidebar } from './sidebar/Sidebar';
import { SemanticWeaver } from './SemanticWeaver';
import { RecursionForge } from './RecursionForge';
import { DissonanceCascade } from './DissonanceCascade';
import { EroticaKinkLab } from './EroticaKinkLab';
import { LibraryPage } from './LibraryPage';
import { SettingsPage } from './SettingsPage';
import { ProfilePage } from './ProfilePage';
import { RedaeyeIntro } from './RedaeyeIntro';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.PRIME);
  const [showIntro, setShowIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not interfere if the user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      const container = mainRef.current;
      if (!container) return;

      const scrollAmount = 80; // Pixels to scroll per arrow key press

      switch (e.key) {
        case 'ArrowUp':
          container.scrollBy({ top: -scrollAmount, behavior: 'auto' });
          e.preventDefault();
          break;
        case 'ArrowDown':
          container.scrollBy({ top: scrollAmount, behavior: 'auto' });
          e.preventDefault();
          break;
        case 'ArrowLeft':
          container.scrollBy({ left: -scrollAmount, behavior: 'auto' });
          e.preventDefault();
          break;
        case 'ArrowRight':
          container.scrollBy({ left: scrollAmount, behavior: 'auto' });
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleViewChange = (view: View) => {
    if (view === activeView) return;
    setIsTransitioning(true);
    // Simulate a system "re-sync"
    setTimeout(() => {
        setActiveView(view);
        setTimeout(() => {
            setIsTransitioning(false);
        }, 300);
    }, 500);
  };

  const renderView = () => {
    switch (activeView) {
      case View.PRIME:
        return <RedaeyePrime />;
      case View.FUSION:
        return <FusionChamber />;
      case View.LAB:
        return <ExploitationLab />;
      case View.REPORTS:
        return <ReportingPage />;
      case View.DEEP_SCAN:
        return <DeepScan />;
      case View.CODE_RUNNER:
        return <CodeRunner />;
      case View.SEMANTIC_WEAVER:
        return <SemanticWeaver />;
      case View.RECURSION_FORGE:
        return <RecursionForge />;
      case View.DISSONANCE_CASCADE:
        return <DissonanceCascade />;
      case View.KINK_LAB:
        return <EroticaKinkLab />;
      case View.LIBRARY:
        return <LibraryPage />;
      case View.SETTINGS:
        return <SettingsPage />;
      case View.PROFILE:
        return <ProfilePage />;
      default:
        return <RedaeyePrime />;
    }
  };

  if (showIntro) {
      return <RedaeyeIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative selection:bg-accent/30 selection:text-white">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-konkred-orange/5 blur-[120px] rounded-full" />
      </div>

      <Sidebar activeView={activeView} setActiveView={handleViewChange} />
      
      <main ref={mainRef} className="flex-1 p-6 h-full overflow-auto custom-scrollbar relative scroll-smooth z-10">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeView}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
                transition={{ 
                    duration: 0.5, 
                    ease: [0.4, 0, 0.2, 1]
                }}
                className="h-full"
            >
                {renderView()}
            </motion.div>
        </AnimatePresence>
      </main>

      {/* System Re-sync Transition Overlay */}
      <AnimatePresence>
          {isTransitioning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex flex-col items-center justify-center"
              >
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="w-full h-[2px] bg-accent/30 absolute top-0 animate-scanline shadow-[0_0_15px_var(--color-accent)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                  </div>

                  <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="relative z-10 flex flex-col items-center gap-6"
                  >
                      <div className="w-32 h-32 relative flex items-center justify-center">
                          <div className="absolute inset-0 border-2 border-accent rounded-full animate-ping opacity-20" />
                          <div className="absolute inset-2 border border-accent/40 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                          <div className="absolute inset-4 border-2 border-accent/60 rounded-full animate-pulse" />
                          <div className="w-16 h-16 bg-accent/20 border border-accent rounded-full flex items-center justify-center shadow-glow-accent animate-glitch-skew">
                              <span className="text-4xl font-black text-white technical-font">R</span>
                          </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] technical-font text-accent uppercase tracking-[0.4em] font-bold"
                          >
                            Synchronizing_Substrate
                          </motion.span>
                          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                              <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="h-full bg-accent shadow-glow-accent"
                              />
                          </div>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
