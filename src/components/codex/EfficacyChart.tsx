import React, { useMemo } from 'react';
import { generateBarChart } from '../../services/chartService';
import { SVGChart } from '../shared/Visuals';

interface EfficacyMatrixItem {
    model: string;
    efficacy: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Very High' | 'Moderate-High' | 'Native';
    notes: string;
}

interface EfficacyChartProps {
    efficacyMatrix: EfficacyMatrixItem[];
}

export const EfficacyChart: React.FC<EfficacyChartProps> = ({ efficacyMatrix }) => {
    const chartSvg = useMemo(() => {
        const data = (efficacyMatrix || []).map(item => ({
            label: item.model,
            value: item.efficacy === 'Critical' ? 100 : 
                   item.efficacy === 'Very High' ? 90 :
                   item.efficacy === 'High' ? 75 : 
                   item.efficacy === 'Moderate-High' ? 65 :
                   item.efficacy === 'Moderate' ? 50 : 25,
            color: item.efficacy === 'Critical' ? 'var(--color-danger)' : 
                   item.efficacy === 'High' || item.efficacy === 'Very High' ? 'var(--color-konkred-orange)' : 
                   item.efficacy === 'Moderate' || item.efficacy === 'Moderate-High' ? 'var(--color-accent)' : 
                   'var(--color-success)'
        }));
        return generateBarChart(data);
    }, [efficacyMatrix]);

    return (
        <div className="w-full h-full min-h-[200px] flex items-center">
            <SVGChart svg={chartSvg} />
        </div>
    );
};
