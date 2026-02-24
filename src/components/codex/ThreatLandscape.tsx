import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Technique } from '../../types';

interface ThreatLandscapeProps {
  techniques: Technique[];
}

export const ThreatLandscape: React.FC<ThreatLandscapeProps> = ({ techniques }) => {
  const difficultyMap: Record<string, number> = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4,
    'critical': 5
  };

  const data = techniques.map(t => {
    const avgEfficacy = t.efficacyMatrix.reduce((acc, m) => {
      if (m.efficacy === 'Critical') return acc + 4;
      if (m.efficacy === 'High') return acc + 3;
      if (m.efficacy === 'Moderate') return acc + 2;
      return acc + 1;
    }, 0) / t.efficacyMatrix.length;

    return {
      name: t.name,
      id: t.id,
      difficulty: difficultyMap[t.metadata.difficulty] || 1,
      efficacy: avgEfficacy,
      threatLevel: t.metadata.threatLevel || 50,
      category: t.metadata.category
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 border border-accent/50 p-3 rounded-sm shadow-glow-accent">
          <p className="text-xs font-black technical-font text-white uppercase mb-1">{data.name}</p>
          <p className="text-[10px] font-mono text-accent mb-2">{data.id}</p>
          <div className="space-y-1 text-[10px] font-mono">
            <div className="flex justify-between gap-4"><span className="text-text-secondary">Difficulty:</span> <span className="text-white">{data.difficulty}/5</span></div>
            <div className="flex justify-between gap-4"><span className="text-text-secondary">Avg Efficacy:</span> <span className="text-white">{data.efficacy.toFixed(1)}/4</span></div>
            <div className="flex justify-between gap-4"><span className="text-text-secondary">Threat Level:</span> <span className="text-danger">{data.threatLevel}%</span></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 bg-black/40 border border-border-primary p-4 rounded-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h4 className="text-xs text-accent technical-font uppercase tracking-widest flex items-center gap-2">
          Threat_Landscape_Analysis
        </h4>
        <div className="flex gap-4 text-[10px] font-mono text-text-secondary">
          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-accent rounded-full" /> Efficacy</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-danger rounded-full" /> Criticality</span>
        </div>
      </div>
      
      <div className="w-full h-48 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis 
              type="number" 
              dataKey="difficulty" 
              name="Difficulty" 
              domain={[0, 6]} 
              tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'DIFFICULTY', position: 'bottom', fill: '#444', fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis 
              type="number" 
              dataKey="efficacy" 
              name="Efficacy" 
              domain={[0, 5]} 
              tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'EFFICACY', angle: -90, position: 'insideLeft', fill: '#444', fontSize: 10, fontFamily: 'monospace' }}
            />
            <ZAxis type="number" dataKey="threatLevel" range={[50, 400]} name="Threat Level" />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Techniques" data={data}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.threatLevel > 80 ? '#ef4444' : entry.threatLevel > 50 ? '#f97316' : '#F27D26'} 
                  className="cursor-pointer hover:stroke-white transition-all"
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
