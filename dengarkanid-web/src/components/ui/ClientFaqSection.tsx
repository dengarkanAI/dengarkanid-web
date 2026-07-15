'use client';

import React, { useState } from 'react';

interface FaqItem {
    id: number | string;
    question?: string;
    answer?: string;
    attributes?: {
        question?: string;
        answer?: string;
        content?: string;
    }
}

interface ClientFaqSectionProps {
    faqsData: FaqItem[];
}

export default function ClientFaqSection({ faqsData }: ClientFaqSectionProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    return (
        <section className="faq-section-new scroll-fade">
            <div className="container">
                <div className="faq-card-box">
                    <div className="faq-header text-center">
                        <div className="faq-work-tag justify-center" style={{display: 'flex', justifyContent: 'center'}}>
                            <span className="bullet"></span> Our FAQs
                        </div>
                        <h2>FAQ</h2>
                        <p className="text-muted">As a leading digital marketing agency, we are dedicated to providing
                            comprehensive educational resources and answering frequently asked questions to help our
                            clients.</p>
                        <div className="faq-header-actions">
                            <a href="#contact" className="contact-link">Contact Us</a>
                        </div>
                    </div>

                    <div className="faq-accordion">
                    {faqsData && faqsData.length > 0 ? (
                        faqsData.map((faq: any, index: number) => (
                            <div className={`faq-item-new ${openFaqIndex === index ? 'active' : ''}`} key={faq.id}>
                                <div className="faq-question-new" onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} style={{ cursor: 'pointer' }}>
                                    <h3 dangerouslySetInnerHTML={{ __html: faq.question || faq.attributes?.question }}></h3>
                                    <span className="faq-toggle-icon">{openFaqIndex === index ? '-' : '+'}</span>
                                </div>
                                <div className="faq-answer-new" style={{ display: openFaqIndex === index ? 'block' : 'none' }}>
                                    <p dangerouslySetInnerHTML={{ __html: faq.answer || faq.attributes?.answer || faq.attributes?.content }}></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No FAQs available at the moment.</p>
                    )}
                    </div>
                </div>
            </div>
        </section>
    );
}
