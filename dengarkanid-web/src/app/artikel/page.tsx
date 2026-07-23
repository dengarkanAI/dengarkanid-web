"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STRAPI_API_URL, getStrapiImageUrl } from "@/utils/strapi";
import StrapiMedia from "@/components/ui/StrapiMedia";

export default function Page() {
  const [blogsData, setBlogsData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${STRAPI_API_URL}/blogs?populate=*`);
        if (res.ok) {
          const data = await res.json();
          setBlogsData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      
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
                <button className="filter-chip-new active" data-category="all">Semua Artikel</button>
                <button className="filter-chip-new" data-category="design">Desain</button>
                <button className="filter-chip-new" data-category="tech">Teknologi</button>
                <button className="filter-chip-new" data-category="business">Bisnis</button>
                <button className="filter-chip-new" data-category="insight">Insight</button>
            </div>

            {blogsData && blogsData.length > 0 && (
              (() => {
                  const featured = blogsData[0];
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
                {blogsData && blogsData.length > 1 && (
                    blogsData.slice(1).map((blog: any) => {
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

            <div className="contact-form-card" style={{marginTop: '80px', textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', padding: '48px 32px'}}>
                <h3 style={{fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px'}}>Dapatkan insight langsung ke email Anda</h3>
                <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto'}}>
                    Daftar buletin kami untuk menerima strategi bisnis digital terkurasi dan tips data analisis gratis setiap minggu.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); alert('Terima kasih telah mendaftar!'); }} style={{display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center'}}>
                    <input type="email" placeholder="Masukkan alamat email Anda" required style={{flex: '1', minWidth: '240px', padding: '14px 18px', borderRadius: '100px', border: '1px solid #E2E8F0', fontSize: '14px'}}/>
                    <button type="submit" className="btn-primary" style={{padding: '14px 28px', borderRadius: '100px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>Berlangganan &rarr;</button>
                </form>
            </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
