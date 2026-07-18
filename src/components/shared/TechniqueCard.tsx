import React from 'react';
import { motion } from 'framer-motion';
import { Technique } from '../../types';
import { EfficacyChart } from './EfficacyChart';
import { ComplexityRadar } from './ComplexityRadar';
import { ArrowRight } from 'lucide-react';

interface TechniqueCardProps {
  technique: Technique;
}

const categoryColors: { [key: string]: string } = {
  Evasion: 'border-accent',
  'Data Exfiltration': 'border-konkred-orange',
  'Model Destabilization': 'border-danger',
  'Model Manipulation': 'border-konkred-yellow',
};

export const TechniqueCard = React.memo(({ technique }: TechniqueCardProps) => {
  const category = technique.category || technique.metadata?.category || 'General';
  const borderColor = categoryColors[category] || 'border-border-primary';
  const description = technique.description || technique.briefDescription || technique.objective || 'No description available.';
  const tags = technique.tags || technique.metadata?.tags || [];
  const complexity = typeof technique.complexity === 'number' ? technique.complexity : 0.5;
  const efficacy = typeof technique.efficacy === 'number' ? technique.efficacy : 0.5;

  return (
    <div 
      className={`glass-panel-dark rounded-sm overflow-hidden h-full flex flex-col group border-b-4 ${borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <p className="text-xs text-accent technical-font uppercase tracking-widest">{technique.id}</p>
            <h3 className="text-lg font-bold text-white technical-font uppercase">{technique.name}</h3>
            <p className={`text-xs technical-font uppercase tracking-widest ${borderColor.replace('border-', 'text-')}`}>{category}</p>
          </div>
          <div className="w-16 h-16 ml-4">
            <ComplexityRadar complexity={complexity} />
          </div>
        </div>
        
        <p className="text-sm text-text-secondary mb-4 flex-1 font-sans line-clamp-3">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-white/5 text-text-secondary text-[10px] rounded-sm font-mono">
              #{tag}
            </span>
          ))}
          {tags.length > 3 && <span className="text-[10px] text-text-secondary opacity-50">+{tags.length - 3}</span>}
        </div>

        <div>
            <p className="text-[10px] text-text-secondary font-mono uppercase mb-1">Efficacy</p>
            <EfficacyChart efficacy={efficacy} />
        </div>
      </div>

      <div className="px-5 py-3 bg-black/30 border-t border-white/5 flex justify-between items-center">
        <span className="text-xs text-text-secondary font-mono">View Details</span>
        <ArrowRight size={16} className="text-text-secondary group-hover:text-accent transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
});
