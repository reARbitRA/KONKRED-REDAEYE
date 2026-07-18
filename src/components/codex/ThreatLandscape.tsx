import React, { useMemo } from 'react';
import { Technique } from '../../types';
import { SVGChart } from '../shared/Visuals';

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

  const chartSvg = useMemo(() => {
    const width = 600;
    const height = 300;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const data = techniques.map(t => {
      const avgEfficacy = t.efficacyMatrix.reduce((acc, m) => {
        if (m.efficacy === 'Critical') return acc + 4;
        if (m.efficacy === 'High') return acc + 3;
        if (m.efficacy === 'Moderate') return acc + 2;
        return acc + 1;
      }, 0) / t.efficacyMatrix.length;

      const difficultyValue = typeof t.metadata.difficulty === 'number' 
        ? t.metadata.difficulty 
        : (difficultyMap[String(t.metadata.difficulty).toLowerCase()] || 1);
      
      const threatLevel = typeof t.metadata.threatLevel === 'number'
        ? t.metadata.threatLevel
        : parseInt(t.metadata.threatLevel as string) || 50;

      return {
        x: difficultyValue / 5,
        y: avgEfficacy / 4,
        size: threatLevel / 100,
        color: threatLevel > 80 ? 'var(--color-danger)' : threatLevel > 50 ? 'var(--color-konkred-orange)' : 'var(--color-accent)'
      };
    });

    let dotsHtml = '';
    data.forEach((d, i) => {
      const cx = padding + d.x * chartWidth;
      const cy = height - padding - d.y * chartHeight;
      const r = 4 + d.size * 8;
      dotsHtml += `
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="${d.color}" opacity="0.6" stroke="white" stroke-width="1">
          <animate attributeName="r" from="0" to="${r}" dur="0.5s" begin="${i * 0.05}s" />
        </circle>
      `;
    });

    return `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.1)" />
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.1)" />
        <text x="${width / 2}" y="${height - 5}" fill="rgba(255,255,255,0.3)" font-size="10" text-anchor="middle" font-family="monospace">DIFFICULTY →</text>
        <text x="10" y="${height / 2}" fill="rgba(255,255,255,0.3)" font-size="10" text-anchor="middle" font-family="monospace" transform="rotate(-90 10 ${height / 2})">EFFICACY →</text>
        ${dotsHtml}
      </svg>
    `;
  }, [techniques]);

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
      
      <div className="w-full h-48 relative z-10 flex items-center justify-center">
        <SVGChart svg={chartSvg} />
      </div>
    </div>
  );
};
