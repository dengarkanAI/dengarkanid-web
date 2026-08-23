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
    dict: any;
    cms?: any;
}

export default function ClientFaqSection({ faqsData, dict, cms }: ClientFaqSectionProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    return (
        <section className="faq-section-new scroll-fade">
            <div className="container">
                <div className="faq-card-box">
                    <div className="faq-header text-center">
                        <div className="faq-work-tag justify-center" style={{display: 'flex', justifyContent: 'center'}}>
                            <span className="bullet"></span> {dict.ourFaqs}
                        </div>
                        <h2 dangerouslySetInnerHTML={{ __html: (cms?.faqTitle || dict.title).replace(/\n/g, '<br/>') }}></h2>
                        <p className="text-muted" dangerouslySetInnerHTML={{ __html: (cms?.faqDescription || dict.subtitle).replace(/\n/g, '<br/>') }}></p>
                        <div className="faq-header-actions">
                            <a href="#contact" className="contact-link">{dict.contactUs}</a>
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
                        <p className="text-center text-muted">{dict.noFaqs}</p>
                    )}
                    </div>
                </div>
            </div>
        </section>
    );
}
