import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { getFlattenedTechniques } from '../../codex-data';
import { Technique } from '../../types';

interface Node extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    category: string;
    techniques: Technique[];
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
    value: number;
}

export const ProtocolGraph: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    const data = useMemo(() => {
        const nodes: Node[] = [];
        const links: Link[] = [];
        const allTechs = getFlattenedTechniques();

        // Group techniques by category as main hubs
        const categories = Array.from(new Set(allTechs.map(t => t.category || "General")));
        
        categories.forEach(cat => {
            nodes.push({
                id: cat,
                name: cat,
                category: cat,
                techniques: allTechs.filter(t => t.category === cat)
            } as Node);
        });

        // Create links between categories based on shared tags or metadata (simulated connectivity)
        categories.forEach((cat, i) => {
            categories.slice(i + 1).forEach(otherCat => {
                links.push({
                    source: cat,
                    target: otherCat,
                    value: Math.random() * 5 + 1
                } as Link);
            });
        });

        return { nodes, links };
    }, []);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = svgRef.current.clientWidth || 800;
        const height = svgRef.current.clientHeight || 400;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g");

        const simulation = d3.forceSimulation<Node>(data.nodes)
            .force("link", d3.forceLink<Node, Link>(data.links).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(60));

        const link = g.append("g")
            .attr("stroke", "#ffffff10")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke-width", (d: any) => Math.sqrt(d.value));

        const node = g.append("g")
            .attr("stroke", "#ffffff20")
            .attr("stroke-width", 1.5)
            .selectAll("g")
            .data(data.nodes)
            .join("g")
            .call(d3.drag<any, any>()
                .on("start", (event: any, d: any) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event: any, d: any) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event: any, d: any) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }) as any);

        node.append("circle")
            .attr("r", 30)
            .attr("fill", "#0a0a0a")
            .attr("stroke", "#FF003C")
            .attr("stroke-width", 2)
            .attr("class", "shadow-glow-danger");

        node.append("text")
            .text((d: any) => d.name)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "#ffffff")
            .style("font-size", "10px")
            .style("font-family", "Inter, sans-serif")
            .style("text-transform", "uppercase")
            .style("letter-spacing", "1.5px")
            .style("pointer-events", "none");

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });

        // Zoom functionality
        svg.call(d3.zoom<SVGSVGElement, any>()
            .scaleExtent([0.5, 3])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            }));

    }, [data]);

    return (
        <div className="w-full h-[400px] bg-black/40 border border-white/5 rounded-sm relative overflow-hidden group">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                <div className="text-[10px] technical-font uppercase tracking-widest text-accent font-bold">P-H-A-S-E_PROTOCOL_VISUALIZER</div>
                <div className="text-[8px] font-mono text-text-secondary opacity-50">REAL-TIME_CONNECTIVITY_NETWORK</div>
            </div>
            <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        </div>
    );
};
