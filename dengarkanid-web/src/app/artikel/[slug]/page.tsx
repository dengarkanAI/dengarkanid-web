/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Page() {
  return (
    <main>
      <Navbar />


    {/*  Article Hero Header  */}
    <section className="article-hero-header" style={{paddingTop: '130px'}}>
        <div className="article-detail-container">
            <div className="article-category">Desain</div>
            <h1 className="article-title-main">Step by step to conduct usability testing</h1>
            
            {/*  Author info row (Medium style)  */}
            <div className="author-info-row">
                <div className="author-info-left">
                    <img src="assets/headshot-3.jpg" alt="Andrea William" className="author-avatar-img"/>
                    <div>
                        <span className="author-name-text">Andrea William</span>
                        <span className="article-meta-text">May 21, 2026 &bull; 6 min read</span>
                    </div>
                </div>
                <div className="author-info-right">
                    <button className="action-icon-btn" id="clap-btn-top">
                        <i className="ph ph-hands-clapping"></i>
                        <span id="clap-count-top">24</span>
                    </button>
                    <button className="action-icon-btn" id="bookmark-btn-top">
                        <i className="ph ph-bookmark-simple" id="bookmark-icon-top"></i>
                    </button>
                    <button className="action-icon-btn" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Tautan artikel berhasil disalin!'); }}>
                        <i className="ph ph-share-network"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>

    {/*  Main Hero Image (Large, Medium-style container)  */}
    <div className="article-full-image">
        <img src="https://placehold.co/1200x600/312e81/ffffff?text=Usability+Testing+Session" alt="Usability Testing Session"/>
        <div className="article-image-caption">Gambar 1: Sesi pengujian kegunaan bersama responden pengguna untuk memvalidasi alur antarmuka baru.</div>
    </div>

    {/*  Article Body Container  */}
    <section style={{backgroundColor: '#FFFFFF', paddingBottom: '80px'}}>
        <div className="article-detail-container">
            <div className="article-body-medium">
                <p>
                    Usability testing (pengujian kegunaan) adalah langkah krusial dalam siklus pengembangan produk digital. Tanpa melakukan pengujian langsung dengan pengguna nyata, kita seringkali membangun asumsi palsu mengenai bagaimana orang berinteraksi dengan antarmuka yang kita buat.
                </p>
                <p>
                    Dalam panduan ini, kita akan membahas alur langkah-demi-langkah yang terstruktur untuk mempersiapkan, melaksanakan, dan mengevaluasi sesi usability testing yang sukses dan menghasilkan data riset yang dapat langsung ditindaklanjuti.
                </p>

                <h2>1. Menentukan Tujuan Riset yang Jelas</h2>
                <p>
                    Sebelum Anda mengundang partisipan, Anda harus tahu persis apa yang ingin Anda validasi. Apakah Anda ingin menguji efisiensi alur pendaftaran baru? Ataukah Anda ingin melihat apakah pengguna dapat menemukan fitur pencarian dengan mudah?
                </p>
                <p>
                    Tujuan yang terdefinisi dengan baik akan membantu Anda menyusun skenario tugas (*tasks*) yang fokus dan menghindari bias selama pengujian.
                </p>

                <div className="blockquote-medium">
                    "Desain yang baik adalah desain yang tidak membutuhkan penjelasan. Usability testing membantu Anda menemukan di bagian mana desain Anda masih perlu menjelaskan dirinya sendiri."
                </div>

                <h2>2. Menyusun Skenario Tugas (Scenario and Tasks)</h2>
                <p>
                    Saat melakukan pengujian, jangan langsung menyuruh pengguna untuk mengklik tombol tertentu. Alih-alih berkata *"Klik tombol keranjang"*, berikan mereka skenario kontekstual seperti:
                </p>
                <p style={{fontStyle: 'italic', paddingLeft: '16px', borderLeft: '2px solid #E2E8F0', color: '#475569'}}>
                    "Bayangkan Anda sedang mencari kado ulang tahun untuk teman Anda, dan Anda ingin membeli teh melati seharga Rp50.000. Tunjukkan bagaimana Anda akan menyelesaikan proses pembelian produk tersebut sampai halaman pembayaran."
                </p>

                <h2>3. Memilih Partisipan yang Tepat</h2>
                <p>
                    Partisipan yang Anda pilih harus mewakili target audiens produk Anda. Untuk tes kegunaan kualitatif umum, melakukan pengujian dengan **5 hingga 8 partisipan** biasanya sudah cukup untuk mengungkap lebih dari 85% masalah kegunaan utama pada sistem Anda.
                </p>

                <h3>Mengapa hanya 5 partisipan?</h3>
                <p>
                    Riset legendaris dari Jakob Nielsen menunjukkan bahwa penambahan partisipan setelah orang ke-5 memberikan hasil temuan masalah yang cenderung berulang (*diminishing returns*). Fokuslah pada kedalaman observasi perilaku, bukan sekadar jumlah angka.
                </p>
            </div>
            
            {/*  Bottom Interaction Row  */}
            <div className="author-info-row" style={{marginTop: '60px', marginBottom: '0'}}>
                <div className="author-info-left">
                    <button className="action-icon-btn" id="clap-btn-bottom">
                        <i className="ph ph-hands-clapping"></i>
                        <span id="clap-count-bottom">24</span>
                    </button>
                </div>
                <div className="author-info-right">
                    <button className="action-icon-btn" id="bookmark-btn-bottom">
                        <i className="ph ph-bookmark-simple" id="bookmark-icon-bottom"></i>
                    </button>
                    <a href="https://twitter.com" target="_blank" className="action-icon-btn"><i className="ph ph-twitter-logo"></i></a>
                    <a href="https://linkedin.com" target="_blank" className="action-icon-btn"><i className="ph ph-linkedin-logo"></i></a>
                </div>
            </div>
        </div>
    </section>

    {/*  Recommended Articles Footer Section  */}
    <section className="article-detail-footer">
        <div className="container">
            <h3 className="recommended-title">Baca Artikel DengarInsight Lainnya</h3>
            
            <div className="recommended-grid">
                {/*  Card 1  */}
                <div className="blog-card-new vertical" style={{cursor: 'pointer', background: '#FFFFFF'}} onClick={() => window.location.href="/artikel/demo"}>
                    <div className="card-img-top">
                        <img src="https://placehold.co/400x300/1e1b4b/ffffff?text=Minimal+Workspace" alt="Minimal Workspace"/>
                    </div>
                    <div className="card-content-bottom">
                        <span style={{fontSize: '11px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', marginBottom: '6px', display: 'block'}}>Desain</span>
                        <h3>Minimal workspace for inspirations</h3>
                        <span className="author-inline">Lilian James &bull; May 18, 2026</span>
                    </div>
                </div>

                {/*  Card 2  */}
                <div className="blog-card-new vertical" style={{cursor: 'pointer', background: '#FFFFFF'}} onClick={() => window.location.href="/artikel/demo"}>
                    <div className="card-img-top">
                        <img src="https://placehold.co/400x300/0f172a/ffffff?text=Developer+Coding" alt="Designer Coding"/>
                    </div>
                    <div className="card-content-bottom">
                        <span style={{fontSize: '11px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', marginBottom: '6px', display: 'block'}}>Teknologi</span>
                        <h3>Should UI designers learn how to code?</h3>
                        <span className="author-inline">Sandra Bullock &bull; Apr 28, 2026</span>
                    </div>
                </div>

                {/*  Card 3  */}
                <div className="blog-card-new vertical" style={{cursor: 'pointer', background: '#FFFFFF'}} onClick={() => window.location.href="/artikel/demo"}>
                    <div className="card-img-top">
                        <img src="https://placehold.co/400x300/581c87/ffffff?text=Social+Listening" alt="Social Listening"/>
                    </div>
                    <div className="card-content-bottom">
                        <span style={{fontSize: '11px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', marginBottom: '6px', display: 'block'}}>Insight</span>
                        <h3>How social listening turns brand conversations into strategy</h3>
                        <span className="author-inline">Andrea William &bull; Apr 20, 2026</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  Footer  */}
    
      <Footer />
    </main>
  );
}
