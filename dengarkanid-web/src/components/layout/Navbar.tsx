"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { STRAPI_API_URL, getStrapiImageUrl } from '@/utils/strapi';
import { getDictionary, Locale } from '@/dictionaries';

function GoogleOneTapHandler({ onLogin }: { onLogin: (data: any) => void }) {
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      if (credentialResponse.credential) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        onLogin(decoded);
      }
    },
    onError: () => console.error('Google One Tap Login Failed'),
  });
  return null;
}

export default function Navbar({ cms }: { cms?: any }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  
  // Extract locale from pathname (e.g. /en/about -> en)
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = (segments[0] === 'en' ? 'en' : 'id') as Locale;
  const dict = getDictionary(currentLocale);
  
  const logoUrl = cms?.logo ? getStrapiImageUrl(cms.logo) : "/logo-dengarkan-listening-tools.png";
  const finalLogoUrl = logoUrl.startsWith('http') || logoUrl.startsWith('/') ? logoUrl : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${logoUrl}`;

  // Helper to remove locale from pathname to switch language
  const getPathWithoutLocale = () => {
    if (segments[0] === 'id' || segments[0] === 'en') {
      return '/' + segments.slice(1).join('/');
    }
    return pathname;
  };
  
  const switchLanguage = (newLocale: string) => {
    const newPath = `/${newLocale}${getPathWithoutLocale()}`;
    router.push(newPath);
  };

  const isHome = pathname === `/${currentLocale}` || pathname === '/';
  const isDengarInsight = pathname.startsWith(`/${currentLocale}/artikel`) || pathname.startsWith(`/${currentLocale}/glosari`) || pathname.startsWith(`/${currentLocale}/report`);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [showOneTap, setShowOneTap] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is already logged in
    const existingLead = localStorage.getItem('dengarkan_lead');
    if (existingLead) {
      setUser(JSON.parse(existingLead));
    }
    setIsAuthChecked(true);
  }, []);

  const handleRealOneTap = async (decodedData: any) => {
    const leadData = {
      name: decodedData.name || 'Google User',
      email: decodedData.email,
      company: 'Unknown',
      jobTitle: 'Visitor',
      category: 'Automatic Login',
      source: 'Google One Tap API'
    };
    
    try {
      const response = await fetch(`${STRAPI_API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: leadData }),
      });
      if (response.ok) {
        localStorage.setItem('dengarkan_lead', JSON.stringify(leadData));
        setUser(leadData);
        setShowModal(true);
        window.dispatchEvent(new Event('auth-status-changed'));
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Fallback
      localStorage.setItem('dengarkan_lead', JSON.stringify(leadData));
      setUser(leadData);
      setShowModal(true);
      window.dispatchEvent(new Event('auth-status-changed'));
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('dengarkan_lead');
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    setShowOneTap(true);
    window.dispatchEvent(new Event('auth-status-changed'));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          <div className="logo">
            <Link href={`/${currentLocale}`}>
              <img src={finalLogoUrl} alt="dengarkan.id" className="logo-img"/>
            </Link>
          </div>

          <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link href={`/${currentLocale}`} className={isHome ? 'active' : ''}>{dict.nav?.home || 'Home'}</Link>
            <a href="#">Feature</a>
            <div className="nav-dropdown-wrapper">
              <a href="#" className={`has-dropdown ${isDengarInsight ? 'active' : ''}`} id="dropdown-toggle">
                Insight <i className="ph ph-caret-down"></i>
              </a>
              <div className="nav-dropdown-menu">
                <Link href={`/${currentLocale}/artikel`} className="dropdown-item-simple">Artikel</Link>
                <Link href={`/${currentLocale}/glosari`} className="dropdown-item-simple">Glosari</Link>
                <Link href={`/${currentLocale}/report`} className="dropdown-item-simple">Report</Link>
              </div>
            </div>
          </nav>

          <div className={`nav-auth ${isMobileMenuOpen ? 'active' : ''}`}>
            {/* Language Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#f4f4f5', padding: '4px', borderRadius: '24px' }}>
              <button 
                onClick={() => switchLanguage('id')}
                style={{ border: 'none', background: currentLocale === 'id' ? '#fff' : 'transparent', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: currentLocale === 'id' ? 600 : 500, color: currentLocale === 'id' ? '#18181b' : '#71717a', cursor: 'pointer', transition: 'all 0.2s', boxShadow: currentLocale === 'id' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
              >
                ID
              </button>
              <button 
                onClick={() => switchLanguage('en')}
                style={{ border: 'none', background: currentLocale === 'en' ? '#fff' : 'transparent', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: currentLocale === 'en' ? 600 : 500, color: currentLocale === 'en' ? '#18181b' : '#71717a', cursor: 'pointer', transition: 'all 0.2s', boxShadow: currentLocale === 'en' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
              >
                EN
              </button>
            </div>

            {user ? (
              /* ── Logged-in: dropdown button ── */
              <div className="nav-user-dropdown" ref={userMenuRef} style={{position: 'relative'}}>
                <button
                  className="btn-primary dynamic-cta-btn"
                  style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}
                  onClick={() => setShowUserMenu(prev => !prev)}
                >
                  Go to Dashboard
                  <i className={`ph ${showUserMenu ? 'ph-caret-up' : 'ph-caret-down'}`} style={{fontSize: '14px'}}></i>
                </button>

                {/* Dropdown panel */}
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: '#fff',
                    border: '1px solid #e4e4e7',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '200px',
                    zIndex: 999,
                    overflow: 'hidden',
                  }}>
                    {/* User info */}
                    <div style={{padding: '12px 16px', borderBottom: '1px solid #f0f0f0'}}>
                      <p style={{margin: 0, fontWeight: 700, fontSize: '14px'}}>{user.name}</p>
                      <p style={{margin: 0, fontSize: '12px', color: '#888'}}>{user.email}</p>
                    </div>
                    {/* Go to Dashboard link */}
                    <a
                      href="https://dengarkan.id/auth/signup"
                      style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#18181b', textDecoration: 'none', transition: 'background 0.15s'}}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8f8f8')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <i className="ph ph-squares-four" style={{fontSize: '16px', color: '#7c3aed'}}></i>
                      Go to Dashboard
                    </a>
                    {/* Divider */}
                    <div style={{height: '1px', background: '#f0f0f0', margin: '0'}}></div>
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      style={{display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left'}}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <i className="ph ph-sign-out" style={{fontSize: '16px'}}></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="https://dengarkan.id/auth/login" className="btn-secondary">Sign In</a>
                <a href="https://dengarkan.id/auth/signup" className="btn-primary dynamic-cta-btn">Start For Free</a>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle" 
            aria-label="Toggle navigation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`ph ${isMobileMenuOpen ? 'ph-x' : 'ph-list'}`}></i>
          </button>
        </div>
      </header>

      {/* Google One Tap Logic */}
      {isAuthChecked && !user && (
        <GoogleOneTapHandler onLogin={handleRealOneTap} />
      )}
      {/* Confirmation Modal */}
      <div id="confirmation-modal" className={`confirm-modal-backdrop ${showModal ? 'show' : ''}`}>
        <div className="confirm-modal-content">
          <button className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
          <div className="modal-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#ECFDF5" />
              <path d="M42.6666 23L27.9999 37.6667L21.3333 31" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="modal-title">Welcome Aboard, {user?.name || 'Google User'}!</h3>
          <p className="modal-desc">
            You've successfully signed in via Google. Your free trial is now active, and you have full access to our dashboard. Let's start transforming your conversations into actionable intelligence!
          </p>
          <div className="modal-actions">
            <button className="btn-secondary" style={{width: '100%', marginBottom: '12px'}} onClick={() => setShowModal(false)}>Explore Features First</button>
            <a href="https://dengarkan.id/auth/signup" className="btn-primary" style={{width: '100%'}} onClick={() => setShowModal(false)}>Go to Dashboard</a>
          </div>
        </div>
      </div>
    </>
  );
}
