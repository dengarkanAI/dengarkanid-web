import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STRAPI_API_URL, getStrapiImageUrl } from "@/utils/strapi";
import { marked } from "marked";

async function getArticle(slug: string) {
  try {
    const params = new URLSearchParams();
    if (/^\d+$/.test(slug)) {
      params.append('filters[$or][0][slug][$eq]', slug);
      params.append('filters[$or][1][id][$eq]', slug);
    } else {
      params.append('filters[slug][$eq]', slug);
    }
    params.append('populate', '*');
    
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const attrs = article.attributes || article;
  
  const title = attrs.metaTitle || attrs.title || "Dengarkan.id Article";
  const description = attrs.metaDescription || attrs.description || "";
  
  // Try to get metaImage first, then thumbnailImage
  let imageUrl = "";
  if (attrs.metaImage?.data?.attributes?.url) {
    imageUrl = getStrapiImageUrl(attrs.metaImage.data.attributes.url);
  } else if (attrs.thumbnailImage?.data?.attributes?.url) {
    imageUrl = getStrapiImageUrl(attrs.thumbnailImage.data.attributes.url);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://dengarkan.id/artikel/${params.slug}`,
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

export default async function Page({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const attrs = article.attributes || article;
  const contentHtml = attrs.content ? await marked(attrs.content) : "";

  // Prepare images
  let authorImg = "assets/headshot-3.jpg"; // Default
  if (attrs.authorAvatar?.data?.attributes?.url) {
    authorImg = getStrapiImageUrl(attrs.authorAvatar.data.attributes.url);
  }

  let heroImg = "https://placehold.co/1200x600/312e81/ffffff?text=Article+Image";
  if (attrs.thumbnailImage?.data?.attributes?.url) {
    heroImg = getStrapiImageUrl(attrs.thumbnailImage.data.attributes.url);
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
      <Navbar />

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
              <button className="action-icon-btn" onClick={() => { /* Client side copying needs to be moved to a client component if we want onClick to work, since this is a server component we can't use onClick directly. But for SEO purpose, we will keep it simple and clean. Removing onClick for Server Component compatibility. */ }}>
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
      <section style={{ backgroundColor: '#FFFFFF', paddingBottom: '80px' }}>
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

      <Footer />
    </main>
  );
}
