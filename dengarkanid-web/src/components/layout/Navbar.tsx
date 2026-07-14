"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    } else {
      // Simulate Google One Tap showing up after 2 seconds
      const timer = setTimeout(() => {
        setShowOneTap(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptOneTap = async () => {
    const leadData = {
      name: 'Manis',
      email: 'manis@dengarkan.id',
      company: 'Dengarkan ID',
      jobTitle: 'Founder',
      category: 'Automatic Login',
      source: 'Google One Tap Simulator'
    };
    
    // Simulate API call
    try {
      const response = await fetch('http://localhost:1337/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: leadData }),
      });
      if (response.ok) {
        localStorage.setItem('dengarkan_lead', JSON.stringify(leadData));
        setUser(leadData);
        setShowOneTap(false);
        setShowModal(true);
        window.dispatchEvent(new Event('auth-status-changed'));
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Fallback for demo purposes
      localStorage.setItem('dengarkan_lead', JSON.stringify(leadData));
      setUser(leadData);
      setShowOneTap(false);
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
            <Link href="/">
              <img src="/logo-dengarkan-listening-tools.png" alt="dengarkan.id" className="logo-img"/>
            </Link>
          </div>

          <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link href="/" className="active">Home</Link>
            <a href="#">Feature</a>
            <div className="nav-dropdown-wrapper">
              <a href="#" className="has-dropdown" id="dropdown-toggle">
                DengarInsight <i className="ph ph-caret-down"></i>
              </a>
              <div className="nav-dropdown-menu">
                <Link href="/artikel" className="dropdown-item-simple">Artikel</Link>
                <Link href="/glosari" className="dropdown-item-simple">Glosari</Link>
              </div>
            </div>
          </nav>

          <div className={`nav-auth ${isMobileMenuOpen ? 'active' : ''}`}>
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

      {/* Google One Tap Simulator Prompt */}
      <div id="google-one-tap" className={`google-one-tap-mockup ${showOneTap ? 'show' : ''}`}>
        <div className="onetap-header">
          <div className="onetap-logo">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.56 2.69-3.86 2.69-6.6z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26a5.6 5.6 0 0 1-8.77-2.98H.24v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.28 10.56A5.4 5.4 0 0 1 3 9c0-.54.1-1.07.28-1.56V5.11H.24A9 9 0 0 0 0 9c0 1.41.33 2.74.9 3.89l2.38-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4A9 9 0 0 0 .24 5.11l2.38 2.33A5.6 5.6 0 0 1 9 3.58z" />
            </svg>
            <span className="onetap-title">Sign in to dengarkan.id with Google</span>
          </div>
          <button className="onetap-close" onClick={() => setShowOneTap(false)}>&times;</button>
        </div>
        <div className="onetap-profile">
          <img src="/assets/headshot-2.jpg" alt="User profile" className="onetap-avatar"/>
          <div className="onetap-info">
            <span className="onetap-name">Manis</span>
            <span className="onetap-email">manis@dengarkan.id</span>
          </div>
        </div>
        <button className="onetap-btn" onClick={handleAcceptOneTap}>Lanjutkan sebagai Manis</button>
        <div className="onetap-footer">
          Untuk melanjutkan, Google akan membagikan nama, alamat email, dan foto profil Anda dengan dengarkan.id.
        </div>
      </div>

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
          <h3 className="modal-title">Welcome Aboard, Manis!</h3>
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
