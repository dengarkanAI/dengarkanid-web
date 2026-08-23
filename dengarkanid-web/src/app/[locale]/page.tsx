import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STRAPI_API_URL, getGlobalSettings } from "@/utils/strapi";
import StrapiMedia from "@/components/ui/StrapiMedia";
import TestimonialsSection from "@/components/TestimonialsSection";
import FeatureCarousel from '@/components/ui/FeatureCarousel';

// Import new Client Components
import ClientHeroUSP from "@/components/ui/ClientHeroUSP";
import ClientFaqSection from "@/components/ui/ClientFaqSection";
import ClientContactForm from "@/components/ui/ClientContactForm";
import ClientScrollEffects from "@/components/ui/ClientScrollEffects";
import ClientCtaButton from "@/components/ui/ClientCtaButton";

import { getDictionary, Locale } from "@/dictionaries";

export const dynamic = 'force-dynamic';

export default async function Home({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ preview?: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const dict = getDictionary(locale);
  const resolvedSearchParams = await searchParams;
  const isPreview = resolvedSearchParams?.preview === 'true';
  const draftQuery = isPreview ? '&status=draft' : '';
  const draftQueryFirst = isPreview ? '?status=draft' : '';
  const localeQuery = `&locale=${locale}`;
  const localeQueryFirst = `?locale=${locale}`;
  const fetchOpts = (process.env.NODE_ENV === 'development' || isPreview) ? { cache: 'no-store' as RequestCache } : { next: { revalidate: 60 } };

  let heroData = null;
  let homeData = null;
  let featuresData = [];
  let faqsData = [];
  let blogsData = [];
  let globalSettings = null;

  try {
    globalSettings = await getGlobalSettings(locale);
    
    const heroRes = await fetch(`${STRAPI_API_URL}/hero?populate=*${draftQuery}${localeQuery}`, fetchOpts);
    if (heroRes.ok) heroData = (await heroRes.json()).data;
    if (!heroData) {
      const fallback = await fetch(`${STRAPI_API_URL}/hero?populate=*${draftQuery}&locale=en`, fetchOpts);
      if (fallback.ok) {
        heroData = (await fallback.json()).data;
        if (heroData) {
          heroData.attributes = { ...heroData.attributes, heroTagline: undefined, title: undefined, description: undefined, heroUSP1: undefined, heroUSP2: undefined, heroUSP3: undefined };
        }
      }
    }

    const homeRes = await fetch(`${STRAPI_API_URL}/homepage?populate=*${draftQuery}${localeQuery}`, fetchOpts);
    if (homeRes.ok) homeData = (await homeRes.json()).data;
    if (!homeData) {
      const fallback = await fetch(`${STRAPI_API_URL}/homepage?populate=*${draftQuery}&locale=en`, fetchOpts);
      if (fallback.ok) {
        homeData = (await fallback.json()).data;
        if (homeData) {
          homeData.attributes = { ...homeData.attributes, aboutUsTagline: undefined, aboutUsDescription: undefined };
        }
      }
    }

    const featuresRes = await fetch(`${STRAPI_API_URL}/feature-sections?populate[carouselItems][populate]=image${draftQuery}${localeQuery}`, fetchOpts);
    if (featuresRes.ok) featuresData = (await featuresRes.json()).data;
    if (!featuresData || featuresData.length === 0) {
      const fallback = await fetch(`${STRAPI_API_URL}/feature-sections?populate[carouselItems][populate]=image${draftQuery}&locale=en`, fetchOpts);
      if (fallback.ok) {
        featuresData = (await fallback.json()).data;
        if (featuresData) {
          featuresData = featuresData.map((f: any) => ({ ...f, tagline: undefined }));
        }
      }
    }

    const faqQuery = `?locale=${locale}&sort=documentId:asc${isPreview ? '&status=draft' : ''}`;
    const faqRes = await fetch(`${STRAPI_API_URL}/faqs${faqQuery}`, fetchOpts);
    if (faqRes.ok) faqsData = (await faqRes.json()).data;
    if (!faqsData || faqsData.length === 0) {
      const fallbackQuery = `?locale=en&sort=documentId:asc${isPreview ? '&status=draft' : ''}`;
      const fallback = await fetch(`${STRAPI_API_URL}/faqs${fallbackQuery}`, fetchOpts);
      if (fallback.ok) faqsData = (await fallback.json()).data;
    }

    const blogRes = await fetch(`${STRAPI_API_URL}/blogs?populate=*${draftQuery}${localeQuery}`, fetchOpts);
    if (blogRes.ok) blogsData = (await blogRes.json()).data;
    if (!blogsData || blogsData.length === 0) {
      const fallback = await fetch(`${STRAPI_API_URL}/blogs?populate=*${draftQuery}&locale=en`, fetchOpts);
      if (fallback.ok) blogsData = (await fallback.json()).data;
    }
  } catch (err) {
    console.error("Failed to fetch from Strapi", err);
  }

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
      const desc = attrs?.heroDescription || defaultDesc;
      const gradientStyle = `background: linear-gradient(135deg, #C060FF 0%, #30C0FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; font-weight: bold;`;
      return desc.replace(/#Dengarkan/gi, `<span style="${gradientStyle}">#Dengarkan</span>`);
  };

  return (
    <main>
      <ClientScrollEffects />
      <Navbar cms={globalSettings} />
      <section className="hero-section scroll-fade" style={{ display: 'flex', flexDirection: 'column' }}>

            <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', flex: 'none' }}>
                
                {/* TOP TEXT SECTION */}
                <div style={{ textAlign: 'center', padding: '0px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px', padding: '4px 14px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '100px', color: '#52525b' }}>
                        <i className="ph ph-medal" style={{ fontSize: '16px' }}></i>
                        {attrs?.heroTagline || "AI SOCIAL LISTENING TOOL"}
                    </div>
                    <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ClientHeroUSP usps={usps} />
                    </div>
                    <p style={{
                        maxWidth: '600px',
                        fontSize: '18px',
                        lineHeight: 1.6,
                        color: '#52525b',
                        marginTop: '12px',
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
            <div className="hero-floating-card horizontal">
                <div className="card-text">
                    <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0' }}>{heroAttrs?.title || "Transform Conversations into Actionable Intelligence."}</h2>
                    <p style={{ margin: 0, color: '#666' }}>{heroAttrs?.description || "Monitor conversations across social media and digital channels with AI-powered insights."}</p>
                </div>

                <div className="hero-cta">
                    <ClientCtaButton className="large" id="hero-cta-main" textFallback={dict.buttons?.freeTrial || "Free Trial"} textDashboard={dict.nav?.goToDashboard || "Go to Dashboard"} />
                    <a href="#" className="btn-secondary large btn-outline">{dict.buttons?.seeFeatures || "See Features"}</a>
                </div>
            </div>

        </section>
        <section className="partners-section scroll-fade">
            <div className="partners-container">
                <div className="partners-static-text">
                    {attrs?.partnerTitle || "Used by Teams Across Multiple Industries"}
                </div>
                <div className="partners-carousel-wrapper">
                    <div className="partners-logos-track" id="logo-track">
                        {(Array.isArray(attrs?.partnerLogos?.data) ? attrs.partnerLogos.data : Array.isArray(attrs?.partnerLogos) ? attrs.partnerLogos : []).length > 0 ? (
                            <>
                                {(Array.isArray(attrs?.partnerLogos?.data) ? attrs.partnerLogos.data : Array.isArray(attrs?.partnerLogos) ? attrs.partnerLogos : []).map((logo: any, idx: number) => (
                                    <div className="partner-logo-item" key={`logo-orig-${idx}`}>
                                        <StrapiMedia imageObj={logo} fallbackUrl="" alt={`Partner Logo ${idx}`} style={{ maxHeight: '40px', width: 'auto', objectFit: 'contain' }} />
                                    </div>
                                ))}
                                {/* Cloned set for seamless loop */}
                                {(Array.isArray(attrs?.partnerLogos?.data) ? attrs.partnerLogos.data : Array.isArray(attrs?.partnerLogos) ? attrs.partnerLogos : []).map((logo: any, idx: number) => (
                                    <div className="partner-logo-item" key={`logo-clone-${idx}`}>
                                        <StrapiMedia imageObj={logo} fallbackUrl="" alt={`Partner Logo ${idx}`} style={{ maxHeight: '40px', width: 'auto', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
        {/* ABOUT US SECTION (Layer 1: Background Gradient via CSS) */}
        <section id="features" className="tech-highlight-section scroll-fade">
            
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
                    {attrs?.aboutUsTagline || dict.home.aboutUsTagline}
                </div>
                <h2 className="tech-desc">
                    {attrs?.aboutUsDescription || dict.home.aboutUsDescription}
                </h2>
            </div>
        </section>

        <FeatureCarousel
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'ears') || null}
            layoutType="boxed"
            sectionTag={dict.features.earsTag}
            defaultTitle={dict.features.earsTitle}
            defaultDesc={dict.features.earsDesc}
            ctaButton={<ClientCtaButton textFallback={dict.buttons?.freeTrial} textDashboard={dict.nav?.goToDashboard} />}
        />
        
        <FeatureCarousel
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'brain') || null}
            layoutType="boxed-reverse"
            sectionTag={dict.features.brainTag}
            defaultTitle={dict.features.brainTitle}
            defaultDesc={dict.features.brainDesc}
            ctaButton={<ClientCtaButton textFallback={dict.buttons?.freeTrial} textDashboard={dict.nav?.goToDashboard} />}
        />

        <FeatureCarousel
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'eyes') || null}
            layoutType="boxed"
            sectionTag={dict.features.eyesTag}
            defaultTitle={dict.features.eyesTitle}
            defaultDesc={dict.features.eyesDesc}
            ctaButton={<ClientCtaButton textFallback={dict.buttons?.freeTrial} textDashboard={dict.nav?.goToDashboard} />}
        />
        
        <FeatureCarousel
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'mouth') || null}
            layoutType="boxed-reverse"
            sectionTag={dict.features.mouthTag}
            defaultTitle={dict.features.mouthTitle}
            defaultDesc={dict.features.mouthDesc}
            ctaButton={<ClientCtaButton textFallback={dict.buttons?.freeTrial} textDashboard={dict.nav?.goToDashboard} />}
        />
        
        <FeatureCarousel
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'shield') || null}
            layoutType="boxed"
            sectionTag={dict.features.shieldTag}
            defaultTitle={dict.features.shieldTitle}
            defaultDesc={dict.features.shieldDesc}
        />
        <TestimonialsSection locale={locale} dict={{ ...dict.testimonials, title: attrs?.testimonialTitle || dict.testimonials.title, subtitle: attrs?.testimonialDescription || dict.testimonials.subtitle }} cms={globalSettings} />
        <ClientFaqSection faqsData={faqsData} dict={dict.faq} cms={attrs} />
<section className="blog-section-new scroll-fade">
            <div className="container">
                <h2 className="text-center section-title">{dict.home.ourBlog}</h2>

                
                <div className="blog-grid-new">
                    {blogsData && blogsData.length > 0 ? (
                        blogsData.slice(0, 5).map((blog: any, index: number) => {
                            const attrs = blog.attributes || blog;
                            if (index === 0) {
                                return (
                                    <a href={`/artikel/${attrs.slug || blog.documentId || blog.id}`} className="blog-card-new horizontal" key={blog.id} style={{textDecoration: 'none', color: 'inherit'}}>
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
                                    <a href={`/artikel/${attrs.slug || blog.documentId || blog.id}`} className="blog-card-new vertical color-purple-banner" key={blog.id} style={{textDecoration: 'none', color: 'inherit'}}>
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
                                    <a href={`/artikel/${attrs.slug || blog.documentId || blog.id}`} className="blog-card-new vertical" key={blog.id} style={{textDecoration: 'none', color: 'inherit'}}>
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
                        <p>{dict.home.noBlogs}</p>
                    )}
                </div>
                </div>
            </section>

            <ClientContactForm dict={dict.contact} cms={globalSettings} />
            
            <Footer locale={locale} dict={dict.footer} cms={globalSettings} />
        </main>
    );
}
