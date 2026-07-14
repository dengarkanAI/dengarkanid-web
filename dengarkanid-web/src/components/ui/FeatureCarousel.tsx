'use client';

import React, { useState, useEffect } from 'react';
import StrapiMedia from './StrapiMedia';

interface CarouselItem {
    id: number;
    subtitle: string;
    description: string;
    image: any;
}

interface FeatureSectionData {
    title: string;
    tagline: string;
    categoryIdentifier: string;
    carouselItems: CarouselItem[];
}

interface FeatureCarouselProps {
    sectionData: FeatureSectionData | null;
    layoutType: 'boxed' | 'boxed-reverse' | 'full';
    sectionTag: string;
    defaultTitle: string;
    defaultDesc?: string;
    ctaButton?: React.ReactNode;
}

export default function FeatureCarousel({ sectionData, layoutType, sectionTag, defaultTitle, defaultDesc, ctaButton }: FeatureCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const title = sectionData?.tagline || defaultTitle;
    const items = sectionData?.carouselItems && sectionData.carouselItems.length > 0 ? sectionData.carouselItems : [
        {
            id: 0,
            subtitle: defaultTitle,
            description: defaultDesc || '',
            image: null
        }
    ];

    const currentSlide = items[currentIndex];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    useEffect(() => {
        if (items.length <= 1) return;
        const interval = setInterval(handleNext, 3000);
        return () => clearInterval(interval);
    }, [items.length]);

    if (!currentSlide) return null;

    const renderContent = () => (
        <div className="feature-box-content" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="feature-work-tag">
                <span className="bullet"></span> {sectionData?.title || sectionTag}
            </div>
            {/* The main title/tagline for the section */}
            <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
            
            {/* The carousel slide subtitle (if any) and description */}
            <div key={`content-${currentSlide.id}`} style={{ minHeight: '140px', animation: 'fade-in 0.5s ease-out' }}>
                {currentSlide.subtitle && currentSlide.subtitle !== title && <h3 style={{fontSize: '20px', marginBottom: '8px', color: '#333'}}>{currentSlide.subtitle}</h3>}
                {currentSlide.description && <p dangerouslySetInnerHTML={{ __html: currentSlide.description }}></p>}
            </div>
            
            {ctaButton && <div style={{ marginTop: '16px' }}>{ctaButton}</div>}
            
            {items.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
                    {items.map((_, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            style={{ 
                                height: '6px', 
                                width: idx === currentIndex ? '32px' : '12px', 
                                borderRadius: '12px', 
                                background: idx === currentIndex ? 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)' : '#E2E8F0', 
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0
                            }} 
                        />
                    ))}
                </div>
            )}
        </div>
    );

    const renderGraphic = () => (
        <div className={layoutType === 'full' ? 'feature-mockup-container' : 'feature-box-graphic'}>
            {layoutType === 'full' ? (
                <div key={`graphic-${currentSlide.id}`} style={{ animation: 'fade-in 0.5s ease-out', width: '100%' }}>
                    <StrapiMedia 
                        imageObj={currentSlide.image} 
                        fallbackUrl={`https://placehold.co/1200x670/ffffff/dddddd?text=${encodeURIComponent(currentSlide.subtitle || title)}`} 
                        alt={currentSlide.subtitle} 
                        className="feature-large-mockup" 
                    />
                </div>
            ) : (
                <div className="feature-box-bg-grey">
                    <div key={`graphic-${currentSlide.id}`} style={{ animation: 'fade-in 0.5s ease-out', width: '100%', height: '100%' }}>
                        <StrapiMedia 
                            imageObj={currentSlide.image} 
                            fallbackUrl={`https://placehold.co/800x600/ffffff/dddddd?text=${encodeURIComponent(currentSlide.subtitle || title)}`} 
                            alt={currentSlide.subtitle} 
                            className="feature-box-img" 
                        />
                    </div>
                </div>
            )}
        </div>
    );

    if (layoutType === 'full') {
        return (
            <section className="feature-section-full scroll-fade">
                <div className="container">
                    <div className="feature-header-row">
                        <div className="feature-header-left">
                            <div className="feature-work-tag">
                                <span className="bullet"></span> {sectionData?.title || sectionTag}
                            </div>
                            <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
                        </div>
                        <div className="feature-header-right">
                            <div key={`content-full-${currentSlide.id}`} style={{ minHeight: '120px', animation: 'fade-in 0.5s ease-out' }}>
                                {currentSlide.subtitle && currentSlide.subtitle !== title && <h3 style={{fontSize: '20px', marginBottom: '8px', color: '#333'}}>{currentSlide.subtitle}</h3>}
                                {currentSlide.description && <p dangerouslySetInnerHTML={{ __html: currentSlide.description }}></p>}
                            </div>
                            {ctaButton && <div style={{ marginTop: '16px' }}>{ctaButton}</div>}
                            {/* Pagination Controls */}
                            {items.length > 1 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
                                    {items.map((_, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => setCurrentIndex(idx)}
                                            aria-label={`Go to slide ${idx + 1}`}
                                            style={{ 
                                                height: '6px', 
                                                width: idx === currentIndex ? '32px' : '12px', 
                                                borderRadius: '12px', 
                                                background: idx === currentIndex ? 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)' : '#E2E8F0', 
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0
                                            }} 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {renderGraphic()}
                </div>
            </section>
        );
    }

    // Boxed Layouts
    return (
        <section className="feature-section-boxed scroll-fade">
            <div className="container">
                <div className={`feature-box-card ${layoutType === 'boxed-reverse' ? 'feature-box-card-reverse' : ''}`}>
                    {renderGraphic()}
                    {renderContent()}
                </div>
            </div>
        </section>
    );
}
