'use client';

import React, { useState, useEffect } from 'react';

interface ClientHeroUSPProps {
    usps: string[];
}

export default function ClientHeroUSP({ usps }: ClientHeroUSPProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!usps || usps.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % usps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [usps]);

    if (!usps || usps.length === 0) return null;

    return (
        <h1 
            style={{ 
                fontSize: '44px',
                margin: 0, 
                lineHeight: 1.2, 
                letterSpacing: '-0.02em',
                animation: 'fadeIn 0.5s ease-in-out',
                fontWeight: 600,
                maxWidth: '800px'
            }} 
            key={currentIndex}
        >
            {usps[currentIndex]}
        </h1>
    );
}
