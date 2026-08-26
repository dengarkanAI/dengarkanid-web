import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STRAPI_API_URL, getGlobalSettings, getStrapiImageUrl, getReports, getAllReportDates } from "@/utils/strapi";
import { marked } from "marked";
import { getDictionary, Locale } from '@/dictionaries';
import Link from "next/link";

async function getReportPage(locale: string) {
  try {
    const res = await fetch(`${STRAPI_API_URL}/report-page?locale=${locale}&populate=*`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Error fetching report page:", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'id';
  const data = await getReportPage(locale);
  
  if (!data) {
    return { title: "Reports | Dengarkan.id" };
  }

  const attrs = data.attributes || data;
  return {
    title: `${attrs.title || "Reports"} | Dengarkan.id`,
    description: attrs.description || "Dengarkan.id Reports and Insights"
  };
}

export default async function ReportPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const locale = (resolvedParams.locale as Locale) || 'id';
  const dict = getDictionary(locale);
  
  // Parse Search Params
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const year = typeof resolvedSearchParams.year === 'string' ? resolvedSearchParams.year : undefined;
  const month = typeof resolvedSearchParams.month === 'string' ? resolvedSearchParams.month : undefined;

  // Fetch Data
  const [data, globalSettings, reportsData, allDatesData] = await Promise.all([
    getReportPage(locale),
    getGlobalSettings(locale),
    getReports(locale, page, 6, search, year, month),
    getAllReportDates(locale)
  ]);

  const attrs = data?.attributes || data || {};
  
  let contentHtml = "";
  if (attrs.content) {
    try {
      if (typeof attrs.content === "string") {
        contentHtml = await marked(attrs.content);
      }
    } catch (e) {
      console.error("Markdown parsing error:", e);
    }
  }

  const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
  
  // Process Archives
  const archives: Record<string, { total: number, months: Record<string, number> }> = {};
  if (allDatesData?.data) {
    allDatesData.data.forEach((item: any) => {
      const dateStr = item.attributes?.date || item.date;
      if (dateStr) {
        const d = new Date(dateStr);
        const y = d.getFullYear().toString();
        const m = (d.getMonth() + 1).toString();
        
        if (!archives[y]) archives[y] = { total: 0, months: {} };
        archives[y].total += 1;
        
        if (!archives[y].months[m]) archives[y].months[m] = 0;
        archives[y].months[m] += 1;
      }
    });
  }

  const reports = reportsData?.data || [];
  const pagination = reportsData?.meta?.pagination || { page: 1, pageCount: 1, total: 0 };

  const getMonthName = (m: string) => {
    const date = new Date(2000, parseInt(m) - 1, 1);
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long' }).format(date);
  };

  return (
    <main>
      <Navbar cms={globalSettings} />
      <section className="report-catalog-section">
        <div className="container">
          <div className="report-catalog-header">
            <h1 className="report-catalog-title">{attrs.title || "Insight Catalog"}</h1>
            {attrs.description && <p className="report-catalog-desc">{attrs.description}</p>}
            {contentHtml && <div className="mt-4" dangerouslySetInnerHTML={{ __html: contentHtml }} />}
          </div>
          
          <div className="report-catalog-layout">
            {/* SIDEBAR */}
            <div className="report-sidebar">
              <form action={`/${locale}/report`} method="GET" className="report-search-form">
                <input 
                  type="text" 
                  name="search"
                  defaultValue={search || ''}
                  placeholder="Search insights..." 
                  className="report-search-input"
                />
                <button type="submit" className="report-search-btn">
                  <i className="ph ph-magnifying-glass"></i>
                </button>
              </form>

              <div className="report-archives">
                <h3 className="report-archives-title">Archives</h3>
                
                <div>
                  {Object.keys(archives).sort((a,b) => Number(b) - Number(a)).map(y => (
                    <div key={y} className="report-archive-year-group">
                      <div className="report-archive-year-header">
                        <Link href={`/${locale}/report?year=${y}`} className={`report-archive-year-link ${year === y && !month ? 'active' : ''}`}>
                          {y}
                        </Link>
                        <span className="report-archive-count-badge">
                          {archives[y].total}
                        </span>
                      </div>
                      <ul className="report-archive-months">
                        {Object.keys(archives[y].months).sort((a,b) => Number(b) - Number(a)).map(m => (
                          <li key={m} className="report-archive-month-item">
                            <Link href={`/${locale}/report?year=${y}&month=${m}`} className={`report-archive-month-link ${year === y && month === m ? 'active' : ''}`}>
                              {getMonthName(m)}
                            </Link>
                            <span className={`report-archive-month-count ${year === y && month === m ? 'active' : ''}`}>
                              ({archives[y].months[m]})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  
                  {Object.keys(archives).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                      <i className="ph ph-folder-open" style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}></i>
                      <p style={{ fontSize: '14px' }}>No archives found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CONTENT GRID */}
            <div style={{ width: '100%' }}>
              {reports.length === 0 ? (
                <div className="report-empty-state">
                  <div className="report-empty-icon">
                    <i className="ph ph-magnifying-glass"></i>
                  </div>
                  <h3 className="report-empty-title">No Insights Found</h3>
                  <p className="report-empty-desc">We couldn't find any reports matching your criteria.</p>
                  {(search || year || month) && (
                    <Link href={`/${locale}/report`} className="report-empty-clear-btn">
                      Clear Filters
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="report-grid">
                    {reports.map((item: any) => {
                      const report = item.attributes || item;
                      const thumbUrl = getStrapiImageUrl(report.thumbnail) ? `${STRAPI_BASE}${getStrapiImageUrl(report.thumbnail)}` : '/assets/placeholder.jpg';
                      let fileUrl = '#';
                      if (report.file?.data) {
                          fileUrl = `${STRAPI_BASE}${report.file.data.attributes?.url}`;
                      } else if (report.file?.url) {
                          fileUrl = `${STRAPI_BASE}${report.file.url}`;
                      }
                      const dateObj = new Date(report.date);
                      const formattedDate = new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(dateObj);

                      return (
                        <div key={item.id} className="report-card">
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="report-card-media">
                            <img src={thumbUrl} alt={report.title} className="report-card-img" />
                            
                            <div className="report-card-date-badge">
                              <i className="ph-fill ph-calendar-blank"></i>
                              {formattedDate}
                            </div>
                            
                            <div className="report-card-download-btn">
                               <i className="ph ph-download-simple"></i>
                            </div>
                          </a>
                          
                          <div className="report-card-content">
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                              <h3 className="report-card-title">{report.title}</h3>
                            </a>
                            
                            <div className="report-card-action">
                              <span>Read Insight</span>
                              <i className="ph ph-arrow-right"></i>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* PAGINATION */}
                  {pagination.pageCount > 1 && (
                    <div className="report-pagination">
                      {pagination.page > 1 && (
                        <Link 
                          href={`/${locale}/report?page=${pagination.page - 1}${search ? `&search=${search}` : ''}${year ? `&year=${year}` : ''}${month ? `&month=${month}` : ''}`}
                          className="report-page-btn"
                        >
                          <i className="ph ph-caret-left font-bold"></i>
                        </Link>
                      )}
                      
                      {Array.from({ length: pagination.pageCount }).map((_, i) => {
                        const p = i + 1;
                        return (
                          <Link 
                            key={p}
                            href={`/${locale}/report?page=${p}${search ? `&search=${search}` : ''}${year ? `&year=${year}` : ''}${month ? `&month=${month}` : ''}`}
                            className={`report-page-btn ${p === pagination.page ? 'active' : ''}`}
                          >
                            {p}
                          </Link>
                        );
                      })}

                      {pagination.page < pagination.pageCount && (
                        <Link 
                          href={`/${locale}/report?page=${pagination.page + 1}${search ? `&search=${search}` : ''}${year ? `&year=${year}` : ''}${month ? `&month=${month}` : ''}`}
                          className="report-page-btn"
                        >
                          <i className="ph ph-caret-right font-bold"></i>
                        </Link>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer locale={locale} dict={dict.footer} cms={globalSettings} />
    </main>
  );
}
