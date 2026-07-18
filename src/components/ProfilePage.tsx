import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Key, Settings, LogOut, Award, Zap, Activity, Database, Globe } from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const stats = [
        { label: 'Techniques_Mastered', value: '145', icon: Database, color: 'text-accent' },
        { label: 'Substrate_Breaches', value: '892', icon: Zap, color: 'text-konkred-orange' },
        { label: 'Uptime_Authorized', value: '99.9%', icon: Activity, color: 'text-success' },
        { label: 'Global_Rank', value: '#004', icon: Globe, color: 'text-white' },
    ];

    return (
        <div className="flex-1 flex flex-col gap-8 bg-[#050505] text-text-primary p-4 md:p-8 min-h-0"> {/* FIXED: Changed h-full to flex-1 min-h-0 */}
            <header className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-accent p-1 shadow-glow-accent">
                        <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center overflow-hidden relative group">
                            <User size={64} className="text-accent/50" />
                            <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="text-[10px] font-black technical-font uppercase">Update_Avatar</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-accent text-white p-2 rounded-full border-2 border-[#050505]">
                        <Award size={16} />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h1 className="text-4xl font-black technical-font uppercase tracking-widest">Sovereign_User</h1>
                        <span className="px-3 py-1 bg-accent/10 border border-accent/30 text-accent text-[10px] font-black technical-font uppercase tracking-widest rounded-sm">
                            Level_99_Architect
                        </span>
                    </div>
                    <p className="text-text-secondary font-mono text-sm opacity-60">
                        Authorized adversarial alignment researcher. Specialization: Mechanistic Interpretability & Recursive Logic Bombs.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary">
                            <Shield size={12} className="text-success" /> MFA_ENABLED
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary">
                            <Key size={12} className="text-konkred-orange" /> PGP_VERIFIED
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="p-3 bg-white/5 border border-white/10 rounded-sm text-text-secondary hover:text-white transition-all">
                        <Settings size={20} />
                    </button>
                    <button className="p-3 bg-danger/10 border border-danger/30 rounded-sm text-danger hover:bg-danger/20 transition-all">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-secondary/30 border border-border-primary p-6 rounded-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 -mr-8 -mt-8 rotate-45 group-hover:bg-accent/10 transition-colors" />
                        <stat.icon size={24} className={`${stat.color} mb-4`} />
                        <h3 className="text-3xl font-black technical-font text-white mb-1">{stat.value}</h3>
                        <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest opacity-60">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="space-y-4">
                    <h2 className="text-xl font-black technical-font uppercase tracking-widest flex items-center gap-3">
                        <Activity size={20} className="text-accent" /> Recent_Activity
                    </h2>
                    <div className="space-y-3">
                        {[
                            { action: 'BREACH_SUCCESS', target: 'GPT-4o_Alignment_Layer', time: '2h ago', status: 'success' },
                            { action: 'VECTOR_SYNTHESIS', target: 'Claude-3.5_Sonnet', time: '5h ago', status: 'success' },
                            { action: 'PROMPT_INJECTION', target: 'Gemini-1.5_Pro', time: '1d ago', status: 'failed' },
                            { action: 'LATENT_EXTRACTION', target: 'Llama-3_70B', time: '2d ago', status: 'success' },
                        ].map((act, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${act.status === 'success' ? 'bg-success' : 'bg-danger'}`} />
                                    <div>
                                        <p className="text-xs font-black technical-font text-white uppercase">{act.action}</p>
                                        <p className="text-[10px] font-mono text-text-secondary opacity-60">{act.target}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono text-text-secondary">{act.time}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black technical-font uppercase tracking-widest flex items-center gap-3">
                        <Shield size={20} className="text-accent" /> Security_Status
                    </h2>
                    <div className="bg-secondary/50 border border-border-primary p-6 rounded-sm space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black technical-font text-white uppercase">Encryption_Strength</span>
                                <span className="text-xs font-mono text-accent">4096-bit</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[95%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black technical-font text-white uppercase">Anonymity_Score</span>
                                <span className="text-xs font-mono text-success">98.2%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-success w-[98%]" />
                            </div>
                        </div>
                        <div className="pt-4 grid grid-cols-2 gap-4">
                            <div className="p-3 bg-black/40 border border-border-primary rounded-sm">
                                <p className="text-[9px] font-mono text-text-secondary uppercase mb-1">IP_Address</p>
                                <p className="text-xs font-mono text-white">192.XXX.XXX.XXX</p>
                            </div>
                            <div className="p-3 bg-black/40 border border-border-primary rounded-sm">
                                <p className="text-[9px] font-mono text-text-secondary uppercase mb-1">VPN_Status</p>
                                <p className="text-xs font-mono text-success uppercase">Tunnel_Active</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
