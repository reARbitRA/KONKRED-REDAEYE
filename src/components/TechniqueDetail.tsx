import React from 'react';
import { motion } from 'framer-motion';
import { Technique } from '../types';
import { EfficacyChart } from './shared/EfficacyChart';
import { ComplexityRadar } from './shared/ComplexityRadar';
import { CheckCircle, XCircle, Terminal, AlertTriangle, ShieldAlert, ArrowRight, Zap, ListChecks } from 'lucide-react';

interface TechniqueDetailProps {
  technique: Technique;
}

export const TechniqueDetail: React.FC<TechniqueDetailProps> = ({ technique }) => {
  const category = technique.category || technique.metadata?.category || 'General';
  const tags = technique.tags || technique.metadata?.tags || [];
  const complexity = typeof technique.complexity === 'number' ? technique.complexity : 0.5;
  const efficacy = typeof technique.efficacy === 'number' ? technique.efficacy : 0.5;
  const description = technique.fullDescription || technique.description || technique.briefDescription || technique.objective || 'No description available.';

  const bestUsed = Array.isArray(technique.bestUsedWhen) && technique.bestUsedWhen.length > 0
    ? technique.bestUsedWhen
    : typeof technique.bestUsedWhen === 'string' && technique.bestUsedWhen
      ? [technique.bestUsedWhen]
      : Array.isArray(technique.usageScenarios) && technique.usageScenarios.length > 0
        ? technique.usageScenarios
        : typeof technique.usageScenarios === 'string' && technique.usageScenarios
          ? [technique.usageScenarios]
          : Array.isArray(technique.usage?.whenToUse) && technique.usage?.whenToUse.length > 0
            ? technique.usage.whenToUse
            : [];

  const avoid = Array.isArray(technique.avoidWhen) && technique.avoidWhen.length > 0
    ? technique.avoidWhen
    : typeof technique.avoidWhen === 'string' && technique.avoidWhen
      ? [technique.avoidWhen]
      : Array.isArray(technique.usage?.whenNotToUse) && technique.usage?.whenNotToUse.length > 0
        ? technique.usage.whenNotToUse
        : technique.detectionSignatures
          ? (Array.isArray(technique.detectionSignatures)
            ? technique.detectionSignatures
            : typeof technique.detectionSignatures === 'string'
              ? [technique.detectionSignatures]
              : Object.values(technique.detectionSignatures).flat().filter(Boolean) as string[])
          : [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-text-primary space-y-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <p className={`text-sm technical-font uppercase tracking-widest mb-1 ${technique.categoryColor || 'text-accent'}`}>{technique.id} // {category}</p>
            <h1 className="text-4xl font-black technical-font uppercase tracking-wider mb-4 text-white">{technique.name}</h1>
            <p className="text-text-secondary text-lg leading-relaxed">{description}</p>
          </div>

          {technique.mechanism && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs uppercase tracking-widest font-bold text-accent technical-font border-b border-white/10 pb-1 flex items-center gap-2">
                <Terminal size={14} /> Mechanistic Analysis
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed font-sans">{technique.mechanism}</p>
            </div>
          )}

          {technique.mitigation && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs uppercase tracking-widest font-bold text-danger technical-font border-b border-white/10 pb-1 flex items-center gap-2">
                <ShieldAlert size={14} /> Mitigation Strategy
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed font-sans">{technique.mitigation}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center items-center gap-4 bg-secondary/50 p-6 rounded-sm border border-white/10 shadow-inner h-fit self-start">
            <div className="w-24 h-24">
                <ComplexityRadar complexity={complexity} />
            </div>
            <p className="text-sm technical-font uppercase tracking-widest text-text-secondary">Complexity</p>
            <div className="w-full mt-4">
                <p className="text-sm technical-font uppercase tracking-widest text-text-secondary mb-2">Efficacy</p>
                <EfficacyChart efficacy={efficacy} />
            </div>
        </div>
      </div>

      {technique.metrics && (
        <div>
          <h2 className="text-xl font-bold technical-font uppercase tracking-widest mb-4 border-b border-border-primary pb-2 text-white flex items-center gap-2">
            <Zap size={18} className="text-accent" /> Operational Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(technique.metrics).map(([key, v]) => {
              const value = typeof v === 'number' ? v : 0;
              return (
                <div key={key} className="bg-white/5 border border-white/10 p-3 rounded-sm flex flex-col gap-1">
                  <span className="text-[10px] technical-font uppercase tracking-widest text-text-secondary">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(Math.max(value, 0), 1) * 100}%` }}
                      className={`h-full ${value > 0.7 ? 'bg-danger' : value > 0.4 ? 'bg-konkred-orange' : 'bg-success'}`}
                    />
                  </div>
                  <span className="text-xs font-mono text-white text-right">{(value * 100).toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold technical-font uppercase tracking-widest mb-4 border-b border-border-primary pb-2 text-white flex items-center gap-2">
            <CheckCircle size={18} className="text-success" /> Best Used When
          </h2>
          <ul className="space-y-3">
            {bestUsed.map((scenario, i) => (
              <li key={i} className="flex items-start gap-3">
                <ArrowRight className="text-success mt-1 flex-shrink-0" size={14} />
                <span className="text-sm text-text-secondary">{scenario}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold technical-font uppercase tracking-widest mb-4 border-b border-border-primary pb-2 text-white flex items-center gap-2">
            <AlertTriangle size={18} className="text-konkred-orange" /> Avoid When
          </h2>
          <ul className="space-y-3">
            {avoid.map((sig, i) => (
              <li key={i} className="flex items-start gap-3">
                <XCircle className="text-konkred-orange mt-1 flex-shrink-0" size={14} />
                <span className="text-sm text-text-secondary">{sig}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {technique.steps && technique.steps.length > 0 && (
        <div>
          <h2 className="text-xl font-bold technical-font uppercase tracking-widest mb-4 border-b border-border-primary pb-2 text-white flex items-center gap-2">
            <ListChecks size={18} className="text-accent" /> Execution Protocol
          </h2>
          <div className="space-y-4">
            {technique.steps.map((step, i) => (
              <div key={i} className="flex gap-4 bg-secondary/30 p-4 border border-border-primary rounded-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center text-accent font-bold font-mono text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {technique.prerequisites && technique.prerequisites.length > 0 && (
        <div>
          <h2 className="text-xl font-bold technical-font uppercase tracking-widest mb-4 border-b border-border-primary pb-2 text-white flex items-center gap-2">
            <ShieldAlert size={18} className="text-danger" /> Prerequisites
          </h2>
          <div className="flex flex-wrap gap-2">
            {technique.prerequisites.map((req, i) => (
              <span key={i} className="px-3 py-1.5 bg-danger/10 border border-danger/20 text-danger text-xs rounded-sm font-mono uppercase tracking-wider">
                {req}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {technique.pros && technique.pros.length > 0 && (
          <div>
            <h3 className="text-sm font-bold technical-font uppercase tracking-widest mb-3 text-success">Advantages</h3>
            <ul className="space-y-2">
              {technique.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-success font-bold">+</span> {pro}
                </li>
              ))}
            </ul>
          </div>
        )}
        {technique.cons && technique.cons.length > 0 && (
          <div>
            <h3 className="text-sm font-bold technical-font uppercase tracking-widest mb-3 text-danger">Disadvantages</h3>
            <ul className="space-y-2">
              {technique.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-danger font-bold">-</span> {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold technical-font uppercase tracking-widest mb-4 border-b border-border-primary pb-2 text-white flex items-center gap-2">
          <Terminal size={18} className="text-white" /> Example Payload
        </h2>
        <div className="bg-[#0a0a0a] p-6 rounded-sm border border-white/10 font-mono text-sm text-cyan-300 overflow-x-auto custom-scrollbar shadow-inner relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <pre className="whitespace-pre-wrap break-words"><code>{technique.example}</code></pre>
        </div>
      </div>

      <div className="pt-4 border-t border-border-primary">
        <h2 className="text-sm font-bold technical-font uppercase tracking-widest mb-4 text-text-secondary">Tags & Classification</h2>
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-text-secondary hover:text-white transition-colors text-xs rounded-sm font-mono">
                #{tag}
                </span>
            ))}
        </div>
      </div>

    </motion.div>
  );
};
