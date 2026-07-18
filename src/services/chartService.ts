/**
 * SOVEREIGN CHART ENGINE v1.0
 * Pure SVG Chart Generation for Adversarial Metrics
 */

export interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}

export interface RadarMetric {
    label: string;
    value: number; // 0-5
}

export interface TimelinePhase {
    name: string;
    startPercent: number;
    endPercent: number;
    color: string;
}

/**
 * Generates a Radar (Spider) Chart SVG
 */
export function generateRadarChart(metrics: RadarMetric[], size = 300): string {
    const padding = 40;
    const center = size / 2;
    const radius = (size / 2) - padding;
    const angleStep = (Math.PI * 2) / metrics.length;

    // Grid lines
    const gridLevels = 5;
    let gridHtml = '';
    for (let i = 1; i <= gridLevels; i++) {
        const r = (radius / gridLevels) * i;
        const points = metrics.map((_, idx) => {
            const angle = idx * angleStep - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
        gridHtml += `<polygon points="${points}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />`;
    }

    // Axes
    let axesHtml = '';
    metrics.forEach((m, idx) => {
        const angle = idx * angleStep - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        const lx = center + (radius + 15) * Math.cos(angle);
        const ly = center + (radius + 15) * Math.sin(angle);
        
        axesHtml += `
            <line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
            <text x="${lx}" y="${ly}" fill="rgba(255,255,255,0.5)" font-size="10" text-anchor="middle" dominant-baseline="middle" font-family="monospace">${m.label.toUpperCase()}</text>
        `;
    });

    // Data polygon
    const dataPoints = metrics.map((m, idx) => {
        const r = (radius / 5) * m.value;
        const angle = idx * angleStep - Math.PI / 2;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');

    return `
        <svg width="100%" height="100%" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:var(--color-accent);stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:var(--color-accent-light);stop-opacity:0.2" />
                </linearGradient>
            </defs>
            ${gridHtml}
            ${axesHtml}
            <polygon points="${dataPoints}" fill="url(#radarGradient)" stroke="var(--color-accent)" stroke-width="2">
                <animate attributeName="opacity" from="0" to="1" dur="1s" />
            </polygon>
        </svg>
    `;
}

/**
 * Generates a Horizontal Bar Chart SVG
 */
export function generateBarChart(data: ChartDataPoint[]): string {
    const barHeight = 30;
    const gap = 15;
    const width = 400;
    const height = data.length * (barHeight + gap);
    
    let barsHtml = '';
    data.forEach((d, idx) => {
        const y = idx * (barHeight + gap);
        const barWidth = (d.value / 100) * (width - 100);
        const color = d.color || 'var(--color-accent)';
        
        barsHtml += `
            <g class="bar-group">
                <text x="0" y="${y + barHeight / 2}" fill="rgba(255,255,255,0.6)" font-size="10" dominant-baseline="middle" font-family="monospace">${d.label.toUpperCase()}</text>
                <rect x="100" y="${y}" width="${width - 100}" height="${barHeight}" fill="rgba(255,255,255,0.05)" rx="4" />
                <rect x="100" y="${y}" width="0" height="${barHeight}" fill="${color}" rx="4">
                    <animate attributeName="width" from="0" to="${barWidth}" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0 1" />
                </rect>
                <text x="${105 + barWidth}" y="${y + barHeight / 2}" fill="white" font-size="10" font-weight="bold" dominant-baseline="middle" font-family="monospace">${d.value}%</text>
            </g>
        `;
    });

    return `
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            ${barsHtml}
        </svg>
    `;
}

/**
 * Generates a Comparison Dot Plot SVG
 */
export function generateComparisonChart(data: { label: string; values: number[] }[], categories: string[]): string {
    const width = 500;
    const height = 200;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const colors = ['var(--color-accent)', 'var(--color-konkred-orange)', 'var(--color-success)', 'var(--color-danger)'];
    
    let gridHtml = '';
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        gridHtml += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.05)" />`;
    }

    let contentHtml = '';
    const xStep = chartWidth / (data.length - 1 || 1);
    
    data.forEach((d, idx) => {
        const x = padding + idx * xStep;
        contentHtml += `<text x="${x}" y="${height - 10}" fill="rgba(255,255,255,0.4)" font-size="9" text-anchor="middle" font-family="monospace">${d.label.toUpperCase()}</text>`;
        
        d.values.forEach((val, vIdx) => {
            const y = height - padding - (chartHeight / 5) * val;
            contentHtml += `
                <circle cx="${x}" cy="${y}" r="4" fill="${colors[vIdx % colors.length]}">
                    <animate attributeName="r" from="0" to="4" dur="0.5s" begin="${idx * 0.1}s" />
                </circle>
            `;
        });
    });

    return `
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            ${gridHtml}
            ${contentHtml}
        </svg>
    `;
}

/**
 * Generates a Timeline/Gantt Chart SVG
 */
export function generateTimelineChart(phases: TimelinePhase[]): string {
    const width = 600;
    const height = 120;
    const barHeight = 40;
    const y = 40;

    let phasesHtml = '';
    phases.forEach((p, idx) => {
        const x = (p.startPercent / 100) * width;
        const w = ((p.endPercent - p.startPercent) / 100) * width;
        
        phasesHtml += `
            <g>
                <rect x="${x}" y="${y}" width="0" height="${barHeight}" fill="${p.color}" rx="4" opacity="0.8">
                    <animate attributeName="width" from="0" to="${w}" dur="1s" fill="freeze" />
                </rect>
                <text x="${x + w / 2}" y="${y + barHeight + 20}" fill="rgba(255,255,255,0.6)" font-size="10" text-anchor="middle" font-family="monospace">${p.name.toUpperCase()}</text>
            </g>
        `;
    });

    return `
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="${y + barHeight / 2}" x2="${width}" y2="${y + barHeight / 2}" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4" />
            ${phasesHtml}
        </svg>
    `;
}

/**
 * Generates a Donut Chart SVG
 */
export function generateDonutChart(value: number, total: number, label: string): string {
    const size = 120;
    const center = size / 2;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / total) * circumference;

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="10" />
            <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--color-accent)" stroke-width="10" 
                stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" transform="rotate(-90 ${center} ${center})">
                <animate attributeName="stroke-dashoffset" from="${circumference}" to="${offset}" dur="1s" fill="freeze" />
            </circle>
            <text x="${center}" y="${center - 5}" fill="white" font-size="18" font-weight="bold" text-anchor="middle" dominant-baseline="middle" font-family="monospace">${value}</text>
            <text x="${center}" y="${center + 15}" fill="rgba(255,255,255,0.4)" font-size="8" text-anchor="middle" dominant-baseline="middle" font-family="monospace">${label.toUpperCase()}</text>
        </svg>
    `;
}
