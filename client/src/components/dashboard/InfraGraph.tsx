'use client';

import { useEffect, useRef, useState } from 'react';
// Dynamically import ForceGraph2D to avoid SSR issues
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
});

interface InfraGraphProps {
    assets: any[];
}

export function InfraGraph({ assets }: InfraGraphProps) {
    const [data, setData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

    useEffect(() => {
        // Transform assets into graph data
        // Root node -> Regions -> Assets
        const nodes: any[] = [{ id: 'ROOT', name: 'Cloud Root', val: 20, color: '#4f46e5' }];
        const links: any[] = [];
        const regions = new Set(assets.map(a => a.region));

        regions.forEach(region => {
            nodes.push({ id: `region-${region}`, name: region, val: 10, color: '#10b981' });
            links.push({ source: 'ROOT', target: `region-${region}` });
        });

        assets.forEach(asset => {
            nodes.push({
                id: asset.cloudId,
                name: asset.name,
                val: 5,
                color: asset.type === 'S3' ? '#f59e0b' : '#3b82f6',
                type: asset.type
            });
            links.push({ source: `region-${asset.region}`, target: asset.cloudId });
        });

        setData({ nodes, links });
    }, [assets]);

    useEffect(() => {
        // Responsive graph sizing
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight || 400
            });
        }
    }, []);

    return (
        <div ref={containerRef} className="h-full w-full min-h-[400px] border rounded-lg bg-gray-950 overflow-hidden">
            <ForceGraph2D
                width={dimensions.width}
                height={dimensions.height}
                graphData={data}
                nodeLabel="name"
                backgroundColor="#030712"
                nodeColor="color"
                linkColor={() => 'rgba(255,255,255,0.2)'}
            />
        </div>
    );
}
