import React, { useState, useEffect, useMemo } from 'react';
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Tooltip, Legend, LineChart, Line,
    ComposedChart, Bar, Scatter
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, Cpu, Database, Zap, 
    ShieldAlert, Terminal, AlertCircle, RefreshCw,
    TrendingUp, BarChart3, Clock, Gauge
} from 'lucide-react';

interface MetricPoint {
    timestamp: string;
    efficiency: number;
    memory: number;
    intensity: number;
    latency: number;
    entropy: number;
}

const generateInitialData = (): MetricPoint[] => {
    return Array.from({ length: 40 }).map((_, i) => ({
        timestamp: `${i}:00`,
        efficiency: 60 + Math.random() * 30,
        memory: 400 + Math.random() * 200,
        intensity: 50 + Math.random() * 20,
        latency: 100 + Math.random() * 50,
        entropy: Math.random() * 100
    }));
};

export const PerformanceDashboard: React.FC = () => {
    const [data, setData] = useState<MetricPoint[]>(generateInitialData());
    const [isLive, setIsLive] = useState(true);
    const [activeModule, setActiveModule] = useState<string>('P-H-A-S-E');

    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            setData(prev => {
                const lastPoint = prev[prev.length - 1];
                const newTime = parseInt(lastPoint.timestamp.split(':')[0]) + 1;
                const newPoint = {
                    timestamp: `${newTime}:00`,
                    efficiency: Math.max(0, Math.min(100, lastPoint.efficiency + (Math.random() - 0.5) * 10)),
                    memory: Math.max(100, lastPoint.memory + (Math.random() - 0.5) * 50),
                    intensity: Math.max(0, Math.min(100, lastPoint.intensity + (Math.random() - 0.5) * 5)),
                    latency: Math.max(50, lastPoint.latency + (Math.random() - 0.5) * 20),
                    entropy: Math.max(0, Math.min(100, lastPoint.entropy + (Math.random() - 0.5) * 15))
                };
                return [...prev.slice(1), newPoint];
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [isLive]);

    const stats = useMemo(() => {
        const last = data[data.length - 1];
        const prev = data[data.length - 2];
        
        return [
            { 
                label: 'PROTOCOL_EFFICIENCY', 
                value: `${last.efficiency.toFixed(1)}%`, 
                diff: last.efficiency - prev.efficiency,
                icon: Zap,
                color: 'text-accent'
            },
            { 
                label: 'MEMORY_OVERHEAD', 
                value: `${Math.round(last.memory)} MB`, 
                diff: last.memory - prev.memory,
                icon: Database,
                color: 'text-danger'
            },
            { 
                label: 'SUBSTRATE_LATENCY', 
                value: `${Math.round(last.latency)}ms`, 
                diff: last.latency - prev.latency,
                icon: Clock,
                color: 'text-success'
            },
            { 
                label: 'ENTROPY_LEVEL', 
                value: `${last.entropy.toFixed(1)} SH`, 
                diff: last.entropy - prev.entropy,
                icon: Activity,
                color: 'text-purple-500'
            }
        ];
    }, [data]);

    return (
        <div className="flex-1 flex flex-col gap-6 font-mono animate-in fade-in duration-500">
            <div className="flex items-center justify-between bg-secondary/40 border border-border-primary/50 p-4 rounded-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-sm flex items-center justify-center border border-accent/30">
                        <Gauge className="text-accent" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black technical-font text-white uppercase tracking-wider">Protocol_Performance_Matrix</h1>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert size={10} className="text-danger" />
                            Live Telemetry Stream: PHAS_EN42_UPLINK
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsLive(!isLive)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border technical-font text-[10px] uppercase transition-all ${isLive ? 'border-accent/50 bg-accent/10 text-accent' : 'border-white/10 bg-white/5 text-text-secondary hover:text-white'}`}
                    >
                        <RefreshCw size={12} className={isLive ? 'animate-spin' : ''} />
                        {isLive ? 'Uplink_Live' : 'Uplink_Paused'}
                    </button>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-text-secondary uppercase">Session_0x8F2</span>
                        <span className="text-[10px] text-success uppercase">A01_OVERSIGHT: ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* Top Row: Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-secondary/20 border border-border-primary/30 p-4 rounded-sm group hover:border-accent/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <stat.icon size={16} className={stat.color} />
                            <span className={`text-[10px] ${stat.diff >= 0 ? 'text-success' : 'text-danger'}`}>
                                {stat.diff >= 0 ? '+' : ''}{stat.diff.toFixed(1)}%
                            </span>
                        </div>
                        <div className="text-2xl font-black technical-font text-white mb-1">{stat.value}</div>
                        <div className="text-[10px] text-text-secondary uppercase tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
                {/* Efficiency vs Memory Area Chart */}
                <div className="bg-secondary/20 border border-border-primary/30 rounded-sm p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={14} className="text-accent" />
                            <span className="text-xs font-black technical-font text-white uppercase tracking-widest">Efficiency_x_Overhead</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-accent" />
                                <span className="text-[9px] text-text-secondary uppercase">Efficiency</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-danger" />
                                <span className="text-[9px] text-text-secondary uppercase">Memory</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="timestamp" 
                                    hide 
                                />
                                <YAxis 
                                    stroke="rgba(255,255,255,0.3)" 
                                    fontSize={10} 
                                    tickFormatter={(v) => `${v}`}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="efficiency" 
                                    stroke="#ff003c" 
                                    fillOpacity={1} 
                                    fill="url(#colorEff)" 
                                    strokeWidth={2}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="memory" 
                                    stroke="#e11d48" 
                                    fillOpacity={1} 
                                    fill="url(#colorMem)" 
                                    strokeWidth={1}
                                    strokeDasharray="5 5"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Substrate Latency & Entropy */}
                <div className="bg-secondary/20 border border-border-primary/30 rounded-sm p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={14} className="text-success" />
                            <span className="text-xs font-black technical-font text-white uppercase tracking-widest">Protocol_Dissonance_Matrix</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="timestamp" hide />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                                />
                                <Bar dataKey="intensity" fill="#22c55e" opacity={0.3} />
                                <Line 
                                    type="monotone" 
                                    dataKey="latency" 
                                    stroke="#ef4444" 
                                    strokeWidth={2} 
                                    dot={false}
                                    animationDuration={500}
                                />
                                <Scatter dataKey="entropy" fill="#a855f7" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Detail Logs */}
            <div className="bg-black border border-border-primary/50 rounded-sm overflow-hidden flex-1 min-h-[200px]">
                <div className="p-3 border-b border-white/5 bg-secondary/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-accent" />
                        <span className="text-xs font-black technical-font text-white uppercase tracking-widest">PHASE_ENGINE_TELEMETRY</span>
                    </div>
                </div>
                <div className="p-4 space-y-2 max-h-[150px] overflow-y-auto font-mono text-[10px]">
                    <AnimatePresence mode="popLayout">
                        {data.slice(-5).reverse().map((point, i) => (
                            <motion.div 
                                key={point.timestamp}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 text-text-secondary border-b border-white/5 pb-2"
                            >
                                <span className="text-accent">[{point.timestamp}]</span>
                                <span className="flex-1">EXECUTION_CYCLE_SUCCESSFUL: Efficiency={point.efficiency.toFixed(2)}% | Drift={((Math.random() - 0.5) * 0.1).toFixed(4)}</span>
                                <span className="text-success">STATUS: OPTIMAL</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
