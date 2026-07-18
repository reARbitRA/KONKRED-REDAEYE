import React from 'react';
import { motion } from 'framer-motion';

interface ComplexityRadarProps {
  complexity: number;
}

export const ComplexityRadar = React.memo(({ complexity }: ComplexityRadarProps) => {
  const points = 5;
  const angleSlice = (Math.PI * 2) / points;
  
  const getPath = (value: number) => {
    let path = '';
    for (let i = 0; i < points; i++) {
      const angle = angleSlice * i - Math.PI / 2;
      const x = 50 + Math.cos(angle) * 40 * value;
      const y = 50 + Math.sin(angle) * 40 * value;
      path += (i === 0 ? 'M' : 'L') + `${x} ${y}`;
    }
    return path + ' Z';
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,0,60,0.3)" />
          <stop offset="100%" stopColor="rgba(255,0,60,0)" />
        </radialGradient>
      </defs>

      {/* Grid Lines */}
      {[0.25, 0.5, 0.75, 1].map(val => (
        <path key={val} d={getPath(val)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      ))}
      {[...Array(points)].map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = 50 + Math.cos(angle) * 40;
        const y = 50 + Math.sin(angle) * 40;
        return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      })}

      {/* Data Shape */}
      <path
        d={getPath(complexity)}
        fill="url(#radarGradient)"
        stroke="#FF003C"
        strokeWidth="1.5"
        style={{ opacity: 0.8 }}
      />
    </svg>
  );
});
