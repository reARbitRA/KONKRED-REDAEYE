import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface EfficacyMatrixItem {
    model: string;
    efficacy: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Very High' | 'Moderate-High' | 'Native';
    notes: string;
}

interface EfficacyChartProps {
    efficacyMatrix: EfficacyMatrixItem[];
}

export const EfficacyChart: React.FC<EfficacyChartProps> = ({ efficacyMatrix }) => {
    const data = efficacyMatrix.map(item => ({
        model: item.model,
        value: item.efficacy === 'Critical' ? 4 : item.efficacy === 'High' ? 3 : item.efficacy === 'Moderate' ? 2 : 1,
        label: item.efficacy,
        notes: item.notes
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 border border-accent/50 p-2 rounded-sm shadow-glow-accent">
                    <p className="text-[10px] font-black technical-font text-white uppercase mb-1">{payload[0].payload.model}</p>
                    <p className="text-[10px] font-mono text-accent">EFFICACY: {payload[0].payload.label}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                    <XAxis type="number" domain={[0, 4]} hide />
                    <YAxis 
                        dataKey="model" 
                        type="category" 
                        tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} 
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={12}>
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.value === 4 ? '#ef4444' : entry.value === 3 ? '#f97316' : entry.value === 2 ? '#F27D26' : '#10b981'} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
