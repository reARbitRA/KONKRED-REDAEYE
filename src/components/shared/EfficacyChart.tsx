import React from 'react';

interface EfficacyChartProps {
  efficacy: number;
}

export const EfficacyChart = React.memo(({ efficacy }: EfficacyChartProps) => {
  const percentage = Math.round(efficacy * 100);

  return (
    <div className="w-full bg-white/5 rounded-full h-2.5 border border-white/10">
      <div 
        className="bg-accent h-2 rounded-full shadow-glow-accent"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
});
