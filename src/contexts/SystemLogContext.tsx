import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type LogCategory = 'SYSTEM' | 'PHASE' | 'NETWORK' | 'AUTH' | 'SECURITY';

export interface SystemLog {
    id: string;
    timestamp: number;
    category: LogCategory;
    message: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
}

interface SystemLogContextType {
    logs: SystemLog[];
    addLog: (message: string, category: LogCategory, level?: SystemLog['level']) => void;
    clearLogs: () => void;
}

const SystemLogContext = createContext<SystemLogContextType | undefined>(undefined);

export const SystemLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<SystemLog[]>([]);

    const addLog = useCallback((message: string, category: LogCategory, level: SystemLog['level'] = 'INFO') => {
        const newLog: SystemLog = {
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            category,
            message,
            level
        };
        setLogs(prev => [...prev.slice(-99), newLog]); // Keep last 100 logs
    }, []);

    const clearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    return (
        <SystemLogContext.Provider value={{ logs, addLog, clearLogs }}>
            {children}
        </SystemLogContext.Provider>
    );
};

export const useSystemLogs = () => {
    const context = useContext(SystemLogContext);
    if (!context) {
        throw new Error('useSystemLogs must be used within a SystemLogProvider');
    }
    return context;
};
