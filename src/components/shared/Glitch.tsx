import React, { useState, useEffect, useRef } from 'react';

interface GlitchProps {
    children: React.ReactNode;
    active?: boolean;
    frequency?: number;
    className?: string;
}

export const Glitch: React.FC<GlitchProps> = ({ children, active = true, frequency = 0.05, className = "" }) => {
    const [isGlitching, setIsGlitching] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [text, setText] = useState<string | null>(null);

    useEffect(() => {
        if (!active) return;

        const interval = setInterval(() => {
            if (Math.random() < frequency) {
                setIsGlitching(true);
                setOffset({
                    x: (Math.random() - 0.5) * 4,
                    y: (Math.random() - 0.5) * 4
                });

                setTimeout(() => {
                    setIsGlitching(false);
                }, 100 + Math.random() * 200);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [active, frequency]);

    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`relative z-10 ${isGlitching ? 'opacity-90' : 'opacity-100'}`}>
                {children}
            </div>
            
            {active && isGlitching && (
                <>
                    <div 
                        className="absolute top-0 left-0 w-full h-full text-danger z-0 overflow-hidden mix-blend-screen opacity-50"
                        style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, clipPath: 'inset(10% 0 50% 0)' }}
                    >
                        {children}
                    </div>
                    <div 
                        className="absolute top-0 left-0 w-full h-full text-accent z-0 overflow-hidden mix-blend-screen opacity-50"
                        style={{ transform: `translate(${-offset.x}px, ${-offset.y}px)`, clipPath: 'inset(50% 0 10% 0)' }}
                    >
                        {children}
                    </div>
                </>
            )}
        </div>
    );
};
