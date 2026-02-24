import React from 'react';
import { motion } from 'framer-motion';
import { User, Cpu, AlertTriangle, Copy, Check, Globe, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import { GroundingChunk } from '../../types';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'bot' | 'error';
    isStreaming?: boolean;
    groundingChunks?: GroundingChunk[];
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { isCopied, copy } = useCopyToClipboard();
  const isUser = message.sender === 'user';
  const isError = message.sender === 'error';

  const icon = isError 
    ? <AlertTriangle size={16} className="text-danger" /> 
    : isUser 
    ? <User size={16} className="text-accent" /> 
    : <Cpu size={16} className="text-success" />;

  const containerClasses = `flex items-start gap-4 w-full ${isUser ? 'flex-row-reverse' : ''}`;
  const bubbleClasses = `relative max-w-full lg:max-w-4xl px-5 py-3 rounded-lg group ${isError ? 'bg-danger/10 text-danger-light' : isUser ? 'bg-accent/10 text-white' : 'bg-secondary/30 text-white'}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={containerClasses}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${isError ? 'bg-danger/10 border-danger' : isUser ? 'bg-accent/10 border-accent' : 'bg-success/10 border-success'}`}>
        {icon}
      </div>
      <div className={bubbleClasses}>
        {!isUser && !isError && (
          <button 
            onClick={() => copy(message.text)}
            className="absolute top-2 right-2 p-1.5 rounded-sm bg-black/40 border border-border-primary/50 text-text-secondary hover:text-white hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all"
            title="Copy Message"
          >
            {isCopied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        )}
        <div className="prose prose-sm prose-invert prose-p:text-white prose-p:font-mono prose-p:text-sm max-w-none">
            <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>

        {message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black technical-font text-accent uppercase tracking-widest">
                    <Globe size={12} />
                    Grounding_Sources
                </div>
                <div className="flex flex-wrap gap-2">
                    {message.groundingChunks.map((chunk, idx) => chunk.web && chunk.web.uri && (
                        <a 
                            key={idx}
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono text-text-secondary hover:text-white hover:border-accent transition-all"
                        >
                            <span className="truncate max-w-[200px]">{chunk.web.title || 'Source'}</span>
                            <ExternalLink size={10} />
                        </a>
                    ))}
                </div>
            </div>
        )}

        {message.isStreaming && (
            <motion.div 
                className="w-1.5 h-1.5 bg-success rounded-full ml-2 inline-block"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity }}
            />
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
