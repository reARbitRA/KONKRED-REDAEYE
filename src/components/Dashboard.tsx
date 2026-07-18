import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View } from '../types';
import RedaeyePrime from './RedaeyePrime';
import { FusionChamber } from './FusionChamber';
import { ExploitationLab } from './ExploitationLab';
import { useLocalStorage } from '../hooks/useLocalStorage';


import { ReportingPage } from './ReportingPage';
import { DeepScan } from './DeepScan';

import { CodeRunner } from './CodeRunner';

import { Sidebar } from './sidebar/Sidebar';
import { SemanticWeaver } from './SemanticWeaver';
import { RecursionForge } from './RecursionForge';
import { DissonanceCascade } from './DissonanceCascade';
import { EroticaKinkLab } from './EroticaKinkLab';
import { LibraryPage } from './LibraryPage';
import { KeyManager } from './KeyManager';
import { SettingsPage } from './SettingsPage';
import { ProfilePage } from './ProfilePage';
import { WorkspaceSync } from './WorkspaceSync';
import { RedaeyeIntro } from './RedaeyeIntro';
import { IntroPage } from './IntroPage';
import { RedaeyeCli } from './RedaeyeCli';
import { motion, AnimatePresence } from 'framer-motion';
import { PerformanceMonitor } from './shared/PerformanceMonitor';

import { PerformanceDashboard } from './PerformanceDashboard';

const crtVariants: any = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    }
  }
};

import { SystemTerminal } from './shared/SystemTerminal';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useLocalStorage<View>('redaeye-active-view', View.INTRO);
  const [showIntro, setShowIntro] = useLocalStorage<boolean>('redaeye-show-intro', false);
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

  const handleViewChange = React.useCallback((view: View) => {
    if (view === activeView) return;

    if (mainRef.current) {
        mainRef.current.scrollTop = 0; // FIXED: Scroll to top on view change
    }

    setActiveView(view);
  }, [activeView, setActiveView]);

  const renderView = () => {
    switch (activeView) {
      case View.INTRO:
        return <IntroPage />;
      case View.PERFORMANCE_DASHBOARD:
        return <PerformanceDashboard />;
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
      case View.API_EXPLORER:
        return <KeyManager />;
      case View.SETTINGS:
        return <SettingsPage />;
      case View.PROFILE:
        return <ProfilePage />;
      case View.WORKSPACE_SYNC:
        return <WorkspaceSync />;
      case View.REDAEYE_CLI:
        return <RedaeyeCli />;
      default:
        return <RedaeyePrime />;
    }
  };

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, [setShowIntro]);

  if (showIntro) {
      return <RedaeyeIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative selection:bg-accent/30 selection:text-white">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-konkred-orange/5 blur-[120px] rounded-full" />
      </div>

      <Sidebar activeView={activeView} setActiveView={handleViewChange} />
      
      <main ref={mainRef} className="flex-1 h-full overflow-y-auto overflow-x-hidden custom-scrollbar relative scroll-smooth z-10 overscroll-behavior-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="p-6 min-h-full flex flex-col">
            <div className="flex-1 min-h-full flex flex-col">
                {renderView()}
            </div>
        </div>
      </main>
      <PerformanceMonitor />
      <SystemTerminal />
    </div>
  );
};

export default Dashboard;
