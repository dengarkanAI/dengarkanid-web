import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STRAPI_API_URL } from "@/utils/strapi";
import StrapiMedia from "@/components/ui/StrapiMedia";
import TestimonialsSection from "@/components/TestimonialsSection";
import FeatureCarousel from '@/components/ui/FeatureCarousel';

// Import new Client Components
import ClientHeroUSP from "@/components/ui/ClientHeroUSP";
import ClientFaqSection from "@/components/ui/ClientFaqSection";
import ClientContactForm from "@/components/ui/ClientContactForm";
import ClientScrollEffects from "@/components/ui/ClientScrollEffects";
import ClientCtaButton from "@/components/ui/ClientCtaButton";

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const params = await searchParams;
  const isPreview = params?.preview === 'true';
  const draftQuery = isPreview ? '&status=draft' : '';
  const draftQueryFirst = isPreview ? '?status=draft' : '';
  const fetchOpts = isPreview ? { cache: 'no-store' as RequestCache } : { next: { revalidate: 60 } };

  let heroData = null;
  let homeData = null;
  let featuresData = [];
  let faqsData = [];
  let blogsData = [];

  try {
    const heroRes = await fetch(`${STRAPI_API_URL}/hero?populate=*${draftQuery}`, fetchOpts);
    if (heroRes.ok) heroData = (await heroRes.json()).data;

    const homeRes = await fetch(`${STRAPI_API_URL}/homepage?populate=*${draftQuery}`, fetchOpts);
    if (homeRes.ok) homeData = (await homeRes.json()).data;

    const featuresRes = await fetch(`${STRAPI_API_URL}/feature-sections?populate[carouselItems][populate]=image${draftQuery}`, fetchOpts);
    if (featuresRes.ok) featuresData = (await featuresRes.json()).data;

    const faqRes = await fetch(`${STRAPI_API_URL}/faqs${draftQueryFirst}`, fetchOpts);
    if (faqRes.ok) faqsData = (await faqRes.json()).data;

    const blogRes = await fetch(`${STRAPI_API_URL}/blogs?populate=*${draftQuery}`, fetchOpts);
    if (blogRes.ok) blogsData = (await blogRes.json()).data;
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
      const desc = heroAttrs?.description || defaultDesc;
      const gradientStyle = `background: linear-gradient(135deg, #C060FF 0%, #30C0FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; font-weight: bold;`;
      return desc.replace(/#Dengarkan/gi, `<span style="${gradientStyle}">#Dengarkan</span>`);
  };

  return (
    <main>
      <ClientScrollEffects />
      <Navbar />
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
                    <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0' }}>Transform Conversations into Actionable Intelligence.</h2>
                    <p style={{ margin: 0, color: '#666' }}>Monitor conversations across social media and digital channels with AI-powered insights.</p>
                </div>

                <div className="hero-cta">
                    <ClientCtaButton className="large" id="hero-cta-main" />
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
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'ears') || null}
            layoutType="boxed"
            sectionTag="THE EARS"
            defaultTitle={'Hear Every Conversation<br/>That Matters'}
            defaultDesc={'Track brand mentions, audience conversations, and emerging trends across digital channels as they happen.'}
            ctaButton={<ClientCtaButton />}
        />
        
        <FeatureCarousel
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'brain') || null}
            layoutType="boxed-reverse"
            sectionTag="THE BRAIN"
            defaultTitle={'Think Smarter with<br/>AI-Powered Insights'}
            defaultDesc={'Access a centralized dashboard with key metrics, sentiment, engagement, and overall brand performance.'}
            ctaButton={<ClientCtaButton />}
        />

        <FeatureCarousel
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'eyes') || null}
            layoutType="boxed"
            sectionTag="THE EYES"
            defaultTitle={'See Every Move<br/>Before It Happens'}
            defaultDesc={'Stay ahead of the competition by tracking rival brands, comparing performance, and identifying market opportunities.'}
            ctaButton={<ClientCtaButton />}
        />
        
        <FeatureCarousel
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'mouth') || null}
            layoutType="boxed-reverse"
            sectionTag="THE MOUTH"
            defaultTitle={'Speak the Language<br/>Your Audience Understands'}
            defaultDesc={'Analyze the tone and emotion behind every mention to understand how your audience truly feels about your brand.'}
            ctaButton={<ClientCtaButton />}
        />
        
        <FeatureCarousel
            sectionData={featuresData?.find((f: any) => f?.categoryIdentifier === 'shield') || null}
            layoutType="boxed"
            sectionTag="THE SHIELD"
            defaultTitle={'Guard Your Brand<br/>Reputation 24/7'}
            defaultDesc={'Explore detailed analytics with customizable reports to measure performance and support strategic decisions.'}
        />
<TestimonialsSection />
        <ClientFaqSection faqsData={faqsData} />
<section className="blog-section-new scroll-fade">
            <div className="container">
                <h2 className="text-center section-title">Our Blog</h2>

                
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
                        <p>No blogs available.</p>
                    )}
                </div>
                </div>
            </section>

            <ClientContactForm />
            
            <Footer />
        </main>
    );
}
