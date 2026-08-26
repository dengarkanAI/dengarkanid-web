import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STRAPI_API_URL, getStrapiImageUrl, getGlobalSettings } from "@/utils/strapi";
import { marked } from "marked";
import { getDictionary, Locale } from '@/dictionaries';

async function getArticle(slug: string, locale: string) {
  try {
    const params = new URLSearchParams();
    if (/^\d+$/.test(slug)) {
      params.append('filters[$or][0][slug][$eq]', slug);
      params.append('filters[$or][1][id][$eq]', slug);
    } else {
      params.append('filters[slug][$eq]', slug);
    }
    params.append('populate', '*');
    params.append('locale', locale);
    
    let url = `${STRAPI_API_URL}/blogs?${params.toString()}`;

    const res = await fetch(url, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data && json.data.length > 0 ? json.data[0] : null;
  } catch (err) {
    console.error("Error fetching article:", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'id';
  const article = await getArticle(resolvedParams.slug, locale);
  
  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const attrs = article.attributes || article;
  
  const title = attrs.metaTitle || attrs.title || "Dengarkan.id Article";
  const description = attrs.metaDescription || attrs.description || "";
  
  // Try to get metaImage first, then thumbnailImage
  const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
  let imageUrl = "";
  const metaImgRaw = getStrapiImageUrl(attrs.metaImage);
  const thumbImgRaw = getStrapiImageUrl(attrs.thumbnailImage) || getStrapiImageUrl(attrs.gallery?.[0] || attrs.gallery?.data?.[0]);
  if (metaImgRaw) {
    imageUrl = `${STRAPI_BASE}${metaImgRaw}`;
  } else if (thumbImgRaw) {
    imageUrl = `${STRAPI_BASE}${thumbImgRaw}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://dengarkan.id/artikel/${resolvedParams.slug}`,
      ...(imageUrl && { images: [{ url: imageUrl }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'id';
  const dict = getDictionary(locale);
  const article = await getArticle(resolvedParams.slug, locale);
  const globalSettings = await getGlobalSettings(locale);

  if (!article) {
    notFound();
  }

  const attrs = article.attributes || article;
  let contentHtml = "";
  if (attrs.content) {
    try {
      if (typeof attrs.content === "string") {
        contentHtml = await marked(attrs.content);
      } else if (Array.isArray(attrs.content)) {
        // Handle Strapi v5 Blocks Rich Text format
        contentHtml = attrs.content.map((block: any) => {
          if (block.type === 'paragraph') {
            return `<p>${block.children?.map((c: any) => c.text || '').join('') || ''}</p>`;
          }
          if (block.type === 'heading') {
            return `<h${block.level}>${block.children?.map((c: any) => c.text || '').join('') || ''}</h${block.level}>`;
          }
          if (block.type === 'image') {
             return `<img src="${block.image?.url || ''}" alt="${block.image?.alternativeText || ''}" />`;
          }
          if (block.type === 'list') {
             const items = block.children?.map((li: any) => `<li>${li.children?.map((c:any)=>c.text || '').join('') || ''}</li>`).join('') || '';
             return block.format === 'ordered' ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
          }
          if (block.type === 'quote') {
            return `<blockquote>${block.children?.map((c: any) => c.text || '').join('') || ''}</blockquote>`;
          }
          // Fallback for unknown block types
          return `<p>${JSON.stringify(block)}</p>`;
        }).join("");
      } else {
        contentHtml = `<pre>${JSON.stringify(attrs.content, null, 2)}</pre>`;
      }
    } catch (e) {
      console.error("Markdown parsing error:", e);
      contentHtml = `<p>Error loading article content.</p>`;
    }
  }

  // Prepare images
  const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
  
  let authorImg = "/assets/headshot-3.jpg"; // Default
  const authorImgRaw = getStrapiImageUrl(attrs.authorAvatar);
  if (authorImgRaw) {
    authorImg = `${STRAPI_BASE}${authorImgRaw}`;
  }

  let heroImg = "https://placehold.co/1200x600/312e81/ffffff?text=Article+Image";
  const heroImgRaw = getStrapiImageUrl(attrs.thumbnailImage) || getStrapiImageUrl(attrs.gallery?.[0] || attrs.gallery?.data?.[0]);
  if (heroImgRaw) {
    heroImg = `${STRAPI_BASE}${heroImgRaw}`;
  }

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: attrs.title,
    description: attrs.description || attrs.metaDescription,
    image: heroImg,
    author: {
      "@type": "Person",
      name: attrs.authorName || "Dengarkan.id Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Dengarkan.id",
      logo: {
        "@type": "ImageObject",
        url: "https://dengarkan.id/logo-dengarkan-listening-tools.png"
      }
    },
    datePublished: attrs.date || attrs.createdAt,
    dateModified: attrs.updatedAt,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar cms={globalSettings} />

      {/* Article Hero Header */}
      <section className="article-hero-header" style={{ paddingTop: '130px' }}>
        <div className="article-detail-container">
          <div className="article-category">Artikel</div>
          <h1 className="article-title-main">{attrs.title}</h1>

          {/* Author info row */}
          <div className="author-info-row">
            <div className="author-info-left">
              <img src={authorImg} alt={attrs.authorName || "Author"} className="author-avatar-img" />
              <div>
                <span className="author-name-text">{attrs.authorName || "Dengarkan.id Team"}</span>
                <span className="article-meta-text">{attrs.date ? new Date(attrs.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"} &bull; 5 min read</span>
              </div>
            </div>
            <div className="author-info-right">
              <button className="action-icon-btn" id="clap-btn-top">
                <i className="ph ph-hands-clapping"></i>
                <span id="clap-count-top">0</span>
              </button>
              <button className="action-icon-btn" id="bookmark-btn-top">
                <i className="ph ph-bookmark-simple" id="bookmark-icon-top"></i>
              </button>
              <button className="action-icon-btn">
                <i className="ph ph-share-network"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Hero Image */}
      <div className="article-full-image">
        <img src={heroImg} alt={attrs.title} />
      </div>

      {/* Article Body Container */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '64px 0 80px 0' }}>
        <div className="article-detail-container">
          <article className="article-body-medium" dangerouslySetInnerHTML={{ __html: contentHtml }}></article>

          {/* Bottom Interaction Row */}
          <div className="author-info-row" style={{ marginTop: '60px', marginBottom: '0' }}>
            <div className="author-info-left">
              <button className="action-icon-btn" id="clap-btn-bottom">
                <i className="ph ph-hands-clapping"></i>
                <span id="clap-count-bottom">0</span>
              </button>
            </div>
            <div className="author-info-right">
              <button className="action-icon-btn" id="bookmark-btn-bottom">
                <i className="ph ph-bookmark-simple" id="bookmark-icon-bottom"></i>
              </button>
              <a href="https://twitter.com/dengarkan_id" target="_blank" className="action-icon-btn"><i className="ph ph-twitter-logo"></i></a>
              <a href="https://linkedin.com/company/dengarkan-id" target="_blank" className="action-icon-btn"><i className="ph ph-linkedin-logo"></i></a>
            </div>
          </div>
        </div>
      </section>

      <Footer locale={locale} dict={dict.footer} cms={globalSettings} />
    </main>
  );
}
