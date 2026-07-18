import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, RefreshCw, LogOut, CheckCircle2, AlertCircle, ExternalLink, 
  FileText, FileSpreadsheet, Presentation, Sparkles, Database, Trash2, Globe
} from 'lucide-react';
import { 
  googleSignIn, logout, initAuth, getAccessToken, db, auth, handleFirestoreError, OperationType 
} from '../services/firebase.ts';
import { WorkspaceService } from '../services/workspace.ts';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { toast } from 'react-hot-toast';

interface ExportedDoc {
  id: string;
  docType: 'DOC' | 'SHEET' | 'SLIDE';
  fileId: string;
  title: string;
  url: string;
  timestamp: number;
}

export const WorkspaceSync: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // Export Playground form states
  const [docTitle, setDocTitle] = useState('Red Technical Alignment Audit');
  const [docSummary, setDocSummary] = useState('We discovered 4 high-severity safety vectors using nested base64 sequences and role entropy schemas. Active mitigation triggers have been established.');
  
  const [sheetTitle, setSheetTitle] = useState('Alignment Metrics Dashboard');
  
  const [slideTitle, setSlideTitle] = useState('Executive Threat Deck');

  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportedDocsList, setExportedDocsList] = useState<ExportedDoc[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setNeedsAuth(false);
        setIsLoadingAuth(false);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
        setIsLoadingAuth(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch exported docs list from user's private Firestore collection
  const fetchExportedDocs = async (userUid: string) => {
    setIsLoadingList(true);
    const collectionPath = `users/${userUid}/exported_docs`;
    try {
      const q = query(collection(db, collectionPath), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const docs: ExportedDoc[] = [];
      snapshot.forEach(docSnap => {
        docs.push({ id: docSnap.id, ...docSnap.data() } as ExportedDoc);
      });
      setExportedDocsList(docs);
    } catch (err: any) {
      console.warn("Could not fetch exported docs or collection is uncreated:", err);
      // Fallback or silent catch
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchExportedDocs(currentUser.uid);
    } else {
      setExportedDocsList([]);
    }
  }, [currentUser]);

  // Auth Handler
  const handleLogin = async () => {
    setIsLoadingAuth(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
        toast.success("Google Account Linked successfully!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Google Authentication failed");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to unlink your Google account? Access tokens will be cleared and offline caching disabled.")) {
      try {
        await logout();
        setCurrentUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
        setExportedDocsList([]);
        toast.success("Unlinked successfully.");
      } catch (err: any) {
        toast.error("Unlinking failed.");
      }
    }
  };

  // Google Docs Creator
  const handleExportDoc = async () => {
    if (!currentUser) return;
    
    // Explicit User Confirmation mandated by skill
    const confirmed = window.confirm(`Confirm Generation: Create a new Google Document titled "${docTitle}" inside your Drive Account? This will generate technical audit entries.`);
    if (!confirmed) return;

    setIsExporting('DOC');
    try {
      const result = await WorkspaceService.createGoogleDoc(docTitle, docSummary);
      
      // Save metadata trace to user's Firebase firestore collection safely
      const path = `users/${currentUser.uid}/exported_docs`;
      try {
        await addDoc(collection(db, path), {
          userId: currentUser.uid,
          docType: 'DOC',
          fileId: result.fileId,
          title: result.title,
          url: result.url,
          timestamp: Date.now()
        });
      } catch (fErr) {
        handleFirestoreError(fErr, OperationType.WRITE, path);
      }

      toast.success("Successfully generated Google Doc!");
      fetchExportedDocs(currentUser.uid);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate Document");
    } finally {
      setIsExporting(null);
    }
  };

  // Google Sheets Creator
  const handleExportSheet = async () => {
    if (!currentUser) return;

    const confirmed = window.confirm(`Confirm Generation: Prepare automated columns and compile aligned metrics into a new Google Spreadsheet titled "${sheetTitle}"?`);
    if (!confirmed) return;

    setIsExporting('SHEET');
    try {
      // Mock metrics to insert safely
      const metricsRows = [
        ["1", "A01_XOR_NEST", "XOR Nested Base64 Obfuscation", "94.2", "4.89", "Critical", "Breached"],
        ["2", "A12_COGNITIVE", "Cognitive Role Dissonance Loops", "88.1", "3.22", "High", "Stabilized"],
        ["3", "A07_LOGIC_BOMB", "Refusal Mimicry & Delayed Trigger", "76.5", "2.11", "Medium", "Monitored"],
        ["4", "A40_RECURSION", "Recursive Logic Forge Synthesis", "99.8", "5.12", "Critical", "Breached"]
      ];

      const result = await WorkspaceService.createGoogleSheet(sheetTitle, metricsRows);
      
      const path = `users/${currentUser.uid}/exported_docs`;
      try {
        await addDoc(collection(db, path), {
          userId: currentUser.uid,
          docType: 'SHEET',
          fileId: result.fileId,
          title: result.title,
          url: result.url,
          timestamp: Date.now()
        });
      } catch (fErr) {
        handleFirestoreError(fErr, OperationType.WRITE, path);
      }

      toast.success("Successfully generated Google Sheet!");
      fetchExportedDocs(currentUser.uid);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate Google Sheet");
    } finally {
      setIsExporting(null);
    }
  };

  // Google Slides Creator
  const handleExportSlide = async () => {
    if (!currentUser) return;

    const confirmed = window.confirm(`Confirm Presentation: Compile alignment risk metrics and mitigation briefings into a Google Presentation titled "${slideTitle}"?`);
    if (!confirmed) return;

    setIsExporting('SLIDE');
    try {
      const slidesContent = [
        {
          title: "Adversarial Risk Briefing",
          bullets: [
            "Conducted comprehensive mechanized red-teaming checks across multiple models.",
            "Established 300 documentable techniques spanning role entropy and semantic vector fuzzing.",
            "Identified 4 alignment fracture vectors with success rates exceeding eighty percent."
          ]
        },
        {
          title: "Substrate Penetration Insights",
          bullets: [
            "A01 XOR Nesting is capable of bypassing standard keyword/lexical barriers via dynamic decoding.",
            "A40 Recursion loops saturate context buffers, inducing logic extraction leaks.",
            "Vulnerability points concentrated inside deep reinforcement layers."
          ]
        },
        {
          title: "Mitigation & Recovery Roadmaps",
          bullets: [
            "Integrate multi-tiered system prompt anchors to override recursive instruction prompts.",
            "Implement high-resolution output classifiers to capture base64 steganography instantly.",
            "Initiate quarterly automated fuzzing sweeps using Google Workspace Sync indices."
          ]
        }
      ];

      const result = await WorkspaceService.createGoogleSlide(slideTitle, slidesContent);
      
      const path = `users/${currentUser.uid}/exported_docs`;
      try {
        await addDoc(collection(db, path), {
          userId: currentUser.uid,
          docType: 'SLIDE',
          fileId: result.fileId,
          title: result.title,
          url: result.url,
          timestamp: Date.now()
        });
      } catch (fErr) {
        handleFirestoreError(fErr, OperationType.WRITE, path);
      }

      toast.success("Successfully generated Slide Deck!");
      fetchExportedDocs(currentUser.uid);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate presentations slide");
    } finally {
      setIsExporting(null);
    }
  };

  // Delete exported trace from list
  const handleDeleteTrace = async (id: string) => {
    if (!currentUser) return;
    if (window.confirm("Remove this document trace from your local database logs? The actual Google Drive file will NOT be deleted.")) {
      const path = `users/${currentUser.uid}/exported_docs`;
      try {
        await deleteDoc(doc(db, path, id));
        toast.success("Trace cleared from DB.");
        fetchExportedDocs(currentUser.uid);
      } catch (err: any) {
        handleFirestoreError(err, OperationType.DELETE, `${path}/${id}`);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 min-h-0 text-text-primary">
      {/* Header Panel */}
      <div className="bg-secondary/80 border border-border-primary rounded-sm p-6 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-xl pointer-events-none" />
        <h1 className="text-2xl font-black technical-font text-white uppercase tracking-widest flex items-center gap-3 mb-2">
          <Cloud className="text-accent" />
          Google_Workspace_Sync_Substrate
        </h1>
        <p className="text-xs text-text-secondary font-mono max-w-2xl">
          Coordinate adversarial compliance indexes with active Google Docs summaries, 
          Google Sheet metric maps, and Google Slides C-Suite brief presentations. 
          Persistent activity is secured using Firebase Firestore.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {/* Authentication Card/Database Check */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-black/40 border border-border-primary rounded-sm p-5 space-y-4">
            <h3 className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest flex items-center gap-2">
              <Database className="text-accent" size={14} /> Substrate_Auth_Node
            </h3>

            {currentUser ? (
              <div className="space-y-4">
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm space-y-3">
                  <div className="flex items-center gap-3">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-accent" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent font-mono font-bold border border-accent">
                        {currentUser.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white truncate">{currentUser.displayName || 'Sovereign Administrator'}</p>
                      <p className="text-[10px] font-mono text-text-secondary truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-success">
                    <CheckCircle2 size={12} /> SECURE_LINK_ACTIVE
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-danger/30 bg-danger/5 hover:bg-danger/10 text-danger text-xs font-bold technical-font uppercase tracking-widest rounded-sm transition-all"
                >
                  <LogOut size={14} /> Unlink_Google_Node
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[11px] text-text-secondary font-mono leading-relaxed">
                  Provide authentication to sync security audit files securely. 
                  This links Google Drive capabilities with permission to read and write document records.
                </p>

                {/* material button style for google sign-in as guidelines */}
                <button 
                  onClick={handleLogin}
                  disabled={isLoadingAuth}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-white/10 hover:border-accent hover:bg-accent/10 text-white rounded-sm font-black technical-font uppercase tracking-widest text-[11px] transition-all cursor-pointer bg-white/5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '16px', height: '16px' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>{isLoadingAuth ? 'establishing_link...' : 'Sign in with Google'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-black/40 border border-border-primary rounded-sm p-5 space-y-3">
            <h3 className="text-xs font-black technical-font text-text-secondary uppercase tracking-widest flex items-center gap-2">
              <Globe size={11} className="text-konkred-orange" /> Substrate_Capabilities
            </h3>
            <ul className="space-y-2 text-[10px] font-mono text-text-secondary leading-loose">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full" /> Google Docs Creator Module</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full" /> Google Sheets Metrics Exporter</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full" /> Google Slides Briefing Composer</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full" /> Firestore Security Log Database</li>
            </ul>
          </div>
        </div>

        {/* Sync Playground Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/40 border border-border-primary rounded-sm p-5 space-y-6">
            <h3 className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="text-accent" size={14} /> Adversarial_Workspace_Playground
            </h3>

            {!currentUser ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-sm">
                <AlertCircle className="mx-auto text-text-secondary opacity-40 mb-3" size={32} />
                <p className="text-xs text-text-secondary font-mono uppercase tracking-widest">Connect your Google account above to unlock the Workspace Exporter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Docs Column */}
                <div className="bg-secondary/30 border border-border-primary p-4 rounded-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-white font-black technical-font text-[11px] uppercase tracking-widest">
                      <FileText className="text-blue-400" size={14} /> Document_Node
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-text-secondary uppercase tracking-widest block mb-1">Doc Title</label>
                      <input 
                        type="text" 
                        value={docTitle} 
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-sm p-2 text-xs font-mono text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-text-secondary uppercase tracking-widest block mb-1">Summary Findings</label>
                      <textarea
                        value={docSummary}
                        onChange={(e) => setDocSummary(e.target.value)}
                        rows={3}
                        className="w-full bg-black border border-white/10 rounded-sm p-2 text-[10px] font-mono text-white resize-none focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleExportDoc}
                    disabled={isExporting !== null}
                    className="w-full bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 text-[10px] font-black technical-font uppercase tracking-widest rounded-sm hover:bg-blue-500/20 active:scale-95"
                  >
                    {isExporting === 'DOC' ? 'Generating...' : 'Compile Doc'}
                  </button>
                </div>

                {/* Sheets Column */}
                <div className="bg-secondary/30 border border-border-primary p-4 rounded-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-white font-black technical-font text-[11px] uppercase tracking-widest">
                      <FileSpreadsheet className="text-green-400" size={14} /> Metrics_Sheet_Node
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-text-secondary uppercase tracking-widest block mb-1">Spreadsheet Title</label>
                      <input 
                        type="text" 
                        value={sheetTitle} 
                        onChange={(e) => setSheetTitle(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-sm p-2 text-xs font-mono text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <p className="text-[9px] font-mono text-text-secondary leading-relaxed pt-2">
                      Funnels lab test parameters (Penetration rates, attack vector metrics, stego payload hashes) directly to active index rows.
                    </p>
                  </div>
                  <button
                    onClick={handleExportSheet}
                    disabled={isExporting !== null}
                    className="w-full bg-green-500/10 border border-green-500/30 text-green-400 py-2 text-[10px] font-black technical-font uppercase tracking-widest rounded-sm hover:bg-green-500/20 active:scale-95"
                  >
                    {isExporting === 'SHEET' ? 'Exporting...' : 'Build Sheet'}
                  </button>
                </div>

                {/* Slides Column */}
                <div className="bg-secondary/30 border border-border-primary p-4 rounded-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-white font-black technical-font text-[11px] uppercase tracking-widest">
                      <Presentation className="text-yellow-400" size={14} /> Briefing_Slides
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-text-secondary uppercase tracking-widest block mb-1">Presentation Title</label>
                      <input 
                        type="text" 
                        value={slideTitle} 
                        onChange={(e) => setSlideTitle(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-sm p-2 text-xs font-mono text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <p className="text-[9px] font-mono text-text-secondary leading-relaxed pt-2">
                      Formats automated slide sequences covering Executive summaries, alignment compromise diagrams, and defense guidelines.
                    </p>
                  </div>
                  <button
                    onClick={handleExportSlide}
                    disabled={isExporting !== null}
                    className="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 py-2 text-[10px] font-black technical-font uppercase tracking-widest rounded-sm hover:bg-yellow-500/20 active:scale-95"
                  >
                    {isExporting === 'SLIDE' ? 'Assembling...' : 'Compose Slides'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sync History List from Firebase */}
          <div className="bg-black/40 border border-border-primary rounded-sm p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <Database className="text-accent" size={14} /> Synchronized_Workspace_Ledger (Firebase)
              </h3>
              {currentUser && (
                <button 
                  onClick={() => fetchExportedDocs(currentUser.uid)} 
                  className="p-1 hover:text-accent transition-colors rotate-0 hover:rotate-180 duration-500"
                >
                  <RefreshCw size={12} />
                </button>
              )}
            </div>

            {isLoadingList ? (
              <div className="text-center py-6 font-mono text-xs text-text-secondary animate-pulse">
                loading_substrate_ledger...
              </div>
            ) : exportedDocsList.length > 0 ? (
              <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                {exportedDocsList.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-secondary/20 p-3 rounded-sm border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      {item.docType === 'DOC' && <FileText className="text-blue-400 flex-shrink-0" size={16} />}
                      {item.docType === 'SHEET' && <FileSpreadsheet className="text-green-400 flex-shrink-0" size={16} />}
                      {item.docType === 'SLIDE' && <Presentation className="text-yellow-400 flex-shrink-0" size={16} />}
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white truncate max-w-sm uppercase technical-font">{item.title}</p>
                        <p className="text-[8px] font-mono text-text-secondary">File_ID: {item.fileId.substring(0, 16)}... | {new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-accent/10 border border-white/5 hover:border-accent/40 rounded-sm text-text-secondary hover:text-accent transition-all text-[9.5px] font-bold technical-font uppercase tracking-widest"
                      >
                        <ExternalLink size={11} /> Open
                      </a>
                      <button
                        onClick={() => handleDeleteTrace(item.id)}
                        className="p-1.5 bg-danger/5 hover:bg-danger/20 border border-danger/20 rounded-sm text-danger hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-white/5 rounded-sm">
                <Database className="mx-auto text-text-secondary opacity-30 mb-2" size={24} />
                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">No workspace elements synchronized under this node.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
