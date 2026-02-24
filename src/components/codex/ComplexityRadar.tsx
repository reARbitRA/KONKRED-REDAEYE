import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ComplexityRadarProps {
    complexity: {
        conceptual: number;
        implementation: number;
        debugging: number;
    };
}

export const ComplexityRadar: React.FC<ComplexityRadarProps> = ({ complexity }) => {
    const data = [
        { subject: 'CONCEPTUAL', A: complexity.conceptual, fullMark: 5 },
        { subject: 'IMPLEMENTATION', A: complexity.implementation, fullMark: 5 },
        { subject: 'DEBUGGING', A: complexity.debugging, fullMark: 5 },
    ];

    return (
        <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 8, fontFamily: 'monospace' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                    <Radar
                        name="Complexity"
                        dataKey="A"
                        stroke="#F27D26"
                        fill="#F27D26"
                        fillOpacity={0.5}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
