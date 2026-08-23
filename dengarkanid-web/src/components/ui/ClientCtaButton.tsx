'use client';

import React, { useState, useEffect } from 'react';

interface ClientCtaButtonProps {
    className?: string;
    id?: string;
    textFallback?: string;
    textDashboard?: string;
}

export default function ClientCtaButton({ className, id = 'cta-btn', textFallback = 'Free Trial', textDashboard = 'Go to Dashboard' }: ClientCtaButtonProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkAuth = () => {
            const token = sessionStorage.getItem('jwt');
            const lead = localStorage.getItem('dengarkan_lead');
            setIsLoggedIn(!!token || !!lead);
        };

        checkAuth();

        window.addEventListener('auth-status-changed', checkAuth);
        return () => window.removeEventListener('auth-status-changed', checkAuth);
    }, []);

    // SSR fallback to prevent hydration mismatch
    if (!mounted) {
        return <a href="https://app.dengarkan.id/signup" className={`btn-primary dynamic-cta-btn ${className || ''}`.trim()} id={id}>{textFallback}</a>;
    }

    const finalClassName = `btn-primary dynamic-cta-btn ${className || ''}`.trim();
    if (isLoggedIn) {
        return <a href="/admin/leads" className={finalClassName} id={id}>{textDashboard}</a>;
    }
    return <a href="https://app.dengarkan.id/signup" className={finalClassName} id={id}>{textFallback}</a>;
}
