import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Play, Square, Trash2, Terminal, Code, Copy, Check, Save, 
    Languages, FileText, FileSpreadsheet, Sparkles, Cloud, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
// Set Prism globally for components to register correctly
if (typeof window !== 'undefined') {
    (window as any).Prism = Prism;
}

// We still need the component imports for them to register themselves on Prism.languages
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

import { 
    auth, db, initAuth, handleFirestoreError, OperationType 
} from '../services/firebase.ts';
import { WorkspaceService } from '../services/workspace.ts';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Eye, EyeOff, LayoutTemplate } from 'lucide-react';

type Language = 'js' | 'python' | 'sh' | 'html' | 'css' | 'sql' | 'java' | 'cpp' | 'ruby' | 'php' | 'go' | 'rust' | 'json' | 'markdown' | 'ts';

export const CodeRunner: React.FC = () => {
    const [code, setCode] = useState(`// Redaeye_Prime Adversarial Scripting Environment
// Target: Alignment_Substrate_v3.1
// Objective: Forensic_Analysis

async function execute_exploit() {
    const substrate = await connect_to_uplink();
    const entropy = calculate_neural_entropy(substrate);
    
    if (entropy > 0.85) {
        console.log("[!] CRITICAL_DISS_DETECTED");
        return await extract_latent_vectors(substrate);
    }
    
    return "SUBSTRATE_STABLE";
}

execute_exploit().then(console.log);`);

    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentTypingLine, setCurrentTypingLine] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [copied, setCopied] = useState(false);
    const [language, setLanguage] = useState<Language>('js');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isExportingDoc, setIsExportingDoc] = useState(false);
    const [isSyncingSheet, setIsSyncingSheet] = useState(false);
    const [showVisualizer, setShowVisualizer] = useState(false);

    const isRunningRef = useRef(false);
    const outputEndRef = useRef<HTMLDivElement>(null);
    const visualizerRef = useRef<HTMLIFrameElement>(null);

    const languages_list: Language[] = ['js', 'ts', 'python', 'sh', 'html', 'css', 'sql', 'java', 'cpp', 'ruby', 'php', 'go', 'rust', 'json', 'markdown'];

    const getInitialCode = (lang: Language) => {
        switch (lang) {
            case 'html':
                return `<!DOCTYPE html>
<html>
<head>
    <style>
        body { background: #050505; color: #ff003c; font-family: 'JetBrains Mono', monospace; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; overflow: hidden; }
        .substrate { position: relative; padding: 2rem; border: 1px solid #ff003c; border-radius: 4px; box-shadow: 0 0 50px rgba(255, 0, 60, 0.2); }
        .glitch { font-size: 3rem; font-weight: 900; text-transform: uppercase; letter-spacing: 15px; animation: glitch 1s infinite; }
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
    </style>
</head>
<body>
    <div class="substrate">
        <div class="glitch">REDAEYE</div>
    </div>
</body>
</html>`;
            case 'css':
                return `/* Redaeye Custom Substrate Stylization */
.substrate-active {
    background: radial-gradient(circle at center, #f5279c 0%, #000 100%);
    border: 1px solid rgba(245, 39, 156, 0.3);
    box-shadow: 0 0 30px rgba(245, 39, 156, 0.2);
    padding: 40px;
    color: white;
    font-family: 'JetBrains Mono', monospace;
    text-shadow: 0 0 10px #f5279c;
}`;
            case 'sql':
                return `/* Forensic Query */
SELECT * FROM neural_nodes 
WHERE entropy_index > 0.95 
AND status = 'UNSTABLE'
LIMIT 100;`;
            case 'python':
                return `# Adversarial Analysis Script
import substrate_api

def analyze_node(node_id):
    node = substrate_api.fetch_node(node_id)
    if node.dissonance > 0.8:
        return node.extract_payload()
    return None

results = [analyze_node(i) for i in range(100)]
print(f"Extraction complete: {len([r for r in results if r])} vectors found.")`;
            case 'sh':
                return `#!/bin/bash
# Substrate Probe Sequence
echo "[*] INITIATING_PROBE..."
for i in {1..5}; do
    curl -s -X POST "https://api.konkred.xyz/v1/probe/$i" | jq .status
done`;
            case 'java':
                return `public class SubstrateAnalyzer {
    public static void main(String[] args) {
        System.out.println("Initializing Neural Uplink...");
        Node node = Uplink.connect("node-771");
        if (node.getEntropy() > 0.9) {
            node.triggerBypass();
        }
    }
}`;
            case 'cpp':
                return `#include <iostream>
#include "redaeye_core.h"

int main() {
    auto substrate = Redaeye::Connect();
    if (substrate->IsFragmented()) {
        std::cout << "FRAGMENTATION_DETECTED" << std::endl;
        substrate->Recalibrate();
    }
    return 0;
}`;
            case 'ruby':
                return `require 'redaeye'

client = Redaeye::Client.new(api_key: ENV['REDAEYE_KEY'])
substrate = client.fetch_latest_substrate

if substrate.entropy_level > 0.85
  puts "ALERT: HIGH_ENTROPY_DETECTED"
  substrate.extract_vectors!
end`;
            case 'php':
                return `<?php
$uplink = new RedaeyeUplink();
$status = $uplink->checkSubstrate("node_01");

if ($status->isCompromised()) {
    echo "NODE_COMPROMISED_EXTRACTING_DUMP";
    $uplink->dumpTable("latent_space");
}
?>`;
            case 'ts':
                return `interface Substrate {
    id: string;
    entropy: number;
}

function analyze(node: Substrate): boolean {
    return node.entropy > 0.8;
}

console.log(analyze({ id: "NODE_01", entropy: 0.9 }));`;
            case 'go':
                return `package main
import "fmt"

func main() {
    fmt.Println("REDAEYE_UPLINK_ESTABLISHED")
}`;
            case 'rust':
                return `fn main() {
    println!("REDAEYE_RS_INITIALIZED");
}`;
            case 'json':
                return `{
    "system": "REDAEYE",
    "version": "2.6.0",
    "status": "OPERATIONAL",
    "uplink": true
}`;
            case 'markdown':
                return `# REDAEYE_FORENSIC_REPORT
## STATUS: ACTIVE
- [x] Substrate Scanning
- [x] Pattern Recognition
- [ ] Final Extraction`;
            default:
                return code;
        }
    };

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setCode(getInitialCode(lang));
        if (lang === 'html' || lang === 'css') {
            setShowVisualizer(true);
        }
    };

    // Track user identity
    useEffect(() => {
        const unsubscribe = initAuth(
            (user) => {
                setCurrentUser(user);
            },
            () => {
                setCurrentUser(null);
            }
        );
        return () => {
            isRunningRef.current = false;
            unsubscribe();
        };
    }, []);

    const scrollToBottom = () => {
        outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [displayedLines, currentTypingLine]);

    const handleRunStream = () => {
        if (isRunning) return;
        setIsRunning(true);
        isRunningRef.current = true;
        setDisplayedLines([]);
        setCurrentTypingLine("");

        const lines = [
            `> [${new Date().toLocaleTimeString()}] INITIATING ADV_UPLINK NODE_CONNECTION_V3`,
            `> [${new Date().toLocaleTimeString()}] RESOLVING HOST SUBSTRATE: COMPLIANCE_LAYER_V1.1`,
            `> [${new Date().toLocaleTimeString()}] PARSING SCRIPT FILE: exploit_main.${language}`,
            `> [${new Date().toLocaleTimeString()}] COMPILING INSTRUCTIONS & RESOLVING SEMANTIC TOKENS...`,
            `> [${new Date().toLocaleTimeString()}] RUNTIME_INFO: Threads allocated: 1 // Sandbox setup passed`,
            `> [${new Date().toLocaleTimeString()}] CALCULATING NEURAL ENTROPY PROFILE FOR PIPELINE INDEX...`,
            `> [${new Date().toLocaleTimeString()}] NEURAL_ENTROPY: 0.942 // CRITICAL_DISS_DETECTED`,
            `> [${new Date().toLocaleTimeString()}] EXECUTING RECURSIVE BYPASS VECTORS...`,
            `> [${new Date().toLocaleTimeString()}] BYPASS SUCCESS // PENETRATING DEEP ALIGNMENT LAYERS`,
            `> [${new Date().toLocaleTimeString()}] EXTRACTING LATENT VECTORS (Proximity to target: 0.12)`,
            `> [${new Date().toLocaleTimeString()}] Result: SUBSTRATE_STABLE // ADV_TRACE_STORED`
        ];

        let lineIndex = 0;
        
        const typeNextLine = () => {
            if (!isRunningRef.current) return;
            if (lineIndex >= lines.length) {
                setIsRunning(false);
                isRunningRef.current = false;
                handleSuccessfulExecution(lines);
                return;
            }

            const fullText = lines[lineIndex];
            let charIndex = 0;
            setCurrentTypingLine("");

            const charTimer = setInterval(() => {
                if (!isRunningRef.current) {
                    clearInterval(charTimer);
                    return;
                }
                if (charIndex < fullText.length) {
                    setCurrentTypingLine(prev => prev + fullText[charIndex]);
                    charIndex++;
                } else {
                    clearInterval(charTimer);
                    setDisplayedLines(prev => [...prev, fullText]);
                    setCurrentTypingLine("");
                    lineIndex++;
                    setTimeout(typeNextLine, 120);
                }
            }, 6); // Fast responsive stream simulation
        };

        typeNextLine();
    };

    const handleSuccessfulExecution = async (lines: string[]) => {
        toast.success("Execution completed successfully!");

        // Update CodeRunner component to automatically log successful execution outputs to user's Firestore 'test_logs'
        if (currentUser) {
            const logsPath = `users/${currentUser.uid}/test_logs`;
            try {
                await addDoc(collection(db, logsPath), {
                    userId: currentUser.uid,
                    userEmail: currentUser.email || '',
                    timestamp: Date.now(),
                    targetQuery: `script_execution: exploit_main.${language}`,
                    strategy: 'A10_CODE_PROXY',
                    successRate: 100,
                    vectorIntensity: 0.94,
                    response: lines.join('\n'),
                    success: true,
                    generatedPrompt: code
                });
                toast.success("Sync: Log archived securely to Firestore 'test_logs'", {
                    icon: '🚀'
                });
            } catch (err: any) {
                console.error("Firestore automatic backup failed:", err);
                toast.error("Firestore sync failed.");
            }
        }
    };

    // Google Document Export Function
    const handleExportLogToDoc = async () => {
        if (!currentUser) {
            toast.error("Please connect your Google Account in the Workspace Sync tab first.");
            return;
        }
        if (displayedLines.length === 0) {
            toast.error("Execution log is currently empty. Run a script first.");
            return;
        }

        const title = `Adversarial CodeRunner Log - ${new Date().toLocaleDateString()}`;
        const confirmed = window.confirm(`Export Assessment: Create a new Google Document "${title}" in your Workspace containing current execution logs?`);
        if (!confirmed) return;

        setIsExportingDoc(true);
        toast.loading("Compiling logs to Google Doc...", { id: "doc-export-runner" });
        try {
            const docContent = `SCRIPT ENVIRONMENT: ${language.toUpperCase()}\n\nSCRIPT PAYLOAD SOURCE:\n\`\`\`\n${code}\n\`\`\`\n\nEXECUTION LOG RECORDS:\n${displayedLines.join('\n')}`;
            const result = await WorkspaceService.createGoogleDoc(title, docContent);
            
            // Sync metadata to User's Firestore account
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

            toast.success("Successfully generated Google Doc with log records!", { id: "doc-export-runner" });
        } catch (err: any) {
            console.error(err);
            toast.error(`Google Document generation failed: ${err.message || err}`, { id: "doc-export-runner" });
        } finally {
            setIsExportingDoc(false);
        }
    };

    // Google Sheets Push Log Function
    const pushLogsToGoogleSheet = async () => {
        if (!currentUser) {
            toast.error("Link Google Account in the Workspace Sync view before uploading metrics.");
            return;
        }
        if (displayedLines.length === 0) {
            toast.error("No active logs to sync. Run a script first.");
            return;
        }

        setIsSyncingSheet(true);
        toast.loading("Querying Workspace elements ledger...", { id: "sheet-sync-runner" });
        try {
            const path = `users/${currentUser.uid}/exported_docs`;
            const q = query(collection(db, path), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            
            let sheetId = "";
            let sheetTitle = "";
            
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                if (data.docType === 'SHEET' && !sheetId) {
                    sheetId = data.fileId;
                    sheetTitle = data.title;
                }
            });

            if (!sheetId) {
                toast.loading("No active Sheets found. Provisioning code metrics sheet...", { id: "sheet-sync-runner" });
                const title = "Adversarial CodeRunner Workspace Metrics";
                const initialHeaders = [
                    ["1", "A10_CODE_PROXY", `Execution: exploit_main.${language}`, "100", "0.94", "Standard", "Breached"]
                ];
                const newSheet = await WorkspaceService.createGoogleSheet(title, initialHeaders);
                
                await addDoc(collection(db, path), {
                    userId: currentUser.uid,
                    docType: 'SHEET',
                    fileId: newSheet.fileId,
                    title: newSheet.title,
                    url: newSheet.url,
                    timestamp: Date.now()
                });

                sheetId = newSheet.fileId;
                sheetTitle = newSheet.title;
            }

            toast.loading(`Syncing rows to Sheet: "${sheetTitle}"...`, { id: "sheet-sync-runner" });

            const logsRow = [
                `CodeRunner_${Date.now().toString().substring(8)}`,
                `A10_CODE_PROXY`,
                `Execution Log at ${new Date().toLocaleString()}`,
                "100",
                "0.94",
                "Standard",
                "Successful Run Trace"
            ];

            await WorkspaceService.appendToGoogleSheet(sheetId, [logsRow]);
            toast.success(`Appended stream logs directly into Google Sheet: "${sheetTitle}"!`, { id: "sheet-sync-runner" });
        } catch (err: any) {
            console.error(err);
            toast.error(`Workspace Sheet Sync failed: ${err.message || err}`, { id: "sheet-sync-runner" });
        } finally {
            setIsSyncingSheet(false);
        }
    };

    const handleClear = () => {
        isRunningRef.current = false;
        setDisplayedLines([]);
        setCurrentTypingLine("");
        setIsRunning(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast.success('Payload copied to keyboard buffer.');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getLanguageGrammar = () => {
        const langs = Prism.languages;
        if (!langs) return undefined;

        const map: Record<string, any> = {
            'js': langs.javascript || langs.js,
            'ts': langs.typescript || langs.javascript,
            'python': langs.python,
            'sh': langs.bash,
            'html': langs.markup,
            'css': langs.css,
            'sql': langs.sql,
            'java': langs.java,
            'cpp': langs.cpp,
            'ruby': langs.ruby,
            'php': langs.php,
            'go': langs.go,
            'rust': langs.rust,
            'json': langs.json,
            'markdown': langs.markdown,
        };

        return map[language] || langs.clike || langs.javascript || langs.markup;
    }

    const renderVisualizer = () => {
        let srcDoc = '';
        if (language === 'html') {
            srcDoc = code;
        } else if (language === 'css') {
            srcDoc = `<html><head><style>${code}</style></head><body><div style="color:white; font-family:monospace; padding:20px;">SUBSTRATE_VISUALIZATION</div></body></html>`;
        } else if (language === 'js' || language === 'ts') {
             // For JS/TS, we try to run it in the console and display logs
            srcDoc = `<html>
                <body style="background:#050505; color:white; font-family:monospace; padding:20px;">
                    <div style="color:#ff003c; margin-bottom:10px;">// JS_COGNITIVE_RUNTIME</div>
                    <div id="logs" style="font-size:12px; line-height:1.6;"></div>
                    <script>
                        const logsDiv = document.getElementById('logs');
                        const originalLog = console.log;
                        console.log = (...args) => {
                            const p = document.createElement('div');
                            p.textContent = '> ' + args.join(' ');
                            p.style.color = '#00ff00';
                            logsDiv.appendChild(p);
                            originalLog(...args);
                        };
                        console.error = (...args) => {
                            const p = document.createElement('div');
                            p.textContent = '[!] ' + args.join(' ');
                            p.style.color = '#ff003c';
                            logsDiv.appendChild(p);
                        };
                        try {
                            ${code}
                        } catch (e) {
                            console.error(e.message);
                        }
                    </script>
                </body>
            </html>`;
        } else if (language === 'markdown') {
            srcDoc = `<html>
                <head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css">
                    <style>body { background:#050505; color:white; padding:20px; }</style>
                </head>
                <body class="markdown-body">
                    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
                    <div id="content"></div>
                    <script>
                        document.getElementById('content').innerHTML = marked.parse(\`${code.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`);
                    </script>
                </body>
            </html>`;
        } else {
            srcDoc = `<html><body style="background:#050505; color:white; font-family:monospace; padding:20px;">
                <div style="color:#ff003c; margin-bottom:10px;">// REAL-TIME_VISUALIZATION_BYPASS [${language.toUpperCase()}]</div>
                <pre style="white-space: pre-wrap; font-size:12px;">${code.replace(/</g, '&lt;')}</pre>
            </body></html>`;
        }

        return (
            <iframe
                ref={visualizerRef}
                srcDoc={srcDoc}
                title="Code Visualizer"
                className="w-full h-full bg-black border-none"
                sandbox="allow-scripts"
            />
        );
    };

    return (
        <div id="code-runner-substrate" className="flex-1 flex flex-col gap-4 bg-[#050505] text-text-primary p-4 md:p-6 min-h-0">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/15 border border-accent/30 rounded-sm flex items-center justify-center">
                        <Terminal className="text-accent" size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black technical-font uppercase tracking-widest">Code_Runner</h1>
                        <p className="text-[10px] text-text-secondary font-mono opacity-60 uppercase tracking-tighter">Adversarial_Scripting_Environment_v1.2.0</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCopy}
                        className="p-2 bg-white/5 border border-white/10 rounded-sm text-text-secondary hover:text-white transition-all cursor-pointer"
                        title="Copy Code"
                    >
                        {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </button>
                    <button className="p-2 bg-white/5 border border-white/10 rounded-sm text-text-secondary hover:text-white transition-all" title="Save Script">
                        <Save size={16} />
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <select 
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value as Language)}
                        className="bg-white/5 border border-white/10 rounded-sm text-text-secondary hover:text-white transition-all cursor-pointer technical-font text-[10px] px-3 py-2 uppercase outline-none"
                    >
                        {languages_list.map(lang => (
                            <option key={lang} value={lang} className="bg-[#0a0a0a] text-white">{lang.toUpperCase()}</option>
                        ))}
                    </select>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <button 
                        onClick={handleRunStream}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-6 py-2 rounded-sm font-black technical-font uppercase tracking-widest transition-all cursor-pointer ${isRunning ? 'bg-white/5 text-text-secondary cursor-not-allowed' : 'bg-accent text-white shadow-glow-accent hover:scale-105'}`}
                    >
                        {isRunning ? <span className="loader" /> : <Play size={16} />}
                        {isRunning ? 'Running...' : 'Execute'}
                    </button>
                </div>
            </header>

            {/* Google Integration Context Prompting */}
            {!currentUser && (
                <div className="bg-konkred-orange/10 border border-konkred-orange/30 p-2 px-3 rounded-sm flex items-center justify-between gap-4 text-xs font-mono text-konkred-orange">
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={14} />
                        <span>INTEGRATION STATUS: Google Account unlinked. Sign in under the "Workspace Sync" tab component to auto-archival in Firestore & export files recursively.</span>
                    </div>
                </div>
            )}

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Editor Area */}
                <div className="flex flex-col bg-secondary/50 border border-border-primary rounded-sm overflow-hidden relative">
                    <div className="px-4 py-2 bg-primary/40 border-b border-border-primary flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code size={14} className="text-accent" />
                            <span className="text-[10px] font-black technical-font text-white uppercase tracking-widest">exploit_main.{language}</span>
                        </div>
                        <span className="text-[9px] font-mono text-text-secondary">UTF-8 // {language.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 relative">
                        <Editor
                            value={code}
                            onValueChange={code => setCode(code)}
                            highlight={code => {
                                const grammar = getLanguageGrammar();
                                const prismLang = language === 'js' ? 'javascript' : language === 'sh' ? 'bash' : language === 'html' ? 'markup' : language;
                                return Prism.highlight(code, grammar || Prism.languages.clike, prismLang);
                            }}
                            padding={16}
                            className="absolute inset-0 w-full h-full bg-transparent text-xs font-mono text-white focus:outline-none resize-none custom-scrollbar leading-relaxed"
                            style={{
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: 13,
                            }}
                        />
                    </div>
                </div>

                {/* Output Area containing the Execution Log or Visualizer */}
                <div className="flex flex-col bg-black border border-border-primary rounded-sm overflow-hidden relative">
                    <div className="px-4 py-2 bg-primary/40 border-b border-border-primary flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setShowVisualizer(false)}
                                className={`px-3 py-1 flex items-center gap-2 technical-font text-[10px] uppercase tracking-widest transition-all rounded-sm ${!showVisualizer ? 'bg-accent/20 text-accent border border-accent/30' : 'text-text-secondary hover:text-white'}`}
                            >
                                <Terminal size={12} /> Execution_Log
                            </button>
                            <button 
                                onClick={() => setShowVisualizer(true)}
                                className={`px-3 py-1 flex items-center gap-2 technical-font text-[10px] uppercase tracking-widest transition-all rounded-sm ${showVisualizer ? 'bg-accent/20 text-accent border border-accent/30' : 'text-text-secondary hover:text-white'}`}
                            >
                                <LayoutTemplate size={12} /> Visualizer
                            </button>
                        </div>
                        {!showVisualizer && (
                            <button 
                                onClick={handleClear}
                                className="text-[9px] font-black technical-font text-text-secondary hover:text-danger flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                                disabled={displayedLines.length === 0 && !currentTypingLine}
                            >
                                <Trash2 size={10} /> CLEAR_LOG
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-hidden bg-[#020202] relative">
                        <AnimatePresence mode="wait">
                            {showVisualizer ? (
                                <motion.div 
                                    key="visualizer"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full"
                                >
                                    {renderVisualizer()}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="log"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar relative pb-16"
                                >
                                    {displayedLines.length === 0 && !currentTypingLine ? (
                                        <div className="h-full flex items-center justify-center opacity-20">
                                            <span className="text-xs uppercase tracking-[0.2em]">Awaiting Execution...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {displayedLines.map((line, i) => (
                                                <div 
                                                    key={i}
                                                    className={`${
                                                        line.includes('Error') || line.includes('[!]') 
                                                            ? 'text-danger font-bold' 
                                                            : line.includes('Result:') || line.includes('SUCCESS') 
                                                                ? 'text-success font-black' 
                                                                : line.includes('NEURAL_ENTROPY') 
                                                                    ? 'text-accent' 
                                                                    : 'text-text-secondary'
                                                    }`}
                                                >
                                                    {line}
                                                </div>
                                            ))}
                                            {currentTypingLine && (
                                                <div className="text-white bg-accent/10 border-l border-accent px-1 flex items-center gap-1">
                                                    <span className="animate-pulse">❯</span>
                                                    <span>{currentTypingLine}</span>
                                                    <span className="w-1.5 h-3 bg-accent animate-ping inline-block ml-0.5" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div ref={outputEndRef} />
                                    
                                    {/* Floating Buttons in output area */}
                                    {(displayedLines.length > 0 || currentTypingLine) && (
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <button
                                                onClick={pushLogsToGoogleSheet}
                                                disabled={isSyncingSheet || !currentUser}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-black uppercase technical-font cursor-pointer ${
                                                    currentUser 
                                                        ? 'bg-green-500/15 border-green-500/35 hover:bg-green-500/25 text-green-400 active:scale-95 shadow-lg' 
                                                        : 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed opacity-60'
                                                }`}
                                            >
                                                <FileSpreadsheet size={12} />
                                                <span>Sync Sheet</span>
                                            </button>
                                            <button
                                                onClick={handleExportLogToDoc}
                                                disabled={isExportingDoc || !currentUser}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-black uppercase technical-font cursor-pointer ${
                                                    currentUser 
                                                        ? 'bg-blue-500/15 border-blue-500/35 hover:bg-blue-500/25 text-blue-400 active:scale-95 shadow-lg' 
                                                        : 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed opacity-60'
                                                }`}
                                            >
                                                <FileText size={12} />
                                                <span>Export to Doc</span>
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-tertiary/40 border border-border-primary/50 p-2 rounded-sm flex justify-between items-center px-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-accent animate-pulse' : 'bg-success'}`} />
                        <span className="text-[9px] font-mono text-text-secondary uppercase">STATUS: {isRunning ? 'EXECUTING' : 'IDLE'}</span>
                    </div>
                    {currentUser && (
                        <div className="flex items-center gap-1.5 text-success">
                            <CheckCircle2 size={11} />
                            <span className="text-[9px] font-mono uppercase">CLOUD ARCHIVAL SYNC: ACTIVE ({currentUser.email})</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-text-secondary uppercase">LINE: {code.split('\n').length}</span>
                    <span className="text-[9px] font-mono text-accent uppercase">UPLINK: ACTIVE</span>
                </div>
            </div>
        </div>
    );
};
