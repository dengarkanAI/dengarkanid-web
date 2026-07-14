"use client";
import { useState, useEffect } from "react";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STRAPI_API_URL, getStrapiImageUrl } from "@/utils/strapi";
import StrapiMedia from "@/components/ui/StrapiMedia";
import TestimonialsSection from "@/components/TestimonialsSection";
import FeatureCarousel from '@/components/ui/FeatureCarousel';

export const dynamic = 'force-dynamic';

export default function Home() {

  const [heroData, setHeroData] = useState<any>(null);
  const [homeData, setHomeData] = useState<any>(null);
  const [featuresData, setFeaturesData] = useState<any[]>([]);
  const [faqsData, setFaqsData] = useState<any[]>([]);
  const [blogsData, setBlogsData] = useState<any[]>([]);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [currentUspIndex, setCurrentUspIndex] = useState(0);
  const [parallaxPos, setParallaxPos] = useState({ x: 0, y: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    try {
      const companyVal = leadForm.industry ? `${leadForm.company} (${leadForm.industry})` : leadForm.company;
      const jobTitleVal = leadForm.phone ? `${leadForm.position} - Ph: ${leadForm.phone}` : leadForm.position;
      const sourceVal = leadForm.message ? `Talk to our team - Message: ${leadForm.message}` : 'Talk to our team';
      
      const res = await fetch(`${STRAPI_API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: leadForm.name,
            email: leadForm.email,
            company: companyVal,
            jobTitle: jobTitleVal,
            source: sourceVal
          }
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit lead');
      
      setShowLeadModal(true);
      setLeadForm({ name: '', email: '', phone: '', company: '', industry: '', position: '', message: '' });
      setShowCompanyDetails(false);
    } catch (err) {
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  // Check login state from sessionStorage (set by admin login page) OR localStorage (set by One Tap)
  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem('jwt');
      const lead = localStorage.getItem('dengarkan_lead');
      setIsLoggedIn(!!token || !!lead);
    };

    checkAuth();

    // Listen for custom event from Navbar when login state changes
    window.addEventListener('auth-status-changed', checkAuth);
    return () => window.removeEventListener('auth-status-changed', checkAuth);
  }, []);

  // Helper: render the correct CTA button depending on login state
  const CtaButton = ({ className }: { className?: string }) => {
    const finalClassName = `btn-primary dynamic-cta-btn ${className || ''}`.trim();
    if (isLoggedIn) {
      return <a href="/admin/leads" className={finalClassName} id="cta-btn">Go to Dashboard</a>;
    }
    return <a href="https://app.dengarkan.id/signup" className={finalClassName} id="cta-btn">Free Trial</a>;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 40; // Max 20px movement
    const y = (clientY / window.innerHeight - 0.5) * 40;
    setParallaxPos({ x, y });
  };

  // Adding the vanilla JS logic inside a useEffect hook

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentUspIndex(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchStrapiContent() {
      try {
        const fetchOpts = { headers: {} };
        const heroRes = await fetch(`${STRAPI_API_URL}/hero?populate=*`, fetchOpts);
        if (heroRes.ok) setHeroData((await heroRes.json()).data);

        const homeRes = await fetch(`${STRAPI_API_URL}/homepage?populate=*`, fetchOpts);
        if (homeRes.ok) setHomeData((await homeRes.json()).data);

        const featuresRes = await fetch(`${STRAPI_API_URL}/features?populate=*`, fetchOpts);
        if (featuresRes.ok) setFeaturesData((await featuresRes.json()).data);

        const faqRes = await fetch(`${STRAPI_API_URL}/faqs`, fetchOpts);
        if (faqRes.ok) setFaqsData((await faqRes.json()).data);

        const blogRes = await fetch(`${STRAPI_API_URL}/blogs?populate=*`, fetchOpts);
        if (blogRes.ok) setBlogsData((await blogRes.json()).data);
      } catch (err) {
        console.error("Failed to fetch from Strapi", err);
      }
    }
    fetchStrapiContent();
  }, []);

  useEffect(() => {
    // FAQ Toggle
    const faqQuestions = document.querySelectorAll('.faq-question-new');
    faqQuestions.forEach(question => {
        // Remove existing listeners to prevent duplicates in strict mode
        const clone = question.cloneNode(true);
        if (question.parentNode) {
            question.parentNode.replaceChild(clone, question);
        }
        
        clone.addEventListener('click', () => {
            const answer = (clone as HTMLElement).nextElementSibling as HTMLElement;
            const icon = (clone as HTMLElement).querySelector('.faq-toggle-icon') as HTMLElement;
            if (!answer || !icon) return;

            const isOpen = answer.style.display === 'block';

            document.querySelectorAll('.faq-answer-new').forEach(a => (a as HTMLElement).style.display = 'none');
            document.querySelectorAll('.faq-toggle-icon').forEach(i => i.textContent = '+');
            document.querySelectorAll('.faq-question-new').forEach(q => q.classList.remove('active'));

            if (!isOpen) {
                answer.style.display = 'block';
                icon.textContent = '-';
                (clone as HTMLElement).classList.add('active');
            }
        });
    });

    // Sticky Navbar & Scroll Progress
    const handleScroll = () => {
        const navbar = document.querySelector('.navbar-new') as HTMLElement;
        const progress = document.querySelector('.scroll-progress-bar') as HTMLElement;
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        if (progress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progress.style.width = scrolled + "%";
        }
    };
    window.addEventListener('scroll', handleScroll);

    // Scroll Fade Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));

    // Logo Carousel Interval
    const track = document.getElementById('logo-track');
    let logoInterval: ReturnType<typeof setInterval>;
    if (track && track.children.length > 0) {
        const totalItems = track.children.length;
        const halfItems = totalItems / 2;
        let currentIndex = 0;

        logoInterval = setInterval(() => {
            currentIndex++;

            // Smooth slide to the next item
            track.style.transition = 'transform 0.8s ease-in-out';

            // Calculate step width dynamically based on first item + gap
            const firstItem = track.children[0] as HTMLElement;
            const itemWidth = firstItem.getBoundingClientRect().width;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap || style.columnGap || '0');
            const stepSize = itemWidth + gap;

            track.style.transform = `translateX(-${currentIndex * stepSize}px)`;

            // Seamless loop: if we scroll past the first set, reset back to 0 without transition
            if (currentIndex >= halfItems) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 0;
                    track.style.transform = 'translateX(0)';
                }, 800); // 800ms matches the transition duration
            }
        }, 4000); // 4 seconds interval
    }

    return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
        if (logoInterval) clearInterval(logoInterval);
    };
  }, []);

  const attrs = homeData?.attributes || homeData;
  const heroAttrs = heroData?.attributes || heroData;
  const usps = [
      attrs?.heroUSP1 || "Discover Customer Insights.",
      attrs?.heroUSP2 || "Analyze Trends Faster.",
      attrs?.heroUSP3 || "Monitor Brand Health."
  ];

  // Helper to highlight #Dengarkan with gradient
  const renderDescription = () => {
      const defaultDesc = `Understand what people are saying, how they feel, and what matters most. #Dengarkan helps you track market sentiment, discover trends, and gain real-time insights from billions of conversations.`;
      const desc = heroAttrs?.description || defaultDesc;
      const gradientStyle = `background: linear-gradient(135deg, #C060FF 0%, #30C0FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; font-weight: bold;`;
      return desc.replace(/#Dengarkan/gi, `<span style="${gradientStyle}">#Dengarkan</span>`);
  };

  return (
    <main>
      <Navbar />
      <section className="hero-section scroll-fade" style={{ paddingTop: '40px', display: 'flex', flexDirection: 'column' }}>

            <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', flex: 'none' }}>
                
                {/* TOP TEXT SECTION */}
                <div style={{ textAlign: 'center', padding: '10px 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '24px', padding: '4px 14px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '100px', color: '#52525b' }}>
                        <i className="ph ph-medal" style={{ fontSize: '16px' }}></i>
                        {attrs?.heroTagline || "AI SOCIAL LISTENING TOOL"}
                    </div>
                    <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h1 
                            style={{ 
                                fontSize: '44px', /* Reduced from 3.5rem (56px) for elegance */
                                margin: 0, 
                                lineHeight: 1.2, 
                                letterSpacing: '-0.02em', /* Tighter tracking for large text */
                                animation: 'fadeIn 0.5s ease-in-out',
                                fontWeight: 600, /* Reduced from 700 to match the sleek aesthetic */
                                maxWidth: '800px'
                            }} 
                            key={currentUspIndex}
                        >
                            {usps[currentUspIndex]}
                        </h1>
                    </div>
                    <p style={{
                        maxWidth: '600px',
                        fontSize: '18px',
                        lineHeight: 1.6,
                        color: '#52525b',
                        marginTop: '20px',
                        textAlign: 'center',
                        animation: 'fadeIn 0.8s ease-in-out'
                    }} dangerouslySetInnerHTML={{ __html: renderDescription() }}>
                    </p>
                </div>


            </div>

            {/* MEDIA FROM CMS */}
            <div className="hero-mockup-wrapper" style={{ background: 'transparent', width: '100%', maxWidth: '1440px', margin: '0 auto', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div className="dashboard-mockup" style={{ width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden', borderRadius: '24px' }}>
                    {attrs?.heroMedia && (
                        <StrapiMedia 
                            imageObj={attrs?.heroMedia} 
                            fallbackUrl="" 
                            alt="Dashboard Media" 
                            className="mockup-image" 
                            style={{ width: '100%', height: 'auto', display: 'block', border: 'none', outline: 'none', boxShadow: 'none', transform: 'scale(1.02)' }} 
                        />
                    )}
                </div>
            </div>

            {/* Floating Card */}
            <div className="hero-floating-card horizontal" style={{ maxWidth: '1200px', width: 'calc(100% - 40px)', zIndex: 10 }}>
                <div className="card-text" style={{ textAlign: 'left' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0' }}>Transform Conversations into Actionable Intelligence.</h2>
                    <p style={{ margin: 0, color: '#666' }}>Monitor conversations across social media and digital channels with AI-powered insights.</p>
                </div>

                <div className="hero-cta" style={{ display: 'flex', alignItems: 'center' }}>
                    {isLoggedIn
                        ? <a href="/admin/leads" className="btn-primary large" id="hero-cta-main">Go to Dashboard</a>
                        : <a href="https://app.dengarkan.id/signup" className="btn-primary large" id="hero-cta-main">Sign Up Free</a>
                    }
                    <a href="#" className="btn-secondary large btn-outline">See Features</a>
                </div>
            </div>

        </section>
<section className="partners-section scroll-fade">
            <div className="partners-container">
                <div className="partners-static-text">
                    Used by Teams Across Multiple Industries
                </div>
                <div className="partners-carousel-wrapper">
                    <div className="partners-logos-track" id="logo-track">
                        {/*  Logo item 1  */}
                        <div className="partner-logo-item">
                            <div className="logo-dengarkan">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 2C9.52285 2 14 6.47715 14 12C14 17.5228 9.52285 22 4 22V2Z" />
                                </svg>
                                <span>dengarkan.id</span>
                            </div>
                        </div>
                        {/*  Logo item 2  */}
                        <div className="partner-logo-item">
                            <div className="logo-bitjara">
                                BITJ<span>▲</span>RA.ID
                            </div>
                        </div>
                        {/*  Logo item 3  */}
                        <div className="partner-logo-item">
                            <div className="logo-dengarkan">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 2C9.52285 2 14 6.47715 14 12C14 17.5228 9.52285 22 4 22V2Z" />
                                </svg>
                                <span>dengarkan.id</span>
                            </div>
                        </div>
                        {/*  Logo item 4  */}
                        <div className="partner-logo-item">
                            <div className="logo-bitjara">
                                BITJ<span>▲</span>RA.ID
                            </div>
                        </div>
                        {/*  Logo item 5  */}
                        <div className="partner-logo-item">
                            <div className="logo-dengarkan">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 2C9.52285 2 14 6.47715 14 12C14 17.5228 9.52285 22 4 22V2Z" />
                                </svg>
                                <span>dengarkan.id</span>
                            </div>
                        </div>
                        {/*  Logo item 6  */}
                        <div className="partner-logo-item">
                            <div className="logo-bitjara">
                                BITJ<span>▲</span>RA.ID
                            </div>
                        </div>

                        {/*  Cloned set for seamless loop  */}
                        <div className="partner-logo-item">
                            <div className="logo-dengarkan">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 2C9.52285 2 14 6.47715 14 12C14 17.5228 9.52285 22 4 22V2Z" />
                                </svg>
                                <span>dengarkan.id</span>
                            </div>
                        </div>
                        <div className="partner-logo-item">
                            <div className="logo-bitjara">
                                BITJ<span>▲</span>RA.ID
                            </div>
                        </div>
                        <div className="partner-logo-item">
                            <div className="logo-dengarkan">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 2C9.52285 2 14 6.47715 14 12C14 17.5228 9.52285 22 4 22V2Z" />
                                </svg>
                                <span>dengarkan.id</span>
                            </div>
                        </div>
                        <div className="partner-logo-item">
                            <div className="logo-bitjara">
                                BITJ<span>▲</span>RA.ID
                            </div>
                        </div>
                        <div className="partner-logo-item">
                            <div className="logo-dengarkan">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 2C9.52285 2 14 6.47715 14 12C14 17.5228 9.52285 22 4 22V2Z" />
                                </svg>
                                <span>dengarkan.id</span>
                            </div>
                        </div>
                        <div className="partner-logo-item">
                            <div className="logo-bitjara">
                                BITJ<span>▲</span>RA.ID
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* ABOUT US SECTION (Layer 1: Background Gradient via CSS) */}
        <section className="tech-highlight-section scroll-fade">
            
            {/* Eterna-style Background Ambient Glows */}
            <div className="tech-bg-purple-glow"></div>
            <div className="tech-bg-gold-glow"></div>

            {/* Premium Halo System Wrapper */}
            <div className="tech-glow-ring-wrapper">
                {/* Layer 2: Massive blurred eclipse glow behind the circle */}
                <div className="tech-eclipse-glow-behind"></div>

                {/* Layer 3: The clean, sharp outline circle */}
                <div className="tech-eclipse-circle-front"></div>

                {/* Cahaya Gerhana Berputar (Orbiting Comet Arcs with separate rotors) */}
                <div className="tech-comet-sharp-rotor">
                    <div className="tech-comet-sharp"></div>
                    {/* The small moving circle (diamond flare) at the head of the comet */}
                    <div className="tech-eclipse-diamond"></div>
                </div>
                <div className="tech-comet-glow-rotor">
                    <div className="tech-comet-glow"></div>
                </div>
            </div>

            {/* Layer 7: Light film grain or noise texture */}
            <div className="tech-layer-7-grain"></div>

            {/* Layer 6: Very subtle floating particles */}
            <div className="tech-layer-6-particles">
                <div className="tech-particle" style={{ width: '6px', height: '6px', top: '20%', left: '30%', animationDelay: '0s' }}></div>
                <div className="tech-particle" style={{ width: '4px', height: '4px', top: '70%', left: '60%', animationDelay: '2s' }}></div>
                <div className="tech-particle" style={{ width: '8px', height: '8px', top: '40%', left: '80%', animationDelay: '5s' }}></div>
                <div className="tech-particle" style={{ width: '3px', height: '3px', top: '80%', left: '20%', animationDelay: '7s' }}></div>
            </div>
            <div className="tech-particle" style={{ width: '5px', height: '5px', top: '10%', left: '70%', animationDelay: '3s' }}></div>

            <div className="container tech-text-container" style={{ position: 'relative', zIndex: 10 }}>
                <div className="tech-tagline">
                    {attrs?.aboutUsTagline || "Dengarkan Yang tak Terucapkan"}
                </div>
                <h2 className="tech-desc">
                    {attrs?.aboutUsDescription || "Data tanpa konteks budaya hanyalah tumpukan angka. Kami memberi Anda kebenaran yang jujur, untuk #DengarkanDulu"}
                </h2>
            </div>
        </section>

        <FeatureCarousel
            features={featuresData?.filter((f: any) => f?.attributes?.category === 'ears') || []}
            layoutType="full"
            sectionTag="THE EARS"
            defaultTitle={'Hear Every Conversation<br/>That Matters'}
            defaultDesc={'Track brand mentions, audience conversations, and emerging trends across digital channels as they happen.'}
            ctaButton={<CtaButton />}
        />
        
        <FeatureCarousel
            features={featuresData?.filter((f: any) => f?.attributes?.category === 'brain') || []}
            layoutType="boxed"
            sectionTag="THE BRAIN"
            defaultTitle={'Think Smarter with<br/>AI-Powered Insights'}
            defaultDesc={'Access a centralized dashboard with key metrics, sentiment, engagement, and overall brand performance.'}
            ctaButton={<CtaButton />}
        />
        
        <FeatureCarousel
            features={featuresData?.filter((f: any) => f?.attributes?.category === 'shield') || []}
            layoutType="full"
            sectionTag="THE SHIELD"
            defaultTitle={'Guard Your Brand<br/>Reputation 24/7'}
            defaultDesc={'Explore detailed analytics with customizable reports to measure performance and support strategic decisions.'}
        />
        
        <FeatureCarousel
            features={featuresData?.filter((f: any) => f?.attributes?.category === 'mouth') || []}
            layoutType="boxed-reverse"
            sectionTag="THE MOUTH"
            defaultTitle={'Speak the Language<br/>Your Audience Understands'}
            defaultDesc={'Analyze the tone and emotion behind every mention to understand how your audience truly feels about your brand.'}
            ctaButton={<CtaButton />}
        />
        
        <FeatureCarousel
            features={featuresData?.filter((f: any) => f?.attributes?.category === 'eyes') || []}
            layoutType="full"
            sectionTag="THE EYES"
            defaultTitle={'See Every Move<br/>Before It Happens'}
            defaultDesc={'Stay ahead of the competition by tracking rival brands, comparing performance, and identifying market opportunities.'}
            ctaButton={<CtaButton />}
        />
<TestimonialsSection />
<section className="faq-section-new scroll-fade">
            <div className="container">
                <div className="faq-card-box">
                    <div className="faq-header text-center">
                        <div className="faq-work-tag justify-center" style={{display: 'flex', justifyContent: 'center'}}>
                            <span className="bullet"></span> Our FAQs
                        </div>
                        <h2>FAQ
                        </h2>
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
                            <div className={`faq-item-new ${index === 0 ? 'active' : ''}`} key={faq.id}>
                                <div className="faq-question-new">
                                    <h3 dangerouslySetInnerHTML={{ __html: faq.question || faq.attributes?.question }}></h3>
                                    <span className="faq-toggle-icon">{index === 0 ? '-' : '+'}</span>
                                </div>
                                <div className="faq-answer-new" style={{ display: index === 0 ? 'block' : 'none' }}>
                                    <p dangerouslySetInnerHTML={{ __html: faq.answer || faq.attributes?.answer || faq.attributes?.content }}></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                        {/*  Active Item  */}
                        <div className="faq-item-new active">
                            <div className="faq-question-new">
                                <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h3>
                                <span className="faq-toggle-icon">-</span>
                            </div>
                            <div className="faq-answer-new">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur.</p>
                            </div>
                        </div>

                        {/*  Closed Item 1  */}
                        <div className="faq-item-new">
                            <div className="faq-question-new">
                                <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h3>
                                <span className="faq-toggle-icon">+</span>
                            </div>
                            <div className="faq-answer-new" style={{display: 'none'}}>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </div>
                        </div>

                        {/*  Closed Item 2  */}
                        <div className="faq-item-new">
                            <div className="faq-question-new">
                                <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h3>
                                <span className="faq-toggle-icon">+</span>
                            </div>
                            <div className="faq-answer-new" style={{display: 'none'}}>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </div>
                        </div>
                        </>
                    )}
                    </div>
                </div>
            </div>
        </section>
<section className="blog-section-new scroll-fade">
            <div className="container">
                <h2 className="text-center section-title">Our Blog</h2>

                
                <div className="blog-grid-new">
                    {blogsData && blogsData.length > 0 ? (
                        blogsData.slice(0, 5).map((blog: any, index: number) => {
                            const attrs = blog.attributes || blog;
                            if (index === 0) {
                                return (
                                    <a href={`/artikel/${blog.id}`} className="blog-card-new horizontal" key={blog.id} style={{textDecoration: 'none', color: 'inherit'}}>
                                        <div className="card-img-side">
                                            <StrapiMedia imageObj={attrs.thumbnailImage} fallbackUrl="https://placehold.co/400x400/ffffff/dddddd?text=No+Image" alt={attrs.title} />
                                        </div>
                                        <div className="card-content-side">
                                            <h3>{attrs.title}</h3>
                                            <p className="desc">{attrs.description}</p>
                                            <div className="author-row">
                                                <StrapiMedia imageObj={attrs.authorAvatar} fallbackUrl="/assets/headshot-3.jpg" alt={attrs.authorName} className="author-avatar" />
                                                <div className="author-meta">
                                                    <span className="author-name">{attrs.authorName}</span>
                                                    <span className="author-date">{attrs.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            } else if (index === 1) {
                                return (
                                    <a href={`/artikel/${blog.id}`} className="blog-card-new vertical color-purple-banner" key={blog.id} style={{textDecoration: 'none', color: 'inherit'}}>
                                        <div className="card-img-top">
                                            <StrapiMedia imageObj={attrs.thumbnailImage} fallbackUrl="https://placehold.co/400x300/ffffff/dddddd?text=No+Image" alt={attrs.title} />
                                        </div>
                                        <div className="card-content-bottom">
                                            <h3>{attrs.title}</h3>
                                            <span className="author-inline">{attrs.authorName} &bull; {attrs.date}</span>
                                        </div>
                                    </a>
                                );
                            } else {
                                return (
                                    <a href={`/artikel/${blog.id}`} className="blog-card-new vertical" key={blog.id} style={{textDecoration: 'none', color: 'inherit'}}>
                                        <div className="card-img-top">
                                            <StrapiMedia imageObj={attrs.thumbnailImage} fallbackUrl="https://placehold.co/400x300/ffffff/dddddd?text=No+Image" alt={attrs.title} />
                                        </div>
                                        <div className="card-content-bottom">
                                            <h3>{attrs.title}</h3>
                                            <span className="author-inline">{attrs.authorName} &bull; {attrs.date}</span>
                                        </div>
                                    </a>
                                );
                            }
                        })
                    ) : (
                        <p>No blogs available.</p>
                    )}
                </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section id="contact" className="contact-section-new scroll-fade">
                <div className="container contact-grid-new">
                    {/* Left Side: Copy and Contacts Info */}
                    <div className="contact-left-info">
                        <h2>Talk to our<br/>support team</h2>
                        <p className="desc">Feel free to reach out for help with your order or any questions you may have
                            regarding your purchase.</p>

                        <div className="contact-methods">
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
                                <span>+62 899-9004-646</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form Card */}
                    <div className="contact-right-form">
                        <form className="contact-form-card" onSubmit={handleLeadSubmit}>
                            <div className="form-group">
                                <label htmlFor="contact-name">Full Name</label>
                                <input 
                                    type="text" id="contact-name" placeholder="Enter Full Name" required 
                                    value={leadForm.name} onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-email">Email Address</label>
                                <input 
                                    type="email" id="contact-email" placeholder="Enter Email Address" required 
                                    value={leadForm.email} onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-phone">Phone Number</label>
                                <input 
                                    type="tel" id="contact-phone" placeholder="Enter Phone Number" required 
                                    value={leadForm.phone} onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-company">Company Name</label>
                                <input 
                                    type="text" 
                                    id="contact-company" 
                                    placeholder="Enter Company Name" 
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
                                        <label htmlFor="contact-industry">Industry</label>
                                        <input 
                                            type="text" id="contact-industry" placeholder="Enter Industry" required 
                                            value={leadForm.industry} onChange={(e) => setLeadForm({...leadForm, industry: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                                        <label htmlFor="contact-position">Position</label>
                                        <input 
                                            type="text" id="contact-position" placeholder="Enter Position" required 
                                            value={leadForm.position} onChange={(e) => setLeadForm({...leadForm, position: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label htmlFor="contact-message">Message</label>
                                <textarea 
                                    id="contact-message" rows={4} placeholder="Write Your Message Here" required
                                    value={leadForm.message} onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                                ></textarea>
                            </div>
                            
                            <button type="submit" className="btn-send-message" disabled={leadSubmitting}>
                                {leadSubmitting ? 'Sending...' : <>Send Message &nbsp;&rarr;</>}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
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
                        <h3 style={{ color: '#fff', fontSize: '24px', marginBottom: '12px' }}>Terima Kasih!</h3>
                        <p style={{ color: '#A0A0A0', lineHeight: 1.6, marginBottom: '24px' }}>
                            Data Anda telah berhasil kami terima. Tim kami akan segera merespons Anda.
                        </p>
                        <div style={{
                            background: 'rgba(113, 49, 255, 0.1)', padding: '16px', borderRadius: '12px',
                            border: '1px dashed rgba(113, 49, 255, 0.3)', marginBottom: '24px'
                        }}>
                            <p style={{ margin: 0, color: '#fff', fontWeight: 500, fontStyle: 'italic' }}>
                                "Kami akan <strong style={{color: '#00D5FF'}}>#dengarkan</strong> kebutuhanmu"
                            </p>
                        </div>
                        <button style={{ 
                            width: '100%', padding: '14px', borderRadius: '12px', 
                            background: 'linear-gradient(135deg, #7131FF, #00D5FF)', 
                            color: '#fff', border: 'none', fontWeight: 600, fontSize: '16px',
                            cursor: 'pointer', boxSizing: 'border-box',
                            boxShadow: '0 4px 15px rgba(113, 49, 255, 0.3)'
                        }} onClick={() => setShowLeadModal(false)}>
                            Tutup
                        </button>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
            
            <Footer />
        </main>
    );
}
