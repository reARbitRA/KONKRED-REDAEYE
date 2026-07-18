import React, { useMemo } from 'react';
import { generateRadarChart } from '../../services/chartService';
import { SVGChart } from '../shared/Visuals';

interface ComplexityRadarProps {
    complexity: {
        conceptual: number;
        implementation: number;
        debugging: number;
    };
}

export const ComplexityRadar: React.FC<ComplexityRadarProps> = ({ complexity }) => {
    const radarSvg = useMemo(() => {
        return generateRadarChart([
            { label: 'Conceptual', value: complexity.conceptual },
            { label: 'Implementation', value: complexity.implementation },
            { label: 'Debugging', value: complexity.debugging },
        ], 200);
    }, [complexity]);

    return (
        <div className="w-full h-48 flex items-center justify-center">
            <SVGChart svg={radarSvg} />
        </div>
    );
};
