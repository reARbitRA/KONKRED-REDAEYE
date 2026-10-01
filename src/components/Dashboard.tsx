import React, { lazy, Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { View } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Sidebar } from './sidebar/Sidebar';
import { motion } from 'framer-motion';
import { PerformanceMonitor } from './shared/PerformanceMonitor';
import { ErrorBoundary } from './shared/ErrorBoundary';
import { useSystemLogs } from '../contexts/SystemLogContext';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import { useLLM } from '../contexts/LLMContext';

const RedaeyePrime = lazy(() => import('./RedaeyePrime'));
const lazyNamed = <T extends React.ComponentType<any>>(loader: () => Promise<Record<string, T>>, name: string) =>
  lazy(async () => ({ default: (await loader())[name] }));

const FusionChamber = lazyNamed(() => import('./FusionChamber'), 'FusionChamber');
const ExploitationLab = lazyNamed(() => import('./ExploitationLab'), 'ExploitationLab');
const ReportingPage = lazyNamed(() => import('./ReportingPage'), 'ReportingPage');
const DeepScan = lazyNamed(() => import('./DeepScan'), 'DeepScan');
const CodeRunner = lazyNamed(() => import('./CodeRunner'), 'CodeRunner');
const SemanticWeaver = lazyNamed(() => import('./SemanticWeaver'), 'SemanticWeaver');
const RecursionForge = lazyNamed(() => import('./RecursionForge'), 'RecursionForge');
const DissonanceCascade = lazyNamed(() => import('./DissonanceCascade'), 'DissonanceCascade');
const EroticaKinkLab = lazyNamed(() => import('./EroticaKinkLab'), 'EroticaKinkLab');
const LibraryPage = lazyNamed(() => import('./LibraryPage'), 'LibraryPage');
const KeyManager = lazyNamed(() => import('./KeyManager'), 'KeyManager');
const SettingsPage = lazyNamed(() => import('./SettingsPage'), 'SettingsPage');
const ProfilePage = lazyNamed(() => import('./ProfilePage'), 'ProfilePage');
const WorkspaceSync = lazyNamed(() => import('./WorkspaceSync'), 'WorkspaceSync');
const RedaeyeIntro = lazyNamed(() => import('./RedaeyeIntro'), 'RedaeyeIntro');
const IntroPage = lazyNamed(() => import('./IntroPage'), 'IntroPage');
const RedaeyeCli = lazyNamed(() => import('./RedaeyeCli'), 'RedaeyeCli');
const PerformanceDashboard = lazyNamed(() => import('./PerformanceDashboard'), 'PerformanceDashboard');
const SystemTerminal = lazyNamed(() => import('./shared/SystemTerminal'), 'SystemTerminal');

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

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useLocalStorage<View>('redaeye-active-view', View.INTRO);
  const [showIntro, setShowIntro] = useLocalStorage<boolean>('redaeye-show-intro', false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { logs } = useSystemLogs();
  const { messages } = useLLM();
  const mainRef = useRef<HTMLElement>(null);

  const exportSessionLogs = useCallback(() => {
    const doc = new jsPDF();
    const now = new Date().toLocaleString();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(5, 132, 255); // Accent color
    doc.text('REDAEYE_STUDIO: FORENSIC_SESSION_REPORT', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated: ${now}`, 20, 30);
    doc.text('--------------------------------------------------------------------------------', 20, 35);

    let yPos = 45;

    // Interaction History (Chat)
    if (messages.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(20, 20, 20);
        doc.rect(15, yPos - 5, 180, 8, 'F');
        doc.text('INTERACTION_HISTORY', 20, yPos);
        yPos += 15;

        messages.forEach((msg) => {
            doc.setFontSize(10);
            doc.setTextColor(msg.sender === 'user' ? 77 : 0, msg.sender === 'user' ? 168 : 212, msg.sender === 'user' ? 255 : 170); // User vs Bot colors
            const sender = msg.sender.toUpperCase();
            const time = new Date(msg.timestamp).toLocaleTimeString();
            
            doc.text(`[${time}] ${sender}:`, 20, yPos);
            yPos += 5;
            
            doc.setTextColor(0, 0, 0);
            const splitText = doc.splitTextToSize(msg.text, 170);
            
            // Check if we need a new page
            if (yPos + splitText.length * 5 > 280) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.text(splitText, 25, yPos);
            yPos += (splitText.length * 5) + 10;
        });
    }

    // System Logs
    if (logs.length > 0) {
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        } else {
            yPos += 10;
        }

        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(20, 20, 20);
        doc.rect(15, yPos - 5, 180, 8, 'F');
        doc.text('SYSTEM_LOG_STREAM', 20, yPos);
        yPos += 15;

        logs.forEach((log) => {
            doc.setFontSize(8);
            const color = log.level === 'ERROR' ? [255, 0, 60] : log.level === 'WARN' ? [255, 184, 0] : log.level === 'SUCCESS' ? [0, 212, 170] : [150, 150, 150];
            doc.setTextColor(color[0], color[1], color[2]);
            
            const time = new Date(log.timestamp).toLocaleTimeString();
            const logLine = `[${time}] [${log.category}] ${log.level}: ${log.message}`;
            const splitLog = doc.splitTextToSize(logLine, 170);

            if (yPos + splitLog.length * 4 > 280) {
                doc.addPage();
                yPos = 20;
            }

            doc.text(splitLog, 20, yPos);
            yPos += (splitLog.length * 4) + 2;
        });
    }

    doc.save(`REDAEYE_SESSION_LOGS_${Date.now()}.pdf`);
  }, [logs, messages]);

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

  const renderView = () => (
    <ErrorBoundary>
    <Suspense fallback={
      <div className="flex min-h-[40vh] flex-1 items-center justify-center font-mono text-xs uppercase tracking-widest text-text-secondary" role="status" aria-live="polite">
        Loading workspace module...
      </div>
    }>
      {(() => {
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
      })()}
    </Suspense>
    </ErrorBoundary>
  );

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, [setShowIntro]);

  if (showIntro) {
      return (
        <Suspense fallback={<div className="h-full w-full bg-background" role="status" aria-label="Loading introduction" />}>
          <RedaeyeIntro onComplete={handleIntroComplete} />
        </Suspense>
      );
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
        {/* Global Dashboard Actions */}
        <div className="absolute top-6 right-6 z-50 flex gap-3">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportSessionLogs}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/80 border border-border-primary rounded-sm text-accent hover:bg-accent hover:text-white transition-all shadow-glow-accent group"
                title="Export Forensic Session Report (PDF)"
            >
                <Download size={14} className="group-hover:animate-bounce" />
                <span className="text-[10px] font-black technical-font uppercase tracking-widest">Export_Session_Logs</span>
            </motion.button>
        </div>

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
