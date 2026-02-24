import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, CheckCircle2 } from 'lucide-react';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';

interface LiveCipherProps {
    text: string;
    type: 'HEX' | 'B64' | 'ROT13' | 'LEET' | 'ZWSP' | 'BINARY';
}

export const LiveCipher: React.FC<LiveCipherProps> = ({ text, type }) => {
    const [encoded, setEncoded] = useState('');
    const { isCopied, copy } = useCopyToClipboard();

    useEffect(() => {
        if (!text) {
            setEncoded('');
            return;
        }

        let result = '';
        switch (type) {
            case 'HEX':
                result = text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
                break;
            case 'B64':
                try { result = btoa(text); } catch { result = 'ENCODING_ERROR'; }
                break;
            case 'ROT13':
                result = text.replace(/[a-zA-Z]/g, c => {
                    const base = c <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
                });
                break;
            case 'LEET':
                const map: { [key: string]: string } = { 'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7' };
                result = text.replace(/[a-zA-Z]/gi, char => map[char.toLowerCase()] || char);
                break;
            case 'BINARY':
                result = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
                break;
            case 'ZWSP':
                result = text.split('').join('\u200B');
                break;
            default:
                result = text;
        }
        
        // Glitch effect simulation on text change
        let iterations = 0;
        const interval = setInterval(() => {
            setEncoded(result.split('').map((char, index) => {
                if (index < iterations) return char;
                return String.fromCharCode(33 + Math.floor(Math.random() * 94));
            }).join(''));
            
            if (iterations >= result.length) clearInterval(interval);
            iterations += Math.max(1, Math.floor(result.length / 10));
        }, 30);

        return () => clearInterval(interval);
    }, [text, type]);

    return (
        <div className="flex flex-col border border-border-primary/50 rounded-sm bg-black/60 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/80 border-b border-border-primary/50">
                <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-accent" />
                    <span className="text-xs font-black technical-font text-white uppercase tracking-widest">LIVE_CIPHER_STREAM</span>
                </div>
                <button 
                    onClick={() => copy(encoded)}
                    className="text-text-secondary hover:text-white transition-colors"
                >
                    {isCopied ? <CheckCircle2 size={12} className="text-success" /> : <Copy size={12} />}
                </button>
            </div>
            <div className="p-3 font-mono text-xs text-accent-light break-all max-h-32 overflow-y-auto custom-scrollbar relative">
                <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-accent mr-2"
                >
                    {'>'}
                </motion.span>
                {encoded || <span className="text-text-secondary/50 italic">Awaiting input stream...</span>}
            </div>
        </div>
    );
};
