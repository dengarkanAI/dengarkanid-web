/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
<footer className="footer-new">
        <div className="footer-cta-row">
            <div className="container footer-cta-row-inner">
                <div className="footer-cta-left">
                    <h2>Are You Interested<br/>With Dengarkan?</h2>
                    <a href="#" className="btn-contact-sales">Contact Sales &nbsp;&rarr;</a>
                </div>

                <div className="footer-cta-links">
                    <div className="footer-col">
                        <h4>Address</h4>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6', maxWidth: '250px' }}>
                            Gedung Graha Pena Jawa Pos<br/>
                            Jl. Raya Kby. Lama No.12 Lt 9, RT.1/RW.1, Pulo, Kec. Kby. Baru, Kota Jakarta Selatan,<br/>
                            Daerah Khusus Ibukota Jakarta 12210
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
                            <a href="mailto:boleh@dengarkan.id" style={{ color: '#888', textDecoration: 'none' }}>boleh@dengarkan.id</a>
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h4>Follow Us</h4>
                        <div className="footer-social-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: '12px' }}>
                            <a href="https://www.linkedin.com/company/dengarkan" target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-linkedin-logo"></i></a>
                            <a href="https://web.facebook.com/profile.php?id=61591381015840" target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-facebook-logo"></i></a>
                            <a href="https://www.instagram.com/dengarkan__id" target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-instagram-logo"></i></a>
                            <a href="https://www.threads.net/@dengarkan__id" target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-threads-logo"></i></a>
                            <a href="https://x.com/dengarkan_id" target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-x-logo"></i></a>
                            <a href="https://www.tiktok.com/@dengarkan_id" target="_blank" rel="noopener noreferrer" className="social-circle"><i className="ph ph-tiktok-logo"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="footer-bottom-row">
            <div className="container footer-bottom-inner-new">
                <p className="copyright-text">&copy; Dengarkan all rights reserved</p>
                <div className="footer-bottom-links">
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Privacy Policy</a>
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
