import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';

/* ENHANCED: Magnetic component for micro-interactions */
export const Magnetic: React.FC<{ children: React.ReactNode; strength?: number }> = ({ children, strength = 0.5 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const x = (clientX - centerX) * strength;
        const y = (clientY - centerY) * strength;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

interface ChartProps {
    svg: string;
    className?: string;
}

export const SVGChart: React.FC<ChartProps> = ({ svg, className = "" }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Chart strings can contain user/model-derived labels. Sanitize before
            // inserting them into the DOM; SVG is an active content format.
            const safeSvg = DOMPurify.sanitize(svg, {
                USE_PROFILES: { svg: true },
                ADD_TAGS: ['animate'],
                FORBID_TAGS: ['script', 'foreignObject'],
                FORBID_ATTR: ['style', 'onload', 'onclick', 'onerror'],
            });
            containerRef.current.innerHTML = safeSvg;
        }
    }, [svg]);

    return (
        <div 
            ref={containerRef} 
            className={`w-full flex justify-center items-center overflow-hidden animate-on-scroll ${className}`}
        />
    );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`skeleton ${className}`} />
);

export const CountUp: React.FC<{ end: number; duration?: number }> = ({ end, duration = 1000 }) => {
    const [count, setCount] = React.useState(0);
    const countRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                window.requestAnimationFrame(step);
                observer.disconnect();
            }
        });

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={countRef}>{count}</span>;
};
