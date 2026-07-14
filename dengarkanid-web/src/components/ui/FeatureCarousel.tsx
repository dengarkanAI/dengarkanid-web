'use client';

import React, { useState, useEffect } from 'react';
import StrapiMedia from './StrapiMedia';

interface FeatureItem {
    id: number;
    attributes: {
        title: string;
        description: string;
        category: string;
        image: any;
    };
}

interface FeatureCarouselProps {
    features: FeatureItem[];
    layoutType: 'boxed' | 'boxed-reverse' | 'full';
    sectionTag: string;
    defaultTitle: string;
    defaultDesc?: string;
    ctaButton?: React.ReactNode;
}

export default function FeatureCarousel({ features, layoutType, sectionTag, defaultTitle, defaultDesc, ctaButton }: FeatureCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // If no features passed from CMS, fallback to a single slide based on defaults
    const slides = features && features.length > 0 ? features : [
        {
            id: 0,
            attributes: {
                title: defaultTitle,
                description: defaultDesc || '',
                category: '',
                image: null
            }
        }
    ];

    const currentSlide = slides[currentIndex]?.attributes;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Auto-advance every 5 seconds if there is more than 1 slide
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(handleNext, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    if (!currentSlide) return null;

    // Renders the textual content part
    const renderContent = () => (
        <div className="feature-box-content" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'opacity 0.3s ease-in-out' }} key={`content-${slides[currentIndex].id}`}>
            <div className="feature-work-tag">
                <span className="bullet"></span> {sectionTag}
            </div>
            <h2 dangerouslySetInnerHTML={{ __html: currentSlide.title }}></h2>
            {currentSlide.description && <p dangerouslySetInnerHTML={{ __html: currentSlide.description }}></p>}
            {ctaButton && <div style={{ marginTop: '16px' }}>{ctaButton}</div>}
            
            {/* Pagination Controls */}
            {slides.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                    <button onClick={handlePrev} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        &#8592;
                    </button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {slides.map((_, idx) => (
                            <span key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === currentIndex ? '#6366F1' : '#E2E8F0', transition: 'background 0.2s' }} />
                        ))}
                    </div>
                    <button onClick={handleNext} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        &#8594;
                    </button>
                </div>
            )}
        </div>
    );

    // Renders the graphic/image part
    const renderGraphic = () => (
        <div className={layoutType === 'full' ? 'feature-mockup-container' : 'feature-box-graphic'} key={`graphic-${slides[currentIndex].id}`} style={{ transition: 'opacity 0.3s ease-in-out', animation: 'fade-in 0.5s ease-out' }}>
            {layoutType === 'full' ? (
                <StrapiMedia 
                    imageObj={currentSlide.image} 
                    fallbackUrl={`https://placehold.co/1200x670/ffffff/dddddd?text=${encodeURIComponent(currentSlide.title)}`} 
                    alt={currentSlide.title} 
                    className="feature-large-mockup" 
                />
            ) : (
                <div className="feature-box-bg-grey" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <StrapiMedia 
                        imageObj={currentSlide.image} 
                        fallbackUrl={`https://placehold.co/400x500/ffffff/dddddd?text=${encodeURIComponent(currentSlide.title)}`} 
                        alt={currentSlide.title} 
                        className="feature-box-mockup-img" 
                    />
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
                                <span className="bullet"></span> {sectionTag}
                            </div>
                            <h2 dangerouslySetInnerHTML={{ __html: currentSlide.title }}></h2>
                        </div>
                        <div className="feature-header-right">
                            {currentSlide.description && <p dangerouslySetInnerHTML={{ __html: currentSlide.description }}></p>}
                            {ctaButton && <div style={{ marginTop: '16px' }}>{ctaButton}</div>}
                            {/* Pagination Controls */}
                            {slides.length > 1 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                                    <button onClick={handlePrev} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        &#8592;
                                    </button>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {slides.map((_, idx) => (
                                            <span key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === currentIndex ? '#6366F1' : '#E2E8F0', transition: 'background 0.2s' }} />
                                        ))}
                                    </div>
                                    <button onClick={handleNext} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        &#8594;
                                    </button>
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
                    {layoutType === 'boxed-reverse' ? (
                        <>
                            {renderContent()}
                            {renderGraphic()}
                        </>
                    ) : (
                        <>
                            {renderGraphic()}
                            {renderContent()}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
