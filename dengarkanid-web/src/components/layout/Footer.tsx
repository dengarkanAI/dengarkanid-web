/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';

export default function Footer({ dict, cms, locale }: { dict: any, cms?: any, locale: string }) {
  const currentLocale = locale === 'en' ? 'en' : 'id';
  
  return (
<footer className="footer-new">
        <div className="footer-cta-row">
            <div className="container footer-cta-row-inner">
                <div className="footer-cta-left">
                    <h2 dangerouslySetInnerHTML={{ __html: (cms?.footerInterestedTitle || dict.interestedTitle).replace(/\n/g, '<br/>') }}></h2>
                    <a href="#" className="btn-contact-sales">{cms?.footerContactSales || dict.contactSales} &nbsp;&rarr;</a>
                </div>

                <div className="footer-cta-links">
                    <div className="footer-col">
                        <h4>{cms?.footerAddressTitle || dict.addressTitle}</h4>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6', maxWidth: '250px' }} dangerouslySetInnerHTML={{ __html: (cms?.footerAddressText || "Gedung Graha Pena Jawa Pos\nJl. Raya Kby. Lama No.12 Lt 9, RT.1/RW.1, Pulo, Kec. Kby. Baru, Kota Jakarta Selatan,\nDaerah Khusus Ibukota Jakarta 12210").replace(/\n/g, '<br/>') }}></p>
                    </div>
                    <div className="footer-col">
                        <h4>{cms?.footerContactTitle || dict.contactTitle}</h4>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <a href={`mailto:${cms?.footerEmail || "boleh@dengarkan.id"}`} style={{ color: '#888', textDecoration: 'none' }}>{cms?.footerEmail || "boleh@dengarkan.id"}</a>
                            <a href={`tel:${cms?.footerPhone || "+62818204646"}`} style={{ color: '#888', textDecoration: 'none' }}>{cms?.footerPhone || "+62818-20-4646"}</a>
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h4>{cms?.footerFollowUs || dict.followUs}</h4>
                        <div className="footer-social-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: '12px' }}>
                            {cms?.socialLinks && cms.socialLinks.length > 0 ? (
                                cms.socialLinks.map((link: any, idx: number) => (
                                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="social-circle" title={link.platformName}>
                                        {link.iconMedia?.url ? (
                                            <img src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${link.iconMedia.url}`} alt={link.platformName} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        ) : (
                                            <i className={`ph ${link.iconClass || 'ph-link'}`}></i>
                                        )}
                                    </a>
                                ))
                            ) : (
                                <>
                                    <a href={cms?.linkedinUrl || "https://www.linkedin.com/company/dengarkan"} target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-linkedin-logo"></i></a>
                                    <a href={cms?.facebookUrl || "https://web.facebook.com/profile.php?id=61591381015840"} target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-facebook-logo"></i></a>
                                    <a href={cms?.instagramUrl || "https://www.instagram.com/dengarkan__id"} target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-instagram-logo"></i></a>
                                    <a href={cms?.threadsUrl || "https://www.threads.net/@dengarkan__id"} target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-threads-logo"></i></a>
                                    <a href={cms?.twitterUrl || "https://x.com/dengarkan_id"} target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-x-logo"></i></a>
                                    <a href={cms?.tiktokUrl || "https://www.tiktok.com/@dengarkan_id"} target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-tiktok-logo"></i></a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="footer-bottom-row">
            <div className="container footer-bottom-inner-new">
                <p className="copyright-text">{cms?.footerCopyright || dict.copyright}</p>
                <div className="footer-bottom-links">
                    <Link href={`/${currentLocale}/terms-condition`}>{cms?.footerTerms || dict.terms}</Link>
                    <Link href={`/${currentLocale}/privacy-policy`}>{cms?.footerPrivacy || dict.privacy}</Link>
                </div>
            </div>
        </div>

        {/*  Large watermark background text  */}
        <div className="footer-watermark-new">
            DENGARKAN
        </div>
    </footer>
  );
}
