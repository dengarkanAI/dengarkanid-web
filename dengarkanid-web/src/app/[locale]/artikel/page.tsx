"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STRAPI_API_URL, getStrapiImageUrl } from "@/utils/strapi";
import StrapiMedia from "@/components/ui/StrapiMedia";
import { useParams } from 'next/navigation';
import { getDictionary, Locale } from '@/dictionaries';

export default function Page() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'id';
  const dict = getDictionary(locale);
  const [blogsData, setBlogsData] = useState<any[]>([]);
  const [globalSettings, setGlobalSettings] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const [res, globalRes] = await Promise.all([
          fetch(`${STRAPI_API_URL}/blogs?locale=${locale}&populate=*`),
          fetch(`${STRAPI_API_URL}/global-setting?locale=${locale}`)
        ]);
        if (res.ok) {
          const data = await res.json();
          setBlogsData(data.data);
        }
        if (globalRes.ok) {
          const globalJson = await globalRes.json();
          setGlobalSettings(globalJson.data?.attributes || globalJson.data);
        }
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar cms={globalSettings} />
      
<section className="glosari-hero" style={{padding: '140px 24px 60px'}}>
        <div className="glosari-hero-inner">
            <div className="glosari-eyebrow"><span className="dot"></span> Our Insights</div>
            <h1>DengarInsight <span className="highlight">Articles</span></h1>
            <p>Temukan panduan praktis, riset pasar terbaru, dan analisis mendalam untuk memahami pelanggan Anda lebih baik.</p>
        </div>
    </section>
      <main style={{paddingBottom: '80px'}}>
        <div className="container">
            {/*  Category Filters  */}
            <div className="filter-container-new">
                <button className={`filter-chip-new ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>{dict.categories?.allArticles || "Semua Artikel"}</button>
                <button className={`filter-chip-new ${activeCategory === 'design' ? 'active' : ''}`} onClick={() => setActiveCategory('design')}>{dict.categories?.design || "Desain"}</button>
                <button className={`filter-chip-new ${activeCategory === 'tech' ? 'active' : ''}`} onClick={() => setActiveCategory('tech')}>{dict.categories?.tech || "Teknologi"}</button>
                <button className={`filter-chip-new ${activeCategory === 'business' ? 'active' : ''}`} onClick={() => setActiveCategory('business')}>{dict.categories?.business || "Bisnis"}</button>
                <button className={`filter-chip-new ${activeCategory === 'insight' ? 'active' : ''}`} onClick={() => setActiveCategory('insight')}>{dict.categories?.insight || "Insight"}</button>
            </div>

            {(() => {
                const filteredBlogs = activeCategory === 'all' 
                  ? blogsData 
                  : blogsData.filter((b: any) => {
                      const attrs = b.attributes || b;
                      // the enum values are 'Desain', 'Teknologi', 'Bisnis', 'Insight'
                      const catMap: any = {
                          'design': 'desain',
                          'tech': 'teknologi',
                          'business': 'bisnis',
                          'insight': 'insight'
                      };
                      const mappedCategory = catMap[activeCategory] || activeCategory;
                      const actualCategory = attrs.category || 'Insight';
                      return actualCategory.toLowerCase() === mappedCategory;
                    });
                
                if (!filteredBlogs || filteredBlogs.length === 0) {
                    return (
                        <div style={{textAlign: 'center', padding: '60px 20px'}}>
                            <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px'}}>Belum ada artikel</h3>
                            <p style={{color: 'var(--text-muted)'}}>Cek artikel secara berkala untuk update terbaru.</p>
                        </div>
                    );
                }

                return (
                    <>

            {filteredBlogs.length > 0 && (
              (() => {
                  const featured = filteredBlogs[0];
                  const attrs = featured.attributes || featured;
                  return (
                      <a href={`/artikel/${attrs.slug || featured.documentId || featured.id}`} className="featured-article-card" data-category={attrs.category?.toLowerCase() || 'insight'}>
                          <div className="featured-img-side">
                              <StrapiMedia imageObj={attrs.thumbnailImage} fallbackUrl="https://placehold.co/800x600/312e81/ffffff?text=No+Image" alt={attrs.title} />
                          </div>
                          <div className="featured-content-side">
                              <span className="category-tag">{attrs.category || 'Insight'}</span>
                              <h2>{attrs.title}</h2>
                              <p>{attrs.description}</p>
                              <div className="author-row" style={{marginTop: 'auto'}}>
                                  <div className="author-meta">
                                      <span className="author-name">{attrs.authorName || 'Author'}</span>
                                      <span className="author-date">{attrs.date || 'Terbaru'}</span>
                                  </div>
                              </div>
                          </div>
                      </a>
                  )
              })()
            )}

            <div className="blog-grid-new" id="articles-grid">
                {filteredBlogs.length > 1 && (
                    filteredBlogs.slice(1).map((blog: any) => {
                        const attrs = blog.attributes || blog;
                        return (
                            <div key={blog.id} className="blog-card-new vertical" data-category={attrs.category?.toLowerCase() || 'insight'} style={{cursor: 'pointer'}} onClick={() => window.location.href=`/artikel/${attrs.slug || blog.documentId || blog.id}`}>
                                <div className="card-img-top">
                                    <StrapiMedia imageObj={attrs.thumbnailImage} fallbackUrl="https://placehold.co/400x300/1e1b4b/ffffff?text=No+Image" alt={attrs.title} />
                                </div>
                                <div className="card-content-bottom">
                                    <span style={{fontSize: '11px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', marginBottom: '6px', display: 'block'}}>{attrs.category || 'Insight'}</span>
                                    <h3>{attrs.title}</h3>
                                    <span className="author-inline">{attrs.authorName || 'Author'} &bull; {attrs.date || 'Terbaru'}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            </>
            );
            })()}

            <div className="contact-form-card" style={{marginTop: '80px', textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', padding: '48px 32px'}}>
                <h3 style={{fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px'}}>Dapatkan insight langsung ke email Anda</h3>
                <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto'}}>
                    Daftar buletin kami untuk menerima strategi bisnis digital terkurasi dan tips data analisis gratis setiap minggu.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); alert('Terima kasih telah mendaftar!'); }} style={{display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center'}}>
                    <input type="email" placeholder="Masukkan alamat email Anda" required style={{flex: '1', minWidth: '240px', padding: '14px 18px', borderRadius: '100px', border: '1px solid #E2E8F0', fontSize: '14px'}}/>
                    <button type="submit" className="btn-primary" style={{padding: '14px 28px', borderRadius: '100px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>{dict.buttons?.subscribe || "Berlangganan"} &rarr;</button>
                </form>
            </div>
        </div>
      </main>

      <Footer locale={locale} dict={dict.footer} cms={globalSettings} />
    </>
  );
}
