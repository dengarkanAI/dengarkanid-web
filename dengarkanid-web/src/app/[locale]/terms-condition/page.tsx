import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STRAPI_API_URL, getGlobalSettings } from "@/utils/strapi";
import { marked } from "marked";
import { getDictionary, Locale } from '@/dictionaries';

async function getTermsCondition(locale: string) {
  try {
    const res = await fetch(`${STRAPI_API_URL}/terms-condition?locale=${locale}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Error fetching terms:", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'id';
  const data = await getTermsCondition(locale);
  
  if (!data) {
    return { title: "Terms & Conditions | Dengarkan.id" };
  }

  const attrs = data.attributes || data;
  return {
    title: `${attrs.title || "Terms & Conditions"} | Dengarkan.id`,
  };
}

export default async function TermsConditionPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'id';
  const dict = getDictionary(locale);
  const data = await getTermsCondition(locale);
  const globalSettings = await getGlobalSettings(locale);

  if (!data) {
    notFound();
  }

  const attrs = data.attributes || data;
  let contentHtml = "";
  if (attrs.content) {
    try {
      if (typeof attrs.content === "string") {
        // Replace single or multiple newlines with double newlines to force separate paragraphs in Markdown
        const spacedContent = attrs.content.replace(/\n+/g, '\n\n');
        contentHtml = await marked.parse(spacedContent);
      } else if (Array.isArray(attrs.content)) {
        contentHtml = attrs.content.map((block: any) => {
          if (block.type === 'paragraph') return `<p>${block.children?.map((c: any) => c.text || '').join('') || ''}</p>`;
          if (block.type === 'heading') return `<h${block.level}>${block.children?.map((c: any) => c.text || '').join('') || ''}</h${block.level}>`;
          if (block.type === 'list') {
             const items = block.children?.map((li: any) => `<li>${li.children?.map((c:any)=>c.text || '').join('') || ''}</li>`).join('') || '';
             return block.format === 'ordered' ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
          }
          return `<p>${JSON.stringify(block)}</p>`;
        }).join("");
      }
    } catch (e) {
      console.error("Markdown parsing error:", e);
    }
  }

  return (
    <main>
      <Navbar cms={globalSettings} />
      <section className="legal-doc-section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div className="legal-doc-header">
            <h1 className="legal-doc-title">{attrs.title || "Terms & Conditions"}</h1>
            <div className="legal-doc-divider"></div>
          </div>
          <div className="legal-doc-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </section>
      <Footer locale={locale} dict={dict.footer} cms={globalSettings} />
    </main>
  );
}
