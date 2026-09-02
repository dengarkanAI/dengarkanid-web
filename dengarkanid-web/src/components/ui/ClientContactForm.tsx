'use client';

import React, { useState } from 'react';
import { STRAPI_API_URL, getStrapiImageUrl } from '@/utils/strapi';

export default function ClientContactForm({ dict, cms }: { dict: any, cms?: any }) {
    const [leadForm, setLeadForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        industry: '',
        position: '',
        message: ''
    });
    const [leadSubmitting, setLeadSubmitting] = useState(false);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [showCompanyDetails, setShowCompanyDetails] = useState(false);

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLeadSubmitting(true);
        try {
            const res = await fetch(`${STRAPI_API_URL}/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: {
                        name: leadForm.name,
                        email: leadForm.email,
                        phone: leadForm.phone,
                        company: leadForm.company,
                        industry: leadForm.industry,
                        jobTitle: leadForm.position,
                        message: leadForm.message,
                        category: 'Talk to our team',
                        source: 'Website Form'
                    }
                })
            });
            
            if (!res.ok) throw new Error('Failed to submit lead');
            
            setShowLeadModal(true);
            setLeadForm({ name: '', email: '', phone: '', company: '', industry: '', position: '', message: '' });
            setShowCompanyDetails(false);
        } catch (err) {
            alert(cms?.contactFormErrorMessage || 'Gagal mengirim pesan. Silakan coba lagi.');
        } finally {
            setLeadSubmitting(false);
        }
    };

    return (
        <section id="contact" className="contact-section-new scroll-fade">
            <div className="container contact-grid-new">
                {/* Left Side: Copy and Contacts Info */}
                <div className="contact-left-info">
                    <h2 dangerouslySetInnerHTML={{ __html: (cms?.contactTitle || dict.title).replace(/\n/g, '<br/>') }}></h2>
                    <p className="desc">{cms?.contactSubtitle || dict.subtitle}</p>

                    <div className="contact-methods">
                        {cms?.contactMethods && cms.contactMethods.length > 0 ? (
                            cms.contactMethods.map((method: any, idx: number) => (
                                <div className="contact-method-item" key={idx}>
                                    <div className="method-icon-box">
                                        {method.iconMedia ? (
                                            <img src={getStrapiImageUrl(method.iconMedia)} alt="contact icon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                        ) : (
                                            <i className={method.iconClass}></i>
                                        )}
                                    </div>
                                    <span>{method.value}</span>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="contact-method-item">
                                    <div className="method-icon-box">
                                        <i className="ph-bold ph-envelope-simple"></i>
                                    </div>
                                    <span>boleh@dengarkan.id</span>
                                </div>
                                <div className="contact-method-item">
                                    <div className="method-icon-box">
                                        <i className="ph-bold ph-map-pin"></i>
                                    </div>
                                    <span>Jakarta, Indonesia</span>
                                </div>
                                <div className="contact-method-item">
                                    <div className="method-icon-box">
                                        <i className="ph-bold ph-phone"></i>
                                    </div>
                                    <span>+62818-20-4646</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Side: Form Card */}
                <div className="contact-right-form">
                    <form className="contact-form-card" onSubmit={handleLeadSubmit}>
                        <div className="form-group">
                            <label htmlFor="contact-name">{cms?.contactFormName || dict.formName}</label>
                            <input 
                                type="text" id="contact-name" placeholder={cms?.contactFormName || dict.formName} required 
                                value={leadForm.name} onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-email">{cms?.contactFormEmail || dict.formEmail}</label>
                            <input 
                                type="email" id="contact-email" placeholder={cms?.contactFormEmail || dict.formEmail} required 
                                value={leadForm.email} onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-phone">{cms?.contactFormPhone || dict.formPhone}</label>
                            <input 
                                type="tel" id="contact-phone" placeholder={cms?.contactFormPhone || dict.formPhone} required 
                                value={leadForm.phone} onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-company">{cms?.contactFormCompany || "Company Name"}</label>
                            <input 
                                type="text" 
                                id="contact-company" 
                                placeholder={cms?.contactFormCompanyPlaceholder || "Enter Company Name"} 
                                required 
                                value={leadForm.company}
                                onFocus={() => setShowCompanyDetails(true)}
                                onChange={(e) => {
                                    setLeadForm({...leadForm, company: e.target.value});
                                    if (e.target.value.length > 0) setShowCompanyDetails(true);
                                }}
                            />
                        </div>
                        
                        {showCompanyDetails && (
                            <>
                                <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                                    <label htmlFor="contact-industry">{cms?.contactFormIndustry || "Industry"}</label>
                                    <input 
                                        type="text" id="contact-industry" placeholder={cms?.contactFormIndustryPlaceholder || "Enter Industry"} required 
                                        value={leadForm.industry} onChange={(e) => setLeadForm({...leadForm, industry: e.target.value})}
                                    />
                                </div>
                                <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                                    <label htmlFor="contact-position">{cms?.contactFormPosition || "Position"}</label>
                                    <input 
                                        type="text" id="contact-position" placeholder={cms?.contactFormPositionPlaceholder || "Enter Position"} required 
                                        value={leadForm.position} onChange={(e) => setLeadForm({...leadForm, position: e.target.value})}
                                    />
                                </div>
                            </>
                        )}
                        <div className="form-group">
                            <label htmlFor="contact-message">{cms?.contactFormMessage || dict.formMessage}</label>
                            <textarea 
                                id="contact-message" rows={4} placeholder={cms?.contactFormMessagePlaceholder || dict.formMessagePlaceholder} required
                                value={leadForm.message} onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                            ></textarea>
                        </div>
                        
                        <button type="submit" className="btn-send-message" disabled={leadSubmitting}>
                            {leadSubmitting ? (cms?.contactBtnSending || dict.btnSending) : <>{cms?.contactBtnSend || dict.btnSend} &nbsp;&rarr;</>}
                        </button>
                    </form>
                </div>
            </div>

            {showLeadModal && (
                <div className="modal-overlay" onClick={() => setShowLeadModal(false)} style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                        background: 'linear-gradient(145deg, #1A1A1A, #111)',
                        padding: '40px', borderRadius: '24px', textAlign: 'center',
                        maxWidth: '400px', width: '90%', border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(113, 49, 255, 0.2)',
                        animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', 
                            background: '#ffffff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px auto', fontSize: '42px',
                            boxShadow: '0 0 25px rgba(255, 255, 255, 0.15)'
                        }}>
                            <i className="ph-bold ph-check" style={{ 
                                background: 'linear-gradient(135deg, #7131FF, #00D5FF)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: 'inline-block',
                                filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))'
                            }}></i>
                        </div>
                        <h3 style={{ color: '#fff', fontSize: '24px', marginBottom: '12px' }}>{cms?.contactModalTitle || dict.modalTitle}</h3>
                        <p style={{ color: '#A0A0A0', lineHeight: 1.6, marginBottom: '24px' }}>
                            {cms?.contactModalDesc || dict.modalDesc}
                        </p>
                        <div style={{
                            background: 'rgba(113, 49, 255, 0.1)', padding: '16px', borderRadius: '12px',
                            border: '1px dashed rgba(113, 49, 255, 0.3)', marginBottom: '24px'
                        }}>
                            <p style={{ margin: 0, color: '#fff', fontWeight: 500, fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: cms?.contactModalQuote || dict.modalQuote }}></p>
                        </div>
                        <button style={{ 
                            width: '100%', padding: '14px', borderRadius: '12px', 
                            background: 'linear-gradient(135deg, #7131FF, #00D5FF)', 
                            color: '#fff', border: 'none', fontWeight: 600, fontSize: '16px',
                            cursor: 'pointer', boxSizing: 'border-box',
                            boxShadow: '0 4px 15px rgba(113, 49, 255, 0.3)'
                        }} onClick={() => setShowLeadModal(false)}>
                            {cms?.contactModalClose || dict.modalClose}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
