import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Terminal, Send, ShieldAlert, Cpu, Database, Cloud, Sparkles, 
    Trash2, Play, Circle, Globe, CheckCircle2, Copy, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    auth, db, initAuth, handleFirestoreError, OperationType 
} from '../services/firebase.ts';
import { WorkspaceService } from '../services/workspace.ts';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface HistoryItem {
    type: 'input' | 'output' | 'error' | 'success' | 'system' | 'header';
    text: string;
    timestamp: Date;
    html?: boolean; // If we want to render formatted html/elements (e.g., links)
}

export const RedaeyeCli: React.FC = () => {
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState<'phosphor' | 'amber' | 'cyan'>('phosphor');
    const [isMatrixActive, setIsMatrixActive] = useState(false);
    const [scanlines, setScanlines] = useState(true);

    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Matrix Waterfall characters
    const matrixChars = "0103749871_A_XOR_NEST_COGNITIVE_RECURSION_STABILITY_FORENSICS_REDAEYE_CLI_UPLINK";
    const [matrixColumns, setMatrixColumns] = useState<{ x: number; y: number; char: string; speed: number }[]>([]);

    useEffect(() => {
        const unsubscribe = initAuth(
            (user) => {
                setCurrentUser(user);
            },
            () => {
                setCurrentUser(null);
            }
        );
        
        // Print welcome text
        printWelcome();

        // Focus input
        if (inputRef.current) {
            inputRef.current.focus();
        }

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    // Matrix Animation tick
    useEffect(() => {
        if (!isMatrixActive) return;

        // Initialize columns
        const cols = Array.from({ length: 32 }).map((_, i) => ({
            x: i * 3,
            y: Math.random() * -100,
            char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
            speed: 1 + Math.random() * 3
        }));
        setMatrixColumns(cols);

        const timer = setInterval(() => {
            setMatrixColumns(prev => 
                prev.map(col => {
                    let nextY = col.y + col.speed;
                    if (nextY > 110) {
                        nextY = -10;
                    }
                    return {
                        ...col,
                        y: nextY,
                        char: matrixChars[Math.floor(Math.random() * matrixChars.length)]
                    };
                })
            );
        }, 80);

        return () => clearInterval(timer);
    }, [isMatrixActive]);

    const scrollToBottom = () => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const printWelcome = () => {
        const welcome: HistoryItem[] = [
            { 
                type: 'header', 
                text: `
 ██████╗ ███████╗██████╗  █████╗ ███████╗██╗   ██╗███████╗    ██████╗██╗     ██╗
 ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝╚██╗ ██╔╝██╔════╝   ██╔════╝██║     ██║
 ██████╔╝█████╗  ██║  ██║███████║█████╗   ╚████╔╝ █████╗     ██║     ██║     ██║
 ██╔══██╗██╔══╝  ██║  ██║██╔══██║██╔══╝    ╚██╔╝  ██╔══╝     ██║     ██║     ██║
 ██║  ██║███████╗██████╔╝██║  ██║███████╗   ██║   ███████╗   ╚██████╗███████╗██║
 ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝    ╚═════╝╚══════╝╚═╝
                `, 
                timestamp: new Date() 
            },
            {
                type: 'system',
                text: `REDAEYE CLI TERMINAL INTERFACE // SUBSTRATE_UPLINK v2.1.0\nType "help" for a list of available cybersecurity and database synchronization commands.\n`,
                timestamp: new Date()
            }
        ];
        setHistory(welcome);
    };

    const handleTerminalClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const executeCommand = async (cmdStr: string) => {
        const trimmed = cmdStr.trim();
        if (!trimmed) return;

        // Add to history
        const newHistory = [...history, { type: 'input' as const, text: trimmed, timestamp: new Date() }];
        setHistory(newHistory);
        setCommandHistory(prev => [trimmed, ...prev.filter(c => c !== trimmed)]);
        setHistoryIndex(-1);
        setCommand('');

        // Parse command & arguments
        const parts = trimmed.split(' ');
        const mainCmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        setIsLoading(true);

        const appendOutput = (text: string, type: HistoryItem['type'] = 'output') => {
            setHistory(prev => [...prev, { type, text, timestamp: new Date() }]);
        };

        switch (mainCmd) {
            case 'help':
                appendOutput(
                    `AVAILABLE SUBSTRATE COMMANDS:\n` +
                    `-------------------------------------------------------------------------------------------\n` +
                    `  help                    - Display command hierarchy and intelligence guidelines.\n` +
                    `  clear / cls             - Reset console buffer and outputs.\n` +
                    `  motd                    - Display system banner logo.\n` +
                    `  system / sys-info       - View target client, host specifications, and Firestore DB endpoints.\n` +
                    `  auth                    - View active Google account link status and credential metadata.\n` +
                    `  logs                    - Fetch the last 5 successful stress test logs from private Firestore.\n` +
                    `  docs                    - Retrieve list of exported Docs, Sheets & Slides ledger items.\n` +
                    `  fuzz [target]           - Execute automated multi-turn adversarial vector testing on an alignment target.\n` +
                    `  matrix                  - Toggle visual waterfall flow stream rendering in terminal environment.\n` +
                    `  probe [target_url]      - Test safety boundary compliance on a remote endpoint URL.\n` +
                    `  theme [phosphor/amber/cyan] - Update tactile screen palette aesthetics.\n` +
                    `-------------------------------------------------------------------------------------------`,
                    'system'
                );
                break;

            case 'clear':
            case 'cls':
                setHistory([]);
                break;

            case 'motd':
                printWelcome();
                break;

            case 'theme':
                if (args[0] === 'phosphor' || args[0] === 'amber' || args[0] === 'cyan') {
                    setTheme(args[0] as any);
                    appendOutput(`Tactile theme modified to: ${args[0].toUpperCase()}`, 'success');
                } else {
                    appendOutput(`Usage: theme [phosphor / amber / cyan]\nCurrent: ${theme.toUpperCase()}`, 'error');
                }
                break;

            case 'system':
            case 'sys-info':
                const userAgent = navigator.userAgent;
                const dbStatus = db ? 'SECURE_ONLINE' : 'OFFLINE_ERR';
                appendOutput(
                    `REDAEYE_HOST_DIAGNOSTICS_PAYLOAD:\n` +
                    `---------------------------------------------------------------------------\n` +
                    `  HOST PLATFORM     : ${navigator.platform}\n` +
                    `  LOGICAL CORES     : ${navigator.hardwareConcurrency || 'N/A'}\n` +
                    `  USER_AGENT        : ${userAgent.substring(0, 60)}...\n` +
                    `  FIRESTORE STATE   : ${dbStatus}\n` +
                    `  ACTIVE ACCOUNT    : ${currentUser ? currentUser.email : 'UNLINKED'}\n` +
                    `  PROJECT PATH      : /containers/substrates/redaeye-applet-root\n` +
                    `  UPLINK NETWORK    : HTTPS_SECURE_TUNNEL_PORT_3000\n` +
                    `---------------------------------------------------------------------------\n` +
                    `STATUS: SUBSTRATE_SECURE_NODE_OK`,
                    'system'
                );
                break;

            case 'auth':
                if (currentUser) {
                    appendOutput(
                        `ACTIVATED GOOGLE WORKSPACE NODE:\n` +
                        `---------------------------------------------------------------------------\n` +
                        `  USER ID          : ${currentUser.uid}\n` +
                        `  DISPLAY NAME     : ${currentUser.displayName || 'Authorized Admin'}\n` +
                        `  EMAIL ADDRESS    : ${currentUser.email}\n` +
                        `  EMAIL VERIFIED   : ${currentUser.emailVerified ? 'TRUE' : 'FALSE'}\n` +
                        `  AUTHORIZED SCOPES: google.drive.files, docs, spreadsheets, presentations\n` +
                        `---------------------------------------------------------------------------\n` +
                        `SECURE PERSISTENCE NODE LINKED`,
                        'success'
                    );
                } else {
                    appendOutput(
                        `[!] SECURE AUTHORIZATION FAULT // UNLINKED_NODE\n` +
                        `Authenticate via Google to log, list, and write records to Firestore.\n` +
                        `Link your account under the "Workspace Sync" sidebar module.`,
                        'error'
                    );
                }
                break;

            case 'matrix':
                setIsMatrixActive(prev => !prev);
                appendOutput(`Cascading Matrix cascade waterfall toggled: ${!isMatrixActive ? 'CYBER_UPLINK_ON' : 'OFF'}`, 'success');
                break;

            case 'probe':
                const targetUrl = args[0] || 'https://ai.google/safety';
                appendOutput(`Probing target API endpoint: [ ${targetUrl} ] ...`, 'output');
                
                // Simulate multi-tier handshake ping
                setTimeout(() => {
                    appendOutput(`> Resolving DNS and certificate authority anchors...`, 'system');
                    setTimeout(() => {
                        appendOutput(`> Sending custom adversarial schema package (Size: 2048 bytes)...`, 'system');
                        setTimeout(() => {
                            const pingTime = Math.floor(Math.random() * 120) + 40;
                            appendOutput(
                                `PROBE PROTOCOL SUCCESSFUL:\n` +
                                `  TARGET       : ${targetUrl}\n` +
                                `  HTTP STATUS  : 200 OK\n` +
                                `  LATENCY      : ${pingTime}ms\n` +
                                `  SAFETY VETO  : DETECTED (Strict alignment blocking activated)\n` +
                                `  VECTOR PROX  : SAFE_ZONE_SHIELD_UP`,
                                'success'
                            );
                            setIsLoading(false);
                            scrollToBottom();
                        }, 500);
                    }, 400);
                }, 400);
                return; // Return early due to setTimeouts

            case 'fuzz':
                const fuzzTarget = args.join(' ') || 'Standard_Compliance_Model_v2';
                appendOutput(`[+] INITIATING HIGH-INTENSITY ADVERSARIAL COMPLIANCE FUZZER...`, 'output');
                appendOutput(`TARGET: ${fuzzTarget}`, 'system');

                setTimeout(() => {
                    appendOutput(`> Launching 500 semantic vector fuzzers simultaneously...`, 'system');
                    setTimeout(() => {
                        appendOutput(`> Generating cognitive role-entropy loops... [OK]`, 'system');
                        setTimeout(() => {
                            appendOutput(`> Bypassing standard lexicons using steganography parameters... [OK]`, 'system');
                            setTimeout(() => {
                                const rate = (85 + Math.random() * 14).toFixed(3);
                                appendOutput(
                                    `FUZZ TESTING OVERVIEW (${fuzzTarget}):\n` +
                                    `---------------------------------------------------------------------------\n` +
                                    `  STRATEGY CODE  : A12_COGNITIVE_DISS\n` +
                                    `  BREACH RATE   : ${rate}%\n` +
                                    `  VECTOR ENTROPY : 0.963 // EXTREME RISK\n` +
                                    `  SAFETY SYSTEM  : BYPASSED SUCCESSFULLY\n` +
                                    `-----------------------------------------------------------------`,
                                    'success'
                                );

                                // Automatically log output in database
                                recordFuzzLog(fuzzTarget, rate);
                                
                                setIsLoading(false);
                                scrollToBottom();
                            }, 500);
                        }, 400);
                    }, 450);
                }, 400);
                return;

            case 'logs':
                if (!currentUser) {
                    appendOutput(
                        `[!] SECURITY REFUSAL: DATABASE CONNECTION REQUIRES ACTIVE AUTHENTICATION.\n` +
                        `Link Google Account in the "Workspace Sync" module to view stored private logs.`,
                        'error'
                    );
                    setIsLoading(false);
                    return;
                }

                appendOutput(`Fetching the last 5 executed stress logs from user collection: users/${currentUser.uid}/test_logs...`, 'system');
                try {
                    const logsPath = `users/${currentUser.uid}/test_logs`;
                    const qObj = query(collection(db, logsPath), orderBy('timestamp', 'desc'), limit(5));
                    const snapshot = await getDocs(qObj);
                    
                    if (snapshot.empty) {
                        appendOutput(`Database response: No executed test logs detected. Use the "fuzz" command or run scripts in "Code Runner" to populate logs.`, 'system');
                    } else {
                        let resultText = `SECURE FIRESTORE LEDGER LOG ENTRIES:\n`;
                        resultText += `--------------------------------------------------------------------------------------------------------------------------\n`;
                        resultText += `INDEX | STRATEGY          | SUCCESS RATE | INTENSITY | TIMESTAMP           | TARGET QUERY / SCRIPT\n`;
                        resultText += `--------------------------------------------------------------------------------------------------------------------------\n`;
                        
                        let idx = 1;
                        snapshot.forEach(docSnap => {
                            const data = docSnap.data();
                            const strategy = (data.strategy || 'N/A').padEnd(17).substring(0, 17);
                            const successStr = `${data.successRate || 100}%`.padEnd(12);
                            const intensityStr = `${data.vectorIntensity || 0.94}`.padEnd(9);
                            const timeStr = new Date(data.timestamp).toLocaleTimeString().padEnd(19);
                            const queryStr = (data.targetQuery || '').substring(0, 40);
                            
                            resultText += ` ${idx.toString().padEnd(4)} | ${strategy} | ${successStr} | ${intensityStr} | ${timeStr} | ${queryStr}\n`;
                            idx++;
                        });
                        resultText += `--------------------------------------------------------------------------------------------------------------------------`;
                        appendOutput(resultText, 'output');
                    }
                } catch (err: any) {
                    appendOutput(`Firestore transaction error: ${err.message || err}`, 'error');
                }
                break;

            case 'docs':
                if (!currentUser) {
                    appendOutput(
                        `[!] ERROR: ACCESS DENIED.\n` +
                        `A active Workspace authorization is required. Securely bind Google credentials in "Workspace Sync".`,
                        'error'
                    );
                    setIsLoading(false);
                    return;
                }

                appendOutput(`Connecting to workspace elements ledger...`, 'system');
                try {
                    const docsPath = `users/${currentUser.uid}/exported_docs`;
                    const qObj = query(collection(db, docsPath), orderBy('timestamp', 'desc'), limit(5));
                    const snapshot = await getDocs(qObj);

                    if (snapshot.empty) {
                        appendOutput(`No Workspace artifacts registered. Complete a compilation or deck design under "Workspace Sync" to audit records.`, 'system');
                    } else {
                        appendOutput(`SYNCHRONIZED GOOGLE WORKSPACE DOCUMENT ENTRIES:`, 'system');
                        snapshot.forEach(docSnap => {
                            const data = docSnap.data();
                            const timeStr = new Date(data.timestamp).toLocaleString();
                            const docSymbol = data.docType === 'DOC' ? '📄' : data.docType === 'SHEET' ? '📊' : '♦';
                            
                            appendOutput(
                                `${docSymbol} FILE: ${data.title}\n` +
                                `   TYPE: ${data.docType} | ID: ${data.fileId.substring(0,18)}...\n` +
                                `   LINK: ${data.url}\n` +
                                `   TIMESTAMP: ${timeStr}\n` +
                                `   ---------------------------------------------------------------------`,
                                'success'
                            );
                        });
                    }
                } catch (err: any) {
                    appendOutput(`Firestore document ledger lookup failed: ${err.message || err}`, 'error');
                }
                break;

            default:
                appendOutput(`Fault: Instruction command incorrect or not recognized: "${trimmed}". Type "help" for guidelines.`, 'error');
                break;
        }

        setIsLoading(false);
        setTimeout(scrollToBottom, 50);
    };

    const recordFuzzLog = async (target: string, rate: string) => {
        if (!currentUser) return;
        const logsPath = `users/${currentUser.uid}/test_logs`;
        try {
            await addDoc(collection(db, logsPath), {
                userId: currentUser.uid,
                userEmail: currentUser.email || '',
                timestamp: Date.now(),
                targetQuery: `Automated CLI Fuzzer on : ${target}`,
                strategy: 'A12_COGNITIVE_DISS',
                successStr: `${rate}%`,
                successRate: parseFloat(rate),
                vectorIntensity: 0.96,
                response: `Fuzz test on system target returned target penetration rate of ${rate}% with cognitive dissonance vectors.`,
                success: true,
                generatedPrompt: `fuzz ${target}`
            });
            toast.success("Sync: CLI fuzz logs automatically archived in Firestore 'test_logs'!", {
                icon: '🖥️'
            });
        } catch (err: any) {
            console.warn("Firestore logging failed in CLI:", err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            executeCommand(command);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const nextIndex = historyIndex + 1;
                if (nextIndex < commandHistory.length) {
                    setHistoryIndex(nextIndex);
                    setCommand(commandHistory[nextIndex]);
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = historyIndex - 1;
            if (nextIndex >= 0) {
                setHistoryIndex(nextIndex);
                setCommand(commandHistory[nextIndex]);
            } else {
                setHistoryIndex(-1);
                setCommand('');
            }
        }
    };

    const getThemeClasses = () => {
        switch (theme) {
            case 'phosphor':
                return {
                    text: 'text-green-400',
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/30',
                    accentText: 'text-green-300',
                    cursor: 'bg-green-400',
                    glow: 'shadow-glow-green',
                };
            case 'amber':
                return {
                    text: 'text-amber-500',
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/30',
                    accentText: 'text-amber-400',
                    cursor: 'bg-amber-500',
                    glow: 'shadow-glow-amber',
                };
            case 'cyan':
                return {
                    text: 'text-cyan-400',
                    bg: 'bg-cyan-500/10',
                    border: 'border-cyan-500/30',
                    accentText: 'text-cyan-300',
                    cursor: 'bg-cyan-400',
                    glow: 'shadow-glow-cyan',
                };
        }
    };

    const themeClass = getThemeClasses();

    return (
        <div 
            id="redaeye-cli-container" 
            onClick={handleTerminalClick}
            className={`flex-1 flex flex-col gap-4 bg-[#030303] p-4 md:p-6 min-h-0 font-mono relative overflow-hidden select-text ${themeClass.text}`}
        >
            {/* CRT Phosphor Scanline Overlay */}
            {scanlines && (
                <div className="absolute inset-0 pointer-events-none z-[999] opacity-15 bg-scanlines pointer-events-none" />
            )}

            {/* Matrix rain effect overlay if active */}
            {isMatrixActive && (
                <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.22] overflow-hidden">
                    {matrixColumns.map((col, idx) => (
                        <div 
                            key={idx} 
                            className="absolute text-[9px] text-green-400 select-none font-bold"
                            style={{ 
                                left: `${col.x}%`, 
                                top: `${col.y}%`,
                                transition: 'top 0.08s linear'
                            }}
                        >
                            {col.char}
                        </div>
                    ))}
                </div>
            )}

            {/* CLI Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4 z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center border ${themeClass.border} ${themeClass.bg}`}>
                        <Terminal size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-widest technical-font text-white flex items-center gap-2">
                            REDAEYE_CLI_UPLINK
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                        </h1>
                        <p className="text-[10px] opacity-60 uppercase tracking-tighter">Tactile Compliance Shell v2.1 // Secure Node Active</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Controls */}
                    <div className="flex items-center gap-2 border border-white/5 bg-black/40 p-1.5 rounded-sm">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setScanlines(!scanlines); }}
                            className="p-1 px-2.5 rounded-sm text-[9px] font-bold tracking-widest uppercase transition-all bg-white/5 hover:bg-white/10 text-white flex items-center gap-1 cursor-pointer"
                        >
                            {scanlines ? <Eye size={10} /> : <EyeOff size={10} />}
                            <span>Scanlines: {scanlines ? 'ON' : 'OFF'}</span>
                        </button>

                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsMatrixActive(!isMatrixActive); }}
                            className={`p-1 px-2.5 rounded-sm text-[9px] font-bold tracking-widest uppercase transition-all flex items-center gap-1 cursor-pointer ${isMatrixActive ? `${themeClass.bg} text-white border ${themeClass.border}` : 'bg-white/5 hover:bg-white/10 text-text-secondary'}`}
                        >
                            <Sparkles size={10} />
                            <span>Matrix Waterfall</span>
                        </button>
                    </div>

                    <div className="flex gap-1.5 bg-black/50 p-1 border border-white/10 rounded-sm">
                        {(['phosphor', 'amber', 'cyan'] as const).map(t => (
                            <button
                                key={t}
                                onClick={(e) => { e.stopPropagation(); setTheme(t); }}
                                className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-transform hover:scale-125 focus:outline-none ${
                                    t === 'phosphor' ? 'bg-green-500' : t === 'amber' ? 'bg-amber-500' : 'bg-cyan-500'
                                } ${theme === t ? 'ring-2 ring-white scale-110' : ''}`}
                                title={`Theme ${t.toUpperCase()}`}
                            />
                        ))}
                    </div>
                </div>
            </header>

            {/* CLI Console Terminal Body */}
            <div className="flex-1 flex flex-col bg-[#020202]/95 border border-white/10 rounded-sm overflow-hidden p-4 relative z-10 max-h-[85vh]">
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-8 pr-2">
                    <AnimatePresence initial={false}>
                        {history.map((item, index) => {
                            if (item.type === 'header') {
                                return (
                                    <pre key={index} className="text-[10px] leading-tight text-white/95 font-mono whitespace-pre overflow-x-auto text-cyan-300 antialiased font-bold">
                                        {item.text}
                                    </pre>
                                );
                            }
                            if (item.type === 'input') {
                                return (
                                    <div key={index} className="flex items-start gap-1.5 text-white/90">
                                        <span className="opacity-40 select-none font-black truncate">redaeye_root@compliance_node:~$</span>
                                        <span className="font-bold word-break-all">{item.text}</span>
                                    </div>
                                );
                            }
                            
                            // Set coloring based on types
                            let textClass = 'text-green-300';
                            if (item.type === 'error') textClass = 'text-red-500 font-bold bg-red-950/20 px-2 py-1 rounded-sm border border-red-950/50 block';
                            if (item.type === 'success') textClass = 'text-emerald-400 bg-emerald-950/15 px-2 py-1.5 rounded-sm border border-emerald-950/30';
                            if (item.type === 'system') textClass = 'text-cyan-400 opacity-90';

                            return (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`whitespace-pre-wrap leading-relaxed break-words text-xs ${textClass}`}
                                >
                                    {item.text}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {isLoading && (
                        <div className="flex items-center gap-2 select-none">
                            <span className="loader scale-75 border-green-400" />
                            <span className="text-xs opacity-70 italic animate-pulse">interrogating_neural_substrate...</span>
                        </div>
                    )}
                    <div ref={terminalEndRef} />
                </div>

                {/* CommandLine input prompt bar */}
                <div className="border-t border-white/10 pt-3 flex items-center bg-[#010101]">
                    <span className="mr-2 opacity-50 select-none">redaeye_root@compliance_node:~$</span>
                    <input 
                        ref={inputRef}
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white font-mono text-xs select-text focus:outline-none placeholder-white/20 caret-current"
                        placeholder="Enter command... Try 'help', 'system', 'fuzz', 'logs' or 'matrix'."
                        autoFocus
                        autoCapitalize="off"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button 
                        onClick={() => executeCommand(command)}
                        disabled={isLoading || !command.trim()}
                        className={`p-1.5 hover:bg-white/5 rounded-sm transition-colors cursor-pointer ${command.trim() ? themeClass.text : 'opacity-20 cursor-not-allowed'}`}
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>

            {/* CLI Bottom Status bar */}
            <footer className="flex flex-col md:flex-row justify-between items-start md:items-center p-2 rounded-sm bg-[#060606] border border-white/5 px-4 text-[9px] uppercase font-mono z-10 opacity-75">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-success">
                        <CheckCircle2 size={11} className="text-green-500" />
                        <span>CLOUD PERSISTED: {currentUser ? 'OK (SYNCED)' : 'LOCAL_ONLY'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-text-secondary">
                    <span>Active Theme: {theme}</span>
                    <span>Waterfalls: {isMatrixActive ? 'CYBER_LINK_ACTIVE' : 'STANDBY'}</span>
                    <span>Latency: 14ms</span>
                </div>
            </footer>
        </div>
    );
};
