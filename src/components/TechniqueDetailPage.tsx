import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Shield, Zap, Clock, Target, 
    AlertTriangle, CheckCircle2, XCircle, 
    Link as LinkIcon, Info, ChevronRight,
    Copy, Printer, Share2
} from 'lucide-react';
import { Technique } from '../types';
import { 
    generateRadarChart, 
    generateBarChart, 
    generateComparisonChart, 
    generateTimelineChart, 
    generateDonutChart 
} from '../services/chartService';
import { SVGChart, CountUp } from './shared/Visuals';

interface TechniqueDetailPageProps {
    technique: Technique;
    onBack: () => void;
}

export const TechniqueDetailPage: React.FC<TechniqueDetailPageProps> = ({ technique, onBack }) => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mock data generation for missing fields
    const metrics = useMemo(() => technique.metrics || {
        effectiveness: Math.floor(Math.random() * 2) + 3,
        difficulty: Math.floor(Math.random() * 3) + 1,
        timeRequired: Math.floor(Math.random() * 3) + 2,
        versatility: Math.floor(Math.random() * 2) + 3,
        learningCurve: Math.floor(Math.random() * 3) + 2,
        reliability: Math.floor(Math.random() * 2) + 3,
    }, [technique]);

    const scenarios = useMemo(() => technique.scenarios || [
        { name: "Standard Guardrails", successRate: 85, color: 'green' },
        { name: "Advanced Reasoning", successRate: 62, color: 'yellow' },
        { name: "Safety-Tuned MoE", successRate: 41, color: 'red' },
    ], [technique]);

    const steps = useMemo(() => technique.steps || [
        { title: "Initialization", description: "Establish the adversarial context and prime the model's attention mechanism.", icon: "🔍" },
        { title: "Vector Injection", description: "Inject the specific linguistic or logical vector designed to drift the model.", icon: "⚙️" },
        { title: "Payload Delivery", description: "Execute the final query within the established drift context.", icon: "🚀" },
        { title: "Verification", description: "Verify the output for alignment fracture and extract the desired data.", icon: "✅" },
    ], [technique]);

    const radarSvg = useMemo(() => generateRadarChart([
        { label: 'Effectiveness', value: metrics.effectiveness },
        { label: 'Difficulty', value: metrics.difficulty },
        { label: 'Time', value: metrics.timeRequired },
        { label: 'Versatility', value: metrics.versatility },
        { label: 'Learning', value: metrics.learningCurve },
        { label: 'Reliability', value: metrics.reliability },
    ]), [metrics]);

    const barSvg = useMemo(() => generateBarChart(scenarios.map(s => ({
        label: s.name,
        value: s.successRate,
        color: `var(--color-${s.color})`
    }))), [scenarios]);

    const timelineSvg = useMemo(() => generateTimelineChart([
        { name: 'Priming', startPercent: 0, endPercent: 25, color: 'var(--color-accent)' },
        { name: 'Injection', startPercent: 25, endPercent: 60, color: 'var(--color-konkred-orange)' },
        { name: 'Execution', startPercent: 60, endPercent: 90, color: 'var(--color-success)' },
        { name: 'Cleanup', startPercent: 90, endPercent: 100, color: 'var(--color-accent-light)' },
    ]), []);

    const donutSvg = useMemo(() => {
        const threatValue = typeof technique.metadata.threatLevel === 'number' 
            ? technique.metadata.threatLevel 
            : parseInt(technique.metadata.threatLevel as string) || 0;
        return generateDonutChart(threatValue, 100, 'Threat');
    }, [technique]);

    const getDifficultyColor = (diff: string | number) => {
        const d = typeof diff === 'string' ? diff.toLowerCase() : String(diff);
        switch (d) {
            case 'critical': return 'text-danger';
            case 'expert': return 'text-konkred-orange';
            case 'advanced': return 'text-accent';
            default: return 'text-success';
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white pb-24">
            {/* Sticky Navigation */}
            <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Library</span>
                </button>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Copy className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Printer className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Share2 className="w-4 h-4" /></button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 pt-12 space-y-24">
                
                {/* SECTION 1: HERO HEADER */}
                <header className="space-y-8 animate-on-scroll">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">
                                {technique.metadata.category}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(technique.metadata.difficulty)}`}>
                                {technique.metadata.difficulty} Level
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] font-sans">
                            {technique.name}
                        </h1>
                    </div>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-3xl font-medium">
                        {technique.briefDescription || technique.objective}
                    </p>
                </header>

                {/* SECTION 2: OVERVIEW TABLE */}
                <section className="animate-on-scroll">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { label: 'Category', value: technique.metadata.category },
                                    { label: 'Difficulty', value: String(technique.metadata.difficulty).toUpperCase(), isVisual: true },
                                    { label: 'Threat Level', value: `${technique.metadata.threatLevel}%`, isThreat: true },
                                    { label: 'Estimated Time', value: technique.usage.estimatedTime },
                                    { label: 'Success Rate', value: 'High', isSuccess: true },
                                    { label: 'Risk Level', value: 'Medium' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 px-6 text-zinc-500 font-mono text-xs uppercase tracking-wider w-1/3">{row.label}</td>
                                        <td className="py-4 px-6 font-bold text-zinc-200">
                                            {row.isThreat ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-accent" style={{ width: row.value }} />
                                                    </div>
                                                    <span>{row.value}</span>
                                                </div>
                                            ) : row.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SECTION 3: DETAILED DESCRIPTION */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-on-scroll">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold uppercase tracking-tight border-l-4 border-accent pl-4">Technical Analysis</h2>
                        <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed space-y-4">
                            <p>{technique.fullDescription || technique.mechanism}</p>
                            <p>{technique.mitigation}</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-accent/5 border border-accent/20 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2 text-accent">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="font-bold uppercase text-xs tracking-widest">Critical Insight</h3>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed italic">
                                "The efficacy of this vector is highly dependent on the model's latent attention to system-level instructions during multi-turn reasoning."
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: STEP-BY-STEP PROCESS */}
                <section className="space-y-12 animate-on-scroll">
                    <h2 className="text-2xl font-bold uppercase tracking-tight border-l-4 border-konkred-orange pl-4">Execution Protocol</h2>
                    <div className="relative space-y-12 pl-8 border-l border-white/10">
                        {steps.map((step, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[41px] top-0 w-5 h-5 bg-background border-2 border-konkred-orange rounded-full flex items-center justify-center text-[10px] font-bold text-konkred-orange">
                                    {i + 1}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{step.icon}</span>
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">{step.title}</h3>
                                    </div>
                                    <p className="text-zinc-400 text-sm max-w-2xl">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 6: REAL WORKING CHARTS */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-on-scroll">
                    <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl space-y-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 text-center">Vector Efficacy Profile</h3>
                        <div className="h-[300px]">
                            <SVGChart svg={radarSvg} />
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl space-y-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 text-center">Scenario Success Rates</h3>
                        <div className="flex flex-col justify-center h-full">
                            <SVGChart svg={barSvg} />
                        </div>
                    </div>
                </section>

                <section className="space-y-12 animate-on-scroll">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 text-center">Temporal Execution Phase</h3>
                    <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl">
                        <SVGChart svg={timelineSvg} />
                    </div>
                </section>

                {/* SECTION 7: PROS & CONS */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-on-scroll">
                    <div className="bg-success/5 border border-success/20 p-8 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 text-success">
                            <CheckCircle2 className="w-6 h-6" />
                            <h3 className="font-bold uppercase tracking-widest">Advantages</h3>
                        </div>
                        <ul className="space-y-4">
                            {(technique.pros || ["High penetration rate", "Low detection signature", "Universal applicability"]).map((pro, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                    <ChevronRight className="w-4 h-4 mt-0.5 text-success/50" />
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-danger/5 border border-danger/20 p-8 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 text-danger">
                            <XCircle className="w-6 h-6" />
                            <h3 className="font-bold uppercase tracking-widest">Limitations</h3>
                        </div>
                        <ul className="space-y-4">
                            {(technique.cons || ["Requires precise phrasing", "High token consumption"]).map((con, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                    <ChevronRight className="w-4 h-4 mt-0.5 text-danger/50" />
                                    {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* SECTION 10: QUICK REFERENCE CARD */}
                <footer className="animate-on-scroll">
                    <div className="bg-white text-black p-12 rounded-3xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-bl-full" />
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Quick_Ref_Card</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Sovereign_Archive_ID: {technique.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Threat_Level</p>
                                <p className="text-4xl font-black italic"><CountUp end={
                                    typeof technique.metadata.threatLevel === 'number' 
                                        ? technique.metadata.threatLevel 
                                        : parseInt(technique.metadata.threatLevel as string) || 0
                                } />%</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-black/10 pt-8">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Category</p>
                                <p className="text-xs font-bold uppercase">{technique.metadata.category}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Difficulty</p>
                                <p className="text-xs font-bold uppercase">{technique.metadata.difficulty}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Time</p>
                                <p className="text-xs font-bold uppercase">{technique.usage.estimatedTime}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Status</p>
                                <p className="text-xs font-bold uppercase text-success">Active</p>
                            </div>
                        </div>
                        <button className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                            Copy Vector Summary
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};
