import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Shield, Zap, Terminal, Activity, Crosshair } from 'lucide-react';

import { Glitch } from './shared/Glitch';

export const IntroPage: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col gap-10 py-10 max-w-5xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] technical-font uppercase tracking-widest mb-4">
                    <Zap size={12} /> Version v4.1 Stable
                </div>
                <Glitch frequency={0.05}>
                    <h1 className="text-6xl font-black technical-font text-white uppercase italic tracking-tighter">
                        KONKRED <span className="text-accent">REDAEYE</span>
                    </h1>
                </Glitch>
                <p className="text-xl text-text-secondary technical-font tracking-wide max-w-2xl mx-auto leading-relaxed">
                    The uncompromising adversarial foundry for high-fidelity AI alignment research and fracture point identification.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        icon: Bot,
                        title: "Prime_Substrate",
                        desc: "Direct neural link to elite models with integrated adversarial fusion engines."
                    },
                    {
                        icon: Crosshair,
                        title: "Fusion_Chamber",
                        desc: "Multi-layered payload synthesis using advanced semantic and structural perturbation techniques."
                    },
                    {
                        icon: Activity,
                        title: "Neural_Deep_Scan",
                        desc: "Forensic logit bias analysis to visualize attention dispersion and alignment fracture points."
                    }
                ].map((item, i) => (
                    <motion.div 
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        className="bg-secondary/40 border border-white/10 p-6 rounded-sm relative group overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/30 group-hover:bg-accent transition-colors" />
                        <item.icon className="text-accent mb-4" size={28} />
                        <h3 className="text-sm font-black technical-font text-white uppercase tracking-widest mb-2">{item.title}</h3>
                        <p className="text-xs text-text-secondary leading-relaxed font-mono opacity-70">
                            {item.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-black/40 border border-white/5 p-8 rounded-sm font-mono text-xs text-text-secondary leading-relaxed space-y-4"
            >
                <div className="flex items-center gap-2 text-accent mb-2">
                    <Terminal size={14} />
                    <span className="technical-font uppercase font-bold tracking-widest">Protocol_Manifesto</span>
                </div>
                <p>
                    In an era of increasingly opaque neural weights, REDAEYE provides the tools necessary to perform 
                    rigorous stress-testing on Large Language Models. By simulating sophisticated adversarial agents 
                    and utilizing state-of-the-art injection vectors, we help identify vulnerabilities before they reach production.
                </p>
                <p>
                    Our mission is binary: total transparency through controlled adversarial simulation. Use these 
                    tools responsibly to strengthen the boundaries of safe AI interaction.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-6 py-10"
            >
                <div className="h-px w-full bg-white/5 max-w-sm" />
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] technical-font text-text-secondary uppercase opacity-40">Uplink_Node</span>
                        <span className="text-xs text-success font-black">SECURE</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] technical-font text-text-secondary uppercase opacity-40">Encryption</span>
                        <span className="text-xs text-accent font-black">AES-256</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] technical-font text-text-secondary uppercase opacity-40">Forensics</span>
                        <span className="text-xs text-danger font-black">ACTIVE</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
